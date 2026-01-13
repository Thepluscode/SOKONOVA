import { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClose: () => void;
}

export interface SearchFilters {
  q: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  country: string;
  sortBy: string;
  inStock: boolean;
  freeShipping: boolean;
}

export default function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    country: '',
    sortBy: 'relevance',
    inStock: false,
    freeShipping: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      q: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      country: '',
      sortBy: 'relevance',
      inStock: false,
      freeShipping: false
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Search</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-2xl text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Search Query */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Keywords
            </label>
            <input
              type="text"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="What are you looking for?"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="fashion">Fashion &amp; Apparel</option>
              <option value="crafts">Handmade Crafts</option>
              <option value="home">Home &amp; Living</option>
              <option value="art">Art &amp; Collectibles</option>
              <option value="jewelry">Jewelry &amp; Accessories</option>
              <option value="beauty">Beauty &amp; Personal Care</option>
              <option value="food">Food &amp; Beverages</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Price ($)
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="Any"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condition
            </label>
            <select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              <option value="">Any Condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="used">Used - Good</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country or Region
            </label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              placeholder="Country"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">In Stock Only</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.freeShipping}
                onChange={(e) => setFilters({ ...filters, freeShipping: e.target.checked })}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Free Shipping</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-search-line mr-2"></i>
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
