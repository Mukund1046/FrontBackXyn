import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Welcome } from './Welcome';
import { AccountSetup } from './AccountSetup';
import { HealthAssessment } from './HealthAssessment';
import { ApiSetup } from './ApiSetup';
import { Complete } from './Complete';

export const OnboardingFlow: React.FC = () => {
  const { currentStep, onboardingSteps } = useAppStore();

  const renderStep = () => {
    const step = onboardingSteps[currentStep];
    if (!step) return <Complete />;

    switch (step.component) {
      case 'Welcome':
        return <Welcome />;
      case 'AccountSetup':
        return <AccountSetup />;
      case 'HealthAssessment':
        return <HealthAssessment />;
      case 'ApiSetup':
        return <ApiSetup />;
      case 'Complete':
        return <Complete />;
      default:
        return <Welcome />;
    }
  };

  return <>{renderStep()}</>;
};