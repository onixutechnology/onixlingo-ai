import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppMode = 'student' | 'professional';
type AppLanguage = 'en' | 'fr' | 'zh'; // 🌍 Tus 3 idiomas actuales
type UserTier = 'free' | 'pro' | 'executive';

interface UIState {
  // Lógica del Modo de la App
  mode: AppMode;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
  
  // 🔥 Lógica del Idioma Activo
  activeLanguage: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // 🔥 NUEVO: Tier de suscripción del usuario
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;

  // 🔥 NUEVA LÓGICA DE ENERGÍA Y LÍMITES DIARIOS PARA EL PLAN FREE
  energy: number;
  lastActiveDate: string;
  lastEnergyUpdateTimestamp: number;
  vocabLessonsToday: number;
  chessPuzzlesToday: number;
  
  setEnergy: (energy: number) => void;
  regenerateEnergy: () => void;
  consumeEnergy: (amount: number) => boolean;
  addVocabLesson: () => void;
  addChessPuzzle: () => void;
  refillEnergy: () => void;
  checkAndResetDailyLimits: () => void;

  // Utilidades
  resetUI: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // 1. Estado inicial del Modo
      mode: 'student', 
      toggleMode: () => set((state) => ({ 
        mode: state.mode === 'student' ? 'professional' : 'student' 
      })),
      setMode: (mode) => set({ mode }),

      // 🔥 2. Estado inicial del Idioma (Inglés por defecto)
      activeLanguage: 'en',
      setLanguage: (lang) => set({ activeLanguage: lang }),

      // 🔥 3. Estado inicial del Tier de suscripción
      userTier: 'free',
      setUserTier: (tier) => set({ userTier: tier }),

      // 🔥 4. Lógica de Energía y Límites Diarios (Plan Free)
      energy: 100,
      lastActiveDate: '',
      lastEnergyUpdateTimestamp: Date.now(),
      vocabLessonsToday: 0,
      chessPuzzlesToday: 0,

      setEnergy: (energy) => set({ 
        energy: Math.max(0, Math.min(100, energy)),
        lastEnergyUpdateTimestamp: Date.now()
      }),
      
      regenerateEnergy: () => {
        const lastUpdate = get().lastEnergyUpdateTimestamp || Date.now();
        const now = Date.now();
        const minutesPassed = Math.floor((now - lastUpdate) / 60000);
        
        if (minutesPassed > 0) {
          const currentEnergy = get().energy;
          if (currentEnergy < 100) {
            const newEnergy = Math.min(100, currentEnergy + minutesPassed);
            set({ 
              energy: newEnergy,
              lastEnergyUpdateTimestamp: lastUpdate + (minutesPassed * 60000)
            });
          } else {
             set({ lastEnergyUpdateTimestamp: now });
          }
        }
      },
      
      consumeEnergy: (amount) => {
        if (get().userTier !== 'free') {
          return true; // No consume energía si es Premium (Pro o Executive)
        }
        
        get().checkAndResetDailyLimits(); // Asegurar límites al día
        get().regenerateEnergy(); // Regenerar energía antes de consumir

        const currentEnergy = get().energy;
        
        if (currentEnergy >= amount) {
          set({ 
            energy: currentEnergy - amount,
            lastEnergyUpdateTimestamp: Date.now()
          });
          return true;
        }
        return false;
      },

      addVocabLesson: () => {
        get().checkAndResetDailyLimits();
        set((state) => ({
          vocabLessonsToday: state.vocabLessonsToday + 1
        }));
      },

      addChessPuzzle: () => {
        get().checkAndResetDailyLimits();
        set((state) => ({
          chessPuzzlesToday: state.chessPuzzlesToday + 1
        }));
      },

      refillEnergy: () => set({ energy: 100, lastEnergyUpdateTimestamp: Date.now() }),

      checkAndResetDailyLimits: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastActiveDate !== today) {
          set({
            lastActiveDate: today,
            vocabLessonsToday: 0,
            chessPuzzlesToday: 0,
            energy: 100, // Se recarga a 100 al iniciar un nuevo día
            lastEnergyUpdateTimestamp: Date.now()
          });
        }
      },

      // 5. Función de limpieza (Al hacer Logout)
      resetUI: () => {
        set({ 
          mode: 'student',
          activeLanguage: 'en', 
          userTier: 'free',
          energy: 100,
          lastActiveDate: '',
          lastEnergyUpdateTimestamp: Date.now(),
          vocabLessonsToday: 0,
          chessPuzzlesToday: 0
        }); 
      }
    }),
    {
      name: 'onixlingo-ui-prefs', // 💾 Se guarda en localStorage automáticamente
    }
  )
);