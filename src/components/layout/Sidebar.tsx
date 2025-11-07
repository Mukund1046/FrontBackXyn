import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';
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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    ui,
    user,
    toggleSidebar,
    setCurrentView,
    logout,
  } = useAppStore();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const navigation = [
    { name: 'Dashboard', icon: Home, id: 'dashboard' },
    { name: 'Chat with AI', icon: MessageSquare, id: 'chat' },
    { name: 'My Profile', icon: User, id: 'profile' },
    { name: 'Documents', icon: FileText, id: 'documents' },
    { name: 'Medicare Plans', icon: Shield, id: 'plans' },
    { name: 'Settings', icon: Settings, id: 'settings' },
    { name: 'Help', icon: HelpCircle, id: 'help' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {ui.sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (ui.sidebarOpen ? 0 : -100),
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200/80 lg:translate-x-0 lg:static lg:z-0 font-sans shadow-xl lg:shadow-none',
          'lg:bg-white lg:backdrop-blur-none'
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between p-5 border-b border-gray-200/80 font-sans"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-soft"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <span className="text-white font-bold text-sm">X</span>
              </motion.div>
              <span className="text-h4 font-semibold text-gray-900 tracking-tight">Xyn.ai</span>
            </div>
            <motion.button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label="Close sidebar"
              aria-expanded={ui.sidebarOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </motion.button>
          </motion.div>

          {/* User Info */}
          <motion.div
            className="p-5 border-b border-gray-200/80 font-sans"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 font-sans" aria-label="Main navigation">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = ui.currentView === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 text-left rounded-xl transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-primary-50/50 text-primary-700 shadow-subtle border border-primary-100'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary-600" : "text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  <span className={cn(
                    "text-sm font-medium tracking-[-0.2px] transition-colors",
                    isActive ? "text-primary-700 font-semibold" : "text-gray-700"
                  )}>
                    {item.name}
                  </span>
                  {isActive && (
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

          {/* Footer */}
          <motion.div
            className="p-4 border-t border-gray-200/80 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
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
        </div>
      </motion.aside>
    </>
  );
};
