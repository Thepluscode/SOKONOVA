import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">How SOKONOVA Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to start buying or selling on our platform
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">For Buyers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: 'ri-search-line', title: 'Browse Products', desc: 'Explore thousands of products from trusted sellers' },
              { step: '2', icon: 'ri-shopping-cart-line', title: 'Add to Cart', desc: 'Select items and add them to your shopping cart' },
              { step: '3', icon: 'ri-secure-payment-line', title: 'Secure Checkout', desc: 'Complete your purchase with secure payment options' },
              { step: '4', icon: 'ri-truck-line', title: 'Receive Order', desc: 'Track your order and receive it at your doorstep' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-emerald-600 text-white rounded-full font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 mt-4 bg-emerald-100 rounded-full">
                    <i className={`${item.icon} text-3xl text-emerald-600`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">For Sellers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: 'ri-user-add-line', title: 'Create Account', desc: 'Sign up and complete your seller profile' },
              { step: '2', icon: 'ri-add-box-line', title: 'List Products', desc: 'Add your products with descriptions and images' },
              { step: '3', icon: 'ri-notification-line', title: 'Receive Orders', desc: 'Get notified when customers place orders' },
              { step: '4', icon: 'ri-money-dollar-circle-line', title: 'Get Paid', desc: 'Receive payments securely to your account' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-teal-600 text-white rounded-full font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 mt-4 bg-teal-100 rounded-full">
                    <i className={`${item.icon} text-3xl text-teal-600`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-emerald-50">Join thousands of satisfied buyers and sellers today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Start Shopping
            </a>
            <a
              href="/sell"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              Start Selling
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
