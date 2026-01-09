import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationCenter from './NotificationCenter';
import LiveChat from './LiveChat';
import AdvancedSearch, { type SearchFilters } from './AdvancedSearch';
import LanguageSwitcher from './LanguageSwitcher';
import VisualSearch from './VisualSearch';
import VoiceSearch from './VoiceSearch';
import CurrencySwitcher from './CurrencySwitcher';
import MobileMenuDrawer from './MobileMenuDrawer';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isDark, toggleTheme } = useTheme();

  const handleAdvancedSearch = (filters: SearchFilters) => {
    console.log('Search filters:', filters);
    // Navigate to products page with filters
    if (typeof window.REACT_APP_NAVIGATE === 'function') {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      window.REACT_APP_NAVIGATE(`/products?${params.toString()}`);
    }
  };

  const handleVisualSearch = (imageUrl: string) => {
    console.log('Visual search with image:', imageUrl);
    setShowVisualSearch(false);
    if (typeof window.REACT_APP_NAVIGATE === 'function') {
      window.REACT_APP_NAVIGATE('/products?visual=true');
    }
  };

  const handleVoiceSearch = (query: string) => {
    console.log('Voice search query:', query);
    setShowVoiceSearch(false);
    if (typeof window.REACT_APP_NAVIGATE === 'function') {
      window.REACT_APP_NAVIGATE(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <a href="/" className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">SOKONOVA</span>
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                <a href="/products" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium cursor-pointer whitespace-nowrap">
                  Products
                </a>
                <a href="/services" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium cursor-pointer whitespace-nowrap">
                  Services
                </a>
                <a href="/discover" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium cursor-pointer whitespace-nowrap">
                  Discover
                </a>
                <a href="/sell" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium cursor-pointer whitespace-nowrap">
                  Sell
                </a>
              </nav>
            </div>

            {/* Search Bar - Hide on Mobile, show icon instead */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              {/* ... existing search code ... */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, services, or sellers..."
                  className="w-full pl-12 pr-32 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setShowVoiceSearch(true)}
                    className="w-8 h-8 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors whitespace-nowrap"
                    title="Voice Search"
                  >
                    <i className="ri-mic-line text-lg"></i>
                  </button>
                  <button
                    onClick={() => setShowVisualSearch(true)}
                    className="w-8 h-8 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors whitespace-nowrap"
                    title="Visual Search"
                  >
                    <i className="ri-camera-line text-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <i className="ri-sun-line text-xl text-yellow-400"></i>
                ) : (
                  <i className="ri-moon-line text-xl text-gray-700"></i>
                )}
              </button>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Notifications - Hidden on Mobile, possibly visible in drawer or separate screen */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <i className="ri-notification-3-line text-xl text-gray-700 dark:text-gray-300"></i>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationCenter
                      onClose={() => setShowNotifications(false)}
                      onUpdateCount={setUnreadCount}
                    />
                  )}
                </div>

                <div className="hidden md:block">
                  <CurrencySwitcher />
                </div>
                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>

                {/* Live Chat - Hidden on mobile to save space */}
                <div className="hidden lg:block">
                  <LiveChat />
                </div>
              </div>

              {/* Mobile Search Button */}
              <button
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => { /* Open mobile search logic - out of scope for now but good placeholder */ }}
              >
                <i className="ri-search-line text-xl text-gray-700 dark:text-gray-300"></i>
              </button>

              {/* Wishlist - Hidden on Mobile (in drawer) */}
              <a
                href="/wishlist"
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <i className="ri-heart-line text-xl text-gray-700 dark:text-gray-300"></i>
              </a>

              {/* Cart - Visible on Tablet, Hidden on Mobile (in BottomNav) */}
              <a
                href="/cart"
                className="hidden md:flex relative w-10 h-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <i className="ri-shopping-cart-line text-xl text-gray-700 dark:text-gray-300"></i>
              </a>

              {/* User Menu - Desktop Only */}
              <div className="relative hidden lg:block">
                {/* ... existing user menu code ... */}
                <a
                  href="/auth/signin"
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-login-box-line"></i>
                  <span className="text-sm font-medium">Sign In</span>
                </a>

              </div>

              {/* Mobile Menu Button - Visible on Tablet/Mobile */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <i className="ri-menu-line text-2xl text-gray-700 dark:text-gray-300"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Other Modals... */}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
        />
      )}

      {/* Visual Search Modal */}
      {showVisualSearch && (
        <VisualSearch
          onSearch={handleVisualSearch}
          onClose={() => setShowVisualSearch(false)}
        />
      )}

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <VoiceSearch
          onSearch={handleVoiceSearch}
          onClose={() => setShowVoiceSearch(false)}
        />
      )}
    </>
  );
}
