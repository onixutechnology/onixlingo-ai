'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, Crown, ChevronLeft, Zap, Flame, 
  ShieldCheck, Lock, Sparkles, ChevronDown,
  CheckCircle2, Search, SlidersHorizontal
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { TROPHIES_1000, evaluateUnlocks, TrophyItem } from '@/data/trophies_1000';

const CATEGORY_FILTERS = [
  { id: 'all',        label: 'Todos',           emoji: '🏆' },
  { id: 'simulators', label: 'Simuladores',     emoji: '📋' },
  { id: 'discipline', label: 'Disciplina',      emoji: '🔥' },
  { id: 'english',    label: 'Inglés',          emoji: '🇬🇧' },
  { id: 'french',     label: 'Francés',         emoji: '🇫🇷' },
  { id: 'chinese',    label: 'Chino',           emoji: '🇨🇳' },
  { id: 'vocabulary', label: 'Vocabulario',     emoji: '📚' },
  { id: 'chess',      label: 'Ajedrez',         emoji: '♟️' },
  { id: 'executive',  label: 'Executive Pro',   emoji: '💼' },
  { id: 'eloquence',  label: 'Elocuencia',      emoji: '⚡' },
  { id: 'legendary',  label: 'Legendarios',     emoji: '👑' },
];

const TIER_STYLES: Record<string, { bg: string; badge: string; glow: string }> = {
  Bronze:   { bg: 'bg-orange-50 border-orange-200',   badge: 'bg-orange-600 text-slate-900',       glow: 'shadow-orange-200/50' },
  Silver:   { bg: 'bg-white border-slate-200',     badge: 'bg-white0 text-slate-900',         glow: 'shadow-slate-200/50' },
  Gold:     { bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/30',     badge: 'bg-[#D4AF37]/20 text-slate-900',         glow: 'shadow-amber-200/50' },
  Platinum: { bg: 'bg-teal-50 border-teal-200',       badge: 'bg-[#D4AF37]/20 text-slate-900',          glow: 'shadow-teal-200/50' },
  Obsidian: { bg: 'bg-slate-50 border-slate-800',    badge: 'bg-slate-700 text-slate-100',     glow: 'shadow-slate-900/60' },
};

const PAGE_SIZE = 48;

const COUNTRIES = [
  { code: 'all', label: 'Global', flag: '🌍' },
  { code: 'MX',  label: 'México', flag: '🇲🇽' },
  { code: 'ES',  label: 'España', flag: '🇪🇸' },
  { code: 'US',  label: 'USA',    flag: '🇺🇸' },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [globalStats, setGlobalStats] = useState({ total_active_users: 0, avg_eloquence: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>({ total_xp: 0, streak_days: 0, completed_modules: 0 });
  const [completedLessons, setCompletedLessons] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<'trophies' | 'ranking'>('trophies');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeCountry, setActiveCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = activeCountry === 'all'
          ? '/progress/eloquence-leaderboard'
          : `/progress/eloquence-leaderboard?country=${activeCountry}`;

        const results = await Promise.allSettled([
          apiClient.get(url),
          apiClient.get('/progress/stats'),
          apiClient.get('/progress/map')
        ]);

        const [leaderboardRes, statsRes, mapRes] = results;

        if (leaderboardRes.status === 'rejected') {
          const err = leaderboardRes.reason;
          const isAbort = err?.code === 'ERR_CANCELED' || err?.message === 'canceled' || err?.message?.includes('aborted') || err?.name === 'AbortError';
          const is401 = err?.response?.status === 401;
          if (!isAbort && !is401) {
            throw err;
          }
          return; // Salir silenciosamente
        }

        const leaderboardData = (leaderboardRes as PromiseFulfilledResult<any>).value.data;
        setLeaderboard(leaderboardData.leaderboard || []);
        setGlobalStats(leaderboardData.stats || { total_active_users: 0, avg_eloquence: 0 });

        const statsData = statsRes.status === 'fulfilled' 
          ? (statsRes as PromiseFulfilledResult<any>).value.data 
          : { total_xp: 0, streak_days: 0, completed_modules: 0 };
        setUserStats(statsData);

        const mapData = mapRes.status === 'fulfilled' 
          ? (mapRes as PromiseFulfilledResult<any>).value.data 
          : { standard: [] };
        setCompletedLessons(mapData.standard || []);
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeCountry]);

  // Reset pagination when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeCategory, statusFilter, searchQuery]);

  const unlockedTrophyIds = useMemo(
    () => evaluateUnlocks(userStats, completedLessons, leaderboard),
    [userStats, completedLessons, leaderboard]
  );

  const filteredTrophies = useMemo(() => {
    return TROPHIES_1000.filter(t => {
      const matchCat    = activeCategory === 'all' || t.category === activeCategory;
      const isUnlocked  = unlockedTrophyIds.has(t.id);
      const matchStatus = statusFilter === 'all'
        || (statusFilter === 'unlocked' && isUnlocked)
        || (statusFilter === 'locked'   && !isUnlocked);
      const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });
  }, [activeCategory, statusFilter, searchQuery, unlockedTrophyIds]);

  const visibleTrophies = filteredTrophies.slice(0, visibleCount);
  const topThree  = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const unlockedCount = unlockedTrophyIds.size;
  const progressPct   = Math.round((unlockedCount / TROPHIES_1000.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-teal-100 pb-20">
      
      {/* ── HEADER ── */}
      <nav className="h-14 border-b border-slate-200 px-4 md:px-6 flex items-center justify-between bg-white shadow-none z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-white transition-all border border-transparent hover:border-slate-200 rounded">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-50 flex items-center justify-center rounded-sm">
              <Trophy size={12} className="text-[#D4AF37]" />
            </div>
            <h1 className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-900">
              Cognitive <span className="text-[#D4AF37] font-serif italic">Achievements</span>
            </h1>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-white p-0.5 border border-slate-200">
          <button
            onClick={() => setActiveTab('trophies')}
            className={`px-3 md:px-4 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'trophies' ? 'bg-slate-50 text-slate-900 shadow-none' : 'text-slate-500 hover:text-slate-600'}`}
          >
            🏆 Vitrina (1,000)
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-3 md:px-4 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'ranking' ? 'bg-slate-50 text-slate-900 shadow-none' : 'text-slate-500 hover:text-slate-600'}`}
          >
            📊 Ranking
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full p-4 md:p-8">
        <AnimatePresence mode="wait">

          {/* ══════════════════ VITRINA DE TROFEOS ══════════════════ */}
          {activeTab === 'trophies' ? (
            <motion.div key="trophies-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

              {/* HERO METRIC BAR */}
              <div className="bg-white border border-slate-200 p-5 md:p-7 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Crown size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tighter uppercase font-serif italic leading-none mb-1">
                      Vitrina Ejecutiva
                    </h2>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                      1,000 trofeos · Desbloquea completando lecciones, simulacros, rachas y ajedrez
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-96 shrink-0">
                  <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                    <span>Progreso General</span>
                    <span className="text-[#D4AF37]">{unlockedCount.toLocaleString()} / 1,000</span>
                  </div>
                  <div className="w-full h-3 bg-white border border-slate-200 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[9px] font-black text-slate-500 mt-1.5 text-right">
                    {progressPct}% completado
                  </p>
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Desbloqueados',  value: unlockedCount, suffix: 'trofeos', color: 'text-[#D4AF37]' },
                  { label: 'Bloqueados',      value: 1000 - unlockedCount, suffix: 'trofeos', color: 'text-slate-500' },
                  { label: 'XP Total',        value: userStats.total_xp?.toLocaleString() || 0, suffix: 'XP', color: 'text-[#D4AF37]' },
                  { label: 'Racha Actual',    value: userStats.streak_days || 0, suffix: 'días', color: 'text-orange-500' },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-slate-200 p-4 text-center">
                    <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.suffix}</div>
                    <div className="text-[8px] font-bold text-slate-600 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* FILTROS */}
              <div className="bg-white border border-slate-200 p-4">
                {/* Search + toggle */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Buscar trofeo..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 text-xs border border-slate-200 bg-white focus:outline-none focus:border-slate-400 font-medium"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all"
                  >
                    <SlidersHorizontal size={12} />
                    Filtros
                  </button>
                </div>

                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORY_FILTERS.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${
                            activeCategory === cat.id
                              ? 'bg-slate-50 border-slate-900 text-slate-900'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-600'
                          }`}
                        >
                          {cat.emoji} {cat.label}
                        </button>
                      ))}
                    </div>
                    {/* Status toggle */}
                    <div className="inline-flex bg-white p-0.5 border border-slate-200">
                      {(['all', 'unlocked', 'locked'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all ${
                            statusFilter === s ? 'bg-white text-slate-900 shadow-none' : 'text-slate-500 hover:text-slate-600'
                          }`}
                        >
                          {s === 'all' ? 'Todos' : s === 'unlocked' ? '✓ Obtenidos' : '🔒 Bloqueados'}
                        </button>
                      ))}
                    </div>
                    {/* Results count */}
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Mostrando {Math.min(visibleCount, filteredTrophies.length)} de {filteredTrophies.length} trofeos
                    </p>
                  </motion.div>
                )}
              </div>

              {/* TROPHY GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {visibleTrophies.map((trophy: TrophyItem, idx: number) => {
                  const isUnlocked = unlockedTrophyIds.has(trophy.id);
                  const styles     = TIER_STYLES[trophy.tier] || TIER_STYLES.Bronze;

                  return (
                    <motion.div
                      layout
                      key={trophy.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.01, 0.3) }}
                      className={`border p-4 flex flex-col justify-between h-44 transition-all duration-200 relative overflow-hidden group ${
                        isUnlocked
                          ? `bg-white ${styles.bg.split(' ')[1]} hover:shadow-none hover:${styles.glow} hover:-translate-y-0.5`
                          : 'bg-white/80 border-slate-200 opacity-55 grayscale-[30%]'
                      } ${styles.bg}`}
                    >
                      {/* Tier badge + points */}
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-widest ${styles.badge}`}>
                          {trophy.tier}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-600">
                          <Zap size={10} className="text-[#D4AF37]" />
                          <span>+{trophy.points}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-[11px] font-black uppercase tracking-tight mb-1 flex items-center gap-1.5 leading-tight ${
                          isUnlocked ? (trophy.tier === 'Obsidian' ? 'text-slate-200 group-hover:text-amber-400' : 'text-slate-900 group-hover:text-[#D4AF37]') : 'text-slate-500'
                        }`}>
                          {isUnlocked
                            ? <Sparkles size={12} className="text-[#D4AF37] shrink-0" />
                            : <Lock size={12} className="text-slate-500 shrink-0" />
                          }
                          <span className="truncate">{trophy.name}</span>
                        </h4>
                        <p className={`text-[8px] font-bold uppercase leading-tight tracking-wide line-clamp-2 ${
                          trophy.tier === 'Obsidian' && isUnlocked ? 'text-slate-500' : 'text-slate-500'
                        }`}>
                          {trophy.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className={`mt-3 pt-2.5 border-t flex justify-between items-center text-[7px] font-black uppercase tracking-widest ${
                        trophy.tier === 'Obsidian' ? 'border-slate-700' : 'border-slate-200'
                      }`}>
                        <span className={trophy.tier === 'Obsidian' && isUnlocked ? 'text-slate-600' : 'text-slate-500'}>
                          #{trophy.id.replace('t_', '')}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[#D4AF37] flex items-center gap-1">
                            <CheckCircle2 size={11} strokeWidth={3} /> Desbloqueado
                          </span>
                        ) : (
                          <span className="text-slate-500">Bloqueado</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* LOAD MORE */}
              {visibleCount < filteredTrophies.length && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <ChevronDown size={14} />
                    Cargar más ({filteredTrophies.length - visibleCount} restantes)
                  </button>
                </div>
              )}

              {/* EMPTY STATE */}
              {filteredTrophies.length === 0 && (
                <div className="py-20 text-center bg-white border border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    No se encontraron trofeos con esos filtros.
                  </p>
                </div>
              )}

            </motion.div>

          ) : (
            /* ══════════════════ RANKING ══════════════════ */
            <motion.div key="ranking-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none mb-2 font-serif italic">
                    Elocuence Leaderboard
                  </h2>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">
                    Ranking de elocuencia y disciplina {activeCountry === 'all' ? 'global' : `en ${activeCountry}`}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 bg-white p-0.5 border border-slate-200">
                  {COUNTRIES.map(c => (
                    <button key={c.code} onClick={() => setActiveCountry(c.code)}
                      className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${
                        activeCountry === c.code ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:text-slate-600'
                      }`}
                    >
                      {c.flag} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOP 3 PODIO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {isLoading ? (
                  [1,2,3].map(n => <div key={n} className="h-48 bg-white border border-slate-200 animate-pulse" />)
                ) : topThree.length === 0 ? (
                  <div className="col-span-3 py-20 text-center bg-white border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sin datos para este país todavía.</p>
                  </div>
                ) : (
                  topThree.map((player, i) => (
                    <motion.div key={player.username} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className={`relative bg-white border-2 p-6 flex flex-col items-center text-center overflow-hidden ${
                        i === 0 ? 'border-amber-400 ring-4 ring-amber-400/5' : i === 1 ? 'border-slate-200' : 'border-amber-700/30'
                      }`}
                    >
                      <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900 ${
                        i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-amber-800'
                      }`}>
                        Rank #{player.rank}
                      </div>
                      <div className="mb-4 relative">
                        <div className={`w-20 h-20 flex items-center justify-center text-2xl font-black ${
                          player.is_pro ? 'bg-slate-50 text-slate-900' : 'bg-white text-slate-500'
                        }`}>
                          {player.username?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 border border-slate-200 text-xs shadow-none">
                          {COUNTRIES.find(c => c.code === player.country_code)?.flag || '🌍'}
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-1 truncate w-full">
                        {player.is_pro ? 'Executive' : 'Student'} {player.username ? player.username.substring(0, 2).toUpperCase() : '??'}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 text-[8px] font-black uppercase">
                          <Flame size={10} fill="currentColor" /> {player.streak_days} Racha
                        </div>
                        <div className="flex items-center gap-1 text-[#D4AF37] bg-teal-50 px-2 py-0.5 text-[8px] font-black uppercase">
                          <Zap size={10} fill="currentColor" /> {player.eloquence_points} Pts
                        </div>
                      </div>
                      <div className="w-full pt-4 border-t border-slate-200 flex justify-between items-center">
                        <div className="text-left">
                          <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Lecciones</p>
                          <p className="text-xs font-black text-slate-900">{player.completed_lessons}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Tier</p>
                          <p className={`text-[9px] font-black uppercase ${player.is_pro ? 'text-[#D4AF37]' : 'text-slate-500'}`}>
                            {player.is_pro ? 'Titanium' : 'Standard'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* TABLA RESTO */}
              {remaining.length > 0 && (
                <div className="bg-white border border-slate-200 shadow-none overflow-hidden mb-12">
                  <div className="grid grid-cols-[60px,1fr,100px,100px,120px] px-8 py-4 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                    <span>Pos</span><span>Executive Profile</span>
                    <span className="text-center">Lecciones</span>
                    <span className="text-center">Racha</span>
                    <span className="text-right">Elocuencia</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {remaining.map((player, idx) => (
                      <div key={player.username + idx} className="grid grid-cols-[60px,1fr,100px,100px,120px] px-8 py-4 items-center hover:bg-white transition-colors group">
                        <span className="text-sm font-black text-slate-300 group-hover:text-slate-900">#{player.rank}</span>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center text-xs font-black relative ${player.is_pro ? 'bg-slate-50 text-slate-900' : 'bg-white text-slate-500'}`}>
                            {player.username?.substring(0, 2).toUpperCase()}
                            <span className="absolute -bottom-1 -right-1 text-[10px] bg-white border border-slate-200 px-0.5">
                              {COUNTRIES.find(c => c.code === player.country_code)?.flag || '🌍'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900 uppercase tracking-tight">
                                {player.is_pro ? 'Executive' : 'Student'} {player.username ? player.username.substring(0, 2).toUpperCase() : '??'}
                              </span>
                              {player.is_pro && <ShieldCheck size={12} className="text-[#D4AF37]" />}
                            </div>
                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Corporate Associate</p>
                          </div>
                        </div>
                        <div className="text-center text-xs font-black text-slate-600">{player.completed_lessons}</div>
                        <div className="flex justify-center">
                          <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 text-[9px] font-black">
                            <Flame size={10} fill="currentColor" /> {player.streak_days}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-slate-900 font-black text-sm">
                            <Zap size={12} className="text-[#D4AF37]" />
                            {player.eloquence_points?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROMO TITANIUM */}
        <div className="bg-slate-50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 mt-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
              <Crown size={28} />
            </div>
            <div>
              <h4 className="text-slate-900 text-sm font-black uppercase tracking-widest mb-1">Mejorar Plan</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight max-w-sm">
                Desbloquea beneficios premium, acceso a IA ejecutiva y simuladores de negocios avanzados.
              </p>
            </div>
          </div>
          <button onClick={() => router.push('/dashboard/pricing')}
            className="w-full md:w-auto px-10 py-4 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-none shadow-teal-900/20"
          >
            Mejorar Plan
          </button>
        </div>
      </main>
    </div>
  );
}
