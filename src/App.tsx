import React from 'react';
import { useAppStore } from './stores/useAppStore';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { NotificationManager } from './components/notifications/NotificationManager';

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
      <NotificationManager />
      <MainLayout />
    </ErrorBoundary>
  );
}

export default App;