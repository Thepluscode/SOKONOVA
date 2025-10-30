import { PrismaService } from '../prisma.service';
export declare class AnalyticsSellerService {
    private prisma;
    constructor(prisma: PrismaService);
    getSellerSummary(sellerId: string): Promise<{
        sellerMeta: {
            shopName: string;
            sellerHandle: string;
        };
        revenue7d: {
            amount: number;
            currency: string;
        };
        topSkus: {
            productId: string;
            title: string;
            qty: number;
        }[];
        dispute: {
            disputeRatePct: number;
            soldWindow: number;
            disputesWindow: number;
        };
        rating: {
            avg: number;
            count: number;
            trend: {
                rating: number;
                ts: Date;
            }[];
        };
    }>;
}
