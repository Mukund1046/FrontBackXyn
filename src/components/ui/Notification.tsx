import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const notificationIcons = {
  success: <CheckCircle className="w-6 h-6 text-medical-success" />,
  error: <XCircle className="w-6 h-6 text-medical-critical" />,
  info: <Info className="w-6 h-6 text-primary-600" />,
};

const notificationStyles = {
  success: 'bg-green-50 border-green-200 text-green-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-primary-50 border-primary-200 text-primary-900',
};

export const Notification: React.FC = () => {
  const { ui, hideNotification } = useAppStore();
  const { notification } = ui;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, hideNotification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className={cn(
            'fixed top-5 right-5 max-w-sm w-full bg-white/95 backdrop-blur-md shadow-elevated rounded-xl pointer-events-auto border overflow-hidden z-50',
            notificationStyles[notification.type]
          )}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`${notification.type} notification`}
          initial={{ opacity: 0, x: 400, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25
          }}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <motion.div
                className="flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1
                }}
              >
                {notificationIcons[notification.type]}
              </motion.div>
              <div className="flex-1 pt-0.5 min-w-0">
                <motion.p
                  className="text-sm font-semibold"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {notification.message}
                </motion.p>
              </div>
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button
                  onClick={hideNotification}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1 transition-colors"
                  aria-label="Close notification"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
