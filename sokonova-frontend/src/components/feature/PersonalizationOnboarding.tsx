import { useState } from 'react';

interface PersonalizationOnboardingProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
}

export interface UserPreferences {
  interests: string[];
  priceRange: 'budget' | 'mid-range' | 'premium' | 'luxury';
  shoppingFrequency: 'occasional' | 'monthly' | 'weekly' | 'daily';
  favoriteCategories: string[];
}

const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'ri-smartphone-line' },
  { id: 'fashion', name: 'Fashion', icon: 'ri-shirt-line' },
  { id: 'home-garden', name: 'Home & Garden', icon: 'ri-home-4-line' },
  { id: 'sports', name: 'Sports & Outdoors', icon: 'ri-basketball-line' },
  { id: 'beauty', name: 'Beauty & Health', icon: 'ri-heart-pulse-line' },
  { id: 'books', name: 'Books & Media', icon: 'ri-book-open-line' },
  { id: 'toys', name: 'Toys & Games', icon: 'ri-gamepad-line' },
  { id: 'automotive', name: 'Automotive', icon: 'ri-car-line' },
];

const interests = [
  { id: 'deals', name: 'Great Deals', icon: 'ri-price-tag-3-line' },
  { id: 'new-arrivals', name: 'New Arrivals', icon: 'ri-gift-line' },
  { id: 'eco-friendly', name: 'Eco-Friendly', icon: 'ri-leaf-line' },
  { id: 'handmade', name: 'Handmade Items', icon: 'ri-hand-heart-line' },
  { id: 'local', name: 'Local Products', icon: 'ri-map-pin-line' },
  { id: 'trending', name: 'Trending Items', icon: 'ri-fire-line' },
];

export default function PersonalizationOnboarding({ onComplete, onSkip }: PersonalizationOnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<UserPreferences['priceRange']>('mid-range');
  const [shoppingFrequency, setShoppingFrequency] = useState<UserPreferences['shoppingFrequency']>('monthly');

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    onComplete({
      interests: selectedInterests,
      priceRange,
      shoppingFrequency,
      favoriteCategories: selectedCategories,
    });
  };

  const canProceed = () => {
    if (step === 1) return selectedCategories.length > 0;
    if (step === 2) return selectedInterests.length > 0;
    return true;
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Personalize Your Experience</h2>
              <button
                onClick={onSkip}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Categories */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What are you interested in?
                  </h3>
                  <p className="text-gray-600">
                    Select categories you'd like to see more of (choose at least one)
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedCategories.includes(category.id)
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <i className={`${category.icon} text-3xl mb-2 ${
                        selectedCategories.includes(category.id)
                          ? 'text-emerald-600'
                          : 'text-gray-400'
                      }`}></i>
                      <p className={`text-sm font-medium ${
                        selectedCategories.includes(category.id)
                          ? 'text-emerald-900'
                          : 'text-gray-700'
                      }`}>
                        {category.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What matters most to you?
                  </h3>
                  <p className="text-gray-600">
                    Help us show you the most relevant products (choose at least one)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                        selectedInterests.includes(interest.id)
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <i className={`${interest.icon} text-2xl ${
                        selectedInterests.includes(interest.id)
                          ? 'text-emerald-600'
                          : 'text-gray-400'
                      }`}></i>
                      <p className={`text-sm font-medium ${
                        selectedInterests.includes(interest.id)
                          ? 'text-emerald-900'
                          : 'text-gray-700'
                      }`}>
                        {interest.name}
                      </p>
                      {selectedInterests.includes(interest.id) && (
                        <i className="ri-check-line text-emerald-600 ml-auto"></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Shopping Preferences */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tell us about your shopping style
                  </h3>
                  <p className="text-gray-600">
                    This helps us provide better recommendations
                  </p>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    What's your typical price range?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: 'budget', label: 'Budget', icon: 'ri-copper-coin-line' },
                      { value: 'mid-range', label: 'Mid-Range', icon: 'ri-money-dollar-circle-line' },
                      { value: 'premium', label: 'Premium', icon: 'ri-vip-crown-line' },
                      { value: 'luxury', label: 'Luxury', icon: 'ri-vip-diamond-line' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPriceRange(option.value as any)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          priceRange === option.value
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        <i className={`${option.icon} text-2xl mb-1 ${
                          priceRange === option.value ? 'text-emerald-600' : 'text-gray-400'
                        }`}></i>
                        <p className={`text-sm font-medium ${
                          priceRange === option.value ? 'text-emerald-900' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shopping Frequency */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    How often do you shop online?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: 'occasional', label: 'Occasional' },
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'daily', label: 'Daily' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setShoppingFrequency(option.value as any)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          shoppingFrequency === option.value
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-gray-200 hover:border-emerald-300 bg-white text-gray-700'
                        }`}
                      >
                        <p className="text-sm font-medium">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between gap-4">
            <button
              onClick={step === 1 ? onSkip : handlePrevious}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center gap-2"
            >
              {step === 1 ? (
                'Skip'
              ) : (
                <>
                  <i className="ri-arrow-left-line"></i>
                  Previous
                </>
              )}
            </button>

            <span className="text-sm text-gray-500 font-medium">
              Step {step} of 3
            </span>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {step === 3 ? (
                <>
                  Complete
                  <i className="ri-check-line"></i>
                </>
              ) : (
                <>
                  Next
                  <i className="ri-arrow-right-line"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
