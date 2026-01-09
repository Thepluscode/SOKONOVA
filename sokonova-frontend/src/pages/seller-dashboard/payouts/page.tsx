import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import SkeletonLoader from '../../../components/base/SkeletonLoader';
import { payoutsService, ordersService } from '../../../lib/services';
import { useAuth, useRequireAuth } from '../../../lib/auth';

interface PayoutMethod {
  id: string;
  type: 'bank' | 'mobile_money' | 'paypal';
  details: string;
  isDefault: boolean;
}

interface Payout {
  id: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
}

interface Earning {
  orderId: string;
  productName: string;
  orderAmount: number;
  commission: number;
  netEarning: number;
  status: 'pending' | 'available' | 'paid_out';
  orderDate: string;
  availableDate?: string;
}

export default function SellerPayouts() {
  const { user } = useAuth();
  useRequireAuth('SELLER');

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'earnings' | 'methods'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for API data
  const [payoutStats, setPayoutStats] = useState({
    availableBalance: 0,
    pendingEarnings: 0,
    totalPaidOut: 0,
    nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    minimumPayout: 50,
    commissionRate: 10
  });
  const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);

  const payoutMethods: PayoutMethod[] = [
    {
      id: '1',
      type: 'bank',
      details: 'Bank Account ****4532',
      isDefault: true
    },
    {
      id: '2',
      type: 'mobile_money',
      details: 'M-Pesa +254 *** *** 789',
      isDefault: false
    },
    {
      id: '3',
      type: 'paypal',
      details: 'seller@email.com',
      isDefault: false
    }
  ];

  // Fetch payout data from API
  useEffect(() => {
    async function fetchPayoutData() {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch summary and history in parallel
        const [summary, history] = await Promise.all([
          payoutsService.getSummary(user.id).catch(() => null),
          payoutsService.getHistory(user.id).catch(() => []),
        ]);

        // Update stats from API or use defaults
        if (summary) {
          setPayoutStats(prev => ({
            ...prev,
            availableBalance: summary.available || 0,
            pendingEarnings: summary.pending || 0,
            totalPaidOut: summary.totalPaidOut || 0,
          }));
        }

        // Transform history
        if (history && history.length > 0) {
          setPayoutHistory(history.map((h: any) => ({
            id: h.id,
            amount: h.amount,
            commission: h.amount * 0.1,
            netAmount: h.amount * 0.9,
            status: h.status,
            method: h.method || 'Bank Account',
            requestedAt: h.createdAt,
            processedAt: h.paidAt,
          })));
        }

        // Try to get earnings from orders
        try {
          const orders = await ordersService.listForUser(user.id);
          if (orders && orders.length > 0) {
            setEarnings(orders.map((order: any) => ({
              orderId: order.id,
              productName: order.items?.[0]?.product?.title || 'Product',
              orderAmount: Number(order.total),
              commission: Number(order.total) * 0.1,
              netEarning: Number(order.total) * 0.9,
              status: order.paymentStatus === 'PAID' ? 'available' : 'pending',
              orderDate: order.createdAt,
            })));
          }
        } catch {
          // Keep empty earnings
        }
      } catch (err) {
        console.error('Failed to fetch payout data:', err);
        setError('Failed to load payout data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchPayoutData();
  }, [user?.id]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid_out':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
      case 'available':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return 'ri-bank-line';
      case 'mobile_money':
        return 'ri-smartphone-line';
      case 'paypal':
        return 'ri-paypal-line';
      default:
        return 'ri-wallet-line';
    }
  };

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (amount < payoutStats.minimumPayout) {
      alert(`Minimum payout amount is $${payoutStats.minimumPayout}`);
      return;
    }
    if (amount > payoutStats.availableBalance) {
      alert('Insufficient balance');
      return;
    }
    if (!selectedMethod) {
      alert('Please select a payout method');
      return;
    }

    console.log('Requesting payout:', { amount, method: selectedMethod });
    setShowPayoutModal(false);
    setPayoutAmount('');
    setSelectedMethod('');
  };

  const handleExportCSV = () => {
    console.log('Exporting earnings to CSV');
    // Implement CSV export
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/seller-dashboard" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payouts & Earnings</h1>
                <p className="text-gray-600 mt-1">Manage your earnings and payout methods</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleExportCSV}>
                <i className="ri-download-line mr-2"></i>
                Export CSV
              </Button>
              <Button onClick={() => setShowPayoutModal(true)}>
                <i className="ri-wallet-3-line mr-2"></i>
                Request Payout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Available Balance</h3>
              <i className="ri-wallet-3-line text-xl opacity-80"></i>
            </div>
            <p className="text-3xl font-bold mb-1">${payoutStats.availableBalance.toLocaleString()}</p>
            <p className="text-emerald-100 text-sm">Ready to withdraw</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending Earnings</h3>
              <i className="ri-time-line text-xl text-yellow-600"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${payoutStats.pendingEarnings.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Processing orders</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Paid Out</h3>
              <i className="ri-check-double-line text-xl text-green-600"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${payoutStats.totalPaidOut.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Lifetime earnings</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Commission Rate</h3>
              <i className="ri-percent-line text-xl text-blue-600"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{payoutStats.commissionRate}%</p>
            <p className="text-gray-600 text-sm">Platform fee</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
                { id: 'history', label: 'Payout History', icon: 'ri-history-line' },
                { id: 'earnings', label: 'Earnings Details', icon: 'ri-money-dollar-circle-line' },
                { id: 'methods', label: 'Payout Methods', icon: 'ri-bank-card-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Payout Schedule</h4>
                      <p className="text-sm text-blue-800">
                        Payouts are processed weekly. Your next scheduled payout is on{' '}
                        <strong>{new Date(payoutStats.nextPayoutDate).toLocaleDateString()}</strong>.
                        Minimum payout amount is ${payoutStats.minimumPayout}.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payouts</h3>
                    <div className="space-y-3">
                      {payoutHistory.slice(0, 3).map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">${payout.netAmount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{payout.method}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(payout.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}>
                            {payout.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Methods</h3>
                    <div className="space-y-3">
                      {payoutMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <i className={`${getMethodIcon(method.type)} text-xl text-gray-700`}></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{method.details}</p>
                              {method.isDefault && (
                                <span className="text-xs text-emerald-600 font-medium">Default</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowMethodModal(true)}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payoutHistory.map((payout) => (
                        <tr key={payout.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium text-gray-900">{payout.id}</p>
                            {payout.transactionId && (
                              <p className="text-xs text-gray-500">{payout.transactionId}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            ${payout.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-red-600">
                            -${payout.commission.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            ${payout.netAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {payout.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}>
                              {payout.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(payout.requestedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                      <option>All Status</option>
                      <option>Available</option>
                      <option>Pending</option>
                      <option>Paid Out</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Earning</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {earnings.map((earning) => (
                        <tr key={earning.orderId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {earning.orderId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {earning.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            ${earning.orderAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-red-600">
                            -${earning.commission.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                            ${earning.netEarning.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(earning.status)}`}>
                              {earning.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(earning.orderDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'methods' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {payoutMethods.map((method) => (
                    <div key={method.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <i className={`${getMethodIcon(method.type)} text-2xl text-gray-700`}></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{method.details}</p>
                            <p className="text-sm text-gray-600 capitalize">{method.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-100 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <Button variant="outline" className="flex-1">
                            Set as Default
                          </Button>
                        )}
                        <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowMethodModal(true)}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <i className="ri-add-line text-2xl mb-2"></i>
                  <p className="font-medium">Add New Payment Method</p>
                  <p className="text-sm">Bank account, mobile money, or PayPal</p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Request Payout</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Balance
                </label>
                <p className="text-3xl font-bold text-emerald-600">
                  ${payoutStats.availableBalance.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Amount
                </label>
                <Input
                  type="number"
                  placeholder={`Minimum $${payoutStats.minimumPayout}`}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  min={payoutStats.minimumPayout}
                  max={payoutStats.availableBalance}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: ${payoutStats.minimumPayout} • Maximum: ${payoutStats.availableBalance}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Method
                </label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select method</option>
                  {payoutMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.details} {method.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {payoutAmount && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payout Amount</span>
                    <span className="font-medium">${parseFloat(payoutAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commission ({payoutStats.commissionRate}%)</span>
                    <span className="text-red-600">
                      -${(parseFloat(payoutAmount) * payoutStats.commissionRate / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-medium text-gray-900">You'll Receive</span>
                    <span className="font-bold text-emerald-600">
                      ${(parseFloat(payoutAmount) * (1 - payoutStats.commissionRate / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowPayoutModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRequestPayout} className="flex-1">
                  Request Payout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Payment Method</h3>
              <button onClick={() => setShowMethodModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <i className="ri-bank-line text-2xl text-gray-700 mb-2"></i>
                  <p className="text-sm font-medium">Bank</p>
                </button>
                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <i className="ri-smartphone-line text-2xl text-gray-700 mb-2"></i>
                  <p className="text-sm font-medium">M-Pesa</p>
                </button>
                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <i className="ri-paypal-line text-2xl text-gray-700 mb-2"></i>
                  <p className="text-sm font-medium">PayPal</p>
                </button>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Select a payment method type to continue
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
