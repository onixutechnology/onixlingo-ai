import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LessonProgress {
  stars: number;
  score: number;
}

interface ProgressState {
  // Datos Persistentes
  completedLessons: Record<string, LessonProgress>;
  totalXP: number; // Nuevo: Acumulador global
  streak: number;  // Nuevo: Días seguidos
  level: number;   // Nuevo: Nivel de jugador

  // Acciones
  loadProgressFromDB: (data: Record<string, LessonProgress>) => void;
  completeLesson: (lessonId: string, score: number, stars: number) => void;
  
  // Selectores
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonStars: (lessonId: string) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      totalXP: 0,
      streak: 1,
      level: 1,

      loadProgressFromDB: (data) => {
        // Al cargar, recalculamos XP basado en las lecciones traídas
        let calcXP = 0;
        Object.values(data).forEach(l => calcXP += (l.stars * 20)); // 20 XP por estrella
        
        set({ 
            completedLessons: data,
            totalXP: calcXP,
            level: Math.floor(calcXP / 500) + 1 // Nivel sube cada 500 XP
        });
      },

      completeLesson: (lessonId, score, stars) => {
        set((state) => {
          const current = state.completedLessons[lessonId];
          const isReplay = !!current;
          
          // Cálculo de XP ganado
          // Si es replay, solo damos la diferencia si mejoró. Si es nueva, todo.
          let xpGain = 0;
          if (!isReplay) {
              xpGain = 50 + (stars * 10); // Base 50 + Bonus Estrellas
          } else if (stars > current.stars) {
              xpGain = (stars - current.stars) * 10; // Solo diferencia de estrellas
          }

          const newXP = state.totalXP + xpGain;
          const newLevel = Math.floor(newXP / 500) + 1;

          // Actualizar estado local
          const newState = {
            totalXP: newXP,
            level: newLevel,
            completedLessons: {
              ...state.completedLessons,
              [lessonId]: { stars: Math.max(stars, current?.stars || 0), score: Math.max(score, current?.score || 0) }
            }
          };

          // Sincronización Backend (Fire & Forget)
          const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
          const API_URL = process.env.NEXT_PUBLIC_API_URL;

          if (currentUser && API_URL) {
            fetch(`${API_URL}/api/v1/save_progress`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                username: currentUser, 
                lesson_id: lessonId, 
                stars: stars 
              })
            }).catch(e => console.warn("Sync error:", e));
          }

          return newState;
        });
      },

      isLessonCompleted: (id) => !!get().completedLessons[id],
      getLessonStars: (id) => get().completedLessons[id]?.stars || 0,
    }),
    { name: 'onixlingo-progress' }
  )
);