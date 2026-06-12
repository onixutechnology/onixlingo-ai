'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  ToggleLeft, 
  ToggleRight, 
  Sparkles, 
  Activity, 
  Zap, 
  Target, 
  Flame, 
  Crown,
  ChevronRight,
  Briefcase
} from 'lucide-react';



interface SidebarProps {
  userStats?: { xp: number; lessons: number; streak: number };
}

const LANGUAGE_COLORS: Record<string, { primary: string, secondary: string, accent: string }> = {
  en: { primary: 'blue-600', secondary: 'blue-50', accent: 'blue-700' },
  fr: { primary: 'cyan-500', secondary: 'cyan-50', accent: 'cyan-600' },
  zh: { primary: 'indigo-200', secondary: 'indigo-50', accent: 'indigo-300' },
};

export default function Sidebar({ userStats = { xp: 0, lessons: 0, streak: 0 } }: SidebarProps) {
  const { mode, setMode, activeLanguage } = useUIStore();
  const router = useRouter();
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const theme = LANGUAGE_COLORS[activeLanguage] || LANGUAGE_COLORS.en;
  const handleModeSwitch = () => {
    if (mode === 'student') {
      setMode('professional');
      router.push('/dashboard/pro');
    } else {
      setMode('student');
      router.push('/dashboard');
    }
  };

  return (
    <>
      {/* Botón Flotante Móvil */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-sky-950 text-slate-900 p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-sky-400 active:scale-95 transition-transform"
      >
        <Briefcase size={24} />
      </button>

      {/* Backdrop Móvil */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-sky-950/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        flex flex-col w-[300px] lg:w-80 gap-4 font-sans selection:bg-amber-100
        fixed lg:sticky top-0 lg:top-24 right-0 z-50 lg:z-auto h-[100dvh] lg:h-fit bg-sky-50 lg:bg-transparent px-4 lg:px-0 py-6 lg:py-0 overflow-y-auto lg:overflow-visible shadow-[0_0_40px_rgba(0,0,0,0.1)] lg:shadow-none transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Encabezado Móvil para el Menú */}
        <div className="lg:hidden flex items-center justify-between mb-2">
          <h3 className="font-black text-sky-950 uppercase tracking-widest text-xs">Menú Ejecutivo</h3>
          <button onClick={() => setIsMobileOpen(false)} className="p-2 text-sky-600 bg-sky-100 rounded-full">
            <span className="font-bold text-lg leading-none">&times;</span>
          </button>
        </div>
      
      {/* --- SELECTOR DE MODO CORPORATIVO (CUADRADO) --- */}
      <div className={`p-1.5 flex items-center gap-1.5 transition-all duration-300 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] border ${
        mode === 'professional' ? 'bg-white border-sky-200' : 'bg-white border-sky-200'
      }`}>
        <div className={`
          flex-1 flex items-center justify-center gap-2 px-2 py-3 rounded-none border border-transparent transition-all cursor-pointer group min-w-0
          ${mode === 'student' ? `bg-sky-200 border-sky-400 text-slate-900 shadow-none` : 'text-slate-900 hover:bg-sky-50 hover:border-sky-100'}
        `} onClick={handleModeSwitch}>
          <GraduationCap size={16} className={`shrink-0 ${mode === 'student' ? 'text-slate-900' : 'text-slate-900'}`} />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <p className={`text-[9px] font-black uppercase tracking-widest truncate w-full ${mode === 'student' ? 'text-slate-900' : 'text-slate-900'}`}>Estudiante</p>
            <p className={`text-[10px] font-black uppercase tracking-tight truncate w-full ${mode === 'student' ? 'text-slate-900' : 'text-slate-900'}`}>Módulos Base</p>
          </div>
          {mode === 'student' && <div className="w-1.5 h-1.5 bg-slate-900 shrink-0 ml-1"></div>}
        </div>

        <div className={`
          flex-1 flex items-center justify-center gap-2 px-2 py-3 rounded-none border border-transparent transition-all cursor-pointer group min-w-0
          ${mode === 'professional' ? 'bg-white border-slate-300 text-slate-900 shadow-none' : 'text-slate-900 hover:bg-sky-50 hover:border-sky-100'}
        `} onClick={handleModeSwitch}>
          <Briefcase size={16} className={`shrink-0 ${mode === 'professional' ? 'text-slate-900' : 'text-slate-900'}`} />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <p className={`text-[9px] font-black uppercase tracking-widest truncate w-full ${mode === 'professional' ? 'text-slate-900' : 'text-slate-900'}`}>Professional</p>
            <p className={`text-[10px] font-black uppercase tracking-tight truncate w-full ${mode === 'professional' ? 'text-slate-900' : 'text-slate-900'}`}>Exec Skills</p>
          </div>
          {mode === 'professional' && <div className="w-1.5 h-1.5 bg-slate-900 shrink-0 ml-1"></div>}
        </div>
      </div>


      {/* --- MÉTRICAS DE RENDIMIENTO (DENSIDAD ALTA) --- */}
      <div className="bg-white border border-sky-200 p-6 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] relative">
        <div className="flex items-center justify-between mb-6 border-b border-sky-100 pb-3">
          <h4 className="font-black text-slate-900 text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={14} className={`text-${theme.primary}`} /> Rendimiento
          </h4>
          <span className={`text-[8px] font-black text-${theme.primary} bg-${theme.primary}/5 px-2 py-0.5 uppercase`}>Sync Active</span>
        </div>
        
        <div className="space-y-3">
          {/* XP */}
          <div 
            onClick={() => setShowStatsModal(true)}
            className="flex items-center justify-between p-3 bg-sky-50 border border-sky-100 group hover:border-sky-200 hover:shadow-[0_10px_40px_rgba(14,165,233,0.08)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Zap size={16} className={`text-${theme.primary}`} />
              <div>
                <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest group-hover:text-slate-700 transition-colors">Experiencia Acumulada</p>
                <p className="text-sm font-black text-slate-900 tracking-tighter">{userStats.xp.toLocaleString()} <span className="text-[8px] text-slate-900 uppercase">XP</span></p>
              </div>
            </div>
            <ChevronRight size={14} className="text-sky-500 group-hover:text-sky-700 transition-colors" />
          </div>
          
          {/* STREAK */}
          <div 
            onClick={() => setShowStatsModal(true)}
            className="flex items-center justify-between p-3 bg-sky-50 border border-sky-100 group hover:border-[#D4AF37]/30 hover:shadow-[0_10px_40px_rgba(14,165,233,0.08)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Flame size={16} className="text-rose-500" />
              <div>
                <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest group-hover:text-slate-700 transition-colors">Consistencia (Streak)</p>
                <p className="text-sm font-black text-slate-900 tracking-tighter">{userStats.streak} <span className="text-[8px] text-slate-900 uppercase tracking-widest">Días Consecutivos</span></p>
              </div>
            </div>
            <ChevronRight size={14} className="text-sky-500 group-hover:text-sky-700 transition-colors" />
          </div>

          {/* PROGRESS */}
          <div className="flex items-center justify-between p-3 bg-sky-50 border border-sky-100 group hover:border-sky-200 transition-colors">
            <div className="flex items-center gap-3">
              <Target size={16} className={`text-${theme.primary}`} />
              <div>
                <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Módulos Completados</p>
                <p className="text-sm font-black text-slate-900 tracking-tighter">{userStats.lessons} <span className="text-[8px] text-slate-900 uppercase">/ 45 Módulos</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStatsModal && (
        <StatsModal 
          userStats={userStats} 
          onClose={() => setShowStatsModal(false)} 
        />
      )}
      </aside>
    </>
  );
}
