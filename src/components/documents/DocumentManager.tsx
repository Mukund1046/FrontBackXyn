import React from 'react';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Trash2, FileText } from 'lucide-react';

export const DocumentManager: React.FC = () => {
  const { documents, deleteDocument, updateDocument } = useDocumentStore();

  const handleParse = async (doc: any) => {
    const formData = new FormData();
    const docFromFileStore = documents.find(d => d.id === doc.id)
    if(!docFromFileStore) return
    
    const blob = new Blob([docFromFileStore.data], { type: docFromFileStore.type });

    formData.append('file', blob, docFromFileStore.name);

    try {
      const response = await fetch('http://localhost:8000/documents/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse document');
      }

      const { keywords } = await response.json();
      updateDocument(doc.id, { extractedKeywords: keywords });
      alert(`Extracted Keywords: ${keywords.join(', ')}`);
    } catch (error) { 
      console.error(error);
      alert('Failed to parse document');
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
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6" />
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleParse(doc)}>Parse</Button>
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