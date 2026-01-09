import { usePaymentCallback } from '../../../hooks/usePaymentCallback';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function PaymentCallbackPage() {
    const { status, message, orderId, transactionId, redirectToOrder, redirectToRetry } = usePaymentCallback();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    {/* Processing State */}
                    {status === 'processing' && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <div className="flex justify-center">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                                <i className="ri-checkbox-circle-fill text-5xl text-green-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                            <p className="text-gray-600 mb-4">{message}</p>

                            {orderId && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                    <p className="font-mono font-semibold text-gray-900">{orderId}</p>
                                </div>
                            )}

                            {transactionId && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Transaction Reference</p>
                                    <p className="font-mono text-sm text-gray-700 break-all">{transactionId}</p>
                                </div>
                            )}

                            <Button onClick={redirectToOrder} className="w-full">
                                <i className="ri-shopping-bag-line mr-2"></i>
                                View My Orders
                            </Button>
                        </>
                    )}

                    {/* Failed State */}
                    {status === 'failed' && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                <i className="ri-close-circle-fill text-5xl text-red-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                            <p className="text-gray-600 mb-6">{message}</p>

                            <div className="space-y-3">
                                <Button onClick={redirectToRetry} className="w-full">
                                    <i className="ri-refresh-line mr-2"></i>
                                    Try Again
                                </Button>
                                <Button variant="outline" onClick={redirectToOrder} className="w-full">
                                    <i className="ri-home-line mr-2"></i>
                                    Go to Home
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Pending State */}
                    {status === 'pending' && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                <i className="ri-time-line text-5xl text-yellow-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h1>
                            <p className="text-gray-600 mb-4">{message}</p>
                            <p className="text-sm text-gray-500 mb-6">
                                Your payment is being processed. You will receive a confirmation email once complete.
                            </p>

                            <Button onClick={redirectToOrder} className="w-full">
                                <i className="ri-shopping-bag-line mr-2"></i>
                                View My Orders
                            </Button>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
