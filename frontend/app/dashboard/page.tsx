'use client';

/**
 * ==============================================================================
 * ONIXLINGO LMS DASHBOARD - STUDENT EDITION (COMPACT PRO B2B)
 * ==============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import Sidebar from '@/components/dashboard/sidebar';
import Cookies from 'js-cookie';
import { ServerAwakeLoader } from '@/components/ui/Server/ServerAwakeLoader';
import { motion, Variants } from 'framer-motion';
import { AdBanner } from '@/components/ads/AdBanner';

import {
  Play, Lock, Check, Home, Trophy, Zap, Flame, Headphones, BookOpen, PenTool,
  Mic, Shield, LayoutGrid, User, Loader2, Briefcase, BookA, Crown, Languages,
  Sparkles, ShoppingBag, ArrowRight, FileText
} from 'lucide-react';

import { CURRICULUM } from '@/data/curriculum';

type LessonStatus = 'locked' | 'active' | 'completed';

interface ThemeConfig {
  primary: string; bg: string; border: string; iconBg: string; accent: string; shadow: string; gradient: string; glow: string;
}

const COLOR_VARIANTS: Record<string, { bg: string, text: string, hoverBorder: string, hoverShadow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', hoverBorder: 'hover:border-emerald-500/30', hoverShadow: 'hover:shadow-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', hoverBorder: 'hover:border-blue-500/30', hoverShadow: 'hover:shadow-blue-500/20' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', hoverBorder: 'hover:border-orange-500/30', hoverShadow: 'hover:shadow-orange-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', hoverBorder: 'hover:border-purple-500/30', hoverShadow: 'hover:shadow-purple-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', hoverBorder: 'hover:border-indigo-500/30', hoverShadow: 'hover:shadow-indigo-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', hoverBorder: 'hover:border-rose-500/30', hoverShadow: 'hover:shadow-rose-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', hoverBorder: 'hover:border-amber-500/30', hoverShadow: 'hover:shadow-amber-500/20' },
};

const getProfessionalTheme = (colorName: string, status: LessonStatus): ThemeConfig => {
  if (status === 'locked') {
    return { primary: 'text-slate-500', bg: 'bg-white/5', border: 'border-white/10', iconBg: 'bg-white/5', accent: 'bg-slate-700', shadow: 'shadow-none', gradient: 'from-white/5 to-white/5', glow: '' };
  }
  const themes: Record<string, ThemeConfig> = {
    emerald: { primary: 'text-emerald-400', bg: 'bg-slate-900', border: 'border-emerald-500/30', iconBg: 'bg-emerald-500/10', accent: 'bg-emerald-500', shadow: 'shadow-emerald-900/50', gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
    blue: { primary: 'text-blue-400', bg: 'bg-slate-900', border: 'border-blue-500/30', iconBg: 'bg-blue-500/10', accent: 'bg-blue-500', shadow: 'shadow-blue-900/50', gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
    indigo: { primary: 'text-indigo-400', bg: 'bg-slate-900', border: 'border-indigo-500/30', iconBg: 'bg-indigo-500/10', accent: 'bg-indigo-500', shadow: 'shadow-indigo-900/50', gradient: 'from-indigo-500 to-violet-600', glow: 'shadow-[0_0_15px_rgba(79,70,229,0.3)]' },
  };
  return themes[colorName] || themes['indigo'];
};

const HeaderStats = ({ xp, streak }: { xp: number, streak: number }) => (
  <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shadow-sm">
    <div className="flex items-center gap-2 px-3 border-r border-white/10">
      <div className="text-amber-400"><Zap size={14} fill="currentColor" /></div>
      <div><p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">XP</p><span className="text-xs font-black text-white leading-none">{xp.toLocaleString()}</span></div>
    </div>
    <div className="flex items-center gap-2 px-3">
      <div className="text-orange-400"><Flame size={14} fill="currentColor" /></div>
      <div><p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Racha</p><span className="text-xs font-black text-white leading-none">{streak}</span></div>
    </div>
  </div>
);

const TimelineNode = ({ id, title, status, stars, index, isLast, color, onClick }: any) => {
  const theme = getProfessionalTheme(color, status);
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS['indigo'];

  return (
    <div className="relative flex group w-full mb-4 lg:mb-5">
      {!isLast && (
        <div className="absolute left-[1.35rem] md:left-[1.85rem] top-[3.5rem] bottom-[-1.5rem] w-0.5 bg-white/10 z-0">
          {status === 'completed' && <div className={`w-full h-full bg-gradient-to-b ${theme.gradient} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></div>}
        </div>
      )}

      <div className="relative z-10 mr-4 flex-shrink-0 pt-1">
        <button
          onClick={() => status !== 'locked' && onClick(id)}
          disabled={status === 'locked'}
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border-0 transition-all duration-300 shadow-sm active:scale-95 relative
            ${status === 'active' ? `bg-gradient-to-br ${theme.gradient} text-white shadow-lg ${theme.glow} border border-white/20 z-20` : ''} 
            ${status === 'completed' ? `bg-slate-900 border border-white/20 ${theme.primary}` : ''} 
            ${status === 'locked' ? 'bg-white/5 border border-white/10 text-slate-600' : ''}
          `}
        >
          {status === 'locked' && <Lock size={16} />}
          {status === 'active' && <Play size={20} fill="currentColor" className="ml-1" />}
          {status === 'completed' && <Check size={20} strokeWidth={3} />}
        </button>
      </div>

      <div onClick={() => status !== 'locked' && onClick(id)} className={`
        flex-1 p-4 md:p-5 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden group/card
        ${status === 'locked'
          ? 'bg-transparent border-white/5 opacity-60 hover:opacity-100'
          : `bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/10`
        }
        ${status === 'active' ? 'ring-1 ring-indigo-500/40 bg-white/10' : ''}
      `}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${status === 'active' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-400'}`}>
                Módulo {index + 1}
              </span>
            </div>
            <h3 className={`text-base md:text-lg font-bold tracking-tight mb-1 ${status === 'locked' ? 'text-slate-500' : 'text-white'}`}>{title}</h3>
            <p className={`text-xs leading-relaxed ${status === 'locked' ? 'text-slate-600' : 'text-slate-400'}`}>{title.includes("Hello") ? "Fundamentos y saludos." : "Vocabulario clave y gramática."}</p>
          </div>

          <div className="flex flex-col items-end justify-between h-full min-w-[60px]">
            {status === 'completed' && (
              <div className="flex gap-0.5">
                {[1, 2, 3].map((s) => (<Trophy key={s} size={14} className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-amber-900/30'} />))}
              </div>
            )}
            {status === 'active' && (
              <div className="mt-2 sm:mt-0 text-slate-400 group-hover/card:text-indigo-400 transition-colors">
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const containerVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants: Variants = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any } };

export default function DashboardPage() {
  const router = useRouter();
  const { mode, setMode, activeLanguage, setLanguage, resetUI } = useUIStore();

  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userStats, setUserStats] = useState({ xp: 0, lessons: 0, streak: 0 });
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [managingPlan, setManagingPlan] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem('currentUser');
    const token = Cookies.get('access_token');
    setCurrentUser(user || 'Estudiante');

    if (token) {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
      const headers = { 'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`, 'Content-Type': 'application/json' };

      Promise.all([
        fetch(`${BASE_URL}/api/v1/progress/map`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${BASE_URL}/api/v1/progress/stats`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${BASE_URL}/api/v1/users/me`, { headers }).catch(() => null)
      ]).then(async ([mapRes, statsRes, userRes]) => {
        if (mapRes?.status === 401) { Cookies.remove('access_token'); router.push('/login'); throw new Error("Sesión expirada"); }
        let mapData = { standard: [] }; let statsData = { total_xp: 0, streak: 0 }; let userData = { is_pro: false, tier: 'free' };
        if (mapRes && mapRes.ok) mapData = await mapRes.json();
        if (statsRes && statsRes.ok) statsData = await statsRes.json();
        if (userRes && userRes.ok) userData = await userRes.json();
        setDashboardData(mapData);
        setUserStats({ xp: statsData.total_xp || 0, lessons: 0, streak: statsData.streak || 0 });
        setIsUserPremium(userData.is_pro || userData.tier === 'titanium');
      }).catch(() => setDashboardData({ standard: [] }));
    } else { router.push('/login'); }
  }, [router]);

  const allLessonsFlat = useMemo(() => CURRICULUM.flatMap(section => section.lessons), []);

  const getLessonState = (lessonId: string): LessonStatus => {
    if (!isMounted || !dashboardData?.standard?.length) return lessonId === CURRICULUM[0]?.lessons[0]?.id ? 'active' : 'locked';
    const node = dashboardData.standard.find((l: any) => l.lesson_id === lessonId);
    if (node) return node.status === 'completed' ? 'completed' : 'active';
    return lessonId === CURRICULUM[0]?.lessons[0]?.id ? 'active' : 'locked';
  };

  const getStars = (lessonId: string) => dashboardData?.standard?.find((l: any) => l.lesson_id === lessonId)?.stars || 0;

  if (!isMounted || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
        <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">Cargando Entorno...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 pb-20 lg:pb-0 selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* NAVBAR COMPACTO */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.3)]"><span className="text-white font-bold text-xs">O</span></div>
          <span className="font-bold text-white text-sm hidden sm:block">OnixLingo</span>
        </div>
        <div className="flex items-center gap-3">
          <HeaderStats xp={userStats.xp} streak={userStats.streak} />
          <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-3">
            <Link href="/dashboard/vocabulary" className="text-xs font-semibold text-slate-400 hover:text-white px-2 transition-colors">Vocabulario</Link>
            <Link href="/dashboard/chess" className="text-xs font-semibold text-slate-400 hover:text-white px-2 transition-colors">Ajedrez</Link>
          </div>
          <button onClick={() => { setMode('professional'); router.push('/dashboard/pro'); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider ml-2 border border-indigo-500/50">
            Modo Pro
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 pt-6 px-4 sm:px-6">

        {/* MAIN COLUMN */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Hola, {currentUser}</h1>
            <p className="text-xs text-slate-400 mb-4">Selecciona tu idioma objetivo para la sesión de hoy.</p>
            <div className="inline-flex bg-white/5 p-1 rounded-lg border border-white/10">
              {(['en', 'fr', 'zh'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as 'en' | 'fr' | 'zh')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeLanguage === lang ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  {lang === 'en' ? 'Inglés' : lang === 'fr' ? 'Francés' : 'Chino'}
                </button>
              ))}
            </div>
          </div>

          {!isUserPremium && <div className="mb-6"><AdBanner variant="horizontal" /></div>}

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            {activeLanguage === 'en' && CURRICULUM.map((section, sIdx) => (
              <div key={section.id} className="relative">
                <div className="flex items-center gap-3 mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><LayoutGrid size={16} /></div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">{section.title}</h2>
                </div>
                <div>
                  {section.lessons.map((lesson, lIdx) => (
                    <motion.div variants={itemVariants} key={lesson.id}>
                      <TimelineNode id={lesson.id} title={lesson.title} status={getLessonState(lesson.id)} stars={getStars(lesson.id)} index={allLessonsFlat.findIndex(l => l.id === lesson.id)} isLast={lIdx === section.lessons.length - 1} color={section.color} onClick={(id: string) => router.push(`/lesson/${id}?type=standard`)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          <div className="mt-12 mb-8 border-t border-white/10 pt-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Shield size={18} className="text-indigo-400" /> Certificaciones</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/lesson/toeic_listening" className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <Headphones size={16} className="text-indigo-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Listening</h4>
              </Link>
              <Link href="/lesson/toeic_reading" className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <BookOpen size={16} className="text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Reading</h4>
              </Link>
            </div>
          </div>
        </div>

        {/* SIDEBAR DERECHO (COMPACTO) */}
        <div className="hidden lg:block w-[18rem] flex-shrink-0">
          <div className="sticky top-20">
            <Sidebar userStats={userStats} />
          </div>
        </div>

      </div>
    </div>
  );
}