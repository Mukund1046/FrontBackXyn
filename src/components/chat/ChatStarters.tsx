import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAppStore } from '../../stores/useAppStore';

interface ChatStartersProps {
  setInputValue: (value: string) => void;
}

export const ChatStarters: React.FC<ChatStartersProps> = ({ setInputValue }) => {
  const { user, chat } = useAppStore();

  const getPersonalizedStarters = () => {
    const starters: string[] = [];

    if (user.profile) {
      if (user.profile.healthConditions.length > 0) {
        const condition = user.profile.healthConditions[0];
        starters.push(`How are you managing your ${condition} today?`);
      }

      if (user.profile.medications.length > 0) {
        const medication = user.profile.medications[0];
        starters.push(`Are you still taking ${medication}?`);
      }
    }

    if (chat.messages.length > 0) {
      const lastUserMessage = [...chat.messages].reverse().find(m => m.type === 'user');
      if (lastUserMessage) {
        const topic = lastUserMessage.content.split(' ').slice(0, 3).join(' ');
        starters.push(`Last time we talked about "${topic}...". Do you want to continue?`);
      }
    }

    starters.push('How are you feeling today?');

    // Return a random subset of starters
    return starters.sort(() => 0.5 - Math.random()).slice(0, 4);
  };

  const isNewUser = chat.messages.length === 0;

  const newUsersStarters = [
    'What symptoms should I watch for?',
    'How do I manage chronic conditions?',
    'Tell me about medication interactions',
    'What preventive care do I need?',
  ];

  const starters = isNewUser ? newUsersStarters : getPersonalizedStarters();

  return (
    <div className="text-center max-w-2xl mx-auto">
      <motion.p
        className="text-sm font-semibold text-gray-700 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Try asking:
      </motion.p>
      <div className="flex flex-wrap gap-3 justify-center">
        {starters.map((starter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.7 + index * 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue(starter)}
              className="whitespace-nowrap"
            >
              {starter}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
