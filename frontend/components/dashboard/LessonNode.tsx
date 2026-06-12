'use client';

import { motion } from 'framer-motion';
import { Star, Lock, Trophy } from 'lucide-react';
import { LessonNode as LessonNodeType } from '@/data/curriculum';

interface Props {
  data: LessonNodeType;
  color: string;
  onClick: (id: string) => void;
}

export default function LessonNode({ data, color, onClick }: Props) {
  // Mapeo de colores para Tailwind (puedes agregar más)
  const colorMap: Record<string, string> = {
    emerald: 'bg-[#D4AF37]/100 shadow-emerald-600 border-emerald-400',
    blue: 'bg-[#D4AF37]/20 shadow-blue-600 border-blue-400',
    orange: 'bg-orange-500 shadow-orange-600 border-orange-400',
    purple: 'bg-purple-600 shadow-purple-800 border-purple-400',
  };

  const isLocked = data.locked;
  const baseColor = colorMap[color] || 'bg-white0 shadow-gray-600';
  
  // Estilos dinámicos
  const bgClass = isLocked ? 'bg-white shadow-slate-300 border-slate-200' : baseColor;
  const textClass = isLocked ? 'text-slate-500' : 'text-slate-900';

  return (
    <div className={`flex flex-col items-center relative mb-8 z-10 ${
      data.position === 'left' ? '-ml-24' : data.position === 'right' ? '-mr-24' : ''
    }`}>
      
      {/* EL NODO (BOTÓN) */}
      <motion.button
        whileHover={!isLocked ? { scale: 1.1, translateY: -4 } : {}}
        whileTap={!isLocked ? { scale: 0.9, boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)" } : {}}
        onClick={() => !isLocked && onClick(data.id)}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-b-8 transition-all relative ${bgClass} ${textClass}`}
      >
        {/* Íconos dentro del nodo */}
        {isLocked ? (
          <Lock className="w-8 h-8 opacity-40" />
        ) : data.type === 'toeic_mock' ? (
          <Trophy className="w-9 h-9 text-yellow-300 drop-shadow-none" />
        ) : data.completed ? (
            <Star className="w-10 h-10 fill-yellow-400 text-yellow-600 drop-shadow-none" />
        ) : (
          <Star className="w-8 h-8 opacity-40" />
        )}

        {/* Estrellas flotantes (Score) */}
        {!isLocked && data.stars > 0 && (
            <div className="absolute -top-6 flex gap-1 bg-white/90 px-2 py-1 rounded-full shadow-none border border-slate-200">
                {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-xs ${i < data.stars ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                ))}
            </div>
        )}
      </motion.button>

      {/* Título de la lección */}
      <div className="mt-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-none shadow-none border border-slate-200 font-bold text-slate-600 text-sm text-center max-w-[160px] transform hover:scale-105 transition-transform cursor-default">
        {data.title}
      </div>
    </div>
  );
}