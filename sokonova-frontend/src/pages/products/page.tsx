import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AdvancedFilters, { type FilterOptions } from '../../components/feature/AdvancedFilters';
import InfiniteScroll from '../../components/feature/InfiniteScroll';
import FlashSaleCountdown from '../../components/feature/FlashSaleCountdown';
import ProductQuickView from '../../components/feature/ProductQuickView';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import SocialProof from '../../components/feature/SocialProof';
import { discoveryService, cartService } from '../../lib/services';
import type { Product } from '../../lib/types';
import { useAuth } from '../../lib/auth';

// Transform API product to display format
function transformProduct(product: Product) {
  return {
    id: product.id,
    name: product.title,
    price: Number(product.price),
    originalPrice: Math.floor(Number(product.price) * 1.3), // Simulate original price
    rating: product.ratingAvg?.toFixed(1) || '4.5',
    reviews: product.ratingCount || Math.floor(Math.random() * 200) + 20,
    image: product.imageUrl || `https://readdy.ai/api/search-image?query=premium%20quality%20product%20item%20on%20clean%20white%20background%20with%20professional%20lighting%20minimalist%20product%20photography%20style&width=400&height=400&seq=prod${product.id}&orientation=squarish`,
    category: product.category || 'General',
    seller: product.seller?.shopName || `Seller`,
    inStock: product.inventory?.quantity ? product.inventory.quantity > 0 : true,
    featured: Math.random() > 0.7,
    discount: Math.floor(Math.random() * 30) + 10,
  };
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('trending');
  const [cartNotification, setCartNotification] = useState<{ show: boolean, product: string }>({ show: false, product: '' });
  const [cartId, setCartId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const { user } = useAuth();

  const parseNumberParam = (value: string): number | undefined => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  // Initialize cart
  useEffect(() => {
    async function initCart() {
      try {
        const cart = await cartService.get(user?.id);
        setCartId(cart.id);
      } catch (err) {
        console.error('Failed to initialize cart:', err);
      }
    }
    initCart();
  }, [user?.id]);

  const queryFilters = useMemo(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const country = searchParams.get('country') || '';
    const inStock = searchParams.get('inStock') === 'true';
    const sort = searchParams.get('sort') || '';

    return { q, category, minPrice, maxPrice, country, inStock, sort };
  }, [searchParams]);

  useEffect(() => {
    if (queryFilters.sort) {
      setSortBy(queryFilters.sort);
    }
  }, [queryFilters.sort]);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        const categoryFromFilters =
          filters?.categories.length ? filters.categories[0] : undefined;
        const minPriceValue =
          filters?.priceRange && filters.priceRange[0] > 0
            ? filters.priceRange[0]
            : undefined;
        const maxPriceValue =
          filters?.priceRange && filters.priceRange[1] < 1000
            ? filters.priceRange[1]
            : undefined;
        const ratingValue = filters?.rating && filters.rating > 0 ? filters.rating : undefined;
        const inStockValue = filters?.inStock ?? queryFilters.inStock;

        const response = await discoveryService.search({
          q: queryFilters.q || undefined,
          category: queryFilters.category || categoryFromFilters || undefined,
          minPrice:
            queryFilters.minPrice !== ''
              ? parseNumberParam(queryFilters.minPrice)
              : minPriceValue,
          maxPrice:
            queryFilters.maxPrice !== ''
              ? parseNumberParam(queryFilters.maxPrice)
              : maxPriceValue,
          rating: ratingValue,
          inStock: inStockValue,
          country: queryFilters.country || undefined,
          sort: (queryFilters.sort || sortBy) as
            | 'trending'
            | 'newest'
            | 'price_asc'
            | 'price_desc'
            | 'rating'
            | 'popular',
          page: 1,
          limit: 18,
        });

        const transformed = response.items.map(transformProduct);
        setProducts(transformed);
        setTotalCount(response.pagination.total);
        setHasMore(response.pagination.page < response.pagination.totalPages);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Could not load products. Please try again.');
        // Fallback to empty array
        setProducts([]);
        setHasMore(false);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [filters, sortBy, queryFilters]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const categoryFromFilters =
        filters?.categories.length ? filters.categories[0] : undefined;
      const minPriceValue =
        filters?.priceRange && filters.priceRange[0] > 0
          ? filters.priceRange[0]
          : undefined;
      const maxPriceValue =
        filters?.priceRange && filters.priceRange[1] < 1000
          ? filters.priceRange[1]
          : undefined;
      const ratingValue = filters?.rating && filters.rating > 0 ? filters.rating : undefined;
      const inStockValue = filters?.inStock ?? queryFilters.inStock;

      const response = await discoveryService.search({
        q: queryFilters.q || undefined,
        category: queryFilters.category || categoryFromFilters || undefined,
        minPrice:
          queryFilters.minPrice !== ''
            ? parseNumberParam(queryFilters.minPrice)
            : minPriceValue,
        maxPrice:
          queryFilters.maxPrice !== ''
            ? parseNumberParam(queryFilters.maxPrice)
            : maxPriceValue,
        rating: ratingValue,
        inStock: inStockValue,
        country: queryFilters.country || undefined,
        sort: (queryFilters.sort || sortBy) as
          | 'trending'
          | 'newest'
          | 'price_asc'
          | 'price_desc'
          | 'rating'
          | 'popular',
        page: nextPage,
        limit: 18,
      });

      const transformed = response.items.map(transformProduct);
      setProducts((prev) => [...prev, ...transformed]);
      setPage(nextPage);
      setHasMore(response.pagination.page < response.pagination.totalPages);
      setTotalCount(response.pagination.total);
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (cartId) {
        // Use API to add to cart
        await cartService.addItem(cartId, product.id, 1);
      } else {
        // Fallback to localStorage for anonymous users
        const existingCart = localStorage.getItem('cart');
        const cart = existingCart ? JSON.parse(existingCart) : [];

        const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);

        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
      }

      setCartNotification({ show: true, product: product.name });

      setTimeout(() => {
        setCartNotification({ show: false, product: '' });
      }, 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Show error notification
      setCartNotification({ show: true, product: 'Failed to add item' });
      setTimeout(() => {
        setCartNotification({ show: false, product: '' });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Cart Notification */}
      {cartNotification.show && (
        <div className="fixed top-24 right-4 z-50 bg-white rounded-xl shadow-2xl p-4 flex items-center space-x-3 animate-slide-in-right border-l-4 border-teal-600">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
            <i className="ri-shopping-cart-line text-teal-600 text-xl"></i>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Added to cart!</p>
            <p className="text-xs text-gray-600">{cartNotification.product}</p>
          </div>
          <button
            onClick={() => setCartNotification({ show: false, product: '' })}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
      )}

      {/* Flash Sale Banner */}
      <FlashSaleCountdown
        endTime={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        discount={30}
      />

      {/* Breadcrumb with Animation */}
      <div className="bg-white border-b border-gray-200 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600 transition-colors duration-300">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">Products</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 animate-slide-in-left">
              <AdvancedFilters onFilterChange={setFilters} />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar with Animation */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalCount}</span> products
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-all duration-300 ${viewMode === 'grid'
                          ? 'bg-white shadow-sm text-teal-600'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <i className="ri-grid-line text-lg"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-all duration-300 ${viewMode === 'list'
                          ? 'bg-white shadow-sm text-teal-600'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <i className="ri-list-check text-lg"></i>
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 cursor-pointer"
                  >
                    <option value="trending">Trending</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <i className="ri-error-warning-line text-red-500 text-xl"></i>
                  <div>
                    <p className="text-red-800 font-medium">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-red-600 hover:text-red-800 text-sm underline mt-1"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonLoader key={i} type="card" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found.</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <InfiniteScroll
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loadingMore}
                threshold={400}
              >
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                      }}
                    >
                      {viewMode === 'grid' ? (
                        // Grid View
                        <>
                          <div className="relative overflow-hidden">
                            <Link to={`/products/${product.id}`}>
                              <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                            </Link>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {product.featured && (
                                <span className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full animate-pulse-ring">
                                  Featured
                                </span>
                              )}
                              {product.discount > 0 && (
                                <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                  -{product.discount}%
                                </span>
                              )}
                            </div>

                            {/* Quick Actions */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => handleQuickView(product)}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-teal-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                                title="Quick View"
                              >
                                <i className="ri-eye-line"></i>
                              </button>
                              <button
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                                title="Add to Wishlist"
                              >
                                <i className="ri-heart-line"></i>
                              </button>
                            </div>

                            {/* Stock Status */}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="mb-2">
                              <span className="text-xs text-gray-500">{product.category}</span>
                            </div>
                            <Link to={`/products/${product.id}`}>
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <i className="ri-star-fill text-yellow-400 text-sm"></i>
                                <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                              </div>
                              <span className="text-sm text-gray-500">({product.reviews})</span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-2xl font-bold text-teal-600">
                                ${product.price}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={!product.inStock}
                              className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 whitespace-nowrap ripple-effect"
                            >
                              {product.inStock ? (
                                <>
                                  <i className="ri-shopping-cart-line mr-2"></i>
                                  Add to Cart
                                </>
                              ) : (
                                'Out of Stock'
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        // List View
                        <div className="flex gap-4 p-4">
                          <Link to={`/products/${product.id}`} className="flex-shrink-0">
                            <div className="relative w-48 h-48 overflow-hidden rounded-lg bg-gray-100">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          </Link>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <span className="text-xs text-gray-500">{product.category}</span>
                                  <Link to={`/products/${product.id}`}>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                                      {product.name}
                                    </h3>
                                  </Link>
                                </div>
                                <div className="flex gap-2">
                                  {product.featured && (
                                    <span className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full">
                                      Featured
                                    </span>
                                  )}
                                  {product.discount > 0 && (
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                      -{product.discount}%
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1">
                                  <i className="ri-star-fill text-yellow-400"></i>
                                  <span className="font-medium text-gray-900">{product.rating}</span>
                                </div>
                                <span className="text-gray-500">({product.reviews} reviews)</span>
                              </div>

                              <p className="text-gray-600 mb-4">
                                High-quality product with excellent features and great value for money. Perfect for your needs.
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-teal-600">
                                  ${product.price}
                                </span>
                                {product.originalPrice > product.price && (
                                  <span className="text-lg text-gray-400 line-through">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleQuickView(product)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-teal-600 hover:text-teal-600 transition-all duration-300 whitespace-nowrap"
                                >
                                  Quick View
                                </button>
                                <button
                                  onClick={(e) => handleAddToCart(product, e)}
                                  disabled={!product.inStock}
                                  className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
                                >
                                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </main>
        </div>
      </div>

      {/* Social Proof */}
      <SocialProof />

      <Footer />

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
