import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppMode = 'student' | 'professional';

interface UIState {
  mode: AppMode;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      mode: 'student', // Por defecto
      
      toggleMode: () => set((state) => ({ 
        mode: state.mode === 'student' ? 'professional' : 'student' 
      })),
      
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'onixlingo-ui-prefs', // Se guarda en localStorage
    }
  )
);