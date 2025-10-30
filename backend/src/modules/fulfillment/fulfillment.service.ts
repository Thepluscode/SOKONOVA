import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * FulfillmentService
 *
 * Manages order fulfillment and shipping tracking per line item.
 *
 * Key Features:
 * - Buyer order tracking with shipping timeline
 * - Seller fulfillment queue management
 * - Mark items as shipped with tracking info
 * - Mark items as delivered with proof
 * - Per-item fulfillment status (supports multi-seller orders)
 */
@Injectable()
export class FulfillmentService {
  private readonly logger = new Logger(FulfillmentService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /**
   * Get order tracking information for a buyer
   *
   * Returns complete shipping timeline for all items in an order.
   * Verifies buyer owns the order before returning data.
   *
   * @param orderId - The order ID
   * @param userId - The buyer's user ID
   */
  async getOrderTracking(orderId: string, userId: string) {
    // Verify order belongs to this user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                imageUrl: true,
                sellerId: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found or access denied');
    }

    return {
      orderId: order.id,
      status: order.status,
      createdAt: order.createdAt,
      shippingAddress: order.shippingAdr,
      items: order.items.map((it) => ({
        orderItemId: it.id,
        productTitle: it.product.title,
        productImage: it.product.imageUrl,
        qty: it.qty,
        price: it.price.toString(),

        // Fulfillment timeline
        fulfillmentStatus: it.fulfillmentStatus,
        trackingCode: it.trackingCode,
        carrier: it.carrier,
        shippedAt: it.shippedAt,
        deliveredAt: it.deliveredAt,
        deliveryProofUrl: it.deliveryProofUrl,
        notes: it.notes,
      })),
    };
  }

  /**
   * Get seller's open fulfillment queue
   *
   * Returns all items that need shipping or are in transit.
   * Used by sellers to manage their fulfillment workflow.
   *
   * @param sellerId - The seller's user ID
   */
  async getSellerOpenFulfillment(sellerId: string) {
    const pending = await this.prisma.orderItem.findMany({
      where: {
        sellerId,
        fulfillmentStatus: { in: ['PACKED', 'SHIPPED'] },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        orderId: true,
        qty: true,
        price: true,
        fulfillmentStatus: true,
        trackingCode: true,
        carrier: true,
        shippedAt: true,
        deliveredAt: true,
        deliveryProofUrl: true,
        notes: true,
        createdAt: true,
        product: {
          select: {
            title: true,
            imageUrl: true,
          },
        },
        order: {
          select: {
            id: true,
            status: true,
            shippingAdr: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return pending.map((it) => ({
      id: it.id,
      orderId: it.orderId,
      qty: it.qty,
      price: it.price.toString(),
      fulfillmentStatus: it.fulfillmentStatus,
      trackingCode: it.trackingCode,
      carrier: it.carrier,
      shippedAt: it.shippedAt,
      deliveredAt: it.deliveredAt,
      deliveryProofUrl: it.deliveryProofUrl,
      notes: it.notes,
      createdAt: it.createdAt,
      product: it.product,
      order: {
        id: it.order.id,
        status: it.order.status,
        shippingAddress: it.order.shippingAdr,
        buyerName: it.order.user.name,
        buyerEmail: it.order.user.email,
      },
    }));
  }

  /**
   * Mark item as shipped
   *
   * Updates fulfillment status to SHIPPED and records tracking information.
   * Verifies seller owns the item before updating.
   *
   * @param orderItemId - The order item ID
   * @param sellerId - The seller's user ID
   * @param carrier - Shipping carrier (optional)
   * @param trackingCode - Tracking number (optional)
   * @param note - Note to buyer (optional)
   */
  async markShipped(
    orderItemId: string,
    sellerId: string,
    carrier?: string,
    trackingCode?: string,
    note?: string,
  ) {
    // Verify ownership
    const row = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { sellerId: true, fulfillmentStatus: true },
    });

    if (!row) {
      throw new NotFoundException('Order item not found');
    }

    if (row.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update this item');
    }

    const now = new Date();
    const updatedItem = await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        fulfillmentStatus: 'SHIPPED',
        carrier,
        trackingCode,
        notes: note,
        shippedAt: now,
        updatedAt: now,
      },
      include: {
        order: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Notify buyer: item shipped
    try {
      await this.notifications.notifyShipmentUpdate(
        updatedItem.order.userId,
        updatedItem.id,
        'SHIPPED',
        trackingCode,
        carrier,
      );
    } catch (error) {
      this.logger.error(`Failed to send shipment notification: ${error.message}`);
    }

    return updatedItem;
  }

  /**
   * Mark item as delivered
   *
   * Updates fulfillment status to DELIVERED and records proof.
   * Verifies seller owns the item before updating.
   *
   * In production, you may want to require buyer confirmation
   * or integrate with carrier delivery webhooks.
   *
   * @param orderItemId - The order item ID
   * @param sellerId - The seller's user ID
   * @param proofUrl - Delivery proof URL (optional)
   * @param note - Delivery note (optional)
   */
  async markDelivered(
    orderItemId: string,
    sellerId: string,
    proofUrl?: string,
    note?: string,
  ) {
    // Verify ownership
    const row = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { sellerId: true, fulfillmentStatus: true },
    });

    if (!row) {
      throw new NotFoundException('Order item not found');
    }

    if (row.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update this item');
    }

    const now = new Date();
    const updatedItem = await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        fulfillmentStatus: 'DELIVERED',
        deliveredAt: now,
        deliveryProofUrl: proofUrl,
        notes: note,
        updatedAt: now,
      },
      include: {
        order: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Notify buyer: item delivered
    try {
      await this.notifications.notifyShipmentUpdate(
        updatedItem.order.userId,
        updatedItem.id,
        'DELIVERED',
      );
    } catch (error) {
      this.logger.error(`Failed to send delivery notification: ${error.message}`);
    }

    return updatedItem;
  }

  /**
   * Mark item as having an issue
   *
   * Updates fulfillment status to ISSUE for dispute resolution.
   * Can be called by seller or admin.
   *
   * @param orderItemId - The order item ID
   * @param sellerId - The seller's user ID
   * @param note - Issue description
   */
  async markIssue(
    orderItemId: string,
    sellerId: string,
    note: string,
  ) {
    // Verify ownership
    const row = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { sellerId: true },
    });

    if (!row) {
      throw new NotFoundException('Order item not found');
    }

    if (row.sellerId !== sellerId) {
      throw new ForbiddenException('Not authorized to update this item');
    }

    return this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        fulfillmentStatus: 'ISSUE',
        notes: note,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get seller's fulfillment statistics
   *
   * Returns counts for each fulfillment status.
   * Useful for seller dashboard metrics.
   *
   * @param sellerId - The seller's user ID
   */
  async getSellerStats(sellerId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { sellerId },
      select: { fulfillmentStatus: true },
    });

    const stats = {
      PACKED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      ISSUE: 0,
      total: items.length,
    };

    items.forEach((it) => {
      stats[it.fulfillmentStatus] = (stats[it.fulfillmentStatus] || 0) + 1;
    });

    return stats;
  }
}
