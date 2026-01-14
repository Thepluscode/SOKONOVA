// Admin Service - API integration for admin dashboard

import api from '../api';

interface SellerApplication {
    id: string;
    name: string;
    owner: string;
    email: string;
    phone?: string;
    category: string;
    location: string;
    submittedDate: string;
    documents?: string[];
    businessDescription?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
}

interface AdminStats {
    pendingApplications: number;
    approvedSellers: number;
    rejectedApplications: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export const adminService = {
    /**
     * Get pending seller applications
     * GET /seller-applications/pending
     */
    getSellerApplications: async (status?: string): Promise<SellerApplication[]> => {
        // For now, only fetch pending applications
        if (status === 'pending') {
            return api.get<SellerApplication[]>('/seller-applications/pending');
        }

        // For approved/rejected, we'll use the same endpoint for now
        // TODO: Backend should provide separate endpoints for these
        return api.get<SellerApplication[]>('/seller-applications/pending');
    },

    /**
     * Approve a seller application
     * PATCH /seller-applications/:id/approve
     */
    approveApplication: async (id: string, note?: string): Promise<{ success: boolean }> => {
        return api.patch(`/seller-applications/${id}/approve`, {
            adminNote: note
        });
    },

    /**
     * Reject a seller application
     * PATCH /seller-applications/:id/reject
     */
    rejectApplication: async (id: string, reason: string): Promise<{ success: boolean }> => {
        return api.patch(`/seller-applications/${id}/reject`, {
            adminNote: reason
        });
    },

    /**
     * Get admin dashboard stats
     * GET /analytics-rollup/admin-stats
     */
    getAdminStats: async (): Promise<AdminStats> => {
        return api.get<AdminStats>('/analytics-rollup/admin-stats');
    },

    /**
     * Get platform-wide analytics
     * GET /analytics-rollup/platform
     */
    getPlatformAnalytics: async (period: string = '30d'): Promise<any> => {
        return api.get(`/analytics-rollup/platform?period=${period}`);
    },

    /**
     * Get trust scores overview
     * GET /trust/overview
     */
    getTrustOverview: async (): Promise<any> => {
        return api.get('/trust/overview');
    },

    /**
     * Update seller trust score
     * PATCH /trust/seller/:sellerId
     */
    updateTrustScore: async (sellerId: string, adjustment: number, reason: string): Promise<any> => {
        return api.patch(`/trust/seller/${sellerId}`, { adjustment, reason });
    },

    /**
     * Get control tower data
     * GET /admin-control-tower/status
     */
    getControlTowerStatus: async (): Promise<any> => {
        return api.get('/admin-control-tower/status');
    },

    /**
     * Get subscription plans
     * GET /subscriptions/plans
     */
    getSubscriptionPlans: async (): Promise<any[]> => {
        return api.get('/subscriptions/plans');
    },

    /**
     * Get active subscriptions
     * GET /subscriptions/active
     */
    getActiveSubscriptions: async (): Promise<any[]> => {
        return api.get('/subscriptions/active');
    },

    // ============= Admin Settings APIs =============

    /**
     * Get payment settings
     * GET /admin/settings/payments
     */
    getPaymentSettings: async (): Promise<any> => {
        return api.get('/admin/settings/payments');
    },

    /**
     * Update payment settings
     * PUT /admin/settings/payments
     */
    updatePaymentSettings: async (settings: any): Promise<any> => {
        return api.put('/admin/settings/payments', settings);
    },

    /**
     * Get shipping settings
     * GET /admin/settings/shipping
     */
    getShippingSettings: async (): Promise<any> => {
        return api.get('/admin/settings/shipping');
    },

    /**
     * Update shipping settings
     * PUT /admin/settings/shipping
     */
    updateShippingSettings: async (settings: any): Promise<any> => {
        return api.put('/admin/settings/shipping', settings);
    },

    /**
     * Get branding settings
     * GET /admin/settings/branding
     */
    getBrandingSettings: async (): Promise<any> => {
        return api.get('/admin/settings/branding');
    },

    /**
     * Update branding settings
     * PUT /admin/settings/branding
     */
    updateBrandingSettings: async (settings: any): Promise<any> => {
        return api.put('/admin/settings/branding', settings);
    },

    /**
     * Get commission settings
     * GET /admin/settings/commissions
     */
    getCommissionSettings: async (): Promise<any> => {
        return api.get('/admin/settings/commissions');
    },

    /**
     * Update commission settings
     * PUT /admin/settings/commissions
     */
    updateCommissionSettings: async (settings: any): Promise<any> => {
        return api.put('/admin/settings/commissions', settings);
    },

    /**
     * Get flash sales
     * GET /admin/flash-sales
     */
    getFlashSales: async (): Promise<any[]> => {
        return api.get('/admin/flash-sales');
    },

    /**
     * Create flash sale
     * POST /admin/flash-sales
     */
    createFlashSale: async (sale: any): Promise<any> => {
        return api.post('/admin/flash-sales', sale);
    },

    /**
     * Update flash sale
     * PUT /admin/flash-sales/:id
     */
    updateFlashSale: async (id: string, sale: any): Promise<any> => {
        return api.put(`/admin/flash-sales/${id}`, sale);
    },

    /**
     * Delete flash sale
     * DELETE /admin/flash-sales/:id
     */
    deleteFlashSale: async (id: string): Promise<void> => {
        return api.delete(`/admin/flash-sales/${id}`);
    },

    /**
     * Get loyalty settings
     * GET /admin/settings/loyalty
     */
    getLoyaltySettings: async (): Promise<any> => {
        return api.get('/admin/settings/loyalty');
    },

    /**
     * Update loyalty settings
     * PUT /admin/settings/loyalty
     */
    updateLoyaltySettings: async (settings: any): Promise<any> => {
        return api.put('/admin/settings/loyalty', settings);
    },

    /**
     * Get referral settings
     * GET /admin/settings/referral
     */
    getReferralSettings: async (): Promise<any> => {
        return api.get('/admin/settings/referral');
    },

    /**
     * Update referral settings
     * PUT /admin/settings/referral
     */
    updateReferralSettings: async (settings: any): Promise<any> => {
        return api.put('/admin/settings/referral', settings);
    },

    // ============= Control Tower APIs =============

    /**
     * Get system health overview
     * GET /admin-control-tower/health
     */
    getControlTowerHealth: async (): Promise<any> => {
        return api.get('/admin-control-tower/health');
    },

    /**
     * Get platform metrics
     * GET /admin-control-tower/metrics
     */
    getControlTowerMetrics: async (): Promise<any> => {
        return api.get('/admin-control-tower/metrics');
    },

    /**
     * Get recent activities
     * GET /admin-control-tower/activities
     */
    getControlTowerActivities: async (): Promise<any> => {
        return api.get('/admin-control-tower/activities');
    },

    /**
     * Get system alerts
     * GET /admin-control-tower/alerts
     */
    getControlTowerAlerts: async (): Promise<any> => {
        return api.get('/admin-control-tower/alerts');
    },

    /**
     * Get user insights
     * GET /admin-control-tower/user-insights
     */
    getControlTowerUserInsights: async (): Promise<any> => {
        return api.get('/admin-control-tower/user-insights');
    },

    // ============= Operations Analytics APIs =============

    /**
     * Get order analytics
     * GET /admin/analytics/orders
     */
    getOrderAnalytics: async (): Promise<any> => {
        return api.get('/admin/analytics/orders');
    },

    /**
     * Get inventory analytics
     * GET /admin/analytics/inventory
     */
    getInventoryAnalytics: async (): Promise<any> => {
        return api.get('/admin/analytics/inventory');
    },

    /**
     * Get logistics analytics
     * GET /admin/analytics/logistics
     */
    getLogisticsAnalytics: async (): Promise<any> => {
        return api.get('/admin/analytics/logistics');
    },
};

export default adminService;

