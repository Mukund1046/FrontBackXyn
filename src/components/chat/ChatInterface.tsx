import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from '../ui/Button';
import { ChatStarters } from './ChatStarters';
import { useAppStore } from '../../stores/useAppStore';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { getMedicalChatResponse } from '../../lib/backend-api';
import { generateId } from '../../lib/utils';
import { FeatureErrorBoundary } from '../error/FeatureErrorBoundary';
import Markdown from 'markdown-to-jsx';
import { Send, Bot, User, ArrowUp, Paperclip } from 'lucide-react';

// Define a specific type for profile updates to ensure type safety
type ProfileUpdates = {
  medications?: string[];
  healthConditions?: string[];
  profileCompleteness?: number;
};

const ChatInterfaceContent: React.FC = () => {
  const {
    chat,
    addMessage,
    setLoading,
    updateProfile,
    user,
    showNotification,
  } = useAppStore();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      setShowScrollToTop(scrollTop > 200);
    }
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const updateUserChatPersonality = (messageContent: string) => {
    if (!user.profile) return;

    const userMessages = chat.messages.filter(m => m.type === 'user');
    const messageCount = userMessages.length;
    
    if (messageCount === 0) return;

    const currentAvg = user.profile.chatPersonality?.averageMessageLength || 0;
    const newAvg = (currentAvg * (messageCount - 1) + messageContent.length) / messageCount;

    updateProfile({
      chatPersonality: {
        averageMessageLength: newAvg,
      },
    });
  };

  const { addDocument, documents } = useDocumentStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addDocument(file);
      showNotification({ message: `File "${file.name}" uploaded successfully.`, type: 'success' });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProfileUpdateFromChat = (extractedInfo: any) => {
    if (!user.profile || !extractedInfo || Object.keys(extractedInfo).length === 0) {
      return;
    }
  
    const profileUpdates: ProfileUpdates = {};
  
    if (extractedInfo.medications && extractedInfo.medications.length > 0) {
      const newMedications = Array.from(new Set([...(user.profile.medications || []), ...extractedInfo.medications]));
      profileUpdates.medications = newMedications;
    }
  
    if (extractedInfo.conditions && extractedInfo.conditions.length > 0) {
      const newConditions = Array.from(new Set([...(user.profile.healthConditions || []), ...extractedInfo.conditions]));
      profileUpdates.healthConditions = newConditions;
    }
  
    if (Object.keys(profileUpdates).length > 0) {
      profileUpdates.profileCompleteness = Math.min((user.profile.profileCompleteness || 0) + 5, 100);
      updateProfile(profileUpdates);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || chat.isLoading) return;

    const userMessage = {
      id: generateId(),
      content: inputValue.trim(),
      type: 'user' as const,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    updateUserChatPersonality(userMessage.content);
    setInputValue('');
    setLoading(true);

    try {
      const chatHistory = chat.messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const documentKeywords = documents.flatMap(doc => doc.extractedKeywords || []);

      const medicalResponse = await getMedicalChatResponse(
        userMessage.content, 
        chatHistory,
        user.profile?.chatPersonality,
        documentKeywords
      );
      
      handleProfileUpdateFromChat(medicalResponse.extracted_info);

      const aiMessage = {
        id: generateId(),
        content: medicalResponse.text_content,
        type: 'ai' as const,
        timestamp: new Date(),
        metadata: {
          extracted_info: medicalResponse.extracted_info,
        },
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: generateId(),
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        type: 'ai' as const,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-h2 font-medium text-gray-900">Xyn.ai Assistant</h2>
            <p className="text-body-small text-gray-600">Your Medicare health guide</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {chat.messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-h3 font-semibold text-gray-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-body-medium text-gray-600 mb-4">
              Ask me anything about Medicare, your health coverage, or get personalized recommendations.
            </p>
            <div className="text-left max-w-md mx-auto">
              <ChatStarters setInputValue={setInputValue} />
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
              <div className="text-sm leading-relaxed overflow-x-auto">
                {/* FIX: Define overrides inline to resolve TypeScript error */}
                <Markdown options={{
                  overrides: {
                    h1: { component: 'h1', props: { className: 'text-h1 font-semibold mt-4 mb-2' } },
                    h2: { component: 'h2', props: { className: 'text-h2 font-semibold mt-3 mb-1' } },
                    h3: { component: 'h3', props: { className: 'text-h3 font-semibold mt-2 mb-1' } },
                    p: { component: 'p', props: { className: 'mb-1' } },
                    ul: { component: 'ul', props: { className: 'list-disc list-inside mb-1 ml-4' } },
                    ol: { component: 'ol', props: { className: 'list-decimal list-inside mb-1 ml-4' } },
                    li: { component: 'li', props: { className: 'mb-0.5' } },
                    a: { component: 'a', props: { className: 'text-blue-500 hover:underline' } },
                    strong: { component: 'strong', props: { className: 'font-semibold' } },
                    em: { component: 'em', props: { className: 'italic' } },
                    table: { component: 'table', props: { className: 'table-auto w-full my-2 border-collapse' } },
                    thead: { component: 'thead', props: { className: 'bg-gray-200' } },
                    th: { component: 'th', props: { className: 'px-4 py-2 text-left border border-gray-300' } },
                    tbody: { component: 'tbody' },
                    tr: { component: 'tr', props: { className: 'border-b border-gray-200' } },
                    td: { component: 'td', props: { className: 'px-4 py-2 border border-gray-300' } },
                  }
                }}>
                  {message.content}
                </Markdown>
              </div>
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

        {showScrollToTop && (
          <Button
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        )}
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full px-2"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
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

export const ChatInterface: React.FC = () => {
  const { setCurrentView } = useAppStore();
  return (
    <FeatureErrorBoundary feature="chat" navigate={() => setCurrentView('dashboard')}>
      <ChatInterfaceContent />
    </FeatureErrorBoundary>
  );
};