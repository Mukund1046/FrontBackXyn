import React from 'react';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useChatDocumentStore } from '../../stores/useChatDocumentStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Trash2, FileText, CheckCircle } from 'lucide-react';

export const DocumentManager: React.FC = () => {
  const { documents, deleteDocument, updateDocument } = useDocumentStore();
  const { addDocument: addToChatContext } = useChatDocumentStore();

  const handleParse = async (doc: { id: string; isParsed?: boolean; name: string }) => {
    // Check if already parsed
    if (doc.isParsed) {
      const reparsed = confirm('This document is already parsed. Do you want to parse it again?');
      if (!reparsed) return;
    }

    const formData = new FormData();
    const docFromFileStore = documents.find(d => d.id === doc.id)
    if(!docFromFileStore) return
    
    const blob = new Blob([docFromFileStore.data], { type: docFromFileStore.type });

    formData.append('file', blob, docFromFileStore.name);

    try {
      // Parse document to get text
      const parseResponse = await fetch('http://localhost:8000/documents/parse', {
        method: 'POST',
        body: formData,
      });

      if (!parseResponse.ok) {
        const errorText = await parseResponse.text();
        console.error('Parse error:', errorText);
        throw new Error(`Failed to parse document: ${parseResponse.status}`);
      }

      const { text } = await parseResponse.json();
      console.log('Parsed text length:', text?.length);
      
      if (!text) {
        throw new Error('No text extracted from document');
      }

      // Simple keyword extraction from the text (client-side fallback)
      const words = text
        .toLowerCase()
        .split(/\W+/)
        .filter((word: string) => word.length > 4);
      
      const wordFreq: Record<string, number> = {};
      words.forEach((word: string) => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      const keywords = Object.entries(wordFreq)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);

      updateDocument(doc.id, { 
        extractedKeywords: keywords, 
        parsedText: text,
        isParsed: true,
        parsedAt: new Date()
      });

      // Auto-add to chat context
      addToChatContext(doc.id);
      
      alert(`Document parsed successfully!\n\nExtracted ${text.length} characters\n\nTop Keywords: ${keywords.slice(0, 5).join(', ')}\n\n✓ Added to chat context automatically`);
    } catch (error) { 
      console.error('Parse error:', error);
      alert(`Failed to parse document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Document Manager</h1>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <FileText className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{doc.name}</p>
                    {doc.isParsed && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Parsed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                  {doc.isParsed && doc.extractedKeywords && doc.extractedKeywords.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      Keywords: {doc.extractedKeywords.slice(0, 3).join(', ')}...
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  size="sm" 
                  onClick={() => handleParse(doc)}
                  variant={doc.isParsed ? "outline" : "default"}
                >
                  {doc.isParsed ? 'Re-parse' : 'Parse'}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteDocument(doc.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};