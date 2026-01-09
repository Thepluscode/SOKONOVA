import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
}

interface SmartRecommendationsProps {
  currentProductId?: string;
  userId?: string;
  context: 'homepage' | 'product-page' | 'cart' | 'checkout';
}

export default function SmartRecommendations({ currentProductId, context }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching personalized recommendations
    const fetchRecommendations = async () => {
      setLoading(true);
      
      // Get browsing history from localStorage
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Simulate AI-powered recommendations based on context
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockRecommendations: Product[] = [
        {
          id: '1',
          name: 'Handwoven Kente Cloth Bag',
          price: 89.99,
          image: 'https://readdy.ai/api/search-image?query=beautiful%20handwoven%20traditional%20african%20kente%20cloth%20bag%20with%20vibrant%20geometric%20patterns%20and%20colorful%20stripes%20on%20clean%20white%20studio%20background%20product%20photography%20high%20quality&width=400&height=400&seq=rec1&orientation=squarish',
          rating: 4.8,
          reviews: 234,
          seller: 'Ghana Crafts Co'
        },
        {
          id: '2',
          name: 'Beaded Maasai Necklace',
          price: 45.00,
          image: 'https://readdy.ai/api/search-image?query=stunning%20traditional%20maasai%20beaded%20necklace%20with%20intricate%20colorful%20patterns%20red%20blue%20yellow%20beads%20on%20clean%20white%20studio%20background%20product%20photography%20high%20quality&width=400&height=400&seq=rec2&orientation=squarish',
          rating: 4.9,
          reviews: 189,
          seller: 'Maasai Artisans'
        },
        {
          id: '3',
          name: 'Carved Wooden Elephant',
          price: 125.00,
          image: 'https://readdy.ai/api/search-image?query=beautiful%20hand%20carved%20wooden%20elephant%20sculpture%20with%20detailed%20craftsmanship%20natural%20wood%20finish%20on%20clean%20white%20studio%20background%20product%20photography%20high%20quality&width=400&height=400&seq=rec3&orientation=squarish',
          rating: 5.0,
          reviews: 156,
          seller: 'Kenya Wood Art'
        },
        {
          id: '4',
          name: 'Ankara Print Dress',
          price: 78.50,
          image: 'https://readdy.ai/api/search-image?query=elegant%20african%20ankara%20print%20dress%20with%20vibrant%20colorful%20patterns%20modern%20fashion%20design%20on%20clean%20white%20studio%20background%20product%20photography%20high%20quality&width=400&height=400&seq=rec4&orientation=squarish',
          rating: 4.7,
          reviews: 312,
          seller: 'Lagos Fashion House'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setLoading(false);
    };

    fetchRecommendations();
  }, [currentProductId, context]);

  const getTitle = () => {
    switch (context) {
      case 'product-page':
        return 'You May Also Like';
      case 'cart':
        return 'Complete Your Order';
      case 'checkout':
        return 'Add These Before Checkout';
      default:
        return 'Recommended For You';
    }
  };

  const getSubtitle = () => {
    switch (context) {
      case 'product-page':
        return 'Based on this item';
      case 'cart':
        return 'Frequently bought together';
      default:
        return 'Personalized picks based on your browsing';
    }
  };

  const handleProductClick = (productId: string) => {
    if (typeof window.REACT_APP_NAVIGATE === 'function') {
      window.REACT_APP_NAVIGATE(`/products/${productId}`);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <i className="ri-sparkling-line text-emerald-600 mr-2"></i>
              {getTitle()}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{getSubtitle()}</p>
          </div>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer whitespace-nowrap">
            View All <i className="ri-arrow-right-line ml-1"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors cursor-pointer">
                    <i className="ri-heart-line text-gray-600 dark:text-gray-300"></i>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                    <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
