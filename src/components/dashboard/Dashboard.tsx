import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SkeletonCard, SkeletonText } from '../ui/LoadingSpinner';
import { useAppStore } from '../../stores/useAppStore';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useGamesStore } from '../../stores/useGamesStore';
import { FeatureErrorBoundary } from '../error/FeatureErrorBoundary';
import {
  MessageSquare,
  User,
  Shield,
  Heart,
  FileText,
  Brain,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, setCurrentView, chat } = useAppStore();
  const { documents } = useDocumentStore();
  const { getRecentSessions } = useGamesStore();
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

  // Aggregate recent activity from multiple sources
  const recentActivity = useMemo(() => {
    const activities: Array<{
      type: 'chat' | 'game' | 'document' | 'profile';
      title: string;
      time: string;
      timestamp: number;
      icon: React.ComponentType<{ className?: string }>;
      action: () => void;
    }> = [];

    // Recent chat messages
    const chatActivities = chat.messages
      .filter((msg) => msg.type === 'user')
      .slice(-2)
      .map((msg) => ({
        type: 'chat' as const,
        title: `Chat: "${msg.content.substring(0, 35)}..."`,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: msg.timestamp,
        icon: MessageSquare,
        action: () => setCurrentView('chat'),
      }));

    // Recent games played
    const recentGames = getRecentSessions(2);
    const gameActivities = recentGames.map((session) => ({
      type: 'game' as const,
      title: `Played ${session.gameType.replace('-', ' ')} - Score: ${session.score}`,
      time: new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: session.timestamp,
      icon: Brain,
      action: () => setCurrentView('cognitive-games'),
    }));

    // Recently parsed documents
    const recentDocs = documents
      .filter((doc) => doc.isParsed && doc.parsedAt)
      .sort((a, b) => (b.parsedAt?.getTime() || 0) - (a.parsedAt?.getTime() || 0))
      .slice(0, 2)
      .map((doc) => ({
        type: 'document' as const,
        title: `Document parsed: ${doc.name.substring(0, 30)}${doc.name.length > 30 ? '...' : ''}`,
        time: doc.parsedAt ? new Date(doc.parsedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        timestamp: doc.parsedAt?.getTime() || Date.now(),
        icon: FileText,
        action: () => setCurrentView('documents'),
      }));

    // Profile updates (if completeness increased recently)
    const profileCompleteness = user.profile?.profileCompleteness || 0;
    if (profileCompleteness > 0 && profileCompleteness < 100) {
      activities.push({
        type: 'profile',
        title: `Profile ${profileCompleteness}% complete`,
        time: 'Recently',
        timestamp: Date.now(),
        icon: User,
        action: () => setCurrentView('profile'),
      });
    }

    // Combine all activities
    activities.push(...chatActivities, ...gameActivities, ...recentDocs);

    // Sort by timestamp (most recent first) and limit to 5 items
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [chat.messages, documents, getRecentSessions, user.profile?.profileCompleteness, setCurrentView]);

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
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-h1 font-medium text-text-inverse">
                <span className="block tracking-tighter">Welcome back,</span>
                <span className="block tracking-tight mt-1">
                  <span>{user.profile?.firstName || 'there'}</span>
                  <span className="ml-1">!</span>
                </span>
              </h1>
              <p className="text-body-lg font-regular text-white/90">
                Your trusted Medicare companion is here to help. Let's find the perfect plan for you.
              </p>
            </div>
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
              className="bg-white hover:bg-gray-50 shadow-elevated"
            >
              <span className="text-body font-semibold tracking-tight text-primary-700">
                Start a conversation
              </span>
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
                        className="text-h4 font-semibold tracking-tighter text-text-primary font-tabular"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-body tracking-tight font-medium text-text-secondary mt-1 truncate">{stat.label}</p>
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
            <h2 className="text-h2 font-semibold text-text-primary tracking-tighter mb-5">Quick Actions</h2>
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
                          <h3 className="text-h4 font-medium text-text-primary tracking-tight mb-1 truncate">{action.title}</h3>
                          <p className="text-body-sm text-text-secondary line-clamp-2">{action.description}</p>
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
                <h2 className="text-h2 font-semibold text-text-primary tracking-tight mb-5">Recent Activity</h2>
                <Card padding="md" variant="default">
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={`${activity.type}-${index}`}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 group"
                          onClick={activity.action}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              activity.action();
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`View ${activity.type}: ${activity.title}`}
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
                            <p className="text-body-sm font-medium text-text-primary truncate">
                              {activity.title}
                            </p>
                            <p className="text-caption text-text-tertiary mt-0.5">{activity.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </div>
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
