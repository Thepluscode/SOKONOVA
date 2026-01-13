import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import { useToast } from '../../../contexts/ToastContext';

interface FlashSale {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  discount: number;
  products: number;
  status: 'scheduled' | 'active' | 'ended';
  revenue: number;
}

export default function FlashSalesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'ended'>('active');
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    discount: '',
    products: [] as string[],
  });

  const flashSales: FlashSale[] = [
    {
      id: '1',
      name: 'Weekend Flash Sale',
      startDate: '2024-01-20 09:00',
      endDate: '2024-01-21 23:59',
      discount: 30,
      products: 45,
      status: 'active',
      revenue: 12450,
    },
    {
      id: '2',
      name: 'New Year Mega Sale',
      startDate: '2024-01-25 00:00',
      endDate: '2024-01-27 23:59',
      discount: 40,
      products: 120,
      status: 'scheduled',
      revenue: 0,
    },
    {
      id: '3',
      name: 'Holiday Special',
      startDate: '2024-01-10 10:00',
      endDate: '2024-01-12 22:00',
      discount: 25,
      products: 80,
      status: 'ended',
      revenue: 28900,
    },
  ];

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSale = {
      id: Date.now().toString(),
      name: formData.name,
      startDate: `${formData.startDate} ${formData.startTime}`,
      endDate: `${formData.endDate} ${formData.endTime}`,
      discount: parseInt(formData.discount),
      products: formData.products.length,
      status: 'scheduled' as const,
      revenue: 0,
    };

    // Save to localStorage
    const existingSales = JSON.parse(localStorage.getItem('flashSales') || '[]');
    existingSales.push(newSale);
    localStorage.setItem('flashSales', JSON.stringify(existingSales));

    // Reset form
    setFormData({
      name: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      discount: '',
      products: [],
    });
    setShowCreateModal(false);
    showToast({
      message: 'Flash sale created.',
      type: 'success',
    });
  };

  const filteredSales = flashSales.filter(sale => sale.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Flash Sales</h1>
            <p className="text-gray-600">Create and manage time-limited promotional campaigns</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <i className="ri-flashlight-line"></i>
            Create Flash Sale
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Sales', value: '1', icon: 'ri-flashlight-fill', color: 'from-orange-500 to-red-500' },
            { label: 'Scheduled', value: '1', icon: 'ri-calendar-line', color: 'from-blue-500 to-blue-600' },
            { label: 'Total Revenue', value: '$41,350', icon: 'ri-money-dollar-circle-line', color: 'from-emerald-500 to-emerald-600' },
            { label: 'Products on Sale', value: '45', icon: 'ri-shopping-bag-line', color: 'from-purple-500 to-purple-600' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center`}>
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'active', label: 'Active', icon: 'ri-flashlight-fill' },
              { id: 'scheduled', label: 'Scheduled', icon: 'ri-calendar-line' },
              { id: 'ended', label: 'Ended', icon: 'ri-check-line' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sales List */}
          <div className="p-6">
            {filteredSales.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-flashlight-line text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-600">No {activeTab} flash sales</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{sale.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              sale.status === 'active'
                                ? 'bg-orange-100 text-orange-700'
                                : sale.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Discount</p>
                            <p className="text-lg font-bold text-orange-600">{sale.discount}% OFF</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Products</p>
                            <p className="text-lg font-bold text-gray-900">{sale.products}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Start Date</p>
                            <p className="text-sm font-semibold text-gray-900">{sale.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">End Date</p>
                            <p className="text-sm font-semibold text-gray-900">{sale.endDate}</p>
                          </div>
                        </div>

                        {sale.status === 'ended' && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              ${sale.revenue.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                          <i className="ri-edit-line text-xl"></i>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                          <i className="ri-delete-bin-line text-xl"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create Flash Sale</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Weekend Flash Sale"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="30"
                    min="1"
                    max="90"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-orange-600 text-xl mt-0.5"></i>
                  <div className="text-sm text-orange-800">
                    <p className="font-semibold mb-1">Tips for successful flash sales:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Keep the duration short (24-48 hours) to create urgency</li>
                      <li>Offer significant discounts (25-50% off)</li>
                      <li>Promote heavily on social media before the sale starts</li>
                      <li>Ensure you have enough inventory to meet demand</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer"
                >
                  Create Flash Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
