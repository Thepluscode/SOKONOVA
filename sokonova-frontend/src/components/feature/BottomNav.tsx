import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe-area lg:hidden">
            <div className="flex justify-around items-center h-16">
                <Link
                    to="/"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/')
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <i className={`text-2xl ${isActive('/') ? 'ri-home-fill' : 'ri-home-line'}`}></i>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link
                    to="/discover"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/discover')
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <i className={`text-2xl ${isActive('/discover') ? 'ri-compass-3-fill' : 'ri-compass-3-line'}`}></i>
                    <span className="text-[10px] font-medium">Discover</span>
                </Link>

                <Link
                    to="/sell"
                    className="flex flex-col items-center justify-center w-full h-full -mt-6"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
                        <i className="ri-add-line text-white text-2xl"></i>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">Sell</span>
                </Link>

                <Link
                    to="/cart"
                    className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/cart')
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <div className="relative">
                        <i className={`text-2xl ${isActive('/cart') ? 'ri-shopping-cart-fill' : 'ri-shopping-cart-line'}`}></i>
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            3
                        </span>
                    </div>
                    <span className="text-[10px] font-medium">Cart</span>
                </Link>

                <Link
                    to="/account"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/account')
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <i className={`text-2xl ${isActive('/account') ? 'ri-user-fill' : 'ri-user-line'}`}></i>
                    <span className="text-[10px] font-medium">Account</span>
                </Link>
            </div>
        </nav>
    );
}
