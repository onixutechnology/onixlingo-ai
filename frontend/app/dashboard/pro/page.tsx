'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { 
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check, 
  PieChart, Users, Building, LogOut, ArrowLeft, Gem, Star, 
  Crown, Lightbulb, Mic, Headphones, Activity, Scale, Cpu, 
  Stethoscope, Landmark, Zap, Book, Volume2, BarChart3,
  Target, Flame, Eye, Download, Share2, Filter, Grid, List,
  BookOpen, Brain, Settings, Bell, Clock, Percent, TrendingDown,
  AlertCircle, Palette, Maximize2, Calendar, Users2, MessageSquare,
  Terminal, Database, Shield, Code, Gauge, Sparkles, Trophy,
  Radio, Radio as RadioButton, RefreshCw, ChevronDown, Menu,
  X, Send, Plus, ChevronRight, ArrowUp
} from 'lucide-react';

// --- 🔒 IMPORTACIÓN DEL PAYWALL ---
import { UpgradeModal } from '@/components/pro/UpgradeModal';

// ============================================================================
// ======================== TIPOS DE DATOS EXPANDIDOS =======================
// ============================================================================

interface ReadingSession {
  id: string;
  text: string;
  title: string;
  duration: number;
  accuracy: number;
  wordCount: number;
  mistakeWords: string[];
  recordedAt: string;
}

interface ExecutiveKPI {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  completionRate: number;
  studyStreak: number;
  fluencyScore: number;
  specializationsFocused: string[];
}

interface DailyBriefing {
  id: string;
  text: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  industry: string;
}

// --- DATA: EXECUTIVE CURRICULUM COMPLETO ---
const PRO_CURRICULUM = [
  {
    id: 'exec-b1',
    title: 'Executive Foundation (B1)',
    level: 'B1',
    color: 'slate',
    icon: Users,
    description: 'Fundamentos de comunicación corporativa, etiqueta y networking esencial.',
    lessons: [
      { id: 'pro-b1-1', title: 'Professional Introductions', desc: 'Presentaciones de alto impacto.' },
      { id: 'pro-b1-2', title: 'Formal Emailing', desc: 'Estructuras de correo formal.' },
      { id: 'pro-b1-3', title: 'Business Travel Logistics', desc: 'Vocabulario de logística y viajes.' },
      { id: 'pro-b1-4', title: 'Scheduling Meetings', desc: 'Coordinación de agendas.' },
      { id: 'pro-b1-5', title: 'Office Small Talk', desc: 'Romper el hielo profesionalmente.' },
      { id: 'pro-b1-6', title: 'Describing Job Roles', desc: 'Jerarquías y responsabilidades.' },
      { id: 'pro-b1-7', title: 'Telephone Etiquette', desc: 'Protocolo telefónico.' },
      { id: 'pro-b1-8', title: 'Giving Instructions', desc: 'Delegación básica.' },
      { id: 'pro-b1-9', title: 'Professional Apologies', desc: 'Gestión de errores menores.' },
      { id: 'pro-b1-10', title: 'B1 Milestone: Networking Event', desc: 'Simulación final de nivel.' },
    ]
  },
  {
    id: 'exec-b2',
    title: 'Management Skills (B2)',
    level: 'B2',
    color: 'blue',
    icon: PieChart,
    description: 'Gestión de equipos, liderazgo intermedio y resolución de conflictos.',
    lessons: [
      { id: 'pro-b2-1', title: 'Leading Effective Meetings', desc: 'Control de sala y agenda.' },
      { id: 'pro-b2-2', title: 'Negotiation Fundamentals', desc: 'Técnicas de persuasión básica.' },
      { id: 'pro-b2-3', title: 'Data Presentation', desc: 'Descripción de gráficos y métricas.' },
      { id: 'pro-b2-4', title: 'Conflict Resolution', desc: 'Mediación en el equipo.' },
      { id: 'pro-b2-5', title: 'Performance Feedback', desc: 'Evaluaciones de desempeño.' },
      { id: 'pro-b2-6', title: 'Project Management Terms', desc: 'Metodologías Ágiles y plazos.' },
      { id: 'pro-b2-7', title: 'Writing Reports', desc: 'Informes ejecutivos claros.' },
      { id: 'pro-b2-8', title: 'Job Interviews', desc: 'Contratación y selección.' },
      { id: 'pro-b2-9', title: 'Marketing Basics', desc: 'Posicionamiento y marca.' },
      { id: 'pro-b2-10', title: 'B2 Milestone: Quarterly Review', desc: 'Presentación de resultados Q4.' },
    ]
  },
  {
    id: 'exec-c1',
    title: 'Strategic Proficiency (C1)',
    level: 'C1',
    color: 'indigo',
    icon: Globe,
    description: 'Visión global, finanzas corporativas y gestión de crisis.',
    lessons: [
      { id: 'pro-c1-1', title: 'Global Market Analysis', desc: 'Tendencias macroeconómicas.' },
      { id: 'pro-c1-2', title: 'Crisis Management', desc: 'Relaciones públicas y control de daños.' },
      { id: 'pro-c1-3', title: 'Financial Terminology', desc: 'Balance sheets y P&L.' },
      { id: 'pro-c1-4', title: 'Mergers & Acquisitions', desc: 'Integración corporativa.' },
      { id: 'pro-c1-5', title: 'Public Speaking', desc: 'Oratoria para grandes audiencias.' },
      { id: 'pro-c1-6', title: 'Nuanced Negotiation', desc: 'Negociación compleja multiparte.' },
      { id: 'pro-c1-7', title: 'Legal Contracts', desc: 'Cláusulas y términos legales.' },
      { id: 'pro-c1-8', title: 'ESG & Sustainability', desc: 'Responsabilidad corporativa.' },
      { id: 'pro-c1-9', title: 'Corporate Strategy', desc: 'Planificación a largo plazo.' },
      { id: 'pro-c1-10', title: 'C1 Milestone: Board Presentation', desc: 'Defensa ante la junta directiva.' },
    ]
  },
  {
    id: 'exec-c2',
    title: 'Executive Fluency (C2)',
    level: 'C2',
    color: 'violet',
    icon: Star,
    description: 'Dominio nativo, sutileza diplomática y cultura de negocios.',
    lessons: [
      { id: 'pro-c2-1', title: 'Idiomatic Business Expressions', desc: 'Modismos de alto nivel.' },
      { id: 'pro-c2-2', title: 'Subtlety & Persuasion', desc: 'Influencia indirecta.' },
      { id: 'pro-c2-3', title: 'Cultural Intelligence (CQ)', desc: 'Negocios transculturales.' },
      { id: 'pro-c2-4', title: 'Advanced Economics', desc: 'Teoría económica aplicada.' },
      { id: 'pro-c2-5', title: 'Humor in Business', desc: 'Uso estratégico del ingenio.' },
      { id: 'pro-c2-6', title: 'Hostile Q&A Handling', desc: 'Manejo de prensa agresiva.' },
      { id: 'pro-c2-7', title: 'Executive Ghostwriting', desc: 'Comunicación escrita de élite.' },
      { id: 'pro-c2-8', title: 'Diplomatic Language', desc: 'Protocolo internacional.' },
      { id: 'pro-c2-9', title: 'Interpreting Silence', desc: 'Comunicación no verbal avanzada.' },
      { id: 'pro-c2-10', title: 'C2 Milestone: Global Summit', desc: 'Cumbre internacional G20.' },
    ]
  },
  {
    id: 'director',
    title: 'Boardroom Vision (Executive)',
    level: 'EXEC',
    color: 'amber',
    icon: Building,
    description: 'Liderazgo C-Level, gobierno corporativo y visión organizacional.',
    lessons: [
      { id: 'pro-exec-1', title: 'Organizational Vision', desc: 'Definición de misión y norte.' },
      { id: 'pro-exec-2', title: 'Stakeholder Management', desc: 'Gestión de inversores y socios.' },
      { id: 'pro-exec-3', title: 'IPO & Exit Strategies', desc: 'Salida a bolsa y ventas.' },
      { id: 'pro-exec-4', title: 'Corporate Governance', desc: 'Ética y cumplimiento.' },
      { id: 'pro-exec-5', title: 'Leadership Philosophy', desc: 'Estilos de liderazgo.' },
      { id: 'pro-exec-6', title: 'Change Management', desc: 'Reestructuración organizacional.' },
      { id: 'pro-exec-7', title: 'Investor Relations', desc: 'Calls de ganancias trimestrales.' },
      { id: 'pro-exec-8', title: 'Risk Assessment', desc: 'Mitigación de riesgos globales.' },
      { id: 'pro-exec-9', title: 'Succession Planning', desc: 'El legado del CEO.' },
      { id: 'pro-exec-10', title: 'Executive Milestone: Shareholder Meeting', desc: 'Asamblea anual de accionistas.' },
    ]
  },
  {
    id: 'titanium-spec',
    title: 'Titanium Specializations (Industry Specific)',
    level: 'SPECIALIZED',
    color: 'emerald',
    icon: Crown,
    description: 'Módulos de alta precisión para industrias específicas. Acceso exclusivo Titanium.',
    lessons: [
      { id: 'pro-spec-1', title: 'Legal: Contract Law Basics', desc: 'Vocabulario de contratos y acuerdos.' },
      { id: 'pro-spec-2', title: 'Legal: IP & Copyrights', desc: 'Propiedad intelectual y patentes.' },
      { id: 'pro-spec-3', title: 'Legal: Litigation Terminology', desc: 'Juicios y procedimientos legales.' },
      { id: 'pro-spec-4', title: 'Legal: Corporate Liability', desc: 'Responsabilidad corporativa.' },
      { id: 'pro-spec-5', title: 'Tech: Agile & Scrum Mastery', desc: 'Gestión de proyectos de software.' },
      { id: 'pro-spec-6', title: 'Tech: DevOps Culture', desc: 'Integración y despliegue continuo.' },
      { id: 'pro-spec-7', title: 'Tech: AI & Ethics', desc: 'Dilemas éticos en inteligencia artificial.' },
      { id: 'pro-spec-8', title: 'Tech: Cybersecurity Ops', desc: 'Protocolos de defensa digital.' },
      { id: 'pro-spec-9', title: 'Tech: Cloud Computing Terms', desc: 'AWS/Azure y arquitectura nube.' },
      { id: 'pro-spec-10', title: 'Finance: Crypto Markets', desc: 'Blockchain y activos digitales.' },
      { id: 'pro-spec-11', title: 'Finance: Forex Trading', desc: 'Mercado de divisas.' },
      { id: 'pro-spec-12', title: 'Finance: Hedge Funds', desc: 'Gestión de fondos de cobertura.' },
      { id: 'pro-spec-13', title: 'Finance: Venture Capital', desc: 'Estructuración de inversiones VC.' },
      { id: 'pro-spec-14', title: 'Med: Clinical Trials', desc: 'Fases de investigación clínica.' },
      { id: 'pro-spec-15', title: 'Med: Patient Confidentiality', desc: 'HIPAA y privacidad.' },
      { id: 'pro-spec-16', title: 'Med: Medical Conferences', desc: 'Presentación de papers médicos.' },
      { id: 'pro-spec-17', title: 'Med: Hospital Administration', desc: 'Gestión de centros de salud.' },
      { id: 'pro-spec-18', title: 'Eng: Civil Engineering Specs', desc: 'Planos y normativas de construcción.' },
      { id: 'pro-spec-19', title: 'Eng: Electrical Safety', desc: 'Protocolos de alta tensión.' },
      { id: 'pro-spec-20', title: 'Eng: Automotive Mfg', desc: 'Procesos de manufactura moderna.' },
      { id: 'pro-spec-21', title: 'Eng: Lean Six Sigma', desc: 'Optimización de procesos industriales.' },
      { id: 'pro-spec-22', title: 'Sales: The Art of Closing', desc: 'Técnicas de cierre de ventas.' },
      { id: 'pro-spec-23', title: 'Sales: Objection Handling', desc: 'Manejo avanzado de objeciones.' },
      { id: 'pro-spec-24', title: 'Sales: CRM Mastery', desc: 'Gestión de relaciones con clientes.' },
      { id: 'pro-spec-25', title: 'Mkt: SEO Strategy', desc: 'Posicionamiento orgánico.' },
      { id: 'pro-spec-26', title: 'Mkt: Virality Science', desc: 'Psicología del contenido viral.' },
      { id: 'pro-spec-27', title: 'HR: Diversity & Inclusion', desc: 'Políticas corporativas de D&I.' },
      { id: 'pro-spec-28', title: 'HR: Remote Work Policy', desc: 'Gestión de equipos remotos.' },
      { id: 'pro-spec-29', title: 'HR: Crisis HR Management', desc: 'Despidos masivos y reestructuración.' },
      { id: 'pro-spec-30', title: 'Soft: Stoicism in Business', desc: 'Resiliencia emocional ejecutiva.' },
    ]
  }
];

// Daily Briefing Data
const DAILY_BRIEFINGS: DailyBriefing[] = [
  {
    id: '1',
    text: '"We must accelerate our digital transformation initiative to maintain market competitiveness in the next fiscal quarter."',
    pronunciation: 'wee must ak-SEL-uh-rate our DIJ-i-tuhl trans-for-MAY-shun in-ISH-uh-tiv...',
    difficulty: 'medium',
    industry: 'Tech'
  },
  {
    id: '2',
    text: '"The synergistic approach between these two divisions will create substantial operational efficiencies."',
    pronunciation: 'thuh sin-er-JIS-tik uh-PROHCH...',
    difficulty: 'hard',
    industry: 'Corporate'
  },
  {
    id: '3',
    text: '"Our stakeholders expect transparent communication regarding quarterly earnings performance."',
    pronunciation: 'our STAKE-hol-ders ex-PEKT TRAN-spar-ent...',
    difficulty: 'medium',
    industry: 'Finance'
  }
];

// ============================================================================
// ==================== COMPONENTES NUEVOS ==================================
// ============================================================================

// [COMPONENTE 1] LECTURA FLUIDA PRO - FLUENCY LAB
const FluencyLabPanel = ({ onOpenStudio }: { onOpenStudio: () => void }) => (
  <section className="mb-16 grid grid-cols-1 md:grid-cols-[320px,1fr] gap-8">
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 flex flex-col gap-4 shadow-xl shadow-amber-900/10">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <BookOpen className="text-amber-400" size={18} />
        </div>
        <h3 className="text-sm font-bold tracking-widest uppercase text-amber-300">
          🎙️ Fluency Lab
        </h3>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Practica lectura ejecutiva en voz alta. El sistema analiza tu pronunciación, ritmo y acento en tiempo real con feedback inmediato.
      </p>
      <button 
        onClick={onOpenStudio}
        className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-amber-500/50 transition-all"
      >
        📖 Open Reading Studio
      </button>
      <div className="mt-3 space-y-2 text-[11px] text-slate-500 border-t border-slate-800 pt-3">
        <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Análisis de acento y ritmo</p>
        <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Detección de palabras débiles</p>
        <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Historial de sesiones</p>
        <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Comparación con nativo</p>
      </div>
    </div>

    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 min-h-[280px] flex flex-col justify-between">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">
          📰 Reading Preview
        </p>
        <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
          "In today's global markets, executives must adapt quickly to shifting economic landscapes while maintaining a clear long-term vision. The ability to communicate complex strategies in simple terms separates great leaders from mediocre ones..."
        </p>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-4">
        <span className="flex items-center gap-1"><Activity size={14} className="text-emerald-400" /> Live Pronunciation</span>
        <span className="flex items-center gap-1"><Volume2 size={14} className="text-amber-400" /> Native US Model</span>
      </div>
    </div>
  </section>
);

// [COMPONENTE 2] DAILY EXECUTIVE BRIEFING
const DailyBriefingWidget = ({ briefing }: { briefing: DailyBriefing }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/50 transition-colors">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Daily Brief</span>
        <span className={`text-[10px] px-2 py-1 rounded ${
          briefing.difficulty === 'hard' ? 'bg-red-500/20 text-red-300' :
          briefing.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' :
          'bg-emerald-500/20 text-emerald-300'
        }`}>
          {briefing.difficulty}
        </span>
      </div>
      <p className="text-sm text-slate-300 italic mb-2">{briefing.text}</p>
      <p className="text-[11px] text-slate-500">Pronunciation: {briefing.pronunciation}</p>
    </div>
    <button className="p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 ml-4">
      <Volume2 size={18} />
    </button>
  </div>
);

// [COMPONENTE 3] EXECUTIVE KPI CARD
const ExecutiveKPICard = ({ kpis }: { kpis: ExecutiveKPI }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Total XP</p>
      <p className="text-2xl font-bold text-amber-400">{kpis.totalXP.toLocaleString()}</p>
      <p className="text-[10px] text-slate-600 mt-1">+250 today</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Level</p>
      <p className="text-2xl font-bold text-emerald-400">{kpis.currentLevel}</p>
      <p className="text-[10px] text-slate-600 mt-1">Executive Tier</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Accuracy</p>
      <p className="text-2xl font-bold text-blue-400">{kpis.accuracy}%</p>
      <p className="text-[10px] text-slate-600 mt-1">↑ 5% week</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Fluency</p>
      <p className="text-2xl font-bold text-purple-400">{kpis.fluencyScore}/100</p>
      <p className="text-[10px] text-slate-600 mt-1">↑ Improving</p>
    </div>
  </div>
);

// [COMPONENTE 4] INDUSTRY FILTER & SPECIALIZATION FOCUS
const SpecializationFilter = ({ 
  selectedIndustry, 
  onFilterChange 
}: { 
  selectedIndustry: string | null; 
  onFilterChange: (industry: string | null) => void 
}) => {
  const industries = ['Tech', 'Finance', 'Legal', 'Medical', 'Engineering', 'Sales', 'HR'];

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <button
        onClick={() => onFilterChange(null)}
        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
          selectedIndustry === null
            ? 'bg-amber-500 text-slate-950'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        All Industries
      </button>
      {industries.map(industry => (
        <button
          key={industry}
          onClick={() => onFilterChange(industry)}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            selectedIndustry === industry
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {industry}
        </button>
      ))}
    </div>
  );
};

// [COMPONENTE 5] PRO HEADER STATS
const ProHeaderStats = ({ kpis }: { kpis: ExecutiveKPI }) => (
  <div className="flex items-center gap-6 bg-slate-900/80 backdrop-blur-md px-6 py-3 border border-slate-800 rounded-xl shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
        <Gem size={18} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pro Status</p>
        <p className="text-sm font-bold text-white">Titanium</p>
      </div>
    </div>
    <div className="w-[1px] h-8 bg-slate-800"></div>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
        <BarChart3 size={18} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Accuracy</p>
        <p className="text-sm font-bold text-white">{kpis.accuracy}%</p>
      </div>
    </div>
    <div className="w-[1px] h-8 bg-slate-800"></div>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
        <TrendingUp size={18} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Rank</p>
        <p className="text-sm font-bold text-white">Top 1%</p>
      </div>
    </div>
  </div>
);

// [COMPONENTE 6] PRO TIMELINE NODE (MEJORADO)
const ProTimelineNode = ({ lesson, index, status, isLast }: any) => {
  const router = useRouter();
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  const handleNavigate = () => {
    if (!isLocked) {
      router.push(`/lessonspro/${lesson.id}`);
    }
  };

  if (isActive) {
    return (
      <div className="relative w-full mb-16 pl-12 group">
        {!isLast && <div className="absolute left-[1.9rem] top-10 bottom-[-4rem] w-[2px] bg-slate-800 z-0"></div>}

        <div className="absolute left-0 top-0 z-20">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse">
            <Play size={28} fill="currentColor" className="ml-1" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.15)] group-hover:shadow-[0_0_80px_rgba(37,99,235,0.25)] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e3a8a] z-0"></div>

          <div className="relative z-10 flex flex-col md:flex-row">
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  En Progreso
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Unit {index + 1}</span>
                <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-full text-[10px] font-bold">
                  <Mic size={10} /> Voice Enabled
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{lesson.title}</h3>
              <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl leading-relaxed">{lesson.desc}</p>

              <div className="w-full max-w-md">
                <div className="flex justify-between text-xs font-bold text-amber-500 mb-2 tracking-widest">
                  <span>AVANCE DE LECCIÓN</span>
                  <span>0%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[5%] shadow-[0_0_20px_rgba(245,158,11,0.8)]"></div>
                </div>
              </div>
            </div>

            <div 
              onClick={handleNavigate}
              className="md:w-80 bg-slate-900/50 border-l border-white/5 p-8 flex flex-col items-center justify-center text-center relative group/btn cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center mb-4 group-hover/btn:scale-110 transition-transform duration-300 bg-slate-900 shadow-xl">
                <Play size={32} className="text-amber-500 ml-1" fill="currentColor" />
              </div>
              <h5 className="text-white font-bold text-lg mb-1">Continuar</h5>
              <div className="flex items-center gap-2 mt-2">
                <Headphones size={14} className="text-slate-500" />
                <p className="text-slate-500 text-xs uppercase tracking-widest">Audio Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full mb-8 pl-12 group opacity-80 hover:opacity-100 transition-opacity">
      {!isLast && (
        <div className={`absolute left-[1.9rem] top-[3rem] bottom-[-2rem] w-[2px] z-0 ${isCompleted ? 'bg-amber-500/40' : 'bg-slate-800'}`}></div>
      )}

      <div className="absolute left-[0.5rem] top-1 z-20">
        <div className={`
          w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all duration-300 bg-slate-950
          ${isLocked ? 'border-slate-800 text-slate-700' : ''}
          ${isCompleted ? 'border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}
        `}>
          {isLocked && <Lock size={18} />}
          {isCompleted && <Check size={24} strokeWidth={3} />}
        </div>
      </div>

      <div 
        onClick={handleNavigate}
        className={`
          flex-1 p-5 rounded-xl border transition-all duration-300 flex items-center justify-between
          ${isLocked ? 'border-slate-900 bg-slate-900/20 cursor-not-allowed' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 cursor-pointer hover:bg-slate-800'}
        `}
      >
        <div>
          <h4 className={`text-base font-bold mb-1 ${isLocked ? 'text-slate-600' : 'text-slate-300'}`}>
            {lesson.title}
          </h4>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            Unit {index + 1}
          </p>
        </div>

        {isCompleted && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
              <Star size={14} fill="currentColor" />
              <span>98/100</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase">High Score</p>
          </div>
        )}
      </div>
    </div>
  );
};

// [COMPONENTE 7] READING SESSION MODAL
const ReadingStudioModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-8 py-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <BookOpen className="text-amber-400" />
          Reading Studio
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <X className="text-slate-400" size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Reading Text */}
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3 block">
            Executive Brief Text
          </label>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-slate-200 leading-relaxed min-h-[150px] text-sm">
            "Our strategic imperative is to leverage synergistic partnerships while maintaining operational excellence across all verticals. The confluence of market dynamics and organizational capabilities presents unprecedented opportunities for value creation and stakeholder engagement."
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <Volume2 size={18} /> Play Audio Model
          </button>
          <button className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <Mic size={18} /> Start Recording
          </button>
        </div>

        {/* Feedback */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-xl p-4">
            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-2">Accuracy</p>
            <p className="text-2xl font-bold text-emerald-300">94%</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-2">Fluency</p>
            <p className="text-2xl font-bold text-blue-300">88%</p>
          </div>
        </div>

        {/* Mistake Words */}
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3 block">
            Words to Practice
          </label>
          <div className="flex flex-wrap gap-2">
            {['synergistic', 'imperative', 'verticals', 'confluence'].map(word => (
              <button
                key={word}
                className="px-3 py-1 rounded-lg bg-red-900/20 border border-red-500/50 text-red-300 text-sm hover:bg-red-900/40 transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// ==================== MAIN PAGE COMPONENT ==================================
// ============================================================================

export default function ProfessionalDashboard() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();

  const [isUserPremium, setIsUserPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReadingStudio, setShowReadingStudio] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Mock KPIs
  const kpis: ExecutiveKPI = {
    totalXP: 12450,
    currentLevel: 7,
    accuracy: 92,
    completionRate: 68,
    studyStreak: 23,
    fluencyScore: 87,
    specializationsFocused: ['Tech', 'Finance']
  };

  // Verificación de Acceso
  useEffect(() => {
    const tier = localStorage.getItem('onix_tier');
    if (tier === 'TITANIUM') {
      setIsUserPremium(true);
    }
    setIsUserPremium(true); // DEBUG
    setIsLoading(false);
  }, []);

  // Protección de Ruta
  useEffect(() => {
    if (mode === 'student') {
      router.push('/dashboard');
    }
  }, [mode, router]);

  const handleReturnToStudent = () => {
    setMode('student');
  };

  const getLessonStatus = (id: string, sectionIndex: number, lessonIndex: number) => {
    if (id === 'pro-b1-1') return 'completed';
    if (id === 'pro-b1-2') return 'active';
    if (lessonIndex === 0) return 'locked';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 relative">
      {!isLoading && !isUserPremium && <UpgradeModal />}

      {/* READING STUDIO MODAL */}
      {showReadingStudio && <ReadingStudioModal onClose={() => setShowReadingStudio(false)} />}

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 bg-black border-r border-slate-900 hidden lg:flex flex-col items-center py-8 z-50">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-12 shadow-lg shadow-amber-900/20">
          <span className="font-serif font-black text-slate-900 text-xl">O</span>
        </div>
        <nav className="flex flex-col gap-8 w-full px-2">
          <button className="p-3 text-amber-500 bg-slate-900/80 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Briefcase size={22} />
          </button>
          <button className="p-3 text-slate-600 hover:text-slate-300 transition-colors">
            <TrendingUp size={22} />
          </button>
          <button className="p-3 text-slate-600 hover:text-slate-300 transition-colors">
            <Globe size={22} />
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-6">
          <button onClick={handleReturnToStudent} className="p-3 text-slate-600 hover:text-white transition-colors" title="Volver al modo normal">
            <LogOut size={22} />
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden ring-2 ring-slate-900">
            <img src="https://ui-avatars.com/api/?name=CEO&background=0f172a&color=cbd5e1" alt="Profile" />
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className={`lg:pl-24 min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 transition-all duration-500 ${!isUserPremium && !isLoading ? 'blur-sm brightness-50 pointer-events-none overflow-hidden h-screen' : ''}`}>
        
        {/* HEADER */}
        <header className="sticky top-0 z-40 px-8 h-24 flex items-center justify-between bg-gradient-to-b from-slate-950 to-transparent pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-4">
            <h1 className="text-xl font-light tracking-[0.2em] text-white uppercase">
              Onix<span className="font-bold text-amber-500">Pro</span>
            </h1>
            <span className="hidden md:inline-block px-3 py-1 bg-slate-900/80 border border-slate-800 text-[10px] text-slate-500 rounded-full uppercase tracking-widest backdrop-blur-sm">
              Titanium Edition
            </span>
          </div>
          <div className="pointer-events-auto flex items-center gap-6">
            <button onClick={handleReturnToStudent} className="lg:hidden flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
              <ArrowLeft size={14} /> Exit
            </button>
            <div className="hidden md:block">
              <ProHeaderStats kpis={kpis} />
            </div>
          </div>
        </header>

        <div className="px-6 md:px-12 max-w-7xl mx-auto pb-32">
          
          {/* HERO */}
          <div className="mb-24 pt-10">
            <h2 className="text-5xl md:text-6xl font-thin text-white mb-6 tracking-tight">
              Good evening, <br/>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl">
                Executive.
              </span>
            </h2>
            <p className="text-slate-400 text-lg font-light max-w-3xl leading-relaxed border-l-2 border-amber-500/50 pl-6">
              Su enfoque actual es <strong className="text-white">Dominio Estratégico Global + Lectura Fluida</strong>. 
              Acceda a sus módulos de alta dirección y practique pronunciación de nivel ejecutivo a continuación.
            </p>
          </div>

          {/* KPI CARDS */}
          <ExecutiveKPICard kpis={kpis} />

          {/* LECTURA FLUIDA - FLUENCY LAB */}
          <FluencyLabPanel onOpenStudio={() => setShowReadingStudio(true)} />

          {/* DAILY BRIEFING SECTION */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <Bell className="text-amber-400" size={24} />
              <h3 className="text-2xl font-bold text-white">Daily Executive Briefing</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
            </div>
            <div className="space-y-3">
              {DAILY_BRIEFINGS.map((briefing, idx) => (
                <DailyBriefingWidget key={briefing.id} briefing={briefing} />
              ))}
            </div>
          </section>

          {/* SPECIALIZATIONS FILTER */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Filter Specializations</h3>
            <SpecializationFilter 
              selectedIndustry={selectedIndustry}
              onFilterChange={setSelectedIndustry}
            />
          </div>

          {/* CURRICULUM */}
          <div className="relative">
            {PRO_CURRICULUM.map((section, sIdx) => (
              <div key={section.id} className="mb-32 relative">
                
                <div className="flex items-center gap-4 mb-12">
                  <div className={`
                    w-10 h-10 flex items-center justify-center rounded-lg
                    ${section.level === 'B1' ? 'bg-slate-800 text-slate-300' : 'bg-slate-900 border border-slate-800 text-slate-500'}
                    ${section.level === 'SPECIALIZED' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30' : ''}
                  `}>
                    <section.icon size={20} />
                  </div>
                  <h3 className={`text-2xl font-bold tracking-tight ${section.level === 'SPECIALIZED' ? 'text-emerald-400' : 'text-white'}`}>
                    {section.title}
                  </h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4"></div>
                </div>

                <div className="md:pl-4">
                  {section.lessons.map((lesson, lIdx) => (
                    <ProTimelineNode 
                      key={lesson.id}
                      lesson={lesson}
                      index={lIdx}
                      status={getLessonStatus(lesson.id, sIdx, lIdx)}
                      isLast={lIdx === section.lessons.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}