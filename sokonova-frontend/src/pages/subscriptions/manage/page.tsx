import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { useToast } from '../../../contexts/ToastContext';

export default function ManageSubscriptionPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { showToast } = useToast();

  const currentPlan = {
    name: 'Pro',
    price: 29,
    billingCycle: 'monthly',
    nextBillingDate: '2024-02-15',
    status: 'active',
    features: [
      'Unlimited products',
      'Advanced analytics',
      '3% transaction fee',
      'Priority support',
      'Featured listings (5/month)'
    ]
  };

  const paymentMethod = {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: '12',
    expiryYear: '2025'
  };

  const billingHistory = [
    {
      id: 1,
      date: '2024-01-15',
      amount: 29.00,
      status: 'paid',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2023-12-15',
      amount: 29.00,
      status: 'paid',
      invoice: 'INV-2023-012'
    },
    {
      id: 3,
      date: '2023-11-15',
      amount: 29.00,
      status: 'paid',
      invoice: 'INV-2023-011'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/subscriptions" className="hover:text-purple-600">Subscriptions</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900">Manage Subscription</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Subscription</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium whitespace-nowrap">
                  Active
                </span>
              </div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentPlan.name}</h3>
                  <p className="text-gray-600 mb-4">
                    ${currentPlan.price}/{currentPlan.billingCycle}
                  </p>
                  <p className="text-sm text-gray-600">
                    Next billing date: {new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Link to="/subscriptions">
                  <Button variant="outline" className="whitespace-nowrap">
                    Change Plan
                  </Button>
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Plan Features</h4>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-green-600 mr-2 mt-1 flex-shrink-0"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                <Button variant="outline" className="whitespace-nowrap">
                  Update
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className="ri-bank-card-line text-2xl text-gray-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {paymentMethod.brand} ending in {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Billing History</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((bill) => (
                      <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(bill.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          ${bill.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium whitespace-nowrap">
                            {bill.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                            <i className="ri-download-line mr-1"></i>
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cancel Subscription */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Cancel Subscription</h2>
              <p className="text-gray-700 mb-4">
                If you cancel, you'll continue to have access to your Pro features until the end of your billing period.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(true)}
                className="border-red-300 text-red-600 hover:bg-red-50 whitespace-nowrap"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Products Listed</span>
                    <span className="text-sm font-medium text-gray-900">45 / Unlimited</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Featured Listings</span>
                    <span className="text-sm font-medium text-gray-900">3 / 5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Transaction Fee</span>
                    <span className="text-sm font-medium text-gray-900">3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/subscriptions">
                  <Button variant="outline" className="w-full whitespace-nowrap">
                    <i className="ri-arrow-up-line mr-2"></i>
                    Upgrade Plan
                  </Button>
                </Link>
                <Button variant="outline" className="w-full whitespace-nowrap">
                  <i className="ri-file-list-line mr-2"></i>
                  View All Invoices
                </Button>
                <Button variant="outline" className="w-full whitespace-nowrap">
                  <i className="ri-customer-service-line mr-2"></i>
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Cancel Subscription?</h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to Pro features at the end of your billing period.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 whitespace-nowrap"
              >
                Keep Subscription
              </Button>
                <Button
                  onClick={() => {
                  showToast({
                    message: 'Subscription canceled. Access remains until the end of your billing period.',
                    type: 'info',
                  });
                  setShowCancelModal(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 whitespace-nowrap"
              >
                Cancel Plan
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
