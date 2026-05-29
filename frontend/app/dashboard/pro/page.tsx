'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check,
  PieChart, Users, Building, ArrowLeft, Gem, Star,
  Crown, Mic, Volume2, Trophy, BarChart3, Bell, X, BookOpen, Activity,
  Home, User, Languages, ChevronDown, Loader2,
  Rocket, Shield, Video, MessageSquare, Target, Zap, ChevronRight,
  Ticket, Sparkles
} from 'lucide-react';

import { UpgradeModal } from '@/components/pro/UpgradeModal';
import { ReadingStudio } from '@/components/pro/ReadingStudio';
import { B2BNegotiations } from '@/components/pro/B2BNegotiations';
import { ExecutiveCommandCenter } from '@/components/pro/ExecutiveCommandCenter';
import { SpeechCalibrateModal } from '@/components/pro/SpeechCalibrateModal';
import { RaffleModal } from '@/components/pro/RaffleModal';
import apiClient from '@/lib/apiClient';
import { PRO_CURRICULUM, PRO_CURRICULUM_FR } from '@/data/curriculum_pro_fr';

interface KPIStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  fluencyScore: number;
  totalTickets: number;
  streakDays: number;
  completedModules: number;
}

interface LessonStatus {
  lesson_id: string;
  status: 'locked' | 'active' | 'completed';
  is_unlocked: boolean;
  score?: number;
}

const LEVEL_CONFIG: Record<string, { gradient: string; badge: string; badgeText: string; glow: string; border: string; iconBg: string; iconColor: string }> = {
  B1: {
    gradient: 'from-sky-600 to-blue-700',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'Foundation',
    glow: 'shadow-sky-500/5',
    border: 'border-sky-200',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  B2: {
    gradient: 'from-blue-600 to-indigo-700',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'Management',
    glow: 'shadow-blue-500/5',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  C1: {
    gradient: 'from-indigo-600 to-violet-700',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'Advanced',
    glow: 'shadow-indigo-500/5',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  C2: {
    gradient: 'from-violet-600 to-purple-700',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    badgeText: 'Executive',
    glow: 'shadow-violet-500/5',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  Exec: {
    gradient: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'Boardroom',
    glow: 'shadow-amber-500/5',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  Mastery: {
    gradient: 'from-rose-500 to-pink-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'Mastery',
    glow: 'shadow-rose-500/5',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
};

// PRO_CURRICULUM (600 lecciones en inglés) importado desde @/data/curriculum_pro_fr

export default function ExecutiveDashboard() {
  const router = useRouter();
  const { setMode, activeLanguage } = useUIStore();

  const [proProgress, setProProgress] = useState<LessonStatus[]>([]);
  const [kpis, setKpis] = useState<KPIStats>({ 
    totalXP: 0, 
    currentLevel: 1, 
    accuracy: 0, 
    fluencyScore: 0,
    totalTickets: 0,
    streakDays: 0,
    completedModules: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('exec-b1');
  const [showReadingStudio, setShowReadingStudio] = useState(false);
  const [showB2BNegotiations, setShowB2BNegotiations] = useState(false);
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [showSpeechCalibrate, setShowSpeechCalibrate] = useState(false);
  const [showRaffleModal, setShowRaffleModal] = useState(false);

  const currentCurriculum = useMemo(() => {
    if (activeLanguage === 'fr') return PRO_CURRICULUM_FR;
    return PRO_CURRICULUM;
  }, [activeLanguage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, mapRes, statsRes] = await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/progress/map'),
          apiClient.get('/progress/stats')
        ]);

        const tier = (userRes.data.membership?.tier || userRes.data.tier || 'free').toLowerCase();
        const isExecutive = tier === 'executive' || tier === 'titanium';
        setIsUserPremium(isExecutive);
        setProProgress(mapRes.data.pro || []);

        const statsData = statsRes.data;
        setKpis({
          totalXP: statsData.total_xp || 0,
          currentLevel: 1,
          accuracy: statsData.accuracy || 0,
          fluencyScore: statsData.fluency_score || 0,
          totalTickets: statsData.total_tickets || 0,
          streakDays: statsData.streak_days || 0,
          completedModules: statsData.completed_modules || 0
        });
      } catch (error) {
        console.error('Error fetching executive data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f2faf9 0%, #e0f5f3 30%, #caefea 70%, #aee3dd 100%)' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-teal-600/10 border-t-teal-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown size={20} className="text-teal-600" />
          </div>
        </div>
        <span className="mt-6 uppercase tracking-[0.3em] text-[10px] font-bold text-teal-800 animate-pulse">
          Initializing Executive Interface...
        </span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-800 font-sans selection:bg-teal-400/30 selection:text-teal-900 pb-24"
      style={{
        background: 'linear-gradient(135deg, #f2faf9 0%, #e0f5f3 30%, #caefea 70%, #aee3dd 100%)',
      }}
    >
      {/* Ambient glow layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-200/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-200/10 rounded-full blur-[100px]" />
      </div>

      {!isUserPremium && <UpgradeModal />}

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-teal-850 px-6 h-14 flex items-center justify-between backdrop-blur-xl"
        style={{ background: 'rgba(13, 76, 70, 0.95)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-teal-300 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-400/30">
              <Crown size={14} className="text-white" />
            </div>
            <span className="font-black text-white text-sm tracking-tight">
              OnixLingo <span className="text-cyan-200">Executive</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-sm border border-white/30 bg-white/10 text-[10px] font-black text-white uppercase tracking-widest">
            <Gem size={11} />
            Titanium Status
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5 text-[11px] font-black text-white/70 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Trophy size={13} /> {kpis.totalXP} XP
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <Activity size={13} /> {kpis.accuracy}% ACC
            </span>
          </div>
          <div className="flex items-center gap-4 border-l border-white/20 pl-5">
            <Link
              href="/dashboard/leaderboard"
              className="text-[10px] font-black text-white/70 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
            >
              <Trophy size={13} /> Ranking
            </Link>
            <button
              onClick={() => { setMode('student'); router.push('/dashboard'); }}
              className="text-[10px] font-black text-white/70 hover:text-white transition-colors uppercase tracking-widest"
            >
              Exit Executive
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">

        {/* ─── HERO ─── */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-teal-800/20 bg-white/40 text-[10px] font-bold text-teal-950 uppercase tracking-[0.25em] mb-5">
            <Gem size={11} className="text-teal-700" /> Titanium-Grade Enterprise Training Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-3 text-slate-900">
            Executive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900">
              Command Center.
            </span>
          </h1>
          <p className="text-slate-700 text-sm font-semibold max-w-xl mx-auto">
            {activeLanguage === 'fr'
              ? '600 leçons professionnelles de haut niveau pour les dirigeants. Maîtrisez la communication en entreprise.'
              : '600 lecciones profesionales de élite diseñadas para la alta dirección. Dominando la comunicación en contextos corporativos reales.'}
          </p>
        </motion.header>

        {/* ─── PREMIUM KPI METRIC CARDS ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
        >
          {/* ── CARD 1: COMMAND STATUS (Executive Level + XP) ── */}
          <div
            onClick={() => setShowCommandCenter(true)}
            className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/8 via-yellow-500/5 to-orange-500/8 p-6 backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-xl"
          >
            {/* Background glyph */}
            <div className="absolute right-0 top-0 -mr-4 -mt-4 opacity-[0.04] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 pointer-events-none">
              <Crown size={110} className="text-amber-500" />
            </div>
            {/* Level badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-600 text-[8px] font-black uppercase rounded-full tracking-widest">
                LVL {Math.floor(kpis.totalXP / 500) + 1}
              </span>
            </div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500/12 border border-amber-500/25 rounded-xl shadow-sm group-hover:bg-amber-500/20 transition-colors">
                <Trophy size={20} className="text-amber-500" />
              </div>
              <div>
                <h4 className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none">Command Status</h4>
                <p className="text-[10px] font-bold text-slate-600 mt-0.5">
                  {kpis.streakDays > 0 ? `🔥 ${kpis.streakDays}-day streak` : 'Start your streak'}
                </p>
              </div>
            </div>
            {/* XP Display */}
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{kpis.totalXP.toLocaleString()}</span>
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-wide">XP</span>
              </div>
              <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                {kpis.completedModules} módulos · {kpis.accuracy}% accuracy
              </p>
            </div>
            {/* XP Level Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase mb-1">
                <span>Level {Math.floor(kpis.totalXP / 500) + 1}</span>
                <span>{Math.round(((kpis.totalXP % 500) / 500) * 100)}% to next</span>
              </div>
              <div className="relative h-1.5 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round(((kpis.totalXP % 500) / 500) * 100)}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="pt-3 border-t border-amber-500/12 flex items-center justify-between text-[9px] font-extrabold text-amber-700 uppercase tracking-widest">
              <span>Ver Analytics Completo</span>
              <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* ── CARD 2: SPEECH CALIBRATION (Phonetic Lab) ── */}
          <div
            onClick={() => setShowSpeechCalibrate(true)}
            className="group relative overflow-hidden rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-500/8 via-cyan-500/5 to-emerald-500/8 p-6 backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-teal-500/50 hover:shadow-teal-500/10 hover:shadow-xl"
          >
            <div className="absolute right-0 top-0 -mr-4 -mt-4 opacity-[0.04] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none">
              <Zap size={110} className="text-teal-500" />
            </div>
            {/* CEFR Badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 bg-teal-500/15 border border-teal-500/30 text-teal-600 text-[8px] font-black uppercase rounded-full tracking-widest">
                {kpis.accuracy >= 88 ? 'C1' : kpis.accuracy >= 78 ? 'B2' : 'B1'}
              </span>
            </div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative p-2.5 bg-teal-500/12 border border-teal-500/25 rounded-xl shadow-sm group-hover:bg-teal-500/20 transition-colors">
                <Mic size={20} className="text-teal-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-[9px] font-black text-teal-600 uppercase tracking-widest leading-none">Speech Calibration</h4>
                <p className="text-[10px] font-bold text-slate-600 mt-0.5">Phonetic Analytics Lab</p>
              </div>
            </div>
            {/* Accuracy Display */}
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{kpis.accuracy}%</span>
                <span className="text-[9px] font-black text-teal-600 uppercase tracking-wide">Accuracy</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] text-slate-500 font-semibold">Fluency: <span className="text-teal-600 font-black">{kpis.fluencyScore}</span></span>
                <span className="text-slate-300">·</span>
                <span className="text-[9px] text-slate-500">{kpis.accuracy >= 90 ? '🏆 Elite' : kpis.accuracy >= 80 ? '⭐ Senior' : '📊 Dev'}</span>
              </div>
            </div>
            {/* Dual metric bars */}
            <div className="space-y-2 mb-4">
              <div>
                <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase mb-0.5">
                  <span>Pronunciation</span><span>{kpis.accuracy}%</span>
                </div>
                <div className="h-1.5 bg-teal-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-700" style={{ width: `${kpis.accuracy}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase mb-0.5">
                  <span>Fluency</span><span>{kpis.fluencyScore}%</span>
                </div>
                <div className="h-1.5 bg-teal-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${kpis.fluencyScore}%` }} />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-teal-500/12 flex items-center justify-between text-[9px] font-extrabold text-teal-700 uppercase tracking-widest">
              <span>Calibration Lab</span>
              <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* ── CARD 3: VIP RAFFLE (PRÓXIMAMENTE) ── */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-rose-500/10 bg-gradient-to-br from-rose-500/2 to-rose-500/5 p-6 backdrop-blur-md shadow-lg shadow-rose-500/1 opacity-80 cursor-default"
          >
            {/* Background glyph */}
            <div className="absolute right-0 top-0 -mr-6 -mt-6 p-10 opacity-[0.02]">
              <Ticket size={120} className="text-rose-500" />
            </div>
            {/* Coming soon badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-0.5 bg-rose-500/15 border border-rose-500/30 text-rose-600 text-[8px] font-black uppercase rounded-full tracking-widest">
                PRÓXIMAMENTE
              </span>
            </div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-400 shadow-sm">
                <Ticket size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-rose-400/80 uppercase tracking-widest leading-none">VIP Raffle</h4>
                <p className="text-xs font-bold text-slate-500 mt-1">Sorteos de Mentorías</p>
              </div>
            </div>
            {/* Body */}
            <div className="mb-3">
              <h5 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-tight">Mentorías & Premios</h5>
              <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                Obtén boletos completando lecciones ejecutivas. Sorteos mensuales de iPads y sesiones 1-a-1.
              </p>
            </div>
            <div className="pt-3 border-t border-rose-500/10 flex items-center justify-between text-[9px] font-extrabold text-rose-400/60 uppercase tracking-widest">
              <span>Sorteos y Privilegios</span>
              <Lock size={11} className="text-rose-400/60" />
            </div>
          </div>
        </motion.div>

        {/* ─── QUICK ACCESS TOOLS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          <Link
            href="/dashboard/pro/meeting-room"
            className="group relative border border-teal-800/15 bg-white/40 p-6 hover:border-teal-700/40 hover:bg-white/60 transition-all overflow-hidden backdrop-blur-sm shadow-sm"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={72} />
            </div>
            <div className="relative z-10">
              <div className="w-11 h-11 bg-teal-600/10 border border-teal-600/20 flex items-center justify-center text-teal-850 mb-5 group-hover:scale-110 transition-transform">
                <Video size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5 uppercase tracking-tight">Boardroom Simulator</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">Ejercicios en tiempo real con una junta directiva de IA.</p>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-800 uppercase tracking-widest">
                Enter Room <ChevronRight size={12} />
              </div>
            </div>
          </Link>

          <div
            onClick={() => setShowReadingStudio(true)}
            className="group relative border border-teal-800/15 bg-white/40 p-6 hover:border-teal-700/40 hover:bg-white/60 transition-all cursor-pointer overflow-hidden backdrop-blur-sm shadow-sm"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <BarChart3 size={72} />
            </div>
            <div className="relative z-10">
              <div className="w-11 h-11 bg-cyan-600/10 border border-cyan-600/20 flex items-center justify-center text-cyan-850 mb-5 group-hover:scale-110 transition-transform">
                <Mic size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5 uppercase tracking-tight">Speech Analytics</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">Análisis fonético avanzado. Evalúa tu fluidez ejecutiva.</p>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-800 uppercase tracking-widest">
                Launch Studio <ChevronRight size={12} />
              </div>
            </div>
          </div>

          <div
            onClick={() => setShowB2BNegotiations(true)}
            className="group relative border border-teal-800/15 bg-white/40 p-6 hover:border-teal-700/40 hover:bg-white/60 transition-all cursor-pointer overflow-hidden backdrop-blur-sm shadow-sm"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageSquare size={72} />
            </div>
            <div className="relative z-10">
              <div className="w-11 h-11 bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-850 mb-5 group-hover:scale-110 transition-transform">
                <Briefcase size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5 uppercase tracking-tight">B2B Negotiations</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">Simulaciones de ventas y alianzas estratégicas globales.</p>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-800 uppercase tracking-widest">
                Start Simulation <ChevronRight size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── CURRICULUM SECTION HEADER ─── */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-teal-800/20">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
            <BookOpen size={18} className="text-teal-800" />
            Titanium Curriculum
          </h2>
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
            {currentCurriculum.reduce((acc, s) => acc + s.lessons.length, 0)} Premium Modules
          </span>
        </div>

        {/* ─── ACCORDION LIST (single column — no layout break) ─── */}
        <div className="flex flex-col gap-3">
          {currentCurriculum.map((section, sectionIndex) => {
            const cfg = LEVEL_CONFIG[section.level] || LEVEL_CONFIG['B1'];
            const isOpen = expandedSection === section.id;
            const completedCount = section.lessons.filter(
              l => proProgress.find(p => p.lesson_id === l.id)?.status === 'completed'
            ).length;
            const progressPct = Math.round((completedCount / section.lessons.length) * 100);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.06 }}
                className={`border border-teal-800/15 bg-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-sm hover:bg-white/50 ${isOpen ? 'shadow-md border-teal-700/40 bg-white/65' : ''}`}
              >
                {/* ACCORDION HEADER */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-white/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Level color stripe */}
                    <div className={`w-1 h-12 bg-gradient-to-b ${cfg.gradient} flex-shrink-0`} />

                    <div className={`w-11 h-11 ${cfg.iconBg} border ${cfg.border} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <section.icon size={20} className={cfg.iconColor} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                          {section.title}
                        </h3>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${cfg.badge} shadow-xs`}>
                          {section.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 font-medium mt-1 truncate max-w-sm">{section.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                        {completedCount}/{section.lessons.length} completadas
                      </span>
                      <div className="w-24 h-1 bg-slate-200 rounded-none">
                        <div
                          className={`h-full bg-gradient-to-r ${cfg.gradient} transition-all duration-500`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-teal-800 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* ACCORDION BODY */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-white/20">
                        {section.lessons.map((lesson, idx) => {
                          const lessonStatus = proProgress.find(p => p.lesson_id === lesson.id)?.status
                            || (lesson.id === 'pro-b1-1' ? 'active' : 'locked');
                          const isLocked = lessonStatus === 'locked';
                          const isCompleted = lessonStatus === 'completed';

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => !isLocked && router.push(`/lesson/${lesson.id}?type=pro`)}
                              disabled={isLocked}
                              className={`flex items-center justify-between px-4 py-3 border transition-all text-left group/lesson
                                ${isLocked
                                  ? 'border-transparent bg-white/5 opacity-60 cursor-not-allowed'
                                  : isCompleted
                                    ? 'border-emerald-600/20 bg-emerald-600/5 cursor-pointer hover:bg-emerald-600/10'
                                    : 'border-transparent hover:border-teal-800/15 hover:bg-white/60 cursor-pointer'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 text-[10px] font-black
                                  ${isCompleted ? 'text-emerald-600' : isLocked ? 'text-slate-400' : 'text-teal-700'}`}>
                                  {isCompleted
                                    ? <Check size={13} />
                                    : isLocked
                                      ? <Lock size={11} />
                                      : <span>{idx + 1}</span>
                                  }
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-tight
                                  ${isLocked ? 'text-slate-400 font-medium' : isCompleted ? 'text-emerald-700' : 'text-slate-800 group-hover/lesson:text-slate-900'}`}>
                                  {lesson.title}
                                </span>
                              </div>
                              <Play
                                size={11}
                                className={`flex-shrink-0 transition-transform group-hover/lesson:translate-x-0.5
                                  ${isLocked ? 'text-slate-300' : 'text-teal-600'}`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </main>

      {showReadingStudio && <ReadingStudio onClose={() => setShowReadingStudio(false)} />}
      {showB2BNegotiations && <B2BNegotiations onClose={() => setShowB2BNegotiations(false)} />}
      {showCommandCenter && (
        <ExecutiveCommandCenter
          onClose={() => setShowCommandCenter(false)}
          kpis={kpis}
          completedLessons={kpis.completedModules}
        />
      )}
      {showSpeechCalibrate && (
        <SpeechCalibrateModal
          onClose={() => setShowSpeechCalibrate(false)}
          initialAccuracy={kpis.accuracy}
          initialFluency={kpis.fluencyScore}
        />
      )}
      {showRaffleModal && (
        <RaffleModal 
          onClose={() => setShowRaffleModal(false)} 
          totalTickets={kpis.totalTickets} 
        />
      )}
    </div>
  );
}