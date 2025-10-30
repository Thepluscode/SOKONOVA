import { PayoutsService } from './payouts.service';
import { Response } from 'express';
import { MarkPaidDto } from './dto/mark-paid.dto';
export declare class PayoutsController {
    private payouts;
    constructor(payouts: PayoutsService);
    sellerPending(sellerId: string): Promise<{
        currency: string;
        totalGross: number;
        totalFees: number;
        totalNet: number;
        count: number;
        items: {
            id: string;
            createdAt: Date;
            product: {
                title: string;
                imageUrl: string;
            };
            currency: string;
            orderId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            qty: number;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
    sellerAll(sellerId: string): Promise<{
        id: string;
        createdAt: Date;
        product: {
            title: string;
        };
        currency: string;
        orderId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        qty: number;
        grossAmount: import("@prisma/client/runtime/library").Decimal;
        feeAmount: import("@prisma/client/runtime/library").Decimal;
        netAmount: import("@prisma/client/runtime/library").Decimal;
        payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
        payoutBatchId: string;
        paidAt: Date;
    }[]>;
    sellerCsv(sellerId: string, res: Response): Promise<void>;
    markPaid(dto: MarkPaidDto): Promise<{
        batchId: string;
        paidAt: Date;
        count: number;
        lines: {
            id: string;
            product: {
                title: string;
            };
            currency: string;
            sellerId: string;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutBatchId: string;
            paidAt: Date;
        }[];
    }>;
    adminSummary(): Promise<any[]>;
}
