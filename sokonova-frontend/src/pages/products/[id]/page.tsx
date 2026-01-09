import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import ImageZoom from '../../../components/feature/ImageZoom';
import SizeGuide from '../../../components/feature/SizeGuide';
import ProductQA from '../../../components/feature/ProductQA';
import SocialShare from '../../../components/feature/SocialShare';
import DeliveryPromise from '../../../components/feature/DeliveryPromise';
import FulfillmentInfo from '../../../components/feature/FulfillmentInfo';
import ProductBundles from '../../../components/feature/ProductBundles';
import StockNotification from '../../../components/feature/StockNotification';
import SocialProof from '../../../components/feature/SocialProof';
import ProductReviews from '../../../components/feature/ProductReviews';
import RecommendedProducts from '../../../components/feature/RecommendedProducts';
import BuyerSellerChat from '../../../components/feature/BuyerSellerChat';
import EnhancedPriceAlert from '../../../components/feature/EnhancedPriceAlert';
import AIRecommendations from '../../../components/feature/AIRecommendations';
import SmartRecommendations from '../../../components/feature/SmartRecommendations';
import RecentlyViewed from '../../../components/feature/RecentlyViewed';
import SkeletonLoader from '../../../components/base/SkeletonLoader';
import { productsService, cartService } from '../../../lib/services';
import { useAuth } from '../../../lib/auth';
import type { Product } from '../../../lib/types';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showChat, setShowChat] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const { user } = useAuth();

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

  // Fetch product from API
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const apiProduct = await productsService.getById(id);
        // Transform API product to display format
        setProduct({
          id: apiProduct.id,
          name: apiProduct.title,
          price: Number(apiProduct.price),
          originalPrice: Math.floor(Number(apiProduct.price) * 1.25),
          rating: apiProduct.ratingAvg || 4.5,
          reviews: apiProduct.ratingCount || Math.floor(Math.random() * 500) + 100,
          inStock: apiProduct.inventory?.quantity ? apiProduct.inventory.quantity > 0 : true,
          stock: apiProduct.inventory?.quantity || 50,
          images: [
            apiProduct.imageUrl || `https://readdy.ai/api/search-image?query=premium%20product%20photography%20on%20white%20background&width=600&height=600&seq=prod${id}&orientation=squarish`,
            `https://readdy.ai/api/search-image?query=product%20side%20view%20photography%20white%20background&width=600&height=600&seq=prod${id}-2&orientation=squarish`,
            `https://readdy.ai/api/search-image?query=product%20detail%20close%20up%20white%20background&width=600&height=600&seq=prod${id}-3&orientation=squarish`,
          ],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Blue', hex: '#3B82F6' },
          ],
          description: apiProduct.description || 'High-quality product with excellent features.',
          features: [
            'Premium quality materials',
            'Excellent durability',
            'Modern design',
            'Easy to use',
            'Great value for money',
          ],
          category: apiProduct.category || 'General',
          seller: {
            id: apiProduct.sellerId,
            name: apiProduct.seller?.shopName || 'SokoNova Seller',
            rating: apiProduct.seller?.ratingAvg || 4.8,
            sales: Math.floor(Math.random() * 10000) + 1000,
          },
        });
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      if (cartId) {
        await cartService.addItem(cartId, product.id, quantity);
        alert('Added to cart!');
      } else {
        // Fallback to localStorage
        const existingCart = localStorage.getItem('cart');
        const cart = existingCart ? JSON.parse(existingCart) : [];
        const existingIndex = cart.findIndex((item: any) => item.id === product.id);

        if (existingIndex > -1) {
          cart[existingIndex].quantity += quantity;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity,
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const addToWishlist = () => {
    alert('Added to wishlist!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <SkeletonLoader type="image" />
            <div className="space-y-4">
              <SkeletonLoader type="text" />
              <SkeletonLoader type="text" />
              <SkeletonLoader type="text" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product not found'}</h2>
          <Link to="/products" className="text-teal-600 hover:text-teal-700 font-medium">
            ← Back to products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/products" className="hover:text-teal-600 transition-colors">Products</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4 animate-slide-in-left">
            <div className="relative">
              <div
                className="relative bg-white rounded-xl overflow-hidden cursor-zoom-in"
                onClick={() => setShowZoom(true)}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                  <i className="ri-zoom-in-line mr-1.5"></i>
                  Click to zoom
                </div>
              </div>

              {showZoom && (
                <ImageZoom
                  image={product.images[selectedImage]}
                  alt={product.name}
                  onClose={() => setShowZoom(false)}
                />
              )}

              <div className="flex gap-3 mt-4 overflow-x-auto">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                        ? 'border-teal-500'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`${i < Math.floor(product.rating)
                          ? 'ri-star-fill text-yellow-400'
                          : 'ri-star-line text-gray-300'
                        }`}
                    ></i>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-teal-600 font-medium">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Color: {selectedColor && <span className="text-teal-600">{selectedColor}</span>}
              </label>
              <div className="flex space-x-3">
                {product.colors.map((color: any) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${selectedColor === color.name
                        ? 'border-teal-500 shadow-lg ring-4 ring-teal-100'
                        : 'border-gray-300 hover:border-teal-300'
                      }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Size: {selectedSize && <span className="text-teal-600">{selectedSize}</span>}
                </label>
                <SizeGuide />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all duration-300 hover:scale-105 ${selectedSize === size
                        ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md'
                        : 'border-gray-300 hover:border-teal-300 text-gray-700'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden hover:border-teal-500 transition-colors">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-teal-50 transition-colors"
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-none focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-teal-50 transition-colors"
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} items available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={addToCart}
                disabled={addingToCart || !product.inStock}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Adding...
                  </span>
                ) : (
                  <>
                    <i className="ri-shopping-cart-line mr-2"></i>
                    Add to Cart
                  </>
                )}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={addToWishlist}
                  className="border-2 border-teal-600 text-teal-600 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 hover:scale-105"
                >
                  <i className="ri-heart-line mr-2"></i>
                  Wishlist
                </button>
                <SocialShare
                  url={window.location.href}
                  title={product.name}
                  description={product.description}
                />
              </div>
            </div>

            {/* Contact Seller */}
            <button
              onClick={() => setShowChat(true)}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              <i className="ri-message-3-line mr-2"></i>
              Contact Seller
            </button>

            {/* Stock Notification */}
            {!product.inStock && (
              <StockNotification productId={product.id} productName={product.name} />
            )}

            <button
              onClick={() => setShowPriceAlert(true)}
              className="w-full text-teal-600 hover:text-teal-700 font-medium py-2"
            >
              <i className="ri-notification-line mr-2"></i>
              Set Price Drop Alert
            </button>

            {/* Delivery Promise */}
            <DeliveryPromise />

            {/* Fulfillment Info */}
            <FulfillmentInfo
              fulfillmentType="sokonova"
              processingTime="1-2 business days"
              shipsFrom="SOKONOVA Warehouse"
              seller={product.seller}
            />
          </div>
        </div>

        {/* Product Bundles */}
        <div className="mt-12">
          <ProductBundles currentProductId={product.id} />
        </div>

        {/* AI Recommendations */}
        <div className="mt-12">
          <AIRecommendations
            userId={user?.id || 'guest'}
            currentProductId={product.id}
            context="product"
          />
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {['description', 'features', 'seller'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-semibold capitalize transition-all duration-300 ${activeTab === tab
                      ? 'border-b-2 border-teal-600 text-teal-600'
                      : 'text-gray-600 hover:text-teal-600'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-3">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <i className="ri-checkbox-circle-fill text-teal-600 mr-3 mt-1"></i>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'seller' && (
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {product.seller.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{product.seller.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <i className="ri-star-fill text-yellow-400 mr-1"></i>
                        {product.seller.rating} rating
                      </span>
                      <span>{product.seller.sales.toLocaleString()} sales</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/store/${product.seller.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 hover:scale-105"
                >
                  Visit Store
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* Q&A */}
        <div className="mt-12">
          <ProductQA productId={product.id} />
        </div>

        {/* Smart Recommendations */}
        <div className="mt-12">
          <SmartRecommendations
            currentProductId={product.id}
            category={product.category}
            price={product.price}
          />
        </div>

        {/* Recently Viewed */}
        <div className="mt-12">
          <RecentlyViewed />
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <RecommendedProducts currentProductId={product.id} />
        </div>
      </div>

      <Footer />

      {/* Chat Modal */}
      {showChat && (
        <BuyerSellerChat
          productId={product.id}
          sellerId={product.seller.id}
          sellerName={product.seller.name}
          buyerId={user?.id || 'guest'}
          buyerName={user?.name || 'Guest'}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Price Alert Modal */}
      {showPriceAlert && (
        <EnhancedPriceAlert
          productId={product.id}
          productName={product.name}
          currentPrice={product.price}
          onClose={() => setShowPriceAlert(false)}
        />
      )}
    </div>
  );
}
