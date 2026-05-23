'use client';

/**
 * ==============================================================================
 * ONIXLINGO LMS DASHBOARD - CORPORATE TEAL (ULTRA COMPACT - PREMIUM ACCORDION & ZIGZAG)
 * ==============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import Sidebar from '@/components/dashboard/sidebar';
import Cookies from 'js-cookie';
import apiClient from '@/lib/apiClient';
import { UpgradeModal } from '@/components/pro/UpgradeModal';
import { ServerAwakeLoader } from '@/components/ui/Server/ServerAwakeLoader';

import { motion, Variants } from 'framer-motion';
import { AdBanner } from '@/components/ads/AdBanner';

import {
  Play, Lock, Check, Trophy, Award, Zap, Flame, Headphones, BookOpen, PenTool,
  Mic, Shield, LayoutGrid, Loader2, Briefcase, ArrowRight, User, ChevronDown, ShieldCheck
} from 'lucide-react';

import { CURRICULUM } from '@/data/curriculum';
import { CURRICULUM_FR } from '@/data/curriculum_fr';
import { CURRICULUM_ZH } from '@/data/curriculum_zh';

type LessonStatus = 'locked' | 'active' | 'completed';

const LANGUAGE_COLORS: Record<string, { primary: string, secondary: string, accent: string, selection: string, bg: string }> = {
  en: { primary: 'blue-600', secondary: 'blue-50', accent: 'blue-700', selection: 'bg-blue-100', bg: 'text-blue-900' },
  fr: { primary: 'cyan-500', secondary: 'cyan-50', accent: 'cyan-600', selection: 'bg-cyan-100', bg: 'text-cyan-900' },
  zh: { primary: 'indigo-800', secondary: 'indigo-50', accent: 'indigo-900', selection: 'bg-indigo-100', bg: 'text-indigo-900' },
};

const HeaderStats = ({ xp, streak }: { xp: number, streak: number }) => {
  const { energy, userTier, checkAndResetDailyLimits } = useUIStore();
  
  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

  const getEnergyColor = (pct: number) => {
    if (pct > 50) return 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (pct > 20) return 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]';
  };

  return (
    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-none border border-slate-200 shadow-none">
      <div className="hidden md:flex items-center gap-2 px-3 border-r border-slate-100">
        <div className="text-amber-500"><Zap size={14} fill="currentColor" /></div>
        <div>
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5">XP</p>
          <span className="text-xs font-black text-slate-800 leading-none">{xp.toLocaleString()}</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 px-3 border-r border-slate-100">
        <div className="text-orange-500"><Flame size={14} fill="currentColor" /></div>
        <div>
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5">Racha</p>
          <span className="text-xs font-black text-slate-800 leading-none">{streak}</span>
        </div>
      </div>
      
      {/* ⚡ ENERGÍA INDICATOR (Batería Premium) */}
      <div className="flex items-center gap-2 px-1 md:px-3">
        {userTier === 'free' ? (
          <div className="flex items-center gap-2">
            {/* Icono de energía con brillo */}
            <div className="text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)] animate-pulse shrink-0">
              <Zap size={13} fill="currentColor" />
            </div>
            
            {/* Cuerpo de la Batería */}
            <div className="flex items-center">
              <div className="relative w-14 md:w-20 h-5 bg-slate-950 rounded-[4px] border border-slate-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                <div 
                  className={`h-full rounded-[2px] ${getEnergyColor(energy)} transition-all duration-500`}
                  style={{ width: `${energy}%` }}
                />
                
                {/* Porcentaje de texto legible */}
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white font-mono leading-none tracking-wider drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)]">
                  {energy}%
                </span>
              </div>
              
              {/* Polo Positivo */}
              <div className="w-[3px] h-2.5 bg-slate-700 rounded-r-[2px] -ml-[1px] shadow-sm shrink-0" />
            </div>

            <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none hidden md:block">
              Energía
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck size={12} className="fill-emerald-50 text-emerald-600 shrink-0" />
            <div className="text-left hidden md:block">
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5">Energía</p>
              <span className="text-[9px] font-black uppercase tracking-wider">Ilimitada</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const containerVariants: Variants = { 
  hidden: { opacity: 0 }, 
  show: { opacity: 1, transition: { staggerChildren: 0.03 } } 
};

const itemVariants: Variants = { 
  hidden: { opacity: 0, y: 10 }, 
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } as any } 
};

export default function DashboardPage() {
  const router = useRouter();
  const { setMode, activeLanguage, setLanguage, userTier, setUserTier } = useUIStore();

  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userStats, setUserStats] = useState({ xp: 0, lessons: 0, streak: 0, premiumCount: 0 });
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [timeMode, setTimeMode] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Estado local para acordeón de niveles (Lección A expandida por defecto)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const getProgressPercentage = () => globalProgress;

  const currentCurriculum = useMemo(() => {
    if (activeLanguage === 'fr') return CURRICULUM_FR;
    if (activeLanguage === 'zh') return CURRICULUM_ZH;
    return CURRICULUM;
  }, [activeLanguage]);

  // Los niveles inician completamente cerrados por defecto para optimizar el UX y evitar scroll inicial
  useEffect(() => {
    setExpandedSections({});
  }, [activeLanguage]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  useEffect(() => {
    setIsMounted(true);
    const token = Cookies.get('access_token');
    const storedUsername = Cookies.get('username') || 'Usuario';
    setCurrentUser(storedUsername);

    if (token) {
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
            streak: statsRes.data.streak_days || 0,
            premiumCount: statsRes.data.premium_users_count ?? 0
          });
          setGlobalProgress(statsRes.data.global_progress || 0);
          
          let tierVal = (userRes.data.membership?.tier || userRes.data.tier || 'free').toLowerCase();
          if (tierVal === 'titanium') {
            tierVal = 'executive';
          }
          setUserTier(tierVal as 'free' | 'pro' | 'executive');
          setIsUserPremium(tierVal === 'pro' || tierVal === 'executive');
          
          if (userRes.data.username) {
            setCurrentUser(userRes.data.username);
            Cookies.set('username', userRes.data.username);
          }
        } catch (error: any) {
          console.error("Error fetching dashboard data:", error);
          if (!dashboardData) setDashboardData({ standard: [] });
        }
      };

      fetchData();
    } else {
      router.push('/login');
    }
  }, [router, activeLanguage]);

  const allLessonsFlat = useMemo(() => currentCurriculum.flatMap(section => section.lessons), [currentCurriculum]);

  const getLessonState = (lessonId: string): LessonStatus => {
    const firstLessonId = currentCurriculum?.[0]?.lessons?.[0]?.id;
    
    if (!dashboardData?.standard || dashboardData.standard.length === 0) {
      return lessonId === firstLessonId ? 'active' : 'locked';
    }

    const node = dashboardData.standard.find((l: any) => l.lesson_id === lessonId);
    
    if (node) {
      return node.status === 'completed' ? 'completed' : 'active';
    }

    return lessonId === firstLessonId ? 'active' : 'locked';
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

          <div className="hidden sm:flex items-center gap-6 border-l border-slate-100 pl-6 h-6">
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

          {/* MENÚ BIENVENIDA - SIEMPRE FREE TIER / INGLÉS GENERAL EN RUTA STANDARDS */}
          <div className="mb-6 bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 font-serif italic">Bienvenido, {currentUser}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                <span className={`font-black uppercase tracking-wider ${
                  userTier === 'executive' 
                    ? 'text-amber-600' 
                    : userTier === 'pro' 
                      ? 'text-teal-600' 
                      : 'text-slate-500'
                }`}>
                  {userTier === 'executive' ? 'Executive Tier' : userTier === 'pro' ? 'Pro Tier' : 'Free Tier'}
                </span> • {activeLanguage === 'en' ? 'Inglés' : activeLanguage === 'fr' ? 'Francés' : 'Chino'} General
              </p>
            </div>
            <div className="inline-flex bg-slate-50 p-1 border border-slate-200">
              {(['en', 'fr', 'zh'] as const).map(lang => {
                const colors = {
                  en: activeLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600',
                  fr: activeLanguage === 'fr' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-600',
                  zh: activeLanguage === 'zh' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600',
                };
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as 'en' | 'fr' | 'zh')}
                    className={`px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest transition-all ${colors[lang]}`}
                  >
                    {lang === 'en' ? 'Inglés' : lang === 'fr' ? 'Francés' : 'Chino'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 1: PROGRESO GLOBAL & SORTEOS METAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* PROGRESO DEL CURSO */}
            <div className="bg-white border border-slate-200 p-5 rounded-none shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5"><Trophy size={12} className={`text-${theme.primary}`} /> Progreso General del Curso</span>
                  <span className={`text-${theme.primary} font-black text-xs`}>{getProgressPercentage()}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-none overflow-hidden border border-slate-200 mb-4">
                  <motion.div 
                    className={`h-full bg-${theme.primary}`} 
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-none">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cálculo de XP y Racha</p>
                <p className="text-[9px] text-slate-500 leading-snug">
                  Tu XP es la suma de tus mejores puntajes por lección. Tu racha se activa al completar al menos una lección diaria consecutiva. ¡Sigue aprendiendo!
                </p>
              </div>
            </div>

            {/* SORTEOS CORPORATIVOS */}
            <div className="bg-white border border-slate-200 p-5 rounded-none shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500 animate-pulse" /> Sorteos por Suscriptores Premium</span>
                  <span className="text-amber-600 font-black text-xs">{(userStats.premiumCount || 0).toLocaleString()} / 1000 Premium</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-none overflow-hidden border border-slate-200 mb-3 relative">
                  <motion.div 
                    className="h-full bg-amber-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((userStats.premiumCount || 0) / 1000) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* LISTA DE PREMIOS EN MINIATURAS RESPONSIVAS */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-2.5">
                {[
                  { limit: 100, text: '100', prize: 'Gift Card Amazon $50', icon: 'Gift' },
                  { limit: 300, text: '300', prize: 'Certificados Gratis', icon: 'Award' },
                  { limit: 500, text: '500', prize: 'Nintendo Switch Lite', icon: 'Gamepad2' },
                  { limit: 700, text: '700', prize: 'Apple iPad Pro 11"', icon: 'Tv' },
                  { limit: 900, text: '900', prize: 'Boleto Avión Nacional', icon: 'Plane' },
                  { limit: 1000, text: '1k', prize: 'MacBook Air M3', icon: 'Laptop' }
                ].map((item, idx) => {
                  const premiumCount = userStats.premiumCount || 0;
                  const limits = [100, 300, 500, 700, 900, 1000];
                  const unlocked = premiumCount >= item.limit;
                  const active = premiumCount < item.limit && (idx === 0 || premiumCount >= limits[idx - 1]);

                  return (
                    <div 
                      key={idx}
                      className={`border p-2 text-center rounded-none relative transition-all duration-200 select-none group/item hover:scale-105
                        ${unlocked 
                          ? 'border-emerald-200 bg-emerald-50/30 text-emerald-700' 
                          : active 
                            ? 'border-amber-200 bg-amber-50/20 text-amber-600 animate-pulse' 
                            : 'border-slate-100 bg-slate-50/50 text-slate-300'
                        }
                      `}
                    >
                      <div className="text-[9px] font-black leading-none mb-1">{item.text}</div>
                      <div className="flex justify-center text-[12px] mb-1">
                        {item.icon === 'Gift' && <Zap size={10} className={unlocked ? "text-emerald-600" : "text-slate-300"} />}
                        {item.icon === 'Award' && <Award size={10} className={unlocked ? "text-emerald-600" : "text-slate-300"} />}
                        {item.icon === 'Gamepad2' && <Zap size={10} className={active ? "text-amber-500" : "text-slate-300"} />}
                        {item.icon === 'Tv' && <LayoutGrid size={10} className="text-slate-300" />}
                        {item.icon === 'Plane' && <Award size={10} className="text-slate-300" />}
                        {item.icon === 'Laptop' && <Trophy size={10} className="text-slate-300" />}
                      </div>
                      <div className="absolute inset-0 bg-slate-950/95 text-white p-1 text-[7px] font-black uppercase flex flex-col justify-center items-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 rounded-none z-30">
                        <span className="text-center">{item.prize}</span>
                        <span className="text-[5px] text-amber-400 mt-0.5 uppercase tracking-widest font-black">
                          {unlocked ? '¡Sorteado!' : active ? 'Siguiente' : 'Bloqueado'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-none flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Estatus de Sorteo</span>
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none">
                  {(() => {
                    const premiumCount = userStats.premiumCount || 0;
                    const limits = [100, 300, 500, 700, 900, 1000];
                    const nextLimit = limits.find(lim => premiumCount < lim) || 1000;
                    return premiumCount >= 1000 
                      ? '¡Todas las metas alcanzadas! 🏆' 
                      : `Próxima meta: ${nextLimit} (Faltan ${nextLimit - premiumCount})`;
                  })()}
                </span>
              </div>
            </div>
            
          </div>

          {/* CURRICULUM RENDER CON ACORDEÓN PLEGABLE Y ZIGZAG RESPONSIVO */}
          <motion.div 
            key={activeLanguage}
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="space-y-4"
          >
            {currentCurriculum.map((section, sIdx) => {
              const sectionCompletedCount = section.lessons.filter(l => getLessonState(l.id) === 'completed').length;
              const sectionTotalCount = section.lessons.length;
              const isExpanded = !!expandedSections[section.id];

              return (
                <div key={section.id} className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
                  
                  {/* ENCABEZADO INTERACTIVO DEL MÓDULO (ACCORDION TOGGLE) */}
                  <div 
                    onClick={() => {
                      if (userTier === 'free' && section.id !== 'A') {
                        setShowUpgradeModal(true);
                      } else {
                        toggleSection(section.id);
                      }
                    }}
                    className={`
                      flex items-center justify-between p-4 cursor-pointer transition-all border-b select-none
                      ${isExpanded ? 'bg-slate-50 border-slate-200' : 'bg-white hover:bg-slate-50 border-transparent'}
                      ${userTier === 'free' && section.id !== 'A' ? 'opacity-70 bg-slate-50/50 hover:bg-slate-100/50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-slate-100 text-${userTier === 'free' && section.id !== 'A' ? 'slate-400' : theme.primary}`}>
                        {userTier === 'free' && section.id !== 'A' ? <Lock size={16} /> : <LayoutGrid size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] font-serif italic">{section.title}</h2>
                          {userTier === 'free' && section.id !== 'A' && (
                            <span className="bg-amber-100 text-amber-800 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-amber-200">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 leading-none">{section.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Progreso del nivel */}
                      {!(userTier === 'free' && section.id !== 'A') ? (
                        <div className="text-right hidden sm:block">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Completado: </span>
                          <span className={`text-[9px] font-black text-${theme.primary}`}>
                            {sectionCompletedCount} / {sectionTotalCount} lecciones
                          </span>
                        </div>
                      ) : (
                        <div className="text-right hidden sm:block">
                          <span className="text-[8px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1">
                            Sube a PRO por $129 MXN
                          </span>
                        </div>
                      )}
                      
                      {/* Chevron con rotación o candado */}
                      {!(userTier === 'free' && section.id !== 'A') ? (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-slate-400"
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      ) : (
                        <div className="text-slate-400">
                          <Lock size={12} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CUERPO DEL ACORDEÓN (ÁRBOL DE PROGRESO ZIGZAG) */}
                  {isExpanded && (
                    <motion.div 
                      initial="hidden"
                      animate="show"
                      variants={containerVariants}
                      className="p-6 relative bg-slate-50/20 border-t border-slate-200"
                    >
                      
                      {/* LÍNEAS DE CONECTORES DEL ÁRBOL */}
                      {/* Conector Central (Desktop) */}
                      <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[2px] bg-slate-200 -translate-x-1/2 z-0" />
                      
                      {/* Conector Lateral (Mobile) */}
                      <div className="block md:hidden absolute left-[1.65rem] top-8 bottom-8 w-[2px] bg-slate-200 z-0" />

                      <div className="space-y-4 md:space-y-6 relative z-10">
                        {section.lessons.map((lesson, lIdx) => {
                          const status = getLessonState(lesson.id);
                          const stars = getStars(lesson.id);
                          const isLocked = status === 'locked';
                          const isActive = status === 'active';
                          const isCompleted = status === 'completed';
                          const globalIndex = allLessonsFlat.findIndex(l => l.id === lesson.id);
                          const isEven = lIdx % 2 === 0;

                          // Tarjeta de la lección
                          const CardMarkup = (
                            <div 
                              onClick={() => !isLocked && router.push(`/lesson/${lesson.id}?type=standard&timeMode=${timeMode}`)} 
                              className={`
                                w-full max-w-[420px] p-4 rounded-none border transition-all duration-200 cursor-pointer bg-white relative overflow-hidden group/card
                                ${isLocked ? 'opacity-60 border-slate-100' : `border-slate-200 hover:border-${theme.primary} hover:shadow-sm`}
                                ${isActive ? `ring-2 ring-${theme.primary}/10 border-${theme.primary} shadow-md` : ''}
                              `}
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 relative z-10">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? `bg-${theme.primary} text-white` : 'bg-slate-100 text-slate-400'}`}>
                                      Módulo {globalIndex + 1}
                                    </span>
                                  </div>
                                  <h3 className={`text-xs font-black tracking-tight leading-tight uppercase ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{lesson.title}</h3>
                                  <p className="text-[9px] text-slate-400 mt-1 leading-snug">{lesson.description}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between h-full min-w-[50px]">
                                  {isCompleted && (
                                    <div className="flex gap-0.5 mt-1">
                                      {[1, 2, 3].map((s) => (<Trophy key={s} size={12} className={s <= stars ? `text-${theme.primary} fill-${theme.primary}` : 'text-slate-100'} />))}
                                    </div>
                                  )}
                                  {isActive && (
                                    <div className={`text-${theme.primary} transition-colors mt-1`}>
                                      <ArrowRight size={16} className="animate-pulse" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );

                          return (
                            <motion.div 
                              variants={itemVariants} 
                              key={lesson.id}
                              className={`relative flex flex-col w-full md:flex-row md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                              {/* Columna de la Tarjeta */}
                              <div className={`w-full md:w-[calc(50%-2.5rem)] flex pl-14 md:pl-0 ${isEven ? 'justify-start md:justify-end' : 'justify-start md:justify-start'}`}>
                                {CardMarkup}
                              </div>

                              {/* Botón Central del Nodo de Progreso */}
                              <div className="absolute left-[0.5rem] md:left-1/2 md:-translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2 z-20">
                                <button
                                  onClick={() => !isLocked && router.push(`/lesson/${lesson.id}?type=standard&timeMode=${timeMode}`)}
                                  disabled={isLocked}
                                  className={`
                                    w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 shadow-none relative
                                    ${isActive ? `bg-${theme.primary} border-${theme.accent} text-white shadow-lg scale-110 z-20 ring-4 ring-${theme.primary}/20` : ''} 
                                    ${isCompleted ? `bg-white border-${theme.primary} text-${theme.primary} hover:bg-${theme.secondary}` : ''} 
                                    ${isLocked ? 'bg-slate-50 border-slate-200 text-slate-400' : ''}
                                  `}
                                >
                                  {isLocked && <Lock size={14} />}
                                  {isActive && <Play size={16} fill="currentColor" className="ml-0.5" />}
                                  {isCompleted && <Check size={16} strokeWidth={3} />}
                                </button>
                              </div>

                              {/* Columna Espaciadora */}
                              <div className="hidden md:block w-full md:w-[calc(50%-2.5rem)]" />

                            </motion.div>
                          );
                        })}
                      </div>

                    </motion.div>
                  )}

                </div>
              );
            })}
          </motion.div>

          {/* EXÁMENES COMPACTOS (SIMULADORES ESTRATÉGICOS) */}
          {activeLanguage === 'en' && (
            <div className="mt-8 mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-slate-200 pb-4">
                <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Shield size={14} className={`text-${theme.primary}`} /> Simuladores Estratégicos
                </h2>
                
                {/* SELECTOR DE MODO DE TIEMPO CORPORATIVO */}
                <div className="inline-flex bg-slate-100 p-0.5 border border-slate-200">
                  {(['basic', 'intermediate', 'advanced'] as const).map(mode => {
                    const label = {
                      basic: 'Básico (Sin Tiempo)',
                      intermediate: 'Intermedio (10 Min)',
                      advanced: 'Avanzado (5 Min)'
                    }[mode];
                    
                    const activeColor = {
                      basic: `bg-${theme.primary} text-white`,
                      intermediate: 'bg-orange-500 text-white',
                      advanced: 'bg-rose-600 text-white'
                    }[mode];
                    
                    const isActive = timeMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setTimeMode(mode)}
                        className={`px-3 py-1 rounded-none text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? activeColor : 'text-slate-400 hover:text-slate-700'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Link href={`/lesson/toeic_listening?timeMode=${timeMode}`} className={`bg-white border border-slate-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}>
                  <div className={`bg-slate-100 p-3 text-slate-400 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Headphones size={18} /></div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-0.5">TOEIC Listening</h4>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold">Comprensión Auditiva</p>
                  </div>
                </Link>
                <Link href={`/lesson/toeic_reading?timeMode=${timeMode}`} className={`bg-white border border-slate-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}>
                  <div className={`bg-slate-100 p-3 text-slate-400 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><BookOpen size={18} /></div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-0.5">TOEIC Reading</h4>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold">Análisis Lector</p>
                  </div>
                </Link>
                <Link href={`/lesson/toeic_mock?timeMode=${timeMode}`} className={`bg-white border border-slate-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}>
                  <div className={`bg-slate-100 p-3 text-slate-400 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Trophy size={18} /></div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-0.5">Simulador TOEIC®</h4>
                    <p className="text-[8px] text-purple-600 uppercase tracking-wider font-black font-serif italic">Completo (100% Real)</p>
                  </div>
                </Link>
                <Link href={`/lesson/toefl_mock?timeMode=${timeMode}`} className={`bg-white border border-slate-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}>
                  <div className={`bg-slate-100 p-3 text-slate-400 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Award size={18} /></div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-0.5">Simulador TOEFL®</h4>
                    <p className="text-[8px] text-indigo-600 uppercase tracking-wider font-black font-serif italic">iBT Integrated (4 Skills)</p>
                  </div>
                </Link>
                <Link href={`/lesson/ielts_mock?timeMode=${timeMode}`} className={`bg-white border border-slate-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}>
                  <div className={`bg-slate-100 p-3 text-slate-400 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Award size={18} /></div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-0.5">Simulador IELTS®</h4>
                    <p className="text-[8px] text-teal-600 uppercase tracking-wider font-black font-serif italic">Academic (Global)</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR DERECHO */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar userStats={userStats} />
        </div>

      </div>
      
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
}