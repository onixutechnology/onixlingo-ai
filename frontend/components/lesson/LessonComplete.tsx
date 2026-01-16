'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, RotateCcw, Gem, Zap, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import Cookies from 'js-cookie';
import confetti from 'canvas-confetti';
import { useUIStore } from '@/store/uiStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

interface Props {
  xpEarned: number;
  accuracy: number;
  lessonId: string;       // 👈 Necesario para el backend
  lessonType: 'standard' | 'pro' | 'vocab'; // 👈 Necesario para el backend
  totalSteps: number;     // 👈 Necesario para el backend
  onRetry: () => void;
  onExit: () => void;     // 👈 Ahora es obligatorio porque el Engine siempre lo pasa
}

export default function LessonComplete({ 
  xpEarned, 
  accuracy, 
  lessonId, 
  lessonType, 
  totalSteps, 
  onRetry, 
  onExit 
}: Props) {
  // 1. Detectamos si estamos en modo PRO (visual)
  const { mode } = useUIStore();
  const isPro = mode === 'professional' || lessonType === 'pro';
  
  // Estado para la llamada al backend
  const [isSaving, setIsSaving] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Lógica de aprobación (ej: > 60%)
  const isSuccess = accuracy >= 60;

  // --- EFECTO: GUARDAR Y CONFETTI ---
  useEffect(() => {
    // 1. Lanzar Confetti si aprobó
    if (isSuccess) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: isPro ? ['#d97706', '#f59e0b', '#fff'] : ['#6366f1', '#10b981', '#f59e0b']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: isPro ? ['#d97706', '#f59e0b', '#fff'] : ['#6366f1', '#10b981', '#f59e0b']
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }

    // 2. Guardar en Backend
    const saveProgress = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
           console.warn("No token found, saving locally only.");
           setIsSaving(false);
           return;
        }

        // Preparamos payload
        const payload = {
          lesson_id: lessonId,
          lesson_type: lessonType,
          score: accuracy,
          current_step: totalSteps,
          total_steps: totalSteps,
          stars: accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1
        };

        const res = await fetch(`${API_URL}/api/v1/progress/complete`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`, // Ajusta si tu backend no usa 'Bearer '
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error("Backend save failed");
            // No bloqueamos al usuario si falla, solo avisamos en consola
        }

      } catch (err) {
        console.error("Save error:", err);
        setSaveError("Error de sincronización (Tu progreso local está seguro)");
      } finally {
        // Mínimo tiempo de espera para que se vea la animación de carga
        setTimeout(() => setIsSaving(false), 800);
      }
    };

    saveProgress();
  }, [isSuccess, accuracy, lessonId, lessonType, totalSteps, isPro]);


  // --- ESTILOS ---
  const mainButtonClasses = `
    w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]
    ${isPro 
        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40' 
        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
    }
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con Blur */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className={`absolute inset-0 backdrop-blur-sm ${isPro ? 'bg-black/80' : 'bg-slate-900/40'}`} 
      />

      {/* Tarjeta Principal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className={`
            relative w-full max-w-md rounded-3xl p-8 text-center shadow-2xl overflow-hidden border-4
            ${isPro 
                ? 'bg-slate-900 border-slate-700 shadow-amber-900/20' 
                : 'bg-white border-white shadow-xl'
            }
        `}
      >
        
        {/* Fondo Decorativo Superior */}
        <div className={`absolute top-0 left-0 w-full h-32 -z-10 rounded-t-xl ${
            isPro 
                ? 'bg-gradient-to-b from-amber-900/40 to-transparent' 
                : isSuccess 
                  ? 'bg-gradient-to-b from-yellow-300 via-yellow-100 to-transparent'
                  : 'bg-gradient-to-b from-rose-300 via-rose-100 to-transparent'
        }`}></div>

        {/* Icono Flotante (Trofeo, Gema o Loader) */}
        <div className="mb-6 flex justify-center -mt-4">
            {isSaving ? (
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 ${isPro ? 'bg-slate-800 border-slate-700' : 'bg-white border-white'}`}>
                    <Loader2 className={`animate-spin ${isPro ? 'text-amber-500' : 'text-blue-500'}`} size={40} />
                 </div>
            ) : isSuccess ? (
                <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 animate-[bounce_3s_infinite]
                    ${isPro 
                        ? 'bg-slate-800 border-slate-700 text-amber-500' 
                        : 'bg-yellow-400 border-white text-yellow-900'
                    }
                `}>
                    {isPro ? <Gem size={48} /> : <Trophy size={48} />}
                </div>
            ) : (
                <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4
                    ${isPro 
                        ? 'bg-slate-800 border-slate-700 text-rose-500' 
                        : 'bg-rose-100 border-white text-rose-500'
                    }
                `}>
                    <XCircle size={48} />
                </div>
            )}
        </div>

        {/* Títulos */}
        <h2 className={`text-3xl font-black mb-2 uppercase tracking-tight ${isPro ? 'text-white' : 'text-slate-800'}`}>
          {isSaving ? 'Sincronizando...' : isSuccess ? (isPro ? 'Mission Accomplished' : '¡Lección Completada!') : 'Inténtalo de nuevo'}
        </h2>
        
        {!isSaving && (
            <p className={`font-medium mb-8 ${isPro ? 'text-slate-400' : 'text-slate-500'}`}>
              {isSuccess 
                ? (isPro ? 'Executive competency verified.' : 'Has dominado este tema.')
                : 'No alcanzaste el puntaje mínimo.'}
            </p>
        )}

        {/* Grid de Estadísticas (Solo si no está cargando y aprobó) */}
        {!isSaving && isSuccess && (
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* XP Box */}
                <div className={`p-4 rounded-2xl border ${
                    isPro ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-100'
                }`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap size={14} className={isPro ? 'text-amber-500' : 'text-blue-400'} fill="currentColor"/>
                        <p className={`text-xs font-bold uppercase tracking-wider ${isPro ? 'text-slate-400' : 'text-blue-400'}`}>XP Gained</p>
                    </div>
                    <p className={`text-3xl font-black ${isPro ? 'text-amber-500' : 'text-blue-600'}`}>+{xpEarned}</p>
                </div>

                {/* Accuracy Box */}
                <div className={`p-4 rounded-2xl border ${
                    isPro ? 'bg-slate-800 border-slate-700' : 'bg-green-50 border-green-100'
                }`}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isPro ? 'text-slate-400' : 'text-green-400'}`}>Accuracy</p>
                    <p className={`text-3xl font-black ${isPro ? 'text-emerald-400' : 'text-green-600'}`}>{accuracy}%</p>
                </div>
            </div>
        )}

        {/* Botones de Acción */}
        <div className="space-y-3">
            {!isSaving && (
                <>
                    {/* Botón Principal */}
                    {isSuccess ? (
                        <button onClick={onExit} className={mainButtonClasses}>
                            {isPro ? 'RETURN TO HQ' : 'CONTINUAR'} <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button onClick={onRetry} className={mainButtonClasses}>
                            <RotateCcw size={20} /> {isPro ? 'RETRY MODULE' : 'REINTENTAR'}
                        </button>
                    )}
                    
                    {/* Botón Secundario */}
                    {isSuccess && (
                        <button 
                            onClick={onRetry}
                            className={`
                                w-full py-3 border-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02]
                                ${isPro 
                                    ? 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white' 
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }
                            `}
                        >
                            <RotateCcw size={18} /> {isPro ? 'RESTART MODULE' : 'REPETIR LECCIÓN'}
                        </button>
                    )}
                    
                    {!isSuccess && (
                         <button 
                            onClick={onExit}
                            className={`
                                w-full py-3 border-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02]
                                ${isPro 
                                    ? 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white' 
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }
                            `}
                        >
                             SALIR
                        </button>
                    )}
                </>
            )}
            
            {saveError && <p className="text-xs text-rose-500 mt-2">{saveError}</p>}
        </div>

      </motion.div>
    </div>
  );
}