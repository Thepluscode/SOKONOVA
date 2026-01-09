
import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function AdminSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'plans'>('overview');

  const stats = [
    { label: 'Total Subscribers', value: '1,234', change: '+12%', icon: 'ri-user-star-line', color: 'blue' },
    { label: 'Monthly Revenue', value: '$45,678', change: '+18%', icon: 'ri-money-dollar-circle-line', color: 'emerald' },
    { label: 'Churn Rate', value: '2.3%', change: '-0.5%', icon: 'ri-arrow-down-circle-line', color: 'red' },
    { label: 'Avg LTV', value: '$890', change: '+8%', icon: 'ri-line-chart-line', color: 'purple' }
  ];

  const planDistribution = [
    { plan: 'Free', subscribers: 456, revenue: '$0', percentage: '37%', color: 'gray' },
    { plan: 'Pro', subscribers: 678, revenue: '$33,900', percentage: '55%', color: 'blue' },
    { plan: 'Enterprise', subscribers: 100, revenue: '$11,778', percentage: '8%', color: 'purple' }
  ];

  const recentSubscribers = [
    { id: 1, name: 'Fashion Hub', email: 'contact@fashionhub.com', plan: 'Pro', status: 'active', joined: '2 days ago', mrr: '$50' },
    { id: 2, name: 'Tech Gadgets', email: 'info@techgadgets.com', plan: 'Enterprise', status: 'active', joined: '5 days ago', mrr: '$150' },
    { id: 3, name: 'Home Essentials', email: 'hello@homeessentials.com', plan: 'Pro', status: 'active', joined: '1 week ago', mrr: '$50' },
    { id: 4, name: 'Beauty Store', email: 'support@beautystore.com', plan: 'Pro', status: 'trial', joined: '2 weeks ago', mrr: '$0' },
    { id: 5, name: 'Sports Gear', email: 'contact@sportsgear.com', plan: 'Free', status: 'active', joined: '3 weeks ago', mrr: '$0' }
  ];

  const subscriptionPlans = [
    { 
      id: 1, 
      name: 'Free', 
      price: '$0', 
      interval: 'forever', 
      features: ['5 products', 'Basic analytics', 'Email support'],
      subscribers: 456,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Pro', 
      price: '$50', 
      interval: 'month', 
      features: ['Unlimited products', 'Advanced analytics', 'Priority support', 'Featured listings'],
      subscribers: 678,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Enterprise', 
      price: '$150', 
      interval: 'month', 
      features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'API access'],
      subscribers: 100,
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
            <p className="text-gray-600">Monitor and manage seller subscriptions</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" className="whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </Button>
            <Button className="whitespace-nowrap">
              <i className="ri-add-line mr-2"></i>
              Create Plan
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
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
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
                onClick={() => setActiveTab('subscribers')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'subscribers'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Subscribers
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'plans'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Plans
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Plan Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
                  <div className="space-y-4">
                    {planDistribution.map((plan, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{plan.plan}</h4>
                            <p className="text-sm text-gray-600">{plan.subscribers} subscribers • {plan.percentage}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{plan.revenue}</p>
                            <p className="text-sm text-gray-600">Monthly Revenue</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${plan.color}-600 h-2 rounded-full`}
                            style={{ width: plan.percentage }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Trend */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">$45,678</p>
                        <p className="text-sm text-green-600 mt-1">+18% from last month</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Last Month</p>
                        <p className="text-2xl font-bold text-gray-900">$38,710</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Projected Next Month</p>
                        <p className="text-2xl font-bold text-gray-900">$53,900</p>
                        <p className="text-sm text-blue-600 mt-1">Based on current growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{subscriber.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            subscriber.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                            subscriber.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {subscriber.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            subscriber.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {subscriber.mrr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscriber.joined}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                              <i className="ri-edit-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-lg border-2 border-gray-200 hover:border-emerald-600 transition-all p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {plan.status}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 ml-2">/{plan.interval}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{plan.subscribers} active subscribers</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <i className="ri-checkbox-circle-fill text-emerald-600 mt-0.5"></i>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full whitespace-nowrap">
                        <i className="ri-edit-line mr-2"></i>
                        Edit Plan
                      </Button>
                      <Button variant="outline" className="w-full whitespace-nowrap">
                        <i className="ri-bar-chart-line mr-2"></i>
                        View Analytics
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
