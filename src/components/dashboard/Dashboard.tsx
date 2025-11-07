import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SkeletonCard, SkeletonText } from '../ui/LoadingSpinner';
import { useAppStore } from '../../stores/useAppStore';
import { FeatureErrorBoundary } from '../error/FeatureErrorBoundary';
import {
  MessageSquare,
  User,
  Shield,
  Heart,
  AlertCircle,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, setCurrentView, chat } = useAppStore();
  const isLoading = !user?.profile;

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

  const recentActivity = chat.messages
    .filter((msg) => msg.type === 'user')
    .slice(-3)
    .map((msg) => ({
      type: 'chat',
      title: `You: "${msg.content.substring(0, 30)}..."`,
      time: new Date(msg.timestamp).toLocaleTimeString(),
      icon: MessageSquare,
    }));

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Loading Header */}
          <div className="space-y-4">
            <SkeletonText lines={2} width="lg" />
            <SkeletonText lines={1} width="md" />
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} className="h-20" />
            ))}
          </div>

          {/* Loading Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <SkeletonText lines={1} width="md" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={index} className="h-24" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <SkeletonText lines={1} width="md" />
              <SkeletonCard className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 font-sans scrollbar-thin">
      <motion.div
        className="max-w-7xl mx-auto space-y-6 font-sans"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div
          className="relative rounded-2xl p-8 lg:p-10 text-white bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden"
          variants={itemVariants}
        >
          {/* Subtle pattern overlay for trust */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          <div className="relative z-10">
          <motion.div
            className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-4">
              <h1 className="text-h1 font-semibold">
                <span className="block text-h1 font-semibold tracking-tight">Good morning,</span>
                <span className="block tracking-tight mt-1">
                  <span>{user.profile?.firstName || 'there'}</span>
                  <span className="ml-1">!</span>
                </span>
              </h1>
              <p className="text-lg text-white/90 max-w-xl">
                Let's continue building your personalized Medicare profile with trusted AI guidance.
              </p>
            </div>
            <motion.div
              className="hidden md:flex"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.4
              }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-elevated">
                <Heart className="h-10 w-10 text-white" fill="currentColor" />
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              onClick={handleStartChat}
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 font-semibold hover:bg-gray-50 shadow-elevated"
            >
              Start a conversation
            </Button>
          </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans"
          role="region"
          aria-label="Dashboard statistics"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  padding="md"
                  variant="elevated"
                  className="hover:shadow-elevated transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-subtle`}
                      role="img"
                      aria-label={stat.label}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Icon className={`w-7 h-7 ${stat.color}`} aria-hidden="true" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <motion.p
                        className="text-2xl font-bold text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-sm text-gray-600 mt-1 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <h2 className="text-h2 font-semibold text-gray-900 mb-5">Quick Actions</h2>
            <div className="grid gap-4" role="list">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card
                      padding="md"
                      variant="default"
                      className="cursor-pointer group hover:border-primary-200 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
                      onClick={action.action}
                      role="listitem"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-14 h-14 ${action.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-subtle group-hover:shadow-soft transition-shadow`}
                          role="img"
                          aria-label={action.title}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          <Icon className={`w-7 h-7 ${action.color}`} aria-hidden="true" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <motion.div
                          className="text-gray-400 flex-shrink-0 group-hover:text-primary-600 transition-colors"
                          aria-hidden="true"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity & Profile Reminder */}
          <motion.div variants={itemVariants}>
            {recentActivity.length > 0 && (
              <div className="mb-6">
                <h2 className="text-h2 font-semibold text-gray-900 mb-5">Recent Activity</h2>
                <Card padding="md" variant="default">
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 group"
                          onClick={() => setCurrentView('chat')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setCurrentView('chat');
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`View chat: ${activity.title}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors"
                            role="img"
                            aria-hidden="true"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Icon className="w-4 h-4 text-primary-600" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* Profile Completion Reminder */}
            {(user.profile?.profileCompleteness || 0) < 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card padding="md" variant="subtle" className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-900 mb-1">
                        Complete Your Profile
                      </h3>
                      <p className="text-sm text-amber-800/80 mb-4">
                        Add more health information to get better AI recommendations.
                      </p>
                      <Button
                        size="sm"
                        onClick={handleViewProfile}
                        variant="primary"
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        Continue Setup
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
          </div>
      </motion.div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { setCurrentView } = useAppStore();
  return (
    <FeatureErrorBoundary feature="dashboard" navigate={() => setCurrentView('dashboard')}>
      <DashboardContent />
    </FeatureErrorBoundary>
  );
};
