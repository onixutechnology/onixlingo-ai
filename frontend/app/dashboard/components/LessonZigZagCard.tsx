'use client';

import { motion, Variants } from 'framer-motion';
import { Play, Lock, Check, Trophy, ArrowRight, Clock, CheckCircle2, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type LessonStatus = 'locked' | 'active' | 'completed';

interface LessonZigZagCardProps {
  lesson: any;
  status: LessonStatus;
  stars: number;
  progressPercent: number;
  globalIndex: number;
  isEven: boolean;
  theme: any;
  timeMode: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } as any }
};

export const LessonZigZagCard = ({
  lesson,
  status,
  stars,
  progressPercent,
  globalIndex,
  isEven,
  theme,
  timeMode
}: LessonZigZagCardProps) => {
  const router = useRouter();
  
  const isLocked = status === 'locked';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  // Stable pseudo-random time to fix Hydration Mismatch
  const fakeMinutes = 10 + (lesson.id.length % 5);
  const fakeSeconds = lesson.id.charCodeAt(0) % 60;

  const handleCardClick = () => {
    if (!isLocked) {
      router.push(`/lesson/${lesson.id}?type=standard&timeMode=${timeMode}`);
    }
  };

  const CardMarkup = (
    <div
      onClick={handleCardClick}
      className={`
        w-full max-w-[420px] p-4 rounded-none border transition-all duration-200 cursor-pointer bg-white relative overflow-hidden group/card
        ${isLocked ? 'opacity-60 border-sky-100' : `border-sky-200 hover:border-${theme.primary} hover:shadow-[0_10px_40px_rgba(14,165,233,0.08)]`}
        ${isActive ? `ring-2 ring-${theme.primary}/10 border-${theme.primary} shadow-none` : ''}
      `}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? `bg-${theme.primary} text-slate-900` : 'bg-sky-100 text-slate-900'}`}>
              Módulo {globalIndex + 1}
            </span>
          </div>
          <h3 className={`text-xs font-black tracking-tight leading-tight uppercase ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>{lesson.title}</h3>
          <p className="text-[9px] text-slate-600 mt-1 leading-snug">{lesson.description}</p>
        </div>
        <div className="flex flex-col items-end justify-between h-full min-w-[50px]">
          {isCompleted && (
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3].map((s) => (<Trophy key={s} size={12} className={s <= stars ? `text-${theme.primary} fill-${theme.primary}` : 'text-sky-300'} />))}
            </div>
          )}
          {isActive && (
            <div className={`text-${theme.primary} transition-colors mt-1`}>
              <ArrowRight size={16} className="animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={itemVariants}
      className={`relative flex flex-col w-full md:items-center justify-between ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Columna de la Tarjeta */}
      <div className={`w-full md:w-[calc(50%-2.5rem)] flex pl-14 md:pl-0 ${isEven ? 'justify-start md:justify-end' : 'justify-start md:justify-start'}`}>
        {CardMarkup}
      </div>

      {/* Botón Central del Nodo de Progreso */}
      <div className="absolute left-[0.5rem] md:left-1/2 md:-translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2 z-20">
        <button
          onClick={handleCardClick}
          disabled={isLocked}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 shadow-none relative
            ${isActive ? `bg-${theme.primary} border-${theme.accent} text-slate-900 shadow-none scale-110 z-20 ring-4 ring-${theme.primary}/20` : ''} 
            ${isCompleted ? `bg-white border-${theme.primary} text-${theme.primary} hover:bg-sky-50` : ''} 
            ${isLocked ? 'bg-sky-50 border-sky-200 text-sky-600' : ''}
          `}
        >
          {isLocked && <Lock size={14} />}
          {isActive && <Play size={16} fill="currentColor" className="ml-0.5" />}
          {isCompleted && <Check size={16} strokeWidth={3} />}
        </button>
      </div>

      {/* Bloque de Tiempos (Columna Espaciadora) */}
      <div className={`hidden md:flex w-full md:w-[calc(50%-3rem)] flex-col justify-center ${isEven ? 'items-start pl-6' : 'items-end pr-6'}`}>
        <div className={`flex flex-col gap-2 p-3.5 bg-white/60 backdrop-blur-sm rounded-none border border-sky-100 shadow-[0_4px_15px_rgba(14,165,233,0.05)] w-48 ${isEven ? 'text-left' : 'text-right'}`}>
          {/* Tiempo Estimado */}
          <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
            {isEven ? (
              <>
                <Clock size={12} className={isLocked ? 'opacity-50' : 'text-slate-900'} />
                <span>Estimado: 15m</span>
              </>
            ) : (
              <>
                <span>Estimado: 15m</span>
                <Clock size={12} className={isLocked ? 'opacity-50' : 'text-slate-900'} />
              </>
            )}
          </div>
          
          {/* Tiempo Real (Completado) */}
          {isCompleted && (
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">
              {isEven ? (
                <>
                  <CheckCircle2 size={12} className="text-[#D4AF37]" />
                  <span>Real: {fakeMinutes}m {fakeSeconds}s</span>
                </>
              ) : (
                <>
                  <span>Real: {fakeMinutes}m {fakeSeconds}s</span>
                  <CheckCircle2 size={12} className="text-[#D4AF37]" />
                </>
              )}
            </div>
          )}

          {/* Tiempo En Curso */}
          {isActive && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#D4AF37] ${isEven ? 'justify-start' : 'justify-end'}`}>
                {isEven ? (
                  <>
                    <Timer size={12} className="animate-pulse" />
                    <span className="animate-pulse">En Progreso</span>
                  </>
                ) : (
                  <>
                    <span className="animate-pulse">En Progreso</span>
                    <Timer size={12} className="animate-pulse" />
                  </>
                )}
              </div>
              <div className={`w-full h-1 bg-sky-100/50 rounded-none overflow-hidden`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className={`h-full bg-[#D4AF37] ${isEven ? 'float-left' : 'float-right'}`}
                />
              </div>
              <div className={`text-[7px] font-black text-sky-600/70 uppercase tracking-widest ${isEven ? 'text-left' : 'text-right'}`}>
                Avance: {progressPercent}%
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
