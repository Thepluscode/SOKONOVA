// Payouts Service - API integration for seller payouts

import api from '../api';

interface PayoutSummary {
    pending: number;
    available: number;
    totalPaidOut: number;
}

interface PayoutHistory {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    paidAt: string | null;
    method: string;
}

export const payoutsService = {
    /**
     * Get payout summary for seller
     * GET /payouts/seller/:sellerId/summary
     */
    getSummary: async (sellerId: string): Promise<PayoutSummary> => {
        return api.get<PayoutSummary>(`/payouts/seller/${sellerId}/summary`);
    },

    /**
     * Get payout history
     * GET /payouts/seller/:sellerId/history
     */
    getHistory: async (sellerId: string, limit: number = 20): Promise<PayoutHistory[]> => {
        return api.get<PayoutHistory[]>(`/payouts/seller/${sellerId}/history?limit=${limit}`);
    },

    /**
     * Request a payout
     * POST /payouts/seller/:sellerId/request
     */
    requestPayout: async (sellerId: string, amount: number, method: string): Promise<{ id: string; status: string }> => {
        return api.post(`/payouts/seller/${sellerId}/request`, { amount, method });
    },

    /**
     * Get pending earnings breakdown
     * GET /payouts/seller/:sellerId/pending
     */
    getPendingEarnings: async (sellerId: string): Promise<unknown[]> => {
        return api.get<unknown[]>(`/payouts/seller/${sellerId}/pending`);
    },
};

export default payoutsService;
