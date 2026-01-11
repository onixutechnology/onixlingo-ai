import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppMode = 'student' | 'professional';

interface UIState {
  mode: AppMode;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
  resetUI: () => void; // 👈 1. Agregamos la definición
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      mode: 'student', 

      toggleMode: () => set((state) => ({ 
        mode: state.mode === 'student' ? 'professional' : 'student' 
      })),
      
      setMode: (mode) => set({ mode }),

      // 👇 2. Implementamos la función de limpieza
      resetUI: () => {
        set({ mode: 'student' }); // Regresa al estado base
        // Opcional: Si quieres borrar la key del storage completamente:
        // localStorage.removeItem('onixlingo-ui-prefs'); 
      }
    }),
    {
      name: 'onixlingo-ui-prefs', 
    }
  )
);