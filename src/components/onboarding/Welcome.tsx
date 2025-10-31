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
      background:
        'https://cdn.builder.io/api/v1/image/assets/b2ba2d7a34e5494f9b240da4d345e30f/e1b4cb710eed4dcd88be55279ac937db',
      titleWeight: 'font-medium',
      descriptionLetterSpacing: '-0.4px',
      borderRadiusClass: 'rounded-[12px]',
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your health data is secure and protected',
      background:
        'https://cdn.builder.io/api/v1/image/assets/b2ba2d7a34e5494f9b240da4d345e30f/1d2bc4b39af748ce828624f2ab58a04a',
      titleWeight: 'font-medium',
      borderRadiusClass: 'rounded-[11px]',
    },
    {
      icon: Heart,
      title: 'Health-Focused',
      description: 'Built specifically for Medicare beneficiaries',
      background:
        'https://cdn.builder.io/api/v1/image/assets/b2ba2d7a34e5494f9b240da4d345e30f/8da261c7aa1f4007a64399accda03ddd',
      titleWeight: 'font-normal',
      borderRadiusClass: 'rounded-[12px]',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Access to healthcare professionals when needed',
      background:
        'https://cdn.builder.io/api/v1/image/assets/b2ba2d7a34e5494f9b240da4d345e30f/3e9c9deadfeb4ca4ac37b01d247e6ec8',
      titleWeight: 'font-medium',
      borderRadiusClass: 'rounded-[12px]',
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
            const {
              background,
              titleWeight = 'font-medium',
              descriptionLetterSpacing,
              borderRadiusClass,
            } = feature;

            return (
              <div
                key={index}
                className={clsx('text-center p-4 overflow-hidden font-sans', borderRadiusClass)}
                style={{
                  backgroundImage: `url(${background})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  fontFamily: '__Inter_d65c78, sans-serif',
                }}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3
                  className={clsx('text-h4 mb-1 text-white', titleWeight)}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-caption text-white"
                  style={descriptionLetterSpacing ? { letterSpacing: descriptionLetterSpacing } : undefined}
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
