
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

interface RecommendedProductsProps {
  currentProductId?: string;
  category?: string;
  title?: string;
}

export default function RecommendedProducts({
  currentProductId,
  category,
  title = 'Recommended for You',
}: RecommendedProductsProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching recommended products
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          price: 89.99,
          image: 'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20with%20sleek%20modern%20design%20on%20clean%20white%20background%20product%20photography%20style%20high%20quality%20professional%20lighting%20minimalist%20aesthetic&width=400&height=400&seq=rec1&orientation=squarish',
          rating: 4.8,
          reviews: 234,
          category: 'Electronics',
        },
        {
          id: '2',
          name: 'Smart Fitness Watch',
          price: 129.99,
          image: 'https://readdy.ai/api/search-image?query=smart%20fitness%20watch%20with%20modern%20display%20on%20clean%20white%20background%20product%20photography%20style%20high%20quality%20professional%20lighting%20minimalist%20aesthetic&width=400&height=400&seq=rec2&orientation=squarish',
          rating: 4.6,
          reviews: 189,
          category: 'Electronics',
        },
        {
          id: '3',
          name: 'Portable Bluetooth Speaker',
          price: 49.99,
          image: 'https://readdy.ai/api/search-image?query=portable%20bluetooth%20speaker%20with%20sleek%20design%20on%20clean%20white%20background%20product%20photography%20style%20high%20quality%20professional%20lighting%20minimalist%20aesthetic&width=400&height=400&seq=rec3&orientation=squarish',
          rating: 4.7,
          reviews: 312,
          category: 'Electronics',
        },
        {
          id: '4',
          name: 'USB-C Fast Charger',
          price: 24.99,
          image: 'https://readdy.ai/api/search-image?query=usb%20c%20fast%20charger%20with%20modern%20design%20on%20clean%20white%20background%20product%20photography%20style%20high%20quality%20professional%20lighting%20minimalist%20aesthetic&width=400&height=400&seq=rec4&orientation=squarish',
          rating: 4.5,
          reviews: 156,
          category: 'Electronics',
        },
      ];

      setProducts(mockProducts.filter((p) => p.id !== currentProductId));
      setIsLoading(false);
    }, 1000);
  }, [currentProductId, category]);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={() => navigate('/products')}
          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm cursor-pointer whitespace-nowrap"
        >
          View All
          <i className="ri-arrow-right-line ml-1"></i>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ri-heart-line text-gray-600"></i>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'ri-star-fill text-yellow-400'
                          : 'ri-star-line text-gray-300'
                      } text-xs`}
                    ></i>
                  ))}
                </div>
                <span className="text-xs text-gray-600">({product.reviews})</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
