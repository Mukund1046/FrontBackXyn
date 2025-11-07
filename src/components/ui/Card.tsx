import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  variant?: 'default' | 'elevated' | 'subtle';
  animate?: boolean;
}

const CardComponent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, padding = 'md', onClick, variant = 'default', animate = true, ...rest }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantClasses = {
      default: 'bg-white border border-gray-200 shadow-subtle',
      elevated: 'bg-white border border-gray-200 shadow-soft',
      subtle: 'bg-white/80 backdrop-blur-sm border border-gray-100 shadow-subtle',
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    const MotionDiv = animate ? motion.div : 'div';

    const cardProps = {
      ref,
      onClick,
      onKeyDown: handleKeyDown,
      className: cn(
        'rounded-xl transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        className,
        {
          'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 hover:shadow-soft': !!onClick,
        }
      ),
      role: onClick ? 'button' : undefined,
      tabIndex: onClick ? 0 : undefined,
      ...(animate && {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        whileHover: onClick ? { y: -2, transition: { duration: 0.2 } } : undefined,
        whileTap: onClick ? { scale: 0.98 } : undefined,
      }),
      ...rest,
    };

    return <MotionDiv {...cardProps}>{children}</MotionDiv>;
  }
);

CardComponent.displayName = 'Card';

export const Card: React.FC<CardProps> = CardComponent;

// Card sub-components for better composition
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('flex flex-col space-y-1.5', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={cn('text-h3 font-semibold text-gray-900 leading-none tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn('text-sm text-gray-600', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('flex items-center pt-0', className)} {...props}>
    {children}
  </div>
);
