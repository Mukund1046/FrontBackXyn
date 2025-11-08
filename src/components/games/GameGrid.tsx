import React from 'react';
import { Game } from '../../types/games';
import { GameCard } from './GameCard';

interface Props {
  category: string;
  games: Game[];
}

const categoryEmojis: Record<string, string> = {
  'Anxiety': '😌',
  'ADHD': '🎯',
  'Depression': '🌱',
  'Stress': '🧘',
  'General': '🧠',
  'Autism': '🤝',
};

export const GameGrid: React.FC<Props> = ({ category, games }) => {
  const emoji = categoryEmojis[category] || '🎮';
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
          <p className="text-sm text-gray-600">{games.length} {games.length === 1 ? 'activity' : 'activities'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard key={game.game_type} game={game} />
        ))}
      </div>
    </div>
  );
};
