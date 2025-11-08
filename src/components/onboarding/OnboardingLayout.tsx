import React from 'react';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';


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
    <div
      className="min-h-[973px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-4 px-[140px] font-sans"
      style={{ fontFamily: '__Inter_d65c78, sans-serif' }}
    >
      <div className="w-full">
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
            <div className="mx-auto mb-4 flex justify-center">
              <Logo size="lg" />
            </div>
            <h1
              className="text-h1 font-semibold text-gray-900 mb-2"
            >
              {title}
            </h1>
            <p
              className="text-body-large text-gray-600"
            >
              {description}
            </p>
          </div>

          {children}
        </Card>
      </div>
    </div>
  );
};
