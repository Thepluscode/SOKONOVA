import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showListingForm, setShowListingForm] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    providerName: '',
    category: '',
    priceType: 'fixed',
    price: '',
    description: '',
    features: '',
    email: '',
    phone: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'All Services', icon: 'ri-apps-line' },
    { id: 'logistics', name: 'Logistics & Shipping', icon: 'ri-truck-line' },
    { id: 'marketing', name: 'Marketing & Promotion', icon: 'ri-megaphone-line' },
    { id: 'photography', name: 'Photography', icon: 'ri-camera-line' },
    { id: 'packaging', name: 'Packaging', icon: 'ri-box-3-line' },
    { id: 'consulting', name: 'Business Consulting', icon: 'ri-lightbulb-line' }
  ];

  const services = [
    {
      id: 1,
      name: 'Express Shipping to USA',
      provider: 'DHL Express Africa',
      category: 'logistics',
      price: 'From $25',
      rating: 4.8,
      reviews: 342,
      image: 'https://readdy.ai/api/search-image?query=Professional%20logistics%20shipping%20service%2C%20packages%20and%20delivery%20trucks%2C%20modern%20warehouse%2C%20efficient%20shipping%20operations&width=400&height=300&seq=serv1&orientation=landscape',
      description: 'Fast and reliable shipping to USA with tracking and insurance',
      features: ['3-5 day delivery', 'Full tracking', 'Insurance included', 'Customs clearance']
    },
    {
      id: 2,
      name: 'Social Media Marketing Package',
      provider: 'AfriDigital Marketing',
      category: 'marketing',
      price: 'From $150/month',
      rating: 4.9,
      reviews: 189,
      image: 'https://readdy.ai/api/search-image?query=Social%20media%20marketing%20workspace%2C%20digital%20marketing%20team%2C%20creative%20content%20creation%2C%20modern%20office%20setting&width=400&height=300&seq=serv2&orientation=landscape',
      description: 'Grow your brand with professional social media management',
      features: ['Content creation', 'Daily posting', 'Analytics reports', 'Engagement management']
    },
    {
      id: 3,
      name: 'Product Photography Studio',
      provider: 'Lagos Photo Studio',
      category: 'photography',
      price: 'From $50/session',
      rating: 4.7,
      reviews: 267,
      image: 'https://readdy.ai/api/search-image?query=Professional%20product%20photography%20studio%2C%20lighting%20equipment%2C%20white%20background%20setup%2C%20photographer%20at%20work&width=400&height=300&seq=serv3&orientation=landscape',
      description: 'Professional product photos that sell',
      features: ['White background', 'Multiple angles', 'Same-day delivery', 'Editing included']
    },
    {
      id: 4,
      name: 'Custom Packaging Design',
      provider: 'EcoPack Solutions',
      category: 'packaging',
      price: 'From $2/unit',
      rating: 4.6,
      reviews: 156,
      image: 'https://readdy.ai/api/search-image?query=Custom%20product%20packaging%20design%2C%20eco-friendly%20boxes%20and%20materials%2C%20branded%20packaging%2C%20sustainable%20packaging%20solutions&width=400&height=300&seq=serv4&orientation=landscape',
      description: 'Eco-friendly custom packaging for your products',
      features: ['Custom branding', 'Eco-friendly materials', 'Bulk discounts', 'Fast turnaround']
    },
    {
      id: 5,
      name: 'E-commerce Business Consulting',
      provider: 'AfriConsult Group',
      category: 'consulting',
      price: 'From $100/hour',
      rating: 4.9,
      reviews: 98,
      image: 'https://readdy.ai/api/search-image?query=Business%20consulting%20meeting%2C%20professional%20consultants%20with%20clients%2C%20modern%20office%2C%20strategy%20planning%20session&width=400&height=300&seq=serv5&orientation=landscape',
      description: 'Expert guidance to grow your online business',
      features: ['Strategy planning', 'Market analysis', 'Growth optimization', 'Ongoing support']
    },
    {
      id: 6,
      name: 'Regional Shipping Network',
      provider: 'PanAfrica Logistics',
      category: 'logistics',
      price: 'From $15',
      rating: 4.5,
      reviews: 423,
      image: 'https://readdy.ai/api/search-image?query=African%20logistics%20network%2C%20delivery%20vans%20and%20trucks%2C%20regional%20shipping%20operations%2C%20efficient%20distribution&width=400&height=300&seq=serv6&orientation=landscape',
      description: 'Affordable shipping across African countries',
      features: ['54 countries', 'Door-to-door', 'Bulk discounts', 'Real-time tracking']
    }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append('serviceName', formData.serviceName);
      formBody.append('providerName', formData.providerName);
      formBody.append('category', formData.category);
      formBody.append('priceType', formData.priceType);
      formBody.append('price', formData.price);
      formBody.append('description', formData.description);
      formBody.append('features', formData.features);
      formBody.append('email', formData.email);
      formBody.append('phone', formData.phone);
      formBody.append('website', formData.website);

      const response = await fetch('https://readdy.ai/api/form/d4n3d8i32n60g3bh86tg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString()
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          serviceName: '',
          providerName: '',
          category: '',
          priceType: 'fixed',
          price: '',
          description: '',
          features: '',
          email: '',
          phone: '',
          website: ''
        });
        setTimeout(() => {
          setShowListingForm(false);
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Services Marketplace
            </h1>
            <p className="text-xl text-blue-50 mb-8 max-w-3xl mx-auto">
              Professional services to help you grow your business on SOKONOVA
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Showing <strong>{filteredServices.length}</strong> services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-600">
                        <i className="ri-store-2-line mr-1"></i>
                        {service.provider}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`${
                            i < Math.floor(service.rating)
                              ? 'ri-star-fill text-yellow-400'
                              : 'ri-star-line text-gray-300'
                          } text-sm`}
                        ></i>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {service.rating} ({service.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full whitespace-nowrap"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-blue-600">{service.price}</span>
                    <Button variant="outline" className="whitespace-nowrap">
                      View Details
                      <i className="ri-arrow-right-line ml-2"></i>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Offer Your Services
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Are you a service provider? Join our marketplace and connect with thousands of sellers
          </p>
          <Button className="whitespace-nowrap" onClick={() => setShowListingForm(true)}>
            <i className="ri-add-line mr-2"></i>
            List Your Service
          </Button>
        </div>
      </section>

      {/* Service Listing Form Modal */}
      {showListingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">List Your Service</h3>
              <button
                onClick={() => setShowListingForm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-3xl text-green-600"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Submission Received!</h4>
                <p className="text-gray-600">
                  Thank you for submitting your service. Our team will review it and get back to you within 2-3 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6" data-readdy-form id="service-listing-form">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., Express Shipping to USA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider/Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="providerName"
                      value={formData.providerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
                    >
                      <option value="">Select a category</option>
                      <option value="logistics">Logistics & Shipping</option>
                      <option value="marketing">Marketing & Promotion</option>
                      <option value="photography">Photography</option>
                      <option value="packaging">Packaging</option>
                      <option value="consulting">Business Consulting</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pricing Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="priceType"
                        value={formData.priceType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="hourly">Hourly Rate</option>
                        <option value="monthly">Monthly Subscription</option>
                        <option value="custom">Custom Quote</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Starting Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="e.g., $25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      maxLength={500}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      placeholder="Describe your service in detail..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Features <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      required
                      maxLength={500}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      placeholder="List key features (one per line)"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">{formData.features.length}/500 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 whitespace-nowrap"
                    onClick={() => setShowListingForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 whitespace-nowrap"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line mr-2"></i>
                        Submit Service
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
