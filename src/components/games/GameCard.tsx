import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ChevronRight } from '../../icons/lucide-adapter';
import { Game } from '../../types/games';
import { useGamesStore } from '../../stores/useGamesStore';
import { useAppStore } from '../../stores/useAppStore';

interface Props {
  game: Game;
}

const difficultyConfig = {
  1: { color: 'text-green-600 bg-green-100', label: 'Easy' },
  2: { color: 'text-yellow-600 bg-yellow-100', label: 'Medium' },
  3: { color: 'text-red-600 bg-red-100', label: 'Hard' },
} as const;

export const GameCard: React.FC<Props> = ({ game }) => {
  const { setCurrentView } = useAppStore();
  const { favoriteGames, toggleFavorite } = useGamesStore();
  const isFavorite = favoriteGames.includes(game.game_type);
  const difficulty = difficultyConfig[game.difficulty];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(game.game_type);
  };

  const handlePlayClick = () => {
    setCurrentView(`game:${game.game_type}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePlayClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-xl hover:border-primary-200 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-blue-50/0 group-hover:from-primary-50/50 group-hover:to-blue-50/50 transition-all duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
              {game.title}
            </h3>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${difficulty.color}`}>
              {[...Array(game.difficulty)].map((_, i) => (
                <Star key={i} className="w-3 h-3" fill="currentColor" />
              ))}
              <span className="ml-1">{difficulty.label}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
              }`}
            />
          </motion.button>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full">
            {game.cognitive_domain}
          </span>
          <motion.div
            className="flex items-center gap-2 text-primary-600 group-hover:text-primary-700 transition-colors"
            whileHover={{ x: 2 }}
          >
            <span className="text-sm font-medium">Start</span>
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
