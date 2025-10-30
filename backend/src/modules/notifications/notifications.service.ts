import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailAdapter } from './providers/email.adapter';
import { SmsAdapter } from './providers/sms.adapter';

export type NotificationChannel = 'inapp' | 'email' | 'sms' | 'whatsapp';

export type NotificationType =
  | 'ORDER_PAID'
  | 'ORDER_SHIPPED'
  | 'ORDER_OUT_FOR_DELIVERY'
  | 'ORDER_DELIVERED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  | 'PAYOUT_RELEASED'
  | 'RISK_ALERT'
  | 'NEW_REVIEW';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private email: EmailAdapter,
    private sms: SmsAdapter,
  ) {}

  /**
   * Create a notification and optionally send via external channels
   * Respects user preferences for channels and quiet hours
   */
  async create(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: any,
    channels: NotificationChannel[] = ['inapp'],
  ) {
    try {
      // Fetch user preferences
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          phone: true,
          timezone: true,
          notifyEmail: true,
          notifySms: true,
          notifyPush: true,
          quietHoursStart: true,
          quietHoursEnd: true,
          pushSubscription: true,
        },
      });

      if (!user) {
        this.logger.warn(`User ${userId} not found for notification`);
        return null;
      }

      // Create in-app notification (always)
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type,
          title,
          body,
          data: data || undefined,
        },
      });

      this.logger.log(
        `Created notification ${notification.id} for user ${userId}: ${title}`,
      );

      // Check quiet hours
      const inQuietHours = this.isInQuietHours(
        user.timezone || 'Africa/Lagos',
        user.quietHoursStart,
        user.quietHoursEnd,
      );

      // Send via external channels (fire and forget)
      const promises: Promise<any>[] = [];

      // Email notifications
      if (
        channels.includes('email') &&
        user.notifyEmail &&
        user.email &&
        !inQuietHours
      ) {
        promises.push(this.email.send(user.email, title, body, data));
      }

      // SMS notifications
      if (
        channels.includes('sms') &&
        user.notifySms &&
        user.phone &&
        !inQuietHours
      ) {
        promises.push(this.sms.send(user.phone, body));
      }

      // WhatsApp notifications
      if (
        channels.includes('whatsapp') &&
        user.notifySms &&
        user.phone &&
        !inQuietHours
      ) {
        promises.push(this.sms.sendWhatsApp(user.phone, body));
      }

      // Don't await - send async
      if (promises.length > 0) {
        Promise.all(promises).catch((err) => {
          this.logger.error(
            `Failed to send external notifications: ${err.message}`,
          );
        });
      }

      return notification;
    } catch (error) {
      this.logger.error(
        `Failed to create notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * List notifications for a user
   */
  async list(userId: string, limit = 20, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Security: ensure user owns the notification
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  /**
   * Delete a notification
   */
  async delete(userId: string, notificationId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId, // Security: ensure user owns the notification
      },
    });
  }

  // ===================================================================
  // Helper methods for common notification scenarios
  // ===================================================================

  /**
   * Notify buyer that their order payment was successful
   */
  async notifyOrderPaid(buyerId: string, orderId: string, orderTotal: number, currency: string) {
    return this.create(
      buyerId,
      'ORDER_PAID',
      'Payment Received',
      `Your payment of ${currency} ${orderTotal.toFixed(2)} was successful. Order #${orderId} is now being prepared.`,
      { orderId },
      ['inapp', 'email'],
    );
  }

  /**
   * Notify seller of a new paid order
   */
  async notifySellerNewOrder(
    sellerId: string,
    orderId: string,
    orderItemId: string,
    productTitle: string,
    quantity: number,
  ) {
    return this.create(
      sellerId,
      'ORDER_PAID',
      'New Paid Order',
      `You have a new order: ${productTitle} x${quantity}. Please prepare for shipment.`,
      { orderId, orderItemId },
      ['inapp', 'email'],
    );
  }

  /**
   * Notify buyer of shipment update
   */
  async notifyShipmentUpdate(
    buyerId: string,
    orderItemId: string,
    status: 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED',
    trackingCode?: string,
    carrier?: string,
  ) {
    const statusMessages = {
      SHIPPED: `Your order has been shipped${trackingCode ? ` via ${carrier} (${trackingCode})` : ''}.`,
      OUT_FOR_DELIVERY: 'Your order is out for delivery and will arrive soon!',
      DELIVERED: 'Your order has been delivered. Enjoy!',
    };

    const type =
      status === 'DELIVERED'
        ? 'ORDER_DELIVERED'
        : status === 'OUT_FOR_DELIVERY'
          ? 'ORDER_OUT_FOR_DELIVERY'
          : 'ORDER_SHIPPED';

    return this.create(
      buyerId,
      type,
      `Order ${status === 'DELIVERED' ? 'Delivered' : status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Shipped'}`,
      statusMessages[status],
      { orderItemId, trackingCode, carrier },
      status === 'DELIVERED' ? ['inapp', 'email'] : ['inapp', 'sms'],
    );
  }

  /**
   * Notify seller of new dispute
   */
  async notifyDisputeOpened(
    sellerId: string,
    disputeId: string,
    orderItemId: string,
    productTitle: string,
    reason: string,
  ) {
    return this.create(
      sellerId,
      'DISPUTE_OPENED',
      'New Dispute',
      `A buyer opened a dispute on "${productTitle}" (Reason: ${reason}). Please respond within 48 hours.`,
      { disputeId, orderItemId },
      ['inapp', 'email'],
    );
  }

  /**
   * Notify buyer of dispute resolution
   */
  async notifyDisputeResolved(
    buyerId: string,
    disputeId: string,
    resolution: string,
    resolutionNote?: string,
  ) {
    return this.create(
      buyerId,
      'DISPUTE_RESOLVED',
      'Dispute Resolved',
      `Your dispute has been resolved: ${resolution}. ${resolutionNote || ''}`,
      { disputeId },
      ['inapp', 'email'],
    );
  }

  /**
   * Notify seller of payout release
   */
  async notifyPayoutReleased(
    sellerId: string,
    amount: number,
    currency: string,
    batchId: string,
    itemCount: number,
  ) {
    return this.create(
      sellerId,
      'PAYOUT_RELEASED',
      'Payout Released',
      `Your payout of ${currency} ${amount.toFixed(2)} for ${itemCount} orders has been processed and sent.`,
      { batchId, amount, currency },
      ['inapp', 'email'],
    );
  }

  /**
   * Notify admin of risk alert
   */
  async notifyAdminRiskAlert(
    adminId: string,
    alertType: string,
    message: string,
    data?: any,
  ) {
    return this.create(
      adminId,
      'RISK_ALERT',
      `Risk Alert: ${alertType}`,
      message,
      data,
      ['inapp', 'email'],
    );
  }

  /**
   * Notify seller of new review
   */
  async notifyNewReview(
    sellerId: string,
    reviewId: string,
    productTitle: string,
    rating: number,
    buyerName: string,
  ) {
    return this.create(
      sellerId,
      'NEW_REVIEW',
      'New Review',
      `${buyerName} left a ${rating}★ review on "${productTitle}".`,
      { reviewId },
      ['inapp'],
    );
  }

  /**
   * Check if current time is within user's quiet hours
   */
  private isInQuietHours(
    timezone: string,
    quietHoursStart: number | null,
    quietHoursEnd: number | null,
  ): boolean {
    if (quietHoursStart === null || quietHoursEnd === null) {
      return false; // No quiet hours configured
    }

    try {
      // Get current hour in user's timezone
      const now = new Date();
      const hourLocal = parseInt(
        now.toLocaleString('en-US', {
          hour: '2-digit',
          hour12: false,
          timeZone: timezone,
        }),
        10,
      );

      // Handle quiet hours that span midnight
      if (quietHoursStart <= quietHoursEnd) {
        // Normal range (e.g., 22:00 to 8:00 same day is invalid, but 8:00 to 22:00 is valid)
        return hourLocal >= quietHoursStart && hourLocal < quietHoursEnd;
      } else {
        // Wraps past midnight (e.g., 22:00 to 8:00 next day)
        return hourLocal >= quietHoursStart || hourLocal < quietHoursEnd;
      }
    } catch (error) {
      this.logger.error(
        `Failed to check quiet hours: ${error.message}`,
        error.stack,
      );
      return false; // Don't block notifications on error
    }
  }
}
