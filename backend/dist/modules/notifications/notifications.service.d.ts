import { PrismaService } from '../prisma.service';
import { EmailAdapter } from './providers/email.adapter';
import { SmsAdapter } from './providers/sms.adapter';
export type NotificationChannel = 'inapp' | 'email' | 'sms' | 'whatsapp';
export type NotificationType = 'ORDER_PAID' | 'ORDER_SHIPPED' | 'ORDER_OUT_FOR_DELIVERY' | 'ORDER_DELIVERED' | 'DISPUTE_OPENED' | 'DISPUTE_RESOLVED' | 'PAYOUT_RELEASED' | 'RISK_ALERT' | 'NEW_REVIEW';
export declare class NotificationsService {
    private prisma;
    private email;
    private sms;
    private readonly logger;
    constructor(prisma: PrismaService, email: EmailAdapter, sms: SmsAdapter);
    create(userId: string, type: NotificationType, title: string, body: string, data?: any, channels?: NotificationChannel[]): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    list(userId: string, limit?: number, unreadOnly?: boolean): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markRead(userId: string, notificationId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(userId: string, notificationId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyOrderPaid(buyerId: string, orderId: string, orderTotal: number, currency: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    notifySellerNewOrder(sellerId: string, orderId: string, orderItemId: string, productTitle: string, quantity: number): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    notifyShipmentUpdate(buyerId: string, orderItemId: string, status: 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED', trackingCode?: string, carrier?: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    notifyDisputeOpened(sellerId: string, disputeId: string, orderItemId: string, productTitle: string, reason: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    notifyDisputeResolved(buyerId: string, disputeId: string, resolution: string, resolutionNote?: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    notifyPayoutReleased(sellerId: string, amount: number, currency: string, batchId: string, itemCount: number): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    notifyAdminRiskAlert(adminId: string, alertType: string, message: string, data?: any): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    notifyNewReview(sellerId: string, reviewId: string, productTitle: string, rating: number, buyerName: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    private isInQuietHours;
}
