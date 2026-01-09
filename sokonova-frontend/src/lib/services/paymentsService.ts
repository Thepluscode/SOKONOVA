// Payments Service - API integration for payments module

import api from '../api';
import type { Payment } from '../types';

interface PaymentIntent {
    orderId: string;
    externalRef: string;
    checkoutUrl?: string;
    amount: number;
    currency: string;
    provider: string;
}

interface VerificationResult {
    status: 'success' | 'failed' | 'pending';
    message?: string;
    orderId?: string;
    amount?: number;
}

export const paymentsService = {
    /**
     * Create payment intent
     * POST /payments/intent
     */
    createIntent: async (orderId: string, provider: 'flutterwave' | 'paystack' | 'stripe'): Promise<PaymentIntent> => {
        return api.post<PaymentIntent>('/payments/intent', { orderId, provider });
    },

    /**
     * Get payment status for order
     * GET /payments/:orderId
     */
    getStatus: async (orderId: string): Promise<Payment> => {
        return api.get<Payment>(`/payments/${orderId}`);
    },

    /**
     * Poll for payment status (useful after redirect)
     * Polls every 2 seconds for up to 30 seconds
     */
    waitForPayment: async (orderId: string, maxWaitMs: number = 30000): Promise<Payment> => {
        const startTime = Date.now();
        const pollInterval = 2000;

        while (Date.now() - startTime < maxWaitMs) {
            const payment = await paymentsService.getStatus(orderId);
            if (payment.status === 'SUCCEEDED' || payment.status === 'FAILED') {
                return payment;
            }
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

        // Return current status after timeout
        return paymentsService.getStatus(orderId);
    },

    /**
     * Verify Paystack payment
     * GET /payments/verify/paystack/:reference
     */
    verifyPaystack: async (reference: string): Promise<VerificationResult> => {
        return api.get<VerificationResult>(`/payments/verify/paystack/${reference}`);
    },

    /**
     * Verify Flutterwave payment
     * GET /payments/verify/flutterwave/:transactionId
     */
    verifyFlutterwave: async (transactionId: string): Promise<VerificationResult> => {
        return api.get<VerificationResult>(`/payments/verify/flutterwave/${transactionId}`);
    },

    /**
     * Verify Stripe payment
     * GET /payments/verify/stripe/:sessionId
     */
    verifyStripe: async (sessionId: string): Promise<VerificationResult> => {
        return api.get<VerificationResult>(`/payments/verify/stripe/${sessionId}`);
    },

    /**
     * Get payment history for user
     * GET /payments/user/:userId
     */
    getHistory: async (userId: string, page: number = 1, limit: number = 10): Promise<Payment[]> => {
        return api.get<Payment[]>(`/payments/user/${userId}?page=${page}&limit=${limit}`);
    },
};

export default paymentsService;
