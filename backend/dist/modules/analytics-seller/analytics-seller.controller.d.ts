import { AnalyticsSellerService } from './analytics-seller.service';
export declare class AnalyticsSellerController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsSellerService);
    getProfitability(sellerId: string): Promise<{
        totalRevenue: number;
        totalCost: number;
        totalFees: number;
        totalShipping: number;
        totalPromos: number;
        grossProfit: number;
        netProfit: number;
        profitMargin: number;
        orderCount: number;
    }>;
    getOrdersWithFees(sellerId: string, limit: string): Promise<{
        itemRevenue: number;
        itemFees: number;
        netRevenue: number;
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                ratingAvg: number | null;
                ratingCount: number | null;
                currency: string;
                sellerId: string;
                title: string;
                description: string;
                price: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                category: string | null;
                viewCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            sellerId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            notes: string | null;
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
            exceptionNotified: boolean | null;
        })[];
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }[]>;
    simulatePricing(sellerId: string, scenario: {
        feeChange?: number;
        bundleDiscount?: number;
        productId?: string;
    }): Promise<{
        current: {
            totalRevenue: number;
            totalCost: number;
            totalFees: number;
            totalShipping: number;
            totalPromos: number;
            grossProfit: number;
            netProfit: number;
            profitMargin: number;
            orderCount: number;
        };
        simulated: {
            totalRevenue: number;
            totalCost: number;
            totalFees: number;
            totalShipping: number;
            totalPromos: number;
            grossProfit: number;
            netProfit: number;
            profitMargin: number;
            orderCount: number;
        };
        difference: {
            totalRevenue: number;
            netProfit: number;
            profitMargin: number;
        };
    }>;
    getInventoryVelocity(sellerId: string): Promise<{
        products: {
            productId: string;
            productName: string;
            currentInventory: number;
            totalSold: number;
            dailySalesRate: number;
            daysOfSupply: number;
            velocity: number;
            status: string;
        }[];
        aggregate: {
            totalInventory: number;
            totalSold: number;
            avgDaysOfSupply: number;
            slowMovingItems: number;
            fastMovingItems: number;
        };
    }>;
    getBuyerCohorts(sellerId: string): Promise<any[]>;
    getBuyerSegments(sellerId: string): Promise<any[]>;
    generateDiscountCampaign(sellerId: string, segmentId: string, discountData: {
        discountPercentage: number;
        durationDays: number;
        maxUses?: number;
    }): Promise<{
        id: string;
        sellerId: string;
        segmentId: string;
        discountPercentage: number;
        durationDays: number;
        maxUses: number;
        status: string;
        createdAt: Date;
        expiresAt: Date;
        redemptionCount: number;
    }>;
    getInventoryRiskAnalysis(sellerId: string): Promise<{
        products: {
            productId: string;
            productName: string;
            currentInventory: number;
            daysOfSupply: number;
            avgRating: number;
            riskScore: number;
            riskLevel: string;
            riskFactors: {
                aging: number;
                velocity: number;
                rating: number;
            };
        }[];
        aggregate: {
            totalProducts: number;
            highRiskItems: number;
            mediumRiskItems: number;
            lowRiskItems: number;
            riskDistribution: {
                high: number;
                medium: number;
                low: number;
            };
        };
    }>;
    getAgingInventory(sellerId: string): Promise<{
        productId: string;
        productName: string;
        currentInventory: number;
        ageInDays: number;
        status: string;
    }[]>;
    getStockoutPredictions(sellerId: string): Promise<{
        productId: string;
        productName: string;
        currentInventory: number;
        dailySalesRate: number;
        daysUntilStockout: number;
        riskOfStockout: string;
        recommendedRestock: number;
    }[]>;
    generateInventoryRecommendations(sellerId: string, data: {
        productId?: string;
    }): Promise<any[]>;
}
