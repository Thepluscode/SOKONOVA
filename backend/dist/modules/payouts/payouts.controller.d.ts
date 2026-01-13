import { Role } from '@prisma/client';
import { PayoutsService } from './payouts.service';
import { Response } from 'express';
import { MarkPaidDto } from './dto/mark-paid.dto';
export declare class PayoutsController {
    private payouts;
    constructor(payouts: PayoutsService);
    sellerPending(sellerId: string | undefined, user: {
        id: string;
        role: Role;
    }): Promise<{
        currency: string;
        totalGross: number;
        totalFees: number;
        totalNet: number;
        count: number;
        items: {
            product: {
                title: string;
                imageUrl: string;
            };
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            createdAt: Date;
            productId: string;
            orderId: string;
            qty: number;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
    sellerAll(sellerId: string | undefined, user: {
        id: string;
        role: Role;
    }): Promise<{
        product: {
            title: string;
        };
        id: string;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        createdAt: Date;
        productId: string;
        orderId: string;
        qty: number;
        grossAmount: import("@prisma/client/runtime/library").Decimal;
        feeAmount: import("@prisma/client/runtime/library").Decimal;
        netAmount: import("@prisma/client/runtime/library").Decimal;
        payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
        payoutBatchId: string;
        paidAt: Date;
    }[]>;
    sellerCsv(sellerId: string | undefined, res: Response, user: {
        id: string;
        role: Role;
    }): Promise<void>;
    markPaid(dto: MarkPaidDto): Promise<{
        batchId: string;
        paidAt: Date;
        count: number;
        lines: {
            product: {
                title: string;
            };
            id: string;
            sellerId: string;
            currency: string;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutBatchId: string;
            paidAt: Date;
        }[];
    }>;
    adminSummary(): Promise<any[]>;
}
