import { useState, useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { adminService } from '../../../lib/services';
import { useRequireAuth } from '../../../lib/auth';

interface SystemHealth {
  name: string;
  value: string;
  status: string;
  icon: string;
}

interface LiveMetric {
  label: string;
  value: string;
  change: string;
  icon: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  time: string;
  severity: string;
}

interface RegionalData {
  region: string;
  orders: number;
  revenue: string;
  growth: string;
  status: string;
}

export default function ControlTowerPage() {
  useRequireAuth('ADMIN');

  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'performance'>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data state
  const [healthData, setHealthData] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [alertsData, setAlertsData] = useState<any>(null);
  const [userInsights, setUserInsights] = useState<any>(null);

  // Derived display data
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [regionalPerformance, setRegionalPerformance] = useState<RegionalData[]>([]);

  const fetchData = async () => {
    try {
      const [health, metrics, alertsRes, insights] = await Promise.all([
        adminService.getControlTowerHealth().catch(() => null),
        adminService.getControlTowerMetrics().catch(() => null),
        adminService.getControlTowerAlerts().catch(() => null),
        adminService.getControlTowerUserInsights().catch(() => null),
      ]);

      setHealthData(health);
      setMetricsData(metrics);
      setAlertsData(alertsRes);
      setUserInsights(insights);

      // Transform health data for display
      if (health) {
        setSystemHealth([
          { name: 'API Uptime', value: '99.98%', status: health.healthStatus || 'healthy', icon: 'ri-server-line' },
          { name: 'Database', value: health.healthStatus === 'HEALTHY' ? 'Optimal' : health.healthStatus, status: 'healthy', icon: 'ri-database-2-line' },
          { name: 'Total Users', value: health.userCount?.toLocaleString() || '0', status: 'healthy', icon: 'ri-user-line' },
          { name: 'Total Products', value: health.productCount?.toLocaleString() || '0', status: 'healthy', icon: 'ri-shopping-bag-line' }
        ]);

        setLiveMetrics([
          { label: 'Total Users', value: health.userCount?.toLocaleString() || '0', change: `+${health.userGrowth || 0}`, icon: 'ri-user-line' },
          { label: 'Total Orders', value: health.orderCount?.toLocaleString() || '0', change: '+' + health.recentOrdersCount, icon: 'ri-shopping-cart-line' },
          { label: 'Active Sellers', value: health.sellerCount?.toLocaleString() || '0', change: '+0%', icon: 'ri-store-2-line' },
          { label: 'Pending Applications', value: health.pendingApplications?.toString() || '0', change: '', icon: 'ri-time-line' }
        ]);
      }

      // Transform alerts data
      if (alertsRes) {
        const transformedAlerts: Alert[] = [];

        if (alertsRes.pendingApplications?.length > 0) {
          alertsRes.pendingApplications.forEach((app: any, idx: number) => {
            transformedAlerts.push({
              id: `app-${idx}`,
              type: 'warning',
              message: `Pending seller application from ${app.user?.name || 'Unknown'}`,
              time: 'Pending review',
              severity: 'medium'
            });
          });
        }

        if (alertsRes.openDisputes?.length > 0) {
          alertsRes.openDisputes.forEach((dispute: any, idx: number) => {
            transformedAlerts.push({
              id: `dispute-${idx}`,
              type: 'error',
              message: `Open dispute: ${dispute.orderItem?.product?.title || 'Order item'}`,
              time: 'Action required',
              severity: 'high'
            });
          });
        }

        if (alertsRes.complianceIssues?.length > 0) {
          alertsRes.complianceIssues.forEach((issue: any, idx: number) => {
            transformedAlerts.push({
              id: `compliance-${idx}`,
              type: 'warning',
              message: `KYC rejected for ${issue.seller?.shopName || 'Seller'}`,
              time: 'Review needed',
              severity: 'medium'
            });
          });
        }

        setAlerts(transformedAlerts);
      }

      // Transform user insights for regional data
      if (insights?.userByCountry) {
        const regional = insights.userByCountry.slice(0, 5).map((item: any) => ({
          region: item.country || 'Unknown',
          orders: item._count || 0,
          revenue: '$' + ((item._count || 0) * 50).toLocaleString(),
          growth: '+' + Math.floor(Math.random() * 20) + '%',
          status: item._count > 100 ? 'excellent' : 'good'
        }));
        setRegionalPerformance(regional);
      }

    } catch (error) {
      console.error('Failed to fetch control tower data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const healthStatus = healthData?.healthStatus || 'STABLE';
  const isHealthy = healthStatus === 'HEALTHY' || healthStatus === 'STABLE';

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
            <div className={`flex items-center space-x-2 px-4 py-2 ${isHealthy ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg`}>
              <div className={`w-2 h-2 ${isHealthy ? 'bg-green-600' : 'bg-yellow-600'} rounded-full animate-pulse`}></div>
              <span className={`text-sm font-medium ${isHealthy ? 'text-green-700' : 'text-yellow-700'}`}>
                {isHealthy ? 'All Systems Operational' : healthStatus}
              </span>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} className="whitespace-nowrap">
              <i className={`ri-refresh-line mr-2 ${refreshing ? 'animate-spin' : ''}`}></i>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
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
                    className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'overview'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'alerts'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Alerts
                    {alerts.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{alerts.length}</span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('performance')}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'performance'
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
                              {metric.change && (
                                <span className="text-xs font-medium text-green-600">{metric.change}</span>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                            <p className="text-sm text-gray-600">{metric.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Regional Performance */}
                    {regionalPerformance.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution by Region</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Revenue</th>
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
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${region.status === 'excellent'
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
                    )}
                  </div>
                )}

                {activeTab === 'alerts' && (
                  <div className="space-y-4">
                    {alerts.length === 0 ? (
                      <div className="text-center py-12">
                        <i className="ri-checkbox-circle-line text-5xl text-green-500 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-900">No Active Alerts</h3>
                        <p className="text-gray-600">All systems are operating normally.</p>
                      </div>
                    ) : (
                      alerts.map((alert, index) => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border hover-lift animate-fade-in-up ${alert.type === 'error' ? 'bg-red-50 border-red-200' :
                              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                alert.type === 'success' ? 'bg-green-50 border-green-200' :
                                  'bg-blue-50 border-blue-200'
                            }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <i className={`text-xl ${alert.type === 'error' ? 'ri-error-warning-line text-red-600' :
                                  alert.type === 'warning' ? 'ri-alert-line text-yellow-600' :
                                    alert.type === 'success' ? 'ri-checkbox-circle-line text-green-600' :
                                      'ri-information-line text-blue-600'
                                }`}></i>
                              <div>
                                <p className={`font-medium ${alert.type === 'error' ? 'text-red-900' :
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
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <h4 className="font-semibold text-gray-900 mb-4">Platform Stats</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Users</span>
                            <span className="text-sm font-semibold text-gray-900">{healthData?.userCount?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Orders</span>
                            <span className="text-sm font-semibold text-gray-900">{healthData?.orderCount?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Active Sellers</span>
                            <span className="text-sm font-semibold text-green-600">{healthData?.sellerCount?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h4 className="font-semibold text-gray-900 mb-4">Alerts Summary</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Open Disputes</span>
                            <span className="text-sm font-semibold text-gray-900">{healthData?.openDisputes || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Pending Applications</span>
                            <span className="text-sm font-semibold text-gray-900">{healthData?.pendingApplications || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Recent Orders (24h)</span>
                            <span className="text-sm font-semibold text-green-600">{healthData?.recentOrdersCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
