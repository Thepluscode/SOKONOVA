import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function FeesPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 0 : 0,
      description: 'Perfect for new sellers testing the waters',
      features: [
        'Up to 10 product listings',
        '5% commission per sale',
        'Basic seller dashboard',
        'Email support',
        'Standard payment processing',
        'Mobile app access',
        'Basic analytics'
      ],
      popular: false,
      color: 'emerald'
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 29 : 290,
      description: 'For growing businesses ready to scale',
      features: [
        'Unlimited product listings',
        '3% commission per sale',
        'Advanced seller dashboard',
        'Priority email & chat support',
        'Fast payment processing (2-3 days)',
        'Featured seller badge',
        'Advanced analytics & insights',
        'Bulk upload tools',
        'Custom storefront design',
        'Marketing tools access'
      ],
      popular: true,
      color: 'amber'
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 99 : 990,
      description: 'For established sellers with high volume',
      features: [
        'Everything in Professional',
        '2% commission per sale',
        'Dedicated account manager',
        '24/7 phone & chat support',
        'Same-day payment processing',
        'Premium placement in search',
        'API access for integrations',
        'White-label options',
        'Custom contract terms',
        'Sponsored placement credits',
        'Multi-user team accounts'
      ],
      popular: false,
      color: 'violet'
    }
  ];

  const additionalFees = [
    {
      title: 'Payment Processing',
      fee: '2.9% + $0.30',
      description: 'Standard rate for credit card and mobile money transactions'
    },
    {
      title: 'International Sales',
      fee: '+1.5%',
      description: 'Additional fee for cross-border transactions'
    },
    {
      title: 'Refund Processing',
      fee: '$0.50',
      description: 'Per refund transaction (commission is refunded)'
    },
    {
      title: 'Chargeback Fee',
      fee: '$15',
      description: 'Applied when a customer disputes a charge'
    }
  ];

  const handleGetStarted = (planName: string) => {
    navigate('/sell');
  };

  const handleCreateStore = () => {
    navigate('/sell');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your business. No hidden fees, no surprises.
            Scale as you grow with flexible pricing designed for African entrepreneurs.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                  plan.popular ? 'ring-2 ring-amber-400 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleGetStarted(plan.name)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    Get Started
                  </button>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <i className="ri-check-line text-emerald-600 text-xl mr-3 flex-shrink-0"></i>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Fees */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Additional Fees</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Transparent breakdown of all transaction and service fees
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalFees.map((fee, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{fee.title}</h3>
                  <span className="text-emerald-600 font-bold text-xl">{fee.fee}</span>
                </div>
                <p className="text-gray-600 text-sm">{fee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Professional</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: 'Product Listings', starter: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'Commission Rate', starter: '5%', pro: '3%', enterprise: '2%' },
                    { feature: 'Payment Processing Time', starter: '5-7 days', pro: '2-3 days', enterprise: 'Same day' },
                    { feature: 'Support', starter: 'Email', pro: 'Email & Chat', enterprise: '24/7 Phone & Chat' },
                    { feature: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced + Custom' },
                    { feature: 'API Access', starter: '—', pro: '—', enterprise: '✓' },
                    { feature: 'Dedicated Manager', starter: '—', pro: '—', enterprise: '✓' },
                    { feature: 'Custom Branding', starter: '—', pro: 'Limited', enterprise: 'Full' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.starter}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.pro}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
              },
              {
                q: 'Are there any setup fees?',
                a: 'No setup fees whatsoever. You only pay the monthly subscription and commission on sales.'
              },
              {
                q: 'When do I get paid?',
                a: 'Payment timing depends on your plan: 5-7 days for Starter, 2-3 days for Professional, and same-day for Enterprise.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept credit cards, debit cards, mobile money (M-Pesa, MTN Mobile Money, Airtel Money), and bank transfers.'
              },
              {
                q: 'Is there a contract or can I cancel anytime?',
                a: 'No long-term contracts required. You can cancel your subscription at any time with no penalties.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of African entrepreneurs growing their business on SOKONOVA
          </p>
          <button 
            onClick={handleCreateStore}
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Create Your Store Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
