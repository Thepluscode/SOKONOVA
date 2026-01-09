import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function ControlTowerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'performance'>('overview');

  const systemHealth = [
    { name: 'API Uptime', value: '99.98%', status: 'healthy', icon: 'ri-server-line' },
    { name: 'Database', value: 'Optimal', status: 'healthy', icon: 'ri-database-2-line' },
    { name: 'Payment Gateway', value: 'Active', status: 'healthy', icon: 'ri-bank-card-line' },
    { name: 'CDN', value: '45ms avg', status: 'healthy', icon: 'ri-global-line' }
  ];

  const liveMetrics = [
    { label: 'Active Users', value: '2,847', change: '+12%', icon: 'ri-user-line' },
    { label: 'Orders/Hour', value: '156', change: '+8%', icon: 'ri-shopping-cart-line' },
    { label: 'Revenue/Hour', value: '$12,450', change: '+15%', icon: 'ri-money-dollar-circle-line' },
    { label: 'Avg Response Time', value: '234ms', change: '-5%', icon: 'ri-time-line' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'High traffic detected in Lagos region', time: '5m ago', severity: 'medium' },
    { id: 2, type: 'info', message: 'Scheduled maintenance in 2 hours', time: '15m ago', severity: 'low' },
    { id: 3, type: 'error', message: 'Payment gateway timeout spike', time: '1h ago', severity: 'high' },
    { id: 4, type: 'success', message: 'Database backup completed', time: '2h ago', severity: 'low' }
  ];

  const regionalPerformance = [
    { region: 'Lagos', orders: 1234, revenue: '$45,678', growth: '+12%', status: 'excellent' },
    { region: 'Nairobi', orders: 987, revenue: '$38,456', growth: '+8%', status: 'good' },
    { region: 'Accra', orders: 756, revenue: '$28,934', growth: '+15%', status: 'excellent' },
    { region: 'Cairo', orders: 654, revenue: '$25,123', growth: '+5%', status: 'good' },
    { region: 'Johannesburg', orders: 543, revenue: '$21,456', growth: '+10%', status: 'good' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Control Tower</h1>
            <p className="text-gray-600">Real-time platform monitoring and operations</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">All Systems Operational</span>
            </div>
            <Button className="whitespace-nowrap">
              <i className="ri-refresh-line mr-2"></i>
              Refresh
            </Button>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemHealth.map((system, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className={`${system.icon} text-2xl text-green-600`}></i>
                </div>
                <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{system.name}</h3>
              <p className="text-xl font-bold text-gray-900">{system.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 animate-scale-in">
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
                onClick={() => setActiveTab('alerts')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'alerts'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Alerts
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">3</span>
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'performance'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Performance
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Live Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {liveMetrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex items-center justify-between mb-2">
                          <i className={`${metric.icon} text-xl text-gray-600`}></i>
                          <span className="text-xs font-medium text-green-600">{metric.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                        <p className="text-sm text-gray-600">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {regionalPerformance.map((region, index) => (
                          <tr key={index} className="hover:bg-gray-50 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{region.region}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{region.orders}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{region.revenue}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-green-600 font-medium">{region.growth}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                region.status === 'excellent' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {region.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border hover-lift animate-fade-in-up ${
                      alert.type === 'error' ? 'bg-red-50 border-red-200' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      alert.type === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <i className={`text-xl ${
                          alert.type === 'error' ? 'ri-error-warning-line text-red-600' :
                          alert.type === 'warning' ? 'ri-alert-line text-yellow-600' :
                          alert.type === 'success' ? 'ri-checkbox-circle-line text-green-600' :
                          'ri-information-line text-blue-600'
                        }`}></i>
                        <div>
                          <p className={`font-medium ${
                            alert.type === 'error' ? 'text-red-900' :
                            alert.type === 'warning' ? 'text-yellow-900' :
                            alert.type === 'success' ? 'text-green-900' :
                            'text-blue-900'
                          }`}>
                            {alert.message}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{alert.time}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h4 className="font-semibold text-gray-900 mb-4">API Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Response Time</span>
                        <span className="text-sm font-semibold text-gray-900">234ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="text-sm font-semibold text-green-600">99.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Requests/Min</span>
                        <span className="text-sm font-semibold text-gray-900">1,247</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <h4 className="font-semibold text-gray-900 mb-4">Database Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Query Time</span>
                        <span className="text-sm font-semibold text-gray-900">45ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Connection Pool</span>
                        <span className="text-sm font-semibold text-gray-900">78/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cache Hit Rate</span>
                        <span className="text-sm font-semibold text-green-600">94.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
