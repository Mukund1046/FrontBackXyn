import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  delay = 300,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Adjust position based on viewport boundaries
  useEffect(() => {
    if (isVisible && tooltipRef.current && wrapperRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newPosition = position;
      
      // Check if tooltip goes out of right boundary
      if (tooltipRect.right > viewportWidth - 10) {
        if (position === 'top' || position === 'bottom') {
          newPosition = position; // Keep but will use right alignment
        } else if (position === 'right') {
          newPosition = 'left';
        }
      }
      
      // Check if tooltip goes out of left boundary
      if (tooltipRect.left < 10) {
        if (position === 'left') {
          newPosition = 'right';
        }
      }
      
      // Check if tooltip goes out of top boundary
      if (tooltipRect.top < 10) {
        if (position === 'top') {
          newPosition = 'bottom';
        }
      }
      
      // Check if tooltip goes out of bottom boundary
      if (tooltipRect.bottom > viewportHeight - 10) {
        if (position === 'bottom') {
          newPosition = 'top';
        }
      }
      
      if (newPosition !== adjustedPosition) {
        setAdjustedPosition(newPosition);
      }
    }
  }, [isVisible, position, adjustedPosition]);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
    setAdjustedPosition(position); // Reset to original position
  };

  const getPositionClasses = () => {
    // Check if element is near right edge
    const wrapper = wrapperRef.current;
    const isNearRightEdge = wrapper && wrapper.getBoundingClientRect().right > window.innerWidth - 200;
    
    switch (adjustedPosition) {
      case 'top':
        return isNearRightEdge 
          ? 'bottom-full right-0 mb-2' 
          : 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return isNearRightEdge 
          ? 'top-full right-0 mt-2' 
          : 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    const wrapper = wrapperRef.current;
    const isNearRightEdge = wrapper && wrapper.getBoundingClientRect().right > window.innerWidth - 200;
    
    switch (adjustedPosition) {
      case 'top':
        return isNearRightEdge
          ? 'top-full right-4 border-t-gray-900 border-x-transparent border-b-transparent'
          : 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent';
      case 'bottom':
        return isNearRightEdge
          ? 'bottom-full right-4 border-b-gray-900 border-x-transparent border-t-transparent'
          : 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent';
    }
  };

  const childWithHandlers = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      children.props.onBlur?.(e);
    },
  });

  return (
    <div className="relative inline-flex" ref={wrapperRef}>
      {childWithHandlers}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 ${getPositionClasses()} ${className}`}
            role="tooltip"
          >
            {/* Tooltip Content */}
            <div className="relative">
              <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap max-w-xs">
                {content}
              </div>
              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
