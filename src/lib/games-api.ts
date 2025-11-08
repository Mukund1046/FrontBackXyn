/**
 * Cognitive Games API Client
 * Handles communication with the backend games endpoints
 */
import { Game, GameCategory } from '../types/games';

const API_BASE = 'http://localhost:8000/api/games';

export const gamesApi = {
  /**
   * Get all games or filter by category
   */
  getCatalog: async (category?: string): Promise<GameCategory> => {
    try {
      const url = category ? `${API_BASE}/catalog?category=${category}` : `${API_BASE}/catalog`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch games catalog:', error);
      throw error;
    }
  },

  /**
   * Get all categories and stats
   */
  getCategories: async (): Promise<{
    categories: string[];
    total_games: number;
    games_per_category: Record<string, number>;
  }> => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  /**
   * Get a specific game by type
   */
  getGameByType: async (gameType: string): Promise<Game & { category: string }> => {
    try {
      const res = await fetch(`${API_BASE}/game/${gameType}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error(`Failed to fetch game ${gameType}:`, error);
      throw error;
    }
  },

  /**
   * Get recommended games based on conditions
   */
  getRecommended: async (
    conditions?: string[],
    limit = 5
  ): Promise<(Game & { category: string; match_score: number })[]> => {
    try {
      const conditionsParam = conditions ? `?conditions=${conditions.join(',')}` : '';
      const res = await fetch(`${API_BASE}/recommended${conditionsParam}&limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  },
};
