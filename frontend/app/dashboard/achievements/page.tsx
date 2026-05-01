'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import Cookies from 'js-cookie'; 
import { useUIStore } from '@/store/uiStore';
import { motion, Variants } from 'framer-motion';

import { 
  ArrowLeft, Trophy, Star, Zap, Flame, Target, 
  Crown, BookOpen, Brain, Shield, Award, Home, BookA, User, Briefcase, Loader2, Sparkles
} from 'lucide-react';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

// --- MAPA SEGURO DE COLORES TAILWIND ---
const COLOR_MAP: Record<string, { bg: string, text: string, ring: string, bar: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200', bar: 'bg-blue-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200', bar: 'bg-indigo-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-200', bar: 'bg-orange-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200', bar: 'bg-amber-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200', bar: 'bg-purple-500' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-300', bar: 'bg-slate-600' },
};

// 📱 BOTTOM NAV INTELIGENTE
const MobileBottomNav = ({ toggleProMode, mode }: { toggleProMode: () => void, mode: string }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#020617]/95 backdrop-blur-xl border-t border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] pb-safe">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>
      <Link href="/dashboard/vocabulary" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/vocabulary') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <BookA size={24} strokeWidth={isActive('/dashboard/vocabulary') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Vocab</span>
      </Link>
      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[#020617] cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-slate-800 shadow-slate-900/40 hover:-translate-y-1'}`}>
          <Crown size={28} fill="currentColor" />
        </div>
        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity ${isActive('/dashboard/chess') ? 'text-amber-500 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}>
          Ajedrez
        </span>
      </Link>
      <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/profile') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <User size={24} strokeWidth={isActive('/dashboard/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Perfil</span>
      </Link>
      <button onClick={toggleProMode} className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${mode === 'professional' ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <Briefcase size={24} strokeWidth={mode === 'professional' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Pro</span>
      </button>
    </div>
  );
};

export default function AchievementsPage() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalXP: 0, lessonsCompleted: 0, streak: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) return router.push('/login');

        const headers = { 
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json' 
        };

        const res = await fetch(`${API_URL}/api/v1/progress/stats`, { headers, cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalXP: data.total_xp || 0,
            lessonsCompleted: data.completed_lessons || Math.floor((data.total_xp || 0) / 150),
            streak: 5 
          });
        }
      } catch (error) {
        console.error("Error cargando logros:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  const toggleProMode = () => {
    setMode(mode === 'professional' ? 'student' : 'professional');
    router.push(mode === 'professional' ? '/dashboard' : '/dashboard/pro');
  };

  // --- LÓGICA DE MEDALLAS ---
  const BADGES = [
    { id: 'first_step', title: 'Primeros Pasos', desc: 'Completa tu primera lección', icon: Target, requirement: 1, current: stats.lessonsCompleted, color: 'blue' },
    { id: 'scholar', title: 'Erudito', desc: 'Completa 10 lecciones', icon: BookOpen, requirement: 10, current: stats.lessonsCompleted, color: 'indigo' },
    { id: 'on_fire', title: 'Imparable', desc: 'Alcanza una racha de 7 días', icon: Flame, requirement: 7, current: stats.streak, color: 'orange' },
    { id: 'xp_hunter', title: 'Cazador de XP', desc: 'Consigue 1,000 puntos de XP', icon: Zap, requirement: 1000, current: stats.totalXP, color: 'amber' },
    { id: 'tactician', title: 'Mente Brillante', desc: 'Acumula 5,000 puntos de XP', icon: Brain, requirement: 5000, current: stats.totalXP, color: 'purple' },
    { id: 'titanium', title: 'Élite Titanium', desc: 'Supera los 10,000 XP', icon: Crown, requirement: 10000, current: stats.totalXP, color: 'slate' },
  ];

  // --- CÁLCULO DEL RANGO ACTUAL ---
  const getRank = () => {
    if (stats.totalXP >= 10000) return { 
      name: 'Titanium', 
      icon: Crown, 
      badgeColor: 'text-slate-300',
      bgClass: 'bg-slate-950 text-white border border-slate-800 shadow-2xl shadow-slate-900/50',
      glow: 'bg-white/10'
    };
    if (stats.totalXP >= 5000) return { 
      name: 'Oro', 
      icon: Trophy, 
      badgeColor: 'text-amber-600',
      bgClass: 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400 text-amber-950 shadow-xl shadow-amber-500/20 border border-amber-300',
      glow: 'bg-white/40'
    };
    if (stats.totalXP >= 1000) return { 
      name: 'Plata', 
      icon: Shield, 
      badgeColor: 'text-slate-500',
      bgClass: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-slate-800 shadow-xl shadow-slate-400/20 border border-slate-300',
      glow: 'bg-white/50'
    };
    return { 
      name: 'Bronce', 
      icon: Award, 
      badgeColor: 'text-orange-700',
      bgClass: 'bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 text-orange-950 shadow-xl shadow-orange-500/20 border border-orange-300',
      glow: 'bg-white/50'
    };
  };

  const currentRank = getRank();

  // 🔥 SOLUCIÓN DE TYPESCRIPT AQUÍ 🔥
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Le decimos a TypeScript explícitamente qué esperar
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } as any // Evita el error de tipado estricto
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Sincronizando logros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER STICKY */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors duration-200 active:scale-95">
              <ArrowLeft size={22} strokeWidth={2.5} />
            </Link>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 text-slate-800">
              <div className="p-2 rounded-xl shadow-sm bg-indigo-50 text-indigo-600">
                <Trophy size={24} />
              </div>
              <span>Mis Logros</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* HERO: RANGO ACTUAL */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`mb-16 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${currentRank.bgClass}`}
        >
          {/* Brillo de fondo decorativo */}
          <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${currentRank.glow}`}></div>
          
          <div className="relative z-10 text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Sparkles size={16} className={currentRank.badgeColor} />
              <h2 className="text-[11px] font-black uppercase tracking-widest opacity-80">División Actual</h2>
            </div>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 drop-shadow-sm">{currentRank.name}</h3>
            <p className="font-medium opacity-80 max-w-md leading-relaxed text-sm md:text-base">
              Sigue completando lecciones corporativas y domina los retos para subir de división y desbloquear prestigio exclusivo en OnixLingo.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-md border border-white/20 text-center min-w-[220px] shadow-2xl transition-transform hover:scale-105 duration-300">
            <currentRank.icon size={64} className={`mx-auto mb-4 ${currentRank.badgeColor}`} />
            <div className="text-4xl font-black tracking-tight">{stats.totalXP.toLocaleString()}</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-2">Puntos de Experiencia</div>
          </div>
        </motion.div>

        {/* HEADER DE MEDALLAS */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Star className="text-amber-500" size={28} fill="currentColor" /> 
              Colección de Medallas
            </h3>
            <p className="text-slate-500 font-medium text-sm mt-2">
              El {Math.round((BADGES.filter(b => b.current >= b.requirement).length / BADGES.length) * 100)}% de tus trofeos están desbloqueados.
            </p>
          </div>
        </div>

        {/* GRID DE MEDALLAS CON STAGGER ANIMATION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {BADGES.map((badge) => {
            const isUnlocked = badge.current >= badge.requirement;
            const progress = Math.min(100, Math.round((badge.current / badge.requirement) * 100));
            const safeColors = COLOR_MAP[badge.color] || COLOR_MAP['blue'];

            return (
              <motion.div 
                key={badge.id}
                variants={itemVariants}
                whileHover={isUnlocked ? { y: -5, transition: { duration: 0.2 } as any } : {}} // <- Añadido as any por seguridad
                className={`
                  relative p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 overflow-hidden flex flex-col h-full
                  ${isUnlocked 
                    ? 'bg-white border-slate-100 shadow-xl shadow-slate-200/40' 
                    : 'bg-slate-50 border-slate-100 opacity-80 grayscale-[20%]'
                  }
                `}
              >
                {/* Ícono de la Medalla */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transition-colors duration-500
                    ${isUnlocked ? `${safeColors.bg} ${safeColors.text} ring-1 ${safeColors.ring}` : 'bg-slate-200 text-slate-400 ring-1 ring-slate-300'}
                  `}>
                    <badge.icon size={32} strokeWidth={isUnlocked ? 2.5 : 2} />
                  </div>
                  {isUnlocked && (
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-200 shadow-sm">
                      Desbloqueado
                    </span>
                  )}
                </div>

                {/* Textos */}
                <div className="mb-8 flex-1">
                  <h4 className={`text-xl font-black tracking-tight mb-2 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-xs md:text-sm font-medium text-slate-500 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>

                {/* Barra de Progreso Inferior */}
                <div className="mt-auto">
                  <div className="flex justify-between items-end text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <span>Progreso</span>
                    <span className={isUnlocked ? 'text-emerald-500 text-xs' : ''}>
                      {badge.current.toLocaleString()} / {badge.requirement.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative
                        ${isUnlocked ? 'bg-emerald-500' : safeColors.bar}
                      `} 
                      style={{ width: `${progress}%` }}
                    >
                      {/* Brillo interno de la barra si está desbloqueado */}
                      {isUnlocked && (
                        <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-r from-transparent to-white/30"></div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>

      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />
    </div>
  );
}