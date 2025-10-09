import React from 'react';
import clsx from 'clsx';
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
            const isHighlight = index === 0;

            return (
              <div
                key={index}
                className={clsx('text-center p-4', isHighlight && 'rounded-xl overflow-hidden')}
                style={
                  isHighlight
                    ? {
                        backgroundImage:
                          'url(https://cdn.builder.io/api/v1/image/assets/b2ba2d7a34e5494f9b240da4d345e30f/8da261c7aa1f4007a64399accda03ddd)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }
                    : undefined
                }
              >
                <div
                  className={clsx(
                    'mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg',
                    !isHighlight && 'bg-blue-100'
                  )}
                >
                  <Icon className={clsx(isHighlight ? 'h-10 w-10' : 'h-6 w-6', 'text-blue-600')} />
                </div>
                <h3
                  className={clsx(
                    'text-[20px] leading-5 mb-1',
                    isHighlight ? 'font-medium text-white' : 'font-semibold text-gray-900'
                  )}
                  style={{ letterSpacing: '-0.5px' }}
                >
                  {feature.title}
                </h3>
                <p
                  className={clsx('text-[12px] leading-[19.5px]', isHighlight ? 'text-white' : 'text-gray-600')}
                  style={isHighlight ? { letterSpacing: '-0.4px' } : undefined}
                >
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
