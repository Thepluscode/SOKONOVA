// Payment Callback Handler - Handles payment provider callbacks and webhooks

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentsService } from '../lib/services';

interface PaymentStatus {
    status: 'pending' | 'success' | 'failed' | 'processing';
    message: string;
    orderId?: string;
    transactionId?: string;
}

/**
 * Hook to handle payment callback from providers (Paystack, Flutterwave, Stripe)
 */
export function usePaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
        status: 'processing',
        message: 'Verifying payment...',
    });

    useEffect(() => {
        async function verifyPayment() {
            // Get common callback parameters
            const reference = searchParams.get('reference') || searchParams.get('trxref');
            const transactionId = searchParams.get('transaction_id') || searchParams.get('tx_ref');
            const status = searchParams.get('status');
            const orderId = searchParams.get('order_id');

            // Paystack callback
            if (reference) {
                try {
                    const result = await paymentsService.verifyPaystack(reference);
                    if (result.status === 'success') {
                        setPaymentStatus({
                            status: 'success',
                            message: 'Payment successful.',
                            orderId: result.orderId,
                            transactionId: reference,
                        });
                    } else {
                        setPaymentStatus({
                            status: 'failed',
                            message: result.message || 'Payment verification failed.',
                        });
                    }
                } catch (err) {
                    setPaymentStatus({
                        status: 'failed',
                        message: 'Could not verify payment.',
                    });
                }
                return;
            }

            // Flutterwave callback
            if (transactionId && status) {
                try {
                    const result = await paymentsService.verifyFlutterwave(transactionId as string);
                    if (status === 'successful' && result.status === 'success') {
                        setPaymentStatus({
                            status: 'success',
                            message: 'Payment successful.',
                            orderId: result.orderId,
                            transactionId: transactionId as string,
                        });
                    } else {
                        setPaymentStatus({
                            status: 'failed',
                            message: result.message || 'Payment verification failed.',
                        });
                    }
                } catch (err) {
                    setPaymentStatus({
                        status: 'failed',
                        message: 'Could not verify payment.',
                    });
                }
                return;
            }

            // Stripe callback (typically has session_id)
            const sessionId = searchParams.get('session_id');
            if (sessionId) {
                try {
                    const result = await paymentsService.verifyStripe(sessionId);
                    if (result.status === 'success') {
                        setPaymentStatus({
                            status: 'success',
                            message: 'Payment successful.',
                            orderId: result.orderId,
                            transactionId: sessionId,
                        });
                    } else {
                        setPaymentStatus({
                            status: 'failed',
                            message: result.message || 'Payment verification failed.',
                        });
                    }
                } catch (err) {
                    setPaymentStatus({
                        status: 'failed',
                        message: 'Could not verify payment.',
                    });
                }
                return;
            }

            // If we have an order ID but no transaction ID, just mark as pending
            if (orderId) {
                setPaymentStatus({
                    status: 'pending',
                    message: 'Payment processing...',
                    orderId,
                });
                return;
            }

            // No valid parameters
            setPaymentStatus({
                status: 'failed',
                message: 'Invalid payment callback.',
            });
        }

        verifyPayment();
    }, [searchParams]);

    const redirectToOrder = () => {
        if (paymentStatus.orderId) {
            navigate(`/buyer-orders`);
        } else {
            navigate('/');
        }
    };

    const redirectToRetry = () => {
        navigate('/checkout');
    };

    return {
        ...paymentStatus,
        redirectToOrder,
        redirectToRetry,
    };
}

export default usePaymentCallback;
