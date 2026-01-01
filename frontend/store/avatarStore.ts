import { create } from 'zustand';

// Definimos los tipos de datos que manejará nuestra tienda
type AvatarState = {
  // Estado del Robot
  gesture: 'idle' | 'nod' | 'shake' | 'happy' | 'thinking';
  isSpeaking: boolean;
  
  // Estado del Juego (Gamificación)
  xp: number;
  level: number;
  streak: number;

  // Acciones (Funciones para cambiar el estado)
  setGesture: (gesture: AvatarState['gesture']) => void;
  setSpeaking: (speaking: boolean) => void;
  
  // ESTA ES LA FUNCIÓN QUE FALTABA
  addXp: (amount: number) => void;
};

export const useAvatarStore = create<AvatarState>((set) => ({
  // Valores iniciales
  gesture: 'idle',
  isSpeaking: false,
  xp: 0,
  level: 1,
  streak: 1, // Racha inicial de 1 día

  // Funciones
  setGesture: (gesture) => set({ gesture }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),

  // Lógica para subir de nivel
  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    // Fórmula simple: Cada 100 puntos subes de nivel
    const newLevel = Math.floor(newXp / 100) + 1;
    
    return { 
      xp: newXp, 
      level: newLevel 
    };
  }),
}));