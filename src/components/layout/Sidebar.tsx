import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { cn } from '../../lib/utils';
import {
  MessageSquare,
  User,
  Shield,
  Settings,
  HelpCircle,
  Home,
  X,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    ui,
    user,
    toggleSidebar,
    setCurrentView,
    logout,
  } = useAppStore();

  const navigation = [
    { name: 'Dashboard', icon: Home, id: 'dashboard' },
    { name: 'Chat with AI', icon: MessageSquare, id: 'chat' },
    { name: 'My Profile', icon: User, id: 'profile' },
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
      {ui.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 font-sans',
          ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">X</span>
              </div>
              <span className="font-bold text-gray-900 tracking-[-0.6px]">Xyn.ai</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.profile?.firstName} {user.profile?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  Profile {user.profile?.profileCompleteness || 0}% complete
                </p>
              </div>
            </div>

            {/* Profile Completeness Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${user.profile?.profileCompleteness || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 font-sans">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = ui.currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-[-0.2px]">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 font-sans">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium tracking-[-0.2px]">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
