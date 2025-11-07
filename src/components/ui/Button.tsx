import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  animate?: boolean;
}

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, children, disabled, animate = true, ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded-lg font-semibold',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
      'relative overflow-hidden',
    ];

    const variants = {
      primary: [
        'bg-primary-600 text-white shadow-subtle',
        'hover:bg-primary-700 hover:shadow-soft focus:ring-primary-500',
        'active:bg-primary-800',
      ],
      secondary: [
        'bg-gray-100 text-gray-900 shadow-subtle',
        'hover:bg-gray-200 hover:shadow-soft focus:ring-gray-400',
        'active:bg-gray-300',
      ],
      outline: [
        'border border-gray-300 bg-white text-gray-700 shadow-subtle',
        'hover:bg-gray-50 hover:border-gray-400 hover:shadow-soft focus:ring-gray-400',
        'active:bg-gray-100',
      ],
      ghost: [
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 focus:ring-gray-300',
        'active:bg-gray-200',
      ],
      success: [
        'bg-medical-success text-white shadow-subtle',
        'hover:bg-green-700 hover:shadow-soft focus:ring-green-500',
        'active:bg-green-800',
      ],
      destructive: [
        'bg-medical-critical text-white shadow-subtle',
        'hover:bg-red-700 hover:shadow-soft focus:ring-red-500',
        'active:bg-red-800',
      ],
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm leading-4 h-8 gap-1.5',
      md: 'px-4 py-2.5 text-sm leading-5 h-10 gap-2',
      lg: 'px-6 py-3 text-base leading-6 h-12 gap-2.5',
    };

    const MotionButton = animate ? motion.button : 'button';

    const buttonProps = {
      ref,
      className: cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      ),
      disabled: disabled || loading,
      'aria-busy': loading,
      ...(animate && !disabled && !loading && {
        whileHover: { scale: 1.02, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98, transition: { duration: 0.1 } },
      }),
      ...props,
    };

    return (
      <MotionButton {...buttonProps}>
        {loading && (
          <motion.svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
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
          </motion.svg>
        )}
        <motion.span
          animate={loading ? { opacity: 0.6 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </MotionButton>
    );
  }
);

ButtonComponent.displayName = 'Button';

export const Button: React.FC<ButtonProps> = ButtonComponent;
