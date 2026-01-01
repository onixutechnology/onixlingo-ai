'use client';

import { useAvatarStore } from '@/store/avatarStore';
// Si no instalaste framer-motion, usa el div alternativo comentado abajo
import { motion } from 'framer-motion'; 

export default function XPBar() {
  const { xp, level, streak } = useAvatarStore();
  const progress = (xp % 100); 

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-soft border-2 border-brand-100 flex items-center gap-5 mb-8 relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-50 rounded-full opacity-50 z-0"></div>

      {/* Insignia de Nivel (Grande y llamativa) */}
      <div className="relative z-10 shrink-0">
        <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg transform rotate-3 border-4 border-brand-200">
          {level}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-accent-yellow text-brand-700 text-xs font-black px-2 py-1 rounded-full border-2 border-white transform -rotate-3">
          NIVEL
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="flex-1 z-10">
        <div className="flex justify-between text-sm font-bold text-brand-700 mb-2">
          <span>Progreso del Nivel</span>
          <span className="text-brand-500">{xp} XP Total</span>
        </div>
        <div className="h-5 w-full bg-brand-100 rounded-full overflow-hidden border-2 border-brand-200 p-0.5">
          {/* Barra animada */}
          <motion.div 
            className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full shadow-inner"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* ALTERNATIVA SIN FRAMER MOTION:
          <div 
            className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full shadow-inner transition-all duration-500"
            style={{ width: `${progress}%` }}
          /> 
          */}
        </div>
      </div>

      {/* Racha (Chunky y divertida) */}
      <div className="flex flex-col items-center justify-center bg-accent-orange/10 px-4 py-2 rounded-2xl border-2 border-accent-orange/30 z-10">
        <span className="text-3xl drop-shadow-sm">🔥</span>
        <span className="text-sm font-black text-accent-orange">{streak} Días</span>
      </div>
    </div>
  );
}