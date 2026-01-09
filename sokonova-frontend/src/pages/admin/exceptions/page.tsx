import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function ExceptionsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedException, setSelectedException] = useState<any>(null);

  const exceptionStats = [
    { label: 'Open Exceptions', value: 47, change: '+12%', icon: 'ri-alert-line', color: 'red' },
    { label: 'In Progress', value: 23, change: '-8%', icon: 'ri-time-line', color: 'yellow' },
    { label: 'Resolved Today', value: 89, change: '+24%', icon: 'ri-checkbox-circle-line', color: 'green' },
    { label: 'Avg Resolution Time', value: '2.4h', change: '-15%', icon: 'ri-timer-line', color: 'blue' }
  ];

  const exceptions = [
    {
      id: 'EXC-2024-001',
      type: 'payment_failed',
      orderId: 'ORD-2024-8901',
      customer: 'Amara Okafor',
      description: 'Payment authorization failed - insufficient funds',
      priority: 'high',
      status: 'open',
      assignedTo: 'Sarah Mwangi',
      createdAt: '2 hours ago',
      impact: 'Order on hold'
    },
    {
      id: 'EXC-2024-002',
      type: 'inventory_mismatch',
      orderId: 'ORD-2024-8902',
      customer: 'Wanjiku Kimani',
      description: 'Physical inventory count does not match system records',
      priority: 'urgent',
      status: 'in_progress',
      assignedTo: 'John Mensah',
      createdAt: '30 mins ago',
      impact: 'Cannot fulfill order'
    },
    {
      id: 'EXC-2024-003',
      type: 'shipping_delay',
      orderId: 'ORD-2024-8903',
      customer: 'Kwame Asante',
      description: 'Carrier reported delay due to weather conditions',
      priority: 'normal',
      status: 'open',
      assignedTo: 'Emmanuel Boateng',
      createdAt: '5 hours ago',
      impact: 'Delivery delayed by 2 days'
    },
    {
      id: 'EXC-2024-004',
      type: 'address_invalid',
      orderId: 'ORD-2024-8904',
      customer: 'Chioma Nwosu',
      description: 'Shipping address validation failed - incomplete information',
      priority: 'high',
      status: 'open',
      assignedTo: 'Sarah Mwangi',
      createdAt: '1 hour ago',
      impact: 'Cannot ship order'
    },
    {
      id: 'EXC-2024-005',
      type: 'fraud_alert',
      orderId: 'ORD-2024-8905',
      customer: 'Thabo Mbeki',
      description: 'Suspicious activity detected - multiple failed payment attempts',
      priority: 'urgent',
      status: 'in_progress',
      assignedTo: 'John Mensah',
      createdAt: '15 mins ago',
      impact: 'Order flagged for review'
    },
    {
      id: 'EXC-2024-006',
      type: 'return_issue',
      orderId: 'ORD-2024-8906',
      customer: 'Fatima Hassan',
      description: 'Customer return request exceeds policy timeframe',
      priority: 'normal',
      status: 'open',
      assignedTo: 'Emmanuel Boateng',
      createdAt: '3 hours ago',
      impact: 'Requires manual approval'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment_failed': return 'ri-bank-card-line';
      case 'inventory_mismatch': return 'ri-archive-line';
      case 'shipping_delay': return 'ri-truck-line';
      case 'address_invalid': return 'ri-map-pin-line';
      case 'fraud_alert': return 'ri-shield-cross-line';
      case 'return_issue': return 'ri-arrow-go-back-line';
      default: return 'ri-alert-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment_failed': return 'bg-red-100 text-red-700';
      case 'inventory_mismatch': return 'bg-orange-100 text-orange-700';
      case 'shipping_delay': return 'bg-yellow-100 text-yellow-700';
      case 'address_invalid': return 'bg-blue-100 text-blue-700';
      case 'fraud_alert': return 'bg-purple-100 text-purple-700';
      case 'return_issue': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleResolve = (exception: any) => {
    setSelectedException(exception);
    setShowResolveModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/admin/ops" className="hover:text-emerald-600">Admin</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">Exceptions</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exception Management</h1>
              <p className="text-gray-600 mt-2">Monitor and resolve order and system exceptions</p>
            </div>
            <Button className="whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {exceptionStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-${stat.color}-600 text-2xl`}></i>
                </div>
                <span className={`text-xs font-medium ${
                  stat.change.startsWith('+') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exception Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="payment_failed">Payment Failed</option>
                <option value="inventory_mismatch">Inventory Mismatch</option>
                <option value="shipping_delay">Shipping Delay</option>
                <option value="address_invalid">Invalid Address</option>
                <option value="fraud_alert">Fraud Alert</option>
                <option value="return_issue">Return Issue</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Order ID or customer..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Exceptions List */}
        <div className="space-y-4">
          {exceptions.map((exception) => (
            <div key={exception.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(exception.type)}`}>
                    <i className={`${getTypeIcon(exception.type)} text-2xl`}></i>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-mono text-sm font-semibold text-gray-900">{exception.id}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(exception.priority)}`}>
                        {exception.priority.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exception.status)}`}>
                        {exception.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-2">{exception.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Order:</span>
                        <span className="ml-2 font-medium text-gray-900">{exception.orderId}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Customer:</span>
                        <span className="ml-2 font-medium text-gray-900">{exception.customer}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Assigned:</span>
                        <span className="ml-2 font-medium text-gray-900">{exception.assignedTo}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <span className="ml-2 font-medium text-gray-900">{exception.createdAt}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-2 text-sm">
                      <i className="ri-error-warning-line text-orange-600"></i>
                      <span className="text-orange-600 font-medium">Impact: {exception.impact}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    onClick={() => handleResolve(exception)}
                    className="whitespace-nowrap"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Resolve
                  </Button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">
                    <i className="ri-more-2-line text-gray-600"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && selectedException && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Resolve Exception</h2>
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm space-y-2">
                  <div><span className="text-gray-600">Exception ID:</span> <span className="font-mono font-semibold">{selectedException.id}</span></div>
                  <div><span className="text-gray-600">Order ID:</span> <span className="font-semibold">{selectedException.orderId}</span></div>
                  <div><span className="text-gray-600">Customer:</span> <span className="font-semibold">{selectedException.customer}</span></div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Action</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Select action...</option>
                  <option>Retry payment</option>
                  <option>Update inventory</option>
                  <option>Contact customer</option>
                  <option>Escalate to manager</option>
                  <option>Cancel order</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe the resolution steps taken..."
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="notify" className="rounded text-emerald-600" />
                <label htmlFor="notify" className="text-sm text-gray-700">Notify customer of resolution</label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowResolveModal(false)} className="whitespace-nowrap">
                Cancel
              </Button>
              <Button onClick={() => setShowResolveModal(false)} className="whitespace-nowrap">
                <i className="ri-check-line mr-2"></i>
                Mark as Resolved
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
