import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { ChatStarters } from './ChatStarters';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';
import { IncognitoToggle } from './IncognitoToggle';
import { useAppStore } from '../../stores/useAppStore';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useChatDocumentStore } from '../../stores/useChatDocumentStore';
import { getMedicalChatResponse } from '../../lib/backend-api';
import { generateId } from '../../lib/utils';
import { FeatureErrorBoundary } from '../error/FeatureErrorBoundary';
import { DocumentAttachButton } from './DocumentAttachButton';
import { ActiveDocumentsBadge } from './ActiveDocumentsBadge';
import Markdown from 'markdown-to-jsx';
import { Send, Bot, User, ArrowUp, History } from 'lucide-react';

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
    createNewSession,
    addMessageToSession,
    getCurrentSession,
  } = useAppStore();

  const [inputValue, setInputValue] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Import chat document store
  const { activeDocumentIds } = useChatDocumentStore();

  // Initialize first session if none exists
  useEffect(() => {
    if (chat.sessions.length === 0 && !chat.currentSessionId) {
      createNewSession();
    }
  }, [chat.sessions.length, chat.currentSessionId, createNewSession]);

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

  const { documents } = useDocumentStore();

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

    // Add to current session (or use legacy method for backward compatibility)
    const currentSession = getCurrentSession();
    if (currentSession && !chat.isIncognitoMode) {
      addMessageToSession(currentSession.id, userMessage);
    } else if (chat.isIncognitoMode) {
      // For incognito mode, just add to messages without saving to sessions
      addMessage(userMessage);
    } else {
      addMessage(userMessage);
    }
    
    updateUserChatPersonality(userMessage.content);
    setInputValue('');
    setLoading(true);

    try {
      const chatHistory = chat.messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      console.log('Chat history being sent:', chatHistory);
      console.log('User message:', userMessage.content);

      // Get only ACTIVE documents (selected by user)
      const activeDocuments = documents.filter(
        doc => activeDocumentIds.includes(doc.id) && doc.isParsed
      );

      // Get document keywords and full context from active documents only
      const documentKeywords = activeDocuments.flatMap(doc => doc.extractedKeywords || []);
      const documentContext = activeDocuments
        .map(doc => {
          if (doc.parsedText) {
            return `Document: ${doc.name}\n${doc.parsedText}`;
          }
          return '';
        })
        .filter(text => text.length > 0)
        .join('\n\n---\n\n');

      console.log('Active documents:', activeDocuments.length);
      console.log('Document context length:', documentContext.length);
      console.log('Document keywords:', documentKeywords);

      const medicalResponse = await getMedicalChatResponse(
        userMessage.content,
        chatHistory,
        user.profile?.chatPersonality,
        documentKeywords,
        documentContext
      );

      console.log('Received response:', medicalResponse);

      handleProfileUpdateFromChat(medicalResponse.extracted_info);

      // Handle both text and structured responses
      let responseContent = '';
      if (medicalResponse.response_type === 'structured' && medicalResponse.structured_content) {
        // Convert structured content to readable text
        const structured = medicalResponse.structured_content;
        responseContent = `${structured.title}\n\n${structured.summary}\n\n`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        structured.options.forEach((option: any, index: number) => {
          responseContent += `${index + 1}. **${option.name}**\n${option.details}\n\n`;
        });
      } else {
        responseContent = medicalResponse.text_content || 'I apologize, but I could not generate a response.';
      }

      const aiMessage = {
        id: generateId(),
        content: responseContent,
        type: 'ai' as const,
        timestamp: new Date(),
        metadata: {
          extracted_info: medicalResponse.extracted_info,
        },
      };

      // Add AI response to current session
      const currentSession = getCurrentSession();
      if (currentSession && !chat.isIncognitoMode) {
        addMessageToSession(currentSession.id, aiMessage);
      } else {
        addMessage(aiMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: generateId(),
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        type: 'ai' as const,
        timestamp: new Date(),
      };
      
      const currentSession = getCurrentSession();
      if (currentSession && !chat.isIncognitoMode) {
        addMessageToSession(currentSession.id, errorMessage);
      } else {
        addMessage(errorMessage);
      }
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
    <div className="flex flex-col h-full max-h-full overflow-hidden max-h-full overflow-hidden">
      {/* Chat Header */}
      <motion.div
        className="border-b border-gray-200/80 p-5 bg-white/50 backdrop-blur-sm flex-shrink-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <motion.div
              className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft"
              role="img"
              aria-label="AI Assistant avatar"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Bot className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.div>
            <div className="min-w-0">
              <h2 className="text-h3 font-semibold text-gray-900">
                Xyn.ai Assistant
                {chat.isIncognitoMode && (
                  <span className="ml-2 text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    Private
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {activeDocumentIds.length > 0 
                  ? `Analyzing ${activeDocumentIds.length} medical document${activeDocumentIds.length > 1 ? 's' : ''}`
                  : 'Your trusted Medicare health guide'}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <IncognitoToggle />
            <Tooltip content="View all conversations and start new chats" position="bottom">
              <motion.button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open chat history"
              >
                <History className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </Tooltip>
          </div>
        </div>
      </motion.div>
      
      {/* Chat History Drawer */}
      <ChatHistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 relative scrollbar-thin bg-gray-50/50"
        data-lenis-prevent
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="wait">
          {chat.messages.length === 0 && (
            <motion.div
              className="text-center py-16 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2
                }}
              >
                <Bot className="w-20 h-20 text-gray-300 mx-auto mb-6" aria-hidden="true" />
              </motion.div>
              <motion.h3
                className="text-2xl font-semibold text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Start a conversation
              </motion.h3>
              <motion.p
                className="text-base text-gray-600 mb-6 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Ask me anything about Medicare, your health coverage, or get personalized recommendations.
              </motion.p>
              <motion.div
                className="text-left max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ChatStarters setInputValue={setInputValue} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {chat.messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex gap-3 items-end ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
              role="article"
              aria-label={message.type === 'user' ? 'Your message' : 'AI response'}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {message.type === 'ai' && (
                <motion.div
                  className="w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-200 shadow-subtle"
                  role="img"
                  aria-label="AI Assistant"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.05 + 0.1
                  }}
                >
                  <Bot className="w-5 h-5 text-primary-600" aria-hidden="true" />
                </motion.div>
              )}

              <motion.div
                className={`max-w-xs lg:max-w-lg px-5 py-3 rounded-2xl shadow-subtle ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
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
              </motion.div>

              {message.type === 'user' && (
                <motion.div
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-200"
                  role="img"
                  aria-label="Your avatar"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.05 + 0.1
                  }}
                >
                  <User className="w-5 h-5 text-gray-600" aria-hidden="true" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {chat.isLoading && (
            <motion.div
              className="flex gap-3 justify-start items-end"
              aria-live="polite"
              aria-label="AI is typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-200"
                role="img"
                aria-label="AI Assistant"
              >
                <Bot className="w-5 h-5 text-primary-600" aria-hidden="true" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-subtle">
                <div className="flex space-x-1.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary-500 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <span className="sr-only">AI is typing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />

        {showScrollToTop && (
          <Tooltip content="Jump to the beginning of conversation" position="left">
            <Button
              onClick={scrollToTop}
              className="absolute bottom-4 right-6 rounded-full w-10 h-10 p-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-6 h-6" aria-hidden="true" />
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Input Form */}
      <motion.div
        className="border-t border-gray-200/80 p-4 lg:p-5 bg-white/80 backdrop-blur-sm flex-shrink-0"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Active Documents Badge */}
          <AnimatePresence>
            {activeDocumentIds.length > 0 && <ActiveDocumentsBadge />}
          </AnimatePresence>

          <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <motion.div
            className="flex-1 relative"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about Medicare, health plans, or coverage..."
              className="w-full px-5 py-3.5 border border-gray-300 rounded-full text-sm bg-white shadow-subtle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
              disabled={chat.isLoading}
              aria-label="Type your message"
              aria-describedby={chat.isLoading ? "chat-loading" : undefined}
            />
          </motion.div>

          {/* Document Attach Button */}
          <DocumentAttachButton />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="submit"
              size="md"
              disabled={!inputValue.trim() || chat.isLoading}
              className="rounded-full px-6 bg-primary-600 hover:bg-primary-700 shadow-soft"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Send</span>
            </Button>
          </motion.div>
          {chat.isLoading && (
            <span id="chat-loading" className="sr-only" aria-live="polite">
              AI is typing...
            </span>
          )}
        </form>
        </div>
      </motion.div>
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
