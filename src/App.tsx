import React from 'react';
import { useAppStore } from './stores/useAppStore';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  const { user } = useAppStore();

  if (!user.isAuthenticated || !user.onboardingComplete) {
    return <OnboardingFlow />;
  }

  return <MainLayout />;
}

export default App;