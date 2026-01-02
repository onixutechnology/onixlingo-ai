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
      loadProgressFromDB: (data) => {
          console.log("📥 Sincronizando progreso desde Base de Datos...", data);
          set({ completedLessons: data });
      },

      // 2. COMPLETAR LECCIÓN (Lógica Híbrida)
      completeLesson: (lessonId, score, stars) => {
        // A. Actualización Local (Zustand + LocalStorage) - Optimistic UI
        set((state) => {
          const current = state.completedLessons[lessonId];
          
          // Solo actualizamos si no existía o si el nuevo puntaje es mejor
          if (!current || stars > current.stars) {
            return {
              completedLessons: {
                ...state.completedLessons,
                [lessonId]: { stars, score },
              },
            };
          }
          return state; 
        });

        // B. Actualización en la Nube (Backend Dinámico)
        const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
        
        if (currentUser) {
            // ---------------------------------------------------------
            // 🚀 AQUÍ ESTÁ LA MAGIA: USA LA VARIABLE DE ENTORNO
            // ---------------------------------------------------------
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            if (!API_URL) {
                console.error("❌ ERROR CRÍTICO: No se encontró NEXT_PUBLIC_API_URL. Revisa tu .env.local o Vercel.");
                return;
            }

            console.log(`☁️ Guardando progreso en: ${API_URL}`);
            
            fetch(`${API_URL}/api/v1/save_progress`, {  // <--- ¡CORREGIDO!
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: currentUser, 
                    lesson_id: lessonId, 
                    stars: stars 
                })
            })
            .then(res => {
                if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
                return res.json();
            })
            .then(data => console.log("✅ Progreso guardado en Nube:", data))
            .catch(err => console.error("❌ Error conectando con Backend:", err));
        }
      },

      // Helpers
      isLessonCompleted: (lessonId) => !!get().completedLessons[lessonId],
      getLessonStars: (lessonId) => get().completedLessons[lessonId]?.stars || 0,
    }),
    {
      name: 'onixlingo-progress', 
    }
  )
);