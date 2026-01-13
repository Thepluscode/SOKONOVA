import { Role } from '@prisma/client';
import { DisputesService } from './disputes.service';
import { OpenDisputeDto } from './dto/open-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
export declare class DisputesController {
    private disputes;
    constructor(disputes: DisputesService);
    open(body: OpenDisputeDto, user: {
        id: string;
    }): Promise<{
        orderItem: {
            product: {
                title: string;
            };
        } & {
            id: string;
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
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
            notes: string | null;
            exceptionNotified: boolean | null;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    }>;
    mine(user: {
        id: string;
    }): Promise<({
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
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
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
            notes: string | null;
            exceptionNotified: boolean | null;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    })[]>;
    seller(sellerId: string | undefined, user: {
        id: string;
        role: Role;
    }): Promise<({
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
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
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
            notes: string | null;
            exceptionNotified: boolean | null;
        };
        buyer: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    })[]>;
    resolve(disputeId: string, body: ResolveDisputeDto, user: {
        id: string;
    }): Promise<{
        orderItem: {
            orderId: string;
        };
        buyer: {
            id: string;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    }>;
    admin(): Promise<({
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
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
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
            notes: string | null;
            exceptionNotified: boolean | null;
        };
        buyer: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        orderItemId: string;
        buyerId: string;
        reasonCode: import(".prisma/client").$Enums.DisputeReason;
        photoProofUrl: string | null;
        resolutionNote: string | null;
        resolvedById: string | null;
        resolvedAt: Date | null;
    })[]>;
}
