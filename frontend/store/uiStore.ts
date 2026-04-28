import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppMode = 'student' | 'professional';
type AppLanguage = 'en' | 'fr' | 'zh'; // 🌍 Tus 3 idiomas actuales

interface UIState {
  // Lógica del Modo de la App
  mode: AppMode;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
  
  // 🔥 Lógica del Idioma Activo
  activeLanguage: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Utilidades
  resetUI: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // 1. Estado inicial del Modo
      mode: 'student', 
      toggleMode: () => set((state) => ({ 
        mode: state.mode === 'student' ? 'professional' : 'student' 
      })),
      setMode: (mode) => set({ mode }),

      // 🔥 2. Estado inicial del Idioma (Inglés por defecto)
      activeLanguage: 'en',
      setLanguage: (lang) => set({ activeLanguage: lang }),

      // 3. Función de limpieza (Al hacer Logout)
      resetUI: () => {
        set({ 
          mode: 'student',
          activeLanguage: 'en' // 👈 También regresamos el idioma a inglés al cerrar sesión
        }); 
      }
    }),
    {
      name: 'onixlingo-ui-prefs', // 💾 Se guarda en localStorage automáticamente
    }
  )
);