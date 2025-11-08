import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

export const TargetTracker: React.FC = () => {
  const [cupWithStar, setCupWithStar] = useState(1);
  const [shuffling, setShuffling] = useState(false);
  const [showStar, setShowStar] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [shuffleCount, setShuffleCount] = useState(0);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  useEffect(() => {
    startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const startRound = async () => {
    const starPosition = Math.floor(Math.random() * 3) + 1;
    setCupWithStar(starPosition);
    setShowStar(true);
    setFeedback(null);
    setShuffleCount(0);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowStar(false);

    await new Promise(resolve => setTimeout(resolve, 500));
    await shuffleCups();
  };

  const shuffleCups = async () => {
    setShuffling(true);
    const shuffles = 5 + level * 2;

    for (let i = 0; i < shuffles; i++) {
      await new Promise(resolve => setTimeout(resolve, 400 - level * 20));
      const positions = [1, 2, 3];
      const newPositions = [...positions].sort(() => Math.random() - 0.5);
      const newStarPosition = newPositions.indexOf(cupWithStar) + 1;
      setCupWithStar(newStarPosition);
      setShuffleCount(i + 1);
    }

    setShuffling(false);
  };

  const handleCupClick = (cupNumber: number) => {
    if (shuffling) return;

    const isCorrect = cupNumber === cupWithStar;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowStar(true);

    if (isCorrect) {
      setScore(score + level * 10);
      setTimeout(() => {
        if (level >= 10) {
          setGameOver(true);
          recordSession({
            gameType: 'target_tracker',
            score,
            completedAt: new Date(),
            duration: Math.floor((Date.now() - startTime) / 1000),
          });
        } else {
          setLevel(level + 1);
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setGameOver(true);
        recordSession({
          gameType: 'target_tracker',
          score,
          completedAt: new Date(),
          duration: Math.floor((Date.now() - startTime) / 1000),
        });
      }, 2000);
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6">
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
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Level Reached</p>
              <p className="text-2xl font-bold text-blue-600">{level}</p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
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
              <span className="text-xl font-bold text-purple-600">{level}/10</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Score:</span>
              <span className="text-xl font-bold text-primary-600">{score}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Target Tracker</h2>
            <p className="text-lg text-gray-600">
              {shuffling ? `Shuffling... (${shuffleCount})` : feedback ? (feedback === 'correct' ? 'Correct!' : 'Wrong cup!') : 'Which cup has the star?'}
            </p>
          </div>

          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((cupNumber) => (
              <motion.button
                key={cupNumber}
                onClick={() => handleCupClick(cupNumber)}
                disabled={shuffling || feedback !== null}
                animate={shuffling ? { 
                  x: [0, (cupNumber - 2) * 20, 0],
                  rotate: [0, cupNumber * 5, 0]
                } : {}}
                whileHover={!shuffling && !feedback ? { scale: 1.05 } : {}}
                whileTap={!shuffling && !feedback ? { scale: 0.95 } : {}}
                className="relative"
              >
                <div className={`w-32 h-40 bg-gradient-to-b from-orange-400 to-orange-600 rounded-t-full shadow-2xl relative ${
                  feedback && cupNumber === cupWithStar ? (feedback === 'correct' ? 'ring-4 ring-green-400' : 'ring-4 ring-red-400') : ''
                }`}>
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-orange-700 rounded-b-lg" />
                  
                  <AnimatePresence>
                    {showStar && cupNumber === cupWithStar && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="text-center mt-2 text-gray-600 font-medium">Cup {cupNumber}</div>
              </motion.button>
            ))}
          </div>

          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-center text-2xl font-bold ${
                feedback === 'correct' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {feedback === 'correct' ? '🎉 Well done!' : '😔 Better luck next time!'}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
