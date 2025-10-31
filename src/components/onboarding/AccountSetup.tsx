import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OnboardingLayout } from './OnboardingLayout';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAppStore } from '../../stores/useAppStore';
import { validateEmail, generateId } from '../../lib/utils';

export const AccountSetup: React.FC = () => {
  const { currentStep, onboardingSteps, setCurrentStep, setUser, completeStep } = useAppStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      const userProfile = {
        id: generateId(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        healthConditions: [],
        medications: [],
        preferences: {
          notifications: true,
          dataSharing: false,
          language: 'en',
        },
        profileCompleteness: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(userProfile);
      completeStep('account');
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <OnboardingLayout
      title="Create Your Account"
      description="Set up your secure Xyn.ai account to get started"
      currentStep={currentStep + 1}
      totalSteps={onboardingSteps.length}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            error={errors.firstName}
            placeholder="John"
            required
          />
          <Input
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            error={errors.lastName}
            placeholder="Doe"
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder="john.doe@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          placeholder="Enter a secure password"
          helperText="Must be at least 8 characters"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
        />

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
            type="submit"
            loading={isLoading}
            className="flex-1"
          >
            Create Account
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};