import { useEffect, useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { disputesService } from '../../../lib/services';
import { useRequireAuth } from '../../../lib/auth';

export default function AdminTrustPage() {
  useRequireAuth('ADMIN');
  const [activeTab, setActiveTab] = useState<'reports' | 'disputes' | 'verification'>('reports');
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loadingDisputes, setLoadingDisputes] = useState(true);
  const [disputesError, setDisputesError] = useState<string | null>(null);

  const reports = [
    {
      id: 1,
      type: 'counterfeit',
      reporter: 'Adebayo Okonkwo',
      reported: 'Fake Electronics Store',
      product: 'iPhone 15 Pro',
      date: '2024-01-15',
      status: 'investigating',
      severity: 'high'
    },
    {
      id: 2,
      type: 'fraud',
      reporter: 'Amara Kimani',
      reported: 'Scam Seller',
      product: 'Designer Handbag',
      date: '2024-01-14',
      status: 'resolved',
      severity: 'critical'
    },
    {
      id: 3,
      type: 'misrepresentation',
      reporter: 'Mohamed Hassan',
      reported: 'Misleading Store',
      product: 'Laptop Computer',
      date: '2024-01-13',
      status: 'pending',
      severity: 'medium'
    }
  ];

  const mapDisputeStatus = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'open';
      case 'SELLER_RESPONDED':
        return 'pending';
      case 'RESOLVED_BUYER_COMPENSATED':
      case 'RESOLVED_REDELIVERED':
      case 'REJECTED':
        return 'resolved';
      default:
        return 'pending';
    }
  };

  const verifications = [
    {
      id: 1,
      seller: 'Premium Electronics',
      type: 'identity',
      status: 'verified',
      date: '2024-01-10',
      documents: ['ID Card', 'Business License']
    },
    {
      id: 2,
      seller: 'Artisan Crafts',
      type: 'business',
      status: 'pending',
      date: '2024-01-15',
      documents: ['Business License', 'Tax Certificate']
    },
    {
      id: 3,
      seller: 'Fashion House',
      type: 'address',
      status: 'rejected',
      date: '2024-01-12',
      documents: ['Utility Bill']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'verified':
        return 'bg-green-100 text-green-700';
      case 'investigating':
      case 'open':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  useEffect(() => {
    async function fetchDisputes() {
      setLoadingDisputes(true);
      setDisputesError(null);

      try {
        const response = await disputesService.listAll();
        const mapped = response.map((dispute: any) => ({
          id: dispute.id,
          orderId: dispute.orderItem?.orderId || 'Unknown',
          buyer: dispute.buyer?.name || dispute.buyer?.email || 'Buyer',
          seller: dispute.orderItem?.product?.seller?.name || 'Seller',
          amount: dispute.orderItem?.grossAmount
            ? `$${Number(dispute.orderItem.grossAmount).toFixed(2)}`
            : '—',
          reason: dispute.reasonCode?.replace(/_/g, ' ').toLowerCase() || 'Issue reported',
          date: new Date(dispute.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          status: mapDisputeStatus(dispute.status),
        }));

        setDisputes(mapped);
      } catch (error) {
        console.error('Failed to load disputes:', error);
        setDisputesError('Could not load disputes.');
      } finally {
        setLoadingDisputes(false);
      }
    }

    fetchDisputes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trust & Safety</h1>
          <p className="text-gray-600">Monitor reports, disputes, and seller verifications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-alert-line text-2xl text-red-600"></i>
              </div>
              <span className="text-xs font-medium text-red-600">+5</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Active Reports</p>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-scales-line text-2xl text-orange-600"></i>
              </div>
              <span className="text-xs font-medium text-orange-600">+3</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Open Disputes</p>
            <p className="text-2xl font-bold text-gray-900">
              {disputes.filter((dispute) => dispute.status === 'open').length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-shield-check-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-xs font-medium text-blue-600">+8</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending Verifications</p>
            <p className="text-2xl font-bold text-gray-900">34</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
              </div>
              <span className="text-xs font-medium text-green-600">+15</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Resolved This Week</p>
            <p className="text-2xl font-bold text-gray-900">89</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 animate-scale-in">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'reports'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reports
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {reports.length}
                </span>
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
              </button>
              <button
                onClick={() => setActiveTab('verification')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'verification'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Verification
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{report.product}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                            {report.severity}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium text-gray-900 capitalize">{report.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Reporter</p>
                            <p className="font-medium text-gray-900">{report.reporter}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Reported Seller</p>
                            <p className="font-medium text-gray-900">{report.reported}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">{report.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          Review
                        </Button>
                        <Button size="sm" className="whitespace-nowrap">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'disputes' && (
              <div className="space-y-4">
                {loadingDisputes && (
                  <div className="text-sm text-gray-600">Loading disputes...</div>
                )}
                {disputesError && (
                  <div className="text-sm text-red-600">{disputesError}</div>
                )}
                {!loadingDisputes && !disputesError && disputes.map((dispute, index) => (
                  <div
                    key={dispute.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{dispute.orderId}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                            {dispute.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Buyer</p>
                            <p className="font-medium text-gray-900">{dispute.buyer}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Seller</p>
                            <p className="font-medium text-gray-900">{dispute.seller}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium text-gray-900">{dispute.amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Reason</p>
                            <p className="font-medium text-gray-900">{dispute.reason}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">{dispute.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          View Details
                        </Button>
                        <Button size="sm" className="whitespace-nowrap">
                          Mediate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {!loadingDisputes && !disputesError && disputes.length === 0 && (
                  <div className="text-sm text-gray-600">No disputes found.</div>
                )}
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-4">
                {verifications.map((verification, index) => (
                  <div
                    key={verification.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{verification.seller}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verification.status)}`}>
                            {verification.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium text-gray-900 capitalize">{verification.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Submitted</p>
                            <p className="font-medium text-gray-900">{verification.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Documents</p>
                            <p className="font-medium text-gray-900">{verification.documents.length} files</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {verification.documents.map((doc, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                            >
                              <i className="ri-file-line mr-1"></i>
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          Review Docs
                        </Button>
                        {verification.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50 whitespace-nowrap">
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
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
