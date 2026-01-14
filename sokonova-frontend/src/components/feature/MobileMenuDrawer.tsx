import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                drawerRef.current &&
                !drawerRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Restore body scrolling
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">S</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">SOKONOVA</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                        {user ? (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                                            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {user.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user.email}
                                        </p>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center space-x-2 w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2.5 transition-colors"
                                >
                                    <i className="ri-logout-box-line"></i>
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={onClose} className="flex items-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-3 transition-colors">
                                <i className="ri-login-box-line text-xl"></i>
                                <span className="font-medium">Sign In</span>
                                <i className="ri-arrow-right-s-line ml-auto"></i>
                            </Link>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                        {/* Admin Links */}
                        {user?.role === 'ADMIN' && (
                            <>
                                <div className="px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    Admin
                                </div>
                                <Link
                                    to="/admin/control-tower"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    <i className="ri-dashboard-line text-xl"></i>
                                    <span className="font-medium">Control Tower</span>
                                </Link>
                                <Link
                                    to="/admin/seller-approval"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    <i className="ri-user-settings-line text-xl"></i>
                                    <span className="font-medium">Seller Approval</span>
                                </Link>
                                <Link
                                    to="/admin/ops"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    <i className="ri-settings-3-line text-xl"></i>
                                    <span className="font-medium">Operations</span>
                                </Link>
                                <div className="py-2 border-t border-gray-100 dark:border-gray-800 my-2"></div>
                            </>
                        )}

                        {/* Seller Links */}
                        {user?.role === 'SELLER' && (
                            <>
                                <div className="px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    Seller Dashboard
                                </div>
                                <Link
                                    to="/seller-dashboard"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    <i className="ri-dashboard-line text-xl"></i>
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <Link
                                    to="/seller-dashboard/add-product"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    <i className="ri-add-circle-line text-xl"></i>
                                    <span className="font-medium">Add Product</span>
                                </Link>
                                <Link
                                    to="/seller-dashboard/orders"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    <i className="ri-shopping-bag-3-line text-xl"></i>
                                    <span className="font-medium">Orders</span>
                                </Link>
                                <Link
                                    to="/seller-dashboard/payouts"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    <i className="ri-money-dollar-circle-line text-xl"></i>
                                    <span className="font-medium">Payouts</span>
                                </Link>
                                <div className="py-2 border-t border-gray-100 dark:border-gray-800 my-2"></div>
                            </>
                        )}

                        {/* Common Navigation */}
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Browse
                        </div>
                        <Link
                            to="/products"
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                        >
                            <i className="ri-shopping-bag-3-line text-xl"></i>
                            <span className="font-medium">Products</span>
                        </Link>

                        <Link
                            to="/services"
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                        >
                            <i className="ri-service-line text-xl"></i>
                            <span className="font-medium">Services</span>
                        </Link>

                        <Link
                            to="/discover"
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                        >
                            <i className="ri-compass-3-line text-xl"></i>
                            <span className="font-medium">Discover</span>
                        </Link>

                        {!user || user.role === 'BUYER' ? (
                            <Link
                                to="/sell"
                                onClick={onClose}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                            >
                                <i className="ri-store-2-line text-xl"></i>
                                <span className="font-medium">Start Selling</span>
                            </Link>
                        ) : null}

                        <div className="py-2 border-t border-gray-100 dark:border-gray-800 my-2"></div>

                        {/* Account Links - Only when logged in */}
                        {user && (
                            <>
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Account
                                </div>
                                <Link
                                    to="/wishlist"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <i className="ri-heart-line text-xl"></i>
                                    <span className="font-medium">Wishlist</span>
                                </Link>

                                <Link
                                    to="/buyer-orders"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <i className="ri-file-list-3-line text-xl"></i>
                                    <span className="font-medium">My Orders</span>
                                </Link>

                                <Link
                                    to="/account/settings"
                                    onClick={onClose}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <i className="ri-settings-line text-xl"></i>
                                    <span className="font-medium">Settings</span>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Footer Info */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-center text-gray-500 dark:text-gray-400">
                        <div className="flex justify-center space-x-6 mb-3">
                            <a href="/privacy" className="hover:text-emerald-600">Privacy</a>
                            <a href="/terms" className="hover:text-emerald-600">Terms</a>
                            <a href="/support" className="hover:text-emerald-600">Help</a>
                        </div>
                        <p>© 2026 SokoNova Inc.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

