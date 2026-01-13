import { useState, useEffect } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import SkeletonLoader from '../../../components/base/SkeletonLoader';
import { adminService } from '../../../lib/services';
import { useRequireAuth } from '../../../lib/auth';

interface SellerApplication {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone?: string;
  category: string;
  location: string;
  submittedDate: string;
  documents?: string[];
  rating?: number;
  experience?: string;
  businessDescription?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedDate?: string;
  rejectedDate?: string;
  totalSales?: string;
  products?: number;
  rejectionReason?: string;
}

export default function SellerApprovalPage() {
  // Require admin role
  useRequireAuth('ADMIN');

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingSellers, setPendingSellers] = useState<SellerApplication[]>([]);
  const [approvedSellers, setApprovedSellers] = useState<SellerApplication[]>([]);
  const [rejectedSellers, setRejectedSellers] = useState<SellerApplication[]>([]);

  // Fetch seller applications from API
  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all applications in parallel
        const [pending, approved, rejected] = await Promise.all([
          adminService.getSellerApplications('pending').catch(() => []),
          adminService.getSellerApplications('approved').catch(() => []),
          adminService.getSellerApplications('rejected').catch(() => []),
        ]);

        setPendingSellers(pending);
        setApprovedSellers(approved);
        setRejectedSellers(rejected);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Could not load seller applications.');
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const handleApproveClick = (id: string) => {
    setSelectedSeller(id);
    setShowApprovalModal(true);
  };

  const handleRejectClick = (id: string) => {
    setSelectedSeller(id);
    setShowRejectionModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedSeller) return;

    setProcessing(true);
    try {
      await adminService.approveApplication(selectedSeller, approvalNote);

      // Move seller from pending to approved
      const seller = pendingSellers.find(s => s.id === selectedSeller);
      if (seller) {
        setPendingSellers(prev => prev.filter(s => s.id !== selectedSeller));
        setApprovedSellers(prev => [...prev, { ...seller, status: 'approved', approvedDate: new Date().toISOString() }]);
      }

      setShowApprovalModal(false);
      setApprovalNote('');
      setSelectedSeller(null);
    } catch (err) {
      console.error('Failed to approve:', err);
      setError('Could not approve seller. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const confirmRejection = async () => {
    if (!selectedSeller || !rejectionReason.trim()) return;

    setProcessing(true);
    try {
      await adminService.rejectApplication(selectedSeller, rejectionReason);

      // Move seller from pending to rejected
      const seller = pendingSellers.find(s => s.id === selectedSeller);
      if (seller) {
        setPendingSellers(prev => prev.filter(s => s.id !== selectedSeller));
        setRejectedSellers(prev => [...prev, { ...seller, status: 'rejected', rejectionReason, rejectedDate: new Date().toISOString() }]);
      }

      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedSeller(null);
    } catch (err) {
      console.error('Failed to reject:', err);
      setError('Could not reject seller. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Approval</h1>
          <p className="text-gray-600">Review and approve new seller applications</p>
        </div>

        {/* Approval Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Approval Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Verify all required documents are submitted and valid</li>
                <li>• Check business registration and tax compliance</li>
                <li>• Review seller experience and product category fit</li>
                <li>• Ensure contact information is accurate and verifiable</li>
                <li>• Approved sellers will receive welcome email with onboarding instructions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">{pendingSellers.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-2xl text-orange-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedSellers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedSellers.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-close-circle-line text-2xl text-red-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 animate-scale-in">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'pending'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Pending
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  {pendingSellers.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'approved'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'rejected'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-6">
                {pendingSellers.map((seller, index) => (
                  <div
                    key={seller.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{seller.name}</h3>
                            <p className="text-gray-600">{seller.owner}</p>
                          </div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                            Pending
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                          {seller.businessDescription}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-mail-line mr-2"></i>
                            {seller.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-phone-line mr-2"></i>
                            {seller.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-store-2-line mr-2"></i>
                            {seller.category}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-map-pin-line mr-2"></i>
                            {seller.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-calendar-line mr-2"></i>
                            Submitted: {seller.submittedDate}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-briefcase-line mr-2"></i>
                            Experience: {seller.experience}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Submitted Documents:</p>
                          <div className="flex flex-wrap gap-2">
                            {seller.documents.map((doc, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                              >
                                <i className="ri-file-check-line mr-1"></i>
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="flex items-center">
                            <i className="ri-star-fill text-yellow-400 mr-1"></i>
                            <span className="font-semibold text-gray-900">{seller.rating}</span>
                            <span className="text-gray-600 ml-1">Previous Rating</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button
                          onClick={() => handleApproveClick(seller.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                        >
                          <i className="ri-checkbox-circle-line mr-2"></i>
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectClick(seller.id)}
                          variant="outline"
                          className="w-full border-red-600 text-red-600 hover:bg-red-50 whitespace-nowrap"
                        >
                          <i className="ri-close-circle-line mr-2"></i>
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full whitespace-nowrap"
                        >
                          <i className="ri-eye-line mr-2"></i>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'approved' && (
              <div className="space-y-4">
                {approvedSellers.map((seller, index) => (
                  <div
                    key={seller.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{seller.name}</h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Approved
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{seller.owner}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Category</p>
                            <p className="font-medium text-gray-900">{seller.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">{seller.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Sales</p>
                            <p className="font-medium text-green-600">{seller.totalSales}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Products</p>
                            <p className="font-medium text-gray-900">{seller.products}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'rejected' && (
              <div className="space-y-4">
                {rejectedSellers.map((seller, index) => (
                  <div
                    key={seller.id}
                    className="border border-gray-200 rounded-lg p-6 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{seller.name}</h3>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                            Rejected
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{seller.owner}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Category</p>
                            <p className="font-medium text-gray-900">{seller.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">{seller.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Rejected Date</p>
                            <p className="font-medium text-gray-900">{seller.rejectedDate}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>Reason:</strong> {seller.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Approve Seller</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve this seller? They will receive a welcome email with onboarding instructions.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Note (Optional)
              </label>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Add any notes or special instructions..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={confirmApproval}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              >
                Confirm Approval
              </Button>
              <Button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNote('');
                  setSelectedSeller(null);
                }}
                variant="outline"
                className="flex-1 whitespace-nowrap"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i className="ri-close-circle-line text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Seller</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejection. The seller will be notified via email.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this application is being rejected..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={confirmRejection}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white whitespace-nowrap disabled:bg-gray-300"
              >
                Confirm Rejection
              </Button>
              <Button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedSeller(null);
                }}
                variant="outline"
                className="flex-1 whitespace-nowrap"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
