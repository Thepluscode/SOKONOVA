import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

export default function SubscriptionsPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        'Up to 10 products',
        'Basic analytics',
        '5% transaction fee',
        'Email support',
        'Standard listing',
        'Basic seller profile'
      ],
      limitations: [
        'No featured listings',
        'Limited customization',
        'Standard support only'
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 29, annual: 290 },
      description: 'For growing businesses',
      features: [
        'Unlimited products',
        'Advanced analytics',
        '3% transaction fee',
        'Priority email support',
        'Featured listings (5/month)',
        'Custom seller profile',
        'Bulk upload tools',
        'Promotional badges',
        'Early access to features'
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 99, annual: 990 },
      description: 'For established sellers',
      features: [
        'Everything in Pro',
        'Premium analytics dashboard',
        '2% transaction fee',
        '24/7 priority support',
        'Unlimited featured listings',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'White-label options',
        'Marketing consultation'
      ],
      limitations: [],
      cta: 'Upgrade to Enterprise',
      popular: false
    }
  ];

  const addons = [
    {
      id: 'featured',
      name: 'Extra Featured Listings',
      price: 10,
      description: '10 additional featured listings per month',
      icon: 'ri-star-line'
    },
    {
      id: 'ads',
      name: 'Sponsored Placements',
      price: 50,
      description: 'Premium ad placement on homepage and category pages',
      icon: 'ri-megaphone-line'
    },
    {
      id: 'photography',
      name: 'Professional Photography',
      price: 100,
      description: 'Monthly product photography session',
      icon: 'ri-camera-line'
    },
    {
      id: 'consulting',
      name: 'Business Consulting',
      price: 150,
      description: '2 hours of expert business consultation per month',
      icon: 'ri-lightbulb-line'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-purple-50 mb-8 max-w-3xl mx-auto">
              Flexible pricing plans designed to grow with your business
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-white hover:text-purple-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  billingCycle === 'annual'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-white hover:text-purple-100'
                }`}
              >
                Annual
                <span className="ml-2 px-2 py-0.5 bg-green-400 text-green-900 text-xs rounded-full whitespace-nowrap">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.popular
                    ? 'border-purple-600 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-purple-300'
                } transition-all`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-sm font-medium rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'annual' && plan.price.annual > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save ${(plan.price.monthly * 12) - plan.price.annual} per year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-green-600 mr-2 mt-1 flex-shrink-0"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-close-line text-gray-400 mr-2 mt-1 flex-shrink-0"></i>
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full whitespace-nowrap ${
                    plan.popular ? '' : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  variant={plan.id === 'free' ? 'outline' : 'primary'}
                  disabled={plan.id === 'free'}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Add-ons</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enhance your plan with additional services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${addon.icon} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{addon.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${addon.price}</span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
                <Button variant="outline" className="w-full mt-4 whitespace-nowrap">
                  Add to Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
            <p className="text-xl text-gray-600">Compare all features across plans</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-purple-50">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Products', free: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Transaction Fee', free: '5%', pro: '3%', enterprise: '2%' },
                  { feature: 'Analytics', free: 'Basic', pro: 'Advanced', enterprise: 'Premium' },
                  { feature: 'Featured Listings', free: '0', pro: '5/month', enterprise: 'Unlimited' },
                  { feature: 'Support', free: 'Email', pro: 'Priority', enterprise: '24/7 Priority' },
                  { feature: 'API Access', free: '✗', pro: '✗', enterprise: '✓' },
                  { feature: 'Account Manager', free: '✗', pro: '✗', enterprise: '✓' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-700">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-6 text-center text-gray-900 bg-purple-50 font-medium">{row.pro}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and mobile money payments.'
              },
              {
                q: 'Is there a setup fee?',
                a: 'No, there are no setup fees. You only pay for your chosen subscription plan.'
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel anytime. Your plan will remain active until the end of your billing period.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
