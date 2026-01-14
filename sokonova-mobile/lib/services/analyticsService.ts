// Analytics Service - API integration for seller analytics module

import api from '../api';

interface ProfitabilityMetrics {
    totalRevenue: number;
    totalFees: number;
    netEarnings: number;
    avgOrderValue: number;
    topProducts: Array<{
        productId: string;
        title: string;
        revenue: number;
        units: number;
    }>;
}

interface InventoryVelocity {
    productId: string;
    title: string;
    currentStock: number;
    soldLast30Days: number;
    daysOfStock: number;
    velocity: 'fast' | 'medium' | 'slow';
}

interface BuyerCohort {
    cohortMonth: string;
    newBuyers: number;
    repeatBuyers: number;
    avgOrderValue: number;
}

export const analyticsService = {
    /**
     * Get profitability metrics
     * GET /analytics/seller/:sellerId/profitability
     */
    getProfitability: async (sellerId: string): Promise<ProfitabilityMetrics> => {
        return api.get<ProfitabilityMetrics>(`/analytics/seller/${sellerId}/profitability`);
    },

    /**
     * Get orders with fee breakdown
     * GET /analytics/seller/:sellerId/orders
     */
    getOrdersWithFees: async (sellerId: string, limit: number = 50): Promise<unknown[]> => {
        return api.get<unknown[]>(`/analytics/seller/${sellerId}/orders?limit=${limit}`);
    },

    /**
     * Simulate pricing scenarios
     * POST /analytics/seller/:sellerId/simulate-pricing
     */
    simulatePricing: async (
        sellerId: string,
        scenario: { feeChange?: number; bundleDiscount?: number; productId?: string }
    ): Promise<unknown> => {
        return api.post(`/analytics/seller/${sellerId}/simulate-pricing`, scenario);
    },

    /**
     * Get inventory velocity metrics
     * GET /analytics/seller/:sellerId/inventory-velocity
     */
    getInventoryVelocity: async (sellerId: string): Promise<InventoryVelocity[]> => {
        return api.get<InventoryVelocity[]>(`/analytics/seller/${sellerId}/inventory-velocity`);
    },

    /**
     * Get buyer cohorts
     * GET /analytics/seller/:sellerId/buyer-cohorts
     */
    getBuyerCohorts: async (sellerId: string): Promise<BuyerCohort[]> => {
        return api.get<BuyerCohort[]>(`/analytics/seller/${sellerId}/buyer-cohorts`);
    },

    /**
     * Get buyer segments
     * GET /analytics/seller/:sellerId/buyer-segments
     */
    getBuyerSegments: async (sellerId: string): Promise<unknown[]> => {
        return api.get<unknown[]>(`/analytics/seller/${sellerId}/buyer-segments`);
    },

    /**
     * Generate discount campaign for segment
     * POST /analytics/seller/:sellerId/segments/:segmentId/discount-campaign
     */
    generateDiscountCampaign: async (
        sellerId: string,
        segmentId: string,
        discountData: {
            discountPercentage: number;
            durationDays: number;
            maxUses?: number;
        }
    ): Promise<unknown> => {
        return api.post(`/analytics/seller/${sellerId}/segments/${segmentId}/discount-campaign`, discountData);
    },

    /**
     * Get inventory risk analysis
     * GET /analytics/seller/:sellerId/inventory-risk
     */
    getInventoryRiskAnalysis: async (sellerId: string): Promise<unknown> => {
        return api.get(`/analytics/seller/${sellerId}/inventory-risk`);
    },

    /**
     * Get aging inventory
     * GET /analytics/seller/:sellerId/aging-inventory
     */
    getAgingInventory: async (sellerId: string): Promise<unknown[]> => {
        return api.get<unknown[]>(`/analytics/seller/${sellerId}/aging-inventory`);
    },

    /**
     * Get stockout predictions
     * GET /analytics/seller/:sellerId/stockout-predictions
     */
    getStockoutPredictions: async (sellerId: string): Promise<unknown[]> => {
        return api.get<unknown[]>(`/analytics/seller/${sellerId}/stockout-predictions`);
    },

    /**
     * Generate inventory recommendations
     * POST /analytics/seller/:sellerId/inventory-recommendations
     */
    generateInventoryRecommendations: async (
        sellerId: string,
        productId?: string
    ): Promise<unknown> => {
        return api.post(`/analytics/seller/${sellerId}/inventory-recommendations`, { productId });
    },

    /**
     * Get top selling products
     * GET /analytics/seller/:sellerId/top-products
     */
    getTopSellingProducts: async (sellerId: string, limit: number = 10): Promise<unknown[]> => {
        return api.get<unknown[]>(`/analytics/seller/${sellerId}/top-products?limit=${limit}`);
    },

    // Aliases for backwards compatibility
    getSellerProfitability: async (sellerId: string): Promise<ProfitabilityMetrics> => {
        return api.get<ProfitabilityMetrics>(`/analytics/seller/${sellerId}/profitability`);
    },

    getBuyerInsights: async (sellerId: string): Promise<unknown> => {
        return api.get(`/analytics/seller/${sellerId}/buyer-segments`);
    },
};

export default analyticsService;
