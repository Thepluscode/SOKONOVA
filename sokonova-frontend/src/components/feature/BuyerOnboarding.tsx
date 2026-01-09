import { useState, useEffect } from 'react';
import WelcomeTour from './WelcomeTour';
import PersonalizationOnboarding, { type UserPreferences } from './PersonalizationOnboarding';
import EmailPreferencesOnboarding, { type EmailPreferences } from './EmailPreferencesOnboarding';

interface BuyerOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  autoStart?: boolean;
}

export interface OnboardingData {
  completedTour: boolean;
  userPreferences?: UserPreferences;
  emailPreferences?: EmailPreferences;
  completedAt: Date;
}

type OnboardingStep = 'welcome' | 'personalization' | 'email' | 'complete';

export default function BuyerOnboarding({ onComplete, autoStart = true }: BuyerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    completedTour: false,
  });

  // Check if user has already completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('buyer_onboarding_completed');
    if (hasCompletedOnboarding && !autoStart) {
      // Skip onboarding if already completed
      return;
    }
  }, [autoStart]);

  const handleWelcomeTourComplete = () => {
    setOnboardingData(prev => ({ ...prev, completedTour: true }));
    setCurrentStep('personalization');
  };

  const handleWelcomeTourSkip = () => {
    setOnboardingData(prev => ({ ...prev, completedTour: false }));
    setCurrentStep('personalization');
  };

  const handlePersonalizationComplete = (preferences: UserPreferences) => {
    setOnboardingData(prev => ({ ...prev, userPreferences: preferences }));
    setCurrentStep('email');
  };

  const handlePersonalizationSkip = () => {
    setCurrentStep('email');
  };

  const handleEmailPreferencesComplete = (preferences: EmailPreferences) => {
    const finalData: OnboardingData = {
      ...onboardingData,
      emailPreferences: preferences,
      completedAt: new Date(),
    } as OnboardingData;

    // Save to localStorage
    localStorage.setItem('buyer_onboarding_completed', 'true');
    localStorage.setItem('buyer_onboarding_data', JSON.stringify(finalData));

    // Call parent completion handler
    onComplete(finalData);
    setCurrentStep('complete');
  };

  const handleEmailPreferencesSkip = () => {
    const finalData: OnboardingData = {
      ...onboardingData,
      completedAt: new Date(),
    } as OnboardingData;

    // Save to localStorage
    localStorage.setItem('buyer_onboarding_completed', 'true');
    localStorage.setItem('buyer_onboarding_data', JSON.stringify(finalData));

    // Call parent completion handler
    onComplete(finalData);
    setCurrentStep('complete');
  };

  // Don't render anything if complete
  if (currentStep === 'complete') {
    return null;
  }

  return (
    <>
      {currentStep === 'welcome' && (
        <WelcomeTour
          onComplete={handleWelcomeTourComplete}
          onSkip={handleWelcomeTourSkip}
        />
      )}

      {currentStep === 'personalization' && (
        <PersonalizationOnboarding
          onComplete={handlePersonalizationComplete}
          onSkip={handlePersonalizationSkip}
        />
      )}

      {currentStep === 'email' && (
        <EmailPreferencesOnboarding
          onComplete={handleEmailPreferencesComplete}
          onSkip={handleEmailPreferencesSkip}
        />
      )}
    </>
  );
}
