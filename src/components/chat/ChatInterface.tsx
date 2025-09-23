import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppStore } from '../../stores/useAppStore';
import { generateAIResponse, extractHealthInfo } from '../../lib/ai-sdk';
import { generateId } from '../../lib/utils';
import { Send, Bot, User } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const {
    chat,
    addMessage,
    setLoading,
    updateProfile,
    geminiApiKey,
    user,
  } = useAppStore();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || chat.isLoading) return;
    
    if (!geminiApiKey) {
      alert('Please configure your Gemini API key in settings.');
      return;
    }

    const userMessage = {
      id: generateId(),
      content: inputValue.trim(),
      type: 'user' as const,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputValue('');
    setLoading(true);

    try {
      const conversationHistory = chat.messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      conversationHistory.push({
        role: 'user',
        content: userMessage.content,
      });

      const response = await generateAIResponse(conversationHistory);
      
      // Extract health information for profile building
      const extractedInfo = extractHealthInfo(response.content);
      
      // Update user profile if new health information is found
      if (Object.keys(extractedInfo).length > 0 && user.profile) {
        const profileUpdates: any = {};
        
        if (extractedInfo.medications) {
          const newMedications = [...user.profile.medications, ...extractedInfo.medications]
            .filter((med, index, arr) => arr.indexOf(med) === index);
          profileUpdates.medications = newMedications;
        }
        
        if (extractedInfo.conditions) {
          const newConditions = [...user.profile.healthConditions, ...extractedInfo.conditions]
            .filter((cond, index, arr) => arr.indexOf(cond) === index);
          profileUpdates.healthConditions = newConditions;
        }
        
        if (Object.keys(profileUpdates).length > 0) {
          // Increase profile completeness
          profileUpdates.profileCompleteness = Math.min(
            (user.profile.profileCompleteness || 0) + 5,
            100
          );
          updateProfile(profileUpdates);
        }
      }

      const aiMessage = {
        id: generateId(),
        content: response.content,
        type: 'ai' as const,
        timestamp: new Date(),
        metadata: {
          extracted_info: extractedInfo,
          usage: response.usage,
        },
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: generateId(),
        content: 'I apologize, but I encountered an error processing your message. Please try again or check your API key configuration.',
        type: 'ai' as const,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!geminiApiKey) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI Assistant Not Configured
          </h3>
          <p className="text-gray-600 mb-4">
            Please configure your Gemini API key to start chatting with your AI health assistant.
          </p>
          <Button variant="outline">
            Configure API Key
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-medium font-sans text-xl tracking-tight
              text-gray-900">Xyn.ai Assistant</h2>
            <p className="text-sm text-md tracking-tight text-gray-600">Your Medicare health guide</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-600 mb-4">
              Ask me anything about Medicare, your health coverage, or get personalized recommendations.
            </p>
            <div className="text-left max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-2">Try asking:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "What Medicare plan is best for me?"</li>
                <li>• "How does Medicare Part D work?"</li>
                <li>• "I need help with prescription coverage"</li>
                <li>• "What are my out-of-pocket costs?"</li>
              </ul>
            </div>
          </div>
        )}

        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.type === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {chat.isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about Medicare, health plans, or coverage..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={chat.isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputValue.trim() || chat.isLoading}
            className="rounded-full px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};