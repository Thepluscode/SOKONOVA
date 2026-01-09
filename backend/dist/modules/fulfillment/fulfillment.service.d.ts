import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class FulfillmentService {
    private prisma;
    private notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    calculateDeliveryEstimate(productId: string, location?: string): Promise<{
        productId: string;
        location: string;
        estimatedMinDays: number;
        estimatedMaxDays: number;
        confidenceLevel: number;
        carriers: string[];
    }>;
    getShippingOptions(items: Array<{
        productId: string;
        quantity: number;
    }>, location?: string): Promise<{
        id: string;
        name: string;
        description: string;
        cost: number;
        estimatedDays: number;
    }[]>;
    trackShipment(trackingNumber: string): Promise<{
        trackingNumber: string;
        status: string;
        estimatedDelivery: Date;
        carrier: string;
        events: {
            timestamp: Date;
            location: string;
            description: string;
        }[];
    }>;
    getDeliveryPerformanceMetrics(sellerId: string): Promise<{
        sellerId: string;
        onTimeDeliveryRate: number;
        avgDeliveryTime: number;
        lateDeliveries: number;
        totalDeliveries: number;
        customerSatisfaction: number;
    }>;
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
        sellerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        notes: string | null;
        orderId: string;
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
        exceptionNotified: boolean | null;
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
        sellerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        notes: string | null;
        orderId: string;
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
        exceptionNotified: boolean | null;
    }>;
    markIssue(orderItemId: string, sellerId: string, note: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        sellerId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        notes: string | null;
        orderId: string;
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
        exceptionNotified: boolean | null;
    }>;
    getSellerStats(sellerId: string): Promise<{
        PACKED: number;
        SHIPPED: number;
        DELIVERED: number;
        ISSUE: number;
        total: number;
    }>;
    calculateDeliveryPromise(productId: string, location?: string): Promise<{
        productId: string;
        location: string;
        promisedMinDays: number;
        promisedMaxDays: number;
        confidenceLevel: number;
        sellerRating: number;
        deliveryGuarantee: boolean;
        message: string;
    }>;
    getExceptionStatus(orderItemId: string): Promise<{
        orderItemId: string;
        exceptionType: any;
        exceptionSeverity: string;
        nextAction: any;
        slaDeadline: any;
        orderDetails: {
            orderId: string;
            productTitle: string;
            buyerName: string;
            buyerEmail: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date;
            expectedDelivery: Date;
        };
    }>;
    getMicroFulfillmentMetrics(sellerId: string): Promise<{
        optedIn: boolean;
        partners: {
            id: string;
            name: string;
            performance: {
                onTimeRate: number;
                avgProcessingTime: number;
                accuracyRate: number;
                costPerItem: number;
            };
            capacity: {
                available: number;
                total: number;
            };
        }[];
        sellerMetrics: {
            fulfillmentRate: number;
            avgTurnaround: number;
            costSavings: number;
        };
    }>;
    optInToMicroFulfillment(sellerId: string, partnerId: string): Promise<{
        success: boolean;
        sellerId: string;
        partnerId: string;
        optInDate: Date;
    }>;
    getFulfillmentPartners(sellerId: string): Promise<{
        id: string;
        name: string;
        description: string;
        locations: string[];
        pricing: {
            pickPack: number;
            storage: number;
        };
        capabilities: string[];
        rating: number;
    }[]>;
}
