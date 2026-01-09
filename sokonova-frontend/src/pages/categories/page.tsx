import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function CategoriesPage() {
  const categories = [
    {
      name: 'Electronics',
      icon: 'ri-smartphone-line',
      count: '2,450 items',
      subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Accessories'],
    },
    {
      name: 'Fashion',
      icon: 'ri-shirt-line',
      count: '5,890 items',
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Jewelry', 'Watches'],
    },
    {
      name: 'Home & Garden',
      icon: 'ri-home-4-line',
      count: '3,210 items',
      subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Garden Tools', 'Lighting'],
    },
    {
      name: 'Sports & Outdoors',
      icon: 'ri-basketball-line',
      count: '1,780 items',
      subcategories: ['Fitness', 'Camping', 'Cycling', 'Water Sports', 'Team Sports', 'Outdoor Gear'],
    },
    {
      name: 'Beauty & Health',
      icon: 'ri-heart-pulse-line',
      count: '4,320 items',
      subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Vitamins', 'Personal Care'],
    },
    {
      name: 'Books & Media',
      icon: 'ri-book-open-line',
      count: '2,940 items',
      subcategories: ['Books', 'E-books', 'Music', 'Movies', 'Games', 'Magazines'],
    },
    {
      name: 'Toys & Games',
      icon: 'ri-gamepad-line',
      count: '1,560 items',
      subcategories: ['Action Figures', 'Board Games', 'Puzzles', 'Educational', 'Outdoor Toys', 'Video Games'],
    },
    {
      name: 'Automotive',
      icon: 'ri-car-line',
      count: '980 items',
      subcategories: ['Car Parts', 'Accessories', 'Tools', 'Tires', 'Electronics', 'Care Products'],
    },
    {
      name: 'Pet Supplies',
      icon: 'ri-bear-smile-line',
      count: '1,240 items',
      subcategories: ['Dog Supplies', 'Cat Supplies', 'Pet Food', 'Toys', 'Grooming', 'Health Care'],
    },
    {
      name: 'Office Supplies',
      icon: 'ri-briefcase-line',
      count: '890 items',
      subcategories: ['Stationery', 'Furniture', 'Electronics', 'Storage', 'Printing', 'Organization'],
    },
    {
      name: 'Baby & Kids',
      icon: 'ri-baby-carriage-line',
      count: '2,100 items',
      subcategories: ['Baby Gear', 'Clothing', 'Toys', 'Feeding', 'Nursery', 'Safety'],
    },
    {
      name: 'Food & Beverages',
      icon: 'ri-restaurant-line',
      count: '1,670 items',
      subcategories: ['Snacks', 'Beverages', 'Organic', 'Gourmet', 'Specialty', 'Pantry'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Browse Categories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our wide range of product categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full group-hover:bg-emerald-600 transition-colors">
                    <i className={`${category.icon} text-3xl text-emerald-600 group-hover:text-white transition-colors`}></i>
                  </div>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
                
                <div className="space-y-2 mb-6">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      to={`/products?category=${category.name.toLowerCase()}&subcategory=${sub.toLowerCase()}`}
                      className="block text-gray-600 hover:text-emerald-600 text-sm transition-colors cursor-pointer"
                    >
                      • {sub}
                    </Link>
                  ))}
                </div>
                
                <Link
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  View All
                  <i className="ri-arrow-right-line ml-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
