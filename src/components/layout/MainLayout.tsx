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
import { CognitiveGames } from '../../pages/CognitiveGames';
import { GamePlayer } from '../games/GamePlayer';
import { ParkinsonDetection } from '../../pages/ParkinsonDetection';

export const MainLayout: React.FC = () => {
  const { ui } = useAppStore();
  
  // Ensure currentView is always defined
  const currentView = ui?.currentView || 'dashboard';

  const renderCurrentView = () => {
    // Check if it's a game view
    if (currentView.startsWith('game:')) {
      return <GamePlayer />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatInterface />;
      case 'cognitive-games':
        return <CognitiveGames />;
      case 'parkinsons':
        return <ParkinsonDetection />;
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

  const mainContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        className={currentView === 'chat' ? 'h-full' : ''}
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
  );

  return (
    <div className="h-screen bg-gray-50 flex font-sans">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-10 flex-shrink-0">
          <TopBar />
        </header>

        <main 
          id="main-content" 
          className={`flex-1 ${currentView === 'chat' ? 'overflow-hidden' : 'overflow-y-auto'}`} 
          role="main"
        >
          {mainContent}
        </main>
      </div>
      <Notification />
    </div>
  );
};
