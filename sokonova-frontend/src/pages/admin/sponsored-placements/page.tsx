import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function AdminSponsoredPlacementsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active');

  const activeCampaigns = [
    {
      id: 1,
      seller: 'Premium Electronics',
      product: 'iPhone 15 Pro Max',
      placement: 'Homepage Hero',
      budget: '$500',
      spent: '$342',
      impressions: '45,678',
      clicks: '2,345',
      ctr: '5.1%',
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      status: 'active'
    },
    {
      id: 2,
      seller: 'Fashion House',
      product: 'Designer Handbag Collection',
      placement: 'Category Top',
      budget: '$300',
      spent: '$198',
      impressions: '23,456',
      clicks: '1,234',
      ctr: '5.3%',
      startDate: '2024-01-12',
      endDate: '2024-01-22',
      status: 'active'
    }
  ];

  const pendingCampaigns = [
    {
      id: 3,
      seller: 'Artisan Crafts',
      product: 'Handmade Pottery Set',
      placement: 'Search Results',
      budget: '$200',
      requestDate: '2024-01-15',
      status: 'pending'
    }
  ];

  const completedCampaigns = [
    {
      id: 4,
      seller: 'Tech Hub',
      product: 'Wireless Earbuds',
      placement: 'Homepage Banner',
      budget: '$400',
      spent: '$400',
      impressions: '67,890',
      clicks: '3,456',
      ctr: '5.1%',
      roi: '245%',
      completedDate: '2024-01-08'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sponsored Placements</h1>
            <p className="text-gray-600">Manage and monitor advertising campaigns</p>
          </div>
          <Button className="mt-4 sm:mt-0 whitespace-nowrap">
            <i className="ri-add-line mr-2"></i>
            Create Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-advertisement-line text-2xl text-green-600"></i>
              </div>
              <span className="text-xs font-medium text-green-600">+8</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Active Campaigns</p>
            <p className="text-2xl font-bold text-gray-900">{activeCampaigns.length}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-xs font-medium text-blue-600">+15%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">$12,450</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-eye-line text-2xl text-purple-600"></i>
              </div>
              <span className="text-xs font-medium text-purple-600">+23%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Impressions</p>
            <p className="text-2xl font-bold text-gray-900">234K</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-cursor-line text-2xl text-orange-600"></i>
              </div>
              <span className="text-xs font-medium text-orange-600">+12%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Avg CTR</p>
            <p className="text-2xl font-bold text-gray-900">5.2%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 animate-scale-in">
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
                Active
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {activeCampaigns.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'pending'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Approval
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'completed'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'active' && (
              <div className="space-y-6">
                {activeCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{campaign.product}</h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Active
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{campaign.seller}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Placement</p>
                            <p className="font-semibold text-gray-900">{campaign.placement}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Budget / Spent</p>
                            <p className="font-semibold text-gray-900">{campaign.budget} / {campaign.spent}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Duration</p>
                            <p className="font-semibold text-gray-900">{campaign.startDate} - {campaign.endDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">CTR</p>
                            <p className="font-semibold text-green-600">{campaign.ctr}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Impressions</p>
                            <p className="text-xl font-bold text-blue-600">{campaign.impressions}</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Clicks</p>
                            <p className="text-xl font-bold text-purple-600">{campaign.clicks}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50 whitespace-nowrap">
                          Pause
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{campaign.product}</h3>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                            Pending
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{campaign.seller}</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Placement</p>
                            <p className="font-semibold text-gray-900">{campaign.placement}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Budget</p>
                            <p className="font-semibold text-gray-900">{campaign.budget}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Requested</p>
                            <p className="font-semibold text-gray-900">{campaign.requestDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50 whitespace-nowrap">
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {completedCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{campaign.product}</h3>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                            Completed
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{campaign.seller}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Placement</p>
                            <p className="font-semibold text-gray-900">{campaign.placement}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Spent</p>
                            <p className="font-semibold text-gray-900">{campaign.spent}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Impressions</p>
                            <p className="font-semibold text-gray-900">{campaign.impressions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CTR</p>
                            <p className="font-semibold text-green-600">{campaign.ctr}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ROI</p>
                            <p className="font-semibold text-green-600">{campaign.roi}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        View Report
                      </Button>
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
