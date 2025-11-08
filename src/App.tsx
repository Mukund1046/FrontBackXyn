import React from 'react';
import { useAppStore } from './stores/useAppStore';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/error/ErrorBoundary';

import { Auth } from './components/auth/Auth';

import { useDocumentStore } from './stores/useDocumentStore';

function App() {
  const { user } = useAppStore();
  const { loadDocuments } = useDocumentStore();

  React.useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  if (!user.isAuthenticated) {
    return (
      <ErrorBoundary>
        <Auth />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <MainLayout />
    </ErrorBoundary>
  );
}

export default App;