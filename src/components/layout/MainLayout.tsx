import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10">
          <TopBar />
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto scrollbar-thin" role="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={ui.currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Notification />
    </div>
  );
};
