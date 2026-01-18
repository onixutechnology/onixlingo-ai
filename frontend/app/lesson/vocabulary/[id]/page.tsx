'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, X, Volume2, VolumeX, RefreshCcw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

// --- IMPORTACIÓN DE COMPONENTES ---
import PairingDrill from '@/components/lesson/vocabulary/PairingDrill'; 
import LessonComplete from '@/components/lesson/LessonComplete';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

// --- TIPOS STRICTOS (Punto 19) ---
interface Pair {
  id: string;
  en: string;
  es: string;
}

interface VocabularyStage {
  id: string;
  type: string;
  title: string;
  description?: string;
  pairs?: Pair[];
  data_refs?: string[];
}

interface VocabularyLesson {
  id: string;
  title: string;
  total_xp: number;
  stages: VocabularyStage[];
  content_data?: any[];
}

export default function VocabularyLessonPage() {
  const params = useParams();
  const router = useRouter();
  
  // Manejo defensivo del ID (Punto 23)
  const lessonId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // --- ESTADOS ---
  const [lesson, setLesson] = useState<VocabularyLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  
  // UX States
  const [showExitConfirm, setShowExitConfirm] = useState(false); // (Punto 11)
  const [isMuted, setIsMuted] = useState(false); // (Punto 13)
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. CARGA DE DATOS ROBUSTA ---
  const fetchLesson = useCallback(async () => {
    if (!lessonId) return;
    
    // (Punto 20) AbortController para cancelar peticiones si desmonta
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/v1/voclessons/${lessonId}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 404) throw new Error("Lección no encontrada.");
        throw new Error("Error de conexión con el servidor.");
      }
      
      const data = await res.json();
      if (!data.stages || data.stages.length === 0) throw new Error("Esta lección no tiene contenido válido.");

      setLesson(data);
      // (Punto 18) Actualizar título documento
      document.title = `${data.title} | OnixLingo Vocab`;

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Fetch error:", err);
        setError(err.message || "Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  // --- 2. MANEJO DE TECLADO (Punto 12) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowExitConfirm(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- 3. FINALIZAR LECCIÓN & GUARDADO (Punto 26) ---
  const handleLessonComplete = async () => {
    if (!lesson) return;
    setIsSaving(true);

    try {
        const token = Cookies.get('access_token'); // (Punto 27)
        if (token) {
            await fetch(`${API_URL}/api/v1/progress/complete`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lesson_id: lesson.id,
                    lesson_type: 'vocab', // Tipo específico para vocabulario
                    current_step: 1,      // Vocabulario suele ser 1 etapa grande
                    total_steps: 1,
                    score: 100,           // Vocabulario se completa o no (no hay nota parcial)
                    stars: 3
                })
            });
        }
        // (Punto 14) Haptic feedback si es móvil
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        
    } catch (e) {
        console.error("Error guardando progreso en background", e);
    } finally {
        setIsSaving(false);
        setIsLessonComplete(true);
    }
  };

  const handleExit = () => router.push('/dashboard/vocabulary');

  // --- DATOS COMPUTADOS (Punto 24) ---
  const currentStage = useMemo(() => {
    if (!lesson) return null;
    return lesson.stages.find((s) => s.type === 'pairing_drill') || lesson.stages[0];
  }, [lesson]);

  const pairs = useMemo(() => {
    return currentStage?.pairs || [];
  }, [currentStage]);


  // =========================================================
  // RENDERS DE ESTADO (Skeleton & Error mejorados)
  // =========================================================

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
        {/* (Punto 4) Skeleton UI */}
        <div className="w-full max-w-4xl p-8 space-y-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded-full w-1/3 mx-auto"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                ))}
            </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        </div>
    </div>
  );

  if (error || !lesson) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-slate-100"
      >
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Ups, algo salió mal</h2>
        <p className="text-slate-500 mb-6">{error || "No pudimos cargar el contenido."}</p>
        <div className="flex gap-3">
            <button onClick={() => router.back()} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                Volver
            </button>
            <button onClick={fetchLesson} className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                <RefreshCcw size={18} /> Reintentar
            </button>
        </div>
      </motion.div>
    </div>
  );

  // Pantalla de Éxito
  if (isLessonComplete) return (
    <LessonComplete 
       xpEarned={lesson.total_xp} 
       accuracy={100} 
       onRetry={() => window.location.reload()}
       onExit={handleExit}
       lessonId={lessonId as string}
       lessonType="vocab"
       totalSteps={1}
    />
  );

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================
  return (
    // (Punto 1) Fondo degradado sutil
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* (Punto 3) Entrada suave */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        {/* HEADER (Punto 2: Glassmorphism) */}
        <header className="px-6 h-20 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm transition-all">
          
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowExitConfirm(true)} 
                className="p-2.5 -ml-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-red-500 active:scale-95"
                aria-label="Salir de la lección" // (Punto 29)
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            
            {/* (Punto 13) Mute Button */}
            <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all active:scale-95"
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          <div className="font-bold text-slate-700 truncate max-w-[150px] md:max-w-md text-center">
              {lesson.title}
          </div>

          <div className="w-[88px] flex justify-end"> {/* Espaciador para equilibrar el header */}
             <div className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                {pairs.length} Cards
             </div>
          </div>
        </header>

        {/* ÁREA DE JUEGO */}
        <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
          
          {/* Renderizamos tu componente potente */}
          <PairingDrill 
              stage={currentStage || { title: 'Drill' }} // Fallback seguro
              pairs={pairs} 
              isPro={true} // Siempre activamos el modo diseño PRO
              onComplete={handleLessonComplete}
              onCorrect={() => {
                  // (Punto 25) Sonido condicional
                  if (!isMuted) {
                      const audio = new Audio('/sounds/correct.mp3'); // Asegúrate de tener este archivo o usa Speech
                      audio.volume = 0.5;
                      audio.play().catch(() => {}); // Ignora error si no hay interacción previa
                  }
              }} 
              onError={() => {
                  if (!isMuted && navigator.vibrate) navigator.vibrate(200);
              }}
          />

        </main>
      </motion.div>

      {/* (Punto 11) MODAL DE CONFIRMACIÓN DE SALIDA */}
      <AnimatePresence>
        {showExitConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100"
                >
                    <h3 className="text-xl font-black text-slate-800 mb-2">¿Abandonar lección?</h3>
                    <p className="text-slate-500 mb-6 text-sm">Perderás el progreso de esta sesión si sales ahora.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowExitConfirm(false)}
                            className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Quedarse
                        </button>
                        <button 
                            onClick={handleExit}
                            className="flex-1 py-3 font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Salir
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}