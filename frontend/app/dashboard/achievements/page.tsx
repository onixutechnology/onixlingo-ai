'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import Cookies from 'js-cookie'; 
import { useUIStore } from '@/store/uiStore';
import { motion } from 'framer-motion';

import { 
  ArrowLeft, Trophy, Star, Zap, Flame, Target, 
  Crown, BookOpen, Brain, Shield, Award, Home, BookA, User, Briefcase, Loader2
} from 'lucide-react';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

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
      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-emerald-600 shadow-emerald-500/40 hover:-translate-y-1'}`}>
          <Crown size={28} fill="currentColor" />
        </div>
        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity ${isActive('/dashboard/chess') ? 'text-amber-600 opacity-100' : 'text-emerald-600 opacity-0 group-hover:opacity-100'}`}>
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
          // Ajustamos variables con fallbacks para evitar errores
          setStats({
            totalXP: data.total_xp || 0,
            lessonsCompleted: data.completed_lessons || Math.floor((data.total_xp || 0) / 150),
            streak: 5 // Dato temporal hasta que se implemente la racha en el backend
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

  // Cálculo del Rango Actual
  const getRank = () => {
    if (stats.totalXP >= 10000) return { name: 'Titanium', icon: Crown, color: 'text-slate-800 bg-gradient-to-r from-slate-200 to-slate-400' };
    if (stats.totalXP >= 5000) return { name: 'Oro', icon: Trophy, color: 'text-amber-900 bg-gradient-to-r from-amber-200 to-amber-500' };
    if (stats.totalXP >= 1000) return { name: 'Plata', icon: Shield, color: 'text-slate-800 bg-gradient-to-r from-slate-100 to-slate-300' };
    return { name: 'Bronce', icon: Award, color: 'text-orange-950 bg-gradient-to-r from-orange-200 to-orange-400' };
  };

  const currentRank = getRank();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-400 font-bold text-sm animate-pulse">Cargando trofeos...</p>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-12 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${currentRank.color}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Liga Actual</h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">{currentRank.name}</h3>
            <p className="font-bold opacity-80 max-w-sm">
              Sigue completando lecciones y retos para subir de división y desbloquear beneficios exclusivos.
            </p>
          </div>

          <div className="relative z-10 bg-white/20 p-6 rounded-3xl backdrop-blur-sm border border-white/30 text-center min-w-[200px] shadow-xl">
            <currentRank.icon size={64} className="mx-auto mb-4 opacity-90" />
            <div className="text-3xl font-black tracking-tight">{stats.totalXP.toLocaleString()}</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Total XP</div>
          </div>
        </motion.div>

        {/* GRID DE MEDALLAS */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Star className="text-amber-500" size={24} fill="currentColor" /> 
            Colección de Medallas
          </h3>
          <p className="text-slate-500 font-medium text-sm mt-1">Completa los requisitos para iluminar tus trofeos.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGES.map((badge, idx) => {
            const isUnlocked = badge.current >= badge.requirement;
            const progress = Math.min(100, Math.round((badge.current / badge.requirement) * 100));

            return (
              <motion.div 
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`
                  relative p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden
                  ${isUnlocked ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-1' : 'bg-slate-50 border-slate-100 opacity-70'}
                `}
              >
                {/* Ícono de la Medalla */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner
                    ${isUnlocked ? `bg-${badge.color}-50 text-${badge.color}-600 ring-1 ring-${badge.color}-200` : 'bg-slate-200 text-slate-400'}
                  `}>
                    <badge.icon size={32} strokeWidth={isUnlocked ? 2.5 : 2} />
                  </div>
                  {isUnlocked && (
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Desbloqueado
                    </span>
                  )}
                </div>

                {/* Textos */}
                <div>
                  <h4 className={`text-lg font-black tracking-tight mb-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mb-6 h-8">
                    {badge.desc}
                  </p>
                </div>

                {/* Barra de Progreso Inferior */}
                <div className="mt-auto">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Progreso</span>
                    <span className={isUnlocked ? 'text-emerald-500' : ''}>{badge.current} / {badge.requirement}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500' : 'bg-indigo-400'}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />
    </div>
  );
}
