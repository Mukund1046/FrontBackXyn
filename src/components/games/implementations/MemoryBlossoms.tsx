import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flower2 } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

interface Cell {
  id: number;
  hasFlower: boolean;
  revealed: boolean;
  clicked: boolean;
}

export const MemoryBlossoms: React.FC = () => {
  const [grid, setGrid] = useState<Cell[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const gridSize = 16; // 4x4 grid
  const flowersCount = 3 + level;

  useEffect(() => {
    startLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const startLevel = () => {
    const newGrid: Cell[] = [];
    const flowerPositions = new Set<number>();
    
    while (flowerPositions.size < flowersCount) {
      flowerPositions.add(Math.floor(Math.random() * gridSize));
    }

    for (let i = 0; i < gridSize; i++) {
      newGrid.push({
        id: i,
        hasFlower: flowerPositions.has(i),
        revealed: true,
        clicked: false,
      });
    }

    setGrid(newGrid);
    setPhase('memorize');
    setCorrectCount(0);
    setWrongCount(0);

    setTimeout(() => {
      setGrid(newGrid.map(cell => ({ ...cell, revealed: false })));
      setPhase('recall');
    }, 3000);
  };

  const handleCellClick = (index: number) => {
    if (phase !== 'recall' || grid[index].clicked) return;

    const newGrid = [...grid];
    newGrid[index].clicked = true;
    newGrid[index].revealed = true;
    setGrid(newGrid);

    if (newGrid[index].hasFlower) {
      setCorrectCount(correctCount + 1);
      
      if (correctCount + 1 === flowersCount) {
        setScore(score + level * 20);
        setPhase('result');
        
        setTimeout(() => {
          if (level >= 8) {
            setGameOver(true);
            recordSession({
              gameType: 'memory_blossoms',
              score,
              completedAt: new Date(),
              duration: Math.floor((Date.now() - startTime) / 1000),
            });
          } else {
            setLevel(level + 1);
          }
        }, 2000);
      }
    } else {
      setWrongCount(wrongCount + 1);
      
      if (wrongCount + 1 >= 3) {
        setGameOver(true);
        setPhase('result');
        recordSession({
          gameType: 'memory_blossoms',
          score,
          completedAt: new Date(),
          duration: Math.floor((Date.now() - startTime) / 1000),
        });
      }
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-900">Game Over!</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary-600">{score}</p>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Level Reached</p>
              <p className="text-2xl font-bold text-pink-600">{level}</p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Level:</span>
              <span className="text-xl font-bold text-pink-600">{level}/8</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Score:</span>
              <span className="text-xl font-bold text-primary-600">{score}</span>
            </div>
            {phase === 'recall' && (
              <div className="bg-white px-4 py-2 rounded-full shadow-md">
                <span className="text-sm text-red-600 mr-2">Wrong:</span>
                <span className="text-xl font-bold text-red-600">{wrongCount}/3</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Memory Blossoms</h2>
            <p className="text-lg font-medium text-primary-600">
              {phase === 'memorize' && 'Memorize the flower locations...'}
              {phase === 'recall' && `Find ${flowersCount} flowers!`}
              {phase === 'result' && (correctCount === flowersCount ? 'Perfect! 🌸' : 'Try Again!')}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 bg-white rounded-3xl p-6 shadow-2xl">
            {grid.map((cell, index) => (
              <motion.button
                key={cell.id}
                onClick={() => handleCellClick(index)}
                disabled={phase !== 'recall'}
                whileHover={phase === 'recall' && !cell.clicked ? { scale: 1.05 } : {}}
                whileTap={phase === 'recall' && !cell.clicked ? { scale: 0.95 } : {}}
                className={`aspect-square rounded-xl transition-all ${
                  cell.revealed && cell.hasFlower
                    ? 'bg-gradient-to-br from-pink-400 to-rose-500'
                    : cell.revealed && !cell.hasFlower
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                    : 'bg-gradient-to-br from-primary-200 to-purple-300 hover:from-primary-300 hover:to-purple-400'
                } flex items-center justify-center shadow-lg ${
                  phase === 'recall' && !cell.clicked ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <AnimatePresence>
                  {cell.revealed && cell.hasFlower && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                    >
                      <Flower2 className="w-10 h-10 text-white" fill="currentColor" />
                    </motion.div>
                  )}
                  {cell.revealed && !cell.hasFlower && cell.clicked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-2xl font-bold"
                    >
                      ✗
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600">Found: </span>
              <span className="font-bold text-pink-600">{correctCount}/{flowersCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
