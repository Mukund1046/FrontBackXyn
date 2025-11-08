import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const LOGO_URL = 'https://cdn.builder.io/api/v1/image/assets/b2ba2d7a34e5494f9b240da4d345e30f/2e08e42960c143f890de053098bc43b6';

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className,
  showText = false 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'rounded-2xl bg-white bg-no-repeat bg-center bg-cover flex-shrink-0',
          sizes[size]
        )}
        style={{
          backgroundImage: `url(${LOGO_URL})`,
        }}
        role="img"
        aria-label="Xyn.ai logo"
      />
      {showText && (
        <span className={cn('font-semibold text-gray-900', textSizes[size])}>
          Xyn.ai
        </span>
      )}
    </div>
  );
};
