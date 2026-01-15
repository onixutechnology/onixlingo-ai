'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import Cookies from 'js-cookie'; // 📦 Necesario para leer el token
import { 
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check, 
  PieChart, Users, Building, LogOut, ArrowLeft, Gem, Star, 
  Crown, Mic, Volume2, BarChart3, Bell, X, BookOpen, Activity
} from 'lucide-react';

import { UpgradeModal } from '@/components/pro/UpgradeModal';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

// ============================================================================
// ======================== DATA ESTÁTICA (ESTRUCTURA VISUAL) ===============
// ============================================================================
// Mantenemos PRO_CURRICULUM y DAILY_BRIEFINGS porque definen el orden visual,
// pero el ESTADO (candados) vendrá de la base de datos.

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
  // ... (El resto de tus secciones C1, C2, Titanium se mantienen igual)
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
// ==================== COMPONENTES VISUALES (SIN CAMBIOS) ==================
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
    <button className="p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 ml-4">
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

const ReadingStudioModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-8 py-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3"><BookOpen className="text-amber-400" /> Reading Studio</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><X className="text-slate-400" size={24} /></button>
      </div>
      <div className="p-8 space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-slate-200 leading-relaxed min-h-[150px] text-sm">
           "Our strategic imperative is to leverage synergistic partnerships..."
        </div>
        <div className="flex gap-4">
           <button className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-widest"><Volume2 size={18} className="inline mr-2"/> Play Audio</button>
           <button className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold uppercase tracking-widest"><Mic size={18} className="inline mr-2"/> Start Recording</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// ==================== COMPONENTES CON LÓGICA CONECTADA ====================
// ============================================================================

// [COMPONENTE 3] KPI CARD (Ahora recibe props dinámicos)
const ExecutiveKPICard = ({ kpis }: { kpis: any }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Total XP</p>
      <p className="text-2xl font-bold text-amber-400">{kpis.totalXP?.toLocaleString() || 0}</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Level</p>
      <p className="text-2xl font-bold text-emerald-400">{kpis.currentLevel || 1}</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Accuracy</p>
      <p className="text-2xl font-bold text-blue-400">{kpis.accuracy || 0}%</p>
    </div>
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Fluency</p>
      <p className="text-2xl font-bold text-purple-400">{kpis.fluencyScore || 0}/100</p>
    </div>
  </div>
);

// [COMPONENTE 5] PRO HEADER STATS (Conectado)
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
        <p className="text-sm font-bold text-white">{kpis.accuracy}%</p>
      </div>
    </div>
  </div>
);

// [COMPONENTE 6] NODE DE LÍNEA DE TIEMPO (AHORA INTELIGENTE)
// Recibe "statusData" (objeto de DB) en lugar de un string "status"
const ProTimelineNode = ({ lesson, index, statusData, isLast }: any) => {
  const router = useRouter();

  // 🔥 LÓGICA DE ESTADO REAL
  // Si no hay datos en la DB, asumimos que está "locked" (bloqueado)
  const status = statusData?.status || 'locked';
  const score = statusData?.score || 0;

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  const handleNavigate = () => {
    if (!isLocked) {
      // Navegamos pasando el tipo PRO
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
  
  // ESTADOS (Ahora se llenan con fetch)
  const [proProgress, setProProgress] = useState<any[]>([]);
  const [kpis, setKpis] = useState({ totalXP: 0, currentLevel: 1, accuracy: 0, fluencyScore: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUserPremium, setIsUserPremium] = useState(true); 

  // ESTADOS DE UI
  const [showReadingStudio, setShowReadingStudio] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // --- EFECTO: CARGAR DATOS REALES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // ✅ CORREGIDO: Usamos el token directo porque ya incluye el prefijo Bearer
        const headers = { 'Authorization': token };

        // 1. Obtener Mapa de Progreso
        const mapRes = await fetch(`${API_URL}/api/v1/progress/map`, { headers });
        if (mapRes.ok) {
          const mapData = await mapRes.json();
          // Guardamos solo la lista 'pro'
          setProProgress(mapData.pro || []);
        }

        // 2. Obtener Estadísticas
        const statsRes = await fetch(`${API_URL}/api/v1/progress/stats`, { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setKpis({
            totalXP: statsData.total_xp || 0,
            currentLevel: parseInt(statsData.level_label?.split(' ')[0]) || 1, 
            accuracy: 88, // Podrías calcular esto real si el backend lo envía
            fluencyScore: 82
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

  // Helper para buscar el estado en la lista descargada
  const getLessonData = (lessonId: string) => {
    return proProgress.find(p => p.lesson_id === lessonId);
  };

  const handleReturnToStudent = () => {
    setMode('student');
    router.push('/dashboard');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 animate-pulse">Cargando Executive Interface...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 relative">
      {!isUserPremium && <UpgradeModal />}
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 px-8 h-24 flex items-center justify-between bg-gradient-to-b from-slate-950 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <h1 className="text-xl font-light tracking-[0.2em] text-white uppercase">
            Onix<span className="font-bold text-amber-500">Pro</span>
          </h1>
          <span className="hidden md:inline-block px-3 py-1 bg-slate-900/80 border border-slate-800 text-[10px] text-slate-500 rounded-full uppercase tracking-widest backdrop-blur-sm">
            Titanium
          </span>
        </div>
        <div className="pointer-events-auto flex items-center gap-6">
          <button onClick={handleReturnToStudent} className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            <ArrowLeft size={14} /> Student Mode
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
            Executive <br/>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl">
              Hub.
            </span>
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-3xl leading-relaxed border-l-2 border-amber-500/50 pl-6">
            Bienvenido a su centro de comando. Progreso y métricas en tiempo real.
          </p>
        </div>

        <ExecutiveKPICard kpis={kpis} />
        <FluencyLabPanel onOpenStudio={() => setShowReadingStudio(true)} />

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="text-amber-400" size={24} />
            <h3 className="text-2xl font-bold text-white">Daily Executive Briefing</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <div className="space-y-3">
            {DAILY_BRIEFINGS.map((briefing) => (
              <DailyBriefingWidget key={briefing.id} briefing={briefing} />
            ))}
          </div>
        </section>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Filter Specializations</h3>
          <SpecializationFilter selectedIndustry={selectedIndustry} onFilterChange={setSelectedIndustry} />
        </div>

        {/* CURRICULUM CONECTADO */}
        <div className="relative">
          {PRO_CURRICULUM.map((section, sIdx) => (
            <div key={section.id} className="mb-32 relative">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-500">
                  <section.icon size={20} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">{section.title}</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4"></div>
              </div>

              <div className="md:pl-4">
                {section.lessons.map((lesson, lIdx) => (
                  <ProTimelineNode 
                    key={lesson.id}
                    lesson={lesson}
                    index={lIdx}
                    // 🔥 AQUÍ ESTÁ LA MAGIA: Pasamos el objeto real de DB
                    statusData={getLessonData(lesson.id)} 
                    isLast={lIdx === section.lessons.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}