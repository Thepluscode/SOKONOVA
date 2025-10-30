import { AnalyticsSellerService } from './analytics-seller.service';
export declare class AnalyticsSellerController {
    private analytics;
    constructor(analytics: AnalyticsSellerService);
    summary(sellerId: string): Promise<{
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
