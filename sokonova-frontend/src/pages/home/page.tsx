import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import FlashSaleCountdown from '../../components/feature/FlashSaleCountdown';
import RecommendedProducts from '../../components/feature/RecommendedProducts';
import RecentlyViewed from '../../components/feature/RecentlyViewed';
import SocialProof from '../../components/feature/SocialProof';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    {
      name: 'Electronics',
      image: 'https://readdy.ai/api/search-image?query=modern%20sleek%20electronic%20devices%20including%20smartphones%20laptops%20and%20tablets%20arranged%20on%20minimalist%20white%20surface%20with%20soft%20lighting%20and%20clean%20background%20professional%20product%20photography%20style&width=400&height=400&seq=cat1&orientation=squarish',
      count: '2,450 items',
      icon: 'ri-smartphone-line',
    },
    {
      name: 'Fashion',
      image: 'https://readdy.ai/api/search-image?query=elegant%20fashion%20clothing%20items%20including%20dresses%20and%20accessories%20displayed%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20minimalist%20professional%20product%20photography&width=400&height=400&seq=cat2&orientation=squarish',
      count: '5,890 items',
      icon: 'ri-shirt-line',
    },
    {
      name: 'Home & Garden',
      image: 'https://readdy.ai/api/search-image?query=beautiful%20home%20decor%20items%20and%20garden%20accessories%20arranged%20on%20clean%20white%20surface%20with%20natural%20lighting%20minimalist%20professional%20product%20photography%20style&width=400&height=400&seq=cat3&orientation=squarish',
      count: '3,210 items',
      icon: 'ri-home-4-line',
    },
    {
      name: 'Sports & Outdoors',
      image: 'https://readdy.ai/api/search-image?query=sports%20equipment%20and%20outdoor%20gear%20including%20fitness%20accessories%20arranged%20on%20clean%20white%20background%20with%20professional%20lighting%20minimalist%20product%20photography&width=400&height=400&seq=cat4&orientation=squarish',
      count: '1,780 items',
      icon: 'ri-basketball-line',
    },
    {
      name: 'Beauty & Health',
      image: 'https://readdy.ai/api/search-image?query=luxury%20beauty%20and%20health%20products%20including%20cosmetics%20and%20skincare%20items%20on%20clean%20white%20surface%20with%20soft%20lighting%20professional%20product%20photography%20style&width=400&height=400&seq=cat5&orientation=squarish',
      count: '4,320 items',
      icon: 'ri-heart-pulse-line',
    },
    {
      name: 'Books & Media',
      image: 'https://readdy.ai/api/search-image?query=collection%20of%20books%20and%20media%20items%20arranged%20neatly%20on%20clean%20white%20background%20with%20soft%20natural%20lighting%20minimalist%20professional%20product%20photography&width=400&height=400&seq=cat6&orientation=squarish',
      count: '2,940 items',
      icon: 'ri-book-open-line',
    },
  ];

  const featuredSellers = [
    {
      name: 'TechHub Store',
      rating: 4.9,
      sales: '15.2K',
      image: 'https://readdy.ai/api/search-image?query=modern%20technology%20store%20logo%20with%20clean%20minimalist%20design%20on%20white%20background%20professional%20branding%20style&width=200&height=200&seq=seller1&orientation=squarish',
      verified: true,
    },
    {
      name: 'Fashion Forward',
      rating: 4.8,
      sales: '12.8K',
      image: 'https://readdy.ai/api/search-image?query=elegant%20fashion%20boutique%20logo%20with%20sophisticated%20design%20on%20white%20background%20professional%20branding%20style&width=200&height=200&seq=seller2&orientation=squarish',
      verified: true,
    },
    {
      name: 'Home Essentials',
      rating: 4.9,
      sales: '18.5K',
      image: 'https://readdy.ai/api/search-image?query=home%20decor%20store%20logo%20with%20warm%20inviting%20design%20on%20white%20background%20professional%20branding%20style&width=200&height=200&seq=seller3&orientation=squarish',
      verified: true,
    },
    {
      name: 'Sports Pro',
      rating: 4.7,
      sales: '9.3K',
      image: 'https://readdy.ai/api/search-image?query=sports%20equipment%20store%20logo%20with%20dynamic%20athletic%20design%20on%20white%20background%20professional%20branding%20style&width=200&height=200&seq=seller4&orientation=squarish',
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      {/* Hero Section with Animation */}
      <section className="relative bg-gradient-to-r from-teal-600 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20"></div>
        <div 
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-50 max-w-3xl mx-auto">
              Shop from thousands of trusted sellers worldwide. Quality products, competitive prices, secure transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl whitespace-nowrap"
              >
                <i className="ri-shopping-bag-line mr-2 text-xl"></i>
                Start Shopping
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                <i className="ri-store-2-line mr-2 text-xl"></i>
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-8 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FlashSaleCountdown 
            endTime={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)} 
            productName="Summer Collection"
          />
        </div>
      </section>

      {/* Categories Section with Stagger Animation */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Explore our wide range of products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 bg-teal-100 rounded-full group-hover:bg-teal-600 transition-colors duration-300">
                      <i className={`${category.icon} text-2xl text-teal-600 group-hover:text-white transition-colors duration-300`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sellers Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Sellers</h2>
            <p className="text-lg text-gray-600">Shop from our top-rated trusted sellers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSellers.map((seller, index) => (
              <div
                key={seller.name}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-teal-100">
                      <img
                        src={seller.image}
                        alt={seller.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {seller.verified && (
                      <div className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-teal-600 rounded-full border-4 border-white">
                        <i className="ri-verified-badge-fill text-white text-sm"></i>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{seller.name}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-400"></i>
                      <span className="font-medium">{seller.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-shopping-bag-line text-gray-400"></i>
                      <span>{seller.sales} sales</span>
                    </div>
                  </div>
                  <Link
                    to={`/store/${seller.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors duration-300 whitespace-nowrap"
                  >
                    Visit Store
                    <i className="ri-arrow-right-line ml-2"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendedProducts />
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyViewed />
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: 'ri-shield-check-line', title: 'Secure Payments', desc: 'SSL encrypted checkout' },
              { icon: 'ri-truck-line', title: 'Fast Shipping', desc: 'Worldwide delivery' },
              { icon: 'ri-customer-service-2-line', title: '24/7 Support', desc: 'Always here to help' },
              { icon: 'ri-arrow-go-back-line', title: 'Easy Returns', desc: '30-day return policy' },
            ].map((badge, index) => (
              <div
                key={badge.title}
                className="text-center transform hover:scale-105 transition-transform duration-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full">
                  <i className={`${badge.icon} text-3xl text-teal-600`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <SocialProof />
    </div>
  );
}
