import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function SellerGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Seller Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know to succeed as a seller on SOKONOVA
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Getting Started</h2>
            <div className="space-y-4 text-gray-600">
              <p>Welcome to SOKONOVA! This guide will help you set up your seller account and start selling successfully.</p>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li><strong>Create Your Seller Account:</strong> Sign up and complete your seller profile with accurate business information.</li>
                <li><strong>Verify Your Identity:</strong> Submit required documents for account verification (usually takes 1-2 business days).</li>
                <li><strong>Set Up Payment Method:</strong> Add your bank account or payment details to receive payouts.</li>
                <li><strong>Configure Shipping:</strong> Set up your shipping zones, rates, and delivery options.</li>
                <li><strong>List Your First Product:</strong> Create compelling product listings with quality images and detailed descriptions.</li>
              </ol>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Creating Great Listings</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Photos</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use high-resolution images (at least 1000x1000 pixels)</li>
                  <li>• Show multiple angles and details</li>
                  <li>• Use good lighting and clean backgrounds</li>
                  <li>• Include lifestyle photos showing product in use</li>
                  <li>• Avoid watermarks or text overlays</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Descriptions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Write clear, detailed descriptions</li>
                  <li>• Include key features and specifications</li>
                  <li>• Mention materials, dimensions, and weight</li>
                  <li>• Highlight unique selling points</li>
                  <li>• Use proper grammar and formatting</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Pricing Strategy</h2>
            <div className="space-y-4 text-gray-600">
              <p>Setting the right price is crucial for success. Consider these factors:</p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <i className="ri-money-dollar-circle-line text-4xl text-emerald-600 mb-4"></i>
                  <h4 className="font-semibold text-gray-900 mb-2">Competitive Pricing</h4>
                  <p className="text-sm">Research similar products and price competitively while maintaining profit margins.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <i className="ri-calculator-line text-4xl text-emerald-600 mb-4"></i>
                  <h4 className="font-semibold text-gray-900 mb-2">Cost Calculation</h4>
                  <p className="text-sm">Factor in product cost, shipping, platform fees, and desired profit margin.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <i className="ri-price-tag-3-line text-4xl text-emerald-600 mb-4"></i>
                  <h4 className="font-semibold text-gray-900 mb-2">Promotions</h4>
                  <p className="text-sm">Use discounts and promotions strategically to boost sales and attract customers.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Order Management</h2>
            <div className="space-y-4 text-gray-600">
              <p>Efficient order management is key to customer satisfaction:</p>
              <ul className="space-y-3 ml-4 mt-4">
                <li><strong>Process Orders Quickly:</strong> Aim to ship orders within 1-2 business days.</li>
                <li><strong>Update Order Status:</strong> Keep customers informed with tracking information.</li>
                <li><strong>Package Carefully:</strong> Use appropriate packaging to prevent damage during shipping.</li>
                <li><strong>Include Packing Slip:</strong> Add order details and thank you note in each package.</li>
                <li><strong>Handle Returns Professionally:</strong> Process returns and refunds promptly according to your policy.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Customer Service Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Respond to messages within 24 hours</li>
                  <li>• Be professional and courteous</li>
                  <li>• Provide clear and helpful answers</li>
                  <li>• Set realistic expectations</li>
                  <li>• Follow up on issues until resolved</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Building Trust</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Maintain high product quality</li>
                  <li>• Ship orders on time</li>
                  <li>• Encourage customer reviews</li>
                  <li>• Address negative feedback constructively</li>
                  <li>• Go above and beyond when possible</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Growing Your Business</h2>
            <div className="space-y-4 text-gray-600">
              <p>Tips to scale your seller business on SOKONOVA:</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {[
                  { icon: 'ri-line-chart-line', title: 'Analytics', desc: 'Use seller analytics to understand your performance and identify opportunities' },
                  { icon: 'ri-megaphone-line', title: 'Marketing', desc: 'Promote your products through social media and sponsored placements' },
                  { icon: 'ri-star-line', title: 'Reviews', desc: 'Encourage satisfied customers to leave positive reviews' },
                  { icon: 'ri-refresh-line', title: 'Inventory', desc: 'Keep popular items in stock and refresh your product catalog regularly' },
                ].map((tip) => (
                  <div key={tip.title} className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-emerald-100 rounded-full">
                      <i className={`${tip.icon} text-3xl text-emerald-600`}></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                    <p className="text-sm">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-xl mb-8 text-emerald-50">Join thousands of successful sellers on SOKONOVA</p>
            <a
              href="/sell"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
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
