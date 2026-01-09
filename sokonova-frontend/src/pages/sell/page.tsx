import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Input from '../../components/base/Input';
import Toast, { ToastType } from '../../components/base/Toast';

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export default function SellPage() {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    country: '',
    city: '',
    address: '',
    productCategories: [],
    businessDescription: '',
    website: '',
    socialMedia: '',
    monthlyVolume: '',
    experience: '',
    bankAccount: '',
    taxId: '',
    businessLicense: ''
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    'Fashion & Beauty',
    'Electronics',
    'Home & Garden',
    'Arts & Crafts',
    'Food & Beverages',
    'Health & Wellness',
    'Books & Media',
    'Sports & Outdoors',
    'Automotive',
    'Baby & Kids'
  ];

  const businessTypes = [
    'Individual Seller',
    'Small Business',
    'Manufacturer',
    'Wholesaler',
    'Artisan/Craftsperson',
    'Cooperative',
    'NGO/Social Enterprise'
  ];

  const countries = [
    'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'Tanzania',
    'Uganda', 'Rwanda', 'Senegal', 'Morocco', 'Egypt', 'Zimbabwe',
    'Botswana', 'Zambia', 'Cameroon', 'Ivory Coast'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const updated = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      setFormData(prevData => ({ ...prevData, productCategories: updated }));
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submitData.append(key, value.join(', '));
      } else {
        submitData.append(key, value);
      }
    });

    try {
      const response = await fetch('https://readdy.ai/api/form/d49mdl97bl57tkq9h85g', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        setToast({
          show: true,
          message: 'Application submitted successfully! We will review your application and contact you within 2-3 business days.',
          type: 'success'
        });
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          businessType: '',
          country: '',
          city: '',
          address: '',
          productCategories: [],
          businessDescription: '',
          website: '',
          socialMedia: '',
          monthlyVolume: '',
          experience: '',
          bankAccount: '',
          taxId: '',
          businessLicense: ''
        });
        setSelectedCategories([]);
        setCurrentStep(1);
      } else {
        setToast({
          show: true,
          message: 'Failed to submit application. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.contactName && formData.email && formData.phone;
      case 2:
        return formData.businessType && formData.country && formData.city && selectedCategories.length > 0;
      case 3:
        return formData.businessDescription && formData.monthlyVolume && formData.experience;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://readdy.ai/api/search-image?query=African%20entrepreneur%20working%20on%20laptop%20in%20modern%20office%20space%20with%20products%20and%20packages%20around%2C%20warm%20lighting%2C%20professional%20business%20atmosphere%2C%20success%20and%20growth%20concept%2C%20clean%20modern%20workspace&width=1920&height=600&seq=6&orientation=landscape')`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Selling on SOKONOVA
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of African entrepreneurs reaching global customers. 
            Get verified, start selling, and grow your business with our trusted platform.
          </p>
          <div className="flex items-center justify-center space-x-8 text-white">
            <div className="flex items-center">
              <i className="ri-global-line text-2xl mr-2 text-emerald-400"></i>
              <span>Global Reach</span>
            </div>
            <div className="flex items-center">
              <i className="ri-shield-check-line text-2xl mr-2 text-emerald-400"></i>
              <span>Verified Platform</span>
            </div>
            <div className="flex items-center">
              <i className="ri-money-dollar-circle-line text-2xl mr-2 text-emerald-400"></i>
              <span>Secure Payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell on SOKONOVA?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build and grow your online business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-earth-line text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Market Access</h3>
              <p className="text-gray-600">
                Reach customers worldwide with our international shipping and payment solutions
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-line-chart-line text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Insights</h3>
              <p className="text-gray-600">
                Track your performance with detailed analytics and business intelligence tools
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-customer-service-2-line text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-600">
                Get help from our seller success team and access training resources
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-secure-payment-line text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Fast, secure payouts with multiple payment options and fraud protection
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-store-3-line text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Store Setup</h3>
              <p className="text-gray-600">
                Create your online store in minutes with our intuitive seller dashboard
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-truck-line text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Logistics Support</h3>
              <p className="text-gray-600">
                Integrated shipping solutions and fulfillment support across Africa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Seller Application</h2>
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-emerald-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-gray-600">
                  {currentStep === 1 && 'Basic Information'}
                  {currentStep === 2 && 'Business Details'}
                  {currentStep === 3 && 'Additional Information'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} data-readdy-form id="seller_application">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <Input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Enter your business name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name *
                      </label>
                      <Input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+234 xxx xxx xxxx"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8"
                        required
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8"
                        required
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Categories * (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="mr-2 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description *
                    </label>
                    <textarea
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      placeholder="Tell us about your business, products, and what makes you unique..."
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.businessDescription.length}/500 characters</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website (Optional)
                      </label>
                      <Input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Media (Optional)
                      </label>
                      <Input
                        type="text"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                        placeholder="Instagram, Facebook, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Monthly Sales Volume *
                      </label>
                      <select
                        name="monthlyVolume"
                        value={formData.monthlyVolume}
                        onChange={(e) => handleInputChange('monthlyVolume', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8"
                        required
                      >
                        <option value="">Select volume</option>
                        <option value="Under $500">Under $500</option>
                        <option value="$500 - $2,000">$500 - $2,000</option>
                        <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="Over $10,000">Over $10,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Experience *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8"
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="New to selling online">New to selling online</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="Over 5 years">Over 5 years</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Account Details (Optional)
                      </label>
                      <Input
                        type="text"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                        placeholder="Bank name and account info"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID / Business Registration (Optional)
                      </label>
                      <Input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        placeholder="Registration number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <i className="ri-arrow-left-line mr-2"></i>
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < 3 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      disabled={!isStepValid()}
                    >
                      Next
                      <i className="ri-arrow-right-line ml-2"></i>
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!isStepValid()}>
                      Submit Application
                      <i className="ri-send-plane-line ml-2"></i>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does the approval process take?
              </h3>
              <p className="text-gray-600">
                We typically review applications within 2-3 business days. You'll receive an email notification once your application is approved.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What are the selling fees?
              </h3>
              <p className="text-gray-600">
                We charge a competitive 5% transaction fee on successful sales. There are no monthly fees or listing fees.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I need business registration to sell?
              </h3>
              <p className="text-gray-600">
                While business registration is not required to start, it's recommended for higher sales volumes and helps build customer trust.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I receive payments?
              </h3>
              <p className="text-gray-600">
                We support multiple payout methods including bank transfers, mobile money, and digital wallets. Payments are processed weekly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
