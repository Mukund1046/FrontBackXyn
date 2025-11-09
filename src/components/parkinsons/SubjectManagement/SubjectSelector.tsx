import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, User } from 'lucide-react';
import { useParkinsonStore } from '../../../stores/useParkinsonStore';
import { SubjectForm } from './SubjectForm';

export const SubjectSelector: React.FC = () => {
  const { subjects, selectedSubject, selectSubject, isLoading } = useParkinsonStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSelect = (subject: typeof subjects[0]) => {
    selectSubject(subject);
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Select Subject</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Subject
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No subjects found</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Create Your First Subject
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Selected Subject Display */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-left">
                  {selectedSubject ? (
                    <>
                      <p className="font-semibold text-gray-900">{selectedSubject.name}</p>
                      {selectedSubject.date_of_birth && (
                        <p className="text-sm text-gray-500">
                          Born: {new Date(selectedSubject.date_of_birth).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">Select a subject to begin</p>
                  )}
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => handleSelect(subject)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        selectedSubject?.id === subject.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        {subject.date_of_birth && (
                          <p className="text-sm text-gray-500">
                            {new Date(subject.date_of_birth).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {selectedSubject?.id === subject.id && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Selected Subject Info Card */}
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {selectedSubject.name}
                </h3>
                {selectedSubject.date_of_birth && (
                  <p className="text-sm text-gray-600">
                    Date of Birth: {new Date(selectedSubject.date_of_birth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Ready to perform Parkinson's tests
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Subject Modal */}
      <SubjectForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </>
  );
};
