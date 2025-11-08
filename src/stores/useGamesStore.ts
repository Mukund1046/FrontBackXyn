/**
 * Cognitive Games State Management Store
 * Tracks user progress, sessions, and preferences
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameSession } from '../types/games';

interface GamesState {
  sessions: GameSession[];
  currentStreak: number;
  totalPlayed: number;
  favoriteGames: string[];
  lastPlayedDate: string | null;
}

interface GamesActions {
  recordSession: (session: GameSession) => void;
  toggleFavorite: (gameType: string) => void;
  getStats: () => { totalPlayed: number; streak: number };
  getRecentSessions: (limit?: number) => GameSession[];
  calculateStreak: () => void;
}

export const useGamesStore = create<GamesState & GamesActions>()(
  persist(
    (set, get) => ({
      // State
      sessions: [],
      currentStreak: 0,
      totalPlayed: 0,
      favoriteGames: [],
      lastPlayedDate: null,

      // Actions
      recordSession: (session: GameSession) => {
        const state = get();
        const today = new Date().toDateString();
        
        set({
          sessions: [...state.sessions, session],
          totalPlayed: state.totalPlayed + 1,
          lastPlayedDate: today,
        });
        
        // Recalculate streak after recording
        get().calculateStreak();
      },

      toggleFavorite: (gameType: string) => {
        set((state) => ({
          favoriteGames: state.favoriteGames.includes(gameType)
            ? state.favoriteGames.filter((g) => g !== gameType)
            : [...state.favoriteGames, gameType],
        }));
      },

      getStats: () => {
        const state = get();
        return {
          totalPlayed: state.totalPlayed,
          streak: state.currentStreak,
        };
      },

      getRecentSessions: (limit = 10) => {
        const sessions = get().sessions;
        return sessions
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, limit);
      },

      calculateStreak: () => {
        const sessions = get().sessions;
        if (sessions.length === 0) {
          set({ currentStreak: 0 });
          return;
        }

        // Sort sessions by date descending
        const sortedSessions = [...sessions].sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const session of sortedSessions) {
          const sessionDate = new Date(session.completedAt);
          sessionDate.setHours(0, 0, 0, 0);

          const diffDays = Math.floor(
            (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === streak || (streak === 0 && diffDays === 0)) {
            streak = diffDays + 1;
            currentDate = sessionDate;
          } else if (diffDays > streak + 1) {
            break;
          }
        }

        set({ currentStreak: streak });
      },
    }),
    {
      name: 'cognitive-games-storage',
    }
  )
);
