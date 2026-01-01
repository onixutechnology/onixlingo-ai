'use client';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface Props {
  xpEarned: number;
  accuracy: number; // Porcentaje 0-100
  onRetry: () => void;
}

export default function LessonComplete({ xpEarned, accuracy, onRetry }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden border-4 border-white">
        
        {/* Fondo animado */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-300 to-yellow-100 -z-10 rounded-t-2xl"></div>

        <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto -mt-4 mb-6 flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
          <Trophy size={48} className="text-yellow-900" />
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-2">¡LECCIÓN COMPLETADA!</h2>
        <p className="text-slate-500 font-medium mb-8">Has dominado este tema.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-blue-400 text-xs font-bold uppercase">Experiencia</p>
                <p className="text-3xl font-black text-blue-600">+{xpEarned} XP</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <p className="text-green-400 text-xs font-bold uppercase">Precisión</p>
                <p className="text-3xl font-black text-green-600">{accuracy}%</p>
            </div>
        </div>

        <div className="space-y-3">
            <Link href="/dashboard" className="block w-full">
                <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    CONTINUAR <ArrowRight />
                </button>
            </Link>
            
            <button 
                onClick={onRetry}
                className="w-full py-3 bg-white border-2 border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
                <RotateCcw size={18} /> REPETIR LECCIÓN
            </button>
        </div>

      </div>
    </motion.div>
  );
}