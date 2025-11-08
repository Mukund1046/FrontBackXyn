import { create } from 'zustand';

export interface Document {
  id: string;
  name: string;
  type: string;
  data: ArrayBuffer;
  extractedKeywords?: string[];
  parsedText?: string;
  isParsed?: boolean;
  parsedAt?: Date;
}

export interface DocumentStore {
  documents: Document[];
  addDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  loadDocuments: () => Promise<void>;
}

const DB_NAME = 'XynDB';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],

  loadDocuments: async () => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      set({ documents: request.result });
    };
  },

  addDocument: (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const db = await openDB();
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);

          const document: Document = {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            data: reader.result as ArrayBuffer,
          };
          store.add(document);

          transaction.oncomplete = () => {
            set((state) => ({ documents: [...state.documents, document] }));
            resolve();
          };

          transaction.onerror = () => {
            reject(transaction.error);
          };
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
  },

  deleteDocument: async (id: string) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    set((state) => ({ documents: state.documents.filter((doc) => doc.id !== id) }));
  },

  updateDocument: async (id: string, updates: Partial<Document>) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const doc = request.result;
      if (doc) {
        const updatedDoc = { ...doc, ...updates };
        store.put(updatedDoc);
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? updatedDoc : d)),
        }));
      }
    };
  },
}));