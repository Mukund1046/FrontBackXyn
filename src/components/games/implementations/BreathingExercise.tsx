import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

type Phase = 'inhale' | 'hold' | 'exhale';

export const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  useEffect(() => {
    if (cycle >= 5) {
      setIsComplete(true);
      recordSession({
        gameType: 'breathing_exercise',
        score: 5,
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
      return;
    }

    const timer = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        
        // Phase transitions
        if (phase === 'inhale') {
          setPhase('hold');
          return 4;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 6;
        } else {
          setCycle((prev) => prev + 1);
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, cycle, recordSession, startTime]);

  const phaseConfig: Record<Phase, { text: string; color: string; scale: number; instruction: string }> = {
    inhale: { 
      text: 'Breathe In', 
      color: 'from-blue-400 to-blue-600', 
      scale: 1.5,
      instruction: 'Slowly breathe in through your nose'
    },
    hold: { 
      text: 'Hold', 
      color: 'from-purple-400 to-purple-600', 
      scale: 1.5,
      instruction: 'Hold your breath gently'
    },
    exhale: { 
      text: 'Breathe Out', 
      color: 'from-green-400 to-green-600', 
      scale: 0.8,
      instruction: 'Slowly breathe out through your mouth'
    },
  };

  const config = phaseConfig[phase];

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50">
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
          
          <h2 className="text-3xl font-bold text-gray-900">Session Complete!</h2>
          <p className="text-gray-600 text-lg">
            You completed 5 breathing cycles.<br />
            Great work on taking time for mindfulness!
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => setCurrentView('cognitive-games')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-12 max-w-2xl">
          {/* Progress */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Cycle {cycle + 1} of 5</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((cycle) / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Breathing Circle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.div
                animate={{ scale: config.scale }}
                transition={{ duration: count, ease: "linear" }}
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${config.color} shadow-2xl mx-auto relative`}
              >
                <div className="absolute inset-0 rounded-full bg-white/20" />
                <div className="absolute inset-4 rounded-full bg-white/10" />
              </motion.div>
              
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-gray-900">{config.text}</h2>
                <p className="text-lg text-gray-600">{config.instruction}</p>
                <p className="text-7xl font-bold text-primary-600">{count}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
