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
import { fetchDashboardDataCached } from '@/lib/dashboardCache';
import dynamic from 'next/dynamic';

const UpgradeModal = dynamic(() => import('@/components/pro/UpgradeModal').then(mod => mod.UpgradeModal), { ssr: false });
const StatsModal = dynamic(() => import('@/components/dashboard/StatsModal').then(mod => mod.StatsModal), { ssr: false });

import { ServerAwakeLoader } from '@/components/ui/Server/ServerAwakeLoader';
import { motion, Variants } from 'framer-motion';
import { AdBanner } from '@/components/ads/AdBanner';

import {
  Lock, Trophy, Award, Zap, Flame, Headphones, BookOpen,
  Shield, LayoutGrid, Loader2, User, ChevronDown, Sparkles, Crown
} from 'lucide-react';
import PracticeReminderWidget from '@/components/dashboard/PracticeReminderWidget';

import { CURRICULUM } from '@/data/curriculum';
import { CURRICULUM_FR } from '@/data/curriculum_fr';
import { CURRICULUM_ZH } from '@/data/curriculum_zh';

// Extracted Components
import { HeaderStats } from './components/HeaderStats';
import { GiveawayWidget } from './components/GiveawayWidget';
import { LessonZigZagCard, LessonStatus } from './components/LessonZigZagCard';
import { generateGeneralTrophies } from '@/lib/trophies';

const LANGUAGE_COLORS: Record<string, { primary: string, secondary: string, accent: string, selection: string, bg: string }> = {
  en: { primary: 'sky-400', secondary: 'sky-50', accent: 'sky-500', selection: 'bg-sky-100', bg: 'text-sky-900' },
  fr: { primary: 'cyan-500', secondary: 'cyan-50', accent: 'cyan-600', selection: 'bg-cyan-100', bg: 'text-cyan-900' },
  zh: { primary: 'indigo-200', secondary: 'indigo-50', accent: 'indigo-300', selection: 'bg-indigo-100', bg: 'text-indigo-900' },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

export default function DashboardPage() {
  const router = useRouter();
  const { setMode, activeLanguage, setLanguage, userTier, setUserTier } = useUIStore();

  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>({ xp: 0, lessons: 0, streak: 0, premiumCount: 0, xp_history: [], level_details: null, last_activity_at: null });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [timeMode, setTimeMode] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const getProgressPercentage = () => globalProgress;

  const getCompletedCount = (baseId: string) => {
    if (!dashboardData?.standard) return 0;
    return Array.from({ length: 10 }).filter((_, i) => {
      const vNum = i + 1;
      return dashboardData.standard.some(
        (l: any) => l.lesson_id === `${baseId}_v${vNum}` && l.status === 'completed'
      );
    }).length;
  };

  const currentCurriculum = useMemo(() => {
    if (activeLanguage === 'fr') return CURRICULUM_FR;
    if (activeLanguage === 'zh') return CURRICULUM_ZH;
    return CURRICULUM;
  }, [activeLanguage]);

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
      const loadData = async () => {
        try {
          const cache = await fetchDashboardDataCached();
          
          if (cache.mapRes) setDashboardData(cache.mapRes);
          if (cache.statsRes) {
            setUserStats({
              xp: cache.statsRes.total_xp || 0,
              lessons: cache.statsRes.completed_modules || 0,
              streak: cache.statsRes.streak_days || 0,
              premiumCount: cache.statsRes.premium_users_count ?? 0,
              xp_history: cache.statsRes.xp_history || [],
              level_details: cache.statsRes.level_details || null,
              last_activity_at: cache.statsRes.last_activity_at || null
            });
            setGlobalProgress(cache.statsRes.global_progress || 0);
          }
          if (cache.userRes) {
            let tierVal = (cache.userRes.membership?.tier || cache.userRes.tier || 'free').toLowerCase();
            if (tierVal === 'titanium') tierVal = 'executive';
            setUserTier(tierVal as 'free' | 'pro' | 'executive');
            setIsUserPremium(tierVal === 'pro' || tierVal === 'executive');

            if (cache.userRes.username) {
              setCurrentUser(cache.userRes.username);
              Cookies.set('username', cache.userRes.username);
            }
          }
          if (cache.leadRes) {
            setLeaderboard(cache.leadRes.leaderboard || []);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          if (!dashboardData) setDashboardData({ standard: [] });
        }
      };
      loadData();
    } else {
      router.push('/login');
    }
  }, [router]);

  const dynamicLeaderboard = useMemo(() => {
    let list = [...leaderboard].filter(item => item.alias?.toLowerCase() !== 'diana');

    if (!list.some(item => item.isMe)) {
      list.push({
        rank: '-',
        alias: currentUser || 'Tú',
        xp: userStats.xp,
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
  }, [leaderboard, currentUser, userStats.xp]);

  const generalTrophies = useMemo(() => generateGeneralTrophies(userStats.xp, userStats.streak, userStats.lessons), [userStats.xp, userStats.streak, userStats.lessons]);

  const handleSimulatorClick = (e: React.MouseEvent, lessonId: string) => {
    e.preventDefault();
    if (userTier !== 'executive') {
      setShowUpgradeModal(true);
    } else {
      router.push(`/simulator/${lessonId}_v1`);
    }
  };

  const allLessonsFlat = useMemo(() => currentCurriculum.flatMap(section => section.lessons), [currentCurriculum]);

  const standardLessonsMap = useMemo(() => {
    const map = new Map();
    if (dashboardData?.standard) {
      for (const l of dashboardData.standard) {
        if (l.language === activeLanguage || (!l.language && activeLanguage === 'en')) {
          map.set(l.lesson_id, l);
        }
      }
    }
    return map;
  }, [dashboardData?.standard, activeLanguage]);

  const getLessonState = (lessonId: string): LessonStatus => {
    const firstLessonId = currentCurriculum?.[0]?.lessons?.[0]?.id;
    if (!dashboardData?.standard || dashboardData.standard.length === 0) {
      return lessonId === firstLessonId ? 'active' : 'locked';
    }
    const node = standardLessonsMap.get(lessonId);
    if (node) {
      return node.status === 'completed' ? 'completed' : 'active';
    }
    return lessonId === firstLessonId ? 'active' : 'locked';
  };

  const getStars = (lessonId: string) => standardLessonsMap.get(lessonId)?.stars || 0;

  const getLessonProgressPercent = (lessonId: string) => {
    const node = standardLessonsMap.get(lessonId);
    if (node && node.total_steps && node.total_steps > 0) {
      if (node.current_step > 0) {
        return Math.max(1, Math.round((node.current_step / node.total_steps) * 100));
      }
    }
    return 0;
  };

  const theme = useMemo(() => LANGUAGE_COLORS[activeLanguage] || LANGUAGE_COLORS.en, [activeLanguage]);

  if (!isMounted || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50">
        <Loader2 className={`animate-spin text-${theme.primary} mb-3`} size={24} />
        <p className="text-sky-700 font-semibold text-[10px] tracking-widest uppercase">Cargando Entorno...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-sky-50 font-sans text-sky-950 pb-20 lg:pb-0 ${theme.selection} selection:${theme.bg}`}>

      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-200 px-6 h-12 flex items-center justify-between shadow-none">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 bg-${theme.primary} flex items-center justify-center`}><span className="text-slate-900 font-black text-[9px]">O</span></div>
          <span className="font-black text-sky-950 text-[10px] tracking-[0.2em] uppercase hidden sm:block">OnixLingo Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <HeaderStats xp={userStats.xp} streak={userStats.streak} onOpenStats={() => setShowStatsModal(true)} />

          <Link href="/dashboard/leaderboard" className="p-2 hover:bg-sky-100 border border-transparent hover:border-sky-200 transition-all text-sky-800">
            <Trophy size={18} />
          </Link>

          <Link href="/dashboard/profile" className="p-2 hover:bg-sky-100 border border-transparent hover:border-sky-200 transition-all text-sky-800">
            <User size={18} />
          </Link>

          <div className="hidden sm:flex items-center gap-6 border-l border-sky-100 pl-6 h-6">
            <Link href="/dashboard/vocabulary" className={`text-[9px] font-black text-sky-600 hover:text-${theme.primary} transition-colors uppercase tracking-widest`}>Vocabulario</Link>
            <Link href="/dashboard/chess" className={`text-[9px] font-black text-sky-600 hover:text-${theme.primary} transition-colors uppercase tracking-widest`}>Ajedrez</Link>
          </div>
          <button onClick={() => { setMode('professional'); router.push('/dashboard/pro'); }} className={`bg-white hover:bg-slate-100 text-slate-900 border border-slate-900 px-4 py-1.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] ml-2 transition-all active:scale-95`}>
            Modo Executive
          </button>
        </div>
      </nav>

      <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 pt-6 px-4">
        
        {/* ESPACIO PUBLICITARIO DERECHO */}
        <div className="hidden xl:block w-[160px] shrink-0">
          <div className="sticky top-24 flex justify-center w-full">
            <AdBanner slot="4653526972" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
        </div>

        <div className="flex-1 min-w-0 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6">

        <div className="flex-1 min-w-0">

          <div className="mb-6 bg-white border border-sky-200 p-6 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 font-serif italic">Bienvenido, {currentUser ? currentUser.substring(0, 2).toUpperCase() : '??'}</h1>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                <span className={`font-black uppercase tracking-wider ${userTier === 'executive'
                    ? 'text-[#D4AF37]'
                    : userTier === 'pro'
                      ? 'text-[#D4AF37]'
                      : 'text-slate-900'
                  }`}>
                  {userTier === 'executive' ? 'Executive Tier' : userTier === 'pro' ? 'Pro Tier' : 'Free Tier'}
                </span> • {activeLanguage === 'en' ? 'Inglés' : activeLanguage === 'fr' ? 'Francés' : 'Chino'} General
              </p>
            </div>
            <div className="inline-flex bg-sky-50 p-1 border border-sky-200">
              {(['en', 'fr', 'zh'] as const).map(lang => {
                const colors = {
                  en: activeLanguage === 'en' ? 'bg-sky-200 text-slate-900 shadow-none' : 'text-sky-600 hover:bg-sky-100 hover:text-sky-900',
                  fr: activeLanguage === 'fr' ? 'bg-cyan-200 text-slate-900 shadow-none' : 'text-sky-600 hover:bg-sky-100 hover:text-sky-900',
                  zh: activeLanguage === 'zh' ? 'bg-indigo-200 text-slate-900 shadow-none' : 'text-sky-600 hover:bg-sky-100 hover:text-sky-900',
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div className="bg-white border border-sky-200 p-5 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between animate-fade-in-up opacity-0 [animation-delay:100ms]">
              <div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-900 mb-3">
                  <span className="flex items-center gap-1.5"><Trophy size={12} className={`text-${theme.primary}`} /> Progreso General del Curso</span>
                  <span className={`text-${theme.primary} font-black text-xs`}>{getProgressPercentage()}%</span>
                </div>
                <div className="h-2 bg-sky-100 rounded-none overflow-hidden border border-sky-200 mb-4">
                  <motion.div
                    className={`h-full bg-${theme.primary}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-100 p-3 rounded-none">
                <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Cálculo de XP y Racha</p>
                <p className="text-[9px] text-slate-600 leading-snug">
                  Tu XP es la suma de tus mejores puntajes por lección. Tu racha se activa al completar al menos una lección diaria consecutiva. ¡Sigue aprendiendo!
                </p>
              </div>
            </div>

            <GiveawayWidget premiumCount={userStats.premiumCount || 0} />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <PracticeReminderWidget themeColor="blue" />

            <div className="bg-white border border-sky-200 p-5 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group animate-fade-in-up opacity-0 [animation-delay:300ms]">
              <div className="absolute top-0 right-0 p-1 opacity-5"><Trophy size={60} className="text-[#D4AF37]" /></div>
              <div className="relative z-10 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={11} className="text-[#D4AF37]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-900">Competencia Global</span>
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none">Ranking Global</h3>
                  <p className="text-[9px] text-sky-700 font-semibold leading-none mt-1.5">Top alumnos con mayor puntaje de XP acumulado.</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  {dynamicLeaderboard.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 text-[10px] font-bold border ${item.isMe ? 'border-blue-200 bg-blue-50/20 text-blue-800' : 'border-sky-100 text-sky-950'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 flex items-center justify-center font-mono text-[9px] font-black ${index === 0 ? 'bg-[#D4AF37]/20 text-slate-900' : index === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'}`}>
                          {index + 1}
                        </span>
                        <span>{item.name ? item.name.substring(0, 2).toUpperCase() : '??'}</span>
                      </div>
                      <span className="font-mono text-[9px] font-black">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-sky-200 p-5 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group animate-fade-in-up opacity-0 [animation-delay:400ms]">
              <div className="absolute top-0 right-0 p-1 opacity-5"><Award size={60} className="text-[#D4AF37]" /></div>
              <div className="relative z-10 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={11} className="text-[#D4AF37]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-900">Hitos de Logros</span>
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none">Trofeos Generales ({generalTrophies.filter(t => t.unlocked).length}/200)</h3>
                  <p className="text-[9px] text-sky-700 font-semibold leading-none mt-1.5">Consigue metas para desbloquear tus insignias.</p>
                </div>

                <div className="space-y-1.5 pt-1 max-h-[175px] overflow-y-auto pr-1 custom-scrollbar">
                  {generalTrophies.map((badge, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 border ${badge.unlocked ? 'border-emerald-250 bg-[#D4AF37]/10/20 text-[#D4AF37]' : 'border-sky-100 text-sky-650 opacity-60'}`}
                    >
                      <div className="flex items-center gap-2">
                        {badge.icon === 'Crown' && <Crown size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-sky-600'} />}
                        {badge.icon === 'Flame' && <Flame size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-sky-600'} />}
                        {badge.icon === 'Award' && <Award size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-sky-600'} />}
                        {badge.icon === 'Sparkles' && <Sparkles size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-sky-600'} />}

                        <div className="text-left">
                          <p className="text-[9px] font-black leading-none">{badge.title}</p>
                          <p className="text-[7px] font-bold text-sky-600 mt-0.5 leading-none">{badge.desc}</p>
                        </div>
                      </div>
                      <span className="text-[7px] font-black uppercase tracking-widest shrink-0 ml-1">
                        {badge.unlocked ? '✓' : '🔒'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
                <div key={section.id} className="bg-white border border-sky-200 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] overflow-hidden">

                  <div
                    onClick={() => {
                      if (userTier === 'free' && sIdx !== 0) {
                        setShowUpgradeModal(true);
                      } else {
                        toggleSection(section.id);
                      }
                    }}
                    className={`
                      flex items-center justify-between p-4 cursor-pointer transition-all border-b select-none
                      ${isExpanded ? 'bg-sky-50 border-sky-200' : 'bg-white hover:bg-sky-50 border-transparent'}
                      ${userTier === 'free' && sIdx !== 0 ? 'opacity-70 bg-sky-50/50 hover:bg-sky-100/50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-sky-100 text-${userTier === 'free' && sIdx !== 0 ? 'sky-400' : theme.primary}`}>
                        {userTier === 'free' && sIdx !== 0 ? <Lock size={16} /> : <LayoutGrid size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[10px] font-black text-sky-950 uppercase tracking-[0.2em] font-serif italic">{section.title}</h2>
                          {userTier === 'free' && sIdx !== 0 && (
                            <span className="bg-amber-100 text-[#D4AF37] text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-[#D4AF37]/30">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-[8px] font-bold text-sky-600 uppercase tracking-widest mt-0.5 leading-none">{section.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {!(userTier === 'free' && sIdx !== 0) ? (
                        <div className="text-right hidden sm:block">
                          <span className="text-[8px] font-black uppercase tracking-wider text-sky-600">Completado: </span>
                          <span className={`text-[9px] font-black text-${theme.primary}`}>
                            {sectionCompletedCount} / {sectionTotalCount} lecciones
                          </span>
                        </div>
                      ) : (
                        <div className="text-right hidden sm:block">
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] bg-teal-50 border border-teal-100 px-2.5 py-1">
                            Sube a PRO por $129 MXN
                          </span>
                        </div>
                      )}

                      {!(userTier === 'free' && sIdx !== 0) ? (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sky-600"
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      ) : (
                        <div className="text-sky-600">
                          <Lock size={12} />
                        </div>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={containerVariants}
                      className="p-6 relative bg-sky-50/20 border-t border-sky-200"
                    >
                      <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[2px] bg-sky-200 -translate-x-1/2 z-0" />
                      <div className="block md:hidden absolute left-[1.65rem] top-8 bottom-8 w-[2px] bg-sky-200 z-0" />

                      <div className="space-y-1.5 md:space-y-2 relative z-10">
                        {section.lessons.map((lesson, lIdx) => {
                          const status = getLessonState(lesson.id);
                          const stars = getStars(lesson.id);
                          const globalIndex = allLessonsFlat.findIndex(l => l.id === lesson.id);
                          const isEven = lIdx % 2 === 0;

                          return (
                            <LessonZigZagCard
                              key={lesson.id}
                              lesson={lesson}
                              status={status}
                              stars={stars}
                              progressPercent={getLessonProgressPercent(lesson.id)}
                              globalIndex={globalIndex}
                              isEven={isEven}
                              theme={theme}
                              timeMode={timeMode}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>

          <div className="mt-8 mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-sky-200 pb-4">
                <h2 className="text-[9px] font-black text-sky-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Shield size={14} className={`text-${theme.primary}`} /> Simuladores Estratégicos
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href={`/lesson/toeic_listening`}
                  onClick={(e) => handleSimulatorClick(e, 'toeic_listening')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group relative overflow-hidden`}
                >
                  {userTier !== 'executive' && (
                    <div className="absolute top-0 right-0 bg-amber-100 text-[#D4AF37] px-2 py-0.5 rounded-bl-lg text-[7px] font-black uppercase flex items-center gap-1 border-b border-l border-[#D4AF37]/30 z-10 shadow-none">
                      <Lock size={8} /> EXECUTIVE
                    </div>
                  )}
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-slate-900 transition-colors`}><Headphones size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">TOEIC Listening</h4>
                    <p className="text-[8px] text-sky-600 uppercase tracking-wider font-bold mb-1">Comprensión Auditiva</p>
                    {(() => {
                      const completedCount = getCompletedCount('toeic_listening');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-[7px] font-black uppercase px-1.5 py-0.5 border border-[#D4AF37]/30">
                          ✓ COMPLETO
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">VERSIÓN ÚNICA</span>
                      );
                    })()}
                  </div>
                </Link>
                <Link
                  href={`/lesson/toeic_reading`}
                  onClick={(e) => handleSimulatorClick(e, 'toeic_reading')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group relative overflow-hidden`}
                >
                  {userTier !== 'executive' && (
                    <div className="absolute top-0 right-0 bg-amber-100 text-[#D4AF37] px-2 py-0.5 rounded-bl-lg text-[7px] font-black uppercase flex items-center gap-1 border-b border-l border-[#D4AF37]/30 z-10 shadow-none">
                      <Lock size={8} /> EXECUTIVE
                    </div>
                  )}
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-slate-900 transition-colors`}><BookOpen size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">TOEIC Reading</h4>
                    <p className="text-[8px] text-sky-600 uppercase tracking-wider font-bold mb-1">Análisis Lector</p>
                    {(() => {
                      const completedCount = getCompletedCount('toeic_reading');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-[7px] font-black uppercase px-1.5 py-0.5 border border-[#D4AF37]/30">
                          ✓ COMPLETO
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">VERSIÓN ÚNICA</span>
                      );
                    })()}
                  </div>
                </Link>
                <Link
                  href={`/lesson/toeic_mock`}
                  onClick={(e) => handleSimulatorClick(e, 'toeic_mock')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group relative overflow-hidden`}
                >
                  {userTier !== 'executive' && (
                    <div className="absolute top-0 right-0 bg-amber-100 text-[#D4AF37] px-2 py-0.5 rounded-bl-lg text-[7px] font-black uppercase flex items-center gap-1 border-b border-l border-[#D4AF37]/30 z-10 shadow-none">
                      <Lock size={8} /> EXECUTIVE
                    </div>
                  )}
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-slate-900 transition-colors`}><Trophy size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">Simulador TOEIC®</h4>
                    <p className="text-[8px] text-purple-600 uppercase tracking-wider font-black font-serif italic mb-1">Listening & Reading</p>
                    {(() => {
                      const completedCount = getCompletedCount('toeic_mock');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-[7px] font-black uppercase px-1.5 py-0.5 border border-[#D4AF37]/30">
                          ✓ COMPLETO
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">VERSIÓN ÚNICA</span>
                      );
                    })()}
                  </div>
                </Link>
              </div>
            </div>
        </div>

        {/* SIDEBAR DERECHO */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar userStats={userStats} />
        </div>
        </div> {/* CIERRE CONTENEDOR CENTRAL */}

        {/* AdSense Derecho */}
        <div className="hidden 2xl:block w-[160px] shrink-0">
          <div className="sticky top-20 flex justify-center w-full">
             <AdBanner slot="9483726154" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
        </div>

      </div> {/* CIERRE WRAPPER PRINCIPAL CON ANUNCIOS */}

      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      {showStatsModal && <StatsModal onClose={() => setShowStatsModal(false)} userStats={userStats} />}
    </div>
  );
}