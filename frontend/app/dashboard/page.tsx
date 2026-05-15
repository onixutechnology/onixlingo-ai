'use client';

/**
 * ==============================================================================
 * ONIXLINGO LMS DASHBOARD - CORPORATE TEAL (ULTRA COMPACT)
 * ==============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import Sidebar from '@/components/dashboard/sidebar';
import Cookies from 'js-cookie';
import apiClient from '@/lib/apiClient';
import { ServerAwakeLoader } from '@/components/ui/Server/ServerAwakeLoader';

import { motion, Variants } from 'framer-motion';
import { AdBanner } from '@/components/ads/AdBanner';

import {
  Play, Lock, Check, Trophy, Zap, Flame, Headphones, BookOpen, PenTool,
  Mic, Shield, LayoutGrid, Loader2, Briefcase, ArrowRight, User
} from 'lucide-react';

import { CURRICULUM } from '@/data/curriculum';
import { CURRICULUM_FR } from '@/data/curriculum_fr';
import { CURRICULUM_ZH } from '@/data/curriculum_zh';

type LessonStatus = 'locked' | 'active' | 'completed';

const COLOR_VARIANTS: Record<string, { bg: string, text: string, hoverBorder: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBorder: 'hover:border-blue-300' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', hoverBorder: 'hover:border-orange-300' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBorder: 'hover:border-purple-300' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', hoverBorder: 'hover:border-teal-300' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', hoverBorder: 'hover:border-rose-300' },
};

const LANGUAGE_COLORS: Record<string, { primary: string, secondary: string, accent: string, selection: string, bg: string }> = {
  en: { primary: 'blue-600', secondary: 'blue-50', accent: 'blue-700', selection: 'bg-blue-100', bg: 'text-blue-900' },
  fr: { primary: 'cyan-500', secondary: 'cyan-50', accent: 'cyan-600', selection: 'bg-cyan-100', bg: 'text-cyan-900' },
  zh: { primary: 'indigo-800', secondary: 'indigo-50', accent: 'indigo-900', selection: 'bg-indigo-100', bg: 'text-indigo-900' },
};

const HeaderStats = ({ xp, streak }: { xp: number, streak: number }) => (
  <div className="hidden md:flex items-center gap-2 bg-white px-2 py-1 rounded-none border border-slate-200 shadow-none">
    <div className="flex items-center gap-2 px-3 border-r border-slate-100">
      <div className="text-amber-500"><Zap size={14} fill="currentColor" /></div>
      <div><p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5">XP</p><span className="text-xs font-black text-slate-800 leading-none">{xp.toLocaleString()}</span></div>
    </div>
    <div className="flex items-center gap-2 px-3">
      <div className="text-orange-500"><Flame size={14} fill="currentColor" /></div>
      <div><p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5">Racha</p><span className="text-xs font-black text-slate-800 leading-none">{streak}</span></div>
    </div>
  </div>
);

const TimelineNode = ({ id, title, status, stars, index, isLast, color, onClick, theme }: any) => {
  const isLocked = status === 'locked';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <div className="relative flex group w-full mb-3 lg:mb-4">
      {/* Conector */}
      {!isLast && (
        <div className="absolute left-[1.1rem] top-[2.5rem] bottom-[-1.5rem] w-px bg-slate-200 z-0">
          {isCompleted && <div className={`w-full h-full bg-${theme.primary}`}></div>}
        </div>
      )}

      {/* Nodo */}
      <div className="relative z-10 mr-3 flex-shrink-0 pt-1">
        <button
          onClick={() => !isLocked && onClick(id)}
          disabled={isLocked}
          className={`
            w-9 h-9 rounded-none flex items-center justify-center border transition-all duration-200 shadow-none relative
            ${isActive ? `bg-${theme.primary} border-${theme.accent} text-white shadow-lg scale-105 z-20` : ''} 
            ${isCompleted ? `bg-white border-${theme.primary} text-${theme.primary}` : ''} 
            ${isLocked ? 'bg-slate-50 border-slate-200 text-slate-400' : ''}
          `}
        >
          {isLocked && <Lock size={14} />}
          {isActive && <Play size={16} fill="currentColor" className="ml-0.5" />}
          {isCompleted && <Check size={16} strokeWidth={3} />}
        </button>
      </div>

      {/* Tarjeta */}
      <div onClick={() => !isLocked && onClick(id)} className={`
        flex-1 p-4 rounded-none border transition-all duration-200 cursor-pointer bg-white relative overflow-hidden group/card
        ${isLocked ? 'opacity-60 border-slate-100' : `border-slate-200 hover:border-${theme.primary} hover:shadow-sm`}
        ${isActive ? `ring-2 ring-${theme.primary}/10 border-${theme.primary} shadow-md` : ''}
      `}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? `bg-${theme.primary} text-white` : 'bg-slate-100 text-slate-400'}`}>
                Módulo {index + 1}
              </span>
            </div>
            <h3 className={`text-xs font-black tracking-tight leading-tight uppercase ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{title}</h3>
          </div>

          <div className="flex flex-col items-end justify-between h-full min-w-[50px]">
            {isCompleted && (
              <div className="flex gap-0.5 mt-1">
                {[1, 2, 3].map((s) => (<Trophy key={s} size={12} className={s <= stars ? `text-${theme.primary} fill-${theme.primary}` : 'text-slate-100'} />))}
              </div>
            )}
            {isActive && (
              <div className={`text-${theme.primary} transition-colors mt-1`}>
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
const itemVariants: Variants = { hidden: { opacity: 0, x: -5 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any } };

export default function DashboardPage() {
  const router = useRouter();
  const { setMode, activeLanguage, setLanguage } = useUIStore();

  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userStats, setUserStats] = useState({ xp: 0, lessons: 0, streak: 0 });
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);

  const getProgressPercentage = () => globalProgress;

  useEffect(() => {
    setIsMounted(true);
    const token = Cookies.get('access_token');
    const storedUsername = Cookies.get('username') || 'Usuario';
    setCurrentUser(storedUsername);

    if (token) {
      // Usamos el apiClient centralizado para todas las peticiones
      const fetchData = async () => {
        try {
          const [mapRes, statsRes, userRes] = await Promise.all([
            apiClient.get('/progress/map'),
            apiClient.get('/progress/stats'),
            apiClient.get('/users/me')
          ]);

          setDashboardData(mapRes.data);
          setUserStats({
            xp: statsRes.data.total_xp || 0,
            lessons: statsRes.data.completed_modules || 0,
            streak: statsRes.data.streak_days || 0
          });
          setGlobalProgress(statsRes.data.global_progress || 0);
          setIsUserPremium(userRes.data.is_pro || userRes.data.tier?.toLowerCase() === 'titanium');
          
          // Actualizamos el nombre si el backend tiene uno más preciso
          if (userRes.data.username) {
            setCurrentUser(userRes.data.username);
            Cookies.set('username', userRes.data.username);
          }
        } catch (error: any) {
          console.error("Error fetching dashboard data:", error);
          // El interceptor global de apiClient ya maneja el 401
          if (!dashboardData) setDashboardData({ standard: [] });
        }
      };

      fetchData();
    } else {
      router.push('/login');
    }
  }, [router]);


  const currentCurriculum = useMemo(() => {
    if (activeLanguage === 'fr') return CURRICULUM_FR;
    if (activeLanguage === 'zh') return CURRICULUM_ZH;
    return CURRICULUM;
  }, [activeLanguage]);

  const allLessonsFlat = useMemo(() => currentCurriculum.flatMap(section => section.lessons), [currentCurriculum]);

  const getLessonState = (lessonId: string): LessonStatus => {
    if (!isMounted || !dashboardData?.standard?.length) return lessonId === currentCurriculum[0]?.lessons[0]?.id ? 'active' : 'locked';
    const node = dashboardData.standard.find((l: any) => l.lesson_id === lessonId);
    if (node) return node.status === 'completed' ? 'completed' : 'active';
    return lessonId === currentCurriculum[0]?.lessons[0]?.id ? 'active' : 'locked';
  };

  const getStars = (lessonId: string) => dashboardData?.standard?.find((l: any) => l.lesson_id === lessonId)?.stars || 0;

  const theme = useMemo(() => LANGUAGE_COLORS[activeLanguage] || LANGUAGE_COLORS.en, [activeLanguage]);

  if (!isMounted || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className={`animate-spin text-${theme.primary} mb-3`} size={24} />
        <p className="text-slate-500 font-semibold text-[10px] tracking-widest uppercase">Cargando Entorno...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 lg:pb-0 ${theme.selection} selection:${theme.bg}`}>

      {/* NAVBAR CORPORATIVO CUADRADO */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 h-12 flex items-center justify-between shadow-none">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 bg-${theme.primary} flex items-center justify-center`}><span className="text-white font-black text-[9px]">O</span></div>
          <span className="font-black text-slate-900 text-[10px] tracking-[0.2em] uppercase hidden sm:block">OnixLingo Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <HeaderStats xp={userStats.xp} streak={userStats.streak} />
          
          <Link href="/dashboard/leaderboard" className="p-2 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-slate-600">
            <Trophy size={18} />
          </Link>

          <Link href="/dashboard/profile" className="p-2 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-slate-600">
            <User size={18} />
          </Link>

          <div className="hidden lg:flex items-center gap-6 border-l border-slate-100 pl-6 h-6">
            <Link href="/dashboard/vocabulary" className={`text-[9px] font-black text-slate-400 hover:text-${theme.primary} transition-colors uppercase tracking-widest`}>Vocabulario</Link>
            <Link href="/dashboard/chess" className={`text-[9px] font-black text-slate-400 hover:text-${theme.primary} transition-colors uppercase tracking-widest`}>Ajedrez</Link>
          </div>
          <button onClick={() => { setMode('professional'); router.push('/dashboard/pro'); }} className={`bg-slate-900 hover:bg-${theme.primary} text-white px-4 py-1.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] ml-2 transition-all active:scale-95`}>
            Modo Executive
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 pt-6 px-6">

        {/* COLUMNA PRINCIPAL */}
        <div className="flex-1 min-w-0">
          
          <div className="mb-6 bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 font-serif italic">Bienvenido, {currentUser}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                <span className="text-amber-600">Executive Tier</span> • {activeLanguage === 'en' ? 'Inglés' : activeLanguage === 'fr' ? 'Francés' : 'Chino'} Corporativo
              </p>
            </div>
            <div className="inline-flex bg-slate-50 p-1 border border-slate-200">
              {(['en', 'fr', 'zh'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as 'en' | 'fr' | 'zh')}
                  className={`px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest transition-all ${activeLanguage === lang ? `bg-${LANGUAGE_COLORS[lang].primary} text-white` : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {lang === 'en' ? 'Inglés' : lang === 'fr' ? 'Francés' : 'Chino'}
                </button>
              ))}
            </div>
          </div>

          {/* CURRICULUM RENDER */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
            {currentCurriculum.map((section, sIdx) => (
              <div key={section.id} className="bg-white border border-slate-200 p-6 rounded-none shadow-sm relative">
                <div className="h-1 bg-slate-100 rounded-none overflow-hidden mb-2">
                  <div className={`h-full bg-${theme.primary}`} style={{ width: `${getProgressPercentage()}%` }}></div>
                </div>
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400 mb-6">
                  <span>Progreso Global</span>
                  <span className={`text-${theme.primary}`}>{getProgressPercentage()}%</span>
                </div>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className={`p-2 bg-slate-100 text-${theme.primary}`}><LayoutGrid size={16} /></div>
                  <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] font-serif italic">{section.title}</h2>
                </div>
                <div className="pl-1">
                  {section.lessons.map((lesson, lIdx) => (
                    <motion.div variants={itemVariants} key={lesson.id}>
                      <TimelineNode 
                        id={lesson.id} 
                        title={lesson.title} 
                        status={getLessonState(lesson.id)} 
                        stars={getStars(lesson.id)} 
                        index={allLessonsFlat.findIndex(l => l.id === lesson.id)} 
                        isLast={lIdx === section.lessons.length - 1} 
                        onClick={(id: string) => router.push(`/lesson/${id}?type=standard`)} 
                        theme={theme}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* EXÁMENES COMPACTOS */}
          <div className="mt-8 mb-12">
            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
              <Shield size={14} className={`text-${theme.primary}`} /> Simuladores Estratégicos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/lesson/toeic_listening" className={`bg-white border border-slate-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}>
                <div className={`bg-slate-100 p-3 text-slate-400 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Headphones size={18} /></div>
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Comprensión Auditiva (Auditoría)</h4>
              </Link>
              <Link href="/lesson/toeic_reading" className={`bg-white border border-slate-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}>
                <div className={`bg-slate-100 p-3 text-slate-400 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><BookOpen size={18} /></div>
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Análisis Lector (Reporting)</h4>
              </Link>
            </div>
          </div>
        </div>

        {/* SIDEBAR DERECHO */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar userStats={userStats} />
        </div>

      </div>
    </div>

  );
}