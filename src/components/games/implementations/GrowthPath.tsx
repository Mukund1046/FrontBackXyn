import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

interface NumberPosition {
  number: number;
  x: number;
  y: number;
  clicked: boolean;
}

export const GrowthPath: React.FC = () => {
  const [numbers, setNumbers] = useState<NumberPosition[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const numbersCount = 5 + level;

  useEffect(() => {
    generateNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const generateNumbers = () => {
    const newNumbers: NumberPosition[] = [];
    for (let i = 1; i <= numbersCount; i++) {
      newNumbers.push({
        number: i,
        x: Math.random() * 70 + 10,
        y: Math.random() * 60 + 10,
        clicked: false,
      });
    }
    setNumbers(newNumbers);
    setCurrentNumber(1);
    setStartTime(null);
    setEndTime(null);
  };

  const handleNumberClick = (clickedNumber: number) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (clickedNumber === currentNumber) {
      setNumbers(numbers.map(n => 
        n.number === clickedNumber ? { ...n, clicked: true } : n
      ));
      
      if (currentNumber === numbersCount) {
        const finalTime = Date.now();
        setEndTime(finalTime);
        const duration = Math.floor((finalTime - (startTime || finalTime)) / 1000);
        
        if (level >= 5) {
          setGameOver(true);
          recordSession({
            gameType: 'growth_path',
            score: Math.max(0, 1000 - duration * 10),
            completedAt: new Date(),
            duration,
          });
        } else {
          setTimeout(() => {
            setLevel(level + 1);
          }, 1000);
        }
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    }
  };

  const elapsedTime = startTime && !endTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  if (gameOver) {
    const totalTime = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-6">
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
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900">All Levels Complete!</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Time</p>
              <p className="text-4xl font-bold text-primary-600">{totalTime}s</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Final Score</p>
              <p className="text-2xl font-bold text-blue-600">{Math.max(0, 1000 - totalTime * 10)}</p>
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

  const isLevelComplete = currentNumber > numbersCount;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
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
              <span className="text-sm text-gray-600 mr-2">Level:</span>
              <span className="text-xl font-bold text-cyan-600">{level}/5</span>
            </div>
            {startTime && (
              <div className="bg-white px-4 py-2 rounded-full shadow-md">
                <span className="text-sm text-gray-600 mr-2">Time:</span>
                <span className="text-xl font-bold text-primary-600">{elapsedTime}s</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Growth Path</h2>
            <p className="text-lg text-gray-600">
              {isLevelComplete ? 'Level Complete!' : `Click the numbers in order: Next is ${currentNumber}`}
            </p>
          </div>

          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: '500px' }}>
            {numbers.map((num) => (
              <motion.button
                key={num.number}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: num.number * 0.05 }}
                onClick={() => handleNumberClick(num.number)}
                disabled={num.clicked}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                  num.clicked
                    ? 'bg-green-500 text-white shadow-lg'
                    : num.number === currentNumber
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-xl animate-pulse'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                style={{ left: `${num.x}%`, top: `${num.y}%` }}
              >
                {num.number}
              </motion.button>
            ))}

            {numbers.map((num, idx) => {
              if (idx === 0 || !num.clicked) return null;
              const prevNum = numbers[idx - 1];
              if (!prevNum.clicked) return null;

              return (
                <svg
                  key={`line-${num.number}`}
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                >
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                    x1={`${prevNum.x + 4}%`}
                    y1={`${prevNum.y + 5}%`}
                    x2={`${num.x + 4}%`}
                    y2={`${num.y + 5}%`}
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />
                </svg>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
