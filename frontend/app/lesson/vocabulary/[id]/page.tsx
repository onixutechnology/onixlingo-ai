'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, AlertTriangle, X } from 'lucide-react';

// --- IMPORTACIÓN DE COMPONENTES ---
import PairingDrill from '@/components/lesson/vocabulary/PairingDrill'; 
import LessonComplete from '@/components/lesson/LessonComplete';

export default function VocabularyLessonPage() {
  const params = useParams();
  const router = useRouter();
  
  const lessonId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // --- ESTADOS ---
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // 1. CARGA DE DATOS
  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
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

  // 2. LÓGICA DE AVANCE
  const handleStageComplete = () => {
    if (!lesson) return;
    setTimeout(() => {
        if (currentStageIndex < lesson.stages.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
            window.scrollTo(0, 0); 
        } else {
            setIsLessonComplete(true);
        }
    }, 500);
  };

  const handleExit = () => router.push('/dashboard/vocabulary');

  // --- RENDERS DE ESTADO ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
      <p className="text-slate-500 font-medium">Cargando...</p>
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
      accuracy={100} 
      onRetry={() => window.location.reload()}
      onExit={handleExit}
    />
  );

  // --- PREPARACIÓN INTELIGENTE DE DATOS ---
  const currentStage = lesson.stages[currentStageIndex];
  
  let stagePayload: any[] = [];
  
  // A. Prioridad: Pares directos en la etapa (JSON nuevo de 50 palabras)
  if (currentStage.pairs && Array.isArray(currentStage.pairs)) {
    stagePayload = currentStage.pairs;
  } 
  // B. Fallback: Referencias a content_data (JSON antiguo complejo)
  else if (currentStage.data_refs && lesson.content_data) {
    stagePayload = currentStage.data_refs
      .map((refId: string) => lesson.content_data.find((item: any) => item.id === refId))
      .filter(Boolean);
  }
  // C. Último recurso: Todo content_data disponible
  else if (lesson.content_data) {
    stagePayload = lesson.content_data;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="px-6 h-20 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-10">
        <button onClick={handleExit} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
          <X size={24} />
        </button>
        
        <div className="flex-1 max-w-md mx-4 flex flex-col gap-1">
           <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <span>{currentStage.title || `Stage ${currentStageIndex + 1}`}</span>
             <span>{Math.round(((currentStageIndex) / lesson.stages.length) * 100)}%</span>
           </div>
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-indigo-500 transition-all duration-700 ease-out rounded-full"
               style={{ width: `${((currentStageIndex + 1) / lesson.stages.length) * 100}%` }}
             />
           </div>
        </div>
        <div className="w-8"></div>
      </header>

      {/* ÁREA DE JUEGO */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* FLASHCARDS */}
        {currentStage.type === 'flashcard_flow' && (
           <div className="w-full max-w-4xl text-center p-10 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-100/50">
             <h3 className="text-xl font-bold text-slate-400 mb-4">Flashcards (Coming Soon)</h3>
             <button onClick={handleStageComplete} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Simular Completar</button>
           </div>
        )}

        {/* PAIRING DRILL */}
        {currentStage.type === 'pairing_drill' && (
          <PairingDrill 
            stage={currentStage}  
            pairs={stagePayload}
            onComplete={handleStageComplete}
            onCorrect={() => {}} 
            onError={() => {}}
            isPro={true} 
          />
        )}

        {/* SENTENCE BUILDER */}
        {currentStage.type === 'sentence_builder' && (
           <div className="w-full max-w-4xl text-center p-10 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-100/50">
             <h3 className="text-xl font-bold text-slate-400 mb-4">Sentence Builder (Coming Soon)</h3>
             <button onClick={handleStageComplete} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Simular Completar</button>
           </div>
        )}

        {/* ERROR DE TIPO */}
        {!['flashcard_flow', 'pairing_drill', 'sentence_builder'].includes(currentStage.type) && (
            <div className="text-center text-red-500">
                <p>Tipo desconocido: <code>{currentStage.type}</code></p>
                <button onClick={handleStageComplete} className="underline mt-2">Saltar</button>
            </div>
        )}

      </main>
    </div>
  );
}