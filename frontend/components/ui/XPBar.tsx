'use client';

import { motion } from 'framer-motion';
import { Zap, Trophy, Flame } from 'lucide-react';
import { useProgressStore } from '@/store/progressStore'; // 👈 CAMBIO IMPORTANTE: Usamos progressStore
import { useUIStore } from '@/store/uiStore'; // Para detectar modo PRO

export default function XPBar() {
  // 1. Obtenemos XP y Streak del store correcto
  const { xp, streak } = useProgressStore();
  const { mode } = useUIStore();
  
  const isPro = mode === 'professional';

  // 2. Calculamos el nivel basado en XP (ej: cada 100 XP es un nivel)
  const level = Math.floor(xp / 100) + 1;
  const progressToNextLevel = xp % 100; // Porcentaje 0-100

  return (
    <div className={`flex items-center gap-4 p-2 rounded-2xl border backdrop-blur-sm shadow-sm transition-colors ${
        isPro 
            ? 'bg-slate-900/80 border-slate-700 text-slate-200' 
            : 'bg-white/80 border-slate-200 text-slate-700'
    }`}>
      
      {/* Nivel Circular */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
          {/* Fondo del círculo */}
          <path
            className={isPro ? "text-slate-800" : "text-slate-200"}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          {/* Progreso */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progressToNextLevel / 100 }}
            className={isPro ? "text-amber-500" : "text-indigo-500"}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="100, 100"
          />
        </svg>
        <span className="text-xs font-black">{level}</span>
      </div>

      {/* Info de Texto */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase opacity-60">Level {level}</span>
            {streak > 0 && (
                <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isPro ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'
                }`}>
                    <Flame size={10} className="mr-0.5 fill-current" /> {streak}
                </div>
            )}
        </div>
        
        <div className="flex items-center gap-1">
            <Zap size={14} className={isPro ? "text-amber-500 fill-current" : "text-yellow-500 fill-current"} />
            <span className={`text-sm font-black ${isPro ? "text-white" : "text-slate-900"}`}>
                {xp} <span className="text-[10px] opacity-60">XP</span>
            </span>
        </div>
      </div>
    </div>
  );
}