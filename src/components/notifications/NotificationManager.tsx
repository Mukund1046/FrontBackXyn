import { useEffect } from 'react';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useGamesStore } from '../../stores/useGamesStore';
import { useAppStore } from '../../stores/useAppStore';

export const NotificationManager: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const { user } = useAppStore();
  const { currentStreak, lastPlayedDate, getStats } = useGamesStore();

  // Welcome notification on first load
  useEffect(() => {
    const hasShownWelcome = localStorage.getItem('welcome-notification-shown');
    if (!hasShownWelcome && user.profile) {
      setTimeout(() => {
        addNotification({
          type: 'system',
          title: `Welcome back, ${user.profile?.firstName}! 👋`,
          message: 'Check out your cognitive games and stay on track with your health journey.',
          actionLabel: 'Explore',
          actionView: 'dashboard',
        });
        localStorage.setItem('welcome-notification-shown', 'true');
      }, 2000);
    }
  }, [user.profile, addNotification]);

  // Check profile completeness - show toast on login
  useEffect(() => {
    if (user.profile && user.profile.profileCompleteness < 100) {
      const lastProfileToast = localStorage.getItem('last-profile-toast');
      const today = new Date().toDateString();
      
      // Show occasionally: once per day
      if (lastProfileToast !== today) {
        setTimeout(() => {
          addNotification({
            type: 'profile',
            title: 'Complete Your Profile 📋',
            message: `Your profile is ${user.profile.profileCompleteness}% complete. Add more health information for better AI recommendations!`,
            actionLabel: 'Complete Now',
            actionView: 'profile',
          });
          localStorage.setItem('last-profile-toast', today);
        }, 8000); // Show 8 seconds after login
      }
    }
  }, [user.profile, addNotification]);

  // Daily game reminder
  useEffect(() => {
    const checkGameReminder = () => {
      const today = new Date().toDateString();
      const lastReminder = localStorage.getItem('last-game-reminder');
      
      if (lastPlayedDate && lastPlayedDate !== today && lastReminder !== today) {
        const lastPlayed = new Date(lastPlayedDate);
        const daysSinceLastPlayed = Math.floor((Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceLastPlayed >= 1) {
          addNotification({
            type: 'game',
            title: '🎮 Time for Brain Training!',
            message: daysSinceLastPlayed === 1 
              ? 'Keep your streak alive! Play a game today.'
              : `It's been ${daysSinceLastPlayed} days. Don't lose your progress!`,
            actionLabel: 'Play Now',
            actionView: 'cognitive-games',
          });
          localStorage.setItem('last-game-reminder', today);
        }
      }
    };

    // Check immediately and then every 4 hours
    const timeout = setTimeout(checkGameReminder, 3000);
    const interval = setInterval(checkGameReminder, 4 * 60 * 60 * 1000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [lastPlayedDate, addNotification]);

  // Chat activity reminder
  useEffect(() => {
    if (user.profile && user.profile.chatPersonality) {
      const avgMessageLength = user.profile.chatPersonality.averageMessageLength || 0;
      const hasShownChatReminder = sessionStorage.getItem('chat-reminder-shown');

      if (avgMessageLength < 30 && !hasShownChatReminder) {
        setTimeout(() => {
          addNotification({
            type: 'profile',
            title: 'Build Your AI Profile',
            message: 'Chat more with our AI assistant to help us understand your needs and preferences better!',
            actionLabel: 'Start Chatting',
            actionView: 'chat',
          });
          sessionStorage.setItem('chat-reminder-shown', 'true');
        }, 15000);
      }
    }
  }, [user.profile, addNotification]);

  // Streak achievement notifications
  useEffect(() => {
    const stats = getStats();
    if (stats.streak > 0 && stats.totalPlayed > 0) {
      const lastStreakNotified = parseInt(localStorage.getItem('last-streak-notified') || '0');
      
      // Notify on major milestones
      const milestones = [3, 7, 14, 21, 30, 60, 90, 100];
      const nextMilestone = milestones.find(m => m > lastStreakNotified);
      
      if (nextMilestone && stats.streak >= nextMilestone) {
        addNotification({
          type: 'streak',
          title: `🔥 ${stats.streak} Day Streak!`,
          message: `Incredible consistency! You've played for ${stats.streak} consecutive days!`,
          actionLabel: 'View Progress',
          actionView: 'cognitive-games',
        });
        localStorage.setItem('last-streak-notified', stats.streak.toString());
      }
    }
  }, [currentStreak, getStats, addNotification]);

  // No actual UI - just runs effects
  return null;
};
