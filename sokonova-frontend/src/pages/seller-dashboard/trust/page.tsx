import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function SellerTrustPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'disputes' | 'kyc'>('overview');

  const trustScore = {
    overall: 87,
    trend: '+5',
    breakdown: [
      { category: 'Product Quality', score: 92, weight: '30%' },
      { category: 'Delivery Time', score: 85, weight: '25%' },
      { category: 'Customer Service', score: 88, weight: '20%' },
      { category: 'Communication', score: 90, weight: '15%' },
      { category: 'Dispute Resolution', score: 78, weight: '10%' }
    ]
  };

  const reputationMetrics = [
    { label: 'Total Reviews', value: '1,234', icon: 'ri-star-line', color: 'yellow' },
    { label: 'Avg Rating', value: '4.7', icon: 'ri-star-fill', color: 'yellow' },
    { label: 'Response Rate', value: '98%', icon: 'ri-chat-check-line', color: 'green' },
    { label: 'On-Time Delivery', value: '94%', icon: 'ri-truck-line', color: 'blue' }
  ];

  const disputes = [
    { id: 1, orderId: 'ORD-12345', customer: 'John Doe', issue: 'Product not as described', status: 'open', date: '2 days ago', amount: '$45.00' },
    { id: 2, orderId: 'ORD-12346', customer: 'Jane Smith', issue: 'Late delivery', status: 'resolved', date: '1 week ago', amount: '$78.00' },
    { id: 3, orderId: 'ORD-12347', customer: 'Mike Johnson', issue: 'Damaged item', status: 'pending', date: '3 days ago', amount: '$120.00' }
  ];

  const kycStatus = {
    verified: true,
    documents: [
      { name: 'Business Registration', status: 'verified', uploadedDate: '2024-01-15' },
      { name: 'Tax ID Certificate', status: 'verified', uploadedDate: '2024-01-15' },
      { name: 'Bank Account Details', status: 'verified', uploadedDate: '2024-01-15' },
      { name: 'ID Verification', status: 'verified', uploadedDate: '2024-01-15' }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trust & Safety</h1>
          <p className="text-gray-600">Manage your seller reputation and compliance</p>
        </div>

        {/* Trust Score Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Your Trust Score</h2>
              <p className="text-emerald-100">Based on your performance and customer feedback</p>
            </div>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(trustScore.overall / 100) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{trustScore.overall}</span>
                  <span className="text-sm text-emerald-100">out of 100</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <i className="ri-arrow-up-line text-xl"></i>
                <span className="text-lg font-semibold">{trustScore.trend} this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reputation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reputationMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${metric.icon} text-2xl text-${metric.color}-600`}></i>
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
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
                Score Breakdown
              </button>
              <button
                onClick={() => setActiveTab('disputes')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'disputes'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Disputes
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">1</span>
              </button>
              <button
                onClick={() => setActiveTab('kyc')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'kyc'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                KYC & Verification
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Score Breakdown</h3>
                  <div className="space-y-4">
                    {trustScore.breakdown.map((item, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.category}</h4>
                            <p className="text-sm text-gray-600">Weight: {item.weight}</p>
                          </div>
                          <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                            {item.score}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getScoreBgColor(item.score)}`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">How to Improve Your Score</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-blue-600 mr-2 mt-0.5"></i>
                      <span>Respond to customer inquiries within 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-blue-600 mr-2 mt-0.5"></i>
                      <span>Ship orders on time and provide tracking information</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-blue-600 mr-2 mt-0.5"></i>
                      <span>Resolve disputes quickly and professionally</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-line text-blue-600 mr-2 mt-0.5"></i>
                      <span>Maintain accurate product descriptions and images</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'disputes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Active Disputes</h3>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    <i className="ri-filter-line mr-2"></i>
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-600 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">Order {dispute.orderId}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              dispute.status === 'open' ? 'bg-red-100 text-red-700' :
                              dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {dispute.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Customer: {dispute.customer}</p>
                          <p className="text-sm text-gray-600">Issue: {dispute.issue}</p>
                        </div>
                        <div className="text-right mt-3 sm:mt-0">
                          <p className="text-lg font-bold text-gray-900">{dispute.amount}</p>
                          <p className="text-sm text-gray-500">{dispute.date}</p>
                        </div>
                      </div>
                      {dispute.status === 'open' && (
                        <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                          <Button size="sm" className="whitespace-nowrap">
                            <i className="ri-message-line mr-2"></i>
                            Respond
                          </Button>
                          <Button size="sm" variant="outline" className="whitespace-nowrap">
                            <i className="ri-refund-line mr-2"></i>
                            Offer Refund
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {disputes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-checkbox-circle-line text-4xl text-green-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Disputes</h3>
                    <p className="text-gray-600">Great job! Keep up the excellent customer service.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-shield-check-line text-2xl text-green-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Account Verified</h3>
                      <p className="text-sm text-green-700">All required documents have been verified</p>
                    </div>
                  </div>
                  <i className="ri-checkbox-circle-fill text-3xl text-green-600"></i>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Documents</h3>
                  <div className="space-y-3">
                    {kycStatus.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <i className="ri-file-text-line text-2xl text-gray-600"></i>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-600">Uploaded: {doc.uploadedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {doc.status}
                          </span>
                          <button className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                            <i className="ri-download-line text-xl"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Need to Update Documents?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    If any of your business information has changed, please upload updated documents to maintain your verified status.
                  </p>
                  <Button variant="outline" className="whitespace-nowrap">
                    <i className="ri-upload-2-line mr-2"></i>
                    Upload New Document
                  </Button>
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
