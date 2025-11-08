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
  documentKeywords?: string[],
  documentContext?: string
): Promise<{ text_content: string; extracted_info: Record<string, unknown> }> {
  
  let enhancedPrompt = message;
  
  // Add document context if available
  if (documentContext && documentContext.trim().length > 0) {
    // Include relevant excerpts from parsed documents (reduced to avoid 422 error)
    const contextSnippet = documentContext.substring(0, 1000); // Limit to 1000 chars
    enhancedPrompt = `Medical context from uploaded documents:\n${contextSnippet}\n\nUser question: ${message}`;
  } else if (documentKeywords && documentKeywords.length > 0) {
    // Fallback to keywords if full text not available
    const keywordList = documentKeywords.slice(0, 10).join(', '); // Limit to 10 keywords
    enhancedPrompt = `Context: User's medical documents contain: ${keywordList}.\n\nQuestion: ${message}`;
  }

  // Clean history to match backend schema (only role and content)
  // Filter out any messages with null/undefined content
  const cleanHistory = history
    .filter(msg => msg.content && msg.content.trim().length > 0)
    .map(msg => ({
      role: msg.role,
      content: msg.content.trim()
    }));

  const payload = {
    message: enhancedPrompt,
    history: cleanHistory,
  };

  console.log('Sending to backend:', {
    messageLength: enhancedPrompt.length,
    historyLength: cleanHistory.length,
    payload: payload
  });

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/chat/medical-guidance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    console.error('Network error:', networkError);
    throw new Error('Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000');
  }

  if (!response.ok) {
    let errorMessage = 'Failed to get medical chat response';
    let errorDetails = '';
    try {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      errorDetails = JSON.stringify(errorData, null, 2);
      errorMessage = errorData.detail || errorDetails;
    } catch {
      const errorText = await response.text();
      console.error('Backend raw error:', errorText);
      errorDetails = errorText;
      errorMessage = `Server error (${response.status})`;
    }
    
    // Log full details for debugging
    console.error('Full error details:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorDetails,
      sentPayload: payload
    });
    
    throw new Error(`${errorMessage}\n\nPlease check:\n1. Backend is running (http://localhost:8000)\n2. Groq API key is configured\n3. Check backend console for errors`);
  }

  const result = await response.json();
  console.log('Backend response:', result);
  return result;
}