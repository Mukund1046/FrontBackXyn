import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const SHAPES = ['circle', 'square'] as const;
const COLORS = ['red', 'blue', 'green', 'yellow'] as const;
const NUMBERS = [1, 2, 3, 4] as const;

type Shape = typeof SHAPES[number];
type Color = typeof COLORS[number];
type GameNumber = typeof NUMBERS[number];

export const TaskSwitcher: React.FC = () => {
  const [shape, setShape] = useState<Shape>('circle');
  const [color, setColor] = useState<Color>('red');
  const [number, setNumber] = useState<GameNumber>(1);
  const [rule, setRule] = useState<'color' | 'number'>('color');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const maxRounds = 15;

  useEffect(() => {
    generateNewChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewChallenge = () => {
    if (round >= maxRounds) {
      setGameOver(true);
      recordSession({
        gameType: 'task_switching',
        score,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    setShape(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setNumber(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
    setRule(SHAPES[Math.floor(Math.random() * SHAPES.length)] === 'circle' ? 'color' : 'number');
    setRound(round + 1);
    setFeedback(null);
  };

  const handleAnswer = (answer: string) => {
    const correctAnswer = shape === 'circle' ? color : number.toString();
    const isCorrect = answer === correctAnswer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 10);
    }

    setTimeout(generateNewChallenge, 800);
  };

  const colorMap: Record<Color, string> = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
            <h2 className="text-3xl font-bold text-gray-900">Task Switcher</h2>
            <div className="text-lg font-medium text-primary-600">
              {shape === 'circle' ? (
                <>If <span className="font-bold">CIRCLE</span>, choose the <span className="font-bold">COLOR</span></>
              ) : (
                <>If <span className="font-bold">SQUARE</span>, choose the <span className="font-bold">NUMBER</span></>
              )}
            </div>
          </div>

          <motion.div
            key={round}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-48 h-48 mx-auto ${colorMap[color]} ${shape === 'circle' ? 'rounded-full' : 'rounded-3xl'} shadow-2xl flex items-center justify-center relative`}
          >
            {shape === 'square' && (
              <span className="text-white text-6xl font-bold">{number}</span>
            )}
            {feedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute inset-0 ${shape === 'circle' ? 'rounded-full' : 'rounded-3xl'} ${
                  feedback === 'correct' ? 'bg-green-500/80' : 'bg-red-500/80'
                } flex items-center justify-center text-white text-2xl font-bold`}
              >
                {feedback === 'correct' ? '✓' : '✗'}
              </motion.div>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {shape === 'circle' ? (
              COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleAnswer(c)}
                  disabled={feedback !== null}
                  className={`py-4 rounded-xl ${colorMap[c]} text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))
            ) : (
              NUMBERS.map((n) => (
                <button
                  key={n}
                  onClick={() => handleAnswer(n.toString())}
                  disabled={feedback !== null}
                  className="py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {n}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
