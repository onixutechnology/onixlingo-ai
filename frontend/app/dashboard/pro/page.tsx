'use client';

/**
 * ==============================================================================
 * ONIXLINGO PRO - EXECUTIVE SUITE (TITANIUM BLACK v2)
 * ==============================================================================
 * RUTA: /dashboard/pro/page.tsx
 * TEMA: "Midnight Executive" - Ultra Dark Mode, Gold Accents, Deep Blue Gradients.
 * ESTADO: Producción (Curriculum Completo & Navegación Activa).
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { 
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check, 
  PieChart, Users, Building, LogOut, ArrowLeft, Gem, Star, ChevronRight, Crown, Lightbulb
} from 'lucide-react';

// --- 🔒 IMPORTACIÓN DEL PAYWALL ---
import { UpgradeModal } from '@/components/pro/UpgradeModal';

// --- DATA: EXECUTIVE CURRICULUM (60 LECCIONES) ---
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
    id: 'mastery',
    title: 'Industry Mastery (Specialized)',
    level: 'MASTERY',
    color: 'emerald',
    icon: Crown,
    description: 'Innovación, tecnología disruptiva y tendencias de futuro.',
    lessons: [
      { id: 'pro-mastery-1', title: 'AI & Tech Disruption', desc: 'Inteligencia Artificial aplicada.' },
      { id: 'pro-mastery-2', title: 'Fintech & Blockchain', desc: 'El futuro del dinero.' },
      { id: 'pro-mastery-3', title: 'Biotech Innovations', desc: 'Salud y tecnología.' },
      { id: 'pro-mastery-4', title: 'Green Energy Transition', desc: 'Sostenibilidad industrial.' },
      { id: 'pro-mastery-5', title: 'Supply Chain Logistics', desc: 'Logística global compleja.' },
      { id: 'pro-mastery-6', title: 'Luxury Brand Management', desc: 'Mercado de ultra-lujo.' },
      { id: 'pro-mastery-7', title: 'Real Estate Development', desc: 'Desarrollo urbano masivo.' },
      { id: 'pro-mastery-8', title: 'Venture Capital Pitching', desc: 'Levantamiento de capital.' },
      { id: 'pro-mastery-9', title: 'Cybersecurity Protocols', desc: 'Defensa digital corporativa.' },
      { id: 'pro-mastery-10', title: 'Mastery Capstone: Building a Unicorn', desc: 'Creación de empresas billonarias.' },
    ]
  }
];

// --- COMPONENT: PRO HEADER STATS ---
const ProHeaderStats = () => (
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

// --- COMPONENT: PRO TIMELINE NODE (INTERACTIVE) ---
const ProTimelineNode = ({ lesson, index, status, isLast }: any) => {
    const router = useRouter(); // 👈 Hook para navegación
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';
    const isActive = status === 'active';

    const handleNavigate = () => {
        if (!isLocked) {
            router.push(`/lesson/${lesson.id}`);
        }
    };

    // --- RENDERIZADO "ACTIVE" (Tarjeta Grande Maximizada) ---
    if (isActive) {
        return (
            <div className="relative w-full mb-16 pl-12 group">
                 {/* Línea conectora */}
                 {!isLast && <div className="absolute left-[1.9rem] top-10 bottom-[-4rem] w-[2px] bg-slate-800 z-0"></div>}
                
                {/* Icono Flotante */}
                <div className="absolute left-0 top-0 z-20">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse">
                        <Play size={28} fill="currentColor" className="ml-1" />
                    </div>
                </div>

                {/* Tarjeta Principal */}
                <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.15)] group-hover:shadow-[0_0_80px_rgba(37,99,235,0.25)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e3a8a] z-0"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row">
                        {/* Info */}
                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    En Progreso
                                </span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Unit {index + 1}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{lesson.title}</h3>
                            <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl leading-relaxed">{lesson.desc}</p>
                            
                            {/* Barra de Progreso */}
                            <div className="w-full max-w-md">
                                <div className="flex justify-between text-xs font-bold text-amber-500 mb-2 tracking-widest">
                                    <span>AVANCE DE LECCIÓN</span>
                                    <span>0%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[5%] shadow-[0_0_20px_rgba(245,158,11,0.8)] relative"></div>
                                </div>
                            </div>
                        </div>

                        {/* Botón de Acción */}
                        <div 
                            onClick={handleNavigate} // 👈 Acción de click
                            className="md:w-80 bg-slate-900/50 border-l border-white/5 p-8 flex flex-col items-center justify-center text-center relative group/btn cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center mb-4 group-hover/btn:scale-110 transition-transform duration-300 bg-slate-900 shadow-xl">
                                <Play size={32} className="text-amber-500 ml-1" fill="currentColor" />
                            </div>
                            <h5 className="text-white font-bold text-lg mb-1">Continuar</h5>
                            <p className="text-slate-500 text-xs uppercase tracking-widest">Start Lesson</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDERIZADO STANDARD (LOCKED) ---
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
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function ProfessionalDashboard() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();
  
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificación de Acceso
  useEffect(() => {
    const tier = localStorage.getItem('onix_tier');
    if (tier === 'TITANIUM') {
        setIsUserPremium(true);
    }
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

  // Simulación de Progreso: La primera lección de cada sección está activa
  const getLessonStatus = (id: string, sectionIndex: number, lessonIndex: number) => {
     if (lessonIndex === 0) return 'active'; // Primera lección activa para probar
     return 'locked';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 relative">
      
      {/* PAYWALL */}
      {!isLoading && !isUserPremium && <UpgradeModal />}

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 bg-black border-r border-slate-900 hidden lg:flex flex-col items-center py-8 z-50">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-12 shadow-lg shadow-amber-900/20">
            <span className="font-serif font-black text-slate-900 text-xl">O</span>
        </div>
        <nav className="flex flex-col gap-8 w-full px-2">
            <button className="p-3 text-amber-500 bg-slate-900/80 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"><Briefcase size={22}/></button>
            <button className="p-3 text-slate-600 hover:text-slate-300 transition-colors"><TrendingUp size={22}/></button>
            <button className="p-3 text-slate-600 hover:text-slate-300 transition-colors"><Globe size={22}/></button>
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
                    <ProHeaderStats />
                </div>
            </div>
        </header>

        <div className="px-6 md:px-12 max-w-6xl mx-auto pb-32">
            
            {/* HERO */}
            <div className="mb-24 pt-10">
                <h2 className="text-5xl md:text-6xl font-thin text-white mb-6 tracking-tight">
                    Good evening, <br/>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl">
                        Executive.
                    </span>
                </h2>
                <p className="text-slate-400 text-lg font-light max-w-3xl leading-relaxed border-l-2 border-amber-500/50 pl-6">
                    Su enfoque actual es <strong className="text-white">Dominio Estratégico Global</strong>. 
                    Acceda a sus módulos de alta dirección a continuación.
                </p>
            </div>

            {/* CURRICULUM */}
            <div className="relative">
                {PRO_CURRICULUM.map((section, sIdx) => (
                    <div key={section.id} className="mb-32 relative">
                        
                        {/* Title */}
                        <div className="flex items-center gap-4 mb-12">
                             <div className={`
                                w-10 h-10 flex items-center justify-center rounded-lg
                                ${section.level === 'B1' ? 'bg-slate-800 text-slate-300' : 'bg-slate-900 border border-slate-800 text-slate-500'}
                             `}>
                                <section.icon size={20} />
                             </div>
                             <h3 className="text-2xl font-bold text-white tracking-tight">{section.title}</h3>
                             <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4"></div>
                        </div>

                        {/* Lessons */}
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