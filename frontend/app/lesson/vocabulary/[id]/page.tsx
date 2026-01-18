'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, AlertTriangle, X } from 'lucide-react';
import Cookies from 'js-cookie';

// 👇 Importamos TU componente nuevo
import PairingDrill from '@/components/lesson/vocabulary/PairingDrill'; 
import LessonComplete from '@/components/lesson/LessonComplete';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

export default function VocabularyLessonPage() {
  const params = useParams();
  const router = useRouter();
  
  const lessonId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // --- ESTADOS ---
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // 1. CARGA DE DATOS
  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        // Ajusta la URL si usas localhost o render
        const res = await fetch(`${API_URL}/api/v1/voclessons/${lessonId}`);
        
        if (!res.ok) throw new Error("No se pudo conectar con el servidor.");
        
        const data = await res.json();
        if (!data.stages || data.stages.length === 0) throw new Error("Lección vacía.");

        setLesson(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // 2. FINALIZAR LECCIÓN
  const handleLessonComplete = async () => {
    // Aquí puedes agregar la lógica de guardado en el backend
    // Similar a la función finishLesson de tu otro archivo
    setIsLessonComplete(true);
  };

  const handleExit = () => router.push('/dashboard/vocabulary');

  // --- RENDERS DE ESTADO ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
      <p className="text-slate-500 font-medium">Cargando vocabulario...</p>
    </div>
  );

  if (error || !lesson) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-slate-100">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={32} />
        <h2 className="text-2xl font-black text-slate-800 mb-2">Error</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={handleExit} className="bg-slate-900 text-white px-6 py-3 rounded-xl w-full">Volver</button>
      </div>
    </div>
  );

  if (isLessonComplete) return (
    <LessonComplete 
       xpEarned={lesson.total_xp} 
       accuracy={100} // En vocabulario siempre es 100% al terminar
       onRetry={() => window.location.reload()}
       onExit={handleExit}
       lessonId={lessonId as string}
       lessonType="vocab"
       totalSteps={1}
    />
  );

  // --- DATOS ---
  // Tomamos la primera etapa que tenga pares
  const currentStage = lesson.stages.find((s: any) => s.type === 'pairing_drill') || lesson.stages[0];
  
  // EXTRAEMOS LOS PARES DIRECTAMENTE (Tu PairingDrill ya sabe leer 'en' y 'es')
  const pairs = currentStage.pairs || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="px-6 h-20 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-10">
        <button onClick={handleExit} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <X size={24} />
        </button>
        <div className="font-bold text-slate-700 truncate max-w-[200px]">
            {lesson.title}
        </div>
        <div className="w-8"></div>
      </header>

      {/* ÁREA DE JUEGO */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
        
        {/* Renderizamos tu componente potente */}
        <PairingDrill 
            stage={currentStage}
            pairs={pairs} // 👈 Pasamos los datos crudos (en/es), el componente hace el resto
            isPro={true}
            onComplete={handleLessonComplete}
            onCorrect={() => {}} // Opcional: Sonido
            onError={() => {}}   // Opcional: Vibración
        />

      </main>
    </div>
  );
}