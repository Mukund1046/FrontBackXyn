import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MessageSquare, Paintbrush, Hand } from 'lucide-react';

type TestType = 'vowel' | 'speech' | 'drawing' | 'tapping';

interface TestSelectorProps {
  onSelectTest: (testType: TestType) => void;
  selectedTest: TestType | null;
}

interface TestCard {
  id: TestType;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  duration: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const tests: TestCard[] = [
  {
    id: 'vowel',
    name: 'Vowel Test',
    icon: Mic,
    description: 'Sustained vowel pronunciation analysis',
    duration: '10-15 seconds',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'speech',
    name: 'Speech Test',
    icon: MessageSquare,
    description: 'Connected speech pattern analysis',
    duration: '30-60 seconds',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 'drawing',
    name: 'Drawing Test',
    icon: Paintbrush,
    description: 'Spiral drawing for tremor detection',
    duration: '2-3 minutes',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 'tapping',
    name: 'Tapping Test',
    icon: Hand,
    description: 'Finger tapping speed and rhythm',
    duration: '30 seconds',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
];

export const TestSelector: React.FC<TestSelectorProps> = ({ onSelectTest, selectedTest }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Test</h2>
        <p className="text-gray-600 text-sm">
          Choose from multiple assessment methods to evaluate Parkinson's symptoms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => {
          const Icon = test.icon;
          const isSelected = selectedTest === test.id;

          return (
            <motion.button
              key={test.id}
              onClick={() => onSelectTest(test.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-5 rounded-xl border-2 transition-all text-left
                ${isSelected 
                  ? `${test.borderColor} ${test.bgColor} shadow-md` 
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                }
              `}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selected-test"
                  className="absolute top-3 right-3"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-3
                ${isSelected ? test.bgColor : 'bg-gray-100'}
              `}>
                <Icon className={`w-6 h-6 ${isSelected ? test.color : 'text-gray-600'}`} />
              </div>

              {/* Content */}
              <h3 className={`font-semibold mb-1 ${isSelected ? test.color : 'text-gray-900'}`}>
                {test.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {test.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>~{test.duration}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-900 font-medium mb-1">
          💡 Testing Tips
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Find a quiet environment for audio tests</li>
          <li>• Ensure good lighting for drawing tests</li>
          <li>• Complete tests when you feel rested</li>
          <li>• Results are saved automatically</li>
        </ul>
      </div>
    </div>
  );
};
