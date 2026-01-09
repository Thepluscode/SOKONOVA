import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import GuestCheckout from '../../components/feature/GuestCheckout';
import SavedAddresses from '../../components/feature/SavedAddresses';
import SkeletonLoader from '../../components/base/SkeletonLoader';
import { cartService, productsService, ordersService, paymentsService } from '../../lib/services';
import { useAuth } from '../../lib/auth';
import type { Cart, CartItem, Product } from '../../lib/types';

interface DisplayCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<DisplayCartItem[]>([]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<'paystack' | 'flutterwave' | 'stripe'>('paystack');

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: user?.city || '',
    state: '',
    zipCode: '',
    phone: user?.phone || '',
  });

  // Fetch cart on mount
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      try {
        const apiCart = await cartService.get(user?.id);
        setCart(apiCart);

        if (apiCart.items && apiCart.items.length > 0) {
          const productIds = apiCart.items.map((item: CartItem) => item.productId);
          const products = await productsService.getByIds(productIds);

          const displayItems = apiCart.items.map((item: CartItem) => {
            const product = products.find((p: Product) => p.id === item.productId);
            return {
              id: item.id,
              productId: item.productId,
              name: product?.title || 'Product',
              price: Number(product?.price || 0),
              quantity: item.qty,
              image: product?.imageUrl || `https://readdy.ai/api/search-image?query=product&width=100&height=100&seq=${item.productId}&orientation=squarish`,
            };
          });

          setCartItems(displayItems);
        } else {
          // Redirect to cart if empty
          navigate('/cart');
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError('Failed to load cart. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [user?.id, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Process payment
    setProcessing(true);
    try {
      // Step 1: Create order from cart
      const order = await ordersService.create({
        userId: user?.id || 'guest',
        shippingAdr: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        buyerName: `${formData.firstName} ${formData.lastName}`,
        buyerPhone: formData.phone,
        buyerEmail: formData.email,
      }, cart!.id);

      // Step 2: Create payment intent
      const paymentIntent = await paymentsService.createIntent(order.id, selectedPaymentProvider);

      // Step 3: Redirect to payment or show success
      if (paymentIntent.checkoutUrl) {
        // Redirect to external payment page
        window.location.href = paymentIntent.checkoutUrl;
      } else {
        // Navigate to order confirmation
        navigate(`/order-success?orderId=${order.id}`);
      }
    } catch (err: any) {
      console.error('Checkout failed:', err);
      setError(err.message || 'Failed to process order. Please try again.');
      setProcessing(false);
    }
  };

  const handleAddressSelect = (address: any) => {
    setFormData({
      ...formData,
      address: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SkeletonLoader type="card" />
            </div>
            <div>
              <SkeletonLoader type="card" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Account', icon: 'ri-user-line' },
              { num: 2, label: 'Shipping', icon: 'ri-truck-line' },
              { num: 3, label: 'Payment', icon: 'ri-bank-card-line' },
            ].map((item, index) => (
              <div key={item.num} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= item.num
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    <i className={`${item.icon} text-xl`}></i>
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-semibold ${step >= item.num ? 'text-teal-600' : 'text-gray-600'}`}>
                      Step {item.num}
                    </p>
                    <p className={`text-xs ${step >= item.num ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.label}
                    </p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-teal-600 to-emerald-600 transition-all duration-500 ${step > item.num ? 'w-full' : 'w-0'
                          }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <i className="ri-error-warning-line text-red-500 text-xl"></i>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Account */}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

                  <GuestCheckout onGuestSelect={(guest) => setIsGuest(guest)} />

                  {isGuest && (
                    <div className="mt-6 space-y-4 animate-fade-in-up">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="mt-6 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Continue to Shipping
                  </button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                  <SavedAddresses onSelectAddress={handleAddressSelect} />

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                  {/* Payment Provider Selection */}
                  <div className="space-y-3 mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Payment Provider
                    </label>
                    {[
                      { id: 'paystack', name: 'Paystack', icon: 'ri-bank-card-line', desc: 'Pay with card, bank transfer, or USSD' },
                      { id: 'flutterwave', name: 'Flutterwave', icon: 'ri-flutter-fill', desc: 'Multiple payment options across Africa' },
                      { id: 'stripe', name: 'Stripe', icon: 'ri-visa-line', desc: 'International cards accepted' },
                    ].map((provider) => (
                      <label
                        key={provider.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentProvider === provider.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        <input
                          type="radio"
                          name="paymentProvider"
                          value={provider.id}
                          checked={selectedPaymentProvider === provider.id}
                          onChange={(e) => setSelectedPaymentProvider(e.target.value as any)}
                          className="sr-only"
                        />
                        <i className={`${provider.icon} text-2xl mr-4 ${selectedPaymentProvider === provider.id ? 'text-teal-600' : 'text-gray-500'
                          }`}></i>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{provider.name}</p>
                          <p className="text-sm text-gray-600">{provider.desc}</p>
                        </div>
                        {selectedPaymentProvider === provider.id && (
                          <i className="ri-checkbox-circle-fill text-teal-600 text-xl"></i>
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">
                      <i className="ri-information-line mr-2"></i>
                      You will be redirected to {selectedPaymentProvider} to complete your payment securely.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={processing}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
                    >
                      {processing ? (
                        <span className="flex items-center justify-center">
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          Processing...
                        </span>
                      ) : (
                        `Pay $${total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-slide-in-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? <span className="text-teal-600">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-teal-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-shield-check-line text-teal-600 mr-2"></i>
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-lock-line text-teal-600 mr-2"></i>
                  SSL encrypted
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-arrow-go-back-line text-teal-600 mr-2"></i>
                  30-day return policy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
