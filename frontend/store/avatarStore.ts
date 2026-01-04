import { create } from 'zustand';

// Tipos sincronizados con la IA
export type AvatarGesture = 
  | 'idle' 
  | 'talking' 
  | 'listening' 
  | 'thinking' 
  | 'happy' 
  | 'sad' 
  | 'surprise' 
  | 'explaining' 
  | 'confused';

type AvatarState = {
  // Estado Visual Puro
  gesture: AvatarGesture;
  isSpeaking: boolean;
  isListening: boolean; // Nuevo: Para reaccionar al micrófono del usuario

  // Acciones
  setGesture: (gesture: AvatarGesture) => void;
  setSpeaking: (speaking: boolean) => void;
  setListening: (listening: boolean) => void;
  resetAvatar: () => void;
};

export const useAvatarStore = create<AvatarState>((set) => ({
  gesture: 'idle',
  isSpeaking: false,
  isListening: false,

  setGesture: (gesture) => set({ gesture }),
  
  setSpeaking: (isSpeaking) => set({ 
    isSpeaking, 
    // Si habla, forzamos gesto de hablar. Si calla, volvemos a idle.
    gesture: isSpeaking ? 'talking' : 'idle' 
  }),

  setListening: (isListening) => set({ 
    isListening,
    // Si escucha, gesto de atención.
    gesture: isListening ? 'listening' : 'idle'
  }),

  resetAvatar: () => set({ gesture: 'idle', isSpeaking: false, isListening: false }),
}));