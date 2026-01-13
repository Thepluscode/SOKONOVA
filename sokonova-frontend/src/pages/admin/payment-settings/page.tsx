import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import { useToast } from '../../../contexts/ToastContext';

export default function AdminPaymentSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const { showToast } = useToast();
  
  const [paymentMethods, setPaymentMethods] = useState({
    stripe: {
      enabled: true,
      publicKey: 'pk_test_...',
      secretKey: '••••••••',
    },
    paypal: {
      enabled: false,
      clientId: '',
      clientSecret: '',
    },
    mpesa: {
      enabled: false,
      shortcode: '',
      consumerKey: '',
      consumerSecret: '',
    },
    mobileMoney: {
      enabled: false,
      providers: ['MTN', 'Airtel', 'Tigo'],
    },
  });

  const handleSave = () => {
    localStorage.setItem('paymentSettings', JSON.stringify(paymentMethods));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTesting(false);
    showToast({
      message: 'Payment gateway connection successful.',
      type: 'success',
    });
  };

  const toggleMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: {
        ...paymentMethods[method],
        enabled: !paymentMethods[method].enabled,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Settings</h1>
          <p className="text-gray-600">Configure payment methods and gateways</p>
        </div>

        {saved && (
          <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <i className="ri-check-line text-xl"></i>
            <span>Payment settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stripe */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <i className="ri-bank-card-line text-2xl text-indigo-600"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Stripe</h2>
                    <p className="text-sm text-gray-500">Credit & Debit Cards</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.stripe.enabled}
                    onChange={() => toggleMethod('stripe')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {paymentMethods.stripe.enabled && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publishable Key
                    </label>
                    <input
                      type="text"
                      value={paymentMethods.stripe.publicKey}
                      onChange={(e) => setPaymentMethods({
                        ...paymentMethods,
                        stripe: { ...paymentMethods.stripe, publicKey: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      value={paymentMethods.stripe.secretKey}
                      onChange={(e) => setPaymentMethods({
                        ...paymentMethods,
                        stripe: { ...paymentMethods.stripe, secretKey: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="sk_test_..."
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                    <i className="ri-check-circle-line"></i>
                    <span>Connected and Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* PayPal */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-paypal-line text-2xl text-blue-600"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">PayPal</h2>
                    <p className="text-sm text-gray-500">PayPal & Venmo</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.paypal.enabled}
                    onChange={() => toggleMethod('paypal')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {paymentMethods.paypal.enabled && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={paymentMethods.paypal.clientId}
                      onChange={(e) => setPaymentMethods({
                        ...paymentMethods,
                        paypal: { ...paymentMethods.paypal, clientId: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter PayPal Client ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value={paymentMethods.paypal.clientSecret}
                      onChange={(e) => setPaymentMethods({
                        ...paymentMethods,
                        paypal: { ...paymentMethods.paypal, clientSecret: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter PayPal Client Secret"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* M-Pesa */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-smartphone-line text-2xl text-green-600"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">M-Pesa</h2>
                    <p className="text-sm text-gray-500">Safaricom M-Pesa Direct</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.mpesa.enabled}
                    onChange={() => toggleMethod('mpesa')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {paymentMethods.mpesa.enabled && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Shortcode
                    </label>
                    <input
                      type="text"
                      value={paymentMethods.mpesa.shortcode}
                      onChange={(e) => setPaymentMethods({
                        ...paymentMethods,
                        mpesa: { ...paymentMethods.mpesa, shortcode: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter Shortcode"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumer Key
                    </label>
                    <input
                      type="text"
                      value={paymentMethods.mpesa.consumerKey}
                      onChange={(e) => setPaymentMethods({
                        ...paymentMethods,
                        mpesa: { ...paymentMethods.mpesa, consumerKey: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter Consumer Key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consumer Secret
                    </label>
                    <input
                      type="password"
                      value={paymentMethods.mpesa.consumerSecret}
                      onChange={(e) => setPaymentMethods({
                        ...paymentMethods,
                        mpesa: { ...paymentMethods.mpesa, consumerSecret: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter Consumer Secret"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Money */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-phone-line text-2xl text-orange-600"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Mobile Money</h2>
                    <p className="text-sm text-gray-500">MTN, Airtel, Tigo</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.mobileMoney.enabled}
                    onChange={() => toggleMethod('mobileMoney')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {paymentMethods.mobileMoney.enabled && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Supported Providers:</p>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.mobileMoney.providers.map((provider) => (
                      <span
                        key={provider}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Save Settings
              </button>
              <button
                onClick={handleTest}
                disabled={testing}
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Info</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <i className="ri-information-line text-blue-600 mt-0.5"></i>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">Security Tips</h3>
                      <p className="text-xs text-blue-700">
                        Never share your API keys publicly. Use environment variables in production.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <i className="ri-shield-check-line text-amber-600 mt-0.5"></i>
                    <div>
                      <h3 className="text-sm font-semibold text-amber-900 mb-1">PCI Compliance</h3>
                      <p className="text-xs text-amber-700">
                        Stripe handles PCI compliance automatically. No card data is stored on your servers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <a href="https://stripe.com/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 cursor-pointer">
                      <i className="ri-external-link-line"></i>
                      Stripe Documentation
                    </a>
                    <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 cursor-pointer">
                      <i className="ri-external-link-line"></i>
                      PayPal Developer
                    </a>
                    <a href="https://developer.safaricom.co.ke" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 cursor-pointer">
                      <i className="ri-external-link-line"></i>
                      M-Pesa API Docs
                    </a>
                  </div>
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
