'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, Zap, Crown, BookOpen, 
  Target, Shield, GraduationCap, Lock, Star, ChevronRight, Play
} from 'lucide-react';

// --- CURRÍCULO DE AJEDREZ (Estrategia Profesional) ---
const CHESS_MODULES = [
  {
    id: 'fundamentals',
    title: 'Fundamentos Esenciales',
    description: 'Movimiento de piezas, valor relativo y reglas especiales.',
    icon: Shield,
    color: 'from-blue-500 to-indigo-600',
    progress: 100, // Simulado
    lessons: [
      { id: 'rook-move', title: 'La Torre: Muros de Piedra', completed: true },
      { id: 'bishop-move', title: 'El Alfil: Francotirador', completed: true },
      { id: 'queen-move', title: 'La Dama: Poder Absoluto', completed: true },
    ]
  },
  {
    id: 'tactics-1',
    title: 'Táctica Básica: Patrones',
    description: 'Aprende a ganar material con golpes tácticos simples.',
    icon: Zap,
    color: 'from-emerald-500 to-teal-600',
    progress: 45,
    lessons: [
      { id: 'fork', title: 'El Ataque Doble (Fork)', completed: true },
      { id: 'pin', title: 'La Clavada (Pin)', completed: false },
      { id: 'skewer', title: 'La Enfilada (Skewer)', completed: false },
    ]
  },
  {
    id: 'checkmates',
    title: 'Patrones de Mate',
    description: 'Cómo finalizar la partida. Mates elementales.',
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    progress: 10,
    lessons: [
      { id: 'mate-1', title: 'Mate del Pasillo', completed: true },
      { id: 'mate-kiss', title: 'El Beso de la Muerte', completed: false },
      { id: 'mate-ladder', title: 'Mate de la Escalera', completed: false },
    ]
  },
  {
    id: 'endgames',
    title: 'Finales Teóricos',
    description: 'Gana partidas ganadas y salva partidas perdidas.',
    icon: GraduationCap,
    color: 'from-purple-500 to-pink-600',
    progress: 0,
    locked: true, // Ejemplo de módulo bloqueado
    lessons: []
  }
];

export default function ChessLobbyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pb-20">
      
      {/* HEADER HERO */}
      <div className="relative bg-slate-900 border-b border-slate-800 pb-12 pt-8 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-bold text-sm">
            <ArrowLeft size={16} /> Volver al LMS
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest">
                    Titanium Chess Academy
                 </span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                 Maestría Táctica
               </h1>
               <p className="text-slate-400 max-w-lg text-sm md:text-base leading-relaxed">
                 El ajedrez no se trata de mover piezas, se trata de reconocer patrones. 
                 Completa estos módulos para desarrollar tu "ojo táctico".
               </p>
            </div>

            {/* Stats Rápidos */}
            <div className="flex gap-4">
               <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                     <Trophy size={18} />
                     <span className="font-bold text-lg">850</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ELO Táctico</div>
               </div>
               <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                     <Target size={18} />
                     <span className="font-bold text-lg">12</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ejercicios</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: LA MALLA CURRICULAR */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 space-y-8">
         
         {/* TARJETA: PUZZLE DIARIO (HOOK DE RETENCIÓN) */}
         <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-1 border border-slate-700 shadow-2xl group cursor-pointer hover:border-indigo-500/50 transition-all">
            <div className="bg-[#0F1623] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               {/* Efecto de fondo */}
               <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="flex items-center gap-5 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                     <Star size={32} fill="currentColor" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-1">Puzzle Diario</h3>
                     <p className="text-sm text-slate-400">Resuelve el problema de hoy para mantener tu racha.</p>
                     <div className="flex gap-2 mt-2">
                        <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-bold">DIFÍCIL</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">+25 XP</span>
                     </div>
                  </div>
               </div>
               
               <button className="relative z-10 bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg">
                  <Play size={16} fill="currentColor" /> RESOLVER AHORA
               </button>
            </div>
         </div>

         {/* LISTA DE MÓDULOS */}
         <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Ruta de Aprendizaje</h2>
            
            {CHESS_MODULES.map((module) => (
               <div key={module.id} className={`bg-[#131B2C] rounded-2xl border ${module.locked ? 'border-slate-800 opacity-75 grayscale' : 'border-slate-800 hover:border-slate-700'} overflow-hidden transition-all duration-300`}>
                  
                  {/* HEADER DEL MÓDULO */}
                  <div className="p-6 md:p-8 flex items-start gap-6 border-b border-slate-800/50">
                     <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                        <module.icon size={28} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-xl font-bold text-white">{module.title}</h3>
                           {module.locked ? (
                              <Lock size={20} className="text-slate-600" />
                           ) : (
                              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                 {module.progress}% Completado
                              </span>
                           )}
                        </div>
                        <p className="text-sm text-slate-400 mb-4 max-w-2xl">{module.description}</p>
                        
                        {/* Barra de Progreso */}
                        {!module.locked && (
                           <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden max-w-md">
                              <div className={`h-full bg-gradient-to-r ${module.color}`} style={{ width: `${module.progress}%` }}></div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* LECCIONES (Solo si no está bloqueado) */}
                  {!module.locked && (
                     <div className="bg-[#0F1522]">
                        {module.lessons.map((lesson, idx) => (
                           <Link 
                             // AQUÍ ESTÁ LA MAGIA: Pasamos el ID de la lección a la página de juego
                             href={`/dashboard/chess/practice?lessonId=${lesson.id}`} 
                             key={lesson.id} 
                             className="flex items-center justify-between p-4 md:px-8 border-b border-slate-800/50 hover:bg-white/5 transition-colors group"
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${lesson.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-slate-700 text-slate-500'}`}>
                                    {lesson.completed ? <Shield size={14} fill="currentColor"/> : idx + 1}
                                 </div>
                                 <span className={`font-bold text-sm ${lesson.completed ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200 group-hover:text-white'}`}>
                                    {lesson.title}
                                 </span>
                              </div>
                              
                              {lesson.completed ? (
                                 <div className="flex gap-1">
                                    <Star size={14} className="text-amber-500" fill="currentColor"/>
                                    <Star size={14} className="text-amber-500" fill="currentColor"/>
                                    <Star size={14} className="text-amber-500" fill="currentColor"/>
                                 </div>
                              ) : (
                                 <button className="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    INICIAR <ChevronRight size={14} />
                                 </button>
                              )}
                           </Link>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </div>

      </div>
    </div>
  );
}