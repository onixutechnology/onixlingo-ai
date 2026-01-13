'use client';

import { motion } from 'framer-motion';
import { Trophy, ArrowRight, RotateCcw, Gem, Zap } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';

interface Props {
  xpEarned: number;
  accuracy: number;
  opportunities?: any[];
  onRetry: () => void;
  onExit?: () => void; // 👈 1. AGREGADO: Propiedad opcional para manejar la salida
}

export default function LessonComplete({ xpEarned, accuracy, onRetry, onExit }: Props) {
  // 1. Detectamos si estamos en modo PRO para cambiar el estilo
  const { mode } = useUIStore();
  const isPro = mode === 'professional';

  // 2. Definimos la ruta de salida por defecto
  const dashboardRoute = isPro ? '/dashboard/pro' : '/dashboard';

  // 3. Estilos comunes para el botón principal (para no repetir código)
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
                ? 'bg-slate-900 border-slate-700 shadow-amber-900/20' // Estilo PRO
                : 'bg-white border-white shadow-xl' // Estilo Student
            }
        `}
      >
        
        {/* Fondo Decorativo Superior */}
        <div className={`absolute top-0 left-0 w-full h-32 -z-10 rounded-t-xl ${
            isPro 
                ? 'bg-gradient-to-b from-amber-900/40 to-transparent' 
                : 'bg-gradient-to-b from-yellow-300 via-yellow-100 to-transparent'
        }`}></div>

        {/* Icono Flotante (Trofeo o Gema) */}
        <div className={`
            w-24 h-24 rounded-full mx-auto -mt-4 mb-6 flex items-center justify-center shadow-lg border-4 animate-[bounce_3s_infinite]
            ${isPro 
                ? 'bg-slate-800 border-slate-700 text-amber-500' 
                : 'bg-yellow-400 border-white text-yellow-900'
            }
        `}>
          {isPro ? <Gem size={48} /> : <Trophy size={48} />}
        </div>

        {/* Títulos */}
        <h2 className={`text-3xl font-black mb-2 uppercase tracking-tight ${isPro ? 'text-white' : 'text-slate-800'}`}>
          {isPro ? 'Mission Accomplished' : '¡Lección Completada!'}
        </h2>
        <p className={`font-medium mb-8 ${isPro ? 'text-slate-400' : 'text-slate-500'}`}>
          {isPro ? 'Executive competency verified.' : 'Has dominado este tema.'}
        </p>

        {/* Grid de Estadísticas */}
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

        {/* Botones de Acción */}
        <div className="space-y-3">
            
            {/* 4. LÓGICA CONDICIONAL PARA EL BOTÓN DE SALIDA */}
            {onExit ? (
                // Caso A: Se pasó una función onExit (ej: Vocabulario)
                <button onClick={onExit} className={mainButtonClasses}>
                    {isPro ? 'RETURN TO HQ' : 'CONTINUAR'} <ArrowRight size={20} />
                </button>
            ) : (
                // Caso B: Comportamiento por defecto (Link al Dashboard)
                <Link href={dashboardRoute} className="block w-full">
                    <button className={mainButtonClasses}>
                        {isPro ? 'RETURN TO HQ' : 'CONTINUAR'} <ArrowRight size={20} />
                    </button>
                </Link>
            )}
            
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
        </div>

      </motion.div>
    </div>
  );
}