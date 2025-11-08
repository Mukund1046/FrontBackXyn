import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW'] as const;
type ColorName = typeof COLORS[number];

const colorMap: Record<ColorName, string> = {
  RED: 'text-red-500',
  BLUE: 'text-blue-500',
  GREEN: 'text-green-500',
  YELLOW: 'text-yellow-400',
};

export const StroopTest: React.FC = () => {
  const [word, setWord] = useState<ColorName>('RED');
  const [inkColor, setInkColor] = useState<ColorName>('RED');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const maxRounds = 20;

  useEffect(() => {
    generateNewTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewTest = () => {
    if (round >= maxRounds) {
      setGameOver(true);
      recordSession({
        gameType: 'stroop_test',
        score,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    const newWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newInkColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setWord(newWord);
    setInkColor(newInkColor);
    setRound(round + 1);
    setFeedback(null);
  };

  const handleAnswer = (answer: ColorName) => {
    const isCorrect = answer === inkColor;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(score + 10);
    }

    setTimeout(generateNewTest, 600);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-900">Test Complete!</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary-600">{score}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round((score / (maxRounds * 10)) * 100)}%</p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
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
              <span className="text-sm text-gray-600 mr-2">Round:</span>
              <span className="text-xl font-bold text-purple-600">{round}/{maxRounds}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600 mr-2">Score:</span>
              <span className="text-xl font-bold text-primary-600">{score}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Stroop Test</h2>
            <p className="text-lg text-gray-600">Select the <span className="font-bold">INK COLOR</span>, not the word!</p>
          </div>

          <motion.div
            key={round}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 relative"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className={`text-8xl font-bold ${colorMap[inkColor]}`}
              >
                {word}
              </motion.div>
            </div>

            {feedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                  feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {feedback === 'correct' ? '✓' : '✗'}
              </motion.div>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleAnswer(color)}
                disabled={feedback !== null}
                className={`py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${colorMap[color]} border-4 ${colorMap[color].replace('text-', 'border-')} bg-white hover:scale-105`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
