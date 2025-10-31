import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        aria-hidden="true"
        className={cn(
          'animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text ? (
        <span className={cn('text-sm', colorClasses[color])}>
          {text}
        </span>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
};

// Skeleton loading components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />
);

export const SkeletonText: React.FC<{ 
  lines?: number; 
  className?: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
}> = ({ lines = 1, className, width = 'md' }) => {
  const widthClasses = {
    sm: 'w-1/4',
    md: 'w-1/2',
    lg: 'w-3/4',
    full: 'w-full',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-gray-200 rounded h-4',
            index === lines - 1 ? widthClasses[width] : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('animate-pulse bg-gray-200 rounded-full', sizeClasses[size])} />
  );
};

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  text = 'Loading...',
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      <div aria-hidden={isLoading}>{children}</div>
      {isLoading && (
        <div
          className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <LoadingSpinner size="md" />
            <span className="text-gray-700">
              {text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Page loading component
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div
    className="min-h-screen flex items-center justify-center bg-gray-50"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="text-center space-y-4">
      <div aria-hidden="true">
        <LoadingSpinner size="lg" />
      </div>
      <p className="text-gray-600">{text}</p>
    </div>
  </div>
);
