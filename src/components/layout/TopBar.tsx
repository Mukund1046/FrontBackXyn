import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export const TopBar: React.FC = () => {
  const { toggleSidebar, ui, user } = useAppStore();

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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 font-sans">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex flex-wrap items-start gap-2">
          <h1 className="text-[20px] leading-7 font-semibold text-gray-900 tracking-[-0.4px]">
            {getViewTitle()}
          </h1>
          {user.profile && (
            <div className="flex items-baseline gap-1 text-gray-600 mt-1">
              <span className="text-[16px] leading-[22px] tracking-[-0.4px]">Welcome back,</span>
              <span className="text-[16px] leading-[22px] tracking-[-0.4px]">{user.profile.firstName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search (hidden on mobile) */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm">
          <Bell className="w-5 h-5" />
        </Button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">
            {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
          </span>
        </div>
      </div>
    </header>
  );
};
