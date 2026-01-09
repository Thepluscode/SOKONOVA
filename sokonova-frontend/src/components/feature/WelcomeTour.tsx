import { useState, useEffect } from 'react';

interface TourStep {
  id: number;
  title: string;
  description: string;
  target?: string;
  icon: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: 'Welcome to SOKONOVA!',
    description: "Africa's premier marketplace connecting buyers with verified sellers. Let's take a quick tour of the platform.",
    icon: 'ri-hand-heart-line',
    position: 'center',
  },
  {
    id: 2,
    title: 'Browse Products',
    description: 'Explore thousands of products from verified sellers across Africa. Use filters and search to find exactly what you need.',
    icon: 'ri-shopping-bag-3-line',
    position: 'center',
  },
  {
    id: 3,
    title: 'Secure Shopping',
    description: 'All transactions are protected with buyer protection. Shop with confidence knowing your purchase is secure.',
    icon: 'ri-shield-check-line',
    position: 'center',
  },
  {
    id: 4,
    title: 'Track Your Orders',
    description: 'Monitor your orders in real-time from checkout to delivery. Get updates at every step.',
    icon: 'ri-map-pin-line',
    position: 'center',
  },
  {
    id: 5,
    title: 'Get Help Anytime',
    description: 'Need assistance? Use the chat button in the bottom-right corner to talk with our support team 24/7.',
    icon: 'ri-customer-service-2-line',
    position: 'center',
  },
];

export default function WelcomeTour({ onComplete, onSkip }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Tour Modal */}
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-emerald-600'
                    : index < currentStep
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
              <i className={`${step.icon} text-4xl text-emerald-600`}></i>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {/* Previous/Skip Button */}
            {currentStep === 0 ? (
              <button
                onClick={handleSkip}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Skip Tour
              </button>
            ) : (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center gap-2"
              >
                <i className="ri-arrow-left-line"></i>
                Previous
              </button>
            )}

            {/* Step Counter */}
            <span className="text-sm text-gray-500 font-medium">
              {currentStep + 1} of {tourSteps.length}
            </span>

            {/* Next/Finish Button */}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  Get Started
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
