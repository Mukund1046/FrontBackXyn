import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Circle, Square, Triangle } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const SHAPES = ['circle', 'square', 'triangle'] as const;
type ShapeType = typeof SHAPES[number];

interface Pattern {
  sequence: ShapeType[];
  missing: ShapeType;
}

export const PatternRecognition: React.FC = () => {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const maxRounds = 10;

  useEffect(() => {
    generatePattern();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePattern = () => {
    if (round >= maxRounds) {
      setGameOver(true);
      recordSession({
        gameType: 'pattern_recognition',
        score,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    const patternLength = 4 + Math.floor(round / 3);
    const sequence: ShapeType[] = [];
    
    for (let i = 0; i < patternLength; i++) {
      sequence.push(SHAPES[i % SHAPES.length]);
    }

    const missing = sequence[Math.floor(Math.random() * sequence.length)];
    setPattern({ sequence, missing });
    setRound(round + 1);
    setFeedback(null);
  };

  const handleAnswer = (answer: ShapeType) => {
    if (!pattern) return;

    const isCorrect = answer === pattern.missing;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(score + 10 + streak * 5);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setTimeout(generatePattern, 1000);
  };

  const ShapeIcon = ({ shape, size = 12 }: { shape: ShapeType; size?: number }) => {
    const className = `w-${size} h-${size}`;
    switch (shape) {
      case 'circle':
        return <Circle className={className} fill="currentColor" />;
      case 'square':
        return <Square className={className} fill="currentColor" />;
      case 'triangle':
        return <Triangle className={className} fill="currentColor" />;
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-900">Challenge Complete!</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary-600">{score}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Patterns Solved</p>
              <p className="text-2xl font-bold text-blue-600">{maxRounds}</p>
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

  if (!pattern) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
              <span className="text-xl font-bold text-indigo-600">{round}/{maxRounds}</span>
            </div>
            {streak > 0 && (
              <div className="bg-gradient-to-r from-orange-400 to-red-400 px-4 py-2 rounded-full shadow-md">
                <span className="text-sm text-white mr-2">🔥 Streak:</span>
                <span className="text-xl font-bold text-white">{streak}</span>
              </div>
            )}
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
            <h2 className="text-3xl font-bold text-gray-900">Pattern Recognition</h2>
            <p className="text-lg text-gray-600">What shape comes next in this pattern?</p>
          </div>

          <motion.div
            key={round}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              {pattern.sequence.map((shape, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg"
                >
                  <ShapeIcon shape={shape} />
                </div>
              ))}
              <div className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-4xl text-gray-400">
                ?
              </div>
            </div>

            {feedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-center text-2xl font-bold mb-4 ${
                  feedback === 'correct' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {feedback === 'correct' ? '✓ Correct!' : '✗ Try again next time'}
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {SHAPES.map((shape) => (
                <button
                  key={shape}
                  onClick={() => handleAnswer(shape)}
                  disabled={feedback !== null}
                  className="h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  <ShapeIcon shape={shape} />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
