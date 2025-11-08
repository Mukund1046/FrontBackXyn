import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatDocumentStore {
  activeDocumentIds: string[];
  addDocument: (docId: string) => void;
  removeDocument: (docId: string) => void;
  toggleDocument: (docId: string) => void;
  clearAll: () => void;
  isDocumentActive: (docId: string) => boolean;
}

export const useChatDocumentStore = create<ChatDocumentStore>()(
  persist(
    (set, get) => ({
      activeDocumentIds: [],

      addDocument: (docId: string) => {
        set((state) => {
          if (!state.activeDocumentIds.includes(docId)) {
            return { activeDocumentIds: [...state.activeDocumentIds, docId] };
          }
          return state;
        });
      },

      removeDocument: (docId: string) => {
        set((state) => ({
          activeDocumentIds: state.activeDocumentIds.filter((id) => id !== docId),
        }));
      },

      toggleDocument: (docId: string) => {
        const state = get();
        if (state.activeDocumentIds.includes(docId)) {
          state.removeDocument(docId);
        } else {
          state.addDocument(docId);
        }
      },

      clearAll: () => {
        set({ activeDocumentIds: [] });
      },

      isDocumentActive: (docId: string) => {
        return get().activeDocumentIds.includes(docId);
      },
    }),
    {
      name: 'chat-documents-storage',
    }
  )
);
