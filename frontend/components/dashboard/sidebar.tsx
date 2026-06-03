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

// --- 📢 1. IMPORTAMOS EL ANUNCIO INTELIGENTE ---
import { AdBanner } from '@/components/ads/AdBanner';
import { StatsModal } from './StatsModal';

const ADVISOR_TIPS: Record<string, string[]> = {
  en: [
    "Proyección de Oratoria: Para maximizar el impacto en su Series B Pitch ante inversores, reemplace verbos pasivos por métricas de tracción activa (ej: leverage operational margins).",
    "Mitigación de Conflictos: En negociaciones bilaterales, introduzca cláusulas de contingencia diplomática utilizando condicionales compuestos ('Should any operational deviations arise...').",
    "Influencia Ejecutiva: Aumente la modulación tonal en juntas de accionistas; reduzca la velocidad en un 15% para proyectar soberanía en momentos de volatilidad del mercado.",
    "Persuasión C-Suite: Utilice 'Due Diligence' en lugar de 'Investigation' para denotar un análisis formal con rigor metodológico y validez legal.",
    "Presentaciones Financieras: Al reportar gastos amortizados (I+D), enfatice el 'multiplicador de valor a largo plazo' para blindar el margen neto operativo."
  ],
  fr: [
    "Métrica de Negociación: Emplee el término 'Consensus' tras estructurar un acuerdo bilateral, atenuando riesgos contractuales con elegancia corporativa.",
    "Sutileza Corporativa: Prefiera 'Atouts stratégiques' sobre 'Points forts' para referirse a los activos y ventajas corporativas clave de OnixCorp.",
    "Gestión de Alianzas: Al interactuar con contrapartes francesas, use giros pasivos educados ('Il convient de noter...') para sugerir modificaciones sin confrontación.",
    "Finanzas de Fusión: En juntas de M&A, justifique la 'rentabilité globale' destacando la amortización a largo plazo y las sinergias operativas estimadas.",
    "Oratoria C-Suite: Domine la entonación descendente al final de cada frase para consolidar autoridad ante un comité directivo francófono."
  ],
  zh: [
    "Etiqueta Directiva: Al dirigirse a directivos en Shanghái, justifique sus márgenes utilizando '核心竞争力' (competitividad núcleo) para alinear visiones estratégicas.",
    "Negociación Táctica: Introduzca propuestas complejas usando '协同效应' (efecto sinérgico) para resaltar los beneficios compartidos y facilitar consensos.",
    "Soberanía Lingüística: En rondas de inversión en China, use el término de jerga '愿景' (visión prospectiva) para consolidar su autoridad y liderazgo.",
    "Discurso bajo Estrés: Frente a preguntas de auditoría, mantenga un tono pausado y estructurado con '稳健发展' (desarrollo estable y seguro).",
    "Fusiones y Adquisiciones: Justifique valoraciones utilizando '杠杆效应' (efecto apalancamiento estratégico) para mitigar el escepticismo del panel."
  ]
};

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
  const [showStatsModal, setShowStatsModal] = useState(false);

  const theme = LANGUAGE_COLORS[activeLanguage] || LANGUAGE_COLORS.en;

  const [tipIndex, setTipIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const tips = ADVISOR_TIPS[activeLanguage] || ADVISOR_TIPS.en;
  const currentTip = tips[tipIndex % tips.length];

  const handleNextTip = () => {
    setIsRotating(true);
    setTimeout(() => {
      setTipIndex(prev => prev + 1);
      setIsRotating(false);
    }, 300);
  };

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
      <div className={`p-1.5 flex items-center gap-1.5 transition-all duration-300 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] border ${
        mode === 'professional' ? 'bg-sky-950 border-sky-800' : 'bg-white border-sky-200'
      }`}>
        <div className={`
          flex-1 flex items-center justify-center gap-2 px-2 py-3 rounded-xl border border-transparent transition-all cursor-pointer group min-w-0
          ${mode === 'student' ? `bg-${theme.primary} border-${theme.accent} text-white shadow-md` : 'text-sky-600 hover:bg-sky-50 hover:border-sky-100'}
        `} onClick={handleModeSwitch}>
          <GraduationCap size={16} className={`shrink-0 ${mode === 'student' ? 'text-white' : 'text-sky-600'}`} />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <p className={`text-[9px] font-black uppercase tracking-widest truncate w-full ${mode === 'student' ? 'opacity-80' : 'text-sky-600'}`}>Estudiante</p>
            <p className={`text-[10px] font-black uppercase tracking-tight truncate w-full ${mode === 'student' ? 'text-white' : 'text-sky-800'}`}>Módulos Base</p>
          </div>
          {mode === 'student' && <div className="w-1.5 h-1.5 bg-white shrink-0 ml-1"></div>}
        </div>

        <div className={`
          flex-1 flex items-center justify-center gap-2 px-2 py-3 rounded-xl border border-transparent transition-all cursor-pointer group min-w-0
          ${mode === 'professional' ? 'bg-amber-600 border-amber-700 text-white shadow-md' : 'text-sky-600 hover:bg-sky-50 hover:border-sky-100'}
        `} onClick={handleModeSwitch}>
          <Briefcase size={16} className={`shrink-0 ${mode === 'professional' ? 'text-white' : 'text-sky-600'}`} />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <p className={`text-[9px] font-black uppercase tracking-widest truncate w-full ${mode === 'professional' ? 'text-amber-100' : 'text-sky-600'}`}>Professional</p>
            <p className={`text-[10px] font-black uppercase tracking-tight truncate w-full ${mode === 'professional' ? 'text-white' : 'text-sky-800'}`}>Exec Skills</p>
          </div>
          {mode === 'professional' && <div className="w-1.5 h-1.5 bg-white shrink-0 ml-1"></div>}
        </div>
      </div>

      {/* --- IA WIDGET: NEURAL ADVISOR INTERACTIVO --- */}
      <div className="mb-2 px-4">
        <div className="bg-sky-950 p-5 border-l-4 border-amber-500 rounded-xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-1 opacity-10">
            <Sparkles size={40} className="text-amber-500" />
          </div>
          
          <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2.5 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 animate-pulse"></span> Neural Advisor IA
            </span>
            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 py-0.5 text-[6px] tracking-widest font-black">ACTIVO</span>
          </p>

          <div className={`transition-all duration-300 min-h-[90px] ${isRotating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <p className="text-white text-[10px] font-bold leading-relaxed mb-4">
              "{currentTip}"
            </p>
          </div>

          <button 
            onClick={handleNextTip}
            className="w-full bg-sky-950 hover:bg-amber-500 text-sky-500 hover:text-sky-950 py-2.5 text-[8px] font-black uppercase tracking-widest border border-sky-800 hover:border-amber-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles size={10} /> Generar Consejo Ejecutivo
          </button>
        </div>
      </div>

      {/* --- MÉTRICAS DE RENDIMIENTO (DENSIDAD ALTA) --- */}
      <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] relative">
        <div className="flex items-center justify-between mb-6 border-b border-sky-100 pb-3">
          <h4 className="font-black text-sky-600 text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
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
                <p className="text-[8px] font-black text-sky-600 uppercase tracking-widest group-hover:text-sky-800 transition-colors">Experiencia Acumulada</p>
                <p className="text-sm font-black text-sky-950 tracking-tighter">{userStats.xp.toLocaleString()} <span className="text-[8px] text-sky-600 uppercase">XP</span></p>
              </div>
            </div>
            <ChevronRight size={14} className="text-sky-500 group-hover:text-sky-700 transition-colors" />
          </div>
          
          {/* STREAK */}
          <div 
            onClick={() => setShowStatsModal(true)}
            className="flex items-center justify-between p-3 bg-sky-50 border border-sky-100 group hover:border-amber-200 hover:shadow-[0_10px_40px_rgba(14,165,233,0.08)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Flame size={16} className="text-rose-500" />
              <div>
                <p className="text-[8px] font-black text-sky-600 uppercase tracking-widest group-hover:text-sky-800 transition-colors">Consistencia (Streak)</p>
                <p className="text-sm font-black text-sky-950 tracking-tighter">{userStats.streak} <span className="text-[8px] text-sky-600 uppercase tracking-widest">Días Consecutivos</span></p>
              </div>
            </div>
            <ChevronRight size={14} className="text-sky-500 group-hover:text-sky-700 transition-colors" />
          </div>

          {/* PROGRESS */}
          <div className="flex items-center justify-between p-3 bg-sky-50 border border-sky-100 group hover:border-sky-200 transition-colors">
            <div className="flex items-center gap-3">
              <Target size={16} className={`text-${theme.primary}`} />
              <div>
                <p className="text-[8px] font-black text-sky-600 uppercase tracking-widest">Módulos Completados</p>
                <p className="text-sm font-black text-sky-950 tracking-tighter">{userStats.lessons} <span className="text-[8px] text-sky-600 uppercase">/ 45 Módulos</span></p>
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
  );
}
