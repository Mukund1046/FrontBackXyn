import React from 'react';
import { Button } from '../ui/Button';
import { OnboardingLayout } from './OnboardingLayout';
import { useAppStore } from '../../stores/useAppStore';

export const ApiSetup: React.FC = () => {
  const { currentStep, onboardingSteps, setCurrentStep, completeStep } = useAppStore();

  const handleContinue = () => {
    completeStep('api-setup');
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <OnboardingLayout
      title="AI Assistant Setup"
      description="Configure your AI assistant with Gemini API"
      currentStep={currentStep + 1}
      totalSteps={onboardingSteps.length}
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Your AI assistant is ready to go! You can always configure advanced settings later.
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};