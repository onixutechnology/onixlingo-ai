'use client';

import { useUIStore } from '@/store/uiStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, GraduationCap, ToggleLeft, ToggleRight, Sparkles, Activity, Zap, Target, Flame, Crown } from 'lucide-react';

// --- 📢 1. IMPORTAMOS EL ANUNCIO INTELIGENTE ---
import { AdBanner } from '@/components/ads/AdBanner';

// Props para recibir datos del usuario
interface SidebarProps {
  userStats?: { xp: number; lessons: number; streak: number };
}

export default function Sidebar({ userStats = { xp: 0, lessons: 0, streak: 0 } }: SidebarProps) {
  const { mode, setMode } = useUIStore();
  const router = useRouter();

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
    <aside className="flex flex-col w-full lg:w-96 gap-6 lg:gap-8 lg:sticky lg:top-32 self-start h-fit pb-32 lg:pb-0">
      
      {/* --- ZONA DEL SWITCH MODO PRO/ESTUDIANTE --- */}
      <div className={`border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all duration-500 ${mode === 'professional' ? 'bg-slate-900 border-slate-800 shadow-amber-900/20' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shadow-inner ${mode === 'professional' ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950' : 'bg-indigo-100 text-indigo-600'}`}>
            {mode === 'professional' ? <Crown size={20} /> : <GraduationCap size={20} />}
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${mode === 'professional' ? 'text-slate-500' : 'text-slate-400'}`}>
              Modo Actual
            </p>
            <p className={`font-black text-sm ${mode === 'professional' ? 'text-amber-500' : 'text-slate-800'}`}>
              {mode === 'professional' ? 'Ejecutivo (Pro)' : 'Estudiante'}
            </p>
          </div>
        </div>
        <button onClick={handleModeSwitch} className={`transition-colors active:scale-95 ${mode === 'professional' ? 'text-amber-500 hover:text-amber-400' : 'text-slate-300 hover:text-indigo-600'}`}>
          {mode === 'student' ? <ToggleLeft size={44} strokeWidth={1.5} /> : <ToggleRight size={44} strokeWidth={1.5} />}
        </button>
      </div>

      {/* --- TU WIDGET DE IA --- */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 text-4xl shadow-inner border border-white/20">
            🤖
          </div>
          <h3 className="font-black text-2xl mb-3 tracking-tight">Tutor Personal IA</h3>
          <p className="text-indigo-100 text-sm mb-8 leading-relaxed opacity-90 font-medium">
            Practica conversaciones de negocios, entrevistas y negociación en tiempo real con voz.
          </p>
          <Link href="/practice" className="w-full">
            <button className="w-full bg-white text-indigo-700 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-all text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 hover:shadow-white/20">
              <Sparkles size={18} /> Iniciar Sesión IA
            </button>
          </Link>
        </div>
      </div>

      {/* --- TU WIDGET DE STATS --- */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
          <Activity size={16} className="text-indigo-500" /> Métricas de Rendimiento
        </h4>
        
        <div className="space-y-4">
          {/* XP */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500"><Zap size={24} fill="currentColor" /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total XP</p>
                <p className="text-xl font-black text-slate-800">{userStats.xp.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* RACHA (Agregado) */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500"><Flame size={24} fill="currentColor" /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Racha Activa</p>
                <p className="text-xl font-black text-slate-800">{userStats.streak} <span className="text-sm text-slate-400 font-medium">Días</span></p>
              </div>
            </div>
          </div>

          {/* MÓDULOS */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-500"><Target size={24} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulos</p>
                <p className="text-xl font-black text-slate-800">{userStats.lessons} <span className="text-sm text-slate-400 font-medium">/ 45</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 📢 2. ZONA DE PUBLICIDAD --- */}
      {/* Oculto automáticamente en Modo Pro gracias a la lógica interna de AdBanner */}
      <AdBanner variant="sidebar" />

    </aside>
  );
}
