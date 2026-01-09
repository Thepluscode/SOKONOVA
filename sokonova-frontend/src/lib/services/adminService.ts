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
     * GET /seller-applications/pending?adminId=xxx
     */
    getSellerApplications: async (status?: string): Promise<SellerApplication[]> => {
        // For now, only fetch pending applications
        // TODO: Get adminId from auth context
        const adminId = localStorage.getItem('userId') || 'admin';

        if (status === 'pending') {
            return api.get<SellerApplication[]>(`/seller-applications/pending?adminId=${adminId}`);
        }

        // For approved/rejected, we'll use the same endpoint for now
        // TODO: Backend should provide separate endpoints for these
        return api.get<SellerApplication[]>(`/seller-applications/pending?adminId=${adminId}`);
    },

    /**
     * Approve a seller application
     * PATCH /seller-applications/:id/approve
     */
    approveApplication: async (id: string, note?: string): Promise<{ success: boolean }> => {
        const adminId = localStorage.getItem('userId') || 'admin';
        return api.patch(`/seller-applications/${id}/approve`, {
            adminId,
            adminNote: note
        });
    },

    /**
     * Reject a seller application
     * PATCH /seller-applications/:id/reject
     */
    rejectApplication: async (id: string, reason: string): Promise<{ success: boolean }> => {
        const adminId = localStorage.getItem('userId') || 'admin';
        return api.patch(`/seller-applications/${id}/reject`, {
            adminId,
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
};

export default adminService;
