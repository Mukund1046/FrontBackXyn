import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { EyeOff, Eye } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const IncognitoToggle: React.FC = () => {
  const { chat, toggleIncognitoMode, showNotification } = useAppStore();

  const handleToggle = () => {
    toggleIncognitoMode();
    if (!chat.isIncognitoMode) {
      showNotification({
        message: 'Private mode enabled. Messages will not be saved.',
        type: 'info',
      });
    } else {
      showNotification({
        message: 'Private mode disabled. Messages will be saved to history.',
        type: 'success',
      });
    }
  };

  const tooltipText = chat.isIncognitoMode
    ? 'Turn off private mode - Save conversations to history'
    : 'Turn on private mode - Ask sensitive questions privately';

  return (
    <Tooltip content={tooltipText} position="bottom">
      <motion.button
        onClick={handleToggle}
        className={`relative p-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          chat.isIncognitoMode
            ? 'bg-purple-100 text-purple-700 focus:ring-purple-500 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-600 focus:ring-gray-500 hover:bg-gray-200'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={chat.isIncognitoMode ? 'Disable private mode' : 'Enable private mode'}
      >
        {chat.isIncognitoMode ? (
          <EyeOff className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Eye className="w-5 h-5" aria-hidden="true" />
        )}
        
        {chat.isIncognitoMode && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          />
        )}
      </motion.button>
    </Tooltip>
  );
};
