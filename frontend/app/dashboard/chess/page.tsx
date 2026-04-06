'use client';

/**
 * ==============================================================================
 * ONIXLINGO CHESS ACADEMY - LOBBY (TITANIUM)
 * ==============================================================================
 * RUTA: /dashboard/chess/page.tsx
 * ESTADO: Production Ready (Conectado a FastAPI + Generación Dinámica)
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  ArrowLeft, Trophy, Zap, Crown, Target, Shield, Flame, 
  Layers, Sword, Lock, Star, ChevronRight, Play, Loader2
} from 'lucide-react';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

// --- CONFIGURACIÓN VISUAL DE LOS 7 MÓDULOS ---
// Esto le da el diseño Titanium a los datos que vienen del backend
const MODULES_UI_CONFIG = [
  { id: 'fundamentals', title: 'Fundamentos Esenciales', desc: 'Reglas, movimientos y capturas básicas.', icon: Shield, color: 'from-blue-500 to-indigo-600', locked: false },
  { id: 'tactics-1', title: 'Táctica Básica: Patrones', desc: 'Ataques dobles, clavadas y descubiertas.', icon: Zap, color: 'from-emerald-500 to-teal-600', locked: false },
  { id: 'checkmates', title: 'Patrones de Mate', desc: 'Acorrala al Rey enemigo sin piedad.', icon: Crown, color: 'from-amber-500 to-orange-600', locked: false },
  { id: 'openings', title: 'Control del Centro', desc: 'Desarrollo de piezas y seguridad del Rey.', icon: Target, color: 'from-rose-500 to-pink-600', locked: false },
  { id: 'middlegame', title: 'Estrategia de Medio Juego', desc: 'Planes, estructuras de peones y maniobras.', icon: Layers, color: 'from-purple-500 to-violet-600', locked: false },
  { id: 'endgames', title: 'Finales Teóricos', desc: 'Convierte tu ventaja material en victoria.', icon: Sword, color: 'from-cyan-500 to-blue-600', locked: false },
  { id: 'advanced', title: 'Cálculo Avanzado', desc: 'Sacrificios y redes de mate complejas.', icon: Flame, color: 'from-slate-700 to-slate-900', locked: false }
];

// Helper para ponerle títulos bonitos a los niveles especiales
const getLessonTitle = (id: string) => {
  const titles: Record<string, string> = {
    'fundamentals-1': 'La Torre: Muros de Piedra',
    'tactics-1-1': 'El Ataque Doble (The Fork)',
    'checkmates-1': 'Mate del Pasillo'
  };
  return titles[id] || `Unidad Táctica ${id.split('-')[1]}`;
};

export default function ChessLobbyPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [stats, setStats] = useState({ elo: 850, puzzlesSolved: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // --- 🚀 CONEXIÓN REAL AL BACKEND ---
  useEffect(() => {
    const fetchChessData = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        // Descomentamos y activamos la petición a FastAPI
        const res = await fetch(`${API_URL}/api/v1/chess/progress`, {
          headers: { 
            'Authorization': safeToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          const completedLessons = data.completed_lessons || [];
          
          // CONSTRUIMOS LOS 70 NIVELES (7 módulos x 10 lecciones)
          const dynamicModules = MODULES_UI_CONFIG.map(mod => {
            const lessons = Array.from({ length: 10 }).map((_, idx) => {
              const lessonId = `${mod.id}-${idx + 1}`;
              return {
                id: lessonId,
                title: getLessonTitle(lessonId),
                completed: completedLessons.includes(lessonId)
              };
            });
            return { ...mod, lessons };
          });

          setModules(dynamicModules);
          
          // ELO y Puzzles resueltos dinámicos
          setStats({ 
            elo: 850 + (completedLessons.length * 15), 
            puzzlesSolved: completedLessons.length 
          });
        }
      } catch (error) {
        console.error("Error al cargar progreso de ajedrez:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChessData();
  }, []);

  const calculateProgress = (lessons: any[]) => {
    if (!lessons || lessons.length === 0) return 0;
    const completed = lessons.filter((l: any) => l.completed).length;
    return Math.round((completed / lessons.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold text-slate-400 tracking-widest uppercase text-sm">Cargando Titanium Academy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pb-20">
      {/* HEADER HERO */}
      <div className="relative bg-slate-900 border-b border-slate-800 pb-12 pt-8 px-6 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-bold text-sm bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 hover:bg-slate-800">
            <ArrowLeft size={16} /> Volver al LMS
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Crown size={12} /> Titanium Chess Academy
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                Maestría Táctica
              </h1>
              <p className="text-slate-400 max-w-lg text-sm md:text-base leading-relaxed">
                El ajedrez no se trata de mover piezas, se trata de reconocer patrones. 
                Completa estos módulos para desarrollar tu "ojo táctico".
              </p>
            </div>

            {/* Stats Rápidos Dinámicos */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Trophy size={20} />
                  <span className="font-black text-2xl leading-none">{stats.elo}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ELO Táctico</div>
              </div>
              <div className="flex-1 md:flex-none bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Target size={20} />
                  <span className="font-black text-2xl leading-none">{stats.puzzlesSolved}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Resueltos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 space-y-8">
        
        {/* TARJETA: PUZZLE DIARIO */}
        <Link href="/dashboard/chess/practice?lessonId=tactics-1-1" className="block">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-1 border border-slate-700 shadow-2xl group cursor-pointer hover:border-indigo-500/50 transition-all">
            <div className="bg-[#0F1623] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Star size={32} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">Reto Diario: Ataque Doble</h3>
                  <p className="text-sm text-slate-400">Resuelve el problema de hoy para mantener tu racha.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-bold">DIFÍCIL</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">+25 XP</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg w-full md:w-auto justify-center">
                <Play size={16} fill="currentColor" /> RESOLVER AHORA
              </div>
            </div>
          </div>
        </Link>

        {/* LISTA DE MÓDULOS */}
        <div className="grid grid-cols-1 gap-6">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Ruta de Aprendizaje ({modules.length} Módulos)</h2>
          
          {modules.map((module) => {
            const currentProgress = calculateProgress(module.lessons);
            const isCompleted = currentProgress === 100;

            return (
              <div key={module.id} className={`bg-[#131B2C] rounded-2xl border ${module.locked ? 'border-slate-800 opacity-60' : 'border-slate-800 hover:border-slate-700 shadow-lg'} overflow-hidden transition-all duration-300`}>
                
                {/* HEADER DEL MÓDULO */}
                <div className="p-6 md:p-8 flex items-start gap-6 border-b border-slate-800/50 relative">
                  {isCompleted && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-lg shrink-0 ${module.locked ? 'grayscale' : ''}`}>
                    <module.icon size={28} />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{module.title}</h3>
                      {module.locked ? (
                        <Lock size={20} className="text-slate-600" />
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                          {currentProgress}% Completado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-4 max-w-2xl">{module.description}</p>
                    
                    {/* Barra de Progreso */}
                    {!module.locked && (
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden max-w-md">
                        <div className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000`} style={{ width: `${currentProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* LAS 10 LECCIONES DINÁMICAS */}
                {!module.locked && (
                  <div className="bg-[#0F1522]">
                    {module.lessons.map((lesson: any, idx: number) => (
                      <Link 
                        href={`/dashboard/chess/practice?lessonId=${lesson.id}`} 
                        key={lesson.id} 
                        className="flex items-center justify-between p-4 md:px-8 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${lesson.completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-transparent border-slate-700 text-slate-500 group-hover:border-indigo-500 group-hover:text-indigo-400'}`}>
                            {lesson.completed ? <Shield size={14} fill="currentColor"/> : idx + 1}
                          </div>
                          <span className={`font-bold text-sm ${lesson.completed ? 'text-slate-500 line-through decoration-slate-700' : 'text-slate-200 group-hover:text-white'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        
                        {lesson.completed ? (
                          <div className="flex gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                            {[1, 2, 3].map((star) => (
                              <Star key={star} size={12} className="text-amber-500" fill="currentColor"/>
                            ))}
                          </div>
                        ) : (
                          <button className="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-indigo-500/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 md:opacity-100">
                            INICIAR <ChevronRight size={14} />
                          </button>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
