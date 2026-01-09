import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function FeesPricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Fees & Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent pricing with no hidden fees. You only pay when you make a sale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'Basic',
              price: '5%',
              description: 'Perfect for new sellers',
              features: [
                'Up to 100 listings',
                'Basic analytics',
                'Standard support',
                'Payment processing included',
                'Mobile app access',
              ],
            },
            {
              title: 'Professional',
              price: '8%',
              description: 'For growing businesses',
              features: [
                'Unlimited listings',
                'Advanced analytics',
                'Priority support',
                'Sponsored placements',
                'Bulk upload tools',
                'API access',
              ],
              popular: true,
            },
            {
              title: 'Enterprise',
              price: '12%',
              description: 'For large-scale sellers',
              features: [
                'Everything in Professional',
                'Dedicated account manager',
                '24/7 phone support',
                'Custom integrations',
                'White-label options',
                'Volume discounts',
              ],
            },
          ].map((plan) => (
            <div
              key={plan.title}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-emerald-600 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-emerald-600">{plan.price}</span>
                  <span className="text-gray-600 ml-2">per sale</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <i className="ri-check-line text-emerald-600 text-xl mr-2 flex-shrink-0"></i>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/sell"
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  plan.popular
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Additional Fees</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Service</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Fee</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: 'Payment Processing', fee: '2.9% + $0.30', desc: 'Per transaction (standard rates)' },
                  { service: 'International Sales', fee: '+1.5%', desc: 'Additional fee for cross-border transactions' },
                  { service: 'Currency Conversion', fee: '1%', desc: 'When selling in different currencies' },
                  { service: 'Chargeback Fee', fee: '$15', desc: 'Per disputed transaction' },
                  { service: 'Sponsored Placements', fee: 'Variable', desc: 'Pay-per-click advertising (optional)' },
                ].map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.service}</td>
                    <td className="py-4 px-6 text-emerald-600 font-semibold">{item.fee}</td>
                    <td className="py-4 px-6 text-gray-600">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Payout Schedule</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'ri-calendar-line', title: 'Weekly Payouts', desc: 'Receive your earnings every week on Friday' },
              { icon: 'ri-time-line', title: 'Processing Time', desc: '2-3 business days to reach your account' },
              { icon: 'ri-money-dollar-circle-line', title: 'Minimum Payout', desc: '$25 minimum balance required' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-emerald-100 rounded-full">
                  <i className={`${item.icon} text-3xl text-emerald-600`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Questions About Pricing?</h2>
          <p className="text-xl mb-8 text-emerald-50">Our team is here to help you understand our fee structure</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-chat-3-line mr-2"></i>
              Chat with Us
            </button>
            <a
              href="/support"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-question-line mr-2"></i>
              View FAQs
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
