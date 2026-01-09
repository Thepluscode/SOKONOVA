
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

interface AIRecommendationsProps {
  userId: string;
  currentProductId?: string;
  context: 'homepage' | 'product' | 'cart' | 'checkout';
}

export default function AIRecommendations({
  userId,
  currentProductId,
  context
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, [userId, currentProductId, context]);

  const loadRecommendations = () => {
    setLoading(true);

    // Simulate AI recommendation engine
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: 79.99,
          image: 'https://readdy.ai/api/search-image?query=modern%20wireless%20bluetooth%20headphones%20with%20sleek%20black%20design%20on%20white%20background%20product%20photography%20high%20quality&width=400&height=400&seq=ai-rec-1&orientation=squarish',
          rating: 4.8,
          reviews: 234
        },
        {
          id: '2',
          name: 'Smart Fitness Watch',
          price: 149.99,
          image: 'https://readdy.ai/api/search-image?query=elegant%20smart%20fitness%20watch%20with%20black%20band%20and%20digital%20display%20on%20white%20background%20product%20photography&width=400&height=400&seq=ai-rec-2&orientation=squarish',
          rating: 4.6,
          reviews: 189
        },
        {
          id: '3',
          name: 'Portable Power Bank 20000mAh',
          price: 39.99,
          image: 'https://readdy.ai/api/search-image?query=sleek%20portable%20power%20bank%20charger%20black%20color%20on%20white%20background%20product%20photography%20minimalist&width=400&height=400&seq=ai-rec-3&orientation=squarish',
          rating: 4.7,
          reviews: 456
        },
        {
          id: '4',
          name: 'USB-C Fast Charging Cable',
          price: 19.99,
          image: 'https://readdy.ai/api/search-image?query=premium%20usb-c%20charging%20cable%20coiled%20neatly%20on%20white%20background%20product%20photography%20high%20quality&width=400&height=400&seq=ai-rec-4&orientation=squarish',
          rating: 4.5,
          reviews: 678
        }
      ];

      setRecommendations(mockProducts);

      // Set reason based on context
      const reasons = {
        homepage: 'Based on your browsing history',
        product: 'Frequently bought together',
        cart: 'Complete your purchase',
        checkout: 'You might also like'
      };
      setReason(reasons[context]);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center gap-2 mb-6">
          <i className="ri-sparkling-line text-2xl text-teal-600"></i>
          <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <i className="ri-sparkling-line text-2xl text-teal-600"></i>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
            <p className="text-sm text-gray-500">{reason}</p>
          </div>
        </div>
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium whitespace-nowrap">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-teal-50 transition-colors whitespace-nowrap">
                <i className="ri-heart-line text-gray-600"></i>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <i className="ri-star-fill text-yellow-400 text-sm"></i>
                  <span className="text-sm font-medium text-gray-900">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <button className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors text-sm whitespace-nowrap">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
