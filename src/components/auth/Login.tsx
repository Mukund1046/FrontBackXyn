import React from 'react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../stores/useAppStore';
import { OnboardingLayout } from '../onboarding/OnboardingLayout';

export const Login: React.FC = () => {
  const { setUser } = useAppStore();

  const handleLogin = () => {
    // In a real app, this would involve a call to a backend for authentication.
    // For now, we'll just simulate a login with a dummy user.
    setUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      medicareId: '1234-5678-9012',
      healthConditions: ['Diabetes'],
      medications: ['Metformin'],
      preferences: {
        communication: 'email',
      },
      profileCompleteness: 80,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <OnboardingLayout
      title="Welcome Back!"
      description="Log in to continue your personalized Medicare journey."
      currentStep={1}
      totalSteps={1}
    >
      <div className="space-y-6">
        <Button onClick={handleLogin} className="w-full" size="lg">
          Login
        </Button>
      </div>
    </OnboardingLayout>
  );
};