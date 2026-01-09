
import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function ImpactInclusionPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const impactMetrics = [
    { label: 'Women-Owned Businesses', value: '456', percentage: '37%', change: '+12%', icon: 'ri-women-line', color: 'pink' },
    { label: 'Youth Entrepreneurs', value: '678', percentage: '55%', change: '+18%', icon: 'ri-user-smile-line', color: 'blue' },
    { label: 'Rural Sellers', value: '234', percentage: '19%', change: '+8%', icon: 'ri-map-pin-line', color: 'green' },
    { label: 'First-Time Sellers', value: '345', percentage: '28%', change: '+15%', icon: 'ri-star-line', color: 'orange' }
  ];

  const regionalImpact = [
    { region: 'Lagos, Nigeria', sellers: 234, revenue: '$45,678', womenOwned: '42%', youth: '58%' },
    { region: 'Nairobi, Kenya', sellers: 189, revenue: '$38,456', womenOwned: '38%', youth: '52%' },
    { region: 'Accra, Ghana', sellers: 156, revenue: '$28,934', womenOwned: '35%', youth: '48%' },
    { region: 'Cairo, Egypt', sellers: 145, revenue: '$25,123', womenOwned: '32%', youth: '45%' },
    { region: 'Johannesburg, SA', sellers: 123, revenue: '$21,456', womenOwned: '40%', youth: '50%' }
  ];

  const successStories = [
    {
      id: 1,
      name: 'Amara Okafor',
      business: 'Amara\'s Crafts',
      location: 'Lagos, Nigeria',
      category: 'Women-Owned',
      story: 'Started with 5 products, now selling 200+ handmade items across Africa',
      revenue: '$12,450',
      growth: '+245%',
      image: 'https://readdy.ai/api/search-image?query=African%20woman%20entrepreneur%20smiling%20confidently%20in%20her%20craft%20workshop%20surrounded%20by%20colorful%20handmade%20products%20and%20textiles%20with%20warm%20natural%20lighting&width=400&height=400&seq=impact1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Kwame Mensah',
      business: 'Tech Solutions',
      location: 'Accra, Ghana',
      category: 'Youth Entrepreneur',
      story: '22-year-old developer building tech accessories for African market',
      revenue: '$8,900',
      growth: '+180%',
      image: 'https://readdy.ai/api/search-image?query=Young%20African%20male%20entrepreneur%20working%20on%20laptop%20in%20modern%20tech%20workspace%20with%20gadgets%20and%20electronics%20in%20bright%20contemporary%20office%20setting&width=400&height=400&seq=impact2&orientation=squarish'
    },
    {
      id: 3,
      name: 'Fatima Hassan',
      business: 'Rural Organics',
      location: 'Kano, Nigeria',
      category: 'Rural Seller',
      story: 'Connecting rural farmers with urban customers, supporting 50+ families',
      revenue: '$6,780',
      growth: '+156%',
      image: 'https://readdy.ai/api/search-image?query=African%20woman%20farmer%20in%20rural%20setting%20holding%20fresh%20organic%20produce%20with%20farmland%20and%20crops%20in%20background%20under%20clear%20blue%20sky&width=400&height=400&seq=impact3&orientation=squarish'
    }
  ];

  const programs = [
    {
      name: 'Women in Business',
      participants: 456,
      graduated: 234,
      successRate: '78%',
      description: 'Empowering women entrepreneurs with training and resources'
    },
    {
      name: 'Youth Startup Program',
      participants: 678,
      graduated: 456,
      successRate: '82%',
      description: 'Supporting young entrepreneurs to launch their businesses'
    },
    {
      name: 'Rural Connect',
      participants: 234,
      graduated: 156,
      successRate: '72%',
      description: 'Bridging the gap between rural producers and urban markets'
    },
    {
      name: 'First-Time Seller Support',
      participants: 345,
      graduated: 234,
      successRate: '75%',
      description: 'Helping new sellers succeed on the platform'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact &amp; Inclusion Dashboard</h1>
            <p className="text-gray-600">Measuring our social and economic impact across Africa</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <Button className="whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </Button>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <i className={`${metric.icon} text-2xl text-${metric.color}-600`}></i>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-500">({metric.percentage})</p>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{story.name}</h3>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {story.growth}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{story.business}</p>
                  <p className="text-sm text-gray-600 mb-3">{story.location}</p>
                  <p className="text-sm text-gray-700 mb-4">{story.story}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">{story.category}</span>
                    <span className="text-sm font-semibold text-gray-900">{story.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Impact */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Regional Impact</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sellers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Women-Owned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Youth</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionalImpact.map((region, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{region.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{region.sellers}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{region.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-pink-600 font-medium">{region.womenOwned}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">{region.youth}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Impact Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{program.name}</h3>
                    <p className="text-sm text-gray-600">{program.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                    {program.successRate}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Participants</p>
                    <p className="text-xl font-bold text-gray-900">{program.participants}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Graduated</p>
                    <p className="text-xl font-bold text-gray-900">{program.graduated}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
