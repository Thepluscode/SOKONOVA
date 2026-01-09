import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { analyticsService, ordersService, productsService, payoutsService } from '../../lib/services';
import { useAuth, useRequireAuth } from '../../lib/auth';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Require seller role
  useRequireAuth('SELLER');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    averageRating: 0,
    pendingEarnings: 0,
    availableForPayout: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [profitability, sellerProducts, payoutSummary] = await Promise.all([
          analyticsService.getSellerProfitability(user.id).catch(() => null),
          productsService.list({ sellerId: user.id }).catch(() => []),
          payoutsService.getSummary(user.id).catch(() => ({ pending: 0, available: 0, totalPaidOut: 0 })),
        ]);

        // Try to get recent orders
        let orders: any[] = [];
        try {
          orders = await ordersService.getByUserId(user.id, 5);
        } catch {
          orders = [];
        }

        // Calculate stats from profitability data
        setStats({
          totalRevenue: profitability?.totalRevenue || 0,
          totalOrders: profitability?.totalOrders || orders.length || 0,
          activeProducts: sellerProducts.length,
          averageRating: profitability?.averageRating || 4.5,
          pendingEarnings: payoutSummary.pending,
          availableForPayout: payoutSummary.available,
        });

        // Transform recent orders
        setRecentOrders(orders.slice(0, 5).map((order: any) => ({
          id: order.id,
          customer: order.buyerName || 'Customer',
          product: order.items?.[0]?.product?.title || 'Product',
          amount: Number(order.total),
          status: order.status?.toLowerCase() || 'pending',
          date: order.createdAt,
        })));

        // Get top products (by sales or just first 3)
        setTopProducts(sellerProducts.slice(0, 3).map((product: any) => ({
          id: product.id,
          name: product.title,
          sales: product.soldCount || 0,
          revenue: Number(product.price) * (product.soldCount || 0),
          stock: product.inventory?.quantity || 0,
          image: product.imageUrl || `https://readdy.ai/api/search-image?query=product&width=300&height=300&seq=${product.id}&orientation=squarish`,
        })));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} type="card" />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your products, orders, and analytics</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <i className="ri-error-warning-line text-red-500 text-xl"></i>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: 'ri-money-dollar-circle-line', color: 'teal' },
            { label: 'Orders', value: stats.totalOrders.toString(), icon: 'ri-shopping-bag-line', color: 'blue' },
            { label: 'Products', value: stats.activeProducts.toString(), icon: 'ri-box-3-line', color: 'purple' },
            { label: 'Avg. Rating', value: stats.averageRating.toFixed(1), icon: 'ri-star-line', color: 'yellow' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover-lift card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <i className={`${stat.icon} text-2xl text-${stat.color}-600`}></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Payout Summary */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Available for Payout</p>
              <p className="text-3xl font-bold">${stats.availableForPayout.toLocaleString()}</p>
              <p className="text-teal-100 text-sm mt-1">
                Pending: ${stats.pendingEarnings.toLocaleString()}
              </p>
            </div>
            <Link
              to="/seller-dashboard/payouts"
              className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-all"
            >
              Request Payout
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Add Product', icon: 'ri-add-circle-line', link: '/seller-dashboard/add-product' },
              { label: 'View Orders', icon: 'ri-file-list-3-line', link: '/seller-dashboard/orders' },
              { label: 'Analytics', icon: 'ri-line-chart-line', link: '/seller-dashboard/analytics' },
              { label: 'Payouts', icon: 'ri-bank-card-line', link: '/seller-dashboard/payouts' }
            ].map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 hover-lift"
              >
                <i className={`${action.icon} text-3xl text-teal-600 mb-2`}></i>
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/seller-dashboard/orders"
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-shopping-bag-line text-4xl text-gray-300 mb-2"></i>
              <p className="text-gray-600">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.customer}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.product}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.sales} sold · ${product.revenue.toFixed(0)} revenue
                    </p>
                    <p className="text-sm text-gray-500">{product.stock} in stock</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
