'use client';

/**
 * ==============================================================================
 * ONIXLINGO LMS DASHBOARD - STUDENT EDITION (ULTRA PREMIUM)
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

// --- 📢 IMPORTACIÓN DE ANUNCIOS ---
import { AdBanner } from '@/components/ads/AdBanner';

import {
  LogOut, ChevronRight, Play, Lock, Check, Home,
  Trophy, Zap, Flame, Headphones, BookOpen, PenTool,
  Mic, Shield, LayoutGrid, User, Loader2, Briefcase,
  BookA, Crown, Languages, Sparkles, ShoppingBag, ArrowRight,
  FileText, ShieldCheck 
} from 'lucide-react';

import { CURRICULUM } from '@/data/curriculum';

type LessonStatus = 'locked' | 'active' | 'completed';

interface ThemeConfig {
  primary: string; bg: string; border: string; iconBg: string; accent: string; shadow: string; gradient: string; glow: string;
}

const COLOR_VARIANTS: Record<string, { bg: string, text: string, hoverBorder: string, hoverShadow: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-emerald-500/20' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', hoverBorder: 'hover:border-blue-300', hoverShadow: 'hover:shadow-blue-500/20' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', hoverBorder: 'hover:border-orange-300', hoverShadow: 'hover:shadow-orange-500/20' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', hoverBorder: 'hover:border-purple-300', hoverShadow: 'hover:shadow-purple-500/20' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hoverBorder: 'hover:border-indigo-300', hoverShadow: 'hover:shadow-indigo-500/20' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', hoverBorder: 'hover:border-rose-300', hoverShadow: 'hover:shadow-rose-500/20' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', hoverBorder: 'hover:border-amber-300', hoverShadow: 'hover:shadow-amber-500/20' },
};

const getProfessionalTheme = (colorName: string, status: LessonStatus): ThemeConfig => {
  if (status === 'locked') {
    return { primary: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', iconBg: 'bg-slate-100', accent: 'bg-slate-300', shadow: 'shadow-none', gradient: 'from-slate-100 to-slate-50', glow: '' };
  }
  const themes: Record<string, ThemeConfig> = {
    emerald: { primary: 'text-emerald-700', bg: 'bg-white', border: 'border-emerald-100', iconBg: 'bg-emerald-50', accent: 'bg-emerald-600', shadow: 'shadow-emerald-200/50', gradient: 'from-emerald-400 to-teal-500', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' },
    blue: { primary: 'text-blue-700', bg: 'bg-white', border: 'border-blue-100', iconBg: 'bg-blue-50', accent: 'bg-blue-600', shadow: 'shadow-blue-200/50', gradient: 'from-blue-500 to-indigo-500', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' },
    orange: { primary: 'text-orange-700', bg: 'bg-white', border: 'border-orange-100', iconBg: 'bg-orange-50', accent: 'bg-orange-600', shadow: 'shadow-orange-200/50', gradient: 'from-orange-400 to-red-500', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]' },
    purple: { primary: 'text-purple-700', bg: 'bg-white', border: 'border-purple-100', iconBg: 'bg-purple-50', accent: 'bg-purple-600', shadow: 'shadow-purple-200/50', gradient: 'from-purple-500 to-violet-600', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]' },
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

// 🛒 TARJETA NATIVA DE AFILIADOS DE AMAZON (Premium)
const AmazonAffiliateCard = () => (
  <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition-all duration-500 mt-12 mb-8 group overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>
    <div className="absolute top-0 right-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl shadow-md z-10">Sugerencia Pro</div>
    <div className="relative z-10 w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-indigo-100">
      <BookOpen size={36} strokeWidth={2} />
    </div>
    <h3 className="relative z-10 text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">English Grammar in Use</h3>
    <p className="relative z-10 text-slate-500 text-sm mb-8 max-w-sm leading-relaxed font-medium">
      La biblia de la gramática. El manual #1 recomendado a nivel mundial para saltar del nivel B1 al B2 con confianza.
    </p>
    <a 
      href="https://www.amazon.com/dp/1108457657" 
      target="_blank" 
      rel="noopener noreferrer"
      className="relative z-10 w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
    >
      <ShoppingBag size={18} /> Ver precio en Amazon
    </a>
  </div>
);

const HeaderStats = ({ xp, streak }: { xp: number, streak: number }) => (
  <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-slate-200/60 shadow-sm">
    <div className="flex items-center gap-3 px-4 border-r border-slate-200/60">
      <div className="p-1.5 bg-amber-50 rounded-xl text-amber-500 shadow-inner"><Zap size={16} fill="currentColor" /></div>
      <div><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">XP Total</p><span className="text-sm font-black text-slate-800 leading-none">{xp.toLocaleString()}</span></div>
    </div>
    <div className="flex items-center gap-3 px-4">
      <div className="p-1.5 bg-orange-50 rounded-xl text-orange-500 shadow-inner"><Flame size={16} fill="currentColor" /></div>
      <div><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Racha</p><span className="text-sm font-black text-slate-800 leading-none">{streak}</span></div>
    </div>
  </div>
);

const MobileBottomNav = ({ toggleProMode, mode }: { toggleProMode: () => void, mode: string }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}><Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} /><span className="text-[10px] font-bold">Inicio</span></Link>
      <Link href="/dashboard/vocabulary" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/vocabulary') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}><BookA size={24} strokeWidth={isActive('/dashboard/vocabulary') ? 2.5 : 2} /><span className="text-[10px] font-bold">Vocab</span></Link>
      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-slate-900 shadow-slate-900/40 group-hover:bg-slate-800 group-hover:-translate-y-1'}`}><Crown size={28} fill="currentColor" /></div>
        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity ${isActive('/dashboard/chess') ? 'text-amber-600 opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`}>Ajedrez</span>
      </Link>
      <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/profile') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}><User size={24} strokeWidth={isActive('/dashboard/profile') ? 2.5 : 2} /><span className="text-[10px] font-bold">Perfil</span></Link>
      <button onClick={toggleProMode} className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${mode === 'professional' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}><Briefcase size={24} strokeWidth={mode === 'professional' ? 2.5 : 2} /><span className="text-[10px] font-bold">Pro</span></button>
    </div>
  );
};

const TimelineNode = ({ id, title, status, stars, index, isLast, color, onClick }: any) => {
  const theme = getProfessionalTheme(color, status);
  const description = getLessonDescription(title);
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS['blue'];
  
  return (
    <div className="relative flex group w-full mb-8 lg:mb-10">
      {/* Línea conectora */}
      {!isLast && (
        <div className="absolute left-[2.2rem] md:left-[2.7rem] top-[5rem] bottom-[-2.5rem] w-1 bg-slate-200/60 z-0 rounded-full">
          {status === 'completed' && <div className={`w-full h-full bg-gradient-to-b ${theme.gradient} rounded-full`}></div>}
        </div>
      )}
      
      {/* Nodo Circular */}
      <div className="relative z-10 mr-4 md:mr-8 flex-shrink-0 pt-2">
        <button
          onClick={() => status !== 'locked' && onClick(id)}
          disabled={status === 'locked'}
          className={`
            w-16 h-16 md:w-[5.5rem] md:h-[5.5rem] rounded-[1.5rem] flex items-center justify-center border-0 transition-all duration-500 shadow-sm active:scale-95 relative
            ${status === 'active' ? `bg-gradient-to-br ${theme.gradient} text-white shadow-xl ${theme.glow} scale-110 z-20` : ''} 
            ${status === 'completed' ? `bg-white border-4 border-${color}-100 ${theme.primary} shadow-md` : ''} 
            ${status === 'locked' ? 'bg-slate-100 border-2 border-slate-200 text-slate-300' : ''}
          `}
        >
          {status === 'active' && <div className="absolute inset-0 rounded-[1.5rem] bg-white opacity-20 animate-ping"></div>}
          <div className="relative z-10">
            {status === 'locked' && <Lock size={22} strokeWidth={2.5} />}
            {status === 'active' && <Play size={30} fill="currentColor" className="ml-1 drop-shadow-md" />}
            {status === 'completed' && <Check size={34} strokeWidth={3} />}
          </div>
        </button>
      </div>

      {/* Tarjeta de Contenido */}
      <div onClick={() => status !== 'locked' && onClick(id)} className={`
        flex-1 p-6 md:p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden group/card
        ${status === 'locked' 
          ? 'bg-transparent border-2 border-dashed border-slate-200 opacity-60 hover:opacity-100 hover:bg-slate-50' 
          : `bg-white/80 backdrop-blur-md border-slate-200 ${variant.hoverBorder} hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1`
        }
        ${status === 'active' ? 'ring-2 ring-indigo-500/20 shadow-lg' : ''}
      `}>
        {/* Glow de fondo en hover */}
        {status !== 'locked' && (
          <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full opacity-0 group-hover/card:opacity-[0.03] transition-all duration-500 z-0 pointer-events-none ${variant.bg} group-hover/card:scale-150`} />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${status === 'active' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                Módulo {index + 1}
              </span>
              {status === 'active' && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span> En Curso
                </span>
              )}
            </div>
            <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight mb-2 ${status === 'locked' ? 'text-slate-400' : 'text-slate-800 group-hover/card:text-indigo-950 transition-colors'}`}>{title}</h3>
            <p className={`text-sm leading-relaxed font-medium ${status === 'locked' ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
          </div>
          
          <div className="flex flex-col items-end justify-between h-full min-w-[80px]">
            {status === 'completed' && (
              <div className="flex gap-1 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 shadow-inner">
                {[1, 2, 3].map((s) => (<Trophy key={s} size={16} className={s <= stars ? 'text-amber-500 fill-amber-500 drop-shadow-sm' : 'text-amber-200'} />))}
              </div>
            )}
            {status === 'active' && (
              <div className="mt-4 sm:mt-0 w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover/card:bg-indigo-50 group-hover/card:text-indigo-600 transition-colors">
                <ArrowRight size={20} strokeWidth={2.5} />
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
      <div className={`relative overflow-hidden rounded-[2rem] border p-8 transition-all duration-500 h-full flex flex-col ${active ? 'bg-slate-900 border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2' : 'bg-white/80 backdrop-blur-md border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-2'}`}>
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-white/10 ${active ? `bg-gradient-to-br from-indigo-500 to-violet-600 text-white` : `${variant.bg} ${variant.text} group-hover:scale-110 transition-transform duration-500`}`}><Icon size={28} strokeWidth={2} /></div>
          {active && (<span className="text-[10px] font-black bg-white/10 text-white border border-white/20 px-3 py-1.5 rounded-lg uppercase tracking-widest backdrop-blur-sm">Sugerido</span>)}
        </div>
        <div className="mt-auto relative z-10">
          <h4 className={`text-lg md:text-xl font-black mb-2 tracking-tight ${active ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
          <p className={`text-sm font-medium leading-relaxed ${active ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
        </div>
      </div>
    </Link>
  );
};

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
};

// --- PÁGINA PRINCIPAL ---
export default function DashboardPage() {
  const router = useRouter();
  const { mode, setMode, activeLanguage, setLanguage, resetUI } = useUIStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userStats, setUserStats] = useState({ xp: 0, lessons: 0, streak: 0 });
  const [showChessLoader, setShowChessLoader] = useState(false);

  // 🔥 ESTADOS PARA ADS Y PAGOS
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [managingPlan, setManagingPlan] = useState(false);

  // 🔴 AQUÍ PONEMOS EL PRICE ID DE PADDLE. 
  // Usa el tuyo real: 'pri_01kqnrreqy5gas36g57ca2fazn'
  const PADDLE_PRICE_ID = 'pri_01kqnrreqy5gas36g57ca2fazn'; 

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
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
      const headers = {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      Promise.all([
        fetch(`${BASE_URL}/api/v1/progress/map`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${BASE_URL}/api/v1/progress/stats`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${BASE_URL}/api/v1/users/me`, { headers }).catch(() => null)
      ])
      .then(async ([mapRes, statsRes, userRes]) => {
        if (mapRes?.status === 401) { Cookies.remove('access_token'); router.push('/login'); throw new Error("Sesión expirada"); }
        
        let mapData = { standard: [] };
        let statsData = { total_xp: 0, streak: 0 };
        let userData = { is_pro: false, tier: 'free' };

        if (mapRes && mapRes.ok) mapData = await mapRes.json();
        if (statsRes && statsRes.ok) statsData = await statsRes.json();
        if (userRes && userRes.ok) userData = await userRes.json();

        setDashboardData(mapData);
        
        const completedCount = mapData.standard?.filter((l: any) => l.status === 'completed').length || 0;
        
        setUserStats({ 
          xp: statsData.total_xp || completedCount * 150, 
          lessons: completedCount, 
          streak: statsData.streak || 0
        });

        setIsUserPremium(userData.is_pro || userData.tier === 'titanium');
      })
      .catch(err => {
        console.error("⚠️ Error sincronizando dashboard:", err);
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
      resetUI(); 
      localStorage.removeItem('onixlingo-ui-prefs');
      router.push('/login');
      router.refresh();
    }
  };

  // 🔥 NUEVA LÓGICA DE PADDLE PARA ABRIR EL CHECKOUT
  const handleUpgradeToPro = () => {
    setManagingPlan(true);
    
    try {
      const paddle = (window as any).Paddle;
      
      if (paddle) {
        // Obtenemos el correo del usuario si está disponible para auto-rellenarlo
        const email = localStorage.getItem('currentUserEmail') || '';
        
        paddle.Checkout.open({
          items: [
            {
              priceId: PADDLE_PRICE_ID,
              quantity: 1
            }
          ],
          customer: {
            email: email
          },
          // Custom data opcional para que tu backend sepa a qué usuario asignarle el pro
          customData: {
            internal_user_id: currentUser // Puedes mandar más datos útiles aquí
          }
        });
      } else {
        console.error("Paddle no está inicializado.");
        alert("El sistema de pagos se está cargando, por favor intenta en unos segundos.");
      }
    } catch (error) {
      console.error("Error abriendo checkout de Paddle:", error);
    } finally {
      // Damos un pequeño delay antes de quitar el estado de carga
      setTimeout(() => setManagingPlan(false), 1000);
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
        <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase animate-pulse">Sincronizando identidad...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-32 lg:pb-0 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      
      {/* DECORACIÓN DE FONDO PREMIUM */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 px-4 md:px-8 h-20 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-100">
            <span className="text-white font-black text-xl">O</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-slate-900 text-lg leading-tight tracking-tight">OnixLingo</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hub de Estudiante</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <HeaderStats xp={userStats.xp} streak={userStats.streak} />
          <div className="hidden lg:flex items-center gap-1 border-l border-slate-200/60 pl-4 ml-2">
            <Link href="/dashboard/vocabulary" className="flex items-center gap-2 bg-transparent hover:bg-slate-100 text-slate-600 px-3 py-2 rounded-xl transition-all"><BookA size={16} strokeWidth={2.5} /> <span className="text-xs font-bold">Vocab</span></Link>
            <Link href="/dashboard/chess" className="flex items-center gap-2 bg-transparent hover:bg-slate-100 text-slate-600 px-3 py-2 rounded-xl transition-all"><Crown size={16} strokeWidth={2.5} /> <span className="text-xs font-bold">Ajedrez</span></Link>
            <Link href="/dashboard/achievements" className="flex items-center gap-2 bg-transparent hover:bg-slate-100 text-slate-600 px-3 py-2 rounded-xl transition-all"><Trophy size={16} strokeWidth={2.5} /> <span className="text-xs font-bold">Logros</span></Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2 bg-transparent hover:bg-slate-100 text-slate-600 px-3 py-2 rounded-xl transition-all"><User size={16} strokeWidth={2.5} /> <span className="text-xs font-bold">Perfil</span></Link>
          </div>
          <button onClick={toggleProMode} className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-[1rem] transition-all shadow-xl shadow-slate-900/20 active:scale-95 ml-2 border border-slate-800">
            <Briefcase size={16} className="text-amber-400" strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Modo Pro</span>
          </button>
          {currentUser && (
            <div className="hidden md:flex items-center justify-center w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl font-black text-sm cursor-pointer ml-2 hover:bg-indigo-100 transition-colors border border-indigo-100" onClick={handleLogout} title="Cerrar Sesión">
              {currentUser.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 pt-8 md:pt-12 px-4 sm:px-8 relative z-10">
        
        <div className="flex-1 min-w-0">
          {/* --- HERO & TRACK SELECTOR PREMIUM --- */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={20} className="text-amber-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Panel Principal</h3>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Bienvenido, {currentUser || 'Estudiante'}</h1>
            <p className="text-base md:text-lg text-slate-500 mb-8 font-medium max-w-2xl">Selecciona tu enfoque lingüístico de hoy. El currículum se adaptará a tu nivel y guardará tu progreso en la nube.</p>

            <div className="inline-flex bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-slate-200 shadow-sm overflow-x-auto hide-scrollbar max-w-full">
              <div className="flex items-center gap-2 w-max">
                <button onClick={() => setLanguage('en')} className={`flex items-center gap-2.5 px-6 py-3.5 rounded-[1.5rem] text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeLanguage === 'en' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'}`}>🇺🇸 Inglés {activeLanguage === 'en' && <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-widest ml-1 border border-white/20">Activo</span>}</button>
                <button onClick={() => setLanguage('fr')} className={`flex items-center gap-2.5 px-6 py-3.5 rounded-[1.5rem] text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeLanguage === 'fr' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'}`}>🇫🇷 Francés {activeLanguage === 'fr' && <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-widest ml-1 border border-white/20">Activo</span>}</button>
                <button onClick={() => setLanguage('zh')} className={`flex items-center gap-2.5 px-6 py-3.5 rounded-[1.5rem] text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeLanguage === 'zh' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'}`}>🇨🇳 Chino Mandarín {activeLanguage === 'zh' && <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-widest ml-1 border border-white/20">Activo</span>}</button>
              </div>
            </div>
          </div>

          {/* 🔥 LÓGICA DE MONETIZACIÓN: ADS SOLO PARA USUARIOS FREE */}
          {!isUserPremium && (
            <div className="flex flex-col items-center w-full mb-10 bg-white/40 p-4 rounded-[2rem] border border-slate-200/50 backdrop-blur-sm">
              <AdBanner variant="horizontal" />
            </div>
          )}

          {/* --- RENDERIZADO DINÁMICO DEL CURRICULUM CON ANIMACIONES --- */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-12 md:space-y-16 mt-8"
          >
            {activeLanguage === 'en' && (
              CURRICULUM.map((section, sIdx) => {
                const safeColor = COLOR_VARIANTS[section.color] || COLOR_VARIANTS['blue'];
                return (
                  <div key={section.id} className="relative">
                    <div className="flex items-center gap-5 mb-8 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className={`p-4 rounded-[1.2rem] shadow-inner ${safeColor.bg} ${safeColor.text} ring-1 ring-white`}><LayoutGrid size={24} strokeWidth={2.5} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1.5">{section.title}</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest hidden md:block">{section.description}</p>
                      </div>
                    </div>
                    <div className="pl-0 md:pl-4">
                      {section.lessons.map((lesson, lIdx) => (
                        <motion.div variants={itemVariants} key={lesson.id}>
                          <TimelineNode 
                            id={lesson.id} 
                            title={lesson.title} 
                            status={getLessonState(lesson.id)} 
                            stars={getStars(lesson.id)} 
                            index={allLessonsFlat.findIndex(l => l.id === lesson.id)} 
                            isLast={lIdx === section.lessons.length - 1} 
                            color={section.color} 
                            onClick={handleLessonClick} 
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}

            {(activeLanguage === 'fr' || activeLanguage === 'zh') && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center shadow-xl shadow-slate-200/50">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-[2rem] flex items-center justify-center mb-6 ring-4 ring-indigo-500/10 shadow-inner"><Languages size={40} strokeWidth={2} /></div>
                <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Currículum en Sincronización</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg font-medium">Nuestros expertos lingüísticos están afinando el contenido corporativo de {activeLanguage === 'fr' ? 'Francés' : 'Chino Mandarín'}.</p>
                <button onClick={() => setLanguage('en')} className="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20">Volver a Inglés</button>
              </motion.div>
            )}
          </motion.div>

          {/* 🔥 LÓGICA DE MONETIZACIÓN: ADS DE AMAZON SOLO PARA USUARIOS FREE */}
          {!isUserPremium && (
            <div className="flex flex-col items-center w-full mt-16">
              <AmazonAffiliateCard />
              <button 
                onClick={handleUpgradeToPro} 
                disabled={managingPlan}
                className="mt-6 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
              >
                {managingPlan ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                {managingPlan ? 'Abriendo pago...' : 'Eliminar anuncios con Titanium Pro'}
              </button>
            </div>
          )}

          {/* --- EXÁMENES Y CERTIFICACIONES PREMIUM --- */}
          <div className="mt-20 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3 mb-2 tracking-tight">
                  <Shield className="text-indigo-600" size={28} strokeWidth={2.5} /> Simulador de Certificaciones
                </h2>
                <p className="text-sm text-slate-500 font-medium">Prepárate para escenarios reales y certificaciones internacionales.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <CertCard title="Listening Comprehension" desc="Audio y conversaciones reales de negocios." icon={Headphones} href="/lesson/toeic_listening" active={true} color="indigo" />
              <CertCard title="Reading Analysis" desc="Gramática y comprensión lectora técnica." icon={BookOpen} href="/lesson/toeic_reading" color="emerald" />
              <CertCard title="Writing Proficiency" desc="Redacción de ensayos y correos formales." icon={PenTool} href="/lesson/toeic_writing" color="rose" />
              <CertCard title="Speaking Evaluation" desc="Pruebas de pronunciación con IA." icon={Mic} href="/lesson/toeic_speaking" color="amber" />
            </div>
          </div>

          {/* --- FOOTER LEGAL PREMIUM --- */}
          <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-500 pb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 font-black shadow-sm border border-slate-200">O</div>
              <span className="text-sm font-bold tracking-tight">© {new Date().getFullYear()} Onixu Technology</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-bold">
              <Link href="/legal" className="flex items-center gap-2 hover:text-indigo-600 transition-colors bg-white/50 px-4 py-2 rounded-xl border border-slate-200/50 hover:bg-white hover:shadow-sm">
                <FileText size={16} /> Términos y Privacidad
              </Link>
            </div>
          </div>

        </div>

        {/* SIDEBAR DERECHO */}
        <div className="hidden lg:block w-[22rem] flex-shrink-0">
          <div className="sticky top-28">
            <Sidebar userStats={userStats} />
          </div>
        </div>

      </div>

      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />
    </div>
  );
}