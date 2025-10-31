import React from 'react';
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
    'What Medicare plan is best for me?',
    'How does Medicare Part D work?',
    'I need help with prescription coverage',
    'What are my out-of-pocket costs?',
  ];

  const starters = isNewUser ? newUsersStarters : getPersonalizedStarters();

  return (
    <div className="text-left max-w-md mx-auto">
      <p className="text-body-small font-medium text-gray-700 mb-2">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {starters.map((starter, index) => (
          <Button key={index} variant="outline" size="sm" onClick={() => setInputValue(starter)}>
            {starter}
          </Button>
        ))}
      </div>
    </div>
  );
};