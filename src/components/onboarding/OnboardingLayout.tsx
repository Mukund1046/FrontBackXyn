import React from 'react';
import { Card } from '../ui/Card';
import { useAppStore } from '../../stores/useAppStore';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title,
  description,
  currentStep,
  totalSteps,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <Card className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">X</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {children}
        </Card>
      </div>
    </div>
  );
};