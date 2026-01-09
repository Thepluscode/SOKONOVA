import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function TestPaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [testMode, setTestMode] = useState<'success' | 'failure'>('success');
  const [amount, setAmount] = useState('50.00');

  const testProducts = [
    {
      id: '1',
      name: 'Test Product - Handcrafted Basket',
      price: 29.99,
      image: 'https://readdy.ai/api/search-image?query=beautiful%20handcrafted%20african%20woven%20basket%20with%20geometric%20patterns%20on%20clean%20white%20background%20simple%20product%20photography&width=200&height=200&seq=test1&orientation=squarish',
    },
    {
      id: '2',
      name: 'Test Product - Traditional Jewelry',
      price: 20.01,
      image: 'https://readdy.ai/api/search-image?query=elegant%20african%20beaded%20necklace%20with%20colorful%20patterns%20on%20clean%20white%20background%20simple%20product%20photography&width=200&height=200&seq=test2&orientation=squarish',
    },
  ];

  const handleTestPayment = async () => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      if (testMode === 'success') {
        // Simulate successful payment
        alert('✅ Test Payment Successful!\n\nOrder ID: TEST-' + Date.now() + '\nAmount: $' + amount + '\n\nThis was a test transaction. No real charges were made.');
        navigate('/order-success');
      } else {
        // Simulate failed payment
        alert('❌ Test Payment Failed\n\nError: Card declined (Test Mode)\n\nThis is a simulated failure for testing purposes.');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12 mt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6">
            <i className="ri-test-tube-line text-4xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Payment Flow</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your Stripe payment integration with simulated transactions. No real charges will be made.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Mode Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Test Scenario</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="testMode"
                    value="success"
                    checked={testMode === 'success'}
                    onChange={(e) => setTestMode(e.target.value as 'success')}
                    className="w-5 h-5 text-emerald-600"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-emerald-600 text-xl"></i>
                      <span className="font-semibold text-gray-900">Successful Payment</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Simulate a successful transaction and order confirmation
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="testMode"
                    value="failure"
                    checked={testMode === 'failure'}
                    onChange={(e) => setTestMode(e.target.value as 'failure')}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <i className="ri-close-line text-red-600 text-xl"></i>
                      <span className="font-semibold text-gray-900">Failed Payment</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Simulate a declined card or payment error
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Test Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Test Order Items</h2>
              
              <div className="space-y-4">
                {testProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: 1</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-2xl text-emerald-600">${amount}</span>
                </div>
              </div>
            </div>

            {/* Test Cards Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <i className="ri-bank-card-line text-blue-600 text-2xl"></i>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Stripe Test Cards</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Use these test card numbers in your Stripe checkout:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold text-gray-900">4242 4242 4242 4242</p>
                      <p className="text-xs text-gray-600">Visa - Success</p>
                    </div>
                    <i className="ri-check-line text-emerald-600 text-xl"></i>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold text-gray-900">4000 0000 0000 0002</p>
                      <p className="text-xs text-gray-600">Visa - Declined</p>
                    </div>
                    <i className="ri-close-line text-red-600 text-xl"></i>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold text-gray-900">5555 5555 5555 4444</p>
                      <p className="text-xs text-gray-600">Mastercard - Success</p>
                    </div>
                    <i className="ri-check-line text-emerald-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-4">
                Use any future expiry date, any 3-digit CVC, and any postal code
              </p>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTestPayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-2xl"></i>
                  Processing Test Payment...
                </>
              ) : (
                <>
                  <i className="ri-play-circle-line text-2xl"></i>
                  Run Test Payment
                </>
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-emerald-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Stripe Connected</p>
                    <p className="text-xs text-gray-600">Ready to process payments</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-test-tube-line text-blue-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Test Mode Active</p>
                    <p className="text-xs text-gray-600">No real charges</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              
              <div className="space-y-2">
                <a
                  href="https://stripe.com/docs/testing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-900">Stripe Test Cards</span>
                  <i className="ri-external-link-line text-gray-600"></i>
                </a>

                <button
                  onClick={() => navigate('/admin/payment-settings')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-900">Payment Settings</span>
                  <i className="ri-arrow-right-line text-gray-600"></i>
                </button>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-900">Real Checkout</span>
                  <i className="ri-arrow-right-line text-gray-600"></i>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <i className="ri-lightbulb-line text-amber-600 text-xl"></i>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Testing Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Test both success and failure scenarios</li>
                    <li>• Check order confirmation emails</li>
                    <li>• Verify order appears in dashboard</li>
                    <li>• Test different payment amounts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
