import { useState } from 'react';

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  rating: number;
  inStock: boolean;
  freeShipping: boolean;
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    categories: [],
    brands: [],
    rating: 0,
    inStock: false,
    freeShipping: false,
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Beauty',
    'Automotive',
  ];

  const brands = [
    'Samsung',
    'Apple',
    'Nike',
    'Adidas',
    'Sony',
    'LG',
    'Canon',
    'Dell',
  ];

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleToggle = (key: 'inStock' | 'freeShipping') => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters: FilterOptions = {
      priceRange: [0, 1000],
      categories: [],
      brands: [],
      rating: 0,
      inStock: false,
      freeShipping: false,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.freeShipping ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-filter-3-line"></i>
        <span className="font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer whitespace-nowrap"
              >
                Clear All
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingChange(rating)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        filters.rating === rating
                          ? 'bg-emerald-50 border-2 border-emerald-600'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`ri-star-${i < rating ? 'fill' : 'line'} text-yellow-400 text-sm`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">&amp; Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quick Filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={() => handleToggle('inStock')}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.freeShipping}
                      onChange={() => handleToggle('freeShipping')}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Free Shipping</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
