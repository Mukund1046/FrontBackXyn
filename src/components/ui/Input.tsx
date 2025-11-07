import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </motion.label>
      )}
      <motion.div
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <input
          id={inputId}
          className={cn(
            'block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-subtle bg-white',
            'placeholder-gray-400 text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperId}
          {...props}
        />
      </motion.div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            className="text-sm text-red-600 font-medium"
            role="alert"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <motion.p
            id={helperId}
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
