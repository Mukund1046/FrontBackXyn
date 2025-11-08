import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { useState } from 'react';
import { useSearch } from '../../hooks/useSearch';

export const TopBar: React.FC = () => {
  const { toggleSidebar, ui, user, setCurrentView } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useSearch(searchQuery);

  const getViewTitle = () => {
    switch (ui.currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'chat':
        return 'AI Assistant';
      case 'profile':
        return 'My Profile';
      case 'settings':
        return 'Settings';
      case 'plans':
        return 'Medicare Plans';
      case 'help':
        return 'Help & Support';
      default:
        return 'Dashboard';
    }
  };

  return (
    <motion.header
      className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 h-16 flex items-center justify-between px-4 lg:px-6 font-sans sticky top-0 z-50 shadow-subtle"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Tooltip content="Open navigation menu" position="bottom">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Toggle sidebar"
              aria-expanded={ui.sidebarOpen}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </Button>
          </motion.div>
        </Tooltip>

        <div className="flex items-center gap-4 min-w-0">
          <motion.h1
            className="text-h4 font-semibold text-gray-900 truncate"
            key={ui.currentView}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getViewTitle()}
          </motion.h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search (hidden on mobile) */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              id="topbar-search"
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search application"
              aria-autocomplete="list"
              aria-expanded={searchQuery && searchResults.length > 0}
              aria-controls="search-results"
            />
            <AnimatePresence>
              {searchQuery && searchResults.length > 0 && (
                <motion.div
                  id="search-results"
                  role="listbox"
                  className="absolute z-[60] w-full bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-elevated mt-2 p-2 max-h-60 overflow-y-auto scrollbar-thin"
                  aria-label="Search results"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      role="option"
                      tabIndex={0}
                      className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      onClick={() => {
                        if (result.action) {
                          result.action();
                        } else if (result.link) {
                          // Handle navigation for links if needed
                          console.log('Navigate to:', result.link);
                        }
                        setSearchQuery(''); // Clear search after selection
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (result.action) {
                            result.action();
                          }
                          setSearchQuery('');
                        }
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <p className="font-medium text-gray-900 text-sm">{result.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{result.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  className="absolute z-[60] w-full bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-elevated mt-2 p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notifications */}
        <Tooltip content="View notifications and updates" position="bottom">
          <Button
            variant="ghost"
            size="sm"
            aria-label="View notifications"
            aria-expanded="false"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
          </Button>
        </Tooltip>

        {/* Profile Avatar */}
        <Tooltip content="View your profile and account settings" position="bottom">
          <motion.div
            className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-subtle cursor-pointer"
            role="img"
            aria-label={`${user.profile?.firstName} ${user.profile?.lastName}'s profile avatar`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={() => setCurrentView('profile')}
          >
            <span className="text-white font-semibold text-sm" aria-hidden="true">
              {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
            </span>
          </motion.div>
        </Tooltip>
      </div>
    </motion.header>
  );
};
