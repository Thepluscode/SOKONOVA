import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PayoutsService {
    private prisma;
    private notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    getPendingForSeller(sellerId: string): Promise<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            orderId: string;
            qty: number;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
    getAllForSeller(sellerId: string): Promise<{
        id: string;
        createdAt: Date;
        product: {
            title: string;
        };
        currency: string;
        price: import("@prisma/client/runtime/library").Decimal;
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
    markPaidOut(orderItemIds: string[], batchId: string): Promise<{
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
    getCsvForSeller(sellerId: string): Promise<string>;
    getAdminSummary(): Promise<any[]>;
}
