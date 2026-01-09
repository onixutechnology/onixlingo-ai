import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LessonProgress {
  stars: number;
  score: number;
}

interface ProgressState {
  // Datos Persistentes
  completedLessons: Record<string, LessonProgress>;
  totalXP: number; 
  streak: number;  
  level: number;   

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
        let calcXP = 0;
        Object.values(data).forEach(l => calcXP += (l.stars * 20));
        
        set({ 
            completedLessons: data,
            totalXP: calcXP,
            level: Math.floor(calcXP / 500) + 1 
        });
      },

      completeLesson: (lessonId, score, stars) => {
        set((state) => {
          const current = state.completedLessons[lessonId];
          const isReplay = !!current;
          
          let xpGain = 0;
          if (!isReplay) {
              xpGain = 50 + (stars * 10); 
          } else if (stars > current.stars) {
              xpGain = (stars - current.stars) * 10; 
          }

          const newXP = state.totalXP + xpGain;
          const newLevel = Math.floor(newXP / 500) + 1;

          const newState = {
            totalXP: newXP,
            level: newLevel,
            completedLessons: {
              ...state.completedLessons,
              [lessonId]: { stars: Math.max(stars, current?.stars || 0), score: Math.max(score, current?.score || 0) }
            }
          };

          // --- SINCRONIZACIÓN INTELIGENTE (HYBRID BACKEND) ---
          const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
          
          // 🧠 DETECCIÓN AUTOMÁTICA DE ENTORNO
          const BASE_URL = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8000'                  // Local
            : 'https://onixlingo-bckend.onrender.com'; // Nube (Render)

          if (currentUser) {
            console.log(`💾 Guardando progreso en: ${BASE_URL}`);
            
            fetch(`${BASE_URL}/api/v1/save_progress`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                username: currentUser, 
                lesson_id: lessonId, 
                stars: stars 
              })
            }).catch(e => console.warn("❌ Error guardando progreso:", e));
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