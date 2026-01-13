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
     * GET /payouts/seller/pending
     * GET /payouts/seller/all
     */
    getSummary: async (sellerId?: string): Promise<PayoutSummary> => {
        const sellerQuery = sellerId ? `?sellerId=${sellerId}` : '';
        const [pending, all] = await Promise.all([
            api.get<{
                totalNet: number;
            }>(`/payouts/seller/pending${sellerQuery}`),
            api.get<Array<{ netAmount: number; payoutStatus: string }>>(`/payouts/seller/all${sellerQuery}`),
        ]);

        const totalPaidOut = all
            .filter((item) => item.payoutStatus === 'PAID_OUT')
            .reduce((sum, item) => sum + Number(item.netAmount || 0), 0);

        return {
            pending: Number(pending.totalNet || 0),
            available: 0,
            totalPaidOut,
        };
    },

    /**
     * Get payout history
     * GET /payouts/seller/all
     */
    getHistory: async (sellerId?: string, limit: number = 20): Promise<PayoutHistory[]> => {
        const sellerQuery = sellerId ? `?sellerId=${sellerId}` : '';
        const items = await api.get<Array<{
            id: string;
            netAmount: number;
            currency: string;
            payoutStatus: string;
            createdAt: string;
            paidAt: string | null;
        }>>(`/payouts/seller/all${sellerQuery}`);

        return items.slice(0, limit).map((item) => ({
            id: item.id,
            amount: Number(item.netAmount),
            currency: item.currency,
            status: item.payoutStatus?.toLowerCase() || 'pending',
            createdAt: item.createdAt,
            paidAt: item.paidAt,
            method: 'Bank Transfer',
        }));
    },

    /**
     * Request a payout
     * TODO: backend endpoint not implemented yet
     */
    requestPayout: async (sellerId: string, amount: number, method: string): Promise<{ id: string; status: string }> => {
        return api.post(`/payouts/seller/${sellerId}/request`, { amount, method });
    },

    /**
     * Get pending earnings breakdown
     * GET /payouts/seller/pending
     */
    getPendingEarnings: async (sellerId?: string): Promise<unknown[]> => {
        const sellerQuery = sellerId ? `?sellerId=${sellerId}` : '';
        return api.get<unknown[]>(`/payouts/seller/pending${sellerQuery}`);
    },
};

export default payoutsService;
