import { useState, useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import { useToast } from '../../../contexts/ToastContext';
import { adminService } from '../../../lib/services';
import { useRequireAuth } from '../../../lib/auth';

interface OrderData {
  id: string;
  customer: string;
  status: string;
  amount: string;
  items: number;
  date: string;
}

interface InventoryData {
  id: string;
  product: string;
  sku: string;
  stock: number;
  lowStock: boolean;
  category: string;
}

interface LogisticsData {
  id?: number;
  carrier: string;
  shipments: number;
  onTime: string;
  avgTime: string;
  status: string;
}

export default function AdminOpsPage() {
  useRequireAuth('ADMIN');

  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'commission' | 'orders' | 'inventory' | 'logistics'>('commission');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingLogistics, setLoadingLogistics] = useState(false);

  // Analytics data state
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [inventory, setInventory] = useState<InventoryData[]>([]);
  const [logistics, setLogistics] = useState<LogisticsData[]>([]);
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, inTransit: 0 });
  const [inventoryStats, setInventoryStats] = useState({ totalProducts: 0, lowStockCount: 0 });

  // Commission Settings State
  const [commissionSettings, setCommissionSettings] = useState({
    defaultRate: 12,
    fashionRate: 10,
    electronicsRate: 8,
    craftsRate: 15,
    jewelryRate: 12,
    homeRate: 10,
    minimumPayout: 50,
    payoutSchedule: 'weekly',
    transactionFee: 2.9,
    fixedFee: 0.30
  });

  useEffect(() => {
    adminService.getCommissionSettings()
      .then(data => {
        if (data) setCommissionSettings(data);
      })
      .catch(err => console.error('Failed to fetch commission settings:', err));
  }, []);

  // Fetch analytics data when tabs change
  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      adminService.getOrderAnalytics()
        .then(data => {
          if (data) {
            setOrders(data.recentOrders || []);
            setOrderStats({ totalOrders: data.totalOrders || 0, inTransit: data.inTransit || 0 });
          }
        })
        .catch(err => console.error('Failed to fetch order analytics:', err))
        .finally(() => setLoadingOrders(false));
    } else if (activeTab === 'inventory') {
      setLoadingInventory(true);
      adminService.getInventoryAnalytics()
        .then(data => {
          if (data) {
            setInventory(data.lowStockProducts || []);
            setInventoryStats({ totalProducts: data.totalProducts || 0, lowStockCount: data.lowStockCount || 0 });
          }
        })
        .catch(err => console.error('Failed to fetch inventory analytics:', err))
        .finally(() => setLoadingInventory(false));
    } else if (activeTab === 'logistics') {
      setLoadingLogistics(true);
      adminService.getLogisticsAnalytics()
        .then(data => {
          if (data?.carriers) {
            setLogistics(data.carriers.map((c: any, i: number) => ({ ...c, id: i + 1 })));
          }
        })
        .catch(err => console.error('Failed to fetch logistics analytics:', err))
        .finally(() => setLoadingLogistics(false));
    }
  }, [activeTab]);

  const handleSaveCommission = async () => {
    setSaving(true);
    try {
      await adminService.updateCommissionSettings(commissionSettings);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      showToast({ message: 'Commission settings saved!', type: 'success' });
    } catch (err: any) {
      console.error('Failed to save commission settings:', err);
      showToast({ message: err.message || 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations Dashboard</h1>
            <p className="text-gray-600">Manage commission rates, orders, inventory, and logistics</p>
          </div>
          <Button className="mt-4 sm:mt-0 whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>
            Export Report
          </Button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in-down">
            <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>
            <p className="text-green-800 font-medium">Commission settings saved successfully!</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-shopping-cart-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-xs font-medium text-green-600">+12%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">1,247</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-box-3-line text-2xl text-purple-600"></i>
              </div>
              <span className="text-xs font-medium text-red-600">-3%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-truck-line text-2xl text-green-600"></i>
              </div>
              <span className="text-xs font-medium text-green-600">+8%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">In Transit</p>
            <p className="text-2xl font-bold text-gray-900">456</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i className="ri-percent-line text-2xl text-emerald-600"></i>
              </div>
              <span className="text-xs font-medium text-gray-600">Current</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Avg Commission</p>
            <p className="text-2xl font-bold text-gray-900">{commissionSettings.defaultRate}%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 animate-scale-in">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('commission')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'commission'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <i className="ri-percent-line mr-2"></i>
                Commission Rates
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'orders'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'inventory'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('logistics')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'logistics'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Logistics
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'commission' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Commission Structure</h3>
                      <p className="text-sm text-blue-800">
                        Set your marketplace commission rates by category. These rates will be automatically applied to all seller transactions. Changes take effect immediately for new orders.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Commission Rates */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Category Commission Rates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Rate (All Categories)
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={commissionSettings.defaultRate}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, defaultRate: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="100"
                          step="0.5"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fashion & Apparel
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={commissionSettings.fashionRate}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, fashionRate: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="100"
                          step="0.5"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Electronics
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={commissionSettings.electronicsRate}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, electronicsRate: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="100"
                          step="0.5"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Handmade & Crafts
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={commissionSettings.craftsRate}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, craftsRate: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="100"
                          step="0.5"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jewelry & Accessories
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={commissionSettings.jewelryRate}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, jewelryRate: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="100"
                          step="0.5"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home & Living
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={commissionSettings.homeRate}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, homeRate: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="100"
                          step="0.5"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Processing Fees */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Processing Fees</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Fee
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={commissionSettings.transactionFee}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, transactionFee: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="10"
                          step="0.1"
                        />
                        <span className="text-gray-600 font-medium">%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Percentage fee per transaction</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fixed Fee
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">$</span>
                        <Input
                          type="number"
                          value={commissionSettings.fixedFee}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, fixedFee: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          max="5"
                          step="0.05"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Fixed fee per transaction</p>
                    </div>
                  </div>
                </div>

                {/* Payout Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payout Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Payout Amount
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">$</span>
                        <Input
                          type="number"
                          value={commissionSettings.minimumPayout}
                          onChange={(e) => setCommissionSettings({ ...commissionSettings, minimumPayout: parseFloat(e.target.value) })}
                          className="flex-1"
                          min="0"
                          step="10"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimum balance required for payout</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payout Schedule
                      </label>
                      <select
                        value={commissionSettings.payoutSchedule}
                        onChange={(e) => setCommissionSettings({ ...commissionSettings, payoutSchedule: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">How often sellers receive payouts</p>
                    </div>
                  </div>
                </div>

                {/* Commission Calculator */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Commission Calculator</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Sale Amount: $100</p>
                      <p className="text-sm text-gray-600 mb-1">Commission ({commissionSettings.defaultRate}%): ${(100 * commissionSettings.defaultRate / 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mb-1">Processing Fee: ${(100 * commissionSettings.transactionFee / 100 + commissionSettings.fixedFee).toFixed(2)}</p>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <p className="font-bold text-emerald-600">Seller Receives: ${(100 - (100 * commissionSettings.defaultRate / 100) - (100 * commissionSettings.transactionFee / 100 + commissionSettings.fixedFee)).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Sale Amount: $500</p>
                      <p className="text-sm text-gray-600 mb-1">Commission ({commissionSettings.defaultRate}%): ${(500 * commissionSettings.defaultRate / 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mb-1">Processing Fee: ${(500 * commissionSettings.transactionFee / 100 + commissionSettings.fixedFee).toFixed(2)}</p>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <p className="font-bold text-emerald-600">Seller Receives: ${(500 - (500 * commissionSettings.defaultRate / 100) - (500 * commissionSettings.transactionFee / 100 + commissionSettings.fixedFee)).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Sale Amount: $1,000</p>
                      <p className="text-sm text-gray-600 mb-1">Commission ({commissionSettings.defaultRate}%): ${(1000 * commissionSettings.defaultRate / 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mb-1">Processing Fee: ${(1000 * commissionSettings.transactionFee / 100 + commissionSettings.fixedFee).toFixed(2)}</p>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <p className="font-bold text-emerald-600">Seller Receives: ${(1000 - (1000 * commissionSettings.defaultRate / 100) - (1000 * commissionSettings.transactionFee / 100 + commissionSettings.fixedFee)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveCommission} className="whitespace-nowrap">
                    <i className="ri-save-line mr-2"></i>
                    Save Commission Settings
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-gray-50 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-semibold ${item.lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.lowStock ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Restock
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'logistics' && (
              <div className="space-y-4">
                {logistics.map((carrier, index) => (
                  <div
                    key={carrier.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{carrier.carrier}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${carrier.status === 'excellent'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {carrier.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Shipments</p>
                        <p className="text-2xl font-bold text-gray-900">{carrier.shipments}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">On-Time Delivery</p>
                        <p className="text-2xl font-bold text-green-600">{carrier.onTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Avg Delivery Time</p>
                        <p className="text-2xl font-bold text-gray-900">{carrier.avgTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
