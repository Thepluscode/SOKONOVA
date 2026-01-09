import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('7days');

  const features = [
    {
      icon: 'ri-line-chart-line',
      title: 'Sales Analytics',
      description: 'Track revenue, orders, and conversion rates in real-time',
      metrics: ['Revenue trends', 'Order volume', 'Average order value', 'Conversion rates']
    },
    {
      icon: 'ri-user-line',
      title: 'Customer Insights',
      description: 'Understand your customers and their buying behavior',
      metrics: ['Customer demographics', 'Purchase patterns', 'Repeat customer rate', 'Customer lifetime value']
    },
    {
      icon: 'ri-shopping-bag-line',
      title: 'Product Performance',
      description: 'See which products are driving your business',
      metrics: ['Top selling items', 'Product views', 'Add-to-cart rate', 'Stock turnover']
    },
    {
      icon: 'ri-map-pin-line',
      title: 'Geographic Data',
      description: 'Discover where your customers are located',
      metrics: ['Sales by region', 'Shipping destinations', 'Market penetration', 'Growth opportunities']
    },
    {
      icon: 'ri-time-line',
      title: 'Time-based Trends',
      description: 'Identify peak selling times and seasonal patterns',
      metrics: ['Hourly traffic', 'Daily sales patterns', 'Seasonal trends', 'Year-over-year growth']
    },
    {
      icon: 'ri-advertisement-line',
      title: 'Marketing ROI',
      description: 'Measure the effectiveness of your marketing efforts',
      metrics: ['Campaign performance', 'Traffic sources', 'Ad spend ROI', 'Customer acquisition cost']
    }
  ];

  const dashboardPreview = [
    {
      metric: 'Total Revenue',
      value: '$24,580',
      change: '+12.5%',
      trend: 'up',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      metric: 'Orders',
      value: '1,247',
      change: '+8.3%',
      trend: 'up',
      icon: 'ri-shopping-cart-line'
    },
    {
      metric: 'Conversion Rate',
      value: '3.2%',
      change: '+0.4%',
      trend: 'up',
      icon: 'ri-percent-line'
    },
    {
      metric: 'Avg Order Value',
      value: '$19.70',
      change: '-2.1%',
      trend: 'down',
      icon: 'ri-price-tag-3-line'
    }
  ];

  const reports = [
    {
      name: 'Sales Report',
      description: 'Comprehensive breakdown of all sales activity',
      frequency: 'Daily, Weekly, Monthly',
      icon: 'ri-file-chart-line'
    },
    {
      name: 'Inventory Report',
      description: 'Stock levels, turnover rates, and reorder alerts',
      frequency: 'Real-time',
      icon: 'ri-archive-line'
    },
    {
      name: 'Customer Report',
      description: 'Customer acquisition, retention, and behavior',
      frequency: 'Weekly, Monthly',
      icon: 'ri-group-line'
    },
    {
      name: 'Financial Report',
      description: 'Revenue, expenses, profit margins, and payouts',
      frequency: 'Monthly, Quarterly',
      icon: 'ri-calculator-line'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-100 rounded-full mb-6">
            <i className="ri-bar-chart-box-line text-4xl text-violet-600"></i>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Analytics & Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Make data-driven decisions with comprehensive analytics. Track every aspect of your 
            business and discover opportunities for growth.
          </p>
          <button 
            onClick={() => navigate('/seller-dashboard/analytics')}
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all whitespace-nowrap cursor-pointer"
          >
            View Your Dashboard
          </button>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Real-Time Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {dashboardPreview.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    item.trend === 'up' ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    <i className={`${item.icon} text-2xl ${
                      item.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}></i>
                  </div>
                  <span className={`text-sm font-semibold ${
                    item.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1">{item.value}</div>
                <div className="text-sm text-gray-600">{item.metric}</div>
              </div>
            ))}
          </div>

          {/* Chart Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Revenue Overview</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeRange('7days')}
                  className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    timeRange === '7days' 
                      ? 'bg-violet-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setTimeRange('30days')}
                  className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    timeRange === '30days' 
                      ? 'bg-violet-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  30 Days
                </button>
                <button 
                  onClick={() => setTimeRange('90days')}
                  className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    timeRange === '90days' 
                      ? 'bg-violet-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  90 Days
                </button>
              </div>
            </div>
            
            {/* Simplified Chart Visualization */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 45, 78, 52, 88, 72, 95].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-violet-600 to-purple-500 rounded-t-lg transition-all hover:from-violet-700 hover:to-purple-600 cursor-pointer"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Comprehensive Analytics Features</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to understand and grow your business
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                  <i className={`${feature.icon} text-2xl text-violet-600`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.metrics.map((metric, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <i className="ri-check-line text-violet-600 mr-2"></i>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Automated Reports</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg flex items-start space-x-4">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`${report.icon} text-2xl text-violet-600`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{report.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{report.frequency}</span>
                    <button 
                      onClick={() => navigate('/seller-dashboard/analytics')}
                      className="text-violet-600 text-sm font-semibold hover:text-violet-700 whitespace-nowrap cursor-pointer"
                    >
                      Generate Report →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Analytics Matter</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Increase Sales',
                description: 'Identify your best-selling products and optimize your inventory to maximize revenue.',
                icon: 'ri-arrow-up-line',
                color: 'emerald'
              },
              {
                title: 'Reduce Costs',
                description: 'Spot inefficiencies and reduce waste by understanding what\'s not working.',
                icon: 'ri-arrow-down-line',
                color: 'blue'
              },
              {
                title: 'Grow Faster',
                description: 'Make informed decisions based on data, not guesswork, to accelerate growth.',
                icon: 'ri-rocket-line',
                color: 'violet'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${benefit.icon} text-3xl text-${benefit.color}-600`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <i className="ri-bar-chart-box-line text-6xl mb-6 opacity-90"></i>
          <h2 className="text-3xl font-bold mb-4">Start Making Data-Driven Decisions</h2>
          <p className="text-xl mb-8 opacity-90">
            Get access to powerful analytics and grow your business faster
          </p>
          <button 
            onClick={() => navigate('/seller-dashboard/analytics')}
            className="bg-white text-violet-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Access Your Analytics
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
