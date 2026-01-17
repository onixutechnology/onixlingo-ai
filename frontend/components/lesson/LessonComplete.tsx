'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, RotateCcw, Gem, Zap, Loader2, XCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import confetti from 'canvas-confetti';
import { useUIStore } from '@/store/uiStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

interface Props {
  xpEarned: number;
  accuracy: number;
  lessonId: string;
  lessonType: 'standard' | 'pro' | 'vocab';
  totalSteps: number;
  onRetry: () => void;
  onExit: () => void;
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
  const { mode } = useUIStore();
  const isPro = mode === 'professional' || lessonType === 'pro';
  
  const [isSaving, setIsSaving] = useState(false); // Inicia en false por defecto
  const [saveError, setSaveError] = useState<string | null>(null);

  // 📝 AJUSTE 1: Umbral de aprobación. 
  // 60% es estándar, pero puedes bajarlo a 50% si sientes que es muy duro.
  const isSuccess = accuracy >= 50; 

  useEffect(() => {
    // ❌ Si reprueba, NO hacemos nada (ni confetti, ni guardar)
    if (!isSuccess) return;

    // ✅ Si aprueba, iniciamos el proceso
    setIsSaving(true);

    // 1. Confetti
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

    // 2. Guardar en Backend (Solo si aprobó)
    const saveProgress = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
           console.warn("Modo offline o sin token.");
           setIsSaving(false);
           return;
        }

        // 📝 AJUSTE 2: Lógica de Estrellas mejorada
        // < 70% = 1 estrella (Pero aprobó raspando)
        // 70-89% = 2 estrellas
        // >= 90% = 3 estrellas
        let stars = 1;
        if (accuracy >= 90) stars = 3;
        else if (accuracy >= 70) stars = 2;

        const payload = {
          lesson_id: lessonId,
          lesson_type: lessonType,
          score: accuracy,
          current_step: totalSteps,
          total_steps: totalSteps,
          stars: stars
        };

        const res = await fetch(`${API_URL}/api/v1/progress/complete`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) console.error("Error guardando progreso en servidor");

      } catch (err) {
        console.error("Save error:", err);
        setSaveError("No se pudo guardar el progreso online.");
      } finally {
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
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className={`absolute inset-0 backdrop-blur-sm ${isPro ? 'bg-black/80' : 'bg-slate-900/40'}`} 
      />

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
        
        {/* Fondo Decorativo */}
        <div className={`absolute top-0 left-0 w-full h-32 -z-10 rounded-t-xl ${
            isPro 
                ? 'bg-gradient-to-b from-amber-900/40 to-transparent' 
                : isSuccess 
                  ? 'bg-gradient-to-b from-yellow-300 via-yellow-100 to-transparent'
                  : 'bg-gradient-to-b from-rose-300 via-rose-100 to-transparent'
        }`}></div>

        {/* Icono Central */}
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

        {/* Textos */}
        <h2 className={`text-3xl font-black mb-2 uppercase tracking-tight ${isPro ? 'text-white' : 'text-slate-800'}`}>
          {isSaving ? 'Guardando...' : isSuccess ? (isPro ? 'Mission Accomplished' : '¡Lección Completada!') : 'Inténtalo de nuevo'}
        </h2>
        
        {!isSaving && (
            <p className={`font-medium mb-8 ${isPro ? 'text-slate-400' : 'text-slate-500'}`}>
              {isSuccess 
                ? `Precisión: ${accuracy}%`
                : 'Debes obtener al menos 60% para aprobar.'}
            </p>
        )}

        {/* Botones */}
        <div className="space-y-3">
            {!isSaving && (
                <>
                    {isSuccess ? (
                        <button onClick={onExit} className={mainButtonClasses}>
                            {isPro ? 'RETURN TO HQ' : 'CONTINUAR'} <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button onClick={onRetry} className={mainButtonClasses}>
                            <RotateCcw size={20} /> {isPro ? 'RETRY MODULE' : 'REINTENTAR'}
                        </button>
                    )}
                    
                    {/* Botón secundario si aprobó (para repetir por gusto) */}
                    {isSuccess && (
                        <button 
                            onClick={onRetry}
                            className={`w-full py-3 border-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] ${isPro ? 'bg-transparent border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <RotateCcw size={18} /> Repetir para mejorar
                        </button>
                    )}

                    {!isSuccess && (
                         <button onClick={onExit} className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-sm">
                             Salir al Menú
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