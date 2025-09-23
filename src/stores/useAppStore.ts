import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, UserProfile, ChatMessage, OnboardingStep } from '../types';

interface AppStore extends AppState {
  // User actions
  setUser: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  completeOnboarding: () => void;
  
  // Chat actions
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
  updateContext: (context: string) => void;
  
  // UI actions
  toggleSidebar: () => void;
  setCurrentView: (view: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Onboarding
  onboardingSteps: OnboardingStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: string) => void;
  
  // API Key management
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string) => void;
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
        messages: [],
        isLoading: false,
        currentContext: '',
        sessionId: '',
      },
      medicare: {
        plans: [],
        selectedPlan: null,
      },
      ui: {
        theme: 'light',
        sidebarOpen: false,
        currentView: 'dashboard',
      },
      onboardingSteps: initialOnboardingSteps,
      currentStep: 0,
      geminiApiKey: null,

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
              ? { ...state.user.profile, ...updates, updatedAt: new Date() }
              : null,
          },
        })),

      logout: () =>
        set((state) => ({
          user: {
            profile: null,
            isAuthenticated: false,
            onboardingComplete: false,
          },
          chat: {
            messages: [],
            isLoading: false,
            currentContext: '',
            sessionId: '',
          },
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

      // UI actions
      toggleSidebar: () =>
        set((state) => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
        })),

      setCurrentView: (view) =>
        set((state) => ({
          ui: { ...state.ui, currentView: view },
        })),

      setTheme: (theme) =>
        set((state) => ({
          ui: { ...state.ui, theme },
        })),

      // Onboarding actions
      setCurrentStep: (step) => set({ currentStep: step }),

      completeStep: (stepId) =>
        set((state) => ({
          onboardingSteps: state.onboardingSteps.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step
          ),
        })),

      // API Key management
      setGeminiApiKey: (key) => {
        set({ geminiApiKey: key });
        // Initialize AI with the new key
        try {
          // This will be imported dynamically to avoid circular dependencies
          import('../lib/ai-sdk').then(({ initializeAI }) => {
            initializeAI(key);
          });
        } catch (error) {
          console.error('Failed to initialize AI:', error);
        }
      },
    }),
    {
      name: 'xynai-storage',
      partialize: (state) => ({
        user: state.user,
        ui: {
          theme: state.ui.theme,
        },
        geminiApiKey: state.geminiApiKey,
        onboardingSteps: state.onboardingSteps,
        currentStep: state.currentStep,
      }),
    }
  )
);