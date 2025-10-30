import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class FulfillmentService {
    private prisma;
    private notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    getOrderTracking(orderId: string, userId: string): Promise<{
        orderId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        shippingAddress: string;
        items: {
            orderItemId: string;
            productTitle: string;
            productImage: string;
            qty: number;
            price: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            trackingCode: string;
            carrier: string;
            shippedAt: Date;
            deliveredAt: Date;
            deliveryProofUrl: string;
            notes: string;
        }[];
    }>;
    getSellerOpenFulfillment(sellerId: string): Promise<{
        id: string;
        orderId: string;
        qty: number;
        price: string;
        fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
        trackingCode: string;
        carrier: string;
        shippedAt: Date;
        deliveredAt: Date;
        deliveryProofUrl: string;
        notes: string;
        createdAt: Date;
        product: {
            title: string;
            imageUrl: string;
        };
        order: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            shippingAddress: string;
            buyerName: string;
            buyerEmail: string;
        };
    }[]>;
    markShipped(orderItemId: string, sellerId: string, carrier?: string, trackingCode?: string, note?: string): Promise<{
        order: {
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        orderId: string;
        sellerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        qty: number;
        grossAmount: import("@prisma/client/runtime/library").Decimal;
        feeAmount: import("@prisma/client/runtime/library").Decimal;
        netAmount: import("@prisma/client/runtime/library").Decimal;
        payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
        payoutBatchId: string | null;
        paidAt: Date | null;
        fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        trackingCode: string | null;
        carrier: string | null;
        deliveryProofUrl: string | null;
        notes: string | null;
    }>;
    markDelivered(orderItemId: string, sellerId: string, proofUrl?: string, note?: string): Promise<{
        order: {
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        orderId: string;
        sellerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        qty: number;
        grossAmount: import("@prisma/client/runtime/library").Decimal;
        feeAmount: import("@prisma/client/runtime/library").Decimal;
        netAmount: import("@prisma/client/runtime/library").Decimal;
        payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
        payoutBatchId: string | null;
        paidAt: Date | null;
        fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        trackingCode: string | null;
        carrier: string | null;
        deliveryProofUrl: string | null;
        notes: string | null;
    }>;
    markIssue(orderItemId: string, sellerId: string, note: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        orderId: string;
        sellerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        qty: number;
        grossAmount: import("@prisma/client/runtime/library").Decimal;
        feeAmount: import("@prisma/client/runtime/library").Decimal;
        netAmount: import("@prisma/client/runtime/library").Decimal;
        payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
        payoutBatchId: string | null;
        paidAt: Date | null;
        fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        trackingCode: string | null;
        carrier: string | null;
        deliveryProofUrl: string | null;
        notes: string | null;
    }>;
    getSellerStats(sellerId: string): Promise<{
        PACKED: number;
        SHIPPED: number;
        DELIVERED: number;
        ISSUE: number;
        total: number;
    }>;
}
