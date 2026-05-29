'use client';

/**
 * ==============================================================================
 * ONIXLINGO CHESS ACADEMY - LOBBY (TITANIUM)
 * ==============================================================================
 * RUTA: /dashboard/chess/page.tsx
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, Zap, Crown, Target, Shield, Flame, 
  Layers, Swords, Lock, Star, ChevronRight, Play, Loader2, Brain,
  ChevronDown
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/uiStore';

const CHESS_ICONS = [Shield, Zap, Crown, Target, Layers, Swords, Flame];

const BASE_MODULES = [
  { id: 'm-king', title: 'Fundamentos: El Rey', desc: 'Reglas, movimientos y seguridad del Rey.' },
  { id: 'm-queen', title: 'Fundamentos: La Dama', desc: 'El poder absoluto de la Dama en la arena.' },
  { id: 'm-rook', title: 'Fundamentos: La Torre', desc: 'Columnas abiertas y control de filas.' },
  { id: 'm-bishop', title: 'Fundamentos: El Alfil', desc: 'Diagonales de largo alcance.' },
  { id: 'm-knight', title: 'Fundamentos: El Caballo', desc: 'El salto táctico del Caballo.' },
  { id: 'm-pawn', title: 'Fundamentos: El Peón', desc: 'Promoción, paso y cadenas de peones.' },
  
  { id: 't-fork', title: 'Táctica: El Ataque Doble', desc: 'Ataques dobles de caballo, peón y dama.' },
  { id: 't-pin', title: 'Táctica: La Clavada', desc: 'Clavadas absolutas y relativas.' },
  { id: 't-skew', title: 'Táctica: La Enfilada', desc: 'Ataques a través de piezas valiosas.' },
  { id: 't-disc', title: 'Táctica: Descubierta', desc: 'Jaque y ataques a la descubierta.' },
  { id: 't-double', title: 'Táctica: Jaque Doble', desc: 'Fuerza extrema del jaque doble.' },
  { id: 't-deflect', title: 'Táctica: Desviación', desc: 'Desvía los defensores clave.' },
  { id: 't-attract', title: 'Táctica: Atracción', desc: 'Atrae piezas a casillas fatales.' },
  { id: 't-block', title: 'Táctica: Interrupción', desc: 'Bloquea líneas de defensa.' },
  { id: 't-clear', title: 'Táctica: Despeje de Casilla', desc: 'Abre paso a tus piezas clave.' },
  { id: 't-interpose', title: 'Táctica: Interposición', desc: 'Coloca obstáculos intermedios.' },
  
  { id: 'mate-corridor', title: 'Patrones: Mate de Pasillo', desc: 'Aprovecha la debilidad de la octava fila.' },
  { id: 'mate-smothered', title: 'Patrones: Mate de la Coz', desc: 'Encierra al Rey con su propia armada.' },
  { id: 'mate-anastasia', title: 'Patrones: Mate de Anastasia', desc: 'Torre y caballo acorralan al rey.' },
  { id: 'mate-boden', title: 'Patrones: Mate de Boden', desc: 'Dos alfiles cruzando diagonales.' },
  { id: 'mate-blackburne', title: 'Patrones: Mate de Blackburne', desc: 'Ataque coordinado de caballo y alfiles.' },
  { id: 'mate-lolli', title: 'Patrones: Mate de Lolli', desc: 'Penetración con peón en f6.' },
  { id: 'mate-arabian', title: 'Patrones: Mate Árabe', desc: 'Coordinación ancestral de caballo y torre.' },
  
  { id: 'op-center', title: 'Apertura: El Centro', desc: 'Principios de ocupación y control central.' },
  { id: 'op-king-gambit', title: 'Apertura: Gambito de Rey', desc: 'Ataques rápidos al flanco de rey.' },
  { id: 'op-sicilian', title: 'Apertura: Defensa Siciliana', desc: 'Contratante lucha asimétrica.' },
  { id: 'op-ruy-lopez', title: 'Apertura: Ruy López', desc: 'Desarrollo clásico del alfil español.' },
  { id: 'op-french', title: 'Apertura: Defensa Francesa', desc: 'Fortificaciones sólidas de peones.' },
  
  { id: 'str-pawns', title: 'Estrategia: Estructura de Peones', desc: 'Peones doblados, aislados y pasados.' },
  { id: 'str-outpost', title: 'Estrategia: Puestos Avanzados', desc: 'Establece caballos inexpugnables.' }
];

const COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-purple-500 to-violet-600',
  'from-cyan-500 to-blue-600',
  'from-slate-700 to-slate-900'
];

const MODULES_UI_CONFIG = BASE_MODULES.map((bm, idx) => {
  return {
    id: bm.id,
    title: bm.title,
    desc: bm.desc,
    icon: CHESS_ICONS[idx % CHESS_ICONS.length],
    color: COLORS[idx % COLORS.length],
    locked: idx > 0
  };
});

const woodThemeBgStyle = {
  backgroundColor: '#1b0e06',
  backgroundImage: `
    linear-gradient(90deg, rgba(46, 23, 7, 0.45) 0%, rgba(20, 10, 3, 0.45) 100%),
    repeating-linear-gradient(90deg, transparent 0px, transparent 150px, rgba(0, 0, 0, 0.35) 150px, rgba(0, 0, 0, 0.35) 154px),
    repeating-linear-gradient(0deg, transparent 0px, transparent 80px, rgba(0, 0, 0, 0.25) 80px, rgba(0, 0, 0, 0.25) 82px),
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
    repeating-linear-gradient(35deg, rgba(82, 45, 17, 0.03) 0px, rgba(82, 45, 17, 0.03) 2px, transparent 2px, transparent 6px),
    repeating-linear-gradient(-35deg, rgba(82, 45, 17, 0.03) 0px, rgba(82, 45, 17, 0.03) 2px, transparent 2px, transparent 6px),
    linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)
  `,
  boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.95)',
};

const woodPanelStyle = {
  backgroundColor: '#2a1409',
  backgroundImage: `
    linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 100%),
    radial-gradient(ellipse at 50% 0%, rgba(255, 223, 128, 0.06) 0%, transparent 70%),
    linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.1) 100%)
  `,
  border: '3px solid #4a240f',
  borderTopColor: '#5d3017',
  borderBottomColor: '#301608',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.75)',
};

const woodPanelLightStyle = {
  backgroundColor: '#3b1e0d',
  backgroundImage: `
    linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 100%),
    linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.05) 100%)
  `,
  border: '2px solid #5d3017',
  borderTopColor: '#6e391b',
  borderBottomColor: '#41200a',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 6px 16px rgba(0, 0, 0, 0.5)',
};

export default function ChessLobbyPage() {
  const { user, updateUser } = useAuthStore();
  const { userTier, energy, checkAndResetDailyLimits } = useUIStore();
  const [modules, setModules] = useState<any[]>([]);
  const [stats, setStats] = useState({ tacticalElo: 800, arenaElo: 1200, puzzlesSolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

  useEffect(() => {
    const fetchChessData = async () => {
      let completedLessons: string[] = [];
      let latestTacticalElo = 800;
      let latestArenaElo = 1200;

      try {
        const userRes = await apiClient.get('/users/me');
        latestTacticalElo = userRes.data.chess_tactical_elo ?? 800;
        latestArenaElo = userRes.data.chess_elo ?? 1200;
        updateUser({
          chess_elo: userRes.data.chess_elo,
          chess_tactical_elo: userRes.data.chess_tactical_elo,
        });
      } catch (e) {
        console.error("⚠️ Error syncing user ELO from backend:", e);
      }

      try {
        const res = await apiClient.get('/chess/progress');
        completedLessons = res.data.completed_lessons || [];
      } catch (error) {
        console.error("⚠️ Error de conexión con el backend:", error);
      } finally {
        // 🔥 EL FAILSAFE: Siempre construye los módulos, haya fallado el backend o no.
        const dynamicModules = MODULES_UI_CONFIG.map(mod => {
          const lessons = Array.from({ length: 50 }).map((_, idx) => {
            const lessonId = `${mod.id}-${idx + 1}`;
            return {
              id: lessonId,
              title: `${mod.title} - Unidad ${idx + 1}`,
              completed: completedLessons.includes(lessonId)
            };
          });
          return { ...mod, lessons };
        });

        setModules(dynamicModules);
        setStats({ 
          tacticalElo: latestTacticalElo, 
          arenaElo: latestArenaElo,
          puzzlesSolved: completedLessons.length 
        });
        
        setIsLoading(false);
      }
    };

    fetchChessData();
  }, [updateUser]);

  const calculateProgress = (lessons: any[]) => {
    if (!lessons || lessons.length === 0) return 0;
    const completed = lessons.filter((l: any) => l.completed).length;
    return Math.round((completed / lessons.length) * 100);
  };

  if (isLoading) {
    return (
      <div style={woodThemeBgStyle} className="wood-theme-bg min-h-screen flex flex-col items-center justify-center text-amber-500 rounded-none">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold text-amber-200 tracking-widest uppercase text-sm">Cargando Titanium Academy...</p>
      </div>
    );
  }

  return (
    <div style={woodThemeBgStyle} className="wood-theme-bg min-h-screen text-[#ecd3b5] font-sans pb-20 rounded-none">
      {/* HEADER HERO */}
      <div style={woodPanelStyle} className="wood-panel relative border-b-4 border-[#1a0d04] pb-12 pt-8 px-6 overflow-hidden rounded-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#ecd3b5] hover:text-white transition-colors font-bold text-sm bg-[#361d0f] px-4 py-2 rounded-none border border-[#502b16] hover:bg-[#462614]">
              <ArrowLeft size={16} /> Volver al LMS
            </Link>
            {userTier === 'free' ? (
              <div className="flex items-center">
                {/* Cuerpo de la Batería */}
                <div className="relative w-16 h-5 bg-slate-950 rounded-[4px] border border-slate-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div 
                    className={`h-full rounded-[2px] transition-all duration-500 ${
                      energy > 50 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                        : energy > 20 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                          : 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                    }`}
                    style={{ width: `${energy}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white font-mono leading-none tracking-wider drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)]">
                    {energy}%
                  </span>
                </div>
                {/* Polo Positivo */}
                <div className="w-[3px] h-2.5 bg-slate-700 rounded-r-[2px] -ml-[1px] shadow-sm shrink-0" />
              </div>
            ) : (
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Energía Ilimitada</span>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-none bg-amber-950/60 text-amber-400 border border-amber-800/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Crown size={12} /> Titanium Chess Academy
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                Escuela de Ajedrez
              </h1>
              <p className="text-slate-300 max-w-lg text-sm md:text-base leading-relaxed">
                El ajedrez no se trata de mover piezas, se trata de reconocer patrones. 
                Completa estos módulos para desarrollar tu "ojo táctico".
              </p>
            </div>

            {/* Stats Rápidos Dinámicos */}
            <div className="flex gap-4 w-full md:w-auto">
              <div style={woodPanelLightStyle} className="wood-panel-light flex-1 md:flex-none p-4 rounded-none shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Trophy size={20} />
                  <span className="font-black text-2xl leading-none">{user?.chess_tactical_elo ?? stats.tacticalElo}</span>
                </div>
                <div className="text-[10px] text-amber-200/60 font-bold uppercase tracking-wider">ELO Táctico</div>
              </div>
              <div style={woodPanelLightStyle} className="wood-panel-light flex-1 md:flex-none p-4 rounded-none shadow-lg">
                <div className="flex items-center gap-2 text-amber-300 mb-1">
                  <Swords size={20} />
                  <span className="font-black text-2xl leading-none">{user?.chess_elo ?? stats.arenaElo}</span>
                </div>
                <div className="text-[10px] text-amber-200/60 font-bold uppercase tracking-wider">ELO Arena</div>
              </div>
              <div style={woodPanelLightStyle} className="wood-panel-light flex-1 md:flex-none p-4 rounded-none shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Target size={20} />
                  <span className="font-black text-2xl leading-none">{stats.puzzlesSolved}</span>
                </div>
                <div className="text-[10px] text-amber-200/60 font-bold uppercase tracking-wider">Resueltos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 space-y-8">
        
        {/* TARJETA: PUZZLE DIARIO */}
        <Link href="/dashboard/chess/practice?lessonId=tactics-1-1" className="block">
          <div style={woodPanelStyle} className="wood-panel p-1 rounded-none shadow-2xl group cursor-pointer hover:border-[#62351b] transition-all">
            <div className="bg-[#170902]/60 backdrop-blur-sm rounded-none p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-none bg-[#361d0f] border border-[#502b16] flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-115 group-hover:rotate-3 transition-transform duration-300">
                  <Star size={32} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">Reto Diario: Ataque Doble</h3>
                  <p className="text-sm text-slate-300">Resuelve el problema de hoy para mantener tu racha.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-red-950/60 text-red-400 px-2 py-0.5 rounded-none border border-red-800/40 font-bold">DIFÍCIL</span>
                    <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded-none border border-emerald-800/40 font-bold">+25 XP</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 bg-[#ecd3b5] text-[#1e130c] px-6 py-3 rounded-none font-black text-sm hover:bg-[#fbf8f0] transition-colors flex items-center gap-2 shadow-lg w-full md:w-auto justify-center">
                <Play size={16} fill="currentColor" /> RESOLVER AHORA
              </div>
            </div>
          </div>
        </Link>

        {/* SECCIÓN: MODOS DE JUEGO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta: Vs OnixAI */}
          <Link href="/dashboard/chess/vs-ai" className="block">
            <div style={woodPanelStyle} className="wood-panel p-6 rounded-none shadow-xl hover:border-[#62351b] hover:scale-[1.01] transition-all duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#361d0f] text-amber-400 rounded-none border border-[#502b16] flex items-center justify-center">
                    <Brain size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Cognitive Engine</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">Jugar contra OnixAI</h3>
                <p className="text-sm text-slate-300 mb-6">Pon a prueba tu pensamiento estratégico en tiempo real contra OnixAI con 3 niveles ejecutivos: Principiante, Manager y CEO.</p>
              </div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest mt-auto">
                ENTRAR AL LAB <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Tarjeta: Arena PvP */}
          <Link href="/dashboard/chess/arena" className="block">
            <div style={woodPanelStyle} className="wood-panel p-6 rounded-none shadow-xl hover:border-[#62351b] hover:scale-[1.01] transition-all duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#361d0f] text-amber-400 rounded-none border border-[#502b16] flex items-center justify-center">
                    <Swords size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Matchmaking Realtime</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">Arena PvP (Multijugador)</h3>
                <p className="text-sm text-slate-300 mb-6">Enfréntate en vivo a otros estudiantes de la academia. Control de tiempo Bullet, Blitz y Rapid con emparejamiento por ELO.</p>
              </div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest mt-auto">
                ENTRAR A LA ARENA <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* LISTA DE MÓDULOS */}
        <div className="grid grid-cols-1 gap-6">
          <h2 className="text-xs font-black text-amber-200/40 uppercase tracking-[0.2em] ml-1">Ruta de Aprendizaje ({modules.length} Módulos)</h2>
          
          {modules.map((module) => {
            const currentProgress = calculateProgress(module.lessons);
            const isCompleted = currentProgress === 100;

            return (
              <div key={module.id} style={woodPanelStyle} className={`wood-panel rounded-none ${module.locked ? 'opacity-60' : 'hover:border-[#62351b]'} overflow-hidden transition-all duration-300`}>
                
                {/* HEADER DEL MÓDULO */}
                <div 
                  onClick={() => !module.locked && toggleModule(module.id)} 
                  className={`p-6 md:p-8 flex items-start gap-6 border-b border-[#3c1e0a]/60 relative ${module.locked ? '' : 'cursor-pointer hover:bg-[#361d0f]/20 transition-all'}`}
                >
                  {isCompleted && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                  )}

                  <div className={`w-14 h-14 rounded-none bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-lg shrink-0 border border-black/30 ${module.locked ? 'grayscale' : ''}`}>
                    <module.icon size={28} />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{module.title}</h3>
                      <div className="flex items-center gap-3">
                        {module.locked ? (
                          <Lock size={20} className="text-slate-600" />
                        ) : (
                          <>
                            <span className={`text-xs font-bold px-3 py-1 rounded-none border ${isCompleted ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' : 'text-[#ecd3b5] bg-[#361d0f] border-[#502b16]'}`}>
                              {currentProgress}% Completado
                            </span>
                            <ChevronDown 
                              size={16} 
                              className={`text-amber-400 transition-transform duration-200 ${expandedModules[module.id] ? 'rotate-180' : ''}`} 
                            />
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-4 max-w-2xl">{module.desc}</p>
                    
                    {/* Barra de Progreso */}
                    {!module.locked && (
                      <div className="h-2 w-full bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden max-w-md">
                        <div className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000`} style={{ width: `${currentProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* LAS 10 LECCIONES DINÁMICAS */}
                {!module.locked && !!expandedModules[module.id] && (
                  <div className="bg-[#100501]/75 border-t border-[#3c1e0a]/40">
                    {module.lessons.map((lesson: any, idx: number) => (
                      <Link 
                        href={`/dashboard/chess/practice?lessonId=${lesson.id}`} 
                        key={lesson.id} 
                        className="flex items-center justify-between p-4 md:px-8 border-b border-[#3c1e0a]/40 hover:bg-amber-500/10 transition-colors group rounded-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-none flex items-center justify-center text-xs font-bold border-2 transition-colors ${lesson.completed ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-transparent border-[#361d0f] text-[#361d0f] group-hover:border-amber-500 group-hover:text-amber-400'}`}>
                            {lesson.completed ? <Shield size={14} fill="currentColor"/> : idx + 1}
                          </div>
                          <span className={`font-bold text-sm ${lesson.completed ? 'text-slate-500 line-through decoration-slate-700' : 'text-[#ecd3b5] group-hover:text-white'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        
                        {lesson.completed ? (
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-amber-200/60 font-bold uppercase tracking-wider flex items-center gap-1">
                              ⏱️ {((lesson.id.charCodeAt(lesson.id.length - 1) * 7) % 45) + 15}s
                            </span>
                            <div className="flex gap-1 bg-amber-950/60 px-2 py-1 rounded-none border border-amber-800/40">
                              {[1, 2, 3].map((star) => (
                                <Star key={star} size={12} className="text-amber-500" fill="currentColor"/>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] text-slate-500/80 font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              ⏱️ Obj: {((lesson.id.charCodeAt(lesson.id.length - 1) * 3) % 30) + 30}s
                            </span>
                            <button className="text-xs font-bold text-[#ecd3b5] flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-[#361d0f] border border-[#502b16] px-3 py-1.5 rounded-none opacity-0 group-hover:opacity-100 md:opacity-100">
                              INICIAR <ChevronRight size={14} />
                            </button>
                          </div>
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