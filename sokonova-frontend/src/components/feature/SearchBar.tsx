import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  seller: string;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search data
  const mockProducts: SearchResult[] = [
    {
      id: 1,
      name: 'African Print Ankara Dress',
      price: 89.99,
      category: 'Fashion',
      image: 'https://readdy.ai/api/search-image?query=elegant%20african%20print%20ankara%20dress%20with%20vibrant%20colorful%20geometric%20patterns%20on%20clean%20white%20studio%20background%20professional%20product%20photography%20high%20quality%20fashion%20ecommerce%20style&width=400&height=500&seq=1&orientation=portrait',
      seller: 'Mama Ade Fashion'
    },
    {
      id: 2,
      name: 'Handwoven Kente Cloth',
      price: 125.00,
      category: 'Textiles',
      image: 'https://readdy.ai/api/search-image?query=traditional%20handwoven%20kente%20cloth%20with%20intricate%20colorful%20patterns%20gold%20red%20green%20stripes%20on%20clean%20white%20studio%20background%20professional%20product%20photography%20high%20quality%20textile%20ecommerce%20style&width=400&height=500&seq=2&orientation=portrait',
      seller: 'Ghana Textiles Co'
    },
    {
      id: 3,
      name: 'Shea Butter Natural Cream',
      price: 24.99,
      category: 'Beauty',
      image: 'https://readdy.ai/api/search-image?query=natural%20organic%20shea%20butter%20cream%20jar%20with%20golden%20yellow%20texture%20on%20clean%20white%20studio%20background%20professional%20product%20photography%20high%20quality%20beauty%20ecommerce%20style&width=400&height=500&seq=3&orientation=portrait',
      seller: 'Natural Beauty Africa'
    },
    {
      id: 4,
      name: 'Wooden Djembe Drum',
      price: 159.00,
      category: 'Music',
      image: 'https://readdy.ai/api/search-image?query=traditional%20african%20wooden%20djembe%20drum%20with%20carved%20patterns%20and%20rope%20tuning%20on%20clean%20white%20studio%20background%20professional%20product%20photography%20high%20quality%20musical%20instrument%20ecommerce%20style&width=400&height=500&seq=4&orientation=portrait',
      seller: 'African Rhythms'
    },
    {
      id: 5,
      name: 'Beaded Maasai Jewelry Set',
      price: 45.00,
      category: 'Jewelry',
      image: 'https://readdy.ai/api/search-image?query=colorful%20beaded%20maasai%20jewelry%20necklace%20bracelet%20set%20with%20red%20blue%20yellow%20beads%20on%20clean%20white%20studio%20background%20professional%20product%20photography%20high%20quality%20jewelry%20ecommerce%20style&width=400&height=500&seq=5&orientation=portrait',
      seller: 'Maasai Crafts'
    }
  ];

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.seller.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleResultClick = (id: number) => {
    navigate(`/products/${id}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, categories, or sellers..."
          className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line"></i>
          </button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 font-medium">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result.id)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left"
              >
                <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {result.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="inline-flex items-center">
                      <i className="ri-store-2-line mr-1"></i>
                      {result.seller}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{result.category}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-bold text-emerald-600">${result.price}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <button
              onClick={handleSearch}
              className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer whitespace-nowrap"
            >
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}

      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-8 text-center">
          <i className="ri-search-line text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-600">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
}
