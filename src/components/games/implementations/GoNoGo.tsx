import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Circle, Square } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

type Signal = 'go' | 'nogo';

export const GoNoGo: React.FC = () => {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const nextRound = useCallback(() => {
    if (lives <= 0 || round >= 20) {
      setGameOver(true);
      recordSession({
        gameType: 'go_nogo',
        score,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    const isGo = Math.random() > 0.35;
    setSignal(isGo ? 'go' : 'nogo');
    setRound(round + 1);

    const timer = setTimeout(() => {
      if (isGo) {
        setLives(prev => Math.max(0, prev - 1));
      }
      nextRound();
    }, 1500);

    return () => clearTimeout(timer);
  }, [lives, round, score, startTime, recordSession]);

  useEffect(() => {
    const timer = setTimeout(nextRound, 1000);
    return () => clearTimeout(timer);
  }, [nextRound]);

  const handleTap = () => {
    if (!signal) return;

    if (signal === 'go') {
      setScore(score + 10);
    } else {
      setLives(prev => Math.max(0, prev - 1));
    }
    nextRound();
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-900">Game Complete!</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary-600">{score}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Rounds Completed</p>
              <p className="text-2xl font-bold text-blue-600">{round}</p>
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
    <div 
      className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
      onClick={handleTap}
    >
      <div className="p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('cognitive-games');
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Lives:</span>
              <span className="text-xl">{'❤️'.repeat(Math.max(0, lives))}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Score:</span>
              <span className="text-xl font-bold text-primary-600">{score}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-12 max-w-2xl">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Go/No-Go Challenge</h2>
            <p className="text-lg text-gray-600">Tap on GREEN circles, ignore RED squares!</p>
          </div>

          <AnimatePresence mode="wait">
            {signal && (
              <motion.div
                key={round}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {signal === 'go' ? (
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl flex items-center justify-center">
                    <Circle className="w-24 h-24 text-white" fill="currentColor" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gradient-to-br from-red-400 to-red-600 shadow-2xl flex items-center justify-center">
                    <Square className="w-24 h-24 text-white" fill="currentColor" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-sm text-gray-500">
            Round {round} of 20
          </div>
        </div>
      </div>
    </div>
  );
};
