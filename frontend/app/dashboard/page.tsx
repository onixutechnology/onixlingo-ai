'use client';

/**
 * ==============================================================================
 * ONIXLINGO LMS DASHBOARD - STUDENT EDITION (UNIFIED MULTILANGUAGE)
 * ==============================================================================
 * RUTA: /dashboard/page.tsx
 * ESTADO: Production Ready (Track Selector, Bottom Nav Inteligente, Premium)
 * ==============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import Sidebar from '@/components/dashboard/sidebar';
import Cookies from 'js-cookie';
import { ServerAwakeLoader } from '@/components/ui/Server/ServerAwakeLoader';

// --- 📢 IMPORTACIÓN DE ANUNCIOS ---
import { AdBanner } from '@/components/ads/AdBanner';

import {
  LogOut, ChevronRight, Play, Lock, Check, Home,
  Trophy, Zap, Flame, Headphones, BookOpen, PenTool,
  Mic, Shield, LayoutGrid, User, Loader2, Briefcase,
  BookA, Crown, Languages, Sparkles
} from 'lucide-react';

import { CURRICULUM } from '@/data/curriculum';

// --- TIPOS ---
type LessonStatus = 'locked' | 'active' | 'completed';
type TrackType = 'en' | 'fr' | 'zh';

interface ThemeConfig {
  primary: string;
  bg: string;
  border: string;
  iconBg: string;
  accent: string;
  shadow: string;
  gradient: string;
}

const COLOR_VARIANTS: Record<string, { bg: string, text: string, hoverBorder: string, hoverShadow: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-emerald-100' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', hoverBorder: 'hover:border-blue-300', hoverShadow: 'hover:shadow-blue-100' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', hoverBorder: 'hover:border-orange-300', hoverShadow: 'hover:shadow-orange-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', hoverBorder: 'hover:border-purple-300', hoverShadow: 'hover:shadow-purple-100' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hoverBorder: 'hover:border-indigo-300', hoverShadow: 'hover:shadow-indigo-100' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', hoverBorder: 'hover:border-rose-300', hoverShadow: 'hover:shadow-rose-100' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', hoverBorder: 'hover:border-amber-300', hoverShadow: 'hover:shadow-amber-100' },
};

// --- HELPERS ---
const getProfessionalTheme = (colorName: string, status: LessonStatus): ThemeConfig => {
  if (status === 'locked') {
    return {
      primary: 'text-slate-400',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100',
      accent: 'bg-slate-300',
      shadow: 'shadow-none',
      gradient: 'from-slate-100 to-slate-50'
    };
  }

  const themes: Record<string, ThemeConfig> = {
    emerald: { primary: 'text-emerald-700', bg: 'bg-white', border: 'border-emerald-100', iconBg: 'bg-emerald-50', accent: 'bg-emerald-600', shadow: 'shadow-emerald-200/50', gradient: 'from-emerald-500 to-teal-600' },
    blue: { primary: 'text-blue-700', bg: 'bg-white', border: 'border-blue-100', iconBg: 'bg-blue-50', accent: 'bg-blue-600', shadow: 'shadow-blue-200/50', gradient: 'from-blue-600 to-indigo-600' },
    orange: { primary: 'text-orange-700', bg: 'bg-white', border: 'border-orange-100', iconBg: 'bg-orange-50', accent: 'bg-orange-600', shadow: 'shadow-orange-200/50', gradient: 'from-orange-500 to-red-500' },
    purple: { primary: 'text-purple-700', bg: 'bg-white', border: 'border-purple-100', iconBg: 'bg-purple-50', accent: 'bg-purple-600', shadow: 'shadow-purple-200/50', gradient: 'from-purple-600 to-violet-600' },
  };

  return themes[colorName] || themes['blue'];
};

const getLessonDescription = (title: string) => {
  if (title.includes("Hello")) return "Domina los saludos básicos, presentaciones formales y estructura inicial.";
  if (title.includes("Routine")) return "Aprende a describir tu día a día, horarios y hábitos frecuentes.";
  if (title.includes("Food")) return "Vocabulario esencial para restaurantes, ordenar comida y supermercado.";
  if (title.includes("Numbers")) return "Conteo, precios, fechas importantes y edades.";
  if (title.includes("Checkpoint")) return "Evaluación integral de conocimientos adquiridos en este nivel.";
  return "Lección fundamental para avanzar en tu dominio del idioma.";
};

// --- COMPONENTES UI ---
const HeaderStats = ({ xp, streak }: { xp: number, streak: number }) => (
  <div className="hidden md:flex items-center gap-4 bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 px-3 border-r border-slate-100">
      <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500">
        <Zap size={18} fill="currentColor" />
      </div>
      <div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Experiencia</p>
        <span className="text-sm font-black text-slate-800">{xp} XP</span>
      </div>
    </div>
    <div className="flex items-center gap-3 px-3">
      <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500">
        <Flame size={18} fill="currentColor" />
      </div>
      <div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Racha</p>
        <span className="text-sm font-black text-slate-800">{streak} Días</span>
      </div>
    </div>
  </div>
);

// 📱 BOTTOM NAV INTELIGENTE
const MobileBottomNav = ({ toggleProMode, mode }: { toggleProMode: () => void, mode: string }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>
      <Link href="/dashboard/vocabulary" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/vocabulary') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <BookA size={24} strokeWidth={isActive('/dashboard/vocabulary') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Vocab</span>
      </Link>
      
      {/* BOTÓN CENTRAL: AJEDREZ */}
      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-slate-900 shadow-slate-900/40 group-hover:bg-slate-800 group-hover:-translate-y-1'}`}>
          <Crown size={28} fill="currentColor" />
        </div>
        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity ${isActive('/dashboard/chess') ? 'text-amber-600 opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`}>
          Ajedrez
        </span>
      </Link>

      <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/profile') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <User size={24} strokeWidth={isActive('/dashboard/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Perfil</span>
      </Link>
      <button onClick={toggleProMode} className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${mode === 'professional' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <Briefcase size={24} strokeWidth={mode === 'professional' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Pro</span>
      </button>
    </div>
  );
};

const TimelineNode = ({ id, title, status, stars, index, isLast, color, onClick }: any) => {
  const theme = getProfessionalTheme(color, status);
  const description = getLessonDescription(title);
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS['blue'];

  return (
    <div className="relative flex group w-full mb-8">
      {!isLast && (
        <div className="absolute left-[2.2rem] md:left-[2.7rem] top-[5rem] bottom-[-2rem] w-[2px] bg-slate-200 z-0"></div>
      )}
      <div className="relative z-10 mr-4 md:mr-10 flex-shrink-0 pt-2">
        <button
          onClick={() => status !== 'locked' && onClick(id)}
          disabled={status === 'locked'}
          className={`
            w-16 h-16 md:w-20 md:h-20 rounded-[1.2rem] flex items-center justify-center border-0 transition-all duration-300 shadow-sm active:scale-95
            ${status === 'active' ? `bg-gradient-to-br ${theme.gradient} text-white shadow-xl shadow-indigo-500/20 scale-105 ring-4 ring-white z-20` : ''}
            ${status === 'completed' ? `bg-white border-2 ${theme.border} ${theme.primary}` : ''}
            ${status === 'locked' ? 'bg-slate-100 border-2 border-slate-200 text-slate-300' : ''}
          `}
        >
          {status === 'locked' && <Lock size={20} />}
          {status === 'active' && <Play size={28} fill="currentColor" className="ml-1" />}
          {status === 'completed' && <Check size={32} strokeWidth={3} />}
        </button>
      </div>

      <div
        onClick={() => status !== 'locked' && onClick(id)}
        className={`
          flex-1 p-5 md:p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden group/card
          ${status === 'locked'
            ? 'bg-transparent border-2 border-dashed border-slate-200 opacity-60 hover:opacity-80'
            : `bg-white border-slate-200 ${variant.hoverBorder} hover:shadow-xl ${variant.hoverShadow} hover:-translate-y-1`
          }
        `}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                Módulo {index + 1}
              </span>
              {status === 'active' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 animate-pulse uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> En Curso
                </span>
              )}
            </div>
            <h3 className={`text-lg md:text-xl font-bold leading-tight mb-1 ${status === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>
              {title}
            </h3>
            <p className={`text-xs md:text-sm leading-relaxed ${status === 'locked' ? 'text-slate-400' : 'text-slate-500'}`}>
              {description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {status === 'completed' && (
              <div className="flex gap-1 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-100">
                {[1, 2, 3].map((s) => (
                  <Trophy key={s} size={14} className={s <= stars ? 'text-amber-500 fill-amber-500' : 'text-amber-200'} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CertCard = ({ title, desc, icon: Icon, href, active = false, color }: any) => {
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS['indigo'];
  return (
    <Link href={href} className="block group h-full">
      <div className={`
        relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 h-full flex flex-col
        ${active
          ? 'bg-slate-900 border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1'
          : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1'
        }
      `}>
        <div className="flex items-start justify-between mb-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center shadow-sm 
            ${active ? `bg-${color}-500 text-white` : `${variant.bg} ${variant.text} group-hover:scale-110 transition-transform`}
          `}>
            <Icon size={24} strokeWidth={2} />
          </div>
          {active && (
            <span className="text-[9px] font-bold bg-indigo-500 text-white px-2 py-1 rounded-md uppercase tracking-widest">
              Sugerido
            </span>
          )}
        </div>
        <div className="mt-auto">
          <h4 className={`text-base md:text-lg font-bold mb-1 leading-tight ${active ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
          <p className={`text-xs leading-relaxed ${active ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
        </div>
      </div>
    </Link>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function DashboardPage() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userStats, setUserStats] = useState({ xp: 0, lessons: 0, streak: 0 });
  const [showChessLoader, setShowChessLoader] = useState(false);
  
  // 🔥 NUEVO ESTADO: CONTROL DE IDIOMA
  const [activeTrack, setActiveTrack] = useState<TrackType>('en');

  useEffect(() => {
    if (dashboardData) return;
    const timer = setTimeout(() => { setShowChessLoader(true); }, 3500);
    return () => clearTimeout(timer);
  }, [dashboardData]);

  useEffect(() => {
    if (mode === 'professional') {
      router.push('/dashboard/pro');
    }
  }, [mode, router]);

  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem('currentUser');
    const token = Cookies.get('access_token');
    setCurrentUser(user || 'Estudiante');

    if (token) {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';
      fetch(`${BASE_URL}/api/v1/progress/map`, {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', 
          'Pragma': 'no-cache'
        }
      })
      .then(res => {
        if (res.status === 401) { Cookies.remove('access_token'); router.push('/login'); throw new Error("Sesión expirada"); }
        if (!res.ok) throw new Error("Error auth o red");
        return res.json();
      })
      .then(data => {
        setDashboardData(data);
        const completedCount = data.standard?.filter((l: any) => l.status === 'completed').length || 0;
        setUserStats({ xp: data.total_xp || completedCount * 150, lessons: completedCount, streak: 5 });
      })
      .catch(err => {
        console.error("⚠️ Error sincronizando con Backend:", err);
        setDashboardData({ standard: [] }); 
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  const toggleProMode = () => {
    setMode('professional');
    router.push('/dashboard/pro');
  };

  const allLessonsFlat = useMemo(() => CURRICULUM.flatMap(section => section.lessons), []);

  const getLessonState = (lessonId: string): LessonStatus => {
    if (!isMounted) return 'locked';
    const firstLessonId = CURRICULUM[0]?.lessons[0]?.id;
    if (!dashboardData || !dashboardData.standard || dashboardData.standard.length === 0) {
      return lessonId === firstLessonId ? 'active' : 'locked';
    }
    const lessonNode = dashboardData.standard.find((l: any) => l.lesson_id === lessonId);
    if (lessonNode) {
      if (lessonNode.status === 'completed') return 'completed';
      if (lessonNode.status === 'active' || lessonNode.is_unlocked) return 'active';
    }
    if (lessonId === firstLessonId && !lessonNode) return 'active';
    return 'locked';
  };

  const getStars = (lessonId: string) => {
    if (!dashboardData || !dashboardData.standard) return 0;
    const lessonNode = dashboardData.standard.find((l: any) => l.lesson_id === lessonId);
    return lessonNode ? lessonNode.stars : 0;
  };

  const handleLessonClick = (id: string) => {
    router.push(`/lesson/${id}?type=standard`);
  };

  const handleLogout = () => {
    if(confirm("¿Cerrar sesión?")) {
      Cookies.remove('access_token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('onix_tier');
      localStorage.removeItem('onixlingo-ui-prefs');
      setMode('student');
      router.push('/login');
      router.refresh();
    }
  };

  const handleUnlockAll = async () => {
    if (!currentUser) return alert("Error: No hay usuario activo.");
    const token = Cookies.get('access_token');
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';
    try {
      const response = await fetch(`${BASE_URL}/api/v1/debug/unlock-all/${currentUser}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token || '' }
      });
      if (response.ok) {
        alert("🔓 MODO DIOS ACTIVADO.");
        window.location.reload();
      }
    } catch (error) {
      alert(`Error de conexión.`);
    }
  };

  if (isMounted && mode === 'professional') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-xl font-bold tracking-widest uppercase text-slate-400">Accediendo a OnixPro...</p>
      </div>
    );
  }

  if (!isMounted || !dashboardData) {
    if (showChessLoader) return <ServerAwakeLoader />;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Sincronizando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-32 lg:pb-0 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- NAVBAR OPTIMIZADA --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 h-20 flex items-center justify-between shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">OnixLingo</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Hub de Estudiante</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <HeaderStats xp={userStats.xp} streak={userStats.streak} />
          
          <div className="hidden lg:flex items-center gap-1 border-l border-slate-200 pl-4 ml-2">
            <Link href="/dashboard/vocabulary" className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-slate-200">
              <BookA size={16} /> <span className="text-xs font-bold">Vocab</span>
            </Link>
            <Link href="/dashboard/chess" className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-slate-200">
              <Crown size={16} /> <span className="text-xs font-bold">Ajedrez</span>
            </Link>
            <Link href="/dashboard/achievements" className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-slate-200">
              <Trophy size={16} /> <span className="text-xs font-bold">Logros</span>
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-slate-200">
              <User size={16} /> <span className="text-xs font-bold">Perfil</span>
            </Link>
          </div>

          <button onClick={toggleProMode} className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 ml-2">
            <Briefcase size={16} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Modo Pro</span>
          </button>

          {currentUser && (
            <div className="hidden md:flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm cursor-pointer ml-2 hover:bg-indigo-200 transition-colors" onClick={handleLogout} title="Cerrar Sesión">
              {currentUser.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 pt-8 md:pt-12 px-4 sm:px-8">
        
        <div className="flex-1 min-w-0">
          {/* --- HERO & TRACK SELECTOR --- */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              Bienvenido de vuelta, {currentUser || 'Estudiante'}
            </h1>
            <p className="text-sm md:text-base text-slate-500 mb-6">
              Selecciona el idioma que deseas estudiar hoy. Tu progreso se guarda automáticamente.
            </p>

            {/* 🔥 SELECTOR DE IDIOMAS (PILLS) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <button 
                onClick={() => setActiveTrack('en')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTrack === 'en' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                🇺🇸 Inglés <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] ml-1">Activo</span>
              </button>
              <button 
                onClick={() => setActiveTrack('fr')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTrack === 'fr' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                🇫🇷 Francés
              </button>
              <button 
                onClick={() => setActiveTrack('zh')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTrack === 'zh' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                🇨🇳 Chino Mandarín
              </button>
            </div>

            <div className="mt-4">
              <button onClick={handleUnlockAll} className="bg-white text-slate-400 text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-md border border-slate-200 hover:text-slate-600 transition-all">
                🛠 Dev: Desbloquear Todo
              </button>
            </div>
          </div>

          <AdBanner variant="horizontal" />

          {/* --- RENDERIZADO DINÁMICO DEL CURRICULUM --- */}
          <div className="space-y-12 md:space-y-16 mt-8">
            
            {activeTrack === 'en' && (
              CURRICULUM.map((section, sIdx) => {
                const safeColor = COLOR_VARIANTS[section.color] || COLOR_VARIANTS['blue'];
                return (
                  <div key={section.id} className="relative">
                    <div className="flex items-center gap-4 mb-6 border-b border-slate-200 pb-4">
                      <div className={`p-2.5 rounded-xl ${safeColor.bg} ${safeColor.text}`}>
                        <LayoutGrid size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{section.title}</h2>
                        <p className="text-xs text-slate-500 font-medium hidden md:block">{section.description}</p>
                      </div>
                    </div>
                    <div className="pl-0 md:pl-2">
                      {section.lessons.map((lesson, lIdx) => (
                        <TimelineNode
                          key={lesson.id}
                          id={lesson.id}
                          title={lesson.title}
                          status={getLessonState(lesson.id)}
                          stars={getStars(lesson.id)}
                          index={allLessonsFlat.findIndex(l => l.id === lesson.id)}
                          isLast={lIdx === section.lessons.length - 1}
                          color={section.color}
                          onClick={handleLessonClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}

            {/* ESTADO VACÍO PARA FRANCÉS Y CHINO */}
            {(activeTrack === 'fr' || activeTrack === 'zh') && (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                  <Languages size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Currículum en Sincronización</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Nuestros expertos lingüísticos están afinando el contenido de {activeTrack === 'fr' ? 'Francés' : 'Chino Mandarín'}. Este módulo estará disponible en la próxima actualización.
                </p>
                <button onClick={() => setActiveTrack('en')} className="bg-indigo-50 text-indigo-700 font-bold px-6 py-2 rounded-full text-sm hover:bg-indigo-100 transition-colors">
                  Volver a Inglés
                </button>
              </div>
            )}

          </div>

          {/* --- EXÁMENES Y CERTIFICACIONES --- */}
          <div className="mt-24 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Shield className="text-indigo-600" size={24} />
                  Simulador de Certificaciones
                </h2>
                <p className="text-xs text-slate-500">Prepárate para escenarios reales.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CertCard title="Listening Comprehension" desc="Audio y conversaciones reales." icon={Headphones} href="/lesson/toeic_listening" active={true} color="indigo" />
              <CertCard title="Reading Analysis" desc="Gramática y comprensión lectora." icon={BookOpen} href="/lesson/toeic_reading" color="emerald" />
              <CertCard title="Writing Proficiency" desc="Redacción de ensayos y correos." icon={PenTool} href="/lesson/toeic_writing" color="rose" />
              <CertCard title="Speaking Evaluation" desc="Pruebas de pronunciación." icon={Mic} href="/lesson/toeic_speaking" color="amber" />
            </div>
          </div>

        </div>

        {/* --- SIDEBAR LATERAL (ESCRITORIO) --- */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-28">
            <Sidebar userStats={userStats} />
          </div>
        </div>

      </div>

      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />
    </div>
  );
}
