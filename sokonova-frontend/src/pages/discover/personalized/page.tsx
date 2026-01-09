import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function PersonalizedFeedPage() {
  const recommendedProducts = [
    {
      id: 1,
      name: 'Ankara Print Dress',
      price: 65.00,
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20African%20Ankara%20print%20dress%2C%20vibrant%20patterns%2C%20fashion%20photography%2C%20white%20background%2C%20professional%20product%20shot&width=300&height=375&seq=rec1&orientation=portrait',
      reason: 'Based on your recent views',
      seller: 'Amara Fashion House'
    },
    {
      id: 2,
      name: 'Beaded Jewelry Set',
      price: 38.00,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20African%20beaded%20jewelry%20set%2C%20colorful%20necklace%20and%20earrings%2C%20handcrafted%2C%20white%20background&width=300&height=375&seq=rec2&orientation=portrait',
      reason: 'Popular in Fashion &amp; Beauty',
      seller: 'Adunni Crafts'
    },
    {
      id: 3,
      name: 'Woven Basket Set',
      price: 42.00,
      image: 'https://readdy.ai/api/search-image?query=Handwoven%20African%20baskets%20set%2C%20natural%20materials%2C%20traditional%20craftsmanship%2C%20white%20background%2C%20home%20decor&width=300&height=375&seq=rec3&orientation=portrait',
      reason: 'Because you viewed similar items',
      seller: 'Ubuntu Wellness'
    },
    {
      id: 4,
      name: 'Shea Butter Soap',
      price: 15.99,
      image: 'https://readdy.ai/api/search-image?query=Natural%20shea%20butter%20soap%20bars%2C%20organic%20skincare%2C%20clean%20packaging%2C%20white%20background%2C%20beauty%20product%20photography&width=300&height=375&seq=rec4&orientation=portrait',
      reason: 'Recommended for you',
      seller: 'Natural Beauty Co'
    }
  ];

  const trendingInCity = [
    {
      id: 5,
      name: 'Kente Cloth Scarf',
      price: 28.00,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20Kente%20cloth%20scarf%2C%20colorful%20geometric%20patterns%2C%20fashion%20accessory%2C%20white%20background&width=300&height=375&seq=trend1&orientation=portrait',
      city: 'Lagos',
      trending: true
    },
    {
      id: 6,
      name: 'Wooden Wall Art',
      price: 85.00,
      image: 'https://readdy.ai/api/search-image?query=African%20wooden%20wall%20art%20sculpture%2C%20traditional%20design%2C%20carved%20wood%2C%20white%20background%2C%20home%20decor&width=300&height=375&seq=trend2&orientation=portrait',
      city: 'Lagos',
      trending: true
    },
    {
      id: 7,
      name: 'African Print Cushions',
      price: 32.00,
      image: 'https://readdy.ai/api/search-image?query=Colorful%20African%20print%20decorative%20cushions%2C%20vibrant%20patterns%2C%20home%20textiles%2C%20white%20background&width=300&height=375&seq=trend3&orientation=portrait',
      city: 'Lagos',
      trending: true
    },
    {
      id: 8,
      name: 'Handmade Pottery Set',
      price: 55.00,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20African%20handmade%20pottery%20set%2C%20ceramic%20bowls%20and%20vases%2C%20natural%20earth%20tones%2C%20white%20background&width=300&height=375&seq=trend4&orientation=portrait',
      city: 'Lagos',
      trending: true
    }
  ];

  const popularSellers = [
    {
      id: 1,
      name: 'Adunni Crafts',
      location: 'Lagos, Nigeria',
      rating: 4.9,
      products: 45,
      image: 'https://readdy.ai/api/search-image?query=African%20woman%20artisan%20working%20on%20traditional%20crafts%2C%20professional%20portrait%2C%20warm%20lighting&width=150&height=150&seq=pseller1&orientation=squarish',
      followers: 1250
    },
    {
      id: 2,
      name: 'Amara Fashion House',
      location: 'Nairobi, Kenya',
      rating: 4.8,
      products: 38,
      image: 'https://readdy.ai/api/search-image?query=African%20fashion%20designer%20in%20modern%20studio%2C%20professional%20portrait%2C%20creative%20workspace&width=150&height=150&seq=pseller2&orientation=squarish',
      followers: 980
    },
    {
      id: 3,
      name: 'Ubuntu Wellness',
      location: 'Cape Town, South Africa',
      rating: 4.9,
      products: 52,
      image: 'https://readdy.ai/api/search-image?query=African%20wellness%20entrepreneur%20with%20natural%20products%2C%20professional%20portrait%2C%20clean%20setting&width=150&height=150&seq=pseller3&orientation=squarish',
      followers: 1450
    }
  ];

  const recentlyViewed = [
    {
      id: 9,
      name: 'Traditional Djembe Drum',
      price: 165.00,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20African%20djembe%20drum%2C%20hand%20carved%20wood%2C%20authentic%20musical%20instrument%2C%20white%20background&width=300&height=375&seq=recent1&orientation=portrait',
      viewedAt: '2 hours ago'
    },
    {
      id: 10,
      name: 'Brass Ashanti Stool',
      price: 95.00,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20Ashanti%20golden%20stool%20replica%2C%20brass%20finish%2C%20African%20royal%20furniture%2C%20white%20background&width=300&height=375&seq=recent2&orientation=portrait',
      viewedAt: '5 hours ago'
    },
    {
      id: 11,
      name: 'Wax Print Fabric',
      price: 52.00,
      image: 'https://readdy.ai/api/search-image?query=Colorful%20African%20wax%20print%20fabric%2C%20vibrant%20patterns%2C%20folded%20textiles%2C%20white%20background&width=300&height=375&seq=recent3&orientation=portrait',
      viewedAt: '1 day ago'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Personalized Feed
            </h1>
            <p className="text-xl text-purple-50 max-w-2xl mx-auto">
              Discover products curated just for you based on your interests and browsing history
            </p>
          </div>
        </div>
      </section>

      {/* Recommended for You */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended for You</h2>
              <p className="text-gray-600">Handpicked products based on your preferences</p>
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              Refresh
              <i className="ri-refresh-line ml-2"></i>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-product-shop>
            {recommendedProducts.map((product) => (
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
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mb-2 whitespace-nowrap">
                    {product.reason}
                  </span>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <i className="ri-store-2-line mr-1"></i>
                    {product.seller}
                  </p>
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending in Your City */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                <i className="ri-fire-fill text-red-500 mr-2"></i>
                Trending in Lagos
              </h2>
              <p className="text-gray-600">Popular products in your area</p>
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              Change Location
              <i className="ri-map-pin-line ml-2"></i>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-product-shop>
            {trendingInCity.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full whitespace-nowrap flex items-center">
                    <i className="ri-fire-fill mr-1"></i>
                    Trending
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Sellers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Sellers to Follow</h2>
            <p className="text-gray-600">Top-rated sellers in your favorite categories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {popularSellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                    <img src={seller.image} alt={seller.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{seller.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <i className="ri-map-pin-line mr-1"></i>
                      {seller.location}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <i className="ri-star-fill text-yellow-400 mr-1"></i>
                        {seller.rating}
                      </div>
                      <div>{seller.products} products</div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{seller.followers} followers</p>
                    <Button variant="outline" className="w-full whitespace-nowrap">
                      <i className="ri-user-add-line mr-2"></i>
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recently Viewed</h2>
            <p className="text-gray-600">Pick up where you left off</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" data-product-shop>
            {recentlyViewed.map((product) => (
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
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className="text-xs text-gray-500">{product.viewedAt}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
