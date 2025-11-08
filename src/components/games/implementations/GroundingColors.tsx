import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

const TASKS = [
  { color: 'BLUE', count: 5, gradient: 'from-blue-400 to-blue-600' },
  { color: 'GREEN', count: 4, gradient: 'from-green-400 to-green-600' },
  { color: 'YELLOW', count: 3, gradient: 'from-yellow-400 to-yellow-600' },
];

export const GroundingColors: React.FC = () => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [found, setFound] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const currentTask = TASKS[currentTaskIndex];

  const handleFoundItem = () => {
    if (found + 1 >= currentTask.count) {
      if (currentTaskIndex + 1 >= TASKS.length) {
        setIsComplete(true);
        recordSession({
          gameType: 'grounding_technique',
          score: TASKS.reduce((sum, task) => sum + task.count, 0),
          completedAt: new Date(),
          duration: Math.floor((Date.now() - startTime) / 1000),
        });
      } else {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setFound(0);
      }
    } else {
      setFound(found + 1);
    }
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
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
          
          <h2 className="text-3xl font-bold text-gray-900">Well Done!</h2>
          <p className="text-gray-600 text-lg">
            You successfully completed the grounding exercise.<br />
            You're now more present and mindful!
          </p>
          
          <button
            onClick={() => setCurrentView('cognitive-games')}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Back to Games
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <div className="p-6">
        <button
          onClick={() => setCurrentView('cognitive-games')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Grounding Colors</h2>
            <p className="text-gray-600 text-lg">
              Look around you and find things of different colors
            </p>
          </div>

          <div className="space-y-4">
            {TASKS.map((task, idx) => (
              <div
                key={task.color}
                className={`p-4 rounded-xl ${
                  idx < currentTaskIndex
                    ? 'bg-green-100 opacity-60'
                    : idx === currentTaskIndex
                    ? 'bg-white shadow-lg'
                    : 'bg-gray-100 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700">
                    Find {task.count} things that are <span className={`font-bold bg-gradient-to-r ${task.gradient} bg-clip-text text-transparent`}>{task.color}</span>
                  </span>
                  {idx < currentTaskIndex && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <motion.div
            key={`${currentTaskIndex}-${found}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${currentTask.gradient} shadow-2xl flex items-center justify-center`}>
              <div className="text-white text-center">
                <div className="text-6xl font-bold">{found}</div>
                <div className="text-xl">of {currentTask.count}</div>
              </div>
            </div>

            <button
              onClick={handleFoundItem}
              className={`px-8 py-4 bg-gradient-to-r ${currentTask.gradient} text-white rounded-xl hover:shadow-xl transition-all font-medium text-lg`}
            >
              Found One!
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
