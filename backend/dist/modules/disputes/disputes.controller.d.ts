import { DisputesService } from './disputes.service';
import { OpenDisputeDto } from './dto/open-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
export declare class DisputesController {
    private disputes;
    constructor(disputes: DisputesService);
    open(body: OpenDisputeDto): Promise<{
        orderItem: {
            product: {
                title: string;
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
    mine(buyerId: string): Promise<({
        orderItem: {
            product: {
                title: string;
                sellerId: string;
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
    seller(sellerId: string): Promise<({
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
        };
        buyer: {
            id: string;
            name: string;
            email: string;
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
    resolve(disputeId: string, body: ResolveDisputeDto): Promise<{
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
