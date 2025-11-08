export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  medicareId?: string;
  healthConditions: string[];
  medications: string[];
  preferences: {
    notifications: boolean;
    dataSharing: boolean;
    language: string;
  };
  profileCompleteness: number;
  createdAt: Date;
  updatedAt: Date;
  chatPersonality?: {
    averageMessageLength: number;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  metadata?: {
    context?: string;
    sources?: string[];
    confidence?: number;
    extracted_info?: Record<string, any>;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isIncognito: boolean;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  currentContext: string;
  isIncognitoMode: boolean;
  // Deprecated - kept for backward compatibility
  messages: ChatMessage[];
  sessionId: string;
}

export interface MedicarePlan {
  id: string;
  name: string;
  type: 'advantage' | 'supplement' | 'prescription';
  monthlyPremium: number;
  deductible: number;
  coverage: {
    medical: boolean;
    prescription: boolean;
    dental: boolean;
    vision: boolean;
    hearing: boolean;
  };
  rating: number;
  network: string[];
}

export interface AppState {
  user: {
    profile: UserProfile | null;
    isAuthenticated: boolean;
    onboardingComplete: boolean;
  };
  chat: ChatState;
  medicare: {
    length: number;
    plans: MedicarePlan[];
    selectedPlan: MedicarePlan | null;
  };
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    currentView: string;
    notification: Notification | null;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  completed: boolean;
  required: boolean;
}

export interface HealthAssessment {
  conditions: string[];
  medications: string[];
  allergies: string[];
  goals: string[];
  concerns: string[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}