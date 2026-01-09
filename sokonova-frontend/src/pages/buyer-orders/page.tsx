import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import QuickReorder from '../../components/feature/QuickReorder';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { ordersService, productsService } from '../../lib/services';
import { useAuth } from '../../lib/auth';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  tracking?: string;
  deliveryDate?: string;
  estimatedDelivery?: string;
  cancelReason?: string;
}

export default function BuyerOrdersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders from API
  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiOrders = await ordersService.listForUser(user.id);

        // Transform API orders to display format
        const displayOrders: Order[] = await Promise.all(
          apiOrders.map(async (order: any) => {
            // Get product details for each order item
            const productIds = order.items?.map((item: any) => item.productId) || [];
            let products: any[] = [];
            try {
              if (productIds.length > 0) {
                products = await productsService.getByIds(productIds);
              }
            } catch {
              // Continue without product details
            }

            return {
              id: order.id,
              date: order.createdAt,
              status: order.status?.toLowerCase() || 'processing',
              total: Number(order.total),
              tracking: order.trackingNumber,
              deliveryDate: order.deliveredAt,
              estimatedDelivery: order.estimatedDelivery,
              items: (order.items || []).map((item: any) => {
                const product = products.find((p: any) => p.id === item.productId);
                return {
                  id: item.productId,
                  name: product?.title || 'Product',
                  price: Number(item.unitPrice || product?.price || 0),
                  quantity: item.qty,
                  seller: product?.user?.storeName || 'Seller',
                  image: product?.imageUrl || `https://readdy.ai/api/search-image?query=product&width=100&height=125&seq=${item.productId}&orientation=portrait`,
                };
              }),
            };
          })
        );

        setOrders(displayOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'ri-checkbox-circle-fill';
      case 'shipped':
        return 'ri-truck-line';
      case 'processing':
        return 'ri-time-line';
      case 'cancelled':
        return 'ri-close-circle-fill';
      default:
        return 'ri-information-line';
    }
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
              { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
              { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
              { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap cursor-pointer ${activeTab === tab.id
                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
              <Link to="/products">
                <Button className="whitespace-nowrap">
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(order.status)}`}>
                        <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4">
                        <Link to={`/products/${item.id}`} className="flex-shrink-0 cursor-pointer">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-25 object-cover object-top rounded-lg"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.id}`} className="cursor-pointer">
                            <h3 className="text-base font-semibold text-gray-900 hover:text-emerald-600">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            <i className="ri-store-2-line mr-1"></i>
                            {item.seller}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="text-base font-bold text-gray-900">${item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Info */}
                  {order.tracking && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                          <p className="font-mono font-semibold text-gray-900">{order.tracking}</p>
                          {order.estimatedDelivery && (
                            <p className="text-sm text-gray-600 mt-2">
                              Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          )}
                          {order.deliveryDate && (
                            <p className="text-sm text-green-600 mt-2">
                              <i className="ri-checkbox-circle-fill mr-1"></i>
                              Delivered on {new Date(order.deliveryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Link
                            to={`/orders/${order.id}/tracking`}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center whitespace-nowrap"
                          >
                            Track Order
                          </Link>
                          <QuickReorder
                            orderId={order.id}
                            items={order.items}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancel Reason */}
                  {order.cancelReason && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Cancellation reason:</p>
                      <p className="text-gray-900">{order.cancelReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                    {order.status === 'delivered' && (
                      <>
                        <Button variant="outline" className="whitespace-nowrap">
                          <i className="ri-star-line mr-2"></i>
                          Write Review
                        </Button>
                        <Button variant="outline" className="whitespace-nowrap">
                          <i className="ri-arrow-go-back-line mr-2"></i>
                          Return Item
                        </Button>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <Button variant="outline" className="whitespace-nowrap">
                        <i className="ri-close-line mr-2"></i>
                        Cancel Order
                      </Button>
                    )}
                    <Button variant="outline" className="whitespace-nowrap">
                      <i className="ri-file-text-line mr-2"></i>
                      View Invoice
                    </Button>
                    <Button className="whitespace-nowrap">
                      <i className="ri-message-3-line mr-2"></i>
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
