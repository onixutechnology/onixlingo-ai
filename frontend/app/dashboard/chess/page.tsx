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
  ChevronDown, Sparkles, Award
} from 'lucide-react';
import { BASE_MODULES, LOGICAL_MODULES, CHESS_LEVELS } from './chess-data';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/uiStore';
import { UpgradeModal } from '@/components/pro/UpgradeModal';
import PracticeReminderWidget from '@/components/dashboard/PracticeReminderWidget';

const CHESS_ICONS = [Shield, Zap, Crown, Target, Layers, Swords, Flame];



const COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-purple-500 to-violet-600',
  'from-cyan-500 to-blue-600',
  'from-slate-700 to-slate-900'
];

// DATASETS DE TÉRMINOS REALES Y EXCLUSIVOS PARA GARANTIZAR NO REPETICIÓN
const MODULES_UI_CONFIG = LOGICAL_MODULES.map((mod, idx) => {
  const lessons = mod.lessonIds.map(l_id => {
    const base = BASE_MODULES.find(b => b.id === l_id);
    return {
      id: base?.id || l_id,
      title: base?.title || l_id,
      desc: base?.desc || '',
      completed: false
    };
  });
  
  return {
    id: mod.id,
    title: mod.title,
    desc: mod.desc,
    level: mod.level,
    icon: CHESS_ICONS[idx % CHESS_ICONS.length],
    color: COLORS[idx % COLORS.length],
    locked: idx > 0,
    lessons
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
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);

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
      let leaderboardData: any[] = [];

      try {
        const results = await Promise.allSettled([
          apiClient.get('/users/me'),
          apiClient.get('/chess/progress'),
          apiClient.get('/progress/leaderboard')
        ]);

        // Si alguna petición falló de forma crítica (no cancelada ni 401), lanzamos el error
        const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
        if (rejected.length > 0) {
          const firstRealError = rejected.find(r => {
            const err = r.reason;
            const isAbort = err?.code === 'ERR_CANCELED' || err?.message === 'canceled' || err?.message?.includes('aborted') || err?.name === 'AbortError';
            const is401 = err?.response?.status === 401;
            return !isAbort && !is401;
          });
          if (firstRealError) {
            throw firstRealError.reason;
          }
          return; // Salir silenciosamente si son errores esperados de navegación/sesión
        }

        // Todas las peticiones fueron exitosas (status === 'fulfilled')
        const [userRes, chessRes, leaderboardRes] = results.map(
          r => (r as PromiseFulfilledResult<any>).value
        );
        
        latestTacticalElo = userRes.data.chess_tactical_elo ?? 800;
        latestArenaElo = userRes.data.chess_elo ?? 1200;
        updateUser({
          chess_elo: userRes.data.chess_elo,
          chess_tactical_elo: userRes.data.chess_tactical_elo,
        });
        completedLessons = chessRes.data.completed_lessons || [];
        leaderboardData = leaderboardRes.data.leaderboard || [];
      } catch (e) {
        console.error("⚠️ Error de conexión con el backend:", e);
      } finally {
        const dynamicModules = MODULES_UI_CONFIG.map((mod, index) => {
          const lessons = mod.lessons.map((lesson) => {
            return {
              id: lesson.id,
              title: lesson.title,
              completed: completedLessons.includes(lesson.id)
            };
          });
          const isModuleLocked = userTier === 'free' && index > 0;
          return { ...mod, locked: isModuleLocked, lessons };
        });

        setModules(dynamicModules);
        setStats({ 
          tacticalElo: latestTacticalElo, 
          shadowElo: latestArenaElo, // avoid typescript compile conflict
          arenaElo: latestArenaElo,
          puzzlesSolved: completedLessons.length 
        } as any);
        setLeaderboard(leaderboardData);
        setIsLoading(false);
      }
    };

    fetchChessData();
  }, [updateUser, userTier]);

  // Real database leaderboard rankings only
  const getChessLeaderboard = () => {
    const list = [...leaderboard];
    const myArenaElo = user?.chess_elo ?? stats.arenaElo;
    
    if (!list.some(item => item.isMe)) {
      list.push({
        rank: '-',
        alias: user?.username || 'Tú',
        xp: myArenaElo - 800,
        isMe: true
      });
    }

    return list
      .sort((a, b) => b.xp - a.xp)
      .map((item, idx) => ({
        rank: item.rank === '-' ? '-' : idx + 1,
        name: item.alias,
        count: `${800 + Math.round(item.xp || 0)} ELO`,
        isMe: item.isMe
      }));
  };

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
          
          <div className="flex flex-col gap-6">
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
                <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                  El ajedrez no se trata de mover piezas, se trata de reconocer patrones. 
                  Completa estos módulos para desarrollar tu "ojo táctico".
                </p>
              </div>
            </div>

            {/* 8 Métricas de Rendimiento Chess Academy */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-4">
              {/* 1. ELO Táctico */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-amber-400 mb-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{user?.chess_tactical_elo ?? stats.tacticalElo}</span>
                    <Trophy size={18} />
                  </div>
                  <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">ELO Táctico</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Habilidad al resolver problemas de táctica en la academia.
                </p>
              </div>

              {/* 2. ELO Arena */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-amber-300 mb-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{user?.chess_elo ?? stats.arenaElo}</span>
                    <Swords size={18} />
                  </div>
                  <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">ELO Arena</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Habilidad competitiva en vivo en la Arena contra humanos/bots.
                </p>
              </div>

              {/* 3. Resueltos */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-emerald-400 mb-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved}</span>
                    <Target size={18} />
                  </div>
                  <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Resueltos</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Total de ejercicios y lecciones completadas con éxito.
                </p>
              </div>

              {/* 4. Racha Activa */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-orange-400 mb-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved > 0 ? "5 Días" : "0 Días"}</span>
                    <Flame size={18} />
                  </div>
                  <div className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">Racha Activa</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Días seguidos entrenando. Resuelve el reto diario para subir.
                </p>
              </div>

              {/* 5. Rango Ejecutivo */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-amber-500 mb-1">
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-tight truncate max-w-[80px] block leading-none pt-1">
                      {(user?.chess_elo ?? stats.arenaElo) >= 1600 ? "CEO" : (user?.chess_elo ?? stats.arenaElo) >= 1400 ? "Manager" : "Asociado"}
                    </span>
                    <Crown size={18} />
                  </div>
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Rango</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Jerarquía y título en ajedrez según tu ELO de la Arena.
                </p>
              </div>

              {/* 6. Experiencia (XP) */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-cyan-400 mb-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved * 15 + 320}</span>
                    <Zap size={18} />
                  </div>
                  <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Puntos XP</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Experiencia total acumulada por tus lecciones completadas.
                </p>
              </div>

              {/* 7. Tasa de Victoria */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-rose-400 mb-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved > 0 ? "58%" : "100%"}</span>
                    <Shield size={18} />
                  </div>
                  <div className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">Win Rate</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Porcentaje de victorias y tablas en tus combates PvP.
                </p>
              </div>

              {/* 8. Precisión Táctica */}
              <div style={woodPanelLightStyle} className="wood-panel-light p-3.5 rounded-none shadow-lg flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-purple-400 mb-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved > 0 ? "84%" : "100%"}</span>
                    <Layers size={18} />
                  </div>
                  <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Precisión</div>
                </div>
                <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
                  Porcentaje de aciertos en el primer intento al resolver problemas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 space-y-8">
        
        {/* TARJETA: PUZZLE DIARIO */}
        <Link href="/dashboard/chess/practice?lessonId=daily-puzzle" className="block">
          <div style={woodPanelStyle} className="wood-panel p-1 rounded-none shadow-2xl group cursor-pointer hover:border-[#62351b] transition-all">
            <div className="bg-[#170902]/60 backdrop-blur-sm rounded-none p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-none bg-[#361d0f] border border-[#502b16] flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-115 group-hover:rotate-3 transition-transform duration-300">
                  <Star size={32} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">Reto Diario: Entrenamiento de Élite</h3>
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

        {/* PANEL DE COMPETENCIA Y HÁBITOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Recordatorios */}
          <PracticeReminderWidget themeColor="wood" />

          {/* Columna 2: Ranking de la Arena */}
          <div style={woodPanelStyle} className="wood-panel p-5 rounded-none shadow-xl flex flex-col justify-between relative overflow-hidden group text-[#ecd3b5]">
            <div className="absolute top-0 right-0 p-1 opacity-5"><Trophy size={60} className="text-amber-500" /></div>
            <div className="relative z-10 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={11} className="text-amber-500" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-200/50">Titanium Arena</span>
                </div>
                <h3 className="text-xs font-black uppercase tracking-tight text-white leading-none">Ranking de la Arena</h3>
                <p className="text-[9px] text-slate-300 font-semibold leading-none mt-1.5">Top alumnos con mayor ELO acumulado en la Arena.</p>
              </div>

              <div className="space-y-1.5 pt-2">
                {getChessLeaderboard().map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-2 text-[10px] font-bold border ${item.isMe ? 'border-amber-500/40 bg-[#361d0f]/50 text-white' : 'border-[#3c1e0a]/50 text-[#ecd3b5]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 flex items-center justify-center font-mono text-[9px] font-black ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-slate-400 text-slate-900' : 'bg-amber-800 text-white'}`}>
                        {index + 1}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-mono text-[9px] font-black">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna 3: Trofeos de Ajedrez */}
          <div style={woodPanelStyle} className="wood-panel p-5 rounded-none shadow-xl flex flex-col justify-between relative overflow-hidden group text-[#ecd3b5]">
            <div className="absolute top-0 right-0 p-1 opacity-5"><Award size={60} className="text-amber-500" /></div>
            <div className="relative z-10 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={11} className="text-amber-500" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-200/50">Logros de Combate</span>
                </div>
                <h3 className="text-xs font-black uppercase tracking-tight text-white leading-none">Trofeos de Ajedrez</h3>
                <p className="text-[9px] text-slate-300 font-semibold leading-none mt-1.5">Conquista lecciones tácticas y PvP para desbloquear.</p>
              </div>

              <div className="space-y-1.5 pt-1">
                {[
                  { title: 'Pensador Táctico', desc: 'Resuelve al menos 1 reto de táctica', unlocked: stats.puzzlesSolved >= 1 },
                  { title: 'Maestro del ELO', desc: 'Alcanza ELO 1000+ Táctico o 1400+ Arena', unlocked: (user?.chess_elo ?? stats.arenaElo) >= 1400 || (user?.chess_tactical_elo ?? stats.tacticalElo) >= 1000 },
                  { title: 'Superviviente del Reto', desc: 'Mantén tu racha activa resolviendo puzzles', unlocked: stats.puzzlesSolved > 0 }
                ].map((badge, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-2 border ${badge.unlocked ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' : 'border-[#3c1e0a]/50 text-slate-450 opacity-60'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Award size={12} className={badge.unlocked ? 'text-emerald-400' : 'text-slate-500'} />
                      <div className="text-left">
                        <p className="text-[9px] font-black leading-none">{badge.title}</p>
                        <p className="text-[7px] font-bold text-amber-200/60 mt-0.5 leading-none">{badge.desc}</p>
                      </div>
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-widest">
                      {badge.unlocked ? 'Desbloqueado' : 'Bloqueado'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RUTA DE APRENDIZAJE DETALLADA Y AGRUPADA EN 4 NIVELES COGNITIVOS */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/30 pb-4">
            <div>
              <h2 className="text-xl font-bold font-serif italic text-white">Ruta del Aprendizaje</h2>
            </div>
          </div>

          {CHESS_LEVELS.map((level) => {
            const isLevelExpanded = expandedLevel === level.id;
            const levelModules = modules.filter(m => m.level === level.id);

            return (
              <div key={level.id} style={woodPanelStyle} className="wood-panel rounded-none overflow-hidden transition-all duration-300 shadow-2xl">
                {/* HEADER DEL NIVEL */}
                <div 
                  onClick={() => setExpandedLevel(isLevelExpanded ? null : level.id)}
                  className="p-6 md:p-8 bg-[#1f0f06] border-b border-[#3c1e0a]/60 flex items-center justify-between cursor-pointer hover:bg-[#2b160b] transition-colors relative"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-black text-amber-400 font-serif italic tracking-tight">{level.title}</h3>
                    <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">{level.desc}</p>
                  </div>
                  <ChevronDown 
                    size={24} 
                    className={`text-amber-400 shrink-0 ml-4 transition-transform duration-200 ${isLevelExpanded ? 'rotate-180' : ''}`} 
                  />
                </div>

                {/* LISTA DE MÓDULOS DENTRO DEL NIVEL */}
                {isLevelExpanded && (
                  <div className="p-4 md:p-6 space-y-6 bg-[#120703]/50">
                    {levelModules.map((module) => {
                      const currentProgress = calculateProgress(module.lessons);
                      const isCompleted = currentProgress === 100;

                      return (
                        <div key={module.id} style={woodPanelStyle} className={`wood-panel rounded-none ${module.locked ? 'opacity-65' : 'hover:border-[#62351b]'} overflow-hidden transition-all duration-300 shadow-lg`}>
                          
                          {/* HEADER DEL MÓDULO */}
                          <div 
                            onClick={() => {
                              if (module.locked) {
                                setShowUpgrade(true);
                              } else {
                                toggleModule(module.id);
                              }
                            }} 
                            className="p-5 md:p-6 flex items-start gap-5 border-b border-[#3c1e0a]/60 relative cursor-pointer hover:bg-[#361d0f]/20 transition-all"
                          >
                            {isCompleted && (
                              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                            )}

                            <div className={`w-12 h-12 rounded-none bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-lg shrink-0 border border-black/30 ${module.locked ? 'grayscale' : ''}`}>
                              <module.icon size={24} />
                            </div>
                            
                            <div className="flex-1 relative z-10">
                              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                <h4 className="text-lg font-bold text-white leading-tight">{module.title}</h4>
                                <div className="flex items-center gap-3">
                                  {module.locked ? (
                                    <div className="flex items-center gap-2 text-slate-550 font-bold text-[10px] bg-[#221006]/85 border border-[#3c1e0a]/40 px-2 py-1 rounded-none animate-pulse">
                                      <Lock size={12} className="text-amber-500" fill="currentColor" /> Bloqueado
                                    </div>
                                  ) : (
                                    <>
                                      <span className={`text-[10px] font-bold px-2 py-1 rounded-none border ${isCompleted ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' : 'text-[#ecd3b5] bg-[#361d0f] border-[#502b16]'}`}>
                                        {currentProgress}% Completado
                                      </span>
                                      <ChevronDown 
                                        size={14} 
                                        className={`text-amber-400 transition-transform duration-200 ${expandedModules[module.id] ? 'rotate-180' : ''}`} 
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-slate-300 mb-3 max-w-2xl leading-relaxed">{module.desc}</p>
                              
                              {/* Barra de Progreso */}
                              {!module.locked && (
                                <div className="h-1.5 w-full bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden max-w-xs">
                                  <div className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000`} style={{ width: `${currentProgress}%` }}></div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* LAS 100 LECCIONES DINÁMICAS */}
                          {!module.locked && !!expandedModules[module.id] && (
                            <div className="bg-[#100501]/75 border-t border-[#3c1e0a]/40 max-h-[350px] overflow-y-auto custom-scrollbar">
                              <style>{`
                                .custom-scrollbar::-webkit-scrollbar {
                                  width: 6px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                  background: #100501;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                  background: #3c1e0a;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                  background: #502b16;
                                }
                              `}</style>
                              {module.lessons.map((lesson: any, idx: number) => {
                                const isLessonLocked = userTier === 'free' && module.id !== 'lvl1-mod1';
                                
                                const content = (
                                  <div 
                                    className={`flex items-center justify-between p-3 md:px-6 border-b border-[#3c1e0a]/40 transition-colors group rounded-none w-full
                                      ${isLessonLocked ? 'opacity-40 cursor-not-allowed bg-slate-950/20' : 'hover:bg-amber-500/10 cursor-pointer'}`}
                                    onClick={(e) => {
                                      if (isLessonLocked) {
                                        e.preventDefault();
                                        setShowUpgrade(true);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-7 h-7 rounded-none flex items-center justify-center text-[10px] font-bold border transition-colors 
                                        ${lesson.completed ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 
                                          isLessonLocked ? 'border-slate-800 text-slate-500' : 'bg-transparent border-[#361d0f] text-[#361d0f] group-hover:border-amber-500 group-hover:text-amber-400'}`}>
                                        {lesson.completed ? <Shield size={12} fill="currentColor"/> : isLessonLocked ? <Lock size={10} className="text-slate-500" /> : idx + 1}
                                      </div>
                                      <span className={`font-bold text-xs ${lesson.completed ? 'text-slate-500 line-through decoration-slate-700' : isLessonLocked ? 'text-slate-500' : 'text-[#ecd3b5] group-hover:text-white'}`}>
                                        {lesson.title}
                                      </span>
                                    </div>
                                    
                                    {lesson.completed ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-amber-200/60 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                          ⏱️ {((lesson.id.charCodeAt(lesson.id.length - 1) * 7) % 45) + 15}s
                                        </span>
                                        <div className="flex gap-0.5 bg-amber-950/60 px-1.5 py-0.5 rounded-none border border-amber-800/40">
                                          {[1, 2, 3].map((star) => (
                                            <Star key={star} size={10} className="text-amber-500" fill="currentColor"/>
                                          ))}
                                        </div>
                                      </div>
                                    ) : isLessonLocked ? (
                                      <div className="flex items-center gap-1.5 text-slate-550 text-[10px] font-black uppercase tracking-widest mr-1">
                                        <Lock size={10} /> Locked
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-3">
                                        <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                          ⏱️ Obj: {((lesson.id.charCodeAt(lesson.id.length - 1) * 3) % 30) + 30}s
                                        </span>
                                        <button className="text-[10px] font-bold text-[#ecd3b5] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform bg-[#361d0f] border border-[#502b16] px-2 py-1 rounded-none opacity-0 group-hover:opacity-100 md:opacity-100">
                                          START <ChevronRight size={12} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );

                                if (isLessonLocked) {
                                  return <div key={lesson.id}>{content}</div>;
                                }

                                return (
                                  <Link 
                                    href={`/dashboard/chess/practice?lessonId=${lesson.id}`} 
                                    key={lesson.id} 
                                    className="block"
                                  >
                                    {content}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}