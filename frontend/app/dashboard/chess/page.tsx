'use client';

/**
 * ==============================================================================
 * ONIXLINGO CHESS ACADEMY - LOBBY (TITANIUM)
 * ==============================================================================
 * RUTA: /dashboard/chess/page.tsx
 * ESTADO: Production Ready (Failsafe Mode Activado + Reto Diario Dinámico)
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  ArrowLeft, Trophy, Zap, Crown, Target, Shield, Flame, 
  Layers, Sword, Lock, Star, ChevronRight, Play, Loader2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

// 🔥 IDs de las lecciones asignadas a cada día de la semana (Domingo = 0, Sábado = 6)
const DAILY_PUZZLES = [
  'fundamentals-1', // 0: Domingo
  'tactics-1-1',    // 1: Lunes
  'checkmates-1',   // 2: Martes
  'fundamentals-2', // 3: Miércoles
  'tactics-1-2',    // 4: Jueves
  'checkmates-2',   // 5: Viernes
  'tactics-1-3'     // 6: Sábado
];

const MODULES_UI_CONFIG = [
  { id: 'fundamentals', title: 'Fundamentos Esenciales', desc: 'Reglas, movimientos y capturas.', icon: Shield, color: 'from-blue-500 to-indigo-600', locked: false },
  { id: 'tactics-1', title: 'Táctica Básica: Patrones', desc: 'Ataques dobles, clavadas y descubiertas.', icon: Zap, color: 'from-emerald-500 to-teal-600', locked: false },
  { id: 'checkmates', title: 'Patrones de Mate', desc: 'Acorrala al Rey enemigo sin piedad.', icon: Crown, color: 'from-amber-500 to-orange-600', locked: false },
  { id: 'openings', title: 'Control del Centro', desc: 'Desarrollo de piezas y seguridad del Rey.', icon: Target, color: 'from-rose-500 to-pink-600', locked: false },
  { id: 'middlegame', title: 'Estrategia de Medio Juego', desc: 'Planes, estructuras y maniobras.', icon: Layers, color: 'from-purple-500 to-violet-600', locked: false },
  { id: 'endgames', title: 'Finales Teóricos', desc: 'Convierte tu ventaja material en victoria.', icon: Sword, color: 'from-cyan-500 to-blue-600', locked: false },
  { id: 'advanced', title: 'Cálculo Avanzado', desc: 'Sacrificios y redes de mate complejas.', icon: Flame, color: 'from-slate-700 to-slate-900', locked: true }
];

const getLessonTitle = (id: string) => {
  const titles: Record<string, string> = {
    'fundamentals-1': 'La Torre: Muros de Piedra',
    'fundamentals-2': 'El Alfil: Francotirador',
    'tactics-1-1': 'El Ataque Doble (The Fork)',
    'tactics-1-2': 'La Clavada Absoluta',
    'tactics-1-3': 'Ataque a la Descubierta',
    'checkmates-1': 'Mate del Pasillo',
    'checkmates-2': 'El Beso de la Muerte'
  };
  return titles[id] || `Unidad Táctica ${id.split('-')[1] || id}`;
};

export default function ChessLobbyPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [stats, setStats] = useState({ elo: 0, puzzlesSolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [dailyPuzzleId, setDailyPuzzleId] = useState('tactics-1-1');

  useEffect(() => {
    // ⏰ Establecer el puzzle dinámico según el día actual
    const today = new Date().getDay();
    setDailyPuzzleId(DAILY_PUZZLES[today] || 'tactics-1-1');

    const fetchChessData = async () => {
      let completedLessons: string[] = [];
      let currentElo = 850;

      try {
        const token = Cookies.get('access_token');
        if (token) {
          const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
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
            completedLessons = data.completed_lessons || [];
            currentElo = data.elo ? data.elo : 850 + (completedLessons.length * 15);
          } else {
            console.warn("⚠️ Backend respondió con error:", res.status);
          }
        }
      } catch (error) {
        console.error("⚠️ Error de conexión con el backend:", error);
      } finally {
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
        setStats({ 
          elo: currentElo, 
          puzzlesSolved: completedLessons.length 
        });
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
      <div className="min-h-screen bg-[#070A11] flex flex-col items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin mb-4 text-amber-500" size={48} />
        <p className="font-bold text-slate-400 tracking-widest uppercase text-sm">Iniciando Titanium Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 font-sans pb-20 selection:bg-indigo-500/30">
      
      {/* HEADER HERO - ESTÉTICA TITANIUM CRISTALINA */}
      <div className="relative border-b border-white/5 pb-12 pt-8 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#131B2C] to-[#070A11] z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/4 -translate-x-1/4 z-0"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-semibold text-sm bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
            <ArrowLeft size={16} /> Volver al LMS
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-amber-500/20 border border-white/10 text-xs font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-amber-200">
                  <Crown size={14} className="text-amber-400" /> Titanium Academy
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-2xl">
                Maestría <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Táctica</span>
              </h1>
              <p className="text-slate-400 max-w-lg text-sm md:text-base leading-relaxed">
                El ajedrez en OnixLingo no se trata solo de mover piezas, se trata de reconocer patrones y dominar el vocabulario.
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="flex items-center gap-2 text-amber-400 mb-1 drop-shadow-md">
                  <Trophy size={22} />
                  <span className="font-black text-3xl leading-none tracking-tight">{stats.elo}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ELO Táctico</div>
              </div>
              <div className="flex-1 md:flex-none bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="flex items-center gap-2 text-indigo-400 mb-1 drop-shadow-md">
                  <Target size={22} />
                  <span className="font-black text-3xl leading-none tracking-tight">{stats.puzzlesSolved}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resueltos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-20 space-y-8">
        
        {/* TARJETA: PUZZLE DIARIO (Dinámico) */}
        <Link href={`/dashboard/chess/practice?lessonId=${dailyPuzzleId}`} className="block group">
          <div className="relative rounded-2xl p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="bg-[#0B0F19] relative rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Star size={32} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                    Reto Diario: {getLessonTitle(dailyPuzzleId)}
                  </h3>
                  <p className="text-sm text-slate-400">Mantén tu racha activa resolviendo el problema táctico de hoy.</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[10px] bg-white/5 text-slate-300 px-2 py-1 rounded border border-white/10 font-bold tracking-wider">DIFÍCIL</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20 font-bold tracking-wider">+25 XP</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 bg-white text-[#0B0F19] px-6 py-3.5 rounded-xl font-black text-sm hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] w-full md:w-auto justify-center">
                <Play size={16} fill="currentColor" /> RESOLVER AHORA
              </div>
            </div>
          </div>
        </Link>

        {/* LISTA DE MÓDULOS */}
        <div className="grid grid-cols-1 gap-6">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mt-4">Ruta de Aprendizaje</h2>
          
          {modules.map((module) => {
            const currentProgress = calculateProgress(module.lessons);
            const isCompleted = currentProgress === 100;

            return (
              <div key={module.id} className={`bg-[#0B0F19] rounded-2xl border ${module.locked ? 'border-white/5 opacity-50' : 'border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.2)]'} overflow-hidden transition-all duration-300 relative`}>
                
                <div className="p-6 md:p-8 flex items-start gap-6 border-b border-white/5 relative bg-white/[0.02]">
                  {isCompleted && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]"></div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-lg shrink-0 ${module.locked ? 'grayscale' : ''}`}>
                    <module.icon size={28} />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">{module.title}</h3>
                      {module.locked ? (
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                          <Lock size={16} className="text-slate-500" />
                        </div>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${isCompleted ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'text-slate-300 bg-white/5 border-white/10'}`}>
                          {currentProgress}% Completado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-5 max-w-2xl">{module.desc}</p>
                    
                    {!module.locked && (
                      <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden max-w-md">
                        <div className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000 relative`} style={{ width: `${currentProgress}%` }}>
                          <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!module.locked && (
                  <div className="bg-[#070A11]/50 backdrop-blur-sm">
                    {module.lessons.map((lesson: any, idx: number) => (
                      <Link 
                        href={`/dashboard/chess/practice?lessonId=${lesson.id}`} 
                        key={lesson.id} 
                        className="flex items-center justify-between p-4 md:px-8 border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${lesson.completed ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-transparent border-white/10 text-slate-500 group-hover:border-indigo-500/50 group-hover:text-indigo-300'}`}>
                            {lesson.completed ? <Shield size={14} fill="currentColor"/> : idx + 1}
                          </div>
                          <span className={`font-medium text-sm transition-colors ${lesson.completed ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        
                        {lesson.completed ? (
                          <div className="flex gap-1 bg-amber-500/5 px-2.5 py-1.5 rounded-md border border-amber-500/10">
                            {[1, 2, 3].map((star) => (
                              <Star key={star} size={10} className="text-amber-500/80" fill="currentColor"/>
                            ))}
                          </div>
                        ) : (
                          <button className="text-[11px] font-bold text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-indigo-500/10 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 md:opacity-100 border border-indigo-500/20 hover:bg-indigo-500/20">
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
