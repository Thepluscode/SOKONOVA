import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { productsService, cartService } from '../../lib/services';
import { useAuth } from '../../lib/auth';
import type { Product } from '../../lib/types';

export default function Discover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trending');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Fetch products based on active tab
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        // Fetch products based on tab (API can be extended to support sorting)
        const apiProducts = await productsService.list({ limit: 12 });
        setProducts(apiProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeTab]);

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      if (user?.id) {
        await cartService.addItem(user.id, productId, 1);
      } else {
        // Fallback to localStorage for anonymous users
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((item: any) => item.productId === productId);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ productId, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  const getProductImage = (product: Product, index: number) => {
    if (product.imageUrl) return product.imageUrl;
    return `https://readdy.ai/api/search-image?query=modern%20product%20photography%20white%20background&width=400&height=400&seq=discover-${index}&orientation=squarish`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore trending items, new arrivals, and personalized recommendations just for you
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            {[
              { id: 'trending', label: 'Trending', icon: 'ri-fire-line' },
              { id: 'new', label: 'New Arrivals', icon: 'ri-sparkle-line' },
              { id: 'popular', label: 'Popular', icon: 'ri-heart-line' },
              { id: 'deals', label: 'Best Deals', icon: 'ri-price-tag-3-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonLoader key={i} type="card" />)
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <i className="ri-box-3-line text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift card-hover cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${100 + index * 50}ms` }}
              >
                <div className="relative" onClick={() => navigate(`/products/${product.id}`)}>
                  <img
                    src={getProductImage(product, index)}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                  {index % 3 === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      HOT
                    </div>
                  )}
                  {index % 4 === 0 && (
                    <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      NEW
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-teal-600"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`ri-star-${i < 4 ? 'fill' : 'line'} text-yellow-400 text-sm`}></i>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      disabled={addingToCart === product.id}
                      className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-colors disabled:bg-teal-400"
                    >
                      {addingToCart === product.id ? (
                        <i className="ri-loader-4-line animate-spin"></i>
                      ) : (
                        <i className="ri-shopping-cart-line"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Personalized Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white mb-12">
          <div className="animate-float">
            <i className="ri-magic-line text-5xl mb-4"></i>
          </div>
          <h2 className="text-3xl font-bold mb-4">Get Personalized Recommendations</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Sign in to see products tailored to your interests and shopping history
          </p>
          <button
            onClick={() => navigate('/discover/personalized')}
            className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            View My Recommendations
          </button>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Electronics', icon: 'ri-smartphone-line', color: 'blue' },
              { name: 'Fashion', icon: 'ri-shirt-line', color: 'pink' },
              { name: 'Home', icon: 'ri-home-4-line', color: 'green' },
              { name: 'Beauty', icon: 'ri-heart-pulse-line', color: 'purple' },
              { name: 'Sports', icon: 'ri-basketball-line', color: 'orange' },
              { name: 'Books', icon: 'ri-book-open-line', color: 'indigo' }
            ].map((category, index) => (
              <div
                key={index}
                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                className="bg-white rounded-xl p-6 text-center hover-lift card-hover cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-${category.color}-100 flex items-center justify-center`}>
                  <i className={`${category.icon} text-3xl text-${category.color}-600`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
