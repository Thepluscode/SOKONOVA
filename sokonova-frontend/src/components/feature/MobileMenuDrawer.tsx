import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);

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

                    {/* User Profile (Quick Access) */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                        <Link to="/login" onClick={onClose} className="flex items-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-3 transition-colors">
                            <i className="ri-login-box-line text-xl"></i>
                            <span className="font-medium">Sign In</span>
                            <i className="ri-arrow-right-s-line ml-auto"></i>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
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

                        <Link
                            to="/sell"
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                        >
                            <i className="ri-store-2-line text-xl"></i>
                            <span className="font-medium">Start Selling</span>
                        </Link>

                        <div className="py-2 border-t border-gray-100 dark:border-gray-800 my-2"></div>

                        <Link
                            to="/wishlist"
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <i className="ri-heart-line text-xl"></i>
                            <span className="font-medium">Wishlist</span>
                        </Link>

                        <Link
                            to="/orders"
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <i className="ri-file-list-3-line text-xl"></i>
                            <span className="font-medium">My Orders</span>
                        </Link>

                        <Link
                            to="/settings"
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <i className="ri-settings-line text-xl"></i>
                            <span className="font-medium">Settings</span>
                        </Link>
                    </nav>

                    {/* Footer Info */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-center text-gray-500 dark:text-gray-400">
                        <div className="flex justify-center space-x-6 mb-3">
                            <a href="#" className="hover:text-emerald-600">Privacy</a>
                            <a href="#" className="hover:text-emerald-600">Terms</a>
                            <a href="#" className="hover:text-emerald-600">Help</a>
                        </div>
                        <p>© 2026 SokoNova Inc.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
