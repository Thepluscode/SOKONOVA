
import { useState } from 'react';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';

export default function PartnerRegisterPage() {
  const [step, setStep] = useState(1);
  const [partnerType, setPartnerType] = useState<'logistics' | 'payment' | 'marketing' | 'api'>('logistics');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleNavigation = (path: string) => {
    try {
      // Check if custom navigation function exists
      if (typeof window.REACT_APP_NAVIGATE === 'function') {
        window.REACT_APP_NAVIGATE(path);
      } else {
        // Fallback to standard navigation
        window.location.href = path;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Final fallback to standard navigation
      window.location.href = path;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-checkbox-circle-fill text-5xl text-green-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
            <p className="text-gray-600 mb-8">Thank you for your interest in partnering with SOKONOVA. Our team will review your application and get back to you within 3-5 business days.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button onClick={() => handleNavigation('/partner/docs')} className="whitespace-nowrap w-full sm:w-auto">
                <i className="ri-book-line mr-2"></i>
                View Documentation
              </Button>
              <Button variant="outline" onClick={() => handleNavigation('/')} className="whitespace-nowrap w-full sm:w-auto">
                <i className="ri-home-line mr-2"></i>
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Partner</h1>
          <p className="text-gray-600">Join Africa's fastest-growing marketplace ecosystem</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-sm font-medium text-gray-900">Partner Type</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div className={`h-full bg-emerald-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-sm font-medium text-gray-900">Details</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Partner Type</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPartnerType('logistics')}
                  className={`p-6 rounded-lg border-2 transition-all text-left cursor-pointer ${
                    partnerType === 'logistics'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-truck-line text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Logistics Partner</h3>
                  <p className="text-sm text-gray-600">Provide shipping and delivery services across Africa</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPartnerType('payment')}
                  className={`p-6 rounded-lg border-2 transition-all text-left cursor-pointer ${
                    partnerType === 'payment'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-bank-card-line text-2xl text-green-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Partner</h3>
                  <p className="text-sm text-gray-600">Integrate payment solutions for seamless transactions</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPartnerType('marketing')}
                  className={`p-6 rounded-lg border-2 transition-all text-left cursor-pointer ${
                    partnerType === 'marketing'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-megaphone-line text-2xl text-purple-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Partner</h3>
                  <p className="text-sm text-gray-600">Help sellers grow with marketing and advertising services</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPartnerType('api')}
                  className={`p-6 rounded-lg border-2 transition-all text-left cursor-pointer ${
                    partnerType === 'api'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="ri-code-box-line text-2xl text-orange-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">API Partner</h3>
                  <p className="text-sm text-gray-600">Build integrations and extend platform capabilities</p>
                </button>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)} className="whitespace-nowrap">
                  Continue
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Partner Information</h2>
              
              <div className="space-y-6">
                {/* Company Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <Input type="text" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                        <Input type="text" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                        <Input type="text" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                      <Input type="url" placeholder="https://" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Description *</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        rows={4}
                        required
                        placeholder="Tell us about your company and services..."
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Person</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <Input type="text" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <Input type="text" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <Input type="email" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input type="tel" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <Input type="text" />
                    </div>
                  </div>
                </div>

                {/* Service Coverage */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Coverage</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Countries Covered *</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        rows={3}
                        required
                        placeholder="List countries where you provide services (e.g., Nigeria, Kenya, Ghana)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected Monthly Volume</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm">
                        <option value="">Select range</option>
                        <option value="0-100">0 - 100</option>
                        <option value="100-500">100 - 500</option>
                        <option value="500-1000">500 - 1,000</option>
                        <option value="1000-5000">1,000 - 5,000</option>
                        <option value="5000+">5,000+</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to partner with SOKONOVA? *</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        rows={4}
                        placeholder="Tell us about your experience in this industry..."
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm text-gray-700">
                      I agree to the SOKONOVA Partner Terms and Conditions and Privacy Policy. I understand that my application will be reviewed and I may be contacted for additional information.
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="whitespace-nowrap w-full sm:w-auto">
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                  </Button>
                  <Button type="submit" className="whitespace-nowrap w-full sm:w-auto">
                    <i className="ri-send-plane-fill mr-2"></i>
                    Submit Application
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
}

// Type declaration for the custom navigation function
declare global {
  interface Window {
    REACT_APP_NAVIGATE?: (path: string) => void;
  }
}
