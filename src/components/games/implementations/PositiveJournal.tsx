import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useGamesStore } from '../../../stores/useGamesStore';
import { useAppStore } from '../../../stores/useAppStore';

export const PositiveJournal: React.FC = () => {
  const [entries, setEntries] = useState(['', '', '']);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const { setCurrentView } = useAppStore();
  const { recordSession } = useGamesStore();

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleSubmit = () => {
    const filledEntries = entries.filter(e => e.trim().length > 0).length;
    setIsComplete(true);
    recordSession({
      gameType: 'journaling',
      score: filledEntries,
      completedAt: new Date(),
      duration: Math.floor((Date.now() - startTime) / 1000),
    });
  };

  const allFilled = entries.every(e => e.trim().length > 10);

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
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
            className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-12 h-12 text-amber-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900">Beautiful! ✨</h2>
          <p className="text-gray-600 text-lg">
            Thank you for taking time to reflect on positive moments.<br />
            Gratitude is a powerful tool for mental wellness.
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="p-6">
        <button
          onClick={() => setCurrentView('cognitive-games')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-500" />
              <h2 className="text-4xl font-bold text-gray-900">Positive Memory Journal</h2>
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-lg text-gray-600">
              Think of a small, positive event from your day or week.<br />
              Write down three specific details that made you feel good.
            </p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 space-y-6"
          >
            {entries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  Detail {index + 1}
                </label>
                <textarea
                  value={entry}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  placeholder="What made this moment special?"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none"
                  rows={3}
                />
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!allFilled}
              className={`w-full py-4 rounded-xl font-medium text-lg shadow-lg transition-all ${
                allFilled
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {allFilled ? '✨ Complete Journal Entry' : 'Fill all fields to continue'}
            </motion.button>

            <div className="text-center text-sm text-gray-500 italic">
              "Gratitude turns what we have into enough." – Anonymous
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
