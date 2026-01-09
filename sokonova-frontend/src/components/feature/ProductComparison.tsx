
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  features: string[];
}

const ProductComparison: React.FC = () => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  useEffect(() => {
    loadCompareItems();
    window.addEventListener('compareUpdated', loadCompareItems);
    return () => window.removeEventListener('compareUpdated', loadCompareItems);
  }, []);

  const loadCompareItems = () => {
    const items = JSON.parse(localStorage.getItem('compare') || '[]');
    setCompareItems(items);
  };

  const removeFromCompare = (productId: string) => {
    const items = compareItems.filter(item => item.id !== productId);
    localStorage.setItem('compare', JSON.stringify(items));
    setCompareItems(items);
    window.dispatchEvent(new Event('compareUpdated'));
  };

  const clearAll = () => {
    localStorage.setItem('compare', '[]');
    setCompareItems([]);
    window.dispatchEvent(new Event('compareUpdated'));
  };

  if (compareItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-scales-line text-4xl text-gray-400"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products to compare</h3>
        <p className="text-gray-600 mb-6">Add products to compare their features and prices</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const allFeatures = Array.from(
    new Set(compareItems.flatMap(item => item.features))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Comparing {compareItems.length} Products
        </h2>
        <button
          onClick={clearAll}
          className="text-sm text-red-600 hover:text-red-700 font-medium whitespace-nowrap cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-50 p-4 text-left font-semibold text-gray-900 border border-gray-200 sticky left-0 z-10">
                Product
              </th>
              {compareItems.map((product) => (
                <th key={product.id} className="bg-gray-50 p-4 border border-gray-200 min-w-64">
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer"
                      aria-label="Remove from comparison"
                    >
                      <i className="ri-close-line text-sm"></i>
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr>
              <td className="p-4 font-medium text-gray-900 border border-gray-200 bg-white sticky left-0 z-10">
                Price
              </td>
              {compareItems.map((product) => (
                <td key={product.id} className="p-4 border border-gray-200 text-center">
                  <span className="text-2xl font-bold text-teal-600">${product.price}</span>
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="p-4 font-medium text-gray-900 border border-gray-200 bg-gray-50 sticky left-0 z-10">
                Rating
              </td>
              {compareItems.map((product) => (
                <td key={product.id} className="p-4 border border-gray-200 bg-gray-50 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-amber-400"></i>
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Availability */}
            <tr>
              <td className="p-4 font-medium text-gray-900 border border-gray-200 bg-white sticky left-0 z-10">
                Availability
              </td>
              {compareItems.map((product) => (
                <td key={product.id} className="p-4 border border-gray-200 text-center">
                  {product.inStock ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <i className="ri-checkbox-circle-fill"></i>
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                      <i className="ri-close-circle-fill"></i>
                      Out of Stock
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td className="p-4 font-medium text-gray-900 border border-gray-200 bg-gray-50 sticky left-0 z-10">
                Category
              </td>
              {compareItems.map((product) => (
                <td key={product.id} className="p-4 border border-gray-200 bg-gray-50 text-center">
                  <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    {product.category}
                  </span>
                </td>
              ))}
            </tr>

            {/* Features */}
            {allFeatures.map((feature, index) => (
              <tr key={feature}>
                <td className={`p-4 font-medium text-gray-900 border border-gray-200 sticky left-0 z-10 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  {feature}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className={`p-4 border border-gray-200 text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {product.features.includes(feature) ? (
                      <i className="ri-check-line text-2xl text-emerald-600"></i>
                    ) : (
                      <i className="ri-close-line text-2xl text-gray-300"></i>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Actions */}
            <tr>
              <td className="p-4 font-medium text-gray-900 border border-gray-200 bg-white sticky left-0 z-10">
                Actions
              </td>
              {compareItems.map((product) => (
                <td key={product.id} className="p-4 border border-gray-200 text-center">
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                    >
                      View Details
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
                      Add to Cart
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparison;
