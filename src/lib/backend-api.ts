// XynWrapper/src/lib/backend-api.ts

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000';

interface GameMechanicsDetail {
  step_number: number;
  instruction: string;
  duration_seconds?: number;
}

interface GameConcept {
  title: string;
  game_type: string;
  difficulty: number;
  cognitive_domain: string;
  mechanics_list: GameMechanicsDetail[];
  scoring_rules: string;
  description: string;
}

interface ChatMessage {
  role: string;
  content: string;
}

interface SymptomLog {
  symptom_text: string;
  log_type?: string;
}

export async function generateGameSuggestions(symptomText: string): Promise<GameConcept[]> {
  const response = await fetch(`${API_BASE_URL}/games/generate-suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symptom_text: symptomText }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to generate game suggestions');
  }

  return response.json();
}

export async function saveChosenGame(game: GameConcept): Promise<{ message: string; game_id: string }> {
  const response = await fetch(`${API_BASE_URL}/games/save-suggestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(game),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save game suggestion');
  }

  return response.json();
}

export async function getLatestRecommendedGame(): Promise<GameConcept> {
  const response = await fetch(`${API_BASE_URL}/games/latest`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch latest recommended game');
  }

  return response.json();
}

export async function getMedicalChatResponse(
  message: string,
  history: ChatMessage[] = [],
  chatPersonality?: { averageMessageLength: number },
  documentKeywords?: string[]
): Promise<{ text_content: string; extracted_info: any }> {
  
  let enhancedPrompt = message;
  if (documentKeywords && documentKeywords.length > 0) {
    enhancedPrompt = `Considering my documents which contain keywords like [${documentKeywords.join(', ')}], please address the following: ${message}`;
  }

  const response = await fetch(`${API_BASE_URL}/chat/medical-guidance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: enhancedPrompt,
      history: history,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get medical chat response');
  }

  return response.json();
}