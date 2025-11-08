import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Logo } from '../ui/Logo';
import { Tooltip } from '../ui/Tooltip';
import {
  MessageSquare,
  User,
  Shield,
  Settings,
  HelpCircle,
  Home,
  X,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  Brain,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    ui,
    user,
    toggleSidebar,
    toggleSidebarCollapse,
    setCurrentView,
    logout,
  } = useAppStore();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const navigation = [
    { name: 'Dashboard', icon: Home, id: 'dashboard', tooltip: 'View your health overview and quick stats' },
    { name: 'Chat with AI', icon: MessageSquare, id: 'chat', tooltip: 'Get instant medical guidance and advice' },
    { name: 'Cognitive Games', icon: Brain, id: 'cognitive-games', tooltip: 'Brain training and therapy exercises' },
    { name: 'My Profile', icon: User, id: 'profile', tooltip: 'Manage your health profile and information' },
    { name: 'Documents', icon: FileText, id: 'documents', tooltip: 'Upload and manage medical documents' },
    { name: 'Medicare Plans', icon: Shield, id: 'plans', tooltip: 'Explore and compare Medicare coverage options' },
    { name: 'Settings', icon: Settings, id: 'settings', tooltip: 'Customize your app preferences' },
    { name: 'Help', icon: HelpCircle, id: 'help', tooltip: 'Get support and contact assistance' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    // Close sidebar on mobile after clicking
    if (!isDesktop) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Overlay - only on mobile */}
      <AnimatePresence>
        {!isDesktop && ui.sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isDesktop 
            ? (ui.sidebarCollapsed ? 80 : 256) 
            : 256,
          x: !isDesktop && !ui.sidebarOpen ? -256 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-md border-r border-gray-200/80 font-sans shadow-xl',
          'lg:static lg:z-0 lg:bg-white lg:backdrop-blur-none lg:shadow-none'
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between p-5 border-b border-gray-200/80 font-sans min-h-[73px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {!ui.sidebarCollapsed && (
                <motion.div
                  key="logo-text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <Logo size="sm" showText />
                </motion.div>
              )}
              {ui.sidebarCollapsed && (
                <motion.div
                  key="logo-only"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="mx-auto"
                >
                  <Logo size="sm" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button (mobile only) */}
            {!isDesktop && (
              <Tooltip content="Close navigation menu" position="bottom">
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  aria-label="Close sidebar"
                  aria-expanded={ui.sidebarOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-gray-600" aria-hidden="true" />
                </motion.button>
              </Tooltip>
            )}

            {/* Collapse button (desktop only) */}
            {isDesktop && !ui.sidebarCollapsed && (
              <Tooltip content="Minimize sidebar to icons only" position="bottom">
                <motion.button
                  onClick={toggleSidebarCollapse}
                  className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  aria-label="Collapse sidebar"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" aria-hidden="true" />
                </motion.button>
              </Tooltip>
            )}
          </motion.div>

          {/* User Info */}
          <AnimatePresence>
            {!ui.sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-5 border-b border-gray-200/80 font-sans overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-11 h-11 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center border-2 border-primary-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <User className="w-5 h-5 text-primary-700" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.profile?.firstName} {user.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Profile {user.profile?.profileCompleteness || 0}% complete
                    </p>
                  </div>
                </div>

                {/* Profile Completeness Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${user.profile?.profileCompleteness || 0}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 font-sans overflow-y-auto" aria-label="Main navigation">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = ui.currentView === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    ui.sidebarCollapsed ? 'justify-center' : 'text-left',
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-primary-50/50 text-primary-700 shadow-subtle border border-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.name}
                  title={ui.sidebarCollapsed ? item.tooltip : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  whileHover={{ x: ui.sidebarCollapsed ? 0 : 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors flex-shrink-0",
                      isActive ? "text-primary-600" : "text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  <AnimatePresence>
                    {!ui.sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "text-sm font-medium tracking-[-0.2px] transition-colors whitespace-nowrap overflow-hidden",
                          isActive ? "text-primary-700 font-semibold" : "text-gray-700"
                        )}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !ui.sidebarCollapsed && (
                    <motion.div
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Expand button when collapsed (desktop only) */}
          {isDesktop && ui.sidebarCollapsed && (
            <motion.div
              className="p-4 border-t border-gray-200/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Tooltip content="Expand sidebar to full width" position="right">
                <motion.button
                  onClick={toggleSidebarCollapse}
                  className="w-full flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Expand sidebar"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5 text-gray-500" aria-hidden="true" />
                </motion.button>
              </Tooltip>
            </motion.div>
          )}

          {/* Footer */}
          <AnimatePresence>
            {!ui.sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-t border-gray-200/80 font-sans overflow-hidden"
              >
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:text-gray-900"
                  aria-label="Sign out"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5 text-gray-500" aria-hidden="true" />
                  <span className="text-sm font-medium tracking-[-0.2px]">Sign out</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout icon when collapsed */}
          {ui.sidebarCollapsed && (
            <motion.div
              className="p-4 border-t border-gray-200/80 font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Tooltip content="Sign out of your account" position="right">
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Sign out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5 text-gray-500" aria-hidden="true" />
                </motion.button>
              </Tooltip>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
};
