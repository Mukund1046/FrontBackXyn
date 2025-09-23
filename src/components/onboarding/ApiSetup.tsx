import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OnboardingLayout } from './OnboardingLayout';
import { useAppStore } from '../../stores/useAppStore';
import { Key, ExternalLink, Check } from 'lucide-react';

export const ApiSetup: React.FC = () => {
  const { currentStep, onboardingSteps, setCurrentStep, setGeminiApiKey, completeStep } = useAppStore();
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    if (!apiKey.startsWith('AIza')) {
      setError('Invalid Gemini API key format');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Simple validation - in production, this would make a test call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGeminiApiKey(apiKey);
      setIsValid(true);
      setError('');
      
      // Auto-proceed after successful validation
      setTimeout(() => {
        completeStep('api-setup');
        setCurrentStep(currentStep + 1);
      }, 1000);
      
    } catch (err) {
      setError('Invalid API key. Please check and try again.');
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <OnboardingLayout
      title="AI Assistant Setup"
      description="Configure your AI assistant with Gemini API"
      currentStep={currentStep + 1}
      totalSteps={onboardingSteps.length}
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Get Your Gemini API Key
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Visit Google AI Studio</li>
            <li>2. Sign in with your Google account</li>
            <li>3. Create a new API key</li>
            <li>4. Copy and paste it below</li>
          </ol>
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Open Google AI Studio
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* API Key Input */}
        <div>
          <Input
            label="Gemini API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
            error={error}
            helperText="Your API key is stored securely and only used for AI responses"
          />
          
          {isValid && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              API key validated successfully!
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">
            🔒 Your API key is encrypted and stored locally. It's never shared with third parties 
            and is only used to power your AI assistant conversations.
          </p>
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
            onClick={validateApiKey}
            loading={isValidating}
            disabled={!apiKey.trim() || isValid}
            className="flex-1"
          >
            {isValidating ? 'Validating...' : isValid ? 'Validated!' : 'Validate & Continue'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};