import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useChatDocumentStore } from '../../stores/useChatDocumentStore';
import { Tooltip } from '../ui/Tooltip';

export const ActiveDocumentsBadge: React.FC = () => {
  const { documents } = useDocumentStore();
  const { activeDocumentIds, removeDocument } = useChatDocumentStore();

  const activeDocuments = documents.filter(
    (doc) => activeDocumentIds.includes(doc.id) && doc.isParsed
  );

  if (activeDocuments.length === 0) return null;

  const totalContextSize = activeDocuments.reduce(
    (sum, doc) => sum + (doc.parsedText?.length || 0),
    0
  );

  const truncateName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    const ext = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    return `${nameWithoutExt.substring(0, maxLength - ext!.length - 4)}...${ext}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mb-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-600" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Using {activeDocuments.length} document{activeDocuments.length > 1 ? 's' : ''} in context
            </span>
            <span className="text-xs text-gray-500">
              ({totalContextSize.toLocaleString()} chars)
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {activeDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-primary-200 shadow-sm"
                >
                  <FileText className="w-3 h-3 text-primary-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                    {truncateName(doc.name)}
                  </span>
                  <Tooltip content={`Remove ${truncateName(doc.name, 30)} from chat context`} position="top">
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded transition-colors"
                      aria-label={`Remove ${doc.name} from context`}
                    >
                      <X className="w-3 h-3 text-gray-500 hover:text-red-600" />
                    </button>
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
