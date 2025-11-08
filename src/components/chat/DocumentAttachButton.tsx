import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Check, FileText, Upload } from 'lucide-react';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useChatDocumentStore } from '../../stores/useChatDocumentStore';
import { useAppStore } from '../../stores/useAppStore';

export const DocumentAttachButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { documents, addDocument } = useDocumentStore();
  const { activeDocumentIds, toggleDocument, isDocumentActive } = useChatDocumentStore();
  const { showNotification } = useAppStore();

  const parsedDocuments = documents.filter((doc) => doc.isParsed);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      await addDocument(files[0]);
      showNotification('Document uploaded successfully! It will be parsed automatically.', 'success');
      setIsOpen(false);
    } catch (error) {
      showNotification('Failed to upload document', 'error');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const truncateFilename = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    const ext = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    return `${nameWithoutExt.substring(0, maxLength - ext!.length - 4)}...${ext}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-gray-200 transition-colors"
        type="button"
      >
        <Paperclip className="w-4 h-4 text-gray-600" />
        {activeDocumentIds.length > 0 && (
          <span className="text-xs font-medium text-primary-600">
            {activeDocumentIds.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
              <h3 className="font-semibold text-gray-900">Document Context</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Select documents to include in chat
              </p>
            </div>

            {/* Parsed Documents List */}
            <div className="max-h-64 overflow-y-auto">
              {parsedDocuments.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">
                    Parsed Documents ({parsedDocuments.length})
                  </div>
                  {parsedDocuments.map((doc) => {
                    const isActive = isDocumentActive(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => toggleDocument(doc.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-primary-500 border-primary-500'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isActive && <Check className="w-3 h-3 text-white" />}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {truncateFilename(doc.name)}
                            </span>
                          </div>
                          {doc.extractedKeywords && doc.extractedKeywords.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {doc.extractedKeywords.slice(0, 3).join(', ')}...
                            </p>
                          )}
                          {doc.parsedText && (
                            <p className="text-xs text-gray-400 mt-1">
                              {doc.parsedText.length} characters
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">No parsed documents yet</p>
                  <p className="text-xs mt-1">Upload and parse documents to use them in chat</p>
                </div>
              )}
            </div>

            {/* Upload New Document */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors text-sm font-medium text-gray-700"
                type="button"
              >
                <Upload className="w-4 h-4" />
                Upload New Document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
