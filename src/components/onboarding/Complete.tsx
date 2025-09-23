import React from 'react';
import { Button } from '../ui/Button';
import { OnboardingLayout } from './OnboardingLayout';
import { useAppStore } from '../../stores/useAppStore';
import { CheckCircle, MessageSquare, User, Shield } from 'lucide-react';

export const Complete: React.FC = () => {
  const { onboardingSteps, completeOnboarding, user } = useAppStore();

  const handleComplete = () => {
    completeOnboarding();
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Ready',
      description: 'Start conversations with your AI health assistant',
    },
    {
      icon: User,
      title: 'Profile Building',
      description: 'Your profile will grow as you chat with the AI',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All your health data is protected and encrypted',
    },
  ];

  return (
    <OnboardingLayout
      title="You're All Set!"
      description={`Welcome to Xyn.ai, ${user.profile?.firstName}!`}
      currentStep={onboardingSteps.length}
      totalSteps={onboardingSteps.length}
    >
      <div className="space-y-6">
        {/* Success Animation */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Pro tip:</strong> The more you chat with Xyn.ai, the better it understands 
            your health needs and can provide personalized Medicare recommendations.
          </p>
        </div>

        <Button onClick={handleComplete} className="w-full" size="lg">
          Start Using Xyn.ai
        </Button>
      </div>
    </OnboardingLayout>
  );
};