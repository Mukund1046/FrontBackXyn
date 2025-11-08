import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, Moon, Sun, Cloud, Zap, Flower, Coffee } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const ICONS = [Heart, Star, Moon, Sun, Cloud, Zap, Flower, Coffee];

interface Card {
  id: number;
  icon: typeof ICONS[number];
  matched: boolean;
  flipped: boolean;
}

export const CardMatching: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const pairsCount = 8;

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cardPairs: Card[] = [];
    for (let i = 0; i < pairsCount; i++) {
      cardPairs.push(
        { id: i * 2, icon: ICONS[i], matched: false, flipped: false },
        { id: i * 2 + 1, icon: ICONS[i], matched: false, flipped: false }
      );
    }
    setCards(cardPairs.sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          if (newMatches === pairsCount) {
            setGameOver(true);
            recordSession({
              gameType: 'card_matching',
              score: Math.max(0, 1000 - moves * 10),
              completedAt: new Date(),
              duration: Math.floor((Date.now() - startTime) / 1000),
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  if (gameOver) {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-900">Perfect Match! 🎉</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Moves Made</p>
              <p className="text-4xl font-bold text-primary-600">{moves}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Time Taken</p>
              <p className="text-2xl font-bold text-blue-600">{duration}s</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Score</p>
              <p className="text-2xl font-bold text-green-600">{Math.max(0, 1000 - moves * 10)}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="w-full px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Back to Games
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Moves:</span>
              <span className="text-xl font-bold text-purple-600">{moves}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Matches:</span>
              <span className="text-xl font-bold text-primary-600">{matches}/{pairsCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Card Matching</h2>
            <p className="text-lg text-gray-600">Find all the matching pairs!</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  disabled={card.matched || card.flipped}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Card Back */}
                    <div
                      className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center ${
                        card.matched ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-primary-400 to-purple-600'
                      }`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {!card.flipped && !card.matched && (
                        <div className="text-white text-4xl">?</div>
                      )}
                    </div>
                    
                    {/* Card Front */}
                    <div
                      className="absolute inset-0 bg-white rounded-xl shadow-lg flex items-center justify-center"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <Icon className={`w-12 h-12 ${card.matched ? 'text-green-600' : 'text-primary-600'}`} />
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
