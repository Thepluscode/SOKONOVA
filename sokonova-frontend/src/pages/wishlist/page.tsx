import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import WishlistShare from '../../components/feature/WishlistShare';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { wishlistService, productsService, cartService } from '../../lib/services';
import { useAuth } from '../../lib/auth';
import type { Product } from '../../lib/types';

interface WishlistItemDisplay {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch wishlist items
  useEffect(() => {
    async function fetchWishlist() {
      setLoading(true);
      try {
        let productIds: string[] = [];

        if (user?.id) {
          // Fetch from API for logged in users
          const items = await wishlistService.getItems(user.id);
          productIds = items.map(item => item.productId);
        } else {
          // Use localStorage for anonymous users
          productIds = wishlistService.local.getItems();
        }

        if (productIds.length > 0) {
          // Fetch product details
          const products = await productsService.getByIds(productIds);

          setWishlistItems(products.map((p: Product) => ({
            id: p.id,
            productId: p.id,
            name: p.title,
            price: Number(p.price),
            originalPrice: Number(p.price) * 1.2, // Mock original price
            image: p.imageUrl || `https://readdy.ai/api/search-image?query=product&width=400&height=400&seq=${p.id}`,
            rating: 4.5,
            reviews: 128,
            inStock: true,
          })));
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [user?.id]);

  const handleRemove = async (productId: string) => {
    try {
      if (user?.id) {
        await wishlistService.removeByProduct(user.id, productId);
      } else {
        wishlistService.local.removeItem(productId);
      }
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) return;

    try {
      if (user?.id) {
        await wishlistService.clearAll(user.id);
      } else {
        wishlistService.local.clearAll();
      }
      setWishlistItems([]);
    } catch (err) {
      console.error('Failed to clear wishlist:', err);
    }
  };

  const addToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      if (user?.id) {
        await cartService.addItem(user.id, productId, 1);
      } else {
        // localStorage fallback
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((item: any) => item.productId === productId);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ productId, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonLoader key={i} type="card" />)}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">{wishlistItems.length} items saved</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors whitespace-nowrap"
              >
                <i className="ri-share-line mr-2"></i>Share Wishlist
              </button>
              {wishlistItems.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line mr-2"></i>Clear All
                </button>
              )}
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
                <i className="ri-heart-line text-6xl text-teal-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Save items you love for later!</p>
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift transition-all duration-500 group"
                >
                  <div className="relative">
                    <Link to={`/products/${item.productId}`}>
                      <div className="w-full h-64 bg-gray-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>

                    {!item.inStock && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}

                    {item.originalPrice > item.price && (
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <Link to={`/products/${item.productId}`} className="block mb-2 hover:text-teal-600 transition-colors">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                    </Link>

                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`text-sm ${i < Math.floor(item.rating) ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'}`}
                        ></i>
                      ))}
                      <span className="ml-2 text-xs text-gray-600">({item.reviews})</span>
                    </div>

                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(item.productId)}
                      disabled={!item.inStock || addingToCart === item.productId}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${item.inStock
                          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      {addingToCart === item.productId ? (
                        <i className="ri-loader-4-line animate-spin"></i>
                      ) : item.inStock ? (
                        <>
                          <i className="ri-shopping-cart-line mr-2"></i>Add to Cart
                        </>
                      ) : (
                        'Out of Stock'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showShareModal && (
        <WishlistShare
          wishlistId={user?.id || 'guest'}
          wishlistName="My Wishlist"
          itemCount={wishlistItems.length}
          onClose={() => setShowShareModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
