import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { cartService, productsService } from '../../lib/services';
import { useAuth } from '../../lib/auth';
import type { Cart, CartItem, Product } from '../../lib/types';

interface DisplayCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller: string;
  inStock: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<DisplayCartItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const { user } = useAuth();

  // Fetch cart from API
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      try {
        const apiCart = await cartService.get(user?.id);
        setCart(apiCart);

        // If cart has items, fetch product details
        if (apiCart.items && apiCart.items.length > 0) {
          const productIds = apiCart.items.map((item: CartItem) => item.productId);
          const products = await productsService.getByIds(productIds);

          // Map cart items with product details
          const displayItems = apiCart.items.map((item: CartItem) => {
            const product = products.find((p: Product) => p.id === item.productId);
            return {
              id: item.id,
              productId: item.productId,
              name: product?.title || 'Product',
              price: Number(product?.price || 0),
              quantity: item.qty,
              image: product?.imageUrl || `https://readdy.ai/api/search-image?query=product%20photography&width=200&height=200&seq=${item.productId}&orientation=squarish`,
              seller: product?.seller?.shopName || 'SokoNova Seller',
              inStock: product?.inventory?.quantity ? product.inventory.quantity > 0 : true,
            };
          });

          setCartItems(displayItems);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        // Fallback to localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const items = JSON.parse(localCart);
          setCartItems(items.map((item: any) => ({
            id: item.id,
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            seller: item.seller || 'SokoNova Seller',
            inStock: true,
          })));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [user?.id]);

  const updateQuantity = async (id: string, productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(id);
    try {
      if (cart) {
        await cartService.updateQuantity(cart.id, productId, newQuantity);
      }
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (id: string, productId: string) => {
    setUpdating(id);
    try {
      if (cart) {
        await cartService.removeItem(cart.id, productId);
      }
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setUpdating(null);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-teal-100">Loading your cart...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <SkeletonLoader key={i} type="card" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-12 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-teal-100">{cartItems.length} items in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center animate-scale-in">
              <i className="ri-shopping-cart-line text-6xl text-teal-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-lg p-6 hover-lift transition-all duration-500 animate-slide-in-left ${updating === item.id ? 'opacity-50' : ''
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="text-lg font-bold text-gray-900 hover:text-teal-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            Sold by <span className="text-teal-600 font-medium">{item.seller}</span>
                          </p>
                          {!item.inStock && (
                            <span className="inline-block mt-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold animate-pulse-ring">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.productId)}
                          disabled={updating === item.id}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          <i className="ri-delete-bin-line text-xl"></i>
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden hover:border-teal-500 transition-colors">
                          <button
                            onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                            disabled={updating === item.id}
                            className="px-4 py-2 bg-gray-100 hover:bg-teal-50 transition-colors disabled:opacity-50"
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, item.productId, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border-none focus:outline-none"
                            disabled={updating === item.id}
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="px-4 py-2 bg-gray-100 hover:bg-teal-50 transition-colors disabled:opacity-50"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold transition-colors animate-fade-in-up"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-slide-in-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-teal-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-teal-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="mb-4 p-3 bg-teal-50 rounded-lg text-sm text-teal-700">
                    <i className="ri-truck-line mr-2"></i>
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                    />
                    <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="block w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-center hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Proceed to Checkout
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-shield-check-line text-teal-600 mr-2"></i>
                    Secure checkout
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-truck-line text-teal-600 mr-2"></i>
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-arrow-go-back-line text-teal-600 mr-2"></i>
                    30-day return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
