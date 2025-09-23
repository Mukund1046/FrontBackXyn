import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { OnboardingLayout } from './OnboardingLayout';
import { useAppStore } from '../../stores/useAppStore';
import { Plus, X } from 'lucide-react';

export const HealthAssessment: React.FC = () => {
  const { currentStep, onboardingSteps, setCurrentStep, updateProfile, completeStep } = useAppStore();
  
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const commonConditions = [
    'Diabetes', 'High Blood Pressure', 'Heart Disease', 'Arthritis',
    'High Cholesterol', 'Osteoporosis', 'Depression', 'Anxiety',
    'Chronic Pain', 'COPD', 'Asthma', 'Cancer History'
  ];

  const addCondition = (condition: string) => {
    if (condition && !conditions.includes(condition)) {
      setConditions([...conditions, condition]);
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    setConditions(conditions.filter(c => c !== condition));
  };

  const addMedication = () => {
    if (newMedication && !medications.includes(newMedication)) {
      setMedications([...medications, newMedication]);
      setNewMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setMedications(medications.filter(m => m !== medication));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      updateProfile({
        healthConditions: conditions,
        medications: medications,
        profileCompleteness: 60,
      });
      
      completeStep('health-assessment');
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    completeStep('health-assessment');
    setCurrentStep(currentStep + 1);
  };

  return (
    <OnboardingLayout
      title="Health Assessment"
      description="Help us understand your health needs better"
      currentStep={currentStep + 1}
      totalSteps={onboardingSteps.length}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Health Conditions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Current Health Conditions
          </h3>
          
          {/* Common Conditions */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Select any that apply:</p>
            <div className="grid grid-cols-2 gap-2">
              {commonConditions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => addCondition(condition)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    conditions.includes(condition)
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Condition Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add other condition..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition(newCondition))}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addCondition(newCondition)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Conditions */}
          {conditions.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Selected conditions:</p>
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition) => (
                  <span
                    key={condition}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeCondition(condition)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Medications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Current Medications
          </h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              placeholder="Enter medication name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMedication}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {medications.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Current medications:</p>
              <div className="space-y-2">
                {medications.map((medication) => (
                  <div
                    key={medication}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{medication}</span>
                    <button
                      type="button"
                      onClick={() => removeMedication(medication)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};