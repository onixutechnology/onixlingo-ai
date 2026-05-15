'use client';

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

// --- 📢 1. IMPORTAMOS EL ANUNCIO INTELIGENTE ---
import { AdBanner } from '@/components/ads/AdBanner';

interface SidebarProps {
  userStats?: { xp: number; lessons: number; streak: number };
}

const LANGUAGE_COLORS: Record<string, { primary: string, secondary: string, accent: string }> = {
  en: { primary: 'blue-600', secondary: 'blue-50', accent: 'blue-700' },
  fr: { primary: 'cyan-500', secondary: 'cyan-50', accent: 'cyan-600' },
  zh: { primary: 'indigo-800', secondary: 'indigo-50', accent: 'indigo-900' },
};

export default function Sidebar({ userStats = { xp: 0, lessons: 0, streak: 0 } }: SidebarProps) {
  const { mode, setMode, activeLanguage } = useUIStore();
  const router = useRouter();

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
    <aside className="flex flex-col w-full lg:w-80 gap-4 lg:sticky lg:top-24 self-start h-fit pb-20 lg:pb-0 font-sans selection:bg-amber-100">
      
      {/* --- SELECTOR DE MODO CORPORATIVO (CUADRADO) --- */}
      <div className={`border p-4 flex items-center justify-between transition-all duration-300 rounded-none shadow-sm ${
        mode === 'professional' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className={`
          flex items-center gap-3 px-4 py-3 rounded-none border border-transparent transition-all cursor-pointer group
          ${mode === 'student' ? `bg-${theme.primary} border-${theme.accent} text-white shadow-md` : 'text-slate-400 hover:bg-slate-50 hover:border-slate-100'}
        `} onClick={handleModeSwitch}>
          <GraduationCap size={18} className={mode === 'student' ? 'text-white' : 'text-slate-400'} />
          <div className="flex-1">
            <p className={`text-[10px] font-black uppercase tracking-widest ${mode === 'student' ? 'opacity-80' : 'text-slate-400'}`}>Estudiante</p>
            <p className={`text-xs font-black uppercase tracking-tight ${mode === 'student' ? 'text-white' : 'text-slate-600'}`}>Módulos Base</p>
          </div>
          {mode === 'student' && <div className="w-1.5 h-1.5 bg-white"></div>}
        </div>

        <div className={`
          flex items-center gap-3 px-4 py-3 rounded-none border border-transparent transition-all cursor-pointer group
          ${mode === 'professional' ? 'bg-amber-600 border-amber-700 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50 hover:border-slate-100'}
        `} onClick={handleModeSwitch}>
          <Briefcase size={18} className={mode === 'professional' ? 'text-white' : 'text-slate-400'} />
          <div className="flex-1">
            <p className={`text-[10px] font-black uppercase tracking-widest ${mode === 'professional' ? 'text-amber-100' : 'text-slate-400'}`}>Professional</p>
            <p className={`text-xs font-black uppercase tracking-tight ${mode === 'professional' ? 'text-white' : 'text-slate-600'}`}>Executive Skills</p>
          </div>
          {mode === 'professional' && <div className="w-1.5 h-1.5 bg-white"></div>}
        </div>
      </div>

      {/* --- BOTONES DE ACCIÓN --- */}
      <div className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
        <Link href="/dashboard" className={`flex items-center justify-between px-4 py-3 text-slate-500 hover:bg-slate-50 border-l-2 border-transparent hover:border-${theme.primary} group transition-all`}>
          <div className="flex items-center gap-3">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard Central</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link href="/dashboard/vocabulary" className={`flex items-center justify-between px-4 py-3 text-slate-500 hover:bg-slate-50 border-l-2 border-transparent hover:border-${theme.primary} group transition-all`}>
          <div className="flex items-center gap-3">
            <Target size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Glosario Corporativo</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>
      </div>

      {/* --- IA WIDGET (SQUARE) --- */}
      <div className="mt-auto mb-6 px-4">
        <div className={`bg-slate-900 p-4 border-l-4 border-${theme.primary} rounded-none shadow-xl relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-1 opacity-20"><Sparkles size={40} className={`text-${theme.primary}`} /></div>
          <p className={`text-[8px] font-black text-${theme.primary} uppercase tracking-[0.3em] mb-2 flex items-center gap-2`}>
            <span className={`w-1.5 h-1.5 bg-${theme.primary} animate-pulse`}></span> Neural Advisor Active
          </p>
          <p className="text-white text-[10px] font-bold leading-relaxed mb-4 opacity-80">
            Optimiza tu perfil para entornos de Manufactura 4.0.
          </p>
          <button className={`w-full bg-white text-slate-900 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-${theme.primary} hover:text-white transition-all shadow-lg`}>
            Consultar IA
          </button>
        </div>
      </div>

      {/* --- MÉTRICAS DE RENDIMIENTO (DENSIDAD ALTA) --- */}
      <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
          <h4 className="font-black text-slate-400 text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={14} className={`text-${theme.primary}`} /> Rendimiento
          </h4>
          <span className={`text-[8px] font-black text-${theme.primary} bg-${theme.primary}/5 px-2 py-0.5 uppercase`}>Sync Active</span>
        </div>
        
        <div className="space-y-3">
          {/* XP */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <Zap size={16} className={`text-${theme.primary}`} />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Experiencia Acumulada</p>
                <p className="text-sm font-black text-slate-800 tracking-tighter">{userStats.xp.toLocaleString()} <span className="text-[8px] text-slate-400 uppercase">XP</span></p>
              </div>
            </div>
          </div>
          
          {/* STREAK */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 group hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3">
              <Flame size={16} className="text-rose-500" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Consistencia (Streak)</p>
                <p className="text-sm font-black text-slate-800 tracking-tighter">{userStats.streak} <span className="text-[8px] text-slate-400 uppercase tracking-widest">Días Consecutivos</span></p>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <Target size={16} className={`text-${theme.primary}`} />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Módulos Completados</p>
                <p className="text-sm font-black text-slate-800 tracking-tighter">{userStats.lessons} <span className="text-[8px] text-slate-400 uppercase">/ 45 Módulos</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
