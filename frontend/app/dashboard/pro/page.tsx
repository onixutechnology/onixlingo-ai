'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link'; 
import { useUIStore } from '@/store/uiStore';
import Cookies from 'js-cookie'; 

import { 
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check, 
  PieChart, Users, Building, LogOut, ArrowLeft, Gem, Star, 
  Crown, Mic, Volume2, BarChart3, Bell, X, BookOpen, Activity,
  Home, BookA, User, Languages, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';

import { UpgradeModal } from '@/components/pro/UpgradeModal';
import { ReadingStudio } from '@/components/pro/ReadingStudio';

interface KPIStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  fluencyScore: number;
}

interface LessonStatus {
  lesson_id: string;
  status: 'locked' | 'active' | 'completed';
  is_unlocked: boolean;
  score?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

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
];

// ============================================================================
// ==================== NUEVO MODAL DE ESTADÍSTICAS Y RANKING =================
// ============================================================================
const ExecutiveStatsModal = ({ onClose, kpis, completedLessons }: { onClose: () => void, kpis: KPIStats, completedLessons: number }) => {
  // Generamos un Leaderboard dinámico basado en el XP actual del usuario
  const MOCK_LEADERBOARD = [
    { rank: 1, alias: "Exec_Alpha", xp: kpis.totalXP + 1250, isMe: false },
    { rank: 2, alias: "Director_V", xp: kpis.totalXP + 450, isMe: false },
    { rank: 3, alias: "Tú (Titanium)", xp: kpis.totalXP, isMe: true },
    { rank: 4, alias: "User_88X", xp: Math.max(0, kpis.totalXP - 320), isMe: false },
    { rank: 5, alias: "Manager_B2", xp: Math.max(0, kpis.totalXP - 850), isMe: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Executive Analytics</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Métricas de Uso */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Uso de la Plataforma</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                <p className="text-3xl font-black text-amber-400 mb-1">{completedLessons}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Unidades Completadas</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                <p className="text-3xl font-black text-emerald-400 mb-1">{kpis.accuracy}%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Precisión Promedio</p>
              </div>
            </div>
          </div>

          {/* Ranking Anónimo */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-amber-500" /> Global Executive Ranking
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              {MOCK_LEADERBOARD.map((user, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 ${user.isMe ? 'bg-amber-500/10' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className={`font-black text-lg ${user.rank === 1 ? 'text-amber-400' : user.rank === 2 ? 'text-slate-300' : user.rank === 3 ? 'text-amber-700' : 'text-slate-600'}`}>
                      #{user.rank}
                    </span>
                    <span className={`font-bold text-sm ${user.isMe ? 'text-amber-400' : 'text-slate-300'}`}>
                      {user.alias}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-amber-500/50 transition-all active:scale-95"
      >
        📖 Open Reading Studio
      </button>
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

const DailyBriefingWidget = ({ briefing }: { briefing: any }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/50 transition-colors">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Daily Brief</span>
        <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase">{briefing.difficulty}</span>
        <span className="text-[10px] px-2 py-1 rounded bg-slate-800/50 border border-slate-700 text-slate-400 uppercase">{briefing.industry}</span>
      </div>
      <p className="text-sm text-slate-300 italic mb-2">{briefing.text}</p>
    </div>
    <button className="p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 ml-4 transition-colors">
      <Volume2 size={18} />
    </button>
  </div>
);

// 📱 BOTTOM NAV CONECTADA (LOS 5 BOTONES FUNCIONALES)
const MobileProBottomNav = ({ 
  toggleStudentMode, 
  onOpenStudio, 
  onOpenStats, 
  onManagePlan, 
  managingPlan 
}: { 
  toggleStudentMode: () => void, 
  onOpenStudio: () => void, 
  onOpenStats: () => void,
  onManagePlan: () => void,
  managingPlan: boolean
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe">
      
      {/* 1. HUB (Sube arriba) */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 transition-colors text-amber-500">
        <Home size={24} strokeWidth={2.5} />
        <span className="text-[10px] font-bold tracking-wider">Hub</span>
      </button>

      {/* 2. STUDIO (Abre Fluency Lab) */}
      <button onClick={onOpenStudio} className="flex flex-col items-center gap-1 transition-colors text-slate-500 hover:text-amber-400 active:scale-95">
        <Mic size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold tracking-wider">Studio</span>
      </button>

      {/* 3. PRO (Gestionar Stripe / Suscripción) */}
      <button onClick={onManagePlan} disabled={managingPlan} className="group relative -mt-8 active:scale-95 transition-transform disabled:opacity-80">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-slate-950 shadow-lg border-4 border-slate-950 bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 shadow-amber-500/30 ring-2 ring-amber-500/20">
          {managingPlan ? <Loader2 size={28} className="animate-spin" /> : <Gem size={28} fill="currentColor" />}
        </div>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-500 tracking-widest">
          {managingPlan ? '...' : 'PRO'}
        </span>
      </button>

      {/* 4. STATS (Abre el Modal de Ranking) */}
      <button onClick={onOpenStats} className="flex flex-col items-center gap-1 transition-colors text-slate-500 hover:text-amber-400 active:scale-95">
        <BarChart3 size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold tracking-wider">Stats</span>
      </button>

      {/* 5. STUDENT (Vuelve al LMS Normal) */}
      <button onClick={toggleStudentMode} className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors active:scale-95">
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold tracking-wider">Student</span>
      </button>
    </div>
  );
};

// ============================================================================
// ==================== PÁGINA PRINCIPAL ======================================
// ============================================================================

export default function ProfessionalDashboard() {
  const router = useRouter();
  
  const { setMode, activeLanguage, setLanguage } = useUIStore();
  
  const [proProgress, setProProgress] = useState<LessonStatus[]>([]);
  const [kpis, setKpis] = useState<KPIStats>({ totalXP: 0, currentLevel: 1, accuracy: 0, fluencyScore: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUserPremium, setIsUserPremium] = useState(false); 

  // Estados de Modales y Vistas
  const [showReadingStudio, setShowReadingStudio] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [managingPlan, setManagingPlan] = useState(false);

  // Módulo B1 abierto por defecto
  const [expandedSections, setExpandedSections] = useState<string[]>([PRO_CURRICULUM[0].id]);

  useEffect(() => {
    document.body.style.backgroundColor = '#020617'; 
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

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
        };

        const userRes = await fetch(`${API_URL}/api/v1/users/me`, { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setIsUserPremium(userData.is_pro || userData.tier === 'titanium');
        }

        const mapRes = await fetch(`${API_URL}/api/v1/progress/map`, { headers });
        if (mapRes.ok) {
          const mapData = await mapRes.json();
          setProProgress(mapData.pro || []);
        }

        const statsRes = await fetch(`${API_URL}/api/v1/progress/stats`, { headers });
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

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // 🔥 LÓGICA DEL BOTÓN PRO (STRIPE BILLING PORTAL)
  const handleManagePlan = async () => {
    setManagingPlan(true);
    try {
      const token = Cookies.get('access_token');
      const res = await fetch(`${API_URL}/api/v1/billing/create-portal-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url; 
      } else {
        alert("El portal de facturación requiere configuración en el backend.");
      }
    } catch (error) {
      alert("Error conectando con el portal de facturación.");
    } finally {
      setManagingPlan(false);
    }
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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 pb-24 md:pb-12">
      
      {!isUserPremium && <UpgradeModal />}
      
      <header className="sticky top-0 z-40 px-6 md:px-8 h-20 md:h-24 flex items-center justify-between bg-gradient-to-b from-slate-950 to-slate-950/90 backdrop-blur-md border-b border-slate-900">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white uppercase">
            Onix<span className="font-bold text-amber-500">Pro</span>
          </h1>
          <span className="hidden md:inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-500 rounded-full uppercase tracking-widest font-bold">
            Titanium
          </span>
        </div>
        <button onClick={handleReturnToStudent} className="hidden md:flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest hover:text-white transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-600">
          <ArrowLeft size={14} /> Student Mode
        </button>
      </header>

      <div className="px-4 md:px-12 max-w-5xl mx-auto pt-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-thin text-white mb-4 tracking-tight">
            Executive <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl">Hub.</span>
          </h2>
        </div>

        {activeLanguage === 'en' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total XP</p>
                <p className="text-2xl font-bold text-amber-400">{kpis.totalXP}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-slate-600 transition-colors" onClick={() => setShowStatsModal(true)}>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Accuracy</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-blue-400">{kpis.accuracy}%</p>
                  <BarChart3 size={18} className="text-slate-600" />
                </div>
              </div>
            </div>

            <FluencyLabPanel onOpenStudio={() => setShowReadingStudio(true)} />

            {/* 🔥 CURRÍCULUM PLEGABLE (ACCORDION) */}
            <div className="space-y-6">
              {PRO_CURRICULUM.map((section, sIdx) => {
                const isExpanded = expandedSections.includes(section.id);
                
                return (
                  <div key={section.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden transition-all duration-300">
                    
                    <div 
                      onClick={() => toggleSection(section.id)}
                      className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-700 text-amber-500 shadow-inner group-hover:bg-slate-900 transition-colors">
                          <section.icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">{section.title}</h3>
                          <p className="text-sm text-slate-500 hidden sm:block">{section.description}</p>
                        </div>
                      </div>
                      <div className={`p-2 rounded-full bg-slate-950 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-400' : ''}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>

                    <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                      <div className="px-6 pb-8 md:px-10">
                        <div className="h-[1px] w-full bg-slate-800 mb-8"></div>
                        {section.lessons.map((lesson, lIdx) => {
                          const statusData = getLessonData(lesson.id);
                          const isLocked = !statusData && lesson.id !== 'pro-b1-1';
                          const isCompleted = statusData?.status === 'completed';
                          const isActive = statusData?.status === 'active' || lesson.id === 'pro-b1-1';

                          return (
                            <div key={lesson.id} className={`relative flex w-full mb-6 pl-10 group transition-opacity ${isLocked ? 'opacity-50' : 'opacity-100'}`}>
                              {lIdx !== section.lessons.length - 1 && (
                                <div className="absolute left-[1.3rem] top-[3rem] bottom-[-1.5rem] w-[2px] bg-slate-800"></div>
                              )}

                              <div className="absolute left-0 top-1 z-20">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all bg-slate-950 ${isLocked ? 'border-slate-800 text-slate-700' : isActive ? 'border-blue-500 text-blue-500' : 'border-amber-500 text-amber-500'}`}>
                                  {isLocked ? <Lock size={16} /> : (isCompleted ? <Check size={20} /> : <Play size={16} fill="currentColor" />)}
                                </div>
                              </div>

                              <div 
                                onClick={() => !isLocked && router.push(`/lesson/${lesson.id}?type=pro`)}
                                className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-between ${isLocked ? 'border-slate-900 bg-slate-900/20' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 cursor-pointer hover:bg-slate-800'}`}
                              >
                                <div>
                                  <h4 className={`text-base font-bold ${isLocked ? 'text-slate-600' : 'text-slate-300'}`}>{lesson.title}</h4>
                                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Unit {lIdx + 1}</p>
                                </div>
                                {isCompleted && (
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm"><Star size={14} fill="currentColor" /> {statusData?.score || 0}/100</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center mt-12">
            <Languages size={40} className="text-amber-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Módulo en Sincronización</h3>
            <button onClick={() => setLanguage('en')} className="bg-amber-500 text-slate-950 font-bold px-8 py-3 rounded-xl mt-6 active:scale-95 transition-transform">Regresar a Inglés</button>
          </div>
        )}
      </div>

      {/* Renderizado Condicional de Modales */}
      {showReadingStudio && <ReadingStudio onClose={() => setShowReadingStudio(false)} />}
      
      {showStatsModal && (
        <ExecutiveStatsModal 
          onClose={() => setShowStatsModal(false)} 
          kpis={kpis} 
          completedLessons={proProgress.filter(p => p.status === 'completed').length} 
        />
      )}
      
      {/* Barra Inferior Móvil con todas las funciones */}
      <MobileProBottomNav 
        toggleStudentMode={handleReturnToStudent} 
        onOpenStudio={() => setShowReadingStudio(true)}
        onOpenStats={() => setShowStatsModal(true)} 
        onManagePlan={handleManagePlan}
        managingPlan={managingPlan}
      />
    </div>
  );
}