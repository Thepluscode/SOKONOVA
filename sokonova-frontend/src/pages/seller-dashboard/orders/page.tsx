import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import { useToast } from '../../../contexts/ToastContext';
import { fulfillmentService, ordersService } from '../../../lib/services';
import { useAuth, useRequireAuth } from '../../../lib/auth';

interface OrderItemRow {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  status: string;
  trackingNumber?: string | null;
  carrier?: string | null;
}

interface OrderRow {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  items: OrderItemRow[];
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string | null;
}

const getDerivedStatus = (items: OrderItemRow[]) => {
  const statuses = items.map((item) => item.status);
  if (statuses.every((status) => status === 'delivered')) return 'delivered';
  if (statuses.some((status) => status === 'shipped')) return 'shipped';
  if (statuses.some((status) => status === 'processing')) return 'processing';
  return 'pending';
};

const fallbackAvatar = (seed: string) =>
  `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(seed)}`;

export default function OrderManagement() {
  const { user } = useAuth();
  useRequireAuth('SELLER');

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOnItem, setActingOnItem] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);

      try {
        const response = await ordersService.listForSeller();
        const mapped = response.map((order: any) => {
          const items = (order.items || []).map((item: any) => ({
            id: item.id,
            name: item.product?.title || 'Product',
            quantity: item.qty || 0,
            price: Number(item.price || 0),
            image: item.product?.imageUrl || '',
            status: item.fulfillmentStatus?.toLowerCase() || 'pending',
            trackingNumber: item.trackingCode || null,
            carrier: item.carrier || null,
          }));

          const customerName = order.user?.name || order.user?.email || 'Buyer';
          const status = getDerivedStatus(items);

          return {
            id: order.id,
            customer: {
              name: customerName,
              email: order.user?.email || 'buyer@email.com',
              avatar: fallbackAvatar(customerName),
            },
            items,
            total: Number(order.total || 0),
            status,
            paymentStatus: (order.status || 'pending').toLowerCase() === 'paid' ? 'paid' : 'pending',
            shippingAddress: order.shippingAdr || 'Shipping address not provided',
            orderDate: order.createdAt,
          } as OrderRow;
        });

        setOrders(mapped);
      } catch (fetchError) {
        console.error('Failed to load seller orders:', fetchError);
        setError('Could not load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'all' || order.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, searchTerm, activeTab]);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for orders:`, selectedOrders);
    setSelectedOrders([]);
  };

  const updateItem = (orderId: string, itemId: string, updates: Partial<OrderItemRow>) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedItems = order.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item,
        );
        return { ...order, items: updatedItems, status: getDerivedStatus(updatedItems) };
      }),
    );
  };

  const handleShipItem = async (orderId: string, itemId: string) => {
    if (!user?.id) return;

    const carrier = prompt('Enter carrier (e.g. DHL, FedEx):') || '';
    const trackingCode = prompt('Enter tracking number:') || '';

    if (!trackingCode.trim()) {
      showToast({
        message: 'Tracking number is required to mark as shipped.',
        type: 'warning',
      });
      return;
    }

    setActingOnItem(itemId);
    try {
      await fulfillmentService.markShipped(itemId, { carrier, trackingCode });
      updateItem(orderId, itemId, {
        status: 'shipped',
        trackingNumber: trackingCode,
        carrier: carrier || 'Carrier',
      });
    } catch (shipError) {
      console.error('Failed to mark item shipped:', shipError);
      showToast({
        message: 'Could not mark item as shipped. Please try again.',
        type: 'error',
      });
    } finally {
      setActingOnItem(null);
    }
  };

  const handleDeliverItem = async (orderId: string, itemId: string) => {
    if (!user?.id) return;

    const proofUrl = prompt('Optional: paste delivery proof URL') || '';

    setActingOnItem(itemId);
    try {
      await fulfillmentService.markDelivered(itemId, { proofUrl });
      updateItem(orderId, itemId, { status: 'delivered' });
    } catch (deliverError) {
      console.error('Failed to mark item delivered:', deliverError);
      showToast({
        message: 'Could not mark item as delivered. Please try again.',
        type: 'error',
      });
    } finally {
      setActingOnItem(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-600">Loading orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

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
                { id: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
                { id: 'processing', label: 'Processing', count: orders.filter((o) => o.status === 'processing').length },
                { id: 'shipped', label: 'Shipped', count: orders.filter((o) => o.status === 'shipped').length },
                { id: 'delivered', label: 'Delivered', count: orders.filter((o) => o.status === 'delivered').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs">({tab.count})</span>
                </button>
              ))}
            </div>
            <div className="w-64">
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 text-sm text-red-600">{error}</div>
        )}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                          setSelectedOrders(filteredOrders.map((o) => o.id));
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
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded bg-gray-100" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                              <button
                                onClick={() => handleShipItem(order.id, item.id)}
                                className="text-blue-600 hover:text-blue-900 text-sm"
                                disabled={item.status === 'shipped' || item.status === 'delivered' || actingOnItem === item.id}
                                title="Mark shipped"
                              >
                                <i className="ri-truck-line"></i>
                              </button>
                              <button
                                onClick={() => handleDeliverItem(order.id, item.id)}
                                className="text-green-600 hover:text-green-900 text-sm"
                                disabled={item.status !== 'shipped' || actingOnItem === item.id}
                                title="Mark delivered"
                              >
                                <i className="ri-check-line"></i>
                              </button>
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
