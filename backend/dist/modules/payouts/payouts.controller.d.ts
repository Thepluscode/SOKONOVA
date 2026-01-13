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
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            product: {
                title: string;
                imageUrl: string;
            };
        }[];
    }>;
    sellerAll(sellerId: string | undefined, user: {
        id: string;
        role: Role;
    }): Promise<{
        id: string;
        createdAt: Date;
        orderId: string;
        productId: string;
        qty: number;
        price: import("@prisma/client/runtime/library").Decimal;
        grossAmount: import("@prisma/client/runtime/library").Decimal;
        feeAmount: import("@prisma/client/runtime/library").Decimal;
        netAmount: import("@prisma/client/runtime/library").Decimal;
        payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
        payoutBatchId: string;
        paidAt: Date;
        currency: string;
        product: {
            title: string;
        };
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
            id: string;
            sellerId: string;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutBatchId: string;
            paidAt: Date;
            currency: string;
            product: {
                title: string;
            };
        }[];
    }>;
    adminSummary(): Promise<any[]>;
}
