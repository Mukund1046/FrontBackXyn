/**
 * Cognitive Games Main Page
 * Displays game library with categories and user stats
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Star, CheckCircle, TrendingUp, Grid } from '../icons/lucide-adapter';
import { gamesApi } from '../lib/games-api';
import { GameCategory } from '../types/games';
import { GameGrid } from '../components/games/GameGrid';
import { StatsCard } from '../components/games/StatsCard';
import { GamesAnalytics } from '../components/games/GamesAnalytics';
import { useGamesStore } from '../stores/useGamesStore';
import { FeatureErrorBoundary } from '../components/error/FeatureErrorBoundary';

const CognitiveGamesContent: React.FC = () => {
  const [games, setGames] = useState<GameCategory>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'games' | 'analytics'>('games');
  const { getStats } = useGamesStore();
  const stats = getStats();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await gamesApi.getCatalog();
        setGames(data);
      } catch (err) {
        console.error('Error loading games:', err);
        setError('Failed to load games. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-gray-600 tracking-[-0.3px]">Loading cognitive games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Unable to Load Games</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalGames = Object.values(games).reduce((sum, categoryGames) => sum + categoryGames.length, 0);

  // Show analytics if in analytics mode
  if (viewMode === 'analytics') {
    return (
      <div className="relative">
        {/* Toggle Button */}
        <div className="absolute top-6 right-6 z-10">
          <motion.button
            onClick={() => setViewMode('games')}
            className="flex items-center gap-2 px-4 py-2 bg-white shadow-lg rounded-full border border-gray-200 hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid className="w-5 h-5 text-primary-600" />
            <span className="text-label font-semibold text-text-primary">View Games</span>
          </motion.button>
        </div>
        <GamesAnalytics />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.6px] text-gray-900">Cognitive Therapy Games</h1>
              <p className="text-gray-600 tracking-[-0.3px]">Evidence-based activities to support mental wellness</p>
            </div>
          </div>
          
          {/* Toggle Button */}
          <motion.button
            onClick={() => setViewMode('analytics')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg rounded-full hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-label font-semibold">View Analytics</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatsCard
          icon={CheckCircle}
          label="Activities Completed"
          value={stats.totalPlayed}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Star}
          label="Current Streak"
          value={`${stats.streak} ${stats.streak === 1 ? 'day' : 'days'}`}
          gradient="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Heart}
          label="Available Activities"
          value={totalGames}
          gradient="from-orange-500 to-red-500"
        />
      </motion.div>

      {/* Game Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-8"
      >
        {Object.entries(games).map(([category, categoryGames], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <GameGrid category={category} games={categoryGames} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {totalGames === 0 && (
        <div className="text-center py-12 space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Brain className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No Games Available</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Check back soon for cognitive therapy activities designed to support your mental wellness journey.
          </p>
        </div>
      )}
    </div>
  );
};

export const CognitiveGames: React.FC = () => (
  <FeatureErrorBoundary feature="cognitive-games">
    <CognitiveGamesContent />
  </FeatureErrorBoundary>
);
