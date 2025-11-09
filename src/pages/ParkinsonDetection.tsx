import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle } from 'lucide-react';
import { useParkinsonStore } from '../stores/useParkinsonStore';
import { SubjectSelector } from '../components/parkinsons/SubjectManagement/SubjectSelector';
import { TestSelector } from '../components/parkinsons/Tests/TestSelector';
import { VowelTest } from '../components/parkinsons/Tests/VowelTest/VowelTest';
import { SpeechTest } from '../components/parkinsons/Tests/SpeechTest/SpeechTest';
import { DrawingTest } from '../components/parkinsons/Tests/DrawingTest/DrawingTest';
import { TappingTest } from '../components/parkinsons/Tests/TappingTest/TappingTest';

type TestType = 'vowel' | 'speech' | 'drawing' | 'tapping';

export const ParkinsonDetection: React.FC = () => {
  const { 
    subjects, 
    selectedSubject, 
    isLoading,
    error,
    loadSubjects,
    clearError
  } = useParkinsonStore();

  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-primary-100 rounded-xl">
            <Activity className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Parkinson's Disease Detection
            </h1>
            <p className="text-gray-600 mt-1">
              Multi-modal testing for early Parkinson's detection and monitoring
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Subject Selection */}
      <SubjectSelector />

      {/* Test Selection */}
      {selectedSubject && !selectedTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TestSelector 
            onSelectTest={setSelectedTest}
            selectedTest={selectedTest}
          />
        </motion.div>
      )}

      {/* Test Interface */}
      {selectedSubject && selectedTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <button
            onClick={() => setSelectedTest(null)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Test Selection</span>
          </button>

          {/* Render Selected Test */}
          {selectedTest === 'vowel' && <VowelTest />}
          {selectedTest === 'speech' && <SpeechTest />}
          {selectedTest === 'drawing' && <DrawingTest />}
          {selectedTest === 'tapping' && <TappingTest />}
        </motion.div>
      )}

      {/* Development Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4"
      >
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          🚧 Development Status
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Backend API integrated (subjects, health conditions, vowel test)</li>
          <li>✅ Zustand store created</li>
          <li>✅ API client configured</li>
          <li>🔄 Subject management UI (in progress)</li>
          <li>⏳ Test interfaces (vowel, speech, drawing, tapping)</li>
          <li>⏳ Results visualization</li>
        </ul>
      </motion.div>
    </div>
  );
};
