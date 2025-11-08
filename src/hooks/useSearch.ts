import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';

export interface SearchResult {
  id: string;
  type: 'service' | 'chat' | 'game' | 'page' | 'record' | 'setting' | 'session';
  title: string;
  description: string;
  link?: string;
  action?: () => void;
  icon?: string;
  category?: string;
}

export const useSearch = (query: string) => {
  const { user, chat, ui, setCurrentView } = useAppStore();
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase().trim();
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

    // Search Chat History (current session)
    if (chat.messages && chat.messages.length > 0) {
      chat.messages.forEach((message) => {
        if (message.content && message.content.toLowerCase().includes(lowerCaseQuery)) {
          newResults.push({
            id: `chat-${message.id}`,
            type: 'chat',
            title: `"${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}"`,
            description: `${message.type === 'user' ? '👤 You' : '🤖 AI'} • ${new Date(message.timestamp).toLocaleDateString()} at ${new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            icon: message.type === 'user' ? '👤' : '🤖',
            action: () => setCurrentView('chat'),
          });
        }
      });
    }

    // Search All Chat Sessions
    if (chat.sessions && chat.sessions.length > 0) {
      chat.sessions.forEach((session) => {
        const sessionTitle = session.title.toLowerCase();
        const matchesTitle = sessionTitle.includes(lowerCaseQuery);
        
        // Also search within session messages
        const hasMatchingMessage = session.messages.some(msg => 
          msg.content && msg.content.toLowerCase().includes(lowerCaseQuery)
        );

        if (matchesTitle || hasMatchingMessage) {
          const messageCount = session.messages.length;
          newResults.push({
            id: `session-${session.id}`,
            type: 'session',
            title: session.title,
            description: `Chat session with ${messageCount} message${messageCount !== 1 ? 's' : ''} • ${new Date(session.updatedAt).toLocaleDateString()}`,
            icon: session.isIncognito ? '🔒' : '💬',
            action: () => {
              setCurrentView('chat');
              // TODO: Switch to this session
            },
          });
        }
      });
    }

    // Search Patient Personal Records (from user.profile)
    if (user.profile) {
      const profile = user.profile;
      if (profile.firstName && profile.lastName) {
        if (profile.firstName.toLowerCase().includes(lowerCaseQuery) || profile.lastName.toLowerCase().includes(lowerCaseQuery)) {
          newResults.push({
            id: 'record-name',
            type: 'record',
            title: `Patient: ${profile.firstName} ${profile.lastName}`,
            description: 'View patient\'s basic information',
            action: () => setCurrentView('profile'),
          });
        }
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
      if (profile.healthConditions && Array.isArray(profile.healthConditions)) {
        profile.healthConditions.forEach((condition, index) => {
          if (condition && condition.toLowerCase().includes(lowerCaseQuery)) {
            newResults.push({
              id: `record-condition-${index}`,
              type: 'record',
              title: `Health Condition: ${condition}`,
              description: 'View patient\'s health conditions',
              action: () => setCurrentView('profile'),
            });
          }
        });
      }
      if (profile.medications && Array.isArray(profile.medications)) {
        profile.medications.forEach((medication, index) => {
          if (medication && medication.toLowerCase().includes(lowerCaseQuery)) {
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
    }

    // Search Pages/Services (main views/features)
    const pageOptions = [
      { title: 'Dashboard', description: 'View your health overview and recent activity', icon: '📊', action: () => setCurrentView('dashboard') },
      { title: 'AI Assistant', description: 'Chat with your AI health assistant', icon: '🤖', action: () => setCurrentView('chat') },
      { title: 'Chat', description: 'Start a conversation with AI', icon: '💬', action: () => setCurrentView('chat') },
      { title: 'Cognitive Games', description: 'Play therapeutic brain games', icon: '🎮', action: () => setCurrentView('cognitive-games') },
      { title: 'Games', description: 'Access cognitive therapy games', icon: '🧠', action: () => setCurrentView('cognitive-games') },
      { title: 'My Profile', description: 'Manage your personal information', icon: '👤', action: () => setCurrentView('profile') },
      { title: 'Profile', description: 'View and edit your profile', icon: '📋', action: () => setCurrentView('profile') },
      { title: 'Settings', description: 'Configure app preferences', icon: '⚙️', action: () => setCurrentView('settings') },
      { title: 'Medicare Plans', description: 'Explore Medicare coverage options', icon: '🏥', action: () => setCurrentView('plans') },
      { title: 'Plans', description: 'View Medicare plans', icon: '📄', action: () => setCurrentView('plans') },
      { title: 'Help & Support', description: 'Get assistance and resources', icon: '❓', action: () => setCurrentView('help') },
      { title: 'Help', description: 'Access help documentation', icon: '💡', action: () => setCurrentView('help') },
      { title: 'Documents', description: 'Manage your medical documents', icon: '📁', action: () => setCurrentView('documents') },
    ];

    pageOptions.forEach(page => {
      if (page.title.toLowerCase().includes(lowerCaseQuery) || 
          page.description.toLowerCase().includes(lowerCaseQuery)) {
        newResults.push({
          id: `page-${page.title}`,
          type: 'page',
          title: page.title,
          description: page.description,
          icon: page.icon,
          action: page.action,
        });
      }
    });

    // Search All Available Cognitive Games
    const allGames = [
      // Anxiety Games
      { title: 'Mindful Breathing', gameType: 'breathing_exercise', category: 'Anxiety', description: 'Reduce anxiety through guided breathing exercises', icon: '🫁', keywords: ['breathing', 'calm', 'relax', 'anxiety', 'mindfulness'] },
      { title: 'Echo Grove', gameType: 'echo_grove', category: 'Anxiety', description: 'Auditory memory sequence training', icon: '🔊', keywords: ['sound', 'memory', 'listen', 'sequence', 'anxiety'] },
      { title: 'Grounding Colors', gameType: 'grounding_technique', category: 'Anxiety', description: 'Mindfulness through color identification', icon: '🎨', keywords: ['color', 'grounding', 'mindfulness', 'anxiety', 'calm'] },
      
      // ADHD Games
      { title: 'Go/No-Go Challenge', gameType: 'go_nogo', category: 'ADHD', description: 'Impulse control training game', icon: '⚡', keywords: ['impulse', 'control', 'attention', 'adhd', 'focus'] },
      { title: 'Task Switcher', gameType: 'task_switching', category: 'ADHD', description: 'Executive function & cognitive flexibility', icon: '🔄', keywords: ['switch', 'task', 'executive', 'adhd', 'flexibility'] },
      { title: 'Growth Path', gameType: 'growth_path', category: 'ADHD', description: 'Processing speed with number sequencing', icon: '📈', keywords: ['number', 'sequence', 'speed', 'adhd', 'processing'] },
      { title: 'Reaction Time Test', gameType: 'reaction_time', category: 'ADHD', description: 'Measure and improve reaction speed', icon: '⏱️', keywords: ['reaction', 'speed', 'quick', 'adhd', 'reflex'] },
      
      // Depression Games
      { title: 'Pattern Recognition', gameType: 'pattern_recognition', category: 'Depression', description: 'Logical reasoning with patterns', icon: '🧩', keywords: ['pattern', 'logic', 'puzzle', 'depression', 'cognitive'] },
      { title: 'Positive Memory Journal', gameType: 'journaling', category: 'Depression', description: 'Gratitude and emotional regulation', icon: '📔', keywords: ['journal', 'gratitude', 'positive', 'depression', 'mood'] },
      
      // Stress Games
      { title: 'Stroop Test', gameType: 'stroop_test', category: 'Stress', description: 'Classic cognitive flexibility test', icon: '🌈', keywords: ['stroop', 'color', 'word', 'stress', 'attention'] },
      { title: 'Target Tracker', gameType: 'target_tracker', category: 'Stress', description: 'Visual tracking with cup shuffling', icon: '🎯', keywords: ['track', 'cup', 'visual', 'stress', 'focus'] },
      
      // General Memory Games
      { title: 'Memory Sequence', gameType: 'memory_sequence', category: 'Memory', description: 'Working memory with color patterns', icon: '🎨', keywords: ['memory', 'sequence', 'color', 'recall', 'brain'] },
      { title: 'Card Matching', gameType: 'card_matching', category: 'Memory', description: 'Short-term memory with flip cards', icon: '🎴', keywords: ['card', 'match', 'memory', 'pair', 'flip'] },
      { title: 'Memory Blossoms', gameType: 'memory_blossoms', category: 'Memory', description: 'Spatial working memory game', icon: '🌸', keywords: ['memory', 'flower', 'spatial', 'grid', 'bloom'] },
      
      // Autism Games
      { title: 'Emotion Explorer', gameType: 'social_cognition', category: 'Autism', description: 'Social cognition & emotion recognition', icon: '😊', keywords: ['emotion', 'social', 'face', 'autism', 'recognition'] },
    ];

    allGames.forEach(game => {
      const matchesTitle = game.title.toLowerCase().includes(lowerCaseQuery);
      const matchesCategory = game.category.toLowerCase().includes(lowerCaseQuery);
      const matchesDescription = game.description.toLowerCase().includes(lowerCaseQuery);
      const matchesKeywords = game.keywords.some(keyword => keyword.includes(lowerCaseQuery));
      
      if (matchesTitle || matchesCategory || matchesDescription || matchesKeywords) {
        newResults.push({
          id: `game-${game.gameType}`,
          type: 'game',
          title: game.title,
          description: game.description,
          icon: game.icon,
          category: game.category,
          action: () => setCurrentView(`game:${game.gameType}`),
        });
      }
    });

    setResults(newResults);
  }, [query, user, chat, ui, setCurrentView]);

  return results;
};
