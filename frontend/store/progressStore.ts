import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LessonProgress {
  stars: number;
  score: number;
}

interface ProgressState {
  // Mapa de lecciones completadas: { 'a1-1': { stars: 3, score: 100 } }
  completedLessons: Record<string, LessonProgress>;
  
  // Acciones
  loadProgressFromDB: (data: Record<string, LessonProgress>) => void;
  completeLesson: (lessonId: string, score: number, stars: number) => void;
  
  // Getters (Selectores)
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonStars: (lessonId: string) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: {},

      // 1. CARGA MASIVA (Se usa al hacer Login)
      // Recibe el objeto de progreso de la BD y actualiza el estado local
      loadProgressFromDB: (data) => {
          console.log("📥 Sincronizando progreso desde Base de Datos...", data);
          set({ completedLessons: data });
      },

      // 2. COMPLETAR LECCIÓN (Lógica Híbrida)
      completeLesson: (lessonId, score, stars) => {
        // A. Actualización Local (Zustand + LocalStorage)
        // Esto hace que la UI se actualice instantáneamente (Optimistic UI)
        set((state) => {
          const current = state.completedLessons[lessonId];
          
          // Solo actualizamos si no existía o si el nuevo puntaje/estrellas es mejor
          if (!current || stars > current.stars) {
            return {
              completedLessons: {
                ...state.completedLessons,
                [lessonId]: { stars, score },
              },
            };
          }
          return state; // Si ya tenías 3 estrellas y sacaste 2, no hacemos nada
        });

        // B. Actualización en la Nube (Backend)
        // Verificamos si hay un usuario logueado en el navegador
        const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
        
        if (currentUser) {
            console.log(`☁️ Guardando progreso de ${currentUser} en la nube...`);
            fetch('http://127.0.0.1:8001/api/v1/save_progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: currentUser, 
                    lesson_id: lessonId, 
                    stars: stars 
                })
            })
            .then(res => res.json())
            .then(data => console.log("✅ Progreso guardado en DB:", data))
            .catch(err => console.error("❌ Error guardando en nube (Offline?):", err));
        }
      },

      // Helpers para la UI
      isLessonCompleted: (lessonId) => !!get().completedLessons[lessonId],
      getLessonStars: (lessonId) => get().completedLessons[lessonId]?.stars || 0,
    }),
    {
      name: 'onixlingo-progress', // Nombre de la key en localStorage
    }
  )
);