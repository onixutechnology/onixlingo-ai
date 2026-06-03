'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, X, Volume2, VolumeX, RefreshCcw, Home, Sparkles, ChevronRight, ArrowLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { useUIStore } from '@/store/uiStore';

// --- IMPORTACIÓN DE COMPONENTES ---
import PairingDrill from '@/components/lesson/vocabulary/PairingDrill'; 
import LessonComplete from '@/components/lesson/LessonComplete';

// ✅ URL INTELIGENTE: Usa la de Vercel en la nube, o Localhost en tu casa
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

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
  const { activeLanguage, userTier, energy, vocabLessonsToday, checkAndResetDailyLimits } = useUIStore();
  
  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

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

  // 💾 RETOMAR PROGRESO VOCABULARIO
  const [savedProgressIds, setSavedProgressIds] = useState<string[]>([]);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [pendingResumeState, setPendingResumeState] = useState<any>(null);
  const [drillKey, setDrillKey] = useState(0);

  // --- DIFICULTAD Y TIEMPO ---
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'pro'>('easy');
  const [hasSelectedDifficulty, setHasSelectedDifficulty] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [timerActive, setTimerActive] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let intervalId: any;
    if (timerActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            setShowTimeUpModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (lessonId && lesson && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`session_vocab_${lessonId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.completedIds && parsed.completedIds.length > 0) {
            setPendingResumeState(parsed);
            setShowResumePrompt(true);
          }
        } catch (e) {}
      }
    }
  }, [lessonId, lesson]);

  // --- 1. CARGA DE DATOS ROBUSTA ---
  const fetchLesson = useCallback(async () => {
    if (!lessonId) return;
    
    // (Punto 20) AbortController para cancelar peticiones si desmonta
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/v1/voclessons/${lessonId}?lang=${activeLanguage}`, {
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
    setTimerActive(false); // Parar temporizador
    if (!lesson) return;
    setIsSaving(true);

    // Consume energía y actualiza el contador diario si es plan gratuito
    const { consumeEnergy, addVocabLesson, userTier } = useUIStore.getState();
    if (userTier === 'free') {
      consumeEnergy(30);
      addVocabLesson();
    }

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
                    stars: 3,
                    difficulty_completed: difficulty, // 🔥 Enviamos dificultad elegida
                    language: activeLanguage
                })
            });
        }
        // (Punto 14) Haptic feedback si es móvil
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(`session_vocab_${lessonId}`);
        }
        
    } catch (e) {
        console.error("Error guardando progreso en background", e);
    } finally {
        setIsSaving(false);
        setIsLessonComplete(true);
    }
  };

  const handleExit = useCallback(() => {
    if (!isLessonComplete && lesson && typeof window !== 'undefined') {
      localStorage.setItem(`session_vocab_${lessonId}`, JSON.stringify({
        completedIds: savedProgressIds,
        timestamp: Date.now()
      }));
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem(`session_vocab_${lessonId}`);
    }
    router.push('/dashboard/vocabulary');
  }, [router, isLessonComplete, lesson, lessonId, savedProgressIds]);

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

  if (userTier === 'free' && (vocabLessonsToday >= 1 || energy < 30)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 relative overflow-hidden font-sans">
        {/* Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500"></div>
        
        <div className="bg-slate-950/80 border border-slate-800 p-10 max-w-md w-full shadow-2xl rounded-none text-center relative z-10 backdrop-blur-md">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-serif font-black italic uppercase tracking-wider text-indigo-400 mb-2">
            {vocabLessonsToday >= 1 ? "Límite Diario Alcanzado" : "Energía Insuficiente"}
          </h2>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-8 uppercase tracking-wider">
            {vocabLessonsToday >= 1 
              ? "En el Plan Free estás limitado a 1 lección de vocabulario (bloque de 50 palabras) al día." 
              : `Completar una lección de vocabulario consume 30% de energía. Tu energía actual es de ${energy}%.`}
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/dashboard/pricing')}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none shadow-lg shadow-indigo-600/30"
            >
              Subir a Pro / Executive
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 border border-slate-700 bg-transparent text-slate-400 hover:text-white font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  // Pantalla de Selección de Dificultad
  if (!hasSelectedDifficulty && lesson) {
    const isPremium = userTier === 'pro' || userTier === 'executive';

    const difficultyOptions = [
      { 
        id: 'easy', 
        title: 'Nivel Fácil (Easy)', 
        time: 'Sin tiempo límite', 
        desc: isPremium 
          ? 'Aprende y asocia palabras sin presión. Otorga 1 boleto para el sorteo mensual.'
          : 'Aprende y asocia palabras sin presión. Excelente para practicar.',
        badge: isPremium ? '1 Boleto de Sorteo' : '0 Boletos (Plan Free)',
        badgeColor: isPremium 
          ? 'bg-amber-50 text-amber-800 border-amber-200' 
          : 'bg-slate-100 text-slate-500 border-slate-200'
      },
      { 
        id: 'medium', 
        title: 'Nivel Medio (Medium)', 
        time: 'Límite de 3 Minutos', 
        desc: isPremium
          ? 'Pon a prueba tu rapidez mental básica bajo el reloj. Otorga 2 boletos para el sorteo.'
          : 'Pon a prueba tu rapidez mental básica bajo el reloj (3:00 min).',
        badge: isPremium ? '2 Boletos de Sorteo' : '0 Boletos (Plan Free)',
        badgeColor: isPremium 
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-slate-100 text-slate-500 border-slate-200'
      },
      { 
        id: 'pro', 
        title: 'Nivel Pro (Rápido)', 
        time: 'Límite de 1 Minuto 30 Segundos', 
        desc: isPremium
          ? 'Para maestros del vocabulario. ¡Vale por 5 BOLETOS para el sorteo de recompensas!'
          : 'Para maestros del vocabulario. Módulo avanzado con límite de tiempo estricto (1:30 min).',
        badge: isPremium ? '5 Boletos (PRO/Exec)' : '0 Boletos (Plan Free)',
        badgeColor: isPremium 
          ? 'bg-amber-100 text-amber-800 border-amber-300'
          : 'bg-slate-100 text-slate-500 border-slate-200'
      }
    ];

    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/95 text-slate-900 p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/40 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-amber-500"></div>
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border border-amber-100 p-8 max-w-xl w-full shadow-2xl rounded-none relative z-10 backdrop-blur-md"
        >
          <div className="flex justify-between items-start mb-6">
            <button 
              onClick={() => router.push('/dashboard/vocabulary')}
              className="p-2 border border-slate-200 text-slate-500 hover:text-amber-700 hover:border-amber-500 transition-all rounded-none bg-white"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="text-center">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-600">Selector de Nivel</span>
              <h2 className="text-lg font-serif font-black italic uppercase tracking-wider text-slate-900 mt-1">
                {lesson.title}
              </h2>
            </div>
            <div className="w-8"></div>
          </div>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed mb-8 uppercase tracking-widest">
            Selecciona la dificultad del Neuro Link. Elige sabiamente, la velocidad premiará a los valientes.
          </p>

          <div className="space-y-4 mb-8">
            {difficultyOptions.map((opt) => {
              const isSelected = difficulty === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDifficulty(opt.id as any)}
                  className={`
                    w-full p-4 border text-left flex flex-col justify-between transition-all rounded-none relative
                    ${isSelected 
                      ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' 
                      : 'border-slate-200 bg-white hover:border-amber-350'}
                  `}
                >
                  <div className="flex justify-between items-start w-full mb-1">
                    <h3 className={`font-black text-[11px] uppercase tracking-wider ${isSelected ? 'text-amber-700' : 'text-slate-800'}`}>
                      {opt.title}
                    </h3>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-none ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-black text-slate-500 mb-2">{opt.time}</span>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => {
              setHasSelectedDifficulty(true);
              if (difficulty === 'medium') {
                setTimeLeft(180);
                setTimerActive(true);
              } else if (difficulty === 'pro') {
                setTimeLeft(90);
                setTimerActive(true);
              }
            }}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] transition-all rounded-none shadow-lg shadow-amber-500/10 active:scale-[0.98]"
          >
            Sincronizar y Comenzar
          </button>
        </motion.div>
      </div>
    );
  }

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

          <div className="font-bold text-slate-700 truncate max-w-[150px] md:max-w-md text-center flex flex-col items-center">
              <span className="text-sm font-black truncate max-w-[150px] md:max-w-md">{lesson.title}</span>
              {(difficulty === 'medium' || difficulty === 'pro') && (
                <span className={`text-[10px] font-mono font-black mt-0.5 px-2 py-0.5 border flex items-center gap-1.5 ${timeLeft <= 20 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse animate-bounce' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                  <Clock size={10} className={timeLeft <= 20 ? 'animate-bounce' : ''} />
                  {formatTime(timeLeft)}
                </span>
              )}
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
              key={drillKey}
              stage={currentStage || { title: 'Drill' }} // Fallback seguro
              pairs={pairs} 
              isPro={true} // Siempre activamos el modo diseño PRO
              onComplete={handleLessonComplete}
              initialCompletedIds={savedProgressIds}
              onProgressChange={(ids) => setSavedProgressIds(ids)}
              onCorrect={() => {
                  // (Punto 25) Sonido condicional
                  if (!isMuted) {
                      const audio = new Audio('/sounds/correct.mp3');
                      audio.volume = 0.5;
                      audio.play().catch(() => {});
                  }
              }} 
              onError={() => {
                  if (!isMuted && navigator.vibrate) navigator.vibrate(200);
              }}
          />

        </main>
      </motion.div>

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

      {showResumePrompt && pendingResumeState && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-2 border-orange-950 p-6 md:p-8 max-w-md w-full shadow-2xl text-center rounded-none relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
            <div className="flex justify-center mb-4 text-orange-500">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <h3 className="text-sm font-serif font-black italic uppercase tracking-wider text-orange-400 mb-2">¿Deseas retomar tu vocabulario?</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-6">
              Hemos detectado un progreso guardado con <span className="text-white font-mono font-black">{pendingResumeState.completedIds.length} palabras</span> memorizadas. ¿Prefieres reanudar desde donde te quedaste o comenzar de cero?
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setSavedProgressIds(pendingResumeState.completedIds);
                  setDrillKey(prev => prev + 1);
                  setShowResumePrompt(false);
                }} 
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1.5"
              >
                SÍ, REANUDAR DICCIONARIO <ChevronRight size={14} />
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem(`session_vocab_${lessonId}`);
                  setSavedProgressIds([]);
                  setDrillKey(prev => prev + 1);
                  setShowResumePrompt(false);
                }} 
                className="w-full py-2.5 border border-slate-700 bg-transparent text-slate-400 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all rounded-none"
              >
                NO, COMENZAR DE CERO
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showTimeUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-2 border-red-950 p-8 max-w-md w-full shadow-2xl text-center rounded-none relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
              <div className="w-16 h-16 bg-red-950/40 text-red-500 border border-red-800 flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="animate-pulse" />
              </div>
              <h3 className="text-sm font-serif font-black italic uppercase tracking-wider text-red-400 mb-2">¡Tiempo Agotado!</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-8 uppercase tracking-wider">
                El tiempo límite para el nivel de dificultad <strong className="text-white">{difficulty.toUpperCase()}</strong> ha expirado. El Neuro Link se ha desconectado.
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setShowTimeUpModal(false);
                    setDrillKey(prev => prev + 1);
                    setSavedProgressIds([]);
                    if (difficulty === 'medium') {
                      setTimeLeft(180);
                      setTimerActive(true);
                    } else if (difficulty === 'pro') {
                      setTimeLeft(90);
                      setTimerActive(true);
                    }
                  }}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest transition-all rounded-none shadow-lg shadow-red-600/30"
                >
                  REINTENTAR DIFICULTAD
                </button>
                <button 
                  onClick={handleExit}
                  className="w-full py-2.5 border border-slate-700 bg-transparent text-slate-400 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all rounded-none"
                >
                  SALIR AL DASHBOARD
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}