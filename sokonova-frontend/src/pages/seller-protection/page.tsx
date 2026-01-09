import { useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function SellerProtectionPage() {
  const navigate = useNavigate();

  const protections = [
    {
      icon: 'ri-shield-check-line',
      title: 'Payment Protection',
      description: 'Get paid for every legitimate sale. We hold funds in escrow until delivery is confirmed, protecting you from fraudulent chargebacks.',
      features: [
        'Secure escrow system',
        'Chargeback protection',
        'Fraud detection & prevention',
        'Guaranteed payment release'
      ]
    },
    {
      icon: 'ri-file-shield-line',
      title: 'Intellectual Property Protection',
      description: 'Your products, designs, and brand are protected. We actively monitor and remove counterfeit listings.',
      features: [
        'Brand registry program',
        'Copyright protection',
        'Trademark monitoring',
        'Takedown assistance'
      ]
    },
    {
      icon: 'ri-customer-service-line',
      title: 'Dispute Resolution',
      description: 'Fair mediation for buyer-seller disputes. Our team reviews evidence and makes impartial decisions.',
      features: [
        'Professional mediation team',
        'Evidence-based decisions',
        'Fast resolution (3-5 days)',
        'Appeal process available'
      ]
    },
    {
      icon: 'ri-lock-line',
      title: 'Data Security',
      description: 'Your business data is encrypted and secure. We never share your information with competitors.',
      features: [
        'Bank-level encryption',
        'GDPR compliant',
        'Regular security audits',
        'Private seller analytics'
      ]
    },
    {
      icon: 'ri-user-shield-line',
      title: 'Identity Verification',
      description: 'All buyers are verified to reduce fraud. We screen for suspicious activity and ban bad actors.',
      features: [
        'Buyer identity verification',
        'Risk scoring system',
        'Suspicious activity alerts',
        'Automatic fraud blocking'
      ]
    },
    {
      icon: 'ri-scales-line',
      title: 'Legal Support',
      description: 'Access to legal resources and guidance. We help you understand your rights and obligations.',
      features: [
        'Legal documentation templates',
        'Compliance guidance',
        'Terms & conditions support',
        'Regulatory updates'
      ]
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Verification',
      description: 'Complete our seller verification process. We verify your identity and business credentials.',
      icon: 'ri-user-search-line'
    },
    {
      step: '2',
      title: 'Protection Activation',
      description: 'Your protection starts immediately after verification. All your listings are automatically covered.',
      icon: 'ri-shield-check-line'
    },
    {
      step: '3',
      title: 'Secure Transactions',
      description: 'Every sale is protected by our escrow system. Funds are held securely until delivery confirmation.',
      icon: 'ri-safe-line'
    },
    {
      step: '4',
      title: 'Ongoing Monitoring',
      description: 'We continuously monitor for fraud, IP violations, and suspicious activity to keep you safe.',
      icon: 'ri-eye-line'
    }
  ];

  const stats = [
    { value: '99.8%', label: 'Fraud Prevention Rate' },
    { value: '24/7', label: 'Security Monitoring' },
    { value: '< 3 days', label: 'Average Dispute Resolution' },
    { value: '$2M+', label: 'Protected in Transactions' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <i className="ri-shield-check-line text-4xl text-emerald-600"></i>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Seller Protection Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Sell with confidence. Our comprehensive protection program safeguards your business, 
            payments, and intellectual property at every step.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Comprehensive Protection</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Six layers of protection to keep your business safe and secure
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {protections.map((protection, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <i className={`${protection.icon} text-2xl text-emerald-600`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3">{protection.title}</h3>
                <p className="text-gray-600 mb-6">{protection.description}</p>
                <ul className="space-y-3">
                  {protection.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <i className="ri-check-line text-emerald-600 mr-2 mt-1 flex-shrink-0"></i>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Getting protected is simple and automatic
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <i className={`${item.icon} text-3xl text-white`}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Real Protection Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                seller: 'Amara\'s Crafts',
                location: 'Lagos, Nigeria',
                issue: 'Fraudulent Chargeback',
                resolution: 'Protected $2,400 in sales after proving legitimate delivery',
                image: 'https://readdy.ai/api/search-image?query=African%20woman%20artisan%20craftswoman%20smiling%20confidently%20in%20her%20workshop%20surrounded%20by%20handmade%20crafts%20and%20colorful%20textiles%2C%20warm%20natural%20lighting%2C%20professional%20portrait%20photography%2C%20authentic%20entrepreneurial%20spirit&width=400&height=300&seq=seller-protection-1&orientation=landscape'
              },
              {
                seller: 'TechHub Kenya',
                location: 'Nairobi, Kenya',
                issue: 'Counterfeit Listings',
                resolution: 'Removed 15 fake listings within 24 hours, protected brand integrity',
                image: 'https://readdy.ai/api/search-image?query=African%20male%20tech%20entrepreneur%20working%20on%20laptop%20in%20modern%20office%20space%2C%20professional%20business%20environment%2C%20confident%20expression%2C%20natural%20lighting%2C%20authentic%20business%20portrait&width=400&height=300&seq=seller-protection-2&orientation=landscape'
              },
              {
                seller: 'Sahara Fashion',
                location: 'Accra, Ghana',
                issue: 'Payment Dispute',
                resolution: 'Mediated dispute fairly, seller received full payment in 3 days',
                image: 'https://readdy.ai/api/search-image?query=African%20fashion%20designer%20woman%20in%20elegant%20clothing%20boutique%20with%20colorful%20African%20print%20fabrics%2C%20professional%20fashion%20photography%2C%20bright%20modern%20retail%20space%2C%20confident%20business%20owner&width=400&height=300&seq=seller-protection-3&orientation=landscape'
              }
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.seller}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{story.seller}</h3>
                  <p className="text-sm text-gray-500 mb-4">{story.location}</p>
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      {story.issue}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{story.resolution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Is seller protection included in all plans?',
                a: 'Yes! All sellers on SOKONOVA receive comprehensive protection regardless of their subscription plan. Protection is automatic and included at no extra cost.'
              },
              {
                q: 'What happens if a buyer files a chargeback?',
                a: 'We investigate all chargebacks thoroughly. If you provided proof of delivery and followed our seller guidelines, we\'ll fight the chargeback on your behalf and protect your payment.'
              },
              {
                q: 'How do I report intellectual property violations?',
                a: 'Use our IP Protection Portal in your seller dashboard. Submit evidence of your ownership, and we\'ll investigate and remove infringing listings within 24-48 hours.'
              },
              {
                q: 'What if I disagree with a dispute resolution?',
                a: 'You have the right to appeal any decision. Our appeals team will review additional evidence and make a final determination within 5 business days.'
              },
              {
                q: 'Are there any situations not covered by protection?',
                a: 'Protection doesn\'t cover violations of our terms of service, prohibited items, or fraudulent activity by the seller. As long as you operate honestly and follow guidelines, you\'re protected.'
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

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <i className="ri-shield-check-line text-6xl mb-6 opacity-90"></i>
          <h2 className="text-3xl font-bold mb-4">Start Selling with Confidence</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of protected sellers on Africa's most trusted marketplace
          </p>
          <button 
            onClick={() => navigate('/sell')}
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Create Protected Store
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
