import { useEffect, useCallback } from 'react';
import { useNotificationStore } from '../stores/useNotificationStore';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useGamesStore } from '../stores/useGamesStore';
import { useAppStore } from '../stores/useAppStore';

export const useNotifications = () => {
  const { addNotification } = useNotificationStore();
  const { documents } = useDocumentStore();
  const { currentStreak, lastPlayedDate } = useGamesStore();
  const { user } = useAppStore();

  // Check for document parsing completion
  useEffect(() => {
    const checkDocumentParsing = () => {
      documents.forEach((doc) => {
        if (doc.isParsed && doc.parsedAt) {
          const parsedTime = new Date(doc.parsedAt).getTime();
          const now = Date.now();
          // Only notify if parsed within last 5 seconds (recently parsed)
          if (now - parsedTime < 5000) {
            addNotification({
              type: 'document',
              title: 'Document Parsed Successfully',
              message: `${doc.name} has been analyzed and is ready for chat!`,
              actionLabel: 'View Documents',
              actionView: 'documents',
            });
          }
        }
      });
    };

    checkDocumentParsing();
  }, [documents, addNotification]);

  // Check for game streak milestones
  useEffect(() => {
    if (currentStreak > 0 && [3, 7, 14, 30, 60, 100].includes(currentStreak)) {
      addNotification({
        type: 'streak',
        title: `${currentStreak} Day Streak! 🔥`,
        message: `Amazing! You've played cognitive games for ${currentStreak} days in a row!`,
        actionLabel: 'Play Games',
        actionView: 'cognitive-games',
      });
    }
  }, [currentStreak, addNotification]);

  // Check for incomplete profile
  useEffect(() => {
    if (user.profile && user.profile.profileCompleteness < 50) {
      // Only show this notification once per session
      const hasShownProfileNotif = sessionStorage.getItem('profile-notif-shown');
      if (!hasShownProfileNotif) {
        addNotification({
          type: 'profile',
          title: 'Complete Your Profile',
          message: 'Help us personalize your experience by completing your profile.',
          actionLabel: 'View Profile',
          actionView: 'profile',
        });
        sessionStorage.setItem('profile-notif-shown', 'true');
      }
    }
  }, [user.profile, addNotification]);

  // Daily game reminder
  useEffect(() => {
    const checkDailyReminder = () => {
      const today = new Date().toDateString();
      const lastReminder = localStorage.getItem('last-game-reminder');
      
      if (lastPlayedDate !== today && lastReminder !== today) {
        const timeSinceLastPlayed = lastPlayedDate 
          ? Math.floor((Date.now() - new Date(lastPlayedDate).getTime()) / (1000 * 60 * 60 * 24))
          : null;

        if (timeSinceLastPlayed && timeSinceLastPlayed >= 1) {
          addNotification({
            type: 'game',
            title: 'Don\'t Break Your Streak!',
            message: `It's been ${timeSinceLastPlayed} day${timeSinceLastPlayed > 1 ? 's' : ''} since you last played. Keep your streak alive!`,
            actionLabel: 'Play Now',
            actionView: 'cognitive-games',
          });
          localStorage.setItem('last-game-reminder', today);
        }
      }
    };

    // Check on mount and every 6 hours
    checkDailyReminder();
    const interval = setInterval(checkDailyReminder, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lastPlayedDate, addNotification]);

  // Chat activity reminder
  useEffect(() => {
    const checkChatActivity = () => {
      if (user.profile && user.profile.chatPersonality) {
        const avgMessageLength = user.profile.chatPersonality.averageMessageLength || 0;
        const lastChatReminder = localStorage.getItem('last-chat-reminder');
        const today = new Date().toDateString();

        // If user has very low chat activity and hasn't been reminded today
        if (avgMessageLength < 20 && lastChatReminder !== today) {
          addNotification({
            type: 'profile',
            title: 'Build Your Profile',
            message: 'Chat more with our AI assistant to help us understand your needs better!',
            actionLabel: 'Start Chatting',
            actionView: 'chat',
          });
          localStorage.setItem('last-chat-reminder', today);
        }
      }
    };

    const timeout = setTimeout(checkChatActivity, 10000); // Check after 10 seconds
    return () => clearTimeout(timeout);
  }, [user.profile, addNotification]);

  // Manual notification triggers
  const notifyDocumentParsed = useCallback((documentName: string) => {
    addNotification({
      type: 'document',
      title: 'Document Ready',
      message: `${documentName} is now available for AI chat queries!`,
      actionLabel: 'Chat Now',
      actionView: 'chat',
    });
  }, [addNotification]);

  const notifyGameCompleted = useCallback((gameName: string, score: number) => {
    addNotification({
      type: 'achievement',
      title: 'Game Completed! 🎉',
      message: `You scored ${score} points in ${gameName}!`,
      actionLabel: 'Play More',
      actionView: 'cognitive-games',
    });
  }, [addNotification]);

  const notifyStreakAchieved = useCallback((streak: number) => {
    addNotification({
      type: 'streak',
      title: `${streak} Day Streak!`,
      message: `You're on fire! Keep up the great work!`,
      actionLabel: 'View Progress',
      actionView: 'cognitive-games',
    });
  }, [addNotification]);

  return {
    notifyDocumentParsed,
    notifyGameCompleted,
    notifyStreakAchieved,
  };
};
