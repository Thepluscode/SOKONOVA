import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { ordersService } from '../../lib/services';
import { useAuth } from '../../lib/auth';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  estimatedDelivery?: string;
  buyerEmail?: string;
}

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const orderId = searchParams.get('orderId') || searchParams.get('order_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        setError('No order ID provided');
        return;
      }

      try {
        const response = await ordersService.get(orderId);

        // Transform API response to our Order format
        const items: OrderItem[] = (response.items || []).map((item: any) => ({
          id: item.id,
          name: item.product?.title || 'Product',
          price: Number(item.price || 0),
          quantity: item.qty || 1,
          image: item.product?.imageUrl || `https://readdy.ai/api/search-image?query=product&width=80&height=80&seq=${item.id}&orientation=squarish`,
        }));

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = Number(response.shippingCost || 0);
        const tax = Number(response.tax || 0);

        setOrder({
          id: response.id,
          status: response.status,
          total: Number(response.total || subtotal + shipping + tax),
          subtotal,
          shipping,
          tax,
          shippingAddress: response.shippingAdr || 'Address not provided',
          items,
          createdAt: response.createdAt,
          estimatedDelivery: response.estimatedDelivery || getEstimatedDelivery(),
          buyerEmail: response.user?.email || user?.email,
        });
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Could not load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, user?.email]);

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const parseAddress = (address: string) => {
    if (!address || address === 'Address not provided') {
      return {
        name: user?.name || 'Customer',
        lines: ['Address not provided'],
      };
    }

    // Try to parse JSON address
    try {
      const parsed = JSON.parse(address);
      return {
        name: parsed.name || parsed.fullName || user?.name || 'Customer',
        lines: [
          parsed.street || parsed.address || parsed.line1,
          parsed.city && parsed.state ? `${parsed.city}, ${parsed.state} ${parsed.zip || parsed.postalCode || ''}` : '',
          parsed.country || '',
        ].filter(Boolean),
      };
    } catch {
      // Plain text address
      return {
        name: user?.name || 'Customer',
        lines: address.split(',').map(s => s.trim()),
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <SkeletonLoader type="avatar" />
            <SkeletonLoader type="text" />
          </div>
          <SkeletonLoader type="card" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <i className="ri-error-warning-line text-5xl text-red-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'We could not find this order.'}</p>
            <Link
              to="/buyer-orders"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              <i className="ri-file-list-line"></i>
              View My Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const addressInfo = parseAddress(order.shippingAddress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-pulse-ring">
            <i className="ri-check-line text-5xl text-green-600"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Order Details</h2>
              <p className="text-sm text-gray-600">
                {order.buyerEmail ? `Confirmation sent to ${order.buyerEmail}` : 'Confirmation sent to your email'}
              </p>
            </div>
            <button className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap flex items-center gap-2">
              <i className="ri-download-line"></i>
              Download Receipt
            </button>
          </div>

          {/* Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="ri-truck-line text-teal-600"></i>
                Delivery Address
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {addressInfo.name}<br />
                {addressInfo.lines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressInfo.lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="ri-calendar-line text-teal-600"></i>
                Estimated Delivery
              </h3>
              <p className="text-sm text-gray-700 mb-2">{order.estimatedDelivery}</p>
              <p className="text-xs text-gray-500">You'll receive tracking information via email</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="font-semibold text-gray-900 mb-4">Order Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in"
                  style={{ animationDelay: `${500 + index * 50}ms` }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className={order.shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
                {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <Link
            to={`/orders/${order.id}/tracking`}
            className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap ripple-effect flex items-center justify-center gap-2"
          >
            <i className="ri-map-pin-line"></i>
            Track Order
          </Link>
          <Link
            to="/products"
            className="w-full bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-shopping-bag-line"></i>
            Continue Shopping
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          {[
            { icon: 'ri-shield-check-line', text: 'Secure Payment', delay: '900ms' },
            { icon: 'ri-refresh-line', text: 'Easy Returns', delay: '950ms' },
            { icon: 'ri-customer-service-2-line', text: '24/7 Support', delay: '1000ms' }
          ].map((badge, index) => (
            <div
              key={index}
              className="text-center p-4 bg-white rounded-lg shadow-sm animate-scale-in"
              style={{ animationDelay: badge.delay }}
            >
              <i className={`${badge.icon} text-3xl text-teal-600 mb-2`}></i>
              <p className="text-xs font-medium text-gray-700">{badge.text}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
