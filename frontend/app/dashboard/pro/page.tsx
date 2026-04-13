'use client';

/**
 * ==============================================================================
 * ONIXLINGO LMS DASHBOARD - EXECUTIVE HUB (PRO TIER)
 * ==============================================================================
 * RUTA: /dashboard/pro/page.tsx
 * ESTADO: Production Ready (Métricas Dinámicas + Bottom Nav + Motor de Voz IA)
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import Cookies from 'js-cookie'; 

import { 
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check, 
  PieChart, Users, Building, LogOut, ArrowLeft, Gem, Star, 
  Crown, Mic, Volume2, BarChart3, Bell, X, BookOpen, Activity,
  Home, BookA, User
} from 'lucide-react';

import { UpgradeModal } from '@/components/pro/UpgradeModal';
// 🔥 IMPORTAMOS NUESTRO NUEVO MOTOR DE VOZ IA
import { ReadingStudio } from '@/components/pro/ReadingStudio';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

// ============================================================================
// ======================== DATA ESTÁTICA (ESTRUCTURA VISUAL) ===============
// ============================================================================
// Nota: En el futuro, idealmente mover esto a un archivo '@/data/proCurriculum.ts'

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
];

const DAILY_BRIEFINGS = [
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
// ==================== COMPONENTES VISUALES ==================================
// ============================================================================

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
        Practica lectura ejecutiva en voz alta. El sistema analiza tu pronunciación, ritmo y acento en tiempo real.
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
      </div>
    </div>
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 min-h-[280px] flex flex-col justify-between">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">📰 Reading Preview</p>
        <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
          "In today's global markets, executives must adapt quickly to shifting economic landscapes while maintaining a clear long-term vision..."
        </p>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-4">
        <span className="flex items-center gap-1"><Activity size={14} className="text-emerald-400" /> Live Pronunciation</span>
        <span className="flex items-center gap-1"><Volume2 size={14} className="text-amber-400" /> Native US Model</span>
      </div>
    </div>
  </section>
);

const DailyBriefingWidget = ({ briefing }: any) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/50 transition-colors">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Daily Brief</span>
        <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase">{briefing.difficulty}</span>
      </div>
      <p className="text-sm text-slate-300 italic mb-2">{briefing.text}</p>
      <p className="text-[11px] text-slate-500">Pronunciation: {briefing.pronunciation}</p>
    </div>
    <button className="p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 ml-4 transition-colors">
      <Volume2 size={18} />
    </button>
  </div>
);

const SpecializationFilter = ({ selectedIndustry, onFilterChange }: any) => {
  const industries = ['Tech', 'Finance', 'Legal', 'Medical', 'Engineering', 'Sales', 'HR'];
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <button onClick={() => onFilterChange(null)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedIndustry === null ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>All Industries</button>
      {industries.map(industry => (
        <button key={industry} onClick={() => onFilterChange(industry)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedIndustry === industry ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{industry}</button>
      ))}
    </div>
  );
};

// 📱 BOTTOM NAV TITANIUM (VERSIÓN PRO)
const MobileProBottomNav = ({ toggleStudentMode }: { toggleStudentMode: () => void }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe">
      {/* 1. INICIO (PRO) */}
      <Link href="/dashboard/pro" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/pro') ? 'text-amber-500' : 'text-slate-500 hover:text-amber-400'}`}>
        <Home size={24} strokeWidth={isActive('/dashboard/pro') ? 2.5 : 2} />
        <span className="text-[10px] font-bold tracking-wider">Hub</span>
      </Link>

      {/* 2. DAILY BRIEFING */}
      <Link href="/dashboard/pro" className="flex flex-col items-center gap-1 transition-colors text-slate-500 hover:text-amber-400">
        <Mic size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold tracking-wider">Studio</span>
      </Link>

      {/* 3. BOTÓN CENTRAL: TITANIUM */}
      <div className="group relative -mt-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-slate-950 shadow-lg border-4 border-slate-950 cursor-default bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 shadow-amber-500/30 ring-2 ring-amber-500/20">
          <Gem size={28} fill="currentColor" />
        </div>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-500 tracking-widest">
          PRO
        </span>
      </div>

      {/* 4. MÉTRICAS */}
      <Link href="/dashboard/pro" className="flex flex-col items-center gap-1 transition-colors text-slate-500 hover:text-amber-400">
        <BarChart3 size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold tracking-wider">Stats</span>
      </Link>

      {/* 5. VOLVER A STUDENT MODE */}
      <button onClick={toggleStudentMode} className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors active:scale-95">
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold tracking-wider">Student</span>
      </button>
    </div>
  );
};

// ============================================================================
// ==================== COMPONENTES CON LÓGICA CONECTADA ====================
// ============================================================================

const ExecutiveKPICard = ({ kpis }: { kpis: any }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/20">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Total XP</p>
      <p className="text-2xl font-bold text-amber-400">{kpis.totalXP?.toLocaleString() || 0}</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/20">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Level</p>
      <p className="text-2xl font-bold text-emerald-400">{kpis.currentLevel || 1}</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/20">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Accuracy</p>
      <p className="text-2xl font-bold text-blue-400">{kpis.accuracy || 0}%</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/20">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Fluency</p>
      <p className="text-2xl font-bold text-purple-400">{kpis.fluencyScore || 0}/100</p>
    </div>
  </div>
);

const ProHeaderStats = ({ kpis }: { kpis: any }) => (
  <div className="flex items-center gap-6 bg-slate-900/80 backdrop-blur-md px-6 py-3 border border-slate-800 rounded-xl shadow-2xl">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Gem size={18} /></div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</p>
        <p className="text-sm font-bold text-white">Titanium</p>
      </div>
    </div>
    <div className="w-[1px] h-8 bg-slate-800"></div>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><BarChart3 size={18} /></div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Accuracy</p>
        <p className="text-sm font-bold text-white">{kpis.accuracy || 0}%</p>
      </div>
    </div>
  </div>
);

const ProTimelineNode = ({ lesson, index, statusData, isLast }: any) => {
  const router = useRouter();

  // 🔥 LÓGICA DE ESTADO REAL
  let isLocked = true;
  let isCompleted = false;
  let isActive = false;

  if (statusData) {
    if (statusData.status === 'completed') {
      isCompleted = true;
      isLocked = false;
    } else if (statusData.status === 'active' || statusData.is_unlocked) {
      isActive = true;
      isLocked = false;
    }
  } else if (lesson.id === 'pro-b1-1') {
    isActive = true;
    isLocked = false;
  }

  const score = statusData?.score || 0;

  const handleNavigate = () => {
    if (!isLocked) {
      router.push(`/lesson/${lesson.id}?type=pro`);
    }
  };

  return (
    <div className={`relative flex w-full mb-8 pl-12 group transition-opacity ${isLocked ? 'opacity-60' : 'opacity-100'}`}>
      {!isLast && (
        <div className={`absolute left-[1.9rem] top-[3rem] bottom-[-2rem] w-[2px] z-0 ${isCompleted ? 'bg-amber-500/40' : 'bg-slate-800'}`}></div>
      )}

      <div className="absolute left-[0.5rem] top-1 z-20">
        <div className={`
          w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all duration-300 bg-slate-950
          ${isLocked ? 'border-slate-800 text-slate-700' : ''}
          ${isActive ? 'border-blue-500 text-blue-500 animate-pulse shadow-blue-500/40' : ''}
          ${isCompleted ? 'border-amber-500 text-amber-500 shadow-amber-500/20' : ''}
        `}>
          {isLocked && <Lock size={18} />}
          {isActive && <Play size={18} fill="currentColor" />}
          {isCompleted && <Check size={24} strokeWidth={3} />}
        </div>
      </div>

      <div 
        onClick={handleNavigate}
        className={`
          flex-1 p-5 rounded-xl border transition-all duration-300 flex items-center justify-between
          ${isLocked ? 'border-slate-900 bg-slate-900/20 cursor-not-allowed' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 cursor-pointer hover:bg-slate-800 shadow-lg shadow-black/10'}
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
              <span>{score}/100</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase">Score</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// ==================== PÁGINA PRINCIPAL (CONEXIÓN AL BACKEND) ==============
// ============================================================================

export default function ProfessionalDashboard() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();
  
  // ESTADOS
  const [proProgress, setProProgress] = useState<any[]>([]);
  const [kpis, setKpis] = useState({ totalXP: 0, currentLevel: 1, accuracy: 0, fluencyScore: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUserPremium, setIsUserPremium] = useState(true); 

  // ESTADOS DE UI
  const [showReadingStudio, setShowReadingStudio] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // --- EFECTO: CARGAR DATOS REALES CON BUST DE CACHÉ ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const headers = { 
          'Authorization': safeToken,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        };

        const mapRes = await fetch(`${API_URL}/api/v1/progress/map`, { 
          headers,
          cache: 'no-store'
        });
        if (mapRes.ok) {
          const mapData = await mapRes.json();
          setProProgress(mapData.pro || []);
        }

        const statsRes = await fetch(`${API_URL}/api/v1/progress/stats`, { 
          headers,
          cache: 'no-store' 
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setKpis({
            totalXP: statsData.total_xp || 0,
            currentLevel: parseInt(statsData.level_label?.split(' ')[0]) || 1, 
            accuracy: statsData.accuracy || 0, 
            fluencyScore: statsData.fluency_score || 0 
          });
        }
      } catch (error) {
        console.error("Error fetching pro data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getLessonData = (lessonId: string) => {
    return proProgress.find(p => p.lesson_id === lessonId);
  };

  const handleReturnToStudent = () => {
    setMode('student');
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-500">
        <Activity className="animate-spin mb-4" size={48} />
        <span className="uppercase tracking-widest text-xs font-bold animate-pulse">Cargando Executive Interface...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 relative pb-24 md:pb-0">
      {!isUserPremium && <UpgradeModal />}
      
      {/* HEADER ESCRITORIO */}
      <header className="sticky top-0 z-40 px-6 md:px-8 h-20 md:h-24 flex items-center justify-between bg-gradient-to-b from-slate-950 to-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white uppercase">
            Onix<span className="font-bold text-amber-500">Pro</span>
          </h1>
          <span className="hidden md:inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-500 rounded-full uppercase tracking-widest font-bold">
            Titanium
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleReturnToStudent} className="hidden md:flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest hover:text-white transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-600">
            <ArrowLeft size={14} /> Student Mode
          </button>
          <div className="hidden lg:block">
            <ProHeaderStats kpis={kpis} />
          </div>
        </div>
      </header>

      <div className="px-4 md:px-12 max-w-7xl mx-auto pt-8">
        {/* HERO */}
        <div className="mb-12 md:mb-24 md:pt-10">
          <h2 className="text-4xl md:text-6xl font-thin text-white mb-4 md:mb-6 tracking-tight leading-tight">
            Executive <br className="hidden md:block"/>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl">
              Hub.
            </span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-light max-w-3xl leading-relaxed border-l-2 border-amber-500/50 pl-4 md:pl-6">
            Bienvenido a su centro de comando. Progreso y métricas en tiempo real.
          </p>
        </div>

        <ExecutiveKPICard kpis={kpis} />
        
        <FluencyLabPanel onOpenStudio={() => setShowReadingStudio(true)} />

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="text-amber-400" size={24} />
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Daily Executive Briefing</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <div className="space-y-3">
            {DAILY_BRIEFINGS.map((briefing) => (
              <DailyBriefingWidget key={briefing.id} briefing={briefing} />
            ))}
          </div>
        </section>

        <div className="mb-8">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4">Filter Specializations</h3>
          <SpecializationFilter selectedIndustry={selectedIndustry} onFilterChange={setSelectedIndustry} />
        </div>

        {/* CURRICULUM CONECTADO */}
        <div className="relative">
          {PRO_CURRICULUM.map((section, sIdx) => (
            <div key={section.id} className="mb-24 relative">
              <div className="flex items-center gap-4 mb-8 md:mb-12">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-amber-500 shadow-inner">
                  <section.icon size={20} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{section.title}</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4"></div>
              </div>

              <div className="md:pl-4">
                {section.lessons.map((lesson, lIdx) => (
                  <ProTimelineNode 
                    key={lesson.id}
                    lesson={lesson}
                    index={lIdx}
                    statusData={getLessonData(lesson.id)} 
                    isLast={lIdx === section.lessons.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 🔥 MODAL DE LECTURA (IA) Y BOTTOM NAV */}
      {showReadingStudio && <ReadingStudio onClose={() => setShowReadingStudio(false)} />}
      <MobileProBottomNav toggleStudentMode={handleReturnToStudent} />
      
    </div>
  );
}
