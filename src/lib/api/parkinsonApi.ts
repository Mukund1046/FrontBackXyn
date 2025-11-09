const API_BASE = 'http://localhost:8000';

export interface Subject {
  id: string;
  name: string;
  date_of_birth: string | null;
  account_owner_id: string;
}

export interface HealthCondition {
  id: string;
  subject_id: string;
  condition_name: string;
  diagnosis_date: string | null;
}

export interface VowelTestResult {
  test_id: string;
  prediction: string;
  probability_parkinsons: number;
  confidence_score: number;
  threshold: number;
}

export const parkinsonApi = {
  // Subject Management
  subjects: {
    list: async (): Promise<Subject[]> => {
      const response = await fetch(`${API_BASE}/api/subjects/me`);
      if (!response.ok) throw new Error('Failed to fetch subjects');
      return response.json();
    },
    
    create: async (data: { name: string; date_of_birth: string | null }): Promise<Subject> => {
      const response = await fetch(`${API_BASE}/api/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create subject');
      }
      return response.json();
    },
  },
  
  // Health Conditions
  conditions: {
    list: async (subjectId: string): Promise<HealthCondition[]> => {
      const response = await fetch(
        `${API_BASE}/api/health-conditions/by-subject/${subjectId}`
      );
      if (!response.ok) throw new Error('Failed to fetch conditions');
      return response.json();
    },
    
    create: async (data: { 
      subject_id: string; 
      condition_name: string; 
      diagnosis_date?: string | null;
    }): Promise<HealthCondition> => {
      const response = await fetch(`${API_BASE}/api/health-conditions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create condition');
      }
      return response.json();
    },
  },
  
  // Parkinson's Tests
  tests: {
    vowel: async (formData: FormData): Promise<VowelTestResult> => {
      const response = await fetch(`${API_BASE}/api/parkinsons/tests/vowel`, {
        method: 'POST',
        body: formData, // Contains: subject_id, audio_file (condition_id optional)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        const errorMessage = errorData.detail || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      return response.json();
    },
    
    speech: async (formData: FormData): Promise<VowelTestResult> => {
      const response = await fetch(`${API_BASE}/api/parkinsons/tests/speech`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        const errorMessage = errorData.detail || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      return response.json();
    },
    
    drawing: async (formData: FormData): Promise<VowelTestResult> => {
      const response = await fetch(`${API_BASE}/api/parkinsons/tests/drawing`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        const errorMessage = errorData.detail || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      return response.json();
    },
    
    tapping: async (data: any): Promise<VowelTestResult> => {
      const response = await fetch(`${API_BASE}/api/parkinsons/tests/tapping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        const errorMessage = errorData.detail || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      return response.json();
    },
    
    // Legacy tapping format (if needed)
    tappingLegacy: async (data: {
      subject_id: string;
      condition_id: string;
      timestamps_ms: number[];
      hold_times_ms: number[];
      latency_times_ms: number[];
      flight_times_ms: number[];
    }) => {
      const response = await fetch(`${API_BASE}/api/parkinsons/tests/tapping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Tapping test failed');
      }
      return response.json();
    },
  },
};
