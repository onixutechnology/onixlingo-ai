'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUIStore } from '@/store/uiStore';
import { motion } from 'framer-motion';

import {
  Briefcase, Trophy, BarChart3, Crown, Mic, Activity,
  Gem, Video, MessageSquare, BookOpen, Sparkles
} from 'lucide-react';

import { UpgradeModal } from '@/components/pro/UpgradeModal';
import { ReadingStudio } from '@/components/pro/ReadingStudio';
import { B2BNegotiations } from '@/components/pro/B2BNegotiations';
import { ExecutiveCommandCenter } from '@/components/pro/ExecutiveCommandCenter';
import { SpeechCalibrateModal } from '@/components/pro/SpeechCalibrateModal';
import { RaffleModal } from '@/components/pro/RaffleModal';
import apiClient from '@/lib/apiClient';
import { PRO_CURRICULUM, PRO_CURRICULUM_FR } from '@/data/curriculum_pro_fr';
import PracticeReminderWidget from '@/components/dashboard/PracticeReminderWidget';
import { AdBanner } from '@/components/ads/AdBanner';

import { ProHeaderStats } from './components/ProHeaderStats';
import { ProStatsWidgets } from './components/ProStatsWidgets';
import { ProLevelAccordion } from './components/ProLevelAccordion';

const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1;
  if (xp < 500) return 2;
  if (xp < 1000) return 3;
  return 4 + Math.floor((xp - 1000) / 2000);
};

const getLevelProgress = (xp: number): number => {
  if (xp < 100) return Math.min(100, Math.round((xp / 100) * 100));
  if (xp < 500) return Math.min(100, Math.round(((xp - 100) / 400) * 100));
  if (xp < 1000) return Math.min(100, Math.round(((xp - 500) / 500) * 100));
  const excess = xp - 1000;
  return Math.min(100, Math.round(((excess % 2000) / 2000) * 100));
};

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
  language?: string;
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
    iconColor: 'text-[#D4AF37]',
  },
  C1: {
    gradient: 'from-indigo-600 to-violet-700',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'Advanced',
    glow: 'shadow-indigo-500/5',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-[#D4AF37]',
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
    badge: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
    badgeText: 'Corporativo',
    glow: 'shadow-amber-500/5',
    border: 'border-[#D4AF37]/30',
    iconBg: 'bg-amber-100',
    iconColor: 'text-[#D4AF37]',
  },
  Mastery: {
    gradient: 'from-rose-500 to-pink-700',
    badge: 'bg-[#D4AF37]/10 text-rose-700 border-[#D4AF37]/30',
    badgeText: 'Mastery',
    glow: 'shadow-rose-500/5',
    border: 'border-[#D4AF37]/30',
    iconBg: 'bg-rose-100',
    iconColor: 'text-[#D4AF37]',
  },
};

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
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
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
    const fetchCoreData = async () => {
      try {
        const results = await Promise.allSettled([
          apiClient.get('/users/me'),
          apiClient.get('/progress/map'),
          apiClient.get('/progress/stats')
        ]);

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
          return;
        }

        const [userRes, mapRes, statsRes] = results.map(
          r => (r as PromiseFulfilledResult<any>).value
        );

        const tier = (userRes.data.membership?.tier || userRes.data.tier || 'free').toLowerCase();
        const isExecutive = tier === 'executive' || tier === 'titanium';
        setIsUserPremium(isExecutive);
        setProProgress(mapRes.data.pro || []);

        const statsData = statsRes.data;
        const totalXP = statsData.total_xp || 0;
        const currentLevel = statsData.level || calculateLevel(totalXP);
        setKpis({
          totalXP,
          currentLevel,
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
  }, [activeLanguage]);

  const getProLeaderboard = () => {
    const list = [...leaderboard];
    
    if (!list.some(item => item.isMe)) {
      list.push({
        rank: '-',
        alias: Cookies.get('username') || 'Tú',
        xp: kpis.totalXP,
        isMe: true
      });
    }

    return list
      .sort((a, b) => b.xp - a.xp)
      .map((item, idx) => ({
        rank: item.rank === '-' ? '-' : idx + 1,
        name: item.alias,
        count: `${(item.xp || 0).toLocaleString()} XP`,
        isMe: item.isMe
      }));
  };

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-teal-600/10 border-t-teal-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown size={20} className="text-[#D4AF37]" />
          </div>
        </div>
        <span className="mt-6 uppercase tracking-[0.3em] text-[10px] font-bold text-teal-800 animate-pulse">
          Initializing Executive Interface...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-teal-400/30 selection:text-teal-900 pb-24 bg-white">
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
            <div className="w-7 h-7 bg-gradient-to-br from-teal-300 to-cyan-500 flex items-center justify-center shadow-none shadow-teal-400/30">
              <Crown size={14} className="text-slate-900" />
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
          <div className="hidden md:flex items-center gap-5 text-[11px] font-black text-white/80 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-purple-300">
              <Crown size={13} className="fill-purple-300/20 text-purple-300" /> LEVEL {kpis.currentLevel}
            </span>
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

      <main className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 px-4 py-12 relative z-10">

        {/* ESPACIO PUBLICITARIO IZQUIERDO */}
        <div className="hidden xl:block w-[160px] shrink-0">
          <div className="sticky top-20 flex justify-center w-full">
            <AdBanner slot="1234567890" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
        </div>

        {/* CONTENEDOR CENTRAL WIDER */}
        <div className="flex-1 min-w-0 max-w-7xl mx-auto w-full flex flex-col gap-6">

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
                ? '3 000 leçons professionnelles de haut niveau pour les dirigeants. Maîtrisez la communication en entreprise.'
                : '3,000 lecciones profesionales de élite diseñadas para la alta dirección. Dominando la comunicación en contextos corporativos reales.'}
            </p>
          </motion.header>

          {/* ─── PREMIUM KPI METRIC CARDS ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProHeaderStats 
              kpis={kpis} 
              getLevelProgress={getLevelProgress} 
              setShowCommandCenter={setShowCommandCenter}
              setShowSpeechCalibrate={setShowSpeechCalibrate}
              setShowRaffleModal={setShowRaffleModal}
            />
          </motion.div>

          {/* ─── QUICK ACCESS TOOLS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
            <Link
              href="/dashboard/pro/meeting-room"
              className="group relative border border-teal-800/15 bg-white/40 p-6 hover:border-teal-700/40 hover:bg-white/60 transition-all overflow-hidden backdrop-blur-sm shadow-none"
            >
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase size={72} />
              </div>
              <div className="relative z-10">
                <div className="w-11 h-11 bg-[#D4AF37]/20/10 border border-teal-600/20 flex items-center justify-center text-teal-850 mb-5 group-hover:scale-110 transition-transform">
                  <Video size={22} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5 uppercase tracking-tight">Corporativo Simulator</h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">Ejercicios en tiempo real con una junta directiva de Sistema.</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-800 uppercase tracking-widest">
                  Enter Room &rarr;
                </div>
              </div>
            </Link>

            <div
              onClick={() => setShowReadingStudio(true)}
              className="group relative border border-teal-800/15 bg-white/40 p-6 hover:border-teal-700/40 hover:bg-white/60 transition-all cursor-pointer overflow-hidden backdrop-blur-sm shadow-none"
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
                  Launch Studio &rarr;
                </div>
              </div>
            </div>

            <div
              onClick={() => setShowB2BNegotiations(true)}
              className="group relative border border-teal-800/15 bg-white/40 p-6 hover:border-teal-700/40 hover:bg-white/60 transition-all cursor-pointer overflow-hidden backdrop-blur-sm shadow-none"
            >
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquare size={72} />
              </div>
              <div className="relative z-10">
                <div className="w-11 h-11 bg-[#D4AF37]/20/10 border border-teal-500/20 flex items-center justify-center text-teal-850 mb-5 group-hover:scale-110 transition-transform">
                  <Briefcase size={22} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5 uppercase tracking-tight">B2B Negotiations</h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">Simulaciones de ventas y alianzas estratégicas globales.</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-800 uppercase tracking-widest">
                  Start Simulation &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DE EXCELENCIA CORPORATIVA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <PracticeReminderWidget themeColor="teal" />
            <ProStatsWidgets leaderboard={getProLeaderboard()} kpis={kpis} />
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

          {/* ─── ACCORDION LIST ─── */}
          <ProLevelAccordion 
            currentCurriculum={currentCurriculum}
            levelConfig={LEVEL_CONFIG}
            proProgress={proProgress}
            activeLanguage={activeLanguage}
            expandedSection={expandedSection}
            toggleSection={toggleSection}
          />

        </div> {/* END CONTENEDOR CENTRAL */}

        {/* ESPACIO PUBLICITARIO DERECHO */}
        <div className="hidden xl:block w-[160px] shrink-0">
          <div className="sticky top-20 flex justify-center w-full">
             <AdBanner slot="0987654321" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
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