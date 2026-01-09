import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { storefrontService } from '../../lib/services';

interface Seller {
  id: string;
  name: string;
  handle: string;
  description: string;
  image: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  location: string;
  verified: boolean;
  badge?: string;
}

const SellersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const categories = [
    'All Categories',
    'Fashion & Apparel',
    'Electronics',
    'Home & Living',
    'Beauty & Personal Care',
    'Food & Beverages',
    'Arts & Crafts',
    'Books & Media',
    'Sports & Outdoors'
  ];

  const locations = [
    'All Locations',
    'Nigeria',
    'Kenya',
    'South Africa',
    'Ghana',
    'Tanzania',
    'Uganda',
    'Rwanda',
    'Ethiopia'
  ];

  // Fetch sellers from API
  useEffect(() => {
    async function fetchSellers() {
      setLoading(true);
      try {
        const apiSellers = await storefrontService.listSellers({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          location: selectedLocation !== 'all' ? selectedLocation : undefined,
          search: searchQuery || undefined,
        });

        // Transform API response to match component interface
        setSellers(apiSellers.map((s: any) => ({
          id: s.id,
          name: s.name || s.storeName,
          handle: s.handle || s.id,
          description: s.description || 'Quality products from trusted sellers.',
          image: s.image || `https://readdy.ai/api/search-image?query=store%20front&width=400&height=400&seq=${s.id}&orientation=squarish`,
          rating: s.rating || 4.5,
          totalReviews: s.totalReviews || 0,
          totalProducts: s.totalProducts || 0,
          location: s.location || 'Africa',
          verified: s.verified || true,
          badge: s.badge,
        })));
      } catch (err) {
        console.error('Failed to fetch sellers:', err);
        // Keep empty array - will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchSellers();
  }, [selectedCategory, selectedLocation, searchQuery]);

  const filteredSellers = sellers;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Discover Trusted Sellers
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Connect with verified sellers across Africa. Browse thousands of quality products from trusted merchants.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sellers by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pr-12 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <i className="ri-search-line absolute right-6 top-1/2 -translate-y-1/2 text-xl text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <i className="ri-filter-3-line text-lg text-gray-600"></i>
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat.toLowerCase().replace(/ /g, '-')}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {locations.map((loc, index) => (
                  <option key={index} value={loc.toLowerCase().replace(/ /g, '-')}>
                    {loc}
                  </option>
                ))}
              </select>

              <div className="ml-auto text-sm text-gray-600">
                <strong>{filteredSellers.length}</strong> sellers found
              </div>
            </div>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSellers.map((seller) => (
              <Link
                key={seller.id}
                to={`/store/${seller.handle}`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Seller Image */}
                <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  {seller.badge && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {seller.badge}
                    </div>
                  )}
                  {seller.verified && (
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg">
                      <i className="ri-verified-badge-fill text-emerald-500 text-lg"></i>
                    </div>
                  )}
                </div>

                {/* Seller Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {seller.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {seller.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <i className="ri-map-pin-line text-base"></i>
                    <span>{seller.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-400 text-base"></i>
                      <span className="text-sm font-semibold text-gray-900">{seller.rating}</span>
                      <span className="text-sm text-gray-500">({seller.totalReviews})</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>{seller.totalProducts}</strong> products
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to Become a Seller?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Join thousands of successful sellers on SOKONOVA. Start selling your products to customers across Africa and beyond.
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              Start Selling Today
              <i className="ri-arrow-right-line text-lg"></i>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellersPage;
