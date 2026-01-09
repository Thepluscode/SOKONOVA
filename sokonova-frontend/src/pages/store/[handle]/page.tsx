import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function SellerStorefrontPage() {
  const { handle } = useParams();
  const [activeTab, setActiveTab] = useState('products');

  const seller = {
    handle: handle || 'adunni-crafts',
    name: 'Adunni Crafts',
    bio: 'Specializing in authentic African textiles and handwoven fabrics. We preserve traditional weaving techniques passed down through generations while creating contemporary designs for modern fashion.',
    location: 'Lagos, Nigeria',
    memberSince: '2021',
    rating: 4.9,
    totalReviews: 342,
    totalSales: 1250,
    responseTime: '2 hours',
    banner: 'https://readdy.ai/api/search-image?query=African%20textile%20workshop%20with%20colorful%20fabrics%20and%20traditional%20weaving%20looms%2C%20vibrant%20patterns%2C%20cultural%20craftsmanship%20scene%2C%20warm%20lighting%2C%20professional%20photography&width=1200&height=300&seq=banner1&orientation=landscape',
    logo: 'https://readdy.ai/api/search-image?query=African%20woman%20artisan%20working%20on%20traditional%20crafts%20in%20workshop%2C%20professional%20portrait%2C%20warm%20lighting%2C%20authentic%20craftsmanship%20scene&width=200&height=200&seq=logo1&orientation=squarish',
    categories: ['Fashion & Clothing', 'Textiles', 'Home Decor'],
    policies: {
      shipping: 'Free shipping within Nigeria. International shipping available.',
      returns: '30-day return policy for unused items',
      processing: '3-5 business days processing time'
    }
  };

  const products = [
    {
      id: 1,
      name: 'Handwoven Kente Cloth Dress',
      price: 89.99,
      rating: 4.8,
      reviews: 124,
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20African%20Kente%20cloth%20dress%20with%20vibrant%20geometric%20patterns%2C%20handwoven%20textile%2C%20colorful%20stripes%2C%20professional%20product%20photography%20on%20white%20background&width=300&height=375&seq=store1&orientation=portrait',
      inStock: true
    },
    {
      id: 2,
      name: 'Ankara Print Maxi Skirt',
      price: 45.00,
      rating: 4.7,
      reviews: 89,
      image: 'https://readdy.ai/api/search-image?query=Colorful%20African%20Ankara%20print%20maxi%20skirt%2C%20vibrant%20patterns%2C%20fashion%20photography%2C%20white%20background%2C%20professional%20product%20shot&width=300&height=375&seq=store2&orientation=portrait',
      inStock: true
    },
    {
      id: 3,
      name: 'Traditional Dashiki Shirt',
      price: 38.00,
      rating: 4.6,
      reviews: 67,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20African%20Dashiki%20shirt%20with%20colorful%20embroidery%2C%20cultural%20fashion%2C%20white%20background%2C%20professional%20product%20photography&width=300&height=375&seq=store3&orientation=portrait',
      inStock: true
    },
    {
      id: 4,
      name: 'Wax Print Palazzo Pants',
      price: 52.00,
      rating: 4.5,
      reviews: 45,
      image: 'https://readdy.ai/api/search-image?query=African%20wax%20print%20palazzo%20pants%2C%20wide%20leg%20trousers%2C%20vibrant%20patterns%2C%20fashion%20photography%2C%20white%20background&width=300&height=375&seq=store4&orientation=portrait',
      inStock: true
    },
    {
      id: 5,
      name: 'Kente Cloth Scarf',
      price: 28.00,
      rating: 4.9,
      reviews: 156,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20Kente%20cloth%20scarf%2C%20colorful%20geometric%20patterns%2C%20fashion%20accessory%2C%20white%20background&width=300&height=375&seq=store5&orientation=portrait',
      inStock: true
    },
    {
      id: 6,
      name: 'African Print Headwrap',
      price: 18.00,
      rating: 4.8,
      reviews: 203,
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20African%20print%20headwrap%2C%20traditional%20head%20tie%2C%20colorful%20patterns%2C%20white%20background%2C%20professional%20product%20shot&width=300&height=375&seq=store6&orientation=portrait',
      inStock: false
    }
  ];

  const reviews = [
    {
      id: 1,
      author: 'Chioma Nwosu',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent quality and beautiful designs! Fast shipping and great customer service.',
      product: 'Handwoven Kente Cloth Dress'
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-10',
      comment: 'Love everything from this shop. Authentic African textiles with modern style.',
      product: 'Ankara Print Maxi Skirt'
    },
    {
      id: 3,
      author: 'Amina Ibrahim',
      rating: 4,
      date: '2024-01-05',
      comment: 'Beautiful products. Shipping took a bit longer than expected but worth the wait.',
      product: 'Traditional Dashiki Shirt'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Store Banner */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <img
          src={seller.banner}
          alt={seller.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Store Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 bg-white rounded-xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
              <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 bg-white rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{seller.name}</h1>
                  <p className="text-gray-600 mb-3">
                    <i className="ri-map-pin-line mr-1"></i>
                    {seller.location}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="ri-star-fill text-yellow-400 mr-1"></i>
                      {seller.rating} ({seller.totalReviews} reviews)
                    </div>
                    <div>{seller.totalSales} sales</div>
                    <div>Member since {seller.memberSince}</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" className="whitespace-nowrap">
                    <i className="ri-user-add-line mr-2"></i>
                    Follow
                  </Button>
                  <Button className="whitespace-nowrap">
                    <i className="ri-message-3-line mr-2"></i>
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Shop</h2>
              <p className="text-gray-700 mb-4">{seller.bio}</p>
              <div className="flex flex-wrap gap-2">
                {seller.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full whitespace-nowrap"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                {['products', 'reviews', 'policies'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium capitalize cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-b-2 border-emerald-600 text-emerald-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`${
                                i < Math.floor(product.rating)
                                  ? 'ri-star-fill text-yellow-400'
                                  : 'ri-star-line text-gray-300'
                              } text-sm`}
                            ></i>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.inStock ? (
                          <span className="text-xs text-green-600 font-medium">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.author}</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`${
                                i < review.rating
                                  ? 'ri-star-fill text-yellow-400'
                                  : 'ri-star-line text-gray-300'
                              } text-sm`}
                            ></i>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      <i className="ri-shopping-bag-line mr-1"></i>
                      Purchased: {review.product}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-truck-line text-emerald-600 mr-2"></i>
                    Shipping Policy
                  </h3>
                  <p className="text-gray-700">{seller.policies.shipping}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-arrow-go-back-line text-emerald-600 mr-2"></i>
                    Return Policy
                  </h3>
                  <p className="text-gray-700">{seller.policies.returns}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-time-line text-emerald-600 mr-2"></i>
                    Processing Time
                  </h3>
                  <p className="text-gray-700">{seller.policies.processing}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">{seller.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-medium text-gray-900">{seller.totalSales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Products</span>
                  <span className="font-medium text-gray-900">{products.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <i className="ri-star-fill text-yellow-400 mr-1"></i>
                    {seller.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <i className="ri-shield-check-line text-emerald-600 mr-2"></i>
                Verified Seller
              </h3>
              <p className="text-sm text-gray-700">
                This seller has been verified by SOKONOVA and meets our quality standards.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Shop</h3>
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-facebook-fill"></i>
                </button>
                <button className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-twitter-fill"></i>
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-whatsapp-fill"></i>
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-share-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
