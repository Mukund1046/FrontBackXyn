import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, XCircle } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const COLORS = ['red', 'blue', 'green', 'yellow'] as const;
type Color = typeof COLORS[number];

export const MemorySequence: React.FC = () => {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [playing, setPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [message, setMessage] = useState('Watch carefully...');
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewRound = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setUserSequence([]);
    setMessage('Watch carefully...');
    playSequence(newSequence);
  };

  const playSequence = async (seq: Color[]) => {
    setPlaying(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (const color of seq) {
      setActiveColor(color);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setPlaying(false);
    setMessage('Your turn!');
  };

  const handleColorClick = (color: Color) => {
    if (playing || gameOver) return;

    const newUserSeq = [...userSequence, color];
    setUserSequence(newUserSeq);

    // Flash the clicked color
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    // Check if correct
    if (sequence[newUserSeq.length - 1] !== color) {
      setGameOver(true);
      setMessage('Game Over!');
      recordSession({
        gameType: 'memory_sequence',
        score,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    // Check if sequence complete
    if (newUserSeq.length === sequence.length) {
      setScore(score + 1);
      setMessage('Correct! Next round...');
      setTimeout(startNewRound, 1000);
    }
  };

  const colorClasses: Record<Color, { bg: string; active: string }> = {
    red: { bg: 'bg-red-500', active: 'bg-red-600 shadow-2xl ring-4 ring-red-300' },
    blue: { bg: 'bg-blue-500', active: 'bg-blue-600 shadow-2xl ring-4 ring-blue-300' },
    green: { bg: 'bg-green-500', active: 'bg-green-600 shadow-2xl ring-4 ring-green-300' },
    yellow: { bg: 'bg-yellow-400', active: 'bg-yellow-500 shadow-2xl ring-4 ring-yellow-300' },
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto"
          >
            <XCircle className="w-12 h-12 text-orange-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900">Game Over!</h2>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary-600">{score}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Sequence Length</p>
              <p className="text-2xl font-bold text-blue-600">{sequence.length}</p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="bg-white px-4 py-2 rounded-full shadow-md">
            <span className="text-sm text-gray-600 mr-2">Score:</span>
            <span className="text-xl font-bold text-primary-600">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Title & Instructions */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Memory Sequence</h2>
            <motion.p
              key={message}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-lg font-medium ${
                message === 'Your turn!' ? 'text-green-600' : 
                message === 'Correct! Next round...' ? 'text-blue-600' :
                'text-primary-600'
              }`}
            >
              {message}
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{userSequence.length} / {sequence.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: sequence.length > 0 ? `${(userSequence.length / sequence.length) * 100}%` : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color) => {
              const classes = colorClasses[color];
              const isActive = activeColor === color;
              
              return (
                <motion.button
                  key={color}
                  whileHover={!playing ? { scale: 1.05 } : {}}
                  whileTap={!playing ? { scale: 0.95 } : {}}
                  onClick={() => handleColorClick(color)}
                  disabled={playing}
                  className={`
                    h-32 rounded-2xl transition-all duration-200
                    ${classes.bg}
                    ${isActive ? classes.active : 'opacity-80 hover:opacity-100'}
                    ${playing ? 'cursor-not-allowed' : 'cursor-pointer shadow-lg'}
                  `}
                />
              );
            })}
          </div>

          {/* Sequence Display (for reference during development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-center text-xs text-gray-400">
              Sequence length: {sequence.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
