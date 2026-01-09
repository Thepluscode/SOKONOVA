import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About SOKONOVA</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting buyers and sellers worldwide through a trusted marketplace platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              SOKONOVA is dedicated to creating a seamless marketplace experience where buyers discover quality products and services, while sellers grow their businesses with powerful tools and global reach.
            </p>
            <p className="text-gray-600">
              We believe in empowering entrepreneurs and providing customers with diverse choices, competitive prices, and secure transactions.
            </p>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              To become the world's most trusted marketplace platform, where innovation meets reliability, and where every transaction builds lasting relationships.
            </p>
            <p className="text-gray-600">
              We're committed to continuous improvement, customer satisfaction, and creating opportunities for businesses of all sizes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose SOKONOVA</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'ri-shield-check-line', title: 'Secure Platform', desc: 'Advanced security measures protect every transaction' },
              { icon: 'ri-global-line', title: 'Global Reach', desc: 'Connect with buyers and sellers worldwide' },
              { icon: 'ri-customer-service-2-line', title: '24/7 Support', desc: 'Dedicated team ready to help anytime' },
              { icon: 'ri-price-tag-3-line', title: 'Best Prices', desc: 'Competitive pricing and great deals' },
              { icon: 'ri-truck-line', title: 'Fast Shipping', desc: 'Quick and reliable delivery options' },
              { icon: 'ri-star-line', title: 'Quality Assured', desc: 'Verified sellers and quality products' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-emerald-100 rounded-full">
                  <i className={`${feature.icon} text-3xl text-emerald-600`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to shop or sell, SOKONOVA provides the tools and support you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Start Shopping
            </a>
            <a
              href="/sell"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-store-2-line mr-2"></i>
              Become a Seller
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
