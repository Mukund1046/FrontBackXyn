import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

type GameState = 'waiting' | 'ready' | 'clicked' | 'tooSoon' | 'complete';

export const ReactionTime: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [roundStartTime] = useState(Date.now());
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const maxAttempts = 5;

  useEffect(() => {
    if (gameState === 'waiting') {
      const delay = Math.random() * 3000 + 2000;
      const timer = setTimeout(() => {
        setGameState('ready');
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('tooSoon');
      setTimeout(() => {
        if (attempts.length + 1 >= maxAttempts) {
          setGameState('complete');
          const avgTime = attempts.reduce((a, b) => a + b, 0) / attempts.length;
          recordSession({
            gameType: 'reaction_time',
            score: Math.max(0, 1000 - Math.floor(avgTime)),
            completedAt: new Date(),
            duration: Math.floor((Date.now() - roundStartTime) / 1000),
          });
        } else {
          setGameState('waiting');
        }
      }, 1500);
    } else if (gameState === 'ready') {
      const rt = Date.now() - startTime;
      setReactionTime(rt);
      const newAttempts = [...attempts, rt];
      setAttempts(newAttempts);
      setGameState('clicked');
      
      setTimeout(() => {
        if (newAttempts.length >= maxAttempts) {
          setGameState('complete');
          const avgTime = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length;
          recordSession({
            gameType: 'reaction_time',
            score: Math.max(0, 1000 - Math.floor(avgTime)),
            completedAt: new Date(),
            duration: Math.floor((Date.now() - roundStartTime) / 1000),
          });
        } else {
          setGameState('waiting');
        }
      }, 1500);
    }
  };

  if (gameState === 'complete') {
    const avgTime = attempts.reduce((a, b) => a + b, 0) / attempts.length;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto"
          >
            <Zap className="w-12 h-12 text-yellow-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900">Test Complete!</h2>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Average Reaction Time</p>
              <p className="text-4xl font-bold text-orange-600">{Math.round(avgTime)} ms</p>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">All Attempts</p>
              <div className="flex flex-wrap justify-center gap-2">
                {attempts.map((time, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow">
                    {time} ms
                  </span>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-4">
              {avgTime < 200 ? '⚡ Lightning fast!' : 
               avgTime < 300 ? '🎯 Great reflexes!' : 
               avgTime < 400 ? '👍 Good job!' : 
               '💪 Keep practicing!'}
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
      className={`flex flex-col min-h-screen transition-all duration-300 cursor-pointer ${
        gameState === 'waiting' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
        gameState === 'ready' ? 'bg-gradient-to-br from-green-400 to-green-600' :
        gameState === 'clicked' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
        'bg-gradient-to-br from-red-500 to-red-700'
      }`}
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('cognitive-games');
            }}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white text-sm mr-2">Attempt:</span>
            <span className="text-white text-xl font-bold">{attempts.length + 1}/{maxAttempts}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          {gameState === 'waiting' && (
            <>
              <Zap className="w-24 h-24 mx-auto opacity-80" />
              <h2 className="text-5xl font-bold">Wait for Green...</h2>
              <p className="text-2xl opacity-90">Stay focused!</p>
            </>
          )}
          
          {gameState === 'ready' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Zap className="w-32 h-32 mx-auto" />
              </motion.div>
              <h2 className="text-6xl font-bold">CLICK NOW!</h2>
            </>
          )}
          
          {gameState === 'clicked' && (
            <>
              <Zap className="w-24 h-24 mx-auto" />
              <h2 className="text-4xl font-bold">Great!</h2>
              <div className="text-6xl font-bold">{reactionTime} ms</div>
            </>
          )}
          
          {gameState === 'tooSoon' && (
            <>
              <Zap className="w-24 h-24 mx-auto opacity-80" />
              <h2 className="text-5xl font-bold">Too Soon!</h2>
              <p className="text-2xl">Wait for the green screen</p>
            </>
          )}

          {attempts.length > 0 && gameState !== 'complete' && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-sm opacity-80 mb-2">Previous attempts:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {attempts.map((time, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {time} ms
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
