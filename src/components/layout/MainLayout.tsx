import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAppStore } from '../../stores/useAppStore';
import { ChatInterface } from '../chat/ChatInterface';
import { Dashboard } from '../dashboard/Dashboard';
import { Profile } from '../profile/Profile';
import { Settings } from '../settings/Settings';

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
        return <div className="p-6"><h1>Medicare Plans (Coming Soon)</h1></div>;
      case 'help':
        return <div className="p-6"><h1>Help & Support (Coming Soon)</h1></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        
        <main className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};