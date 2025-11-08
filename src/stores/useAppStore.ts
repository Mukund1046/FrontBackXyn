import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, UserProfile, ChatMessage, ChatSession, OnboardingStep, Notification } from '../types';
import { generateId } from '../lib/utils';

interface AppStore extends AppState {
  // User actions
  setUser: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  completeOnboarding: () => void;
  
  // Chat actions (legacy - backward compatibility)
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
  updateContext: (context: string) => void;
  
  // New Chat Session actions
  createNewSession: (isIncognito?: boolean) => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, title: string) => void;
  addMessageToSession: (sessionId: string, message: ChatMessage) => void;
  toggleIncognitoMode: () => void;
  getCurrentSession: () => ChatSession | null;
  
  // UI actions
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setCurrentView: (view: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: () => void;
  
  // Onboarding
  onboardingSteps: OnboardingStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: string) => void;
  
}

const initialOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Xyn.ai',
    description: 'Your personal Medicare health assistant',
    component: 'Welcome',
    completed: false,
    required: true,
  },
  {
    id: 'account',
    title: 'Create Account',
    description: 'Set up your secure account',
    component: 'AccountSetup',
    completed: false,
    required: true,
  },
  {
    id: 'health-assessment',
    title: 'Health Assessment',
    description: 'Tell us about your health needs',
    component: 'HealthAssessment',
    completed: false,
    required: true,
  },
  {
    id: 'api-setup',
    title: 'AI Assistant Setup',
    description: 'Configure your AI assistant',
    component: 'ApiSetup',
    completed: false,
    required: true,
  },
  {
    id: 'complete',
    title: 'Get Started',
    description: 'You\'re all set to use Xyn.ai',
    component: 'Complete',
    completed: false,
    required: true,
  },
];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        profile: null,
        isAuthenticated: false,
        onboardingComplete: false,
      },
      chat: {
        sessions: [],
        currentSessionId: null,
        isLoading: false,
        currentContext: '',
        isIncognitoMode: false,
        // Deprecated - kept for backward compatibility
        messages: [],
        sessionId: '',
      },
      medicare: {
        plans: [],
        selectedPlan: null,
      },
      ui: {
        theme: 'light',
        sidebarOpen: false,
        sidebarCollapsed: false,
        currentView: 'dashboard',
        notification: null,
      },
      onboardingSteps: initialOnboardingSteps,
      currentStep: 0,

      // User actions
      setUser: (profile) =>
        set((state) => ({
          user: { ...state.user, profile, isAuthenticated: true },
        })),

      updateProfile: (updates) =>
        set((state) => ({
          user: {
            ...state.user,
            profile: state.user.profile
              ? {
                  ...state.user.profile,
                  ...updates,
                  preferences: updates.preferences
                    ? { ...state.user.profile.preferences, ...updates.preferences }
                    : state.user.profile.preferences,
                  chatPersonality: updates.chatPersonality
                    ? { ...state.user.profile.chatPersonality, ...updates.chatPersonality }
                    : state.user.profile.chatPersonality,
                  updatedAt: new Date(),
                }
              : null,
          },
        })),

      logout: () =>
        set(() => ({
          user: {
            profile: null,
            isAuthenticated: false,
            onboardingComplete: false,
          },
          chat: {
            sessions: [],
            currentSessionId: null,
            isLoading: false,
            currentContext: '',
            isIncognitoMode: false,
            messages: [],
            sessionId: '',
          },
          ui: {
            theme: 'light',
            sidebarOpen: false,
            sidebarCollapsed: false,
            currentView: 'dashboard',
            notification: null,
          },
          onboardingSteps: initialOnboardingSteps,
          currentStep: 0,
        })),

      completeOnboarding: () =>
        set((state) => ({
          user: { ...state.user, onboardingComplete: true },
        })),

      // Chat actions
      addMessage: (message) =>
        set((state) => ({
          chat: {
            ...state.chat,
            messages: [...state.chat.messages, message],
          },
        })),

      setLoading: (loading) =>
        set((state) => ({
          chat: { ...state.chat, isLoading: loading },
        })),

      clearChat: () =>
        set((state) => ({
          chat: {
            ...state.chat,
            messages: [],
            currentContext: '',
          },
        })),

      updateContext: (context) =>
        set((state) => ({
          chat: { ...state.chat, currentContext: context },
        })),

      // New Chat Session actions
      createNewSession: (isIncognito = false) => {
        const newSessionId = generateId();
        const newSession: ChatSession = {
          id: newSessionId,
          title: isIncognito ? 'Private Session' : 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isIncognito,
        };
        
        set((state) => ({
          chat: {
            ...state.chat,
            sessions: isIncognito ? state.chat.sessions : [...state.chat.sessions, newSession],
            currentSessionId: newSessionId,
            isIncognitoMode: isIncognito,
            // Update legacy properties for backward compatibility
            messages: [],
            sessionId: newSessionId,
          },
        }));
        
        return newSessionId;
      },

      switchSession: (sessionId) =>
        set((state) => {
          const session = state.chat.sessions.find(s => s.id === sessionId);
          return {
            chat: {
              ...state.chat,
              currentSessionId: sessionId,
              isIncognitoMode: session?.isIncognito || false,
              // Update legacy properties
              messages: session?.messages || [],
              sessionId,
            },
          };
        }),

      deleteSession: (sessionId) =>
        set((state) => {
          const updatedSessions = state.chat.sessions.filter(s => s.id !== sessionId);
          const isCurrentSession = state.chat.currentSessionId === sessionId;
          
          return {
            chat: {
              ...state.chat,
              sessions: updatedSessions,
              currentSessionId: isCurrentSession 
                ? (updatedSessions[0]?.id || null)
                : state.chat.currentSessionId,
              messages: isCurrentSession 
                ? (updatedSessions[0]?.messages || [])
                : state.chat.messages,
              sessionId: isCurrentSession 
                ? (updatedSessions[0]?.id || '')
                : state.chat.sessionId,
            },
          };
        }),

      renameSession: (sessionId, title) =>
        set((state) => ({
          chat: {
            ...state.chat,
            sessions: state.chat.sessions.map(session =>
              session.id === sessionId
                ? { ...session, title, updatedAt: new Date() }
                : session
            ),
          },
        })),

      addMessageToSession: (sessionId, message) =>
        set((state) => {
          const isCurrentSession = state.chat.currentSessionId === sessionId;
          const updatedSessions = state.chat.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, message],
                  updatedAt: new Date(),
                  // Auto-title from first user message
                  title: session.messages.length === 0 && message.type === 'user'
                    ? message.content.substring(0, 40) + (message.content.length > 40 ? '...' : '')
                    : session.title,
                }
              : session
          );
          
          return {
            chat: {
              ...state.chat,
              sessions: updatedSessions,
              // Update legacy messages if this is the current session
              messages: isCurrentSession
                ? updatedSessions.find(s => s.id === sessionId)?.messages || state.chat.messages
                : state.chat.messages,
            },
          };
        }),

      toggleIncognitoMode: () =>
        set((state) => {
          const newIsIncognito = !state.chat.isIncognitoMode;
          // If turning on incognito, create a new incognito session
          if (newIsIncognito) {
            const newSessionId = generateId();
            return {
              chat: {
                ...state.chat,
                currentSessionId: newSessionId,
                isIncognitoMode: true,
                messages: [],
                sessionId: newSessionId,
              },
            };
          }
          // If turning off, switch back to last non-incognito session or create new one
          const lastRegularSession = [...state.chat.sessions].reverse().find(s => !s.isIncognito);
          if (lastRegularSession) {
            return {
              chat: {
                ...state.chat,
                currentSessionId: lastRegularSession.id,
                isIncognitoMode: false,
                messages: lastRegularSession.messages,
                sessionId: lastRegularSession.id,
              },
            };
          } else {
            // Create a new regular session
            const newSessionId = generateId();
            const newSession: ChatSession = {
              id: newSessionId,
              title: 'New Chat',
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              isIncognito: false,
            };
            return {
              chat: {
                ...state.chat,
                sessions: [...state.chat.sessions, newSession],
                currentSessionId: newSessionId,
                isIncognitoMode: false,
                messages: [],
                sessionId: newSessionId,
              },
            };
          }
        }),

      getCurrentSession: () => {
        const state = get();
        if (state.chat.isIncognitoMode) {
          return {
            id: state.chat.currentSessionId || 'incognito',
            title: 'Private Session',
            messages: state.chat.messages,
            createdAt: new Date(),
            updatedAt: new Date(),
            isIncognito: true,
          };
        }
        return state.chat.sessions.find(s => s.id === state.chat.currentSessionId) || null;
      },

      // UI actions
      toggleSidebar: () =>
        set((state) => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
        })),

      toggleSidebarCollapse: () =>
        set((state) => ({
          ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
        })),

      setCurrentView: (view) =>
        set((state) => ({
          ui: { ...state.ui, currentView: view },
        })),

      setTheme: (theme) =>
        set((state) => ({
          ui: { ...state.ui, theme },
        })),
      
      showNotification: (notification) =>
        set((state) => ({
          ui: {
            ...state.ui,
            notification: { ...notification, id: new Date().toISOString() },
          },
        })),

      hideNotification: () =>
        set((state) => ({
          ui: { ...state.ui, notification: null },
        })),

      // Onboarding actions
      setCurrentStep: (step) => set({ currentStep: step }),

      completeStep: (stepId) =>
        set((state) => ({
          onboardingSteps: state.onboardingSteps.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step
          ),
        })),


    }),
    {
      name: 'xynai-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        // Migration for v0 -> v1: Convert old message array to sessions
        if (version === 0) {
          const state = persistedState as Record<string, unknown>;
          
          // If old data has messages array but no sessions
          if (state.chat && Array.isArray(state.chat.messages) && state.chat.messages.length > 0 && !Array.isArray(state.chat.sessions)) {
            const firstSession: ChatSession = {
              id: generateId(),
              title: 'Previous Chat',
              messages: state.chat.messages,
              createdAt: new Date(),
              updatedAt: new Date(),
              isIncognito: false,
            };
            
            state.chat.sessions = [firstSession];
            state.chat.currentSessionId = firstSession.id;
            state.chat.isIncognitoMode = false;
          } else if (state.chat && !Array.isArray(state.chat.sessions)) {
            // Initialize empty sessions array if it doesn't exist
            state.chat.sessions = [];
            state.chat.currentSessionId = null;
            state.chat.isIncognitoMode = false;
          }
        }
        
        return persistedState;
      },
      partialize: (state) => ({
        user: state.user,
        chat: state.chat, // Persist chat history
        ui: {
          theme: state.ui.theme,
        },
        onboardingSteps: state.onboardingSteps,
        currentStep: state.currentStep,
      }),
    }
  )
);