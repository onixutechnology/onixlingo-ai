'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame } from 'lucide-react';
import { useProgressStore } from '@/store/progressStore'; 
import { useUIStore } from '@/store/uiStore'; 

export default function XPBar() {
  // 1. Estado para evitar error de Hidratación (Hydration Mismatch)
  const [mounted, setMounted] = useState(false);

  // 2. Obtenemos datos del store (con valores seguros por defecto)
  const xp = useProgressStore((state) => state.xp || 0);
  const streak = useProgressStore((state) => state.streak || 0);
  const { mode } = useUIStore();

  // 3. Efecto para indicar que ya estamos en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si no está montado aún, no renderizamos nada para evitar parpadeos o errores
  if (!mounted) return null;
  
  const isPro = mode === 'professional';

  // 4. Cálculos de nivel
  const level = Math.floor(xp / 100) + 1;
  const progressToNextLevel = xp % 100; 

  return (
    <div className={`flex items-center gap-4 p-2 rounded-none border backdrop-blur-sm shadow-none transition-colors ${
        isPro 
            ? 'bg-slate-50/80 border-slate-700 text-slate-200' 
            : 'bg-white/80 border-slate-200 text-slate-700'
    }`}>
      
      {/* Nivel Circular */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
          {/* Fondo del círculo */}
          <path
            className={isPro ? "text-slate-900" : "text-slate-200"}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          {/* Progreso Animado */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progressToNextLevel / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={isPro ? "text-[#D4AF37]" : "text-[#D4AF37]"}
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
            <Zap size={14} className={isPro ? "text-[#D4AF37] fill-current" : "text-yellow-500 fill-current"} />
            <span className={`text-sm font-black ${isPro ? "text-slate-900" : "text-slate-900"}`}>
                {xp} <span className="text-[10px] opacity-60">XP</span>
            </span>
        </div>
      </div>
    </div>
  );
}