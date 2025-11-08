import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smile, Frown, Angry, Meh, Laugh, Heart } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const EMOTIONS = [
  { name: 'Happy', icon: Smile, color: 'from-yellow-400 to-orange-400', description: '😊' },
  { name: 'Sad', icon: Frown, color: 'from-blue-400 to-blue-600', description: '😢' },
  { name: 'Angry', icon: Angry, color: 'from-red-400 to-red-600', description: '😠' },
  { name: 'Neutral', icon: Meh, color: 'from-gray-400 to-gray-600', description: '😐' },
  { name: 'Excited', icon: Laugh, color: 'from-pink-400 to-purple-400', description: '🤩' },
  { name: 'Love', icon: Heart, color: 'from-rose-400 to-pink-600', description: '😍' },
] as const;

export const EmotionExplorer: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState(EMOTIONS[0]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const maxRounds = 12;

  useEffect(() => {
    generateNewEmotion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewEmotion = () => {
    if (round >= maxRounds) {
      setGameOver(true);
      recordSession({
        gameType: 'social_cognition',
        score,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    const randomEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    setCurrentEmotion(randomEmotion);
    setRound(round + 1);
    setFeedback(null);
    setShowHint(false);
  };

  const handleAnswer = (emotionName: string) => {
    const isCorrect = emotionName === currentEmotion.name;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(score + (showHint ? 5 : 10));
    }

    setTimeout(generateNewEmotion, 1500);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <h2 className="text-3xl font-bold text-gray-900">Great Work! 🎉</h2>
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
          <p className="text-gray-600">
            You're getting better at recognizing emotions!
          </p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
            <h2 className="text-3xl font-bold text-gray-900">Emotion Explorer</h2>
            <p className="text-lg text-gray-600">What emotion is being shown?</p>
          </div>

          <motion.div
            key={round}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 relative"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${currentEmotion.color} flex items-center justify-center shadow-2xl`}
              >
                <div className="text-8xl">{currentEmotion.description}</div>
              </motion.div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-600 italic"
                >
                  Hint: Look at the facial expression carefully
                </motion.div>
              )}
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

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {EMOTIONS.map((emotion) => {
                const EmotionIcon = emotion.icon;
                return (
                  <button
                    key={emotion.name}
                    onClick={() => handleAnswer(emotion.name)}
                    disabled={feedback !== null}
                    className={`py-4 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r ${emotion.color} text-white`}
                  >
                    <EmotionIcon className="w-5 h-5" />
                    {emotion.name}
                  </button>
                );
              })}
            </div>

            {!showHint && !feedback && (
              <button
                onClick={() => setShowHint(true)}
                className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                💡 Need a Hint?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
