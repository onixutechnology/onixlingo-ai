'use client';

import { useUIStore } from '@/store/uiStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, GraduationCap, ToggleLeft, ToggleRight, Sparkles, Activity, Zap, Target } from 'lucide-react';

// --- 📢 1. IMPORTAMOS EL ANUNCIO INTELIGENTE ---
import { AdBanner } from '@/components/ads/AdBanner';

// Props para recibir datos del usuario
interface SidebarProps {
  userStats?: { xp: number; lessons: number; streak: number };
}

export default function Sidebar({ userStats = { xp: 0, lessons: 0, streak: 0 } }: SidebarProps) {
  const { mode, toggleMode } = useUIStore();
  const router = useRouter();

  const handleModeSwitch = () => {
    toggleMode();
    // Redirigir inmediatamente según el modo
    if (mode === 'student') router.push('/dashboard/pro');
    else router.push('/dashboard');
  };

  return (
    <aside className="hidden lg:flex flex-col w-96 gap-8 sticky top-32 self-start h-fit">
      
      {/* --- ZONA DEL SWITCH --- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${mode === 'professional' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                {mode === 'professional' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Modo Actual</p>
                <p className="font-bold text-slate-800">{mode === 'professional' ? 'Ejecutivo' : 'Estudiante'}</p>
            </div>
        </div>
        <button onClick={handleModeSwitch} className="text-slate-300 hover:text-indigo-600 transition-colors">
            {mode === 'student' ? <ToggleLeft size={40} /> : <ToggleRight size={40} className="text-indigo-600" />}
        </button>
      </div>

      {/* --- TU WIDGET DE IA --- */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 text-4xl shadow-inner border border-white/20">
            🤖
          </div>
          <h3 className="font-black text-2xl mb-3">Tutor Personal IA</h3>
          <p className="text-indigo-100 text-sm mb-8 leading-relaxed opacity-90 font-medium">
            Practica conversaciones de negocios, entrevistas y negociación en tiempo real.
          </p>
          <Link href="/practice" className="w-full">
            <button className="w-full bg-white text-indigo-700 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-colors text-sm shadow-xl flex items-center justify-center gap-2">
              <Sparkles size={16} /> Iniciar Sesión IA
            </button>
          </Link>
        </div>
      </div>

      {/* --- TU WIDGET DE STATS --- */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-8 flex items-center gap-2">
          <Activity size={16} className="text-indigo-500" /> Métricas de Rendimiento
        </h4>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500"><Zap size={24} fill="currentColor" /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Total XP</p><p className="text-xl font-black text-slate-800">{userStats.xp}</p></div>
             </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-500"><Target size={24} /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Módulos</p><p className="text-xl font-black text-slate-800">{userStats.lessons} <span className="text-sm text-slate-400 font-medium">/ 45</span></p></div>
             </div>
          </div>
        </div>
      </div>

      {/* --- 📢 2. ZONA DE PUBLICIDAD --- */}
      {/* Este componente decide solo si se muestra o no */}
      <AdBanner variant="sidebar" />

    </aside>
  );
}