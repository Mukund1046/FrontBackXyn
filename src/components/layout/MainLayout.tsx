import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAppStore } from '../../stores/useAppStore';
import { ChatInterface } from '../chat/ChatInterface';
import { Dashboard } from '../dashboard/Dashboard';
import { Profile } from '../profile/Profile';
import { Settings } from '../settings/Settings';
import { MedicarePlans } from '../plans/MedicarePlans';
import { HelpSupport } from '../help/HelpSupport';
import { Notification } from '../ui/Notification';
import { DocumentManager } from '../documents/DocumentManager';

export const MainLayout: React.FC = () => {
  const { ui } = useAppStore();

  const renderCurrentView = () => {
    switch (ui.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatInterface />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'plans':
        return <MedicarePlans />;
      case 'help':
        return <HelpSupport />;
      case 'documents':
        return <DocumentManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10">
          <TopBar />
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
      <Notification />
    </div>
  );
};
