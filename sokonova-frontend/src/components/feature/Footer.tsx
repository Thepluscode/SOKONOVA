import { Link } from 'react-router-dom';

export default function Footer() {
  const handleTalkWithUs = () => {
    // Scroll to top and let user use the LiveChat button
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Note: The LiveChat button is now at bottom-right corner
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Pacifico, serif' }}>
              SOKONOVA
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting African sellers with global buyers. Empowering local entrepreneurs 
              through secure, scalable e-commerce solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/sellers" className="text-gray-300 hover:text-white transition-colors">Find Sellers</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2">
              <li><Link to="/sell" className="text-gray-300 hover:text-white transition-colors">Start Selling</Link></li>
              <li><Link to="/seller-guide" className="text-gray-300 hover:text-white transition-colors">Seller Guide</Link></li>
              <li><Link to="/fees" className="text-gray-300 hover:text-white transition-colors">Fees & Pricing</Link></li>
              <li><Link to="/seller-protection" className="text-gray-300 hover:text-white transition-colors">Seller Protection</Link></li>
              <li><Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SOKONOVA. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 items-center">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <a href="https://readdy.ai/?origin=logo" className="text-gray-400 hover:text-white text-sm transition-colors">
              Website Builder
            </a>
            <button
              onClick={handleTalkWithUs}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-customer-service-2-line"></i>
              <span>Talk with Us</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
