import { useState } from 'react';

interface EmailPreferencesOnboardingProps {
  onComplete: (preferences: EmailPreferences) => void;
  onSkip: () => void;
}

export interface EmailPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  priceDrops: boolean;
  recommendations: boolean;
  newsletter: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

const emailTypes = [
  {
    id: 'orderUpdates',
    name: 'Order Updates',
    description: 'Get notified about your order status and shipping updates',
    icon: 'ri-shopping-cart-line',
    recommended: true,
    required: true,
  },
  {
    id: 'promotions',
    name: 'Special Offers & Promotions',
    description: 'Exclusive deals, flash sales, and limited-time offers',
    icon: 'ri-price-tag-3-line',
    recommended: true,
  },
  {
    id: 'newArrivals',
    name: 'New Arrivals',
    description: 'Be the first to know about new products in your favorite categories',
    icon: 'ri-gift-line',
    recommended: true,
  },
  {
    id: 'priceDrops',
    name: 'Price Drop Alerts',
    description: 'Get notified when items on your wishlist go on sale',
    icon: 'ri-arrow-down-circle-line',
    recommended: true,
  },
  {
    id: 'recommendations',
    name: 'Personalized Recommendations',
    description: 'Product suggestions based on your browsing and shopping history',
    icon: 'ri-lightbulb-line',
    recommended: false,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Monthly roundup of trends, tips, and platform updates',
    icon: 'ri-mail-line',
    recommended: false,
  },
];

export default function EmailPreferencesOnboarding({ onComplete, onSkip }: EmailPreferencesOnboardingProps) {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    orderUpdates: true,
    promotions: true,
    newArrivals: true,
    priceDrops: true,
    recommendations: false,
    newsletter: false,
    frequency: 'immediate',
  });

  const togglePreference = (key: keyof EmailPreferences) => {
    if (key === 'orderUpdates') return; // Required, can't be disabled

    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setFrequency = (frequency: EmailPreferences['frequency']) => {
    setPreferences(prev => ({ ...prev, frequency }));
  };

  const handleComplete = () => {
    onComplete(preferences);
  };

  const enableAll = () => {
    setPreferences({
      ...preferences,
      orderUpdates: true,
      promotions: true,
      newArrivals: true,
      priceDrops: true,
      recommendations: true,
      newsletter: true,
    });
  };

  const disableAll = () => {
    setPreferences({
      ...preferences,
      orderUpdates: true, // Keep required
      promotions: false,
      newArrivals: false,
      priceDrops: false,
      recommendations: false,
      newsletter: false,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]" onClick={onSkip} />

      {/* Modal */}
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Email Preferences</h2>
                <p className="text-gray-600">Choose what you'd like to hear about</p>
              </div>
              <button
                onClick={onSkip}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <i className="ri-settings-3-line text-xl text-gray-400"></i>
              <span className="text-sm text-gray-600 flex-1">Quick actions:</span>
              <button
                onClick={enableAll}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Enable All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={disableAll}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
              >
                Disable All
              </button>
            </div>

            {/* Email Types */}
            <div className="space-y-3">
              {emailTypes.map((type) => {
                const isEnabled = preferences[type.id as keyof EmailPreferences];
                const isRequired = type.required;

                return (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isEnabled
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isEnabled ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <i className={`${type.icon} text-xl ${
                          isEnabled ? 'text-emerald-600' : 'text-gray-400'
                        }`}></i>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            isEnabled ? 'text-emerald-900' : 'text-gray-900'
                          }`}>
                            {type.name}
                          </h3>
                          {type.recommended && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Recommended
                            </span>
                          )}
                          {isRequired && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => togglePreference(type.id as keyof EmailPreferences)}
                        disabled={isRequired}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                          isEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                        } ${isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                            isEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Frequency */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700">
                <i className="ri-time-line mr-2"></i>
                Email Frequency (for promotional emails)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'immediate', label: 'As it happens', desc: 'Real-time updates' },
                  { value: 'daily', label: 'Daily Digest', desc: 'Once per day' },
                  { value: 'weekly', label: 'Weekly Digest', desc: 'Once per week' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFrequency(option.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                      preferences.frequency === option.value
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300 bg-white'
                    }`}
                  >
                    <p className={`font-medium text-sm mb-1 ${
                      preferences.frequency === option.value ? 'text-emerald-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-600">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <i className="ri-shield-check-line text-xl text-blue-600 flex-shrink-0 mt-0.5"></i>
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Your privacy matters</p>
                <p className="text-blue-700">
                  You can change these preferences anytime in your account settings. We'll never share your email with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between gap-4">
            <button
              onClick={onSkip}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip for now
            </button>

            <button
              onClick={handleComplete}
              className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Save Preferences
              <i className="ri-check-line"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
