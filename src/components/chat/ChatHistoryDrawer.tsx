import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { X, Plus, MessageSquare, Trash2, Edit, Check, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { formatDistanceToNow } from '../../lib/utils';

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({ isOpen, onClose }) => {
  const {
    chat,
    createNewSession,
    switchSession,
    deleteSession,
    renameSession,
    showNotification,
  } = useAppStore();

  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  const handleNewChat = () => {
    createNewSession();
    showNotification({ message: 'New chat started', type: 'success' });
    onClose();
  };

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
    onClose();
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteSession(sessionId);
      showNotification({ message: 'Chat deleted', type: 'info' });
    }
  };

  const handleStartRename = (sessionId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editTitle.trim()) {
      renameSession(sessionId, editTitle.trim());
      showNotification({ message: 'Chat renamed', type: 'success' });
    }
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  // Sort sessions by most recently updated
  // Handle case where sessions might not be initialized yet
  const sessions = Array.isArray(chat.sessions) ? chat.sessions : [];
  const sortedSessions = [...sessions]
    .filter(s => !s.isIncognito)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-label="Chat History"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary-600" />
                <h2 className="text-h4 font-semibold text-gray-900">Chat History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close chat history"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-gray-200">
              <Button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700"
                size="md"
              >
                <Plus className="w-5 h-5" />
                <span>New Chat</span>
              </Button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sortedSessions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No chat history yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start a new conversation</p>
                </div>
              ) : (
                sortedSessions.map((session) => {
                  const isActive = chat.currentSessionId === session.id;
                  const isEditing = editingSessionId === session.id;

                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative rounded-lg border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-primary-50 border-primary-200 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => !isEditing && handleSwitchSession(session.id)}
                    >
                      <div className="p-3">
                        {isEditing ? (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(session.id);
                                if (e.key === 'Escape') handleCancelRename();
                              }}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRename(session.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              aria-label="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelRename}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                              aria-label="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3
                                className={`text-sm font-medium truncate flex-1 ${
                                  isActive ? 'text-primary-700' : 'text-gray-900'
                                }`}
                              >
                                {session.title}
                              </h3>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip content="Edit conversation title" position="top">
                                  <button
                                    onClick={(e) => handleStartRename(session.id, session.title, e)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                    aria-label="Rename chat"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Delete this conversation permanently" position="top">
                                  <button
                                    onClick={(e) => handleDeleteSession(session.id, e)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    aria-label="Delete chat"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatDistanceToNow(new Date(session.updatedAt))}</span>
                              <span className="mx-1">•</span>
                              <span>{session.messages.length} messages</span>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 text-center">
                {sortedSessions.length} conversation{sortedSessions.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
