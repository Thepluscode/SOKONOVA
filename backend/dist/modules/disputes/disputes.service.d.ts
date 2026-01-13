import { PrismaService } from '../prisma.service';
import { OpenDisputeDto } from './dto/open-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class DisputesService {
    private prisma;
    private notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    open(dto: OpenDisputeDto): Promise<{
        orderItem: {
            product: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            currency: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        description: string;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    }>;
    listMine(buyerId: string): Promise<({
        orderItem: {
            product: {
                sellerId: string;
                title: string;
                imageUrl: string;
            };
            order: {
                id: string;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            currency: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        description: string;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    })[]>;
    listForSeller(sellerId: string): Promise<({
        orderItem: {
            product: {
                title: string;
                imageUrl: string;
            };
            order: {
                id: string;
                createdAt: Date;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            currency: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        };
        buyer: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        description: string;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    })[]>;
    listAll(): Promise<({
        orderItem: {
            product: {
                title: string;
                seller: {
                    id: string;
                    name: string;
                };
            };
            order: {
                id: string;
                currency: string;
                total: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            currency: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        };
        buyer: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        description: string;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    })[]>;
    resolve(disputeId: string, dto: ResolveDisputeDto): Promise<{
        orderItem: {
            orderId: string;
        };
        buyer: {
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        description: string;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    }>;
}
