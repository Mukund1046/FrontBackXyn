import { create } from 'zustand';

interface Subject {
  id: string;
  name: string;
  date_of_birth: string | null;
  account_owner_id: string;
}

interface TestResult {
  id: string;
  test_type: 'vowel' | 'speech' | 'drawing' | 'tapping';
  prediction_label: string;
  confidence_score: number;
  probability_parkinsons?: number;
  recorded_at: string;
  subject_id: string;
}

interface ParkinsonStore {
  // State
  subjects: Subject[];
  selectedSubject: Subject | null;
  currentTest: string | null;
  testResults: TestResult[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadSubjects: () => Promise<void>;
  selectSubject: (subject: Subject | null) => void;
  setCurrentTest: (test: string | null) => void;
  addTestResult: (result: TestResult) => void;
  loadTestHistory: (subjectId: string) => Promise<void>;
  clearError: () => void;
  createSubject: (data: { name: string; date_of_birth: string | null }) => Promise<Subject>;
}

const API_BASE = 'http://localhost:8000';

export const useParkinsonStore = create<ParkinsonStore>((set, get) => ({
  subjects: [],
  selectedSubject: null,
  currentTest: null,
  testResults: [],
  isLoading: false,
  error: null,
  
  loadSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/api/subjects/me`);
      if (!response.ok) throw new Error('Failed to load subjects');
      const data = await response.json();
      set({ subjects: data, isLoading: false });
    } catch (error) {
      console.error('Failed to load subjects:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load subjects' 
      });
    }
  },
  
  createSubject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/api/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create subject');
      }
      
      const newSubject = await response.json();
      set(state => ({ 
        subjects: [...state.subjects, newSubject],
        isLoading: false 
      }));
      return newSubject;
    } catch (error) {
      console.error('Failed to create subject:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create subject' 
      });
      throw error;
    }
  },
  
  selectSubject: (subject) => {
    set({ selectedSubject: subject, testResults: [] });
    // Test history loading will be implemented later
    // if (subject) {
    //   get().loadTestHistory(subject.id);
    // }
  },
  
  setCurrentTest: (test) => set({ currentTest: test }),
  
  addTestResult: (result) => set(state => ({ 
    testResults: [result, ...state.testResults] 
  })),
  
  loadTestHistory: async (subjectId: string) => {
    set({ isLoading: true, error: null });
    try {
      // For now, we'll just fetch from individual test tables
      // Later we can add a unified endpoint
      const vowelResponse = await fetch(`${API_BASE}/api/parkinsons/subjects/${subjectId}/vowel-tests`);
      
      if (vowelResponse.ok) {
        const vowelTests = await vowelResponse.json();
        const formattedTests: TestResult[] = vowelTests.map((test: any) => ({
          id: test.id,
          test_type: 'vowel' as const,
          prediction_label: test.prediction_label,
          confidence_score: test.confidence_score,
          probability_parkinsons: test.probability_parkinsons,
          recorded_at: test.recorded_at,
          subject_id: test.subject_id,
        }));
        
        set({ testResults: formattedTests, isLoading: false });
      } else {
        set({ testResults: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load test history:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load test history',
        testResults: []
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));
