import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { useAuth } from '../../lib/auth';
import { ordersService } from '../../lib/services';

export default function MyAccountPage() {
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    // Fetch recent orders
    useEffect(() => {
        if (user?.id) {
            ordersService.listMine()
                .then((orders) => {
                    setRecentOrders(orders?.slice(0, 5) || []);
                })
                .catch(console.error)
                .finally(() => setOrdersLoading(false));
        }
    }, [user?.id]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin text-4xl text-emerald-600"></i>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) return null;

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get user initials for avatar fallback
    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {getInitials(user.name)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Welcome back, {user.name?.split(' ')[0] || 'User'}!</h1>
                                <p className="text-emerald-100">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                        >
                            <i className="ri-logout-box-r-line mr-2"></i>
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Link
                        to="/buyer-orders"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-emerald-200 transition-all group"
                    >
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                            <i className="ri-shopping-bag-3-line text-2xl text-emerald-600"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900">My Orders</h3>
                        <p className="text-sm text-gray-500">Track & manage orders</p>
                    </Link>

                    <Link
                        to="/wishlist"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-pink-200 transition-all group"
                    >
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                            <i className="ri-heart-line text-2xl text-pink-600"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900">Wishlist</h3>
                        <p className="text-sm text-gray-500">Saved items</p>
                    </Link>

                    <Link
                        to="/account/settings"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                            <i className="ri-settings-3-line text-2xl text-blue-600"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900">Settings</h3>
                        <p className="text-sm text-gray-500">Account preferences</p>
                    </Link>

                    <Link
                        to="/account/notifications"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all group"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                            <i className="ri-notification-3-line text-2xl text-purple-600"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500">Messages & alerts</p>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                                <Link to="/buyer-orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                    View all <i className="ri-arrow-right-s-line"></i>
                                </Link>
                            </div>

                            {ordersLoading ? (
                                <div className="p-8 text-center">
                                    <i className="ri-loader-4-line animate-spin text-2xl text-gray-400"></i>
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="ri-shopping-bag-line text-3xl text-gray-400"></i>
                                    </div>
                                    <p className="text-gray-500 mb-4">No orders yet</p>
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        <i className="ri-shopping-cart-line mr-2"></i>
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            to={`/orders/${order.id}/tracking`}
                                            className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <i className="ri-box-3-line text-xl text-gray-500"></i>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Order #{order.id.slice(-8)}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {order.currency} {order.total?.toFixed(2)}
                                                </p>
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Info Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Profile Information</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Name</span>
                                    <span className="font-medium text-gray-900">{user.name || 'Not set'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium text-gray-900 truncate max-w-[150px]">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Role</span>
                                    <span className="font-medium text-gray-900 capitalize">{user.role?.toLowerCase() || 'Buyer'}</span>
                                </div>
                            </div>
                            <Link
                                to="/account/settings"
                                className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                            >
                                Edit Profile <i className="ri-arrow-right-s-line ml-1"></i>
                            </Link>
                        </div>

                        {/* Seller CTA */}
                        {user.role !== 'SELLER' && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                                    <i className="ri-store-2-line text-2xl text-amber-600"></i>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Start Selling</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Turn your passion into profit. Join thousands of sellers on SOKONOVA.
                                </p>
                                <Link
                                    to="/sell"
                                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                                >
                                    <i className="ri-store-line mr-2"></i>
                                    Become a Seller
                                </Link>
                            </div>
                        )}

                        {/* Help */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/support"
                                    className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                                >
                                    <i className="ri-customer-service-line mr-3"></i>
                                    Contact Support
                                </Link>
                                <Link
                                    to="/how-it-works"
                                    className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                                >
                                    <i className="ri-question-line mr-3"></i>
                                    How It Works
                                </Link>
                                <Link
                                    to="/terms"
                                    className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                                >
                                    <i className="ri-file-text-line mr-3"></i>
                                    Terms & Policies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
