import { PrismaService } from '../prisma.service';
export declare class AnalyticsSellerService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfitabilityMetrics(sellerId: string): Promise<{
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
    getOrdersWithFeeBreakdown(sellerId: string, limit: number): Promise<{
        itemRevenue: number;
        itemFees: number;
        netRevenue: number;
        user: {
            id: string;
            email: string;
            name: string;
        };
        items: ({
            product: {
                id: string;
                ratingAvg: number | null;
                ratingCount: number | null;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                viewCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            currency: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }[]>;
    simulatePricingScenario(sellerId: string, scenario: {
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
    getRecentOrders(sellerId: string, limit?: number): Promise<{
        itemRevenue: number;
        itemFees: number;
        netRevenue: number;
        user: {
            id: string;
            email: string;
            name: string;
        };
        items: ({
            product: {
                id: string;
                ratingAvg: number | null;
                ratingCount: number | null;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                sellerId: string;
                currency: string;
                title: string;
                description: string;
                imageUrl: string | null;
                category: string | null;
                viewCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            productId: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            sellerId: string;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            feeAmount: import("@prisma/client/runtime/library").Decimal;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            payoutStatus: import(".prisma/client").$Enums.PayoutStatus;
            payoutBatchId: string | null;
            paidAt: Date | null;
            currency: string;
            fulfillmentStatus: import(".prisma/client").$Enums.FulfillmentStatus;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            trackingCode: string | null;
            carrier: string | null;
            deliveryProofUrl: string | null;
            notes: string | null;
            exceptionNotified: boolean | null;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentRef: string | null;
        shippingAdr: string | null;
        buyerName: string | null;
        buyerPhone: string | null;
        buyerEmail: string | null;
    }[]>;
    getInventoryVelocityMetrics(sellerId: string): Promise<{
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
    generateInventoryRecommendations(sellerId: string, productId?: string): Promise<any[]>;
    getTopSellingProducts(sellerId: string, limit?: number): Promise<{
        totalSold: number;
        _count: {
            orderItems: number;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
        };
        id: string;
        ratingAvg: number | null;
        ratingCount: number | null;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        sellerId: string;
        currency: string;
        title: string;
        description: string;
        imageUrl: string | null;
        category: string | null;
        viewCount: number;
    }[]>;
}
