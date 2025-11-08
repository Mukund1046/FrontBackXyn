/**
 * Cognitive Games Type Definitions
 */

export interface GameMechanic {
  step_number: number;
  instruction: string;
  duration_seconds?: number;
}

export interface Game {
  title: string;
  description: string;
  game_type: string;
  cognitive_domain: string;
  mechanics_list: GameMechanic[];
  scoring_rules: string;
  difficulty: 1 | 2 | 3;
  category?: string;
}

export interface GameCategory {
  [category: string]: Game[];
}

export interface GameSession {
  gameType: string;
  score: number;
  completedAt: Date;
  duration: number;
}

export interface GameStats {
  totalPlayed: number;
  streak: number;
  favoriteGames: string[];
  recentSessions: GameSession[];
}
