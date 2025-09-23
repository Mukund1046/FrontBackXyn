import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';

let geminiModel: any = null;

export function initializeAI(apiKey: string) {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }
  
  geminiModel = google('gemini-1.5-pro', {
    apiKey: apiKey,
  });
}

export async function generateAIResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string = ''
) {
  if (!geminiModel) {
    throw new Error('AI model not initialized. Please provide Gemini API key.');
  }

  const fullSystemPrompt = `${systemPrompt}

You are Xyn.ai, a specialized Medicare health assistant. Your role is to:

1. Help users understand Medicare options and benefits
2. Extract relevant health information from conversations to build user profiles
3. Provide personalized recommendations based on individual health needs
4. Ensure HIPAA compliance and maintain user privacy
5. Offer clear, actionable advice while encouraging users to consult healthcare providers

Guidelines:
- Always maintain a professional, empathetic tone
- Provide accurate, up-to-date Medicare information
- Extract health-related information naturally from conversations
- Suggest relevant follow-up questions to build comprehensive profiles
- Include disclaimers when appropriate about consulting healthcare professionals

When extracting profile information, identify:
- Health conditions mentioned
- Current medications
- Healthcare goals and concerns
- Medicare enrollment status
- Preferred communication methods`;

  try {
    const response = await generateText({
      model: geminiModel,
      messages: [
        { role: 'system', content: fullSystemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    return {
      content: response.text,
      usage: response.usage,
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function streamAIResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string = ''
) {
  if (!geminiModel) {
    throw new Error('AI model not initialized. Please provide Gemini API key.');
  }

  return streamText({
    model: geminiModel,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    maxTokens: 1000,
  });
}

export function extractHealthInfo(aiResponse: string): Record<string, any> {
  // Simple extraction logic - in production, this would be more sophisticated
  const healthInfo: Record<string, any> = {};
  
  // Extract medications mentioned
  const medicationPatterns = /(?:taking|prescribed|medication|drug)\s+([A-Za-z]+)/gi;
  const medications = [];
  let match;
  while ((match = medicationPatterns.exec(aiResponse)) !== null) {
    medications.push(match[1]);
  }
  if (medications.length > 0) {
    healthInfo.medications = medications;
  }

  // Extract conditions mentioned
  const conditionPatterns = /(?:have|diagnosed|condition|disease)\s+([A-Za-z\s]+)/gi;
  const conditions = [];
  while ((match = conditionPatterns.exec(aiResponse)) !== null) {
    conditions.push(match[1].trim());
  }
  if (conditions.length > 0) {
    healthInfo.conditions = conditions;
  }

  return healthInfo;
}