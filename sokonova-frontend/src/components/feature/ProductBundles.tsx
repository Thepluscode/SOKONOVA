import { useState, useEffect } from 'react';

interface BundleProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductBundlesProps {
  currentProductId: string;
}

export default function ProductBundles({ currentProductId }: ProductBundlesProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([currentProductId]);
  const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<BundleProduct | null>(null);

  useEffect(() => {
    // Mock current product data
    const mockCurrentProduct: BundleProduct = {
      id: currentProductId,
      name: 'Premium Wireless Headphones',
      price: 299.99,
      image: 'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20black%20color%20product%20photography%20on%20white%20background%20studio%20lighting%20high%20quality%20detailed%20view&width=200&height=200&seq=bundle1&orientation=squarish',
    };

    // Mock bundle products
    const mockBundleProducts: BundleProduct[] = [
      {
        id: 'bundle-2',
        name: 'Premium Carrying Case',
        price: 49.99,
        image: 'https://readdy.ai/api/search-image?query=premium%20headphone%20carrying%20case%20black%20leather%20product%20photography%20on%20white%20background%20studio%20lighting&width=200&height=200&seq=bundle2&orientation=squarish',
      },
      {
        id: 'bundle-3',
        name: 'Audio Cable 3.5mm',
        price: 19.99,
        image: 'https://readdy.ai/api/search-image?query=premium%20audio%20cable%203.5mm%20black%20braided%20product%20photography%20on%20white%20background%20studio%20lighting&width=200&height=200&seq=bundle3&orientation=squarish',
      },
      {
        id: 'bundle-4',
        name: 'Replacement Ear Cushions',
        price: 29.99,
        image: 'https://readdy.ai/api/search-image?query=headphone%20ear%20cushions%20replacement%20pads%20black%20product%20photography%20on%20white%20background%20studio%20lighting&width=200&height=200&seq=bundle4&orientation=squarish',
      },
    ];

    setCurrentProduct(mockCurrentProduct);
    setBundleProducts(mockBundleProducts);
  }, [currentProductId]);

  const toggleProduct = (productId: string) => {
    if (productId === currentProductId) return; // Can't deselect main product
    
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  if (!currentProduct) {
    return null;
  }

  const allProducts = [currentProduct, ...bundleProducts];
  const totalPrice = allProducts
    .filter(p => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);
  
  const originalPrice = allProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = originalPrice - totalPrice;
  const discountPercent = Math.round((savings / originalPrice) * 100);

  const addBundleToCart = () => {
    const selectedItems = allProducts.filter(p => selectedProducts.includes(p.id));
    console.log('Adding bundle to cart:', selectedItems);
    // TODO: Implement cart functionality
    alert(`Added ${selectedItems.length} items to cart!`);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Frequently Bought Together
          </h3>
          <p className="text-sm text-gray-600">
            Save {discountPercent}% when you buy these items together
          </p>
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          Save ${savings.toFixed(2)}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {allProducts.map((product, index) => (
          <div key={product.id}>
            <label className="flex items-center space-x-4 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-emerald-300 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
                disabled={product.id === currentProductId}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <div className="w-16 h-16">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {product.name}
                  {product.id === currentProductId && (
                    <span className="ml-2 text-xs text-emerald-600 font-semibold">
                      (This item)
                    </span>
                  )}
                </h4>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </label>
            {index < allProducts.length - 1 && (
              <div className="flex items-center justify-center my-2">
                <i className="ri-add-line text-gray-400 text-xl"></i>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Total for {selectedProducts.length} items:</span>
          <div className="text-right">
            <div className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              ${totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={addBundleToCart}
        disabled={selectedProducts.length === 0}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap"
      >
        <i className="ri-shopping-cart-line mr-2"></i>
        Add Selected to Cart
      </button>
    </div>
  );
}
