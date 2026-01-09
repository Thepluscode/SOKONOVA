import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load from localStorage
    const viewed = localStorage.getItem('recentlyViewed');
    if (viewed) {
      setProducts(JSON.parse(viewed));
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
        <button
          onClick={() => {
            localStorage.removeItem('recentlyViewed');
            setProducts([]);
          }}
          className="text-sm text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => window.REACT_APP_NAVIGATE(`/products/${product.id}`)}
            className="group cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-yellow-400 text-xs`}
                ></i>
              ))}
            </div>
            <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to add product to recently viewed
export function addToRecentlyViewed(product: Product) {
  const viewed = localStorage.getItem('recentlyViewed');
  let products: Product[] = viewed ? JSON.parse(viewed) : [];
  
  // Remove if already exists
  products = products.filter((p) => p.id !== product.id);
  
  // Add to beginning
  products.unshift(product);
  
  // Keep only last 12
  products = products.slice(0, 12);
  
  localStorage.setItem('recentlyViewed', JSON.stringify(products));
}
