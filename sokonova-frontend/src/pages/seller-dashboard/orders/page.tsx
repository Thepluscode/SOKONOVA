
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'Amara Johnson',
        email: 'amara.johnson@email.com',
        avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20young%20African%20American%20woman%20with%20natural%20hair%2C%20smiling%2C%20clean%20background%2C%20business%20portrait%20style&width=100&height=100&seq=13&orientation=squarish'
      },
      items: [
        {
          name: 'Handwoven Kente Scarf',
          quantity: 2,
          price: 85,
          image: 'https://readdy.ai/api/search-image?query=Beautiful%20handwoven%20African%20kente%20scarf%20with%20vibrant%20traditional%20patterns%20in%20gold%20and%20red%20colors%2C%20displayed%20on%20clean%20white%20background%2C%20professional%20product%20photography&width=100&height=100&seq=14&orientation=squarish'
        }
      ],
      total: 170,
      status: 'pending',
      paymentStatus: 'paid',
      shippingAddress: '123 Main St, New York, NY 10001, USA',
      orderDate: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-25',
      trackingNumber: null
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'David Chen',
        email: 'david.chen@email.com',
        avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Asian%20man%20with%20glasses%2C%20smiling%2C%20clean%20background%2C%20business%20portrait%20style&width=100&height=100&seq=15&orientation=squarish'
      },
      items: [
        {
          name: 'African Print Dress',
          quantity: 1,
          price: 120,
          image: 'https://readdy.ai/api/search-image?query=Elegant%20African%20print%20dress%20with%20colorful%20traditional%20patterns%2C%20modern%20cut%20and%20design%2C%20displayed%20on%20clean%20white%20background%2C%20professional%20fashion%20photography&width=100&height=100&seq=16&orientation=squarish'
        }
      ],
      total: 120,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: '456 Oak Ave, Toronto, ON M5V 3A8, Canada',
      orderDate: '2024-01-14T14:20:00Z',
      estimatedDelivery: '2024-01-22',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Sarah Williams',
        email: 'sarah.williams@email.com',
        avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20young%20Caucasian%20woman%20with%20blonde%20hair%2C%20smiling%2C%20clean%20background%2C%20business%20portrait%20style&width=100&height=100&seq=17&orientation=squarish'
      },
      items: [
        {
          name: 'Beaded Jewelry Set',
          quantity: 1,
          price: 65,
          image: 'https://readdy.ai/api/search-image?query=Beautiful%20African%20beaded%20jewelry%20set%20with%20necklace%20and%20earrings%2C%20traditional%20colorful%20beads%2C%20elegant%20craftsmanship%2C%20displayed%20on%20clean%20white%20background&width=100&height=100&seq=18&orientation=squarish'
        }
      ],
      total: 65,
      status: 'delivered',
      paymentStatus: 'paid',
      shippingAddress: '789 Pine Rd, London, SW1A 1AA, UK',
      orderDate: '2024-01-13T09:15:00Z',
      estimatedDelivery: '2024-01-20',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-2024-004',
      customer: {
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20middle-aged%20African%20American%20man%20with%20beard%2C%20smiling%2C%20clean%20background%2C%20business%20portrait%20style&width=100&height=100&seq=19&orientation=squarish'
      },
      items: [
        {
          name: 'Traditional Wooden Mask',
          quantity: 1,
          price: 95,
          image: 'https://readdy.ai/api/search-image?query=Traditional%20African%20wooden%20mask%20with%20intricate%20carved%20patterns%2C%20cultural%20artifact%2C%20displayed%20on%20clean%20white%20background%2C%20professional%20photography&width=100&height=100&seq=20&orientation=squarish'
        }
      ],
      total: 95,
      status: 'processing',
      paymentStatus: 'paid',
      shippingAddress: '321 Elm St, Sydney, NSW 2000, Australia',
      orderDate: '2024-01-16T16:45:00Z',
      estimatedDelivery: '2024-01-28',
      trackingNumber: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for orders:`, selectedOrders);
    // Implement bulk actions
    setSelectedOrders([]);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // Implement status update
  };

  const addTrackingNumber = (orderId: string, trackingNumber: string) => {
    console.log(`Adding tracking number ${trackingNumber} to order ${orderId}`);
    // Implement tracking number update
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/seller-dashboard" 
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-1">Manage and track all your orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedOrders.length} selected</span>
                  <Button 
                    variant="outline" 
                    onClick={() => handleBulkAction('mark_shipped')}
                  >
                    Mark as Shipped
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleBulkAction('export')}
                  >
                    Export
                  </Button>
                </div>
              )}
              <Button variant="outline">
                <i className="ri-download-line mr-2"></i>
                Export Orders
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
                { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
                { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-emerald-200' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="w-80">
              <Input
                type="text"
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(filteredOrders.map(o => o.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleOrderSelect(order.id)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-blue-600">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">${order.total}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                          disabled={order.status === 'delivered' || order.status === 'shipped'}
                        >
                          <i className="ri-truck-line"></i>
                        </button>
                        <button
                          onClick={() => {
                            const tracking = prompt('Enter tracking number:');
                            if (tracking) addTrackingNumber(order.id, tracking);
                          }}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          <i className="ri-qr-code-line"></i>
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 text-sm">
                          <i className="ri-more-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">No orders found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
