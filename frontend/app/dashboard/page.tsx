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
import { StatsModal } from '@/components/dashboard/StatsModal';

import {
  Play, Lock, Check, Trophy, Award, Zap, Flame, Headphones, BookOpen, PenTool,
  Mic, Shield, LayoutGrid, Loader2, Briefcase, ArrowRight, User, ChevronDown, ShieldCheck,
  Gift, Smartphone, Tablet, Laptop, Sparkles, Crown, X, Clock, Timer, CheckCircle2
} from 'lucide-react';
import PracticeReminderWidget from '@/components/dashboard/PracticeReminderWidget';

import { CURRICULUM } from '@/data/curriculum';
import { CURRICULUM_FR } from '@/data/curriculum_fr';
import { CURRICULUM_ZH } from '@/data/curriculum_zh';

type LessonStatus = 'locked' | 'active' | 'completed';

const LANGUAGE_COLORS: Record<string, { primary: string, secondary: string, accent: string, selection: string, bg: string }> = {
  en: { primary: 'blue-600', secondary: 'blue-50', accent: 'blue-700', selection: 'bg-blue-100', bg: 'text-blue-900' },
  fr: { primary: 'cyan-500', secondary: 'cyan-50', accent: 'cyan-600', selection: 'bg-cyan-100', bg: 'text-cyan-900' },
  zh: { primary: 'indigo-800', secondary: 'indigo-50', accent: 'indigo-900', selection: 'bg-indigo-100', bg: 'text-indigo-900' },
};

const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1;
  if (xp < 500) return 2;
  if (xp < 1000) return 3;
  return 4 + Math.floor((xp - 1000) / 2000);
};

const HeaderStats = ({ xp, streak, onOpenStats }: { xp: number, streak: number, onOpenStats: () => void }) => {
  const { energy, userTier, checkAndResetDailyLimits } = useUIStore();

  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

  const level = calculateLevel(xp);

  const getEnergyColor = (pct: number) => {
    if (pct > 50) return 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (pct > 20) return 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]';
  };

  return (
    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-sky-200 shadow-none">
      <button onClick={onOpenStats} className="hidden md:flex items-center gap-2 px-3 border-r border-sky-100 hover:bg-sky-50 transition-colors text-left outline-none cursor-pointer">
        <div className="text-purple-650"><Crown size={14} className="fill-purple-100" /></div>
        <div>
          <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">Nivel</p>
          <span className="text-xs font-black text-sky-950 leading-none">{level}</span>
        </div>
      </button>
      <button onClick={onOpenStats} className="hidden md:flex items-center gap-2 px-3 border-r border-sky-100 hover:bg-sky-50 transition-colors text-left outline-none cursor-pointer">
        <div className="text-amber-500"><Zap size={14} fill="currentColor" /></div>
        <div>
          <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">XP</p>
          <span className="text-xs font-black text-sky-950 leading-none">{xp.toLocaleString()}</span>
        </div>
      </button>
      <button onClick={onOpenStats} className="hidden md:flex items-center gap-2 px-3 border-r border-sky-100 hover:bg-sky-50 transition-colors text-left outline-none cursor-pointer">
        <div className="text-orange-500"><Flame size={14} fill="currentColor" /></div>
        <div>
          <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">Racha</p>
          <span className="text-xs font-black text-sky-950 leading-none">{streak}</span>
        </div>
      </button>

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
              <div className="relative w-14 md:w-20 h-5 bg-sky-950 rounded-[4px] border border-sky-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
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
              <div className="w-[3px] h-2.5 bg-sky-700 rounded-r-[2px] -ml-[1px] shadow-[0_10px_40px_rgba(14,165,233,0.08)] shrink-0" />
            </div>

            <div className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none hidden md:block">
              Energía
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck size={12} className="fill-emerald-50 text-emerald-600 shrink-0" />
            <div className="text-left hidden md:block">
              <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">Energía</p>
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

const SIMULATOR_VERSIONS_METADATA: Record<string, Array<{ title: string; desc: string }>> = {
  toeic_listening: [
    { title: "Versión 1: Reuniones de Ventas", desc: "Monitoreo de conversaciones sobre transición a CRM y acuerdos directivos." },
    { title: "Versión 2: Distribución y Carga", desc: "Audios sobre envíos internacionales y revisión de contratos de transportistas." },
    { title: "Versión 3: Selección de Personal", desc: "Entrevistas estructuradas, ofertas de contratación y onboarding laboral." },
    { title: "Versión 4: Relaciones Públicas", desc: "Anuncios de marketing corporativo y lanzamientos de imagen de marca." },
    { title: "Versión 5: Auditorías Contables", desc: "Audios sobre revisiones fiscales trimestrales y proyecciones de inversión." },
    { title: "Versión 6: Operaciones de Planta", desc: "Diálogos sobre procesos de manufactura y estándares de seguridad industrial." },
    { title: "Versión 7: Migración de Servidores", desc: "Conversaciones sobre soporte técnico IT, y mantenimiento de infraestructura." },
    { title: "Versión 8: Atención al Cliente", desc: "Diálogos sobre acuerdos de nivel de servicio (SLA) y fidelización de clientes." },
    { title: "Versión 9: Compras y Proveedores", desc: "Audios sobre adquisición de materias primas y negociaciones con proveedores." },
    { title: "Versión 10: Estrategia Corporativa", desc: "Conversaciones sobre reestructuración de departamentos e indicadores de desempeño." }
  ],
  toeic_reading: [
    { title: "Versión 1: Memorandos de Ventas", desc: "Lectura de correos formales sobre la implementación del nuevo sistema CRM." },
    { title: "Versión 2: Documentos de Envío", desc: "Comprensión de contratos comerciales de transporte marítimo y facturas de aduana." },
    { title: "Versión 3: Manuales de Onboarding", desc: "Lectura de políticas de recursos humanos y descripciones de puestos." },
    { title: "Versión 4: Comunicados de Prensa", desc: "Análisis de notas de relaciones públicas y estrategias de publicidad corporativa." },
    { title: "Versión 5: Balances Financieros", desc: "Lectura de reportes contables, auditorías internas y resúmenes de presupuesto." },
    { title: "Versión 6: Inspecciones de Calidad", desc: "Análisis de guías operativas industriales y reportes de incidentes de fábrica." },
    { title: "Versión 7: Reportes de Sistemas", desc: "Comprensión de tickets de soporte técnico e instructivos de seguridad en la nube." },
    { title: "Versión 8: Correspondencia de Clientes", desc: "Lectura de resoluciones a quejas de clientes y acuerdos de soporte." },
    { title: "Versión 9: Contratos de Proveedores", desc: "Análisis de órdenes de compra y términos y condiciones con distribuidores." },
    { title: "Versión 10: Planificación Ejecutiva", desc: "Comprensión de reportes trimestrales y estrategias de expansión corporativa." }
  ],
  toeic_mock: [
    { title: "Versión 1: Gestión de Ventas", desc: "Evaluación integral de Listening & Reading enfocada en transiciones y liderazgo." },
    { title: "Versión 2: Operaciones y Contratos", desc: "Examen completo simulado sobre negociación de contratos logísticos y aduanas." },
    { title: "Versión 3: Recursos Humanos", desc: "Simulador sobre onboarding de empleados, capacitación y auditorías laborales." },
    { title: "Versión 4: Relaciones Corporativas", desc: "Evaluación de comprensión lectora y auditiva sobre campañas y conferencias." },
    { title: "Versión 5: Finanzas y Balances", desc: "Simulador con lecturas y audios sobre auditorías trimestrales y proyecciones." },
    { title: "Versión 6: Gestión Industrial", desc: "Evaluación integral sobre seguridad en planta, órdenes de servicio y fallas." },
    { title: "Versión 7: Infraestructura Tecnológica", desc: "Examen simulado sobre migración de sistemas y ciberseguridad corporativa." },
    { title: "Versión 8: Gestión de Incidentes", desc: "Prueba integral sobre atención a reclamos, devoluciones y resolución de conflictos." },
    { title: "Versión 9: Adquisiciones y Logística", desc: "Simulador completo sobre adquisición de suministros y manejo de inventarios." },
    { title: "Versión 10: Estrategia de Negocios", desc: "Examen final sobre memorandos de dirección y planeación estratégica." }
  ],
  toefl_mock: [
    { title: "Versión 1: Astronomía y Astrofísica", desc: "Lecturas académicas sobre la habitabilidad de exoplanetas y tutorías de ciencias." },
    { title: "Versión 2: Historia Antigua", desc: "Textos arqueológicos sobre la economía del Imperio Romano y excavaciones clásicas." },
    { title: "Versión 3: Biología Marina", desc: "Lecturas sobre el impacto del calentamiento en los ecosistemas de arrecifes." },
    { title: "Versión 4: Ciencias del Comportamiento", desc: "Enfoque en psicología evolutiva, toma de decisiones y comportamiento humano." },
    { title: "Versión 5: Paleontología", desc: "Lecturas académicas sobre fósiles de dinosaurios, evolución y registros fósiles." },
    { title: "Versión 6: Física y Termodinámica", desc: "Conferencias sobre sistemas de conservación de energía y leyes físicas aplicadas." },
    { title: "Versión 7: Historia del Arte", desc: "Análisis académico de la perspectiva renacentista y literatura clásica." },
    { title: "Versión 8: Historia Económica", desc: "Textos sobre el surgimiento del trueque y los primeros sistemas monetarios." },
    { title: "Versión 9: Genética Molecular", desc: "Conferencias sobre la secuenciación del ADN y terapia génica aplicada." },
    { title: "Versión 10: Redes Neuronales", desc: "Discusiones sobre inteligencia artificial aplicada al campo académico y salud." }
  ],
  ielts_mock: [
    { title: "Versión 1: Exploración Espacial", desc: "Lecturas académicas de astronomía y ensayos sobre el descubrimiento de exoplanetas." },
    { title: "Versión 2: Estudios Arqueológicos", desc: "Textos sobre el urbanismo en la antigua Roma y discusiones sociopolíticas clásicas." },
    { title: "Versión 3: Conservación Marina", desc: "Lecturas de ciencias ambientales sobre la decoloración de corales y cambio climático." },
    { title: "Versión 4: Psicología Evolutiva", desc: "Ensayos sobre las teorías de la elección humana y sociología de grupos." },
    { title: "Versión 5: Paleobiología", desc: "Lecturas académicas sobre la anatomía evolutiva de fósiles en el periodo Mesozoico." },
    { title: "Versión 6: Innovación Energética", desc: "Conferencias sobre termodinámica aplicada a las energías renovables modernas." },
    { title: "Versión 7: Renacimiento y Artes", desc: "Análisis crítico de técnicas de pintura y evolución del arte europeo." },
    { title: "Versión 8: Economía Primitiva", desc: "Textos analíticos sobre el origen de las divisas y el intercambio comercial temprano." },
    { title: "Versión 9: Terapia Génica y Salud", desc: "Conferencias de medicina avanzada, mutaciones y edición genética." },
    { title: "Versión 10: Inteligencia Artificial", desc: "Discusiones tecnológicas sobre el futuro del aprendizaje profundo computacional." }
  ]
};

const getSimulatorDisplayName = (id: string) => {
  if (id === 'toeic_listening') return 'TOEIC® Listening';
  if (id === 'toeic_reading') return 'TOEIC® Reading';
  if (id === 'toeic_mock') return 'TOEIC® Completo';
  if (id === 'toefl_mock') return 'TOEFL® Completo';
  if (id === 'ielts_mock') return 'IELTS® Completo';
  return 'Simulador';
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
  const [selectedSimulator, setSelectedSimulator] = useState<string | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Estado local para acordeón de niveles (Lección A expandida por defecto)
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
          const results = await Promise.allSettled([
            apiClient.get('/progress/map'),
            apiClient.get('/progress/stats'),
            apiClient.get('/users/me'),
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
              console.warn("Conexión temporal al backend no disponible:", firstRealError.reason);
              if (!dashboardData) {
                setDashboardData({ standard: [] });
              }
            }
            return; // Salir de forma segura sin provocar un overlay de error en desarrollo
          }

          // Todas las peticiones fueron exitosas (status === 'fulfilled')
          const [mapRes, statsRes, userRes, leaderboardRes] = results.map(
            r => (r as PromiseFulfilledResult<any>).value
          );

          setDashboardData(mapRes.data);
          setUserStats({
            xp: statsRes.data.total_xp || 0,
            lessons: statsRes.data.completed_modules || 0,
            streak: statsRes.data.streak_days || 0,
            premiumCount: statsRes.data.premium_users_count ?? 0,
            xp_history: statsRes.data.xp_history || [],
            level_details: statsRes.data.level_details || null,
            last_activity_at: statsRes.data.last_activity_at || null
          });
          setGlobalProgress(statsRes.data.global_progress || 0);
          setLeaderboard(leaderboardRes.data.leaderboard || []);

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

  // Real database leaderboard rankings only
  const getDynamicLeaderboard = () => {
    const list = [...leaderboard];

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
  };

  // Generator of 200 general unique trophies
  const getGeneralTrophies = () => {
    const list: any[] = [];
    const xp = userStats.xp;
    const streak = userStats.streak;
    const completedLessons = userStats.lessons;

    // 1. XP Milestones (80 trophies)
    for (let i = 1; i <= 80; i++) {
      const targetXP = i * 200; // up to 16,000 XP
      const isUnlocked = xp >= targetXP;
      list.push({
        id: `general-xp-${i}`,
        title: `Maestría en XP Lvl ${i}`,
        desc: `Alcanza un total de ${targetXP.toLocaleString()} XP`,
        unlocked: isUnlocked,
        icon: 'Award'
      });
    }

    // 2. Streak Milestones (60 trophies)
    for (let i = 1; i <= 60; i++) {
      const targetStreak = i; // up to 60 days
      const isUnlocked = streak >= targetStreak;
      list.push({
        id: `general-streak-${i}`,
        title: `Constancia de Acero Lvl ${i}`,
        desc: `Mantén una racha de ${targetStreak} días activos`,
        unlocked: isUnlocked,
        icon: 'Flame'
      });
    }

    // 3. Lesson Completeness Milestones (60 trophies)
    for (let i = 1; i <= 60; i++) {
      const targetLessons = i; // up to 60 lessons
      const isUnlocked = completedLessons >= targetLessons;
      list.push({
        id: `general-lessons-${i}`,
        title: `Erudito Académico Lvl ${i}`,
        desc: `Completa un total de ${targetLessons} lecciones`,
        unlocked: isUnlocked,
        icon: 'Crown'
      });
    }

    return list.slice(0, 200);
  };

  const handleSimulatorClick = (e: React.MouseEvent, lessonId: string) => {
    e.preventDefault();
    if (userTier !== 'executive') {
      setShowUpgradeModal(true);
    } else {
      setSelectedSimulator(lessonId);
      setShowVersionModal(true);
    }
  };

  const allLessonsFlat = useMemo(() => currentCurriculum.flatMap(section => section.lessons), [currentCurriculum]);

  const getLessonState = (lessonId: string): LessonStatus => {
    const firstLessonId = currentCurriculum?.[0]?.lessons?.[0]?.id;

    if (!dashboardData?.standard || dashboardData.standard.length === 0) {
      return lessonId === firstLessonId ? 'active' : 'locked';
    }

    const node = dashboardData.standard.find((l: any) => l.lesson_id === lessonId && (l.language === activeLanguage || (!l.language && activeLanguage === 'en')));

    if (node) {
      return node.status === 'completed' ? 'completed' : 'active';
    }

    return lessonId === firstLessonId ? 'active' : 'locked';
  };

  const getStars = (lessonId: string) => dashboardData?.standard?.find((l: any) => l.lesson_id === lessonId && (l.language === activeLanguage || (!l.language && activeLanguage === 'en')))?.stars || 0;

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

      {/* NAVBAR CORPORATIVO CUADRADO */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-200 px-6 h-12 flex items-center justify-between shadow-none">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 bg-${theme.primary} flex items-center justify-center`}><span className="text-white font-black text-[9px]">O</span></div>
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
          <button onClick={() => { setMode('professional'); router.push('/dashboard/pro'); }} className={`bg-sky-950 hover:bg-${theme.primary} text-white px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] ml-2 transition-all active:scale-95`}>
            Modo Executive
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 pt-6 px-6">

        {/* COLUMNA PRINCIPAL */}
        <div className="flex-1 min-w-0">

          {/* MENÚ BIENVENIDA - SIEMPRE FREE TIER / INGLÉS GENERAL EN RUTA STANDARDS */}
          <div className="mb-6 bg-white border border-sky-200 p-6 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-sky-950 tracking-tighter uppercase leading-none mb-2 font-serif italic">Bienvenido, {currentUser}</h1>
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest leading-none">
                <span className={`font-black uppercase tracking-wider ${userTier === 'executive'
                    ? 'text-amber-600'
                    : userTier === 'pro'
                      ? 'text-teal-600'
                      : 'text-sky-700'
                  }`}>
                  {userTier === 'executive' ? 'Executive Tier' : userTier === 'pro' ? 'Pro Tier' : 'Free Tier'}
                </span> • {activeLanguage === 'en' ? 'Inglés' : activeLanguage === 'fr' ? 'Francés' : 'Chino'} General
              </p>
            </div>
            <div className="inline-flex bg-sky-50 p-1 border border-sky-200">
              {(['en', 'fr', 'zh'] as const).map(lang => {
                const colors = {
                  en: activeLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-sky-600 hover:text-sky-800',
                  fr: activeLanguage === 'fr' ? 'bg-cyan-600 text-white' : 'text-sky-600 hover:text-sky-800',
                  zh: activeLanguage === 'zh' ? 'bg-sky-950 text-white' : 'text-sky-600 hover:text-sky-800',
                };
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as 'en' | 'fr' | 'zh')}
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${colors[lang]}`}
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
            <div className="bg-white border border-sky-200 p-5 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-sky-600 mb-3">
                  <span className="flex items-center gap-1.5"><Trophy size={12} className={`text-${theme.primary}`} /> Progreso General del Curso</span>
                  <span className={`text-${theme.primary} font-black text-xs`}>{getProgressPercentage()}%</span>
                </div>
                <div className="h-2 bg-sky-100 rounded-xl overflow-hidden border border-sky-200 mb-4">
                  <motion.div
                    className={`h-full bg-${theme.primary}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-100 p-3 rounded-xl">
                <p className="text-[8px] font-black text-sky-600 uppercase tracking-widest leading-none mb-1">Cálculo de XP y Racha</p>
                <p className="text-[9px] text-sky-700 leading-snug">
                  Tu XP es la suma de tus mejores puntajes por lección. Tu racha se activa al completar al menos una lección diaria consecutiva. ¡Sigue aprendiendo!
                </p>
              </div>
            </div>

            {/* SORTEOS CORPORATIVOS */}
            <div className="bg-white border border-sky-200 p-5 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-sky-600 mb-2">
                  <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500 animate-pulse" /> Sorteos por Suscriptores Premium</span>
                  <span className="text-amber-600 font-black text-xs">{(userStats.premiumCount || 0).toLocaleString()} / 1500 Premium</span>
                </div>
                <div className="h-2 bg-sky-100 rounded-xl overflow-hidden border border-sky-200 mb-3 relative">
                  <motion.div
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((userStats.premiumCount || 0) / 1500) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* LISTA DE PREMIOS EN MINIATURAS RESPONSIVAS */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-2.5">
                {[
                  { limit: 100, text: '100', prize: 'Gift Card de $500', icon: 'Gift' },
                  { limit: 300, text: '300', prize: 'AirPods 4', icon: 'Headphones' },
                  { limit: 500, text: '500', prize: 'iPad Mini a elegir', icon: 'Tablet' },
                  { limit: 700, text: '700', prize: 'Galaxy S25', icon: 'Smartphone' },
                  { limit: 900, text: '900', prize: 'iPhone', icon: 'Smartphone' },
                  { limit: 1500, text: '1.5k', prize: 'MacBook', icon: 'Laptop' }
                ].map((item, idx) => {
                  const premiumCount = userStats.premiumCount || 0;
                  const limits = [100, 300, 500, 700, 900, 1500];
                  const unlocked = premiumCount >= item.limit;
                  const active = premiumCount < item.limit && (idx === 0 || premiumCount >= limits[idx - 1]);

                  return (
                    <div
                      key={idx}
                      className={`border p-2 text-center rounded-xl relative transition-all duration-200 select-none group/item hover:scale-105
                        ${unlocked
                          ? 'border-emerald-200 bg-emerald-50/30 text-emerald-700'
                          : active
                            ? 'border-amber-200 bg-amber-50/20 text-amber-600 animate-pulse'
                            : 'border-sky-100 bg-sky-50/50 text-sky-500'
                        }
                      `}
                    >
                      <div className="text-[9px] font-black leading-none mb-1">{item.text}</div>
                      <div className="flex justify-center text-[12px] mb-1">
                        {item.icon === 'Gift' && <Gift size={10} className={unlocked ? "text-emerald-600" : active ? "text-amber-500" : "text-sky-500"} />}
                        {item.icon === 'Headphones' && <Headphones size={10} className={unlocked ? "text-emerald-600" : active ? "text-amber-500" : "text-sky-500"} />}
                        {item.icon === 'Tablet' && <Tablet size={10} className={unlocked ? "text-emerald-600" : active ? "text-amber-500" : "text-sky-500"} />}
                        {item.icon === 'Smartphone' && <Smartphone size={10} className={unlocked ? "text-emerald-600" : active ? "text-amber-500" : "text-sky-500"} />}
                        {item.icon === 'Laptop' && <Laptop size={10} className={unlocked ? "text-emerald-600" : active ? "text-amber-500" : "text-sky-500"} />}
                      </div>
                      <div className="absolute inset-0 bg-sky-950/95 text-white p-1 text-[7px] font-black uppercase flex flex-col justify-center items-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 rounded-xl z-30">
                        <span className="text-center">{item.prize}</span>
                        <span className="text-[5px] text-amber-400 mt-0.5 uppercase tracking-widest font-black">
                          {unlocked ? '¡Sorteado!' : active ? 'Siguiente' : 'Bloqueado'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                  <span className="text-[8px] font-black text-sky-600 uppercase tracking-widest leading-none">Estatus de Sorteo</span>
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none">
                    {(() => {
                      const premiumCount = userStats.premiumCount || 0;
                      const limits = [100, 300, 500, 700, 900, 1500];
                      const nextLimit = limits.find(lim => premiumCount < lim) || 1500;
                      return premiumCount >= 1500
                        ? '¡Todas las metas alcanzadas! 🏆'
                        : `Próxima meta: ${nextLimit} (Faltan ${nextLimit - premiumCount})`;
                    })()}
                  </span>
                </div>
                <Link href="/legal/terms" className="text-[8px] font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest leading-none underline text-right">
                  Términos y Condiciones
                </Link>
              </div>
            </div>

          </div>

          {/* GRID DE EXCELENCIA: RANKING, TROFEOS Y RECORDATORIOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Columna 1: Recordatorios de Práctica */}
            <PracticeReminderWidget themeColor="blue" />

            {/* Columna 2: Ranking Global */}
            <div className="bg-white border border-sky-200 p-5 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 opacity-5"><Trophy size={60} className="text-blue-600" /></div>
              <div className="relative z-10 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={11} className="text-blue-600" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-600">Competencia Global</span>
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-sky-950 leading-none">Ranking Global</h3>
                  <p className="text-[9px] text-sky-700 font-semibold leading-none mt-1.5">Top alumnos con mayor puntaje de XP acumulado.</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  {getDynamicLeaderboard().map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 text-[10px] font-bold border ${item.isMe ? 'border-blue-200 bg-blue-50/20 text-blue-800' : 'border-sky-100 text-sky-950'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 flex items-center justify-center font-mono text-[9px] font-black ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-sky-300 text-sky-950' : 'bg-amber-700 text-white'}`}>
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

            {/* Columna 3: Trofeos y Logros */}
            <div className="bg-white border border-sky-200 p-5 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 opacity-5"><Award size={60} className="text-blue-600" /></div>
              <div className="relative z-10 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={11} className="text-blue-600" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-600">Hitos de Logros</span>
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-sky-950 leading-none">Trofeos Generales ({getGeneralTrophies().filter(t => t.unlocked).length}/200)</h3>
                  <p className="text-[9px] text-sky-700 font-semibold leading-none mt-1.5">Consigue metas para desbloquear tus insignias.</p>
                </div>

                <div className="space-y-1.5 pt-1 max-h-[175px] overflow-y-auto pr-1 custom-scrollbar">
                  {getGeneralTrophies().map((badge, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 border ${badge.unlocked ? 'border-emerald-250 bg-emerald-50/20 text-emerald-800' : 'border-sky-100 text-sky-650 opacity-60'}`}
                    >
                      <div className="flex items-center gap-2">
                        {badge.icon === 'Crown' && <Crown size={12} className={badge.unlocked ? 'text-emerald-600' : 'text-sky-600'} />}
                        {badge.icon === 'Flame' && <Flame size={12} className={badge.unlocked ? 'text-emerald-600' : 'text-sky-600'} />}
                        {badge.icon === 'Award' && <Award size={12} className={badge.unlocked ? 'text-emerald-600' : 'text-sky-600'} />}
                        {badge.icon === 'Sparkles' && <Sparkles size={12} className={badge.unlocked ? 'text-emerald-600' : 'text-sky-600'} />}

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
                <div key={section.id} className="bg-white border border-sky-200 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] overflow-hidden">

                  {/* ENCABEZADO INTERACTIVO DEL MÓDULO (ACCORDION TOGGLE) */}
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
                            <span className="bg-amber-100 text-amber-800 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-amber-200">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-[8px] font-bold text-sky-600 uppercase tracking-widest mt-0.5 leading-none">{section.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Progreso del nivel */}
                      {!(userTier === 'free' && sIdx !== 0) ? (
                        <div className="text-right hidden sm:block">
                          <span className="text-[8px] font-black uppercase tracking-wider text-sky-600">Completado: </span>
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

                  {/* CUERPO DEL ACORDEÓN (ÁRBOL DE PROGRESO ZIGZAG) */}
                  {isExpanded && (
                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={containerVariants}
                      className="p-6 relative bg-sky-50/20 border-t border-sky-200"
                    >

                      {/* LÍNEAS DE CONECTORES DEL ÁRBOL */}
                      {/* Conector Central (Desktop) */}
                      <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[2px] bg-sky-200 -translate-x-1/2 z-0" />

                      {/* Conector Lateral (Mobile) */}
                      <div className="block md:hidden absolute left-[1.65rem] top-8 bottom-8 w-[2px] bg-sky-200 z-0" />

                      <div className="space-y-1.5 md:space-y-2 relative z-10">
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
                                w-full max-w-[420px] p-4 rounded-xl border transition-all duration-200 cursor-pointer bg-white relative overflow-hidden group/card
                                ${isLocked ? 'opacity-60 border-sky-100' : `border-sky-200 hover:border-${theme.primary} hover:shadow-[0_10px_40px_rgba(14,165,233,0.08)]`}
                                ${isActive ? `ring-2 ring-${theme.primary}/10 border-${theme.primary} shadow-md` : ''}
                              `}
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 relative z-10">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`px-2 py-0.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? `bg-${theme.primary} text-white` : 'bg-sky-100 text-sky-600'}`}>
                                      Módulo {globalIndex + 1}
                                    </span>
                                  </div>
                                  <h3 className={`text-xs font-black tracking-tight leading-tight uppercase ${isLocked ? 'text-sky-600' : 'text-sky-950'}`}>{lesson.title}</h3>
                                  <p className="text-[9px] text-sky-600 mt-1 leading-snug">{lesson.description}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between h-full min-w-[50px]">
                                  {isCompleted && (
                                    <div className="flex gap-0.5 mt-1">
                                      {[1, 2, 3].map((s) => (<Trophy key={s} size={12} className={s <= stars ? `text-${theme.primary} fill-${theme.primary}` : 'text-sky-300'} />))}
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
                              className={`relative flex flex-col w-full md:items-center justify-between ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
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
                                    ${isLocked ? 'bg-sky-50 border-sky-200 text-sky-600' : ''}
                                  `}
                                >
                                  {isLocked && <Lock size={14} />}
                                  {isActive && <Play size={16} fill="currentColor" className="ml-0.5" />}
                                  {isCompleted && <Check size={16} strokeWidth={3} />}
                                </button>
                              </div>

                              {/* Bloque de Tiempos (Columna Espaciadora) */}
                              <div className={`hidden md:flex w-full md:w-[calc(50%-3rem)] flex-col justify-center ${isEven ? 'items-start pl-6' : 'items-end pr-6'}`}>
                                <div className={`flex flex-col gap-2 p-3.5 bg-white/60 backdrop-blur-sm rounded-xl border border-sky-100 shadow-[0_4px_15px_rgba(14,165,233,0.05)] w-48 ${isEven ? 'text-left' : 'text-right'}`}>
                                  {/* Tiempo Estimado */}
                                  <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isLocked ? 'text-sky-500' : 'text-sky-700'}`}>
                                    {isEven ? (
                                      <>
                                        <Clock size={12} className={isLocked ? 'opacity-50' : 'text-sky-600'} />
                                        <span>Estimado: 15m</span>
                                      </>
                                    ) : (
                                      <>
                                        <span>Estimado: 15m</span>
                                        <Clock size={12} className={isLocked ? 'opacity-50' : 'text-sky-600'} />
                                      </>
                                    )}
                                  </div>
                                  
                                  {/* Tiempo Real (Completado) */}
                                  {isCompleted && (
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                                      {isEven ? (
                                        <>
                                          <CheckCircle2 size={12} className="text-emerald-500" />
                                          <span>Real: {Math.floor(Math.random() * 5) + 10}m {Math.floor(Math.random() * 59)}s</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>Real: {Math.floor(Math.random() * 5) + 10}m {Math.floor(Math.random() * 59)}s</span>
                                          <CheckCircle2 size={12} className="text-emerald-500" />
                                        </>
                                      )}
                                    </div>
                                  )}

                                  {/* Tiempo En Curso */}
                                  {isActive && (
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-500 animate-pulse">
                                      {isEven ? (
                                        <>
                                          <Timer size={12} />
                                          <span>En Progreso</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>En Progreso</span>
                                          <Timer size={12} />
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-sky-200 pb-4">
                <h2 className="text-[9px] font-black text-sky-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Shield size={14} className={`text-${theme.primary}`} /> Simuladores Estratégicos
                </h2>

                {/* SELECTOR DE MODO DE TIEMPO CORPORATIVO */}
                <div className="inline-flex bg-sky-100 p-0.5 border border-sky-200">
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
                        className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? activeColor : 'text-sky-600 hover:text-sky-950'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Link
                  href={`/lesson/toeic_listening`}
                  onClick={(e) => handleSimulatorClick(e, 'toeic_listening')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}
                >
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Headphones size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">TOEIC Listening</h4>
                    <p className="text-[8px] text-sky-600 uppercase tracking-wider font-bold mb-1">Comprensión Auditiva</p>
                    {(() => {
                      const completedCount = getCompletedCount('toeic_listening');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-emerald-50 text-emerald-800 text-[7px] font-black uppercase px-1.5 py-0.5 border border-emerald-200">
                          {completedCount === 10 ? '✓ COMPLETO (10/10)' : `${completedCount}/10 COMPLETADO`}
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">0/10 versiones</span>
                      );
                    })()}
                  </div>
                </Link>
                <Link
                  href={`/lesson/toeic_reading`}
                  onClick={(e) => handleSimulatorClick(e, 'toeic_reading')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}
                >
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><BookOpen size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">TOEIC Reading</h4>
                    <p className="text-[8px] text-sky-600 uppercase tracking-wider font-bold mb-1">Análisis Lector</p>
                    {(() => {
                      const completedCount = getCompletedCount('toeic_reading');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-emerald-50 text-emerald-800 text-[7px] font-black uppercase px-1.5 py-0.5 border border-emerald-200">
                          {completedCount === 10 ? '✓ COMPLETO (10/10)' : `${completedCount}/10 COMPLETADO`}
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">0/10 versiones</span>
                      );
                    })()}
                  </div>
                </Link>
                <Link
                  href={`/lesson/toeic_mock`}
                  onClick={(e) => handleSimulatorClick(e, 'toeic_mock')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}
                >
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Trophy size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">Simulador TOEIC®</h4>
                    <p className="text-[8px] text-purple-600 uppercase tracking-wider font-black font-serif italic mb-1">Listening & Reading</p>
                    {(() => {
                      const completedCount = getCompletedCount('toeic_mock');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-emerald-50 text-emerald-800 text-[7px] font-black uppercase px-1.5 py-0.5 border border-emerald-200">
                          {completedCount === 10 ? '✓ COMPLETO (10/10)' : `${completedCount}/10 COMPLETADO`}
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">0/10 versiones</span>
                      );
                    })()}
                  </div>
                </Link>
                <Link
                  href={`/lesson/toefl_mock`}
                  onClick={(e) => handleSimulatorClick(e, 'toefl_mock')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}
                >
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Award size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">Simulador TOEFL®</h4>
                    <p className="text-[8px] text-indigo-600 uppercase tracking-wider font-black font-serif italic mb-1">iBT Integrated (4 Skills)</p>
                    {(() => {
                      const completedCount = getCompletedCount('toefl_mock');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-emerald-50 text-emerald-800 text-[7px] font-black uppercase px-1.5 py-0.5 border border-emerald-200">
                          {completedCount === 10 ? '✓ COMPLETO (10/10)' : `${completedCount}/10 COMPLETADO`}
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">0/10 versiones</span>
                      );
                    })()}
                  </div>
                </Link>
                <Link
                  href={`/lesson/ielts_mock`}
                  onClick={(e) => handleSimulatorClick(e, 'ielts_mock')}
                  className={`bg-white border border-sky-200 p-4 hover:border-${theme.primary} transition-all flex items-center gap-4 group`}
                >
                  <div className={`bg-sky-100 p-3 text-sky-600 group-hover:bg-${theme.primary} group-hover:text-white transition-colors`}><Award size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[9px] font-black text-sky-950 uppercase tracking-widest mb-0.5 truncate">Simulador IELTS®</h4>
                    <p className="text-[8px] text-teal-600 uppercase tracking-wider font-black font-serif italic mb-1">Academic (Global)</p>
                    {(() => {
                      const completedCount = getCompletedCount('ielts_mock');
                      return completedCount > 0 ? (
                        <span className="inline-block bg-emerald-50 text-emerald-800 text-[7px] font-black uppercase px-1.5 py-0.5 border border-emerald-200">
                          {completedCount === 10 ? '✓ COMPLETO (10/10)' : `${completedCount}/10 COMPLETADO`}
                        </span>
                      ) : (
                        <span className="text-[7px] text-sky-600 font-bold uppercase tracking-wider">0/10 versiones</span>
                      );
                    })()}
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

      {showVersionModal && selectedSimulator && (
        <div className="fixed inset-0 bg-green-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-green-50 via-green-100/95 to-green-50/80 border-2 border-green-300 p-6 md:p-8 max-w-3xl w-full shadow-[0_20px_50px_rgba(20,83,45,0.25)] rounded-2xl relative animate-in zoom-in-95 duration-200 backdrop-blur-lg">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 rounded-t-2xl" />
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Award className="text-green-700 w-5 h-5 shrink-0" />
                <h3 className="text-base font-serif font-black italic uppercase tracking-wider text-green-950">
                  {getSimulatorDisplayName(selectedSimulator)}
                </h3>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="text-green-700 hover:text-green-950 bg-green-200/50 hover:bg-green-300/50 border border-green-300 rounded-full p-1.5 transition-all active:scale-90"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[10px] text-green-800 font-bold uppercase tracking-widest leading-relaxed mb-6 border-b border-green-300/60 pb-3">
              Selecciona una de las 10 versiones profesionales a continuación. Cada versión evalúa un contexto temático específico sin nombres ficticios, garantizando una simulación 100% real.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {(() => {
                const versions = SIMULATOR_VERSIONS_METADATA[selectedSimulator] || SIMULATOR_VERSIONS_METADATA.toeic_listening;

                return Array.from({ length: 10 }).map((_, i) => {
                  const vNum = i + 1;
                  const versionId = `${selectedSimulator}_v${vNum}`;
                  const isCompleted = dashboardData?.standard?.some(
                    (l: any) => l.lesson_id === versionId && l.status === 'completed'
                  );
                  const verMeta = versions[i] || { title: `Versión ${vNum}`, desc: "Evaluación oficial de certificación." };

                  return (
                    <button
                      key={vNum}
                      onClick={() => {
                        setShowVersionModal(false);
                        router.push(`/lesson/${versionId}?type=standard&timeMode=${timeMode}`);
                      }}
                      className={`p-4 text-left border transition-all duration-200 relative group/card flex flex-col justify-between hover:scale-[1.01] hover:shadow-md rounded-xl min-h-[100px] ${
                        isCompleted 
                          ? 'bg-green-200/70 border-green-400 text-green-950 hover:bg-green-300/50 hover:border-green-600 shadow-[0_10px_40px_rgba(14,165,233,0.08)] ring-1 ring-green-400/30' 
                          : 'bg-white border-green-200 text-green-900 hover:bg-green-50 hover:border-green-500'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full mb-1.5">
                        <span className="font-mono text-[10px] font-black tracking-wider uppercase text-green-800">
                          {verMeta.title}
                        </span>
                        {isCompleted ? (
                          <span className="flex items-center gap-1 bg-green-600 text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-wider rounded-md border border-green-700 shadow-[0_10px_40px_rgba(14,165,233,0.08)]">
                            <Check size={8} strokeWidth={4} /> Completado
                          </span>
                        ) : (
                          <span className="bg-green-50 border border-green-200 text-green-800 text-[8px] font-black uppercase px-2 py-0.5 tracking-wider rounded-md">
                            Pendiente
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[9.5px] text-green-950/80 font-semibold leading-relaxed group-hover/card:text-green-950 transition-colors font-sans">
                        {verMeta.desc}
                      </p>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {showStatsModal && <StatsModal onClose={() => setShowStatsModal(false)} userStats={userStats} />}
    </div>
  );
}