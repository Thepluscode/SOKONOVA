import { PrismaService } from '../prisma.service';
export declare class AnalyticsRollupService {
    private prisma;
    constructor(prisma: PrismaService);
    getOpsSummary(adminId: string): Promise<{
        windowDaysGMV: number;
        windowDaysDispute: number;
        gmvByCity: {
            cityLabel: string;
            gmv: number;
            currency: string;
        }[];
        topCategories: {
            category: string;
            gmv: number;
        }[];
        topSellersByRevenue: {
            sellerId: string;
            shopName: string | null;
            handle: string | null;
            city: string | null;
            country: string | null;
            netRevenue7d: number;
            ratingAvg: number;
            ratingCount: number;
        }[];
        highDisputeSellers: {
            sellerId: string;
            disputes: number;
            sold: number;
            disputeRatePct: number;
            shopName: string | null;
            handle: string | null;
            city: string | null;
            country: string | null;
        }[];
        payoutLiability: {
            totalLiability: number;
            currency: string;
            topOwed: any[];
        };
    }>;
}
