import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AlertTriangle, RefreshCw, MessageSquare, Home, User, HelpCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  feature: 'chat' | 'dashboard' | 'profile' | 'help-support';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  navigate?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const featureConfig = {
  chat: {
    icon: MessageSquare,
    title: 'Chat Error',
    description: 'There was a problem with the chat interface.',
    fallbackMessage: 'The chat feature is temporarily unavailable.',
  },
  dashboard: {
    icon: Home,
    title: 'Dashboard Error',
    description: 'There was a problem loading your dashboard.',
    fallbackMessage: 'Unable to load dashboard data.',
  },
  profile: {
    icon: User,
    title: 'Profile Error',
    description: 'There was a problem with your profile.',
    fallbackMessage: 'Unable to load profile information.',
  },
  'help-support': {
    icon: HelpCircle,
    title: 'Help & Support Error',
    description: 'There was a problem loading the help center.',
    fallbackMessage: 'The help center is temporarily unavailable.',
  },
};

export class FeatureErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`FeatureErrorBoundary (${this.props.feature}) caught an error:`, error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoBack = () => {
    if (this.props.navigate) {
      this.props.navigate();
    } else {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      const config = featureConfig[this.props.feature];
      const Icon = config.icon;

      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {config.title}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {config.description}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              {config.fallbackMessage}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg text-left">
                <h3 className="font-medium text-gray-900 mb-1 text-sm">Error Details:</h3>
                <p className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={this.handleRetry}
                size="sm"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleGoBack}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
