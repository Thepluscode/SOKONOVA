import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function AdminAPIPartnersPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'requests'>('overview');

  const stats = [
    { label: 'Active Partners', value: '12', change: '+2', icon: 'ri-team-line', color: 'blue' },
    { label: 'API Calls (24h)', value: '1.2M', change: '+15%', icon: 'ri-code-box-line', color: 'emerald' },
    { label: 'Avg Response Time', value: '145ms', change: '-12ms', icon: 'ri-time-line', color: 'purple' },
    { label: 'Success Rate', value: '99.8%', change: '+0.1%', icon: 'ri-checkbox-circle-line', color: 'green' }
  ];

  const partners = [
    { id: 1, name: 'SwiftShip Logistics', type: 'Logistics', status: 'active', apiCalls: '450K', uptime: '99.9%', lastActive: '2m ago' },
    { id: 2, name: 'PayFast Gateway', type: 'Payment', status: 'active', apiCalls: '380K', uptime: '99.8%', lastActive: '5m ago' },
    { id: 3, name: 'MarketBoost Ads', type: 'Marketing', status: 'active', apiCalls: '220K', uptime: '99.7%', lastActive: '10m ago' },
    { id: 4, name: 'DataSync Analytics', type: 'Analytics', status: 'active', apiCalls: '150K', uptime: '99.9%', lastActive: '1h ago' },
    { id: 5, name: 'CloudStore API', type: 'Storage', status: 'maintenance', apiCalls: '0', uptime: '0%', lastActive: '3h ago' }
  ];

  const apiRequests = [
    { id: 1, partner: 'SwiftShip Logistics', endpoint: '/orders/create', method: 'POST', status: 200, time: '145ms', timestamp: '2m ago' },
    { id: 2, partner: 'PayFast Gateway', endpoint: '/payments/process', method: 'POST', status: 200, time: '234ms', timestamp: '3m ago' },
    { id: 3, partner: 'MarketBoost Ads', endpoint: '/campaigns/list', method: 'GET', status: 200, time: '89ms', timestamp: '5m ago' },
    { id: 4, partner: 'DataSync Analytics', endpoint: '/analytics/report', method: 'GET', status: 500, time: '1234ms', timestamp: '8m ago' },
    { id: 5, partner: 'SwiftShip Logistics', endpoint: '/tracking/update', method: 'PUT', status: 200, time: '167ms', timestamp: '10m ago' }
  ];

  const pendingApplications = [
    { id: 1, company: 'QuickDeliver Express', type: 'Logistics', submitted: '2 days ago', status: 'pending' },
    { id: 2, company: 'SecurePay Solutions', type: 'Payment', submitted: '5 days ago', status: 'under_review' },
    { id: 3, company: 'AdBoost Pro', type: 'Marketing', submitted: '1 week ago', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Partner Platform</h1>
            <p className="text-gray-600">Manage API integrations and partner access</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" className="whitespace-nowrap">
              <i className="ri-book-line mr-2"></i>
              API Docs
            </Button>
            <Button className="whitespace-nowrap">
              <i className="ri-add-line mr-2"></i>
              Add Partner
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-2xl text-${stat.color}-600`}></i>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('partners')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'partners'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Partners ({partners.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'requests'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                API Requests
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Active Partners */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Partners</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partners.filter(p => p.status === 'active').map((partner) => (
                      <div key={partner.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-600 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{partner.type}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">API Calls</span>
                            <span className="font-medium text-gray-900">{partner.apiCalls}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Uptime</span>
                            <span className="font-medium text-green-600">{partner.uptime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Applications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Applications</h3>
                  <div className="space-y-3">
                    {pendingApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{app.company}</p>
                          <p className="text-sm text-gray-600">{app.type} • Submitted {app.submitted}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="whitespace-nowrap">
                            Review
                          </Button>
                          <Button size="sm" className="whitespace-nowrap">
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'partners' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Calls</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uptime</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{partner.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {partner.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            partner.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {partner.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {partner.apiCalls}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={partner.status === 'active' ? 'text-green-600 font-medium' : 'text-gray-500'}>
                            {partner.uptime}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {partner.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                              <i className="ri-settings-3-line"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-700 cursor-pointer">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.partner}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{request.endpoint}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            request.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                            request.method === 'POST' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {request.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            request.status === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {request.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
