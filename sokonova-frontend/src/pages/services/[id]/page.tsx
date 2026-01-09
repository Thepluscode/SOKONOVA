import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const service = {
    id: id || '1',
    name: 'Express Shipping to USA',
    provider: 'DHL Express Africa',
    rating: 4.8,
    reviews: 342,
    image: 'https://readdy.ai/api/search-image?query=Professional%20logistics%20shipping%20service%2C%20packages%20and%20delivery%20trucks%2C%20modern%20warehouse%2C%20efficient%20shipping%20operations%2C%20international%20delivery&width=800&height=500&seq=servdetail1&orientation=landscape',
    description: 'Fast and reliable international shipping service from Africa to USA. We handle all customs clearance and provide full tracking from pickup to delivery. Our express service ensures your products reach customers quickly and safely.',
    features: [
      'Door-to-door pickup and delivery',
      'Full insurance coverage included',
      'Real-time tracking updates',
      'Customs clearance assistance',
      'Dedicated customer support',
      'Packaging materials provided'
    ],
    packages: [
      {
        id: 'basic',
        name: 'Basic',
        price: 25,
        duration: '7-10 days',
        features: [
          'Standard tracking',
          'Up to 5kg',
          'Basic insurance ($100)',
          'Email support'
        ]
      },
      {
        id: 'standard',
        name: 'Standard',
        price: 45,
        duration: '5-7 days',
        features: [
          'Priority tracking',
          'Up to 10kg',
          'Enhanced insurance ($500)',
          'Phone &amp; email support',
          'Customs assistance'
        ],
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 75,
        duration: '3-5 days',
        features: [
          'Express tracking',
          'Up to 20kg',
          'Full insurance ($1000)',
          '24/7 priority support',
          'Full customs handling',
          'Signature delivery'
        ]
      }
    ]
  };

  const reviews = [
    {
      id: 1,
      author: 'Chioma Adebayo',
      rating: 5,
      date: '2024-01-20',
      comment: 'Excellent service! My packages arrived in USA within 4 days. Great tracking and customer support.',
      verified: true
    },
    {
      id: 2,
      author: 'Kwame Mensah',
      rating: 5,
      date: '2024-01-15',
      comment: 'Very reliable. I\'ve used them multiple times for my business. Highly recommended!',
      verified: true
    },
    {
      id: 3,
      author: 'Amara Okafor',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good service overall. Slightly delayed but customer support was helpful throughout.',
      verified: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedPkg = service.packages.find(pkg => pkg.id === selectedPackage);
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('address', formData.address);
      formDataToSubmit.append('preferredDate', formData.preferredDate);
      formDataToSubmit.append('notes', formData.notes);
      formDataToSubmit.append('service', service.name);
      formDataToSubmit.append('package', selectedPkg?.name || '');
      formDataToSubmit.append('price', `$${selectedPkg?.price || 0}`);

      const response = await fetch('https://readdy.ai/api/form/d4n3ajat20jieso0q6s0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString()
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          preferredDate: '',
          notes: ''
        });
        setTimeout(() => {
          setShowBookingForm(false);
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/services" className="hover:text-blue-600">Services</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900">{service.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <div>
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`${
                        i < Math.floor(service.rating)
                          ? 'ri-star-fill text-yellow-400'
                          : 'ri-star-line text-gray-300'
                      } text-lg`}
                    ></i>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {service.rating} ({service.reviews} reviews)
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-6">{service.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What\'s Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <i className="ri-check-line text-green-600 mr-2 mt-1 flex-shrink-0"></i>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your Package</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                      <span className="text-gray-600 ml-2">per shipment</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      <i className="ri-time-line mr-1"></i>
                      {pkg.duration}
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <i className="ri-check-line text-green-600 mr-2 mt-0.5 flex-shrink-0"></i>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{review.author}</span>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
                              Verified User
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`${
                                i < review.rating
                                  ? 'ri-star-fill text-yellow-400'
                                  : 'ri-star-line text-gray-300'
                              } text-sm`}
                            ></i>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {service.provider.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{service.provider}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-star-fill text-yellow-400 mr-1"></i>
                    {service.rating} rating
                  </div>
                </div>
              </div>
              <Button 
                className="w-full mb-3 whitespace-nowrap"
                onClick={() => setShowBookingForm(true)}
              >
                <i className="ri-shopping-cart-line mr-2"></i>
                Book Service
              </Button>
              <Button variant="outline" className="w-full whitespace-nowrap">
                <i className="ri-message-3-line mr-2"></i>
                Contact Provider
              </Button>
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="ri-information-line text-blue-600 mr-2"></i>
                Quick Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">&lt; 2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-gray-900">3-10 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Orders Completed</span>
                  <span className="font-medium text-gray-900">2,450+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
              <button
                onClick={() => setShowBookingForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-check-line text-3xl text-green-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
                  <p className="text-gray-600">We'll contact you shortly to confirm your booking.</p>
                </div>
              ) : (
                <>
                  {/* Selected Package Summary */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Selected Package</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {service.packages.find(pkg => pkg.id === selectedPackage)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.packages.find(pkg => pkg.id === selectedPackage)?.duration}
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        ${service.packages.find(pkg => pkg.id === selectedPackage)?.price}
                      </span>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <form onSubmit={handleSubmit} data-readdy-form>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pickup Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter your pickup address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Pickup Date *
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Notes
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          maxLength={500}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                          placeholder="Any special instructions or requirements..."
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.notes.length}/500 characters
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="ri-check-line mr-2"></i>
                            Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
