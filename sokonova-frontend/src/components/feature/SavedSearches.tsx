
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SavedSearch {
  id: string;
  query: string;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
  };
  createdAt: string;
  resultsCount: number;
}

export default function SavedSearches() {
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('sokonova_saved_searches');
    if (saved) {
      setSearches(JSON.parse(saved));
    } else {
      // Mock data for demo
      const mockSearches: SavedSearch[] = [
        {
          id: '1',
          query: 'wireless headphones',
          filters: { category: 'Electronics', minPrice: 50, maxPrice: 150 },
          createdAt: '2024-01-15',
          resultsCount: 24,
        },
        {
          id: '2',
          query: 'running shoes',
          filters: { category: 'Sports', rating: 4 },
          createdAt: '2024-01-14',
          resultsCount: 18,
        },
        {
          id: '3',
          query: 'laptop backpack',
          filters: { maxPrice: 100 },
          createdAt: '2024-01-12',
          resultsCount: 32,
        },
      ];
      setSearches(mockSearches);
      localStorage.setItem('sokonova_saved_searches', JSON.stringify(mockSearches));
    }
  }, []);

  const handleDeleteSearch = (id: string) => {
    const updated = searches.filter((s) => s.id !== id);
    setSearches(updated);
    localStorage.setItem('sokonova_saved_searches', JSON.stringify(updated));
  };

  const handleRunSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    params.set('q', search.query);
    if (search.filters.category) params.set('category', search.filters.category);
    if (search.filters.minPrice) params.set('minPrice', search.filters.minPrice.toString());
    if (search.filters.maxPrice) params.set('maxPrice', search.filters.maxPrice.toString());
    if (search.filters.rating) params.set('rating', search.filters.rating.toString());
    
    navigate(`/products?${params.toString()}`);
  };

  const getFilterSummary = (filters: SavedSearch['filters']) => {
    const parts: string[] = [];
    if (filters.category) parts.push(filters.category);
    if (filters.minPrice || filters.maxPrice) {
      parts.push(`$${filters.minPrice || 0}-${filters.maxPrice || '∞'}`);
    }
    if (filters.rating) parts.push(`${filters.rating}+ stars`);
    return parts.join(' • ');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Saved Searches</h2>
        <span className="text-sm text-gray-600">{searches.length} saved</span>
      </div>

      {searches.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved searches.</h3>
          <p className="text-gray-600 mb-6">
            Save your searches to quickly find products you're interested in.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      "{search.query}"
                    </h3>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {search.resultsCount} results
                    </span>
                  </div>
                  {Object.keys(search.filters).length > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                      <i className="ri-filter-line mr-1"></i>
                      {getFilterSummary(search.filters)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Saved on {new Date(search.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteSearch(search.id)}
                  className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line text-gray-600"></i>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleRunSearch(search)}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-search-line mr-2"></i>
                  Run Search
                </button>
                <button
                  onClick={() => handleRunSearch(search)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-notification-line mr-2"></i>
                  Set Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-emerald-50 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-lightbulb-line text-emerald-600 text-xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pro Tip</h3>
            <p className="text-sm text-gray-700">
              Save your searches and get notified when new products match your criteria or when prices drop!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
