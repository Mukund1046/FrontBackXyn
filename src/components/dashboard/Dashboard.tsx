import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../stores/useAppStore';
import {
  MessageSquare,
  User,
  Shield,
  TrendingUp,
  Calendar,
  Heart,
  AlertCircle,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, setCurrentView, chat } = useAppStore();

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const handleViewProfile = () => {
    setCurrentView('profile');
  };

  const stats = [
    {
      label: 'Profile Complete',
      value: `${user.profile?.profileCompleteness || 0}%`,
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Chat Messages',
      value: chat.messages.length.toString(),
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Health Conditions',
      value: user.profile?.healthConditions.length.toString() || '0',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Medications',
      value: user.profile?.medications.length.toString() || '0',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const quickActions = [
    {
      title: 'Chat with AI',
      description: 'Get personalized Medicare guidance',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      action: handleStartChat,
    },
    {
      title: 'Complete Profile',
      description: 'Add more health information',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      action: handleViewProfile,
    },
    {
      title: 'Find Plans',
      description: 'Explore Medicare options',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      action: () => setCurrentView('plans'),
    },
  ];

  const recentActivity = [
    {
      type: 'chat',
      title: 'Asked about Medicare Part D',
      time: '2 hours ago',
      icon: MessageSquare,
    },
    {
      type: 'profile',
      title: 'Updated medications list',
      time: '1 day ago',
      icon: User,
    },
    {
      type: 'system',
      title: 'Profile completeness increased',
      time: '2 days ago',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 font-sans">
        {/* Welcome Section */}
        <div
          className="rounded-2xl p-8 text-white bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets/b2ba2d7a34e5494f9b240da4d345e30f/714f045221884e13b5791391ab31695e')",
          }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <h1 className="text-[30px] leading-9 font-bold">
                <span className="block font-medium tracking-[-0.8px]">Good morning,</span>
                <span className="block tracking-[-1.2px]">
                  <span>{user.profile?.firstName}</span>
                  <span className="ml-1">!</span>
                </span>
              </h1>
              <p className="text-[18px] leading-7 tracking-[-0.2px] text-white">
                Let's continue building your personalized Medicare profile.
              </p>
            </div>
            <div className="hidden md:flex">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <Heart className="h-9 w-9 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleStartChat}
              variant="ghost"
              size="lg"
              className="bg-white text-black font-medium tracking-[-0.2px] hover:bg-gray-100 border border-transparent"
            >
              Start a conversation
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} padding="md">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} padding="md" className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <Card padding="md">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Profile Completion Reminder */}
            {(user.profile?.profileCompleteness || 0) < 100 && (
              <Card padding="md" className="mt-4 border-orange-200 bg-orange-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-orange-900">
                      Complete Your Profile
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Add more health information to get better AI recommendations.
                    </p>
                    <Button
                      size="sm"
                      onClick={handleViewProfile}
                      className="mt-3 bg-orange-600 hover:bg-orange-700"
                    >
                      Continue Setup
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
