import React from 'react';
import { Button } from '../ui/Button';
import { OnboardingLayout } from './OnboardingLayout';
import { useAppStore } from '../../stores/useAppStore';
import { Shield, Heart, Brain, Users } from 'lucide-react';

export const Welcome: React.FC = () => {
  const { currentStep, onboardingSteps, setCurrentStep } = useAppStore();

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assistant',
      description: 'Get personalized Medicare guidance with advanced AI',
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your health data is secure and protected',
    },
    {
      icon: Heart,
      title: 'Health-Focused',
      description: 'Built specifically for Medicare beneficiaries',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Access to healthcare professionals when needed',
    },
  ];

  return (
    <OnboardingLayout
      title="Welcome to Xyn.ai"
      description="Your personal Medicare health assistant powered by AI"
      currentStep={currentStep + 1}
      totalSteps={onboardingSteps.length}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3
                  className="text-[20px] leading-5 font-semibold text-gray-900 mb-1"
                  style={{ letterSpacing: '-0.5px' }}
                >
                  {feature.title}
                </h3>
                <p className="text-[12px] leading-[19.5px] text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-4 mt-6 space-y-4">
          <Button onClick={handleNext} className="w-full font-sans" size="lg">
            Get Started
          </Button>

          <div className="text-xs text-gray-500 leading-[19.5px] space-y-1 font-normal">
            <div className="font-sans">By continuing, you agree to our</div>
            <a
              href="https://a460071213bd4f2a92e0b189e4f951c7-f8f86bf3e9224ea1be2ab015a.fly.dev/?reload=1759998944035#"
              className="text-blue-600 hover:underline font-sans"
            >
              Terms of Service
            </a>
            <div className="font-sans">and</div>
            <a
              href="https://a460071213bd4f2a92e0b189e4f951c7-f8f86bf3e9224ea1be2ab015a.fly.dev/?reload=1759998944035#"
              className="text-blue-600 hover:underline font-sans"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};
