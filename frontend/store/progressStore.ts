import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Definición de tipos para los datos de una lección
interface LessonProgress {
  stars: number;
  completedAt: string;
}

// Interfaz del Estado Global de Progreso
interface ProgressState {
  // --- ESTADO ---
  xp: number;
  streak: number;
  completedLessons: Record<string, LessonProgress>;

  // --- ACCIONES (Setters) ---
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, stars: number) => void;
  loadProgressFromDB: (data: any) => void;

  // --- SELECTORES (Getters) ---
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonStars: (lessonId: string) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // 1. Valores Iniciales
      xp: 0,
      streak: 1, // Podrías conectar esto a lógica de fechas real luego
      completedLessons: {},

      // 2. Función para sumar XP (Usada en el Chat/Práctica)
      addXp: (amount: number) => set((state) => ({
        xp: state.xp + amount
      })),

      // 3. Función al terminar una lección
      completeLesson: (lessonId, stars) => set((state) => {
        const currentProgress = state.completedLessons[lessonId];
        const currentStars = currentProgress?.stars || 0;

        // Calculamos XP ganada (ej: 10 XP por estrella)
        const xpGained = stars * 10;

        return {
          xp: state.xp + xpGained, // Siempre sumamos XP por el esfuerzo
          completedLessons: {
            ...state.completedLessons,
            [lessonId]: {
              // Guardamos el mayor número de estrellas obtenido (High Score)
              stars: Math.max(currentStars, stars),
              completedAt: new Date().toISOString()
            }
          }
        };
      }),

      // 4. Cargar datos desde Backend (Sincronización)
      loadProgressFromDB: (data) => {
        if (data && typeof data === 'object') {
          // Asumimos que 'data' viene con la estructura correcta del backend
          set((state) => ({
            completedLessons: data.completedLessons || state.completedLessons,
            xp: data.xp || state.xp,
            streak: data.streak || state.streak
          }));
        }
      },

      // 5. Verificadores (Helpers para la UI)
      isLessonCompleted: (lessonId) => {
        return !!get().completedLessons[lessonId];
      },

      getLessonStars: (lessonId) => {
        return get().completedLessons[lessonId]?.stars || 0;
      }
    }),
    {
      name: 'onixlingo-progress', // Nombre de la 'cookie' en localStorage
      storage: createJSONStorage(() => localStorage), // Persistencia explícita
    }
  )
);