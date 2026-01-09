import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function CheckoutVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Simulate payment verification
    const sessionId = searchParams.get('session_id');
    const paymentIntent = searchParams.get('payment_intent');
    
    if (!sessionId && !paymentIntent) {
      setStatus('failed');
      return;
    }

    // Simulate API call to verify payment
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo
      if (isSuccess) {
        const newOrderId = 'ORD-' + Date.now();
        setOrderId(newOrderId);
        setStatus('success');
        
        // Clear cart after successful payment
        localStorage.removeItem('sokonova_cart');
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate(`/order-success?order_id=${newOrderId}`);
        }, 2000);
      } else {
        setStatus('failed');
      }
    }, 2000);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {status === 'verifying' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Verifying Payment</h1>
            <p className="text-gray-600 mb-6">Please wait while we confirm your payment...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <i className="ri-shield-check-line text-emerald-600"></i>
              <span>Secure payment processing</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-checkbox-circle-fill text-5xl text-green-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-600 mb-2">Your order has been confirmed.</p>
            <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
            <p className="text-sm text-gray-600 mb-8">Redirecting to order confirmation...</p>
            <Button onClick={() => navigate(`/order-success?order_id=${orderId}`)} className="whitespace-nowrap">
              <i className="ri-file-list-3-line mr-2"></i>
              View Order Details
            </Button>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-close-circle-fill text-5xl text-red-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-8">We couldn't process your payment. Please try again or use a different payment method.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button onClick={() => navigate('/checkout')} className="whitespace-nowrap w-full sm:w-auto">
                <i className="ri-arrow-left-line mr-2"></i>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/cart')} className="whitespace-nowrap w-full sm:w-auto">
                <i className="ri-shopping-cart-line mr-2"></i>
                Back to Cart
              </Button>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Need help?</p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <a href="mailto:support@sokonova.com" className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                  <i className="ri-mail-line mr-1"></i>
                  Email Support
                </a>
                <a href="tel:+1234567890" className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                  <i className="ri-phone-line mr-1"></i>
                  Call Us
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
