import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useGamesStore } from '../../stores/useGamesStore';
import { TrendingUp, Brain, Settings, Calendar } from '../../icons/lucide-adapter';

export const GamesAnalytics: React.FC = () => {
  const { sessions, currentStreak, totalPlayed } = useGamesStore();

  // Process data for timeline (last 7 days)
  const timelineData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const daySessions = sessions.filter((s) => {
        try {
          const sessionDate = new Date(s.timestamp);
          if (isNaN(sessionDate.getTime())) return false;
          return sessionDate.toISOString().split('T')[0] === date;
        } catch {
          return false;
        }
      });
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        games: daySessions.length,
        avgScore: daySessions.length > 0
          ? Math.round(daySessions.reduce((sum, s) => sum + s.score, 0) / daySessions.length)
          : 0,
      };
    });
  }, [sessions]);

  // Game performance by type
  const gamePerformance = useMemo(() => {
    const gameTypes = ['memory-sequence', 'echo_grove', 'task_switching', 'pattern-finder'];
    
    return gameTypes.map((type) => {
      const gameSessions = sessions.filter((s) => s.gameType === type);
      const avgScore = gameSessions.length > 0
        ? Math.round(gameSessions.reduce((sum, s) => sum + s.score, 0) / gameSessions.length)
        : 0;
      
      return {
        game: type.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        score: avgScore,
        played: gameSessions.length,
      };
    });
  }, [sessions]);

  // Cognitive skills radar data
  const cognitiveSkills = useMemo(() => {
    const skills = {
      Memory: sessions.filter((s) => s.gameType === 'memory-sequence').length * 10 + 50,
      Attention: sessions.filter((s) => s.gameType === 'task_switching').length * 10 + 50,
      'Pattern Recognition': sessions.filter((s) => s.gameType === 'pattern-finder').length * 10 + 50,
      'Audio Processing': sessions.filter((s) => s.gameType === 'echo_grove').length * 10 + 50,
      Flexibility: Math.min(currentStreak * 10 + 50, 100),
    };

    return Object.entries(skills).map(([skill, value]) => ({
      skill,
      value: Math.min(value, 100),
    }));
  }, [sessions, currentStreak]);

  // Monthly progress
  const monthlyProgress = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => {
      const monthSessions = sessions.filter((s) => {
        try {
          const sessionDate = new Date(s.timestamp);
          if (isNaN(sessionDate.getTime())) return false;
          return sessionDate.getMonth() === idx;
        } catch {
          return false;
        }
      });

      return {
        month,
        sessions: monthSessions.length,
        avgScore: monthSessions.length > 0
          ? Math.round(monthSessions.reduce((sum, s) => sum + s.score, 0) / monthSessions.length)
          : 0,
      };
    });
  }, [sessions]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-h1 font-bold text-text-primary tracking-tight">Games Analytics</h1>
            <p className="text-body text-text-secondary">Track your cognitive performance and progress</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white"
        >
          <Brain className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-label text-white/80">Total Games Played</p>
          <p className="text-display-sm font-bold mt-1 font-tabular">{totalPlayed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <Calendar className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-label text-white/80">Current Streak</p>
          <p className="text-display-sm font-bold mt-1 font-tabular">{currentStreak} days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white"
        >
          <Settings className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-label text-white/80">Avg Score</p>
          <p className="text-display-sm font-bold mt-1 font-tabular">
            {sessions.length > 0
              ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
              : 0}
          </p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-h3 font-semibold text-text-primary tracking-tight mb-4">
            7-Day Activity
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorGames" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="games"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorGames)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Game Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-h3 font-semibold text-text-primary tracking-tight mb-4">
            Average Scores by Game
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={gamePerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="game"
                stroke="#64748b"
                style={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="score" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cognitive Skills Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-h3 font-semibold text-text-primary tracking-tight mb-4">
            Cognitive Skills Profile
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={cognitiveSkills}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" style={{ fontSize: 11 }} stroke="#64748b" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: 10 }} stroke="#64748b" />
              <Radar
                name="Skill Level"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-h3 font-semibold text-text-primary tracking-tight mb-4">
            Monthly Progress
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sessions"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgScore"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6"
      >
        <h3 className="text-h3 font-semibold text-text-primary tracking-tight mb-3">
          📊 Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm text-text-secondary">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <p className="font-medium text-text-primary mb-1">🎯 Strengths</p>
            <p>
              {gamePerformance.length > 0
                ? `You excel at ${gamePerformance.sort((a, b) => b.score - a.score)[0].game} with an average score of ${gamePerformance[0].score}`
                : 'Play more games to identify your strengths!'}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <p className="font-medium text-text-primary mb-1">📈 Growth Area</p>
            <p>
              {gamePerformance.length > 0
                ? `Focus on ${gamePerformance.sort((a, b) => a.score - b.score)[0].game} to improve cognitive flexibility`
                : 'Play different games to see growth opportunities!'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
