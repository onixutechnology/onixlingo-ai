'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
// IMPORTA TU COMPONENTE CORRECTAMENTE SEGÚN TUS FOTOS
import PairingDrill from '@/components/lesson/vocabulary/PairingDrill'; // Verifica la ruta en tus fotos es components/lesson/vocabulary/PairingDrill.tsx
import LessonComplete from '@/components/lesson/LessonComplete'; 

export default function VocabularyLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        // En producción cambia esto a tu URL real
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
        
        // Asumiendo que tu backend sirve archivos estáticos o tiene un endpoint
        // OPCIÓN RÁPIDA: Si aún no tienes endpoint en backend, mueve los JSON a public/lessons en frontend para probar
        // PERO lo ideal es backend:
        const res = await fetch(`${API_URL}/api/v1/voclessons/${lessonId}`);
        
        if (!res.ok) {
            // FALLBACK PARA PRUEBAS SI EL BACKEND FALLA
            // Intenta cargar si lo pusieras en public folder (opcional)
            throw new Error("Lección no encontrada en el servidor.");
        }
        
        const data = await res.json();
        setLesson(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleExit = () => router.push('/dashboard/vocabulary');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md">
        <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-black text-slate-800 mb-2">Error de Carga</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={handleExit} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold w-full">
          Volver al Dashboard
        </button>
      </div>
    </div>
  );

  if (isComplete) return (
    <LessonComplete 
      xpEarned={lesson.total_xp} 
      accuracy={100} 
      onRetry={() => window.location.reload()}
      onExit={handleExit}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-200">
        <button onClick={handleExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="text-slate-400 hover:text-slate-800" />
        </button>
        <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Vocabulary Drill</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {lesson?.stages[0] && (
          <PairingDrill 
            stage={lesson.stages[0]}
            isPro={true}
            onCorrect={() => {}}
            onError={() => {}}
            onComplete={() => setIsComplete(true)}
          />
        )}
      </div>
    </div>
  );
}