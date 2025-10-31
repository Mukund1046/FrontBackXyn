/**
 * Application configuration utilities
 * Centralized access to environment variables and app settings
 */

function parseNumericEnv(value: string | undefined, defaultValue: number): number {
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

export const config = {
  // App information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'XynWrapper',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },

  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
    timeout: parseNumericEnv(import.meta.env.VITE_API_TIMEOUT, 30000),
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  },

  // Feature flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugLogging: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true',
  },

  // Security settings
  security: {
    sessionTimeout: parseNumericEnv(import.meta.env.VITE_SESSION_TIMEOUT, 3600000), // 1 hour
    maxChatMessages: parseNumericEnv(import.meta.env.VITE_MAX_CHAT_MESSAGES, 100),
  },
} as const;

export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';

// Utility function to get API key with fallback
export function getGeminiApiKey(userProvidedKey?: string): string | null {
  return userProvidedKey || config.api.geminiApiKey || null;
}

// Utility function to validate API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  if (typeof apiKey !== 'string' || !apiKey.trim()) {
    return false;
  }
  return apiKey.startsWith('AIza') && apiKey.length > 20;
}

// Debug logging utility
export function debugLog(message: string, data?: any) {
  if (config.features.debugLogging) {
    console.log(`[XynWrapper Debug] ${message}`, data || '');
  }
}
