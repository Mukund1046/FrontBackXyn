import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';

export interface SearchResult {
  id: string;
  type: 'service' | 'chat' | 'game' | 'mood' | 'record' | 'setting';
  title: string;
  description: string;
  link?: string;
  action?: () => void;
}

export const useSearch = (query: string) => {
  const { user, chat, ui, setCurrentView } = useAppStore();
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search Settings
    const settingsOptions = [
      { title: 'Profile Settings', link: '/settings/profile', action: () => setCurrentView('settings') },
      { title: 'Privacy Settings', link: '/settings/privacy', action: () => setCurrentView('settings') },
      { title: 'Notification Settings', link: '/settings/notifications', action: () => setCurrentView('settings') },
      { title: 'Account Settings', link: '/settings/account', action: () => setCurrentView('settings') },
    ];

    settingsOptions.forEach(setting => {
      if (setting.title.toLowerCase().includes(lowerCaseQuery)) {
        newResults.push({
          id: `setting-${setting.title}`,
          type: 'setting',
          title: setting.title,
          description: `Navigate to ${setting.title}`,
          action: setting.action,
        });
      }
    });

    // Search Chat History
    chat.messages.forEach((message, index) => {
      if (message.content.toLowerCase().includes(lowerCaseQuery)) {
        newResults.push({
          id: `chat-${message.id}`,
          type: 'chat',
          title: `Chat: "${message.content.substring(0, 40)}..."`,
          description: `Message from ${message.type === 'user' ? 'You' : 'AI'} on ${new Date(message.timestamp).toLocaleDateString()}`,
          action: () => setCurrentView('chat'),
        });
      }
    });

    // Search Patient Personal Records (from user.profile)
    if (user.profile) {
      const profile = user.profile;
      if (profile.firstName.toLowerCase().includes(lowerCaseQuery) || profile.lastName.toLowerCase().includes(lowerCaseQuery)) {
        newResults.push({
          id: 'record-name',
          type: 'record',
          title: `Patient: ${profile.firstName} ${profile.lastName}`,
          description: 'View patient\'s basic information',
          action: () => setCurrentView('profile'),
        });
      }
      if (profile.medicareId?.toLowerCase().includes(lowerCaseQuery)) {
        newResults.push({
          id: 'record-medicareid',
          type: 'record',
          title: `Medicare ID: ${profile.medicareId}`,
          description: 'View patient\'s Medicare ID',
          action: () => setCurrentView('profile'),
        });
      }
      profile.healthConditions.forEach((condition, index) => {
        if (condition.toLowerCase().includes(lowerCaseQuery)) {
          newResults.push({
            id: `record-condition-${index}`,
            type: 'record',
            title: `Health Condition: ${condition}`,
            description: 'View patient\'s health conditions',
            action: () => setCurrentView('profile'),
          });
        }
      });
      profile.medications.forEach((medication, index) => {
        if (medication.toLowerCase().includes(lowerCaseQuery)) {
          newResults.push({
            id: `record-medication-${index}`,
            type: 'record',
            title: `Medication: ${medication}`,
            description: 'View patient\'s medications',
            action: () => setCurrentView('profile'),
          });
        }
      });
    }

    // Search Services (main views/features)
    const serviceOptions = [
      { title: 'Dashboard', action: () => setCurrentView('dashboard') },
      { title: 'AI Assistant', action: () => setCurrentView('chat') },
      { title: 'My Profile', action: () => setCurrentView('profile') },
      { title: 'Settings', action: () => setCurrentView('settings') },
      { title: 'Medicare Plans', action: () => setCurrentView('plans') },
      { title: 'Help & Support', action: () => setCurrentView('help') },
    ];

    serviceOptions.forEach(service => {
      if (service.title.toLowerCase().includes(lowerCaseQuery)) {
        newResults.push({
          id: `service-${service.title}`,
          type: 'service',
          title: service.title,
          description: `Navigate to ${service.title}`,
          action: service.action,
        });
      }
    });

    // Search Past Games Played (types of games available)
    const gameTypes = [
      { title: 'Go/No-Go Game', link: '/games/gonogo' },
      { title: 'Memory Game', link: '/games/memory' },
      { title: 'Reaction Game', link: '/games/reaction' },
      { title: 'Task Switching Game', link: '/games/taskswitching' },
    ];

    gameTypes.forEach(game => {
      if (game.title.toLowerCase().includes(lowerCaseQuery)) {
        newResults.push({
          id: `game-${game.title}`,
          type: 'game',
          title: `Game: ${game.title}`,
          description: `Play the ${game.title}`,
          // TODO: Add action to navigate to game or open game modal
        });
      }
    });

    // Search Current Mood (placeholder for future feature)
    if ('mood tracking'.includes(lowerCaseQuery) || 'mood'.includes(lowerCaseQuery)) {
      newResults.push({
        id: 'mood-tracking',
        type: 'mood',
        title: 'Mood Tracking',
        description: 'Access your mood tracking history',
        // TODO: Add action to navigate to mood tracking feature
      });
    }

    setResults(newResults);
  }, [query, user, chat, ui, setCurrentView]);

  return results;
};
