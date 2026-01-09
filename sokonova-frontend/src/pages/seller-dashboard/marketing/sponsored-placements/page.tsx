import { useState } from 'react';
import Header from '../../../../components/feature/Header';
import Footer from '../../../../components/feature/Footer';
import Button from '../../../../components/base/Button';
import Input from '../../../../components/base/Input';

export default function SellerSponsoredPlacementsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'completed'>('active');

  const campaigns = {
    active: [
      { id: 1, name: 'Summer Sale Campaign', product: 'Handwoven Basket', budget: '$200', spent: '$145', clicks: 456, conversions: 23, ctr: '5.0%', status: 'active', daysLeft: 5 },
      { id: 2, name: 'New Arrivals Promo', product: 'Ceramic Vase', budget: '$150', spent: '$89', clicks: 234, conversions: 12, ctr: '5.1%', status: 'active', daysLeft: 12 }
    ],
    scheduled: [
      { id: 3, name: 'Holiday Special', product: 'Gift Set', budget: '$300', spent: '$0', clicks: 0, conversions: 0, ctr: '0%', status: 'scheduled', startDate: '2024-12-15' }
    ],
    completed: [
      { id: 4, name: 'Spring Collection', product: 'Textile Art', budget: '$250', spent: '$250', clicks: 1234, conversions: 67, ctr: '5.4%', status: 'completed', endDate: '2024-03-31' }
    ]
  };

  const stats = [
    { label: 'Total Spent', value: '$234', icon: 'ri-money-dollar-circle-line', color: 'emerald' },
    { label: 'Total Clicks', value: '690', icon: 'ri-cursor-line', color: 'blue' },
    { label: 'Conversions', value: '35', icon: 'ri-shopping-cart-line', color: 'purple' },
    { label: 'Avg CTR', value: '5.0%', icon: 'ri-line-chart-line', color: 'orange' }
  ];

  const topProducts = [
    { name: 'Handwoven Basket', clicks: 456, conversions: 23, revenue: '$1,150', roi: '245%' },
    { name: 'Ceramic Vase', clicks: 234, conversions: 12, revenue: '$600', roi: '198%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sponsored Placements</h1>
            <p className="text-gray-600">Boost your products with targeted advertising</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="whitespace-nowrap mt-4 sm:mt-0">
            <i className="ri-add-line mr-2"></i>
            Create Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${stat.icon} text-2xl text-${stat.color}-600`}></i>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaigns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                      activeTab === 'active'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Active ({campaigns.active.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('scheduled')}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                      activeTab === 'scheduled'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Scheduled ({campaigns.scheduled.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('completed')}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                      activeTab === 'completed'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Completed ({campaigns.completed.length})
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {campaigns[activeTab].map((campaign) => (
                    <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-600 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">{campaign.product}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                          campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Budget</p>
                          <p className="text-sm font-semibold text-gray-900">{campaign.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Spent</p>
                          <p className="text-sm font-semibold text-gray-900">{campaign.spent}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Clicks</p>
                          <p className="text-sm font-semibold text-gray-900">{campaign.clicks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">CTR</p>
                          <p className="text-sm font-semibold text-emerald-600">{campaign.ctr}</p>
                        </div>
                      </div>

                      {campaign.status === 'active' && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-600">{campaign.daysLeft} days remaining</span>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="whitespace-nowrap">
                              <i className="ri-pause-circle-line mr-2"></i>
                              Pause
                            </Button>
                            <Button size="sm" variant="outline" className="whitespace-nowrap">
                              <i className="ri-bar-chart-line mr-2"></i>
                              Analytics
                            </Button>
                          </div>
                        </div>
                      )}

                      {campaign.status === 'scheduled' && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Starts: {campaign.startDate}</span>
                          <Button size="sm" variant="outline" className="whitespace-nowrap">
                            <i className="ri-edit-line mr-2"></i>
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {campaigns[activeTab].length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-megaphone-line text-4xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                      <p className="text-gray-600 mb-4">Create your first campaign to boost your products</p>
                      <Button onClick={() => setShowCreateModal(true)} className="whitespace-nowrap">
                        <i className="ri-add-line mr-2"></i>
                        Create Campaign
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Top Performing Products */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">{product.name}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Clicks</span>
                        <span className="font-medium text-gray-900">{product.clicks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Conversions</span>
                        <span className="font-medium text-gray-900">{product.conversions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-medium text-emerald-600">{product.revenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">ROI</span>
                        <span className="font-medium text-green-600">{product.roi}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <i className="ri-lightbulb-line text-emerald-600 mt-0.5"></i>
                  <span>Start with a small budget and scale up based on performance</span>
                </div>
                <div className="flex items-start space-x-2">
                  <i className="ri-lightbulb-line text-emerald-600 mt-0.5"></i>
                  <span>Use high-quality product images for better click-through rates</span>
                </div>
                <div className="flex items-start space-x-2">
                  <i className="ri-lightbulb-line text-emerald-600 mt-0.5"></i>
                  <span>Target specific categories or regions for better results</span>
                </div>
                <div className="flex items-start space-x-2">
                  <i className="ri-lightbulb-line text-emerald-600 mt-0.5"></i>
                  <span>Monitor your campaigns daily and adjust as needed</span>
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Balance</span>
                  <span className="text-lg font-bold text-gray-900">$500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Campaigns</span>
                  <span className="text-sm font-medium text-gray-900">$234</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="text-lg font-bold text-emerald-600">$266</span>
                </div>
                <Button variant="outline" className="w-full whitespace-nowrap mt-3">
                  <i className="ri-add-line mr-2"></i>
                  Add Funds
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create Campaign</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <Input type="text" placeholder="e.g., Summer Sale Campaign" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>Handwoven Basket</option>
                    <option>Ceramic Vase</option>
                    <option>Textile Art</option>
                    <option>Gift Set</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Budget</label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <Input type="number" placeholder="7" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>All Regions</option>
                    <option>Lagos, Nigeria</option>
                    <option>Nairobi, Kenya</option>
                    <option>Accra, Ghana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="type" className="w-4 h-4 text-emerald-600" defaultChecked />
                      <div>
                        <p className="font-medium text-gray-900">Featured Listing</p>
                        <p className="text-sm text-gray-600">Show your product at the top of search results</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="type" className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-medium text-gray-900">Homepage Banner</p>
                        <p className="text-sm text-gray-600">Display your product on the homepage</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Campaign Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Daily Budget</span>
                      <span className="font-medium text-gray-900">$50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium text-gray-900">7 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Platform Fee (15%)</span>
                      <span className="font-medium text-gray-900">$52.50</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total Cost</span>
                      <span className="text-lg font-bold text-gray-900">$402.50</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 whitespace-nowrap">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 whitespace-nowrap">
                    <i className="ri-rocket-line mr-2"></i>
                    Launch Campaign
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
