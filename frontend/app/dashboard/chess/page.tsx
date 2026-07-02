'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Crown, Target, Shield, Flame, 
  Layers, Swords, Star, Play, Loader2, Brain,
  ChevronRight, Zap
} from 'lucide-react';

import { BASE_MODULES, LOGICAL_MODULES, CHESS_LEVELS } from './chess-data';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/uiStore';
import { UpgradeModal } from '@/components/pro/UpgradeModal';
import PracticeReminderWidget from '@/components/dashboard/PracticeReminderWidget';
import { AdBanner } from '@/components/ads/AdBanner';

import { woodThemeBgStyle, woodPanelStyle } from './styles';
import { ChessHeaderStats } from './components/ChessHeaderStats';
import { ChessLeaderboardWidget, ChessTrophiesWidget } from './components/ChessStatsWidgets';
import { ChessLevelAccordion } from './components/ChessLevelAccordion';

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

export default function ChessLobbyPage() {
  const { user, updateUser } = useAuthStore();
  const { userTier, energy, checkAndResetDailyLimits } = useUIStore();
  
  const [modules, setModules] = useState<any[]>([]);
  const [stats, setStats] = useState({ tacticalElo: 800, arenaElo: 1200, puzzlesSolved: 0 });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);

  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

  useEffect(() => {
    const fetchCoreData = async () => {
      let completedLessons: string[] = [];
      let latestTacticalElo = 800;
      let latestArenaElo = 1200;

      try {
        const results = await Promise.allSettled([
          apiClient.get('/users/me'),
          apiClient.get('/chess/progress')
        ]);

        const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
        if (rejected.length > 0) {
          const firstRealError = rejected.find(r => {
            const err = r.reason;
            const isAbort = err?.code === 'ERR_CANCELED' || err?.message === 'canceled' || err?.name === 'AbortError';
            const is401 = err?.response?.status === 401;
            return !isAbort && !is401;
          });
          if (firstRealError) {
            throw firstRealError.reason;
          }
          return; 
        }

        const [userRes, chessRes] = results.map(r => (r as PromiseFulfilledResult<any>).value);
        
        latestTacticalElo = userRes.data.chess_tactical_elo ?? 800;
        latestArenaElo = userRes.data.chess_elo ?? 1200;
        updateUser({
          chess_elo: userRes.data.chess_elo,
          chess_tactical_elo: userRes.data.chess_tactical_elo,
        });
        completedLessons = chessRes.data.completed_lessons || [];
      } catch (e) {
        console.error("⚠️ Error de conexión:", e);
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
          shadowElo: latestArenaElo,
          arenaElo: latestArenaElo,
          puzzlesSolved: completedLessons.length 
        } as any);
        setIsLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await apiClient.get('/progress/leaderboard');
        setLeaderboard(res.data.leaderboard || []);
      } catch (e) {
        console.warn("No se pudo cargar el leaderboard");
      }
    };

    fetchCoreData();
    fetchLeaderboard();
  }, [updateUser, userTier]);

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
      .filter(item => {
        const name = item.alias?.toLowerCase() || '';
        return name !== 'diana' && name !== 'dina';
      })
      .sort((a, b) => b.xp - a.xp)
      .map((item, idx) => ({
        rank: item.rank === '-' ? '-' : idx + 1,
        name: item.alias,
        count: `${800 + Math.round(item.xp || 0)} ELO`,
        isMe: item.isMe
      }));
  };

  if (isLoading) {
    return (
      <div style={woodThemeBgStyle} className="wood-theme-bg min-h-screen flex flex-col items-center justify-center text-[#D4AF37] rounded-none">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold text-amber-200 tracking-widest uppercase text-sm">Cargando Titanium Academy...</p>
      </div>
    );
  }

  return (
    <div style={woodThemeBgStyle} className="wood-theme-bg min-h-screen text-[#ecd3b5] font-sans pb-20 rounded-none">
      
      {/* WRAPPER PRINCIPAL CON ANUNCIOS */}
      <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 pt-6 px-4">
        
        {/* ESPACIO PUBLICITARIO IZQUIERDO */}
        <div className="hidden xl:block w-[160px] shrink-0">
          <div className="sticky top-20 flex justify-center w-full">
            <AdBanner slot="1234567890" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
        </div>

        {/* CONTENEDOR CENTRAL */}
        <div className="flex-1 min-w-0 max-w-7xl mx-auto w-full flex flex-col gap-6">

          {/* HEADER HERO */}
          <div style={woodPanelStyle} className="relative border-b-4 border-[#1a0d04] pb-12 pt-8 px-6 overflow-hidden rounded-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent"></div>
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="flex items-center justify-between mb-6">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#ecd3b5] hover:text-slate-900 transition-colors font-bold text-sm bg-[#361d0f] px-4 py-2 rounded-none border border-[#502b16] hover:bg-[#462614]">
                  <ArrowLeft size={16} /> Volver al LMS
                </Link>
                {userTier === 'free' ? (
                  <div className="flex items-center">
                    <div className="relative w-16 h-5 bg-slate-50 rounded-[4px] border border-slate-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
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
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-900 font-mono leading-none tracking-wider drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)]">
                        {energy}%
                      </span>
                    </div>
                    <div className="w-[3px] h-2.5 bg-slate-700 rounded-r-[2px] -ml-[1px] shadow-none shrink-0" />
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
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-none">
                      Escuela de Ajedrez
                    </h1>
                    <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                      El ajedrez no se trata de mover piezas, se trata de reconocer patrones. 
                      Completa estos módulos para desarrollar tu "ojo táctico".
                    </p>
                  </div>
                </div>

                <ChessHeaderStats user={user} stats={stats} />
              </div>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 space-y-8 w-full">
            
            {/* TARJETA: PUZZLE DIARIO */}
            <Link href="/dashboard/chess/practice?lessonId=daily-puzzle" className="block">
              <div style={woodPanelStyle} className="p-1 rounded-none shadow-2xl group cursor-pointer hover:border-[#62351b] transition-all">
                <div className="bg-[#170902]/60 backdrop-blur-sm rounded-none p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-[#D4AF37]/20/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-none bg-[#361d0f] border border-[#502b16] flex items-center justify-center text-amber-400 shadow-none group-hover:scale-115 group-hover:rotate-3 transition-transform duration-300">
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
                  
                  <div className="relative z-10 bg-[#ecd3b5] text-[#1e130c] px-6 py-3 rounded-none font-black text-sm hover:bg-[#fbf8f0] transition-colors flex items-center gap-2 shadow-none w-full md:w-auto justify-center">
                    <Play size={16} fill="currentColor" /> RESOLVER AHORA
                  </div>
                </div>
              </div>
            </Link>

            {/* SECCIÓN: MODOS DE JUEGO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/dashboard/chess/vs-ai" className="block">
                <div style={woodPanelStyle} className="p-6 rounded-none shadow-xl hover:border-[#62351b] hover:scale-[1.01] transition-all duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/20/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#361d0f] text-amber-400 rounded-none border border-[#502b16] flex items-center justify-center">
                        <Brain size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Cognitive Engine</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">Jugar contra el Simulador</h3>
                    <p className="text-sm text-slate-300 mb-6">Pon a prueba tu pensamiento estratégico en tiempo real contra el Simulador con 3 niveles ejecutivos: Principiante, Manager y CEO.</p>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest mt-auto">
                    ENTRAR AL LAB <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/chess/arena" className="block">
                <div style={woodPanelStyle} className="p-6 rounded-none shadow-xl hover:border-[#62351b] hover:scale-[1.01] transition-all duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/20/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
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
              <PracticeReminderWidget themeColor="wood" />
              <ChessLeaderboardWidget leaderboard={getChessLeaderboard()} />
              <ChessTrophiesWidget stats={stats} user={user} />
            </div>

            {/* RUTA DE APRENDIZAJE DETALLADA Y AGRUPADA EN NIVELES COGNITIVOS */}
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/30 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-serif italic text-white">Ruta del Aprendizaje</h2>
                </div>
              </div>

              <ChessLevelAccordion 
                modules={modules}
                expandedLevel={expandedLevel}
                setExpandedLevel={setExpandedLevel}
                userTier={userTier}
                setShowUpgrade={setShowUpgrade}
              />
            </div>

          </div>
        </div> {/* FIN CONTENEDOR CENTRAL */}

        {/* ESPACIO PUBLICITARIO DERECHO */}
        <div className="hidden xl:block w-[160px] shrink-0">
          <div className="sticky top-20 flex justify-center w-full">
             <AdBanner slot="0987654321" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
        </div>

      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}