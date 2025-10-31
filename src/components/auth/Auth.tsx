import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { Login } from './Login';

export const Auth: React.FC = () => {
  const { user } = useAppStore();

  if (user.onboardingComplete) {
    return <Login />;
  }

  return <OnboardingFlow />;
};