'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { useUIStore } from '@/store/uiStore';
import Cookies from 'js-cookie'; 
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check, 
  PieChart, Users, Building, ArrowLeft, Gem, Star, 
  Crown, Mic, Volume2, Trophy, BarChart3, Bell, X, BookOpen, Activity,
  Home, User, Languages, ChevronDown, Loader2,
  Rocket, Shield, Video, MessageSquare, Target, Zap
} from 'lucide-react';

import { UpgradeModal } from '@/components/pro/UpgradeModal';
import { ReadingStudio } from '@/components/pro/ReadingStudio';
import apiClient from '@/lib/apiClient';
import { PRO_CURRICULUM_FR } from '@/data/curriculum_pro_fr';

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

const PRO_CURRICULUM = [
  {
    id: 'exec-b1',
    title: 'Executive Foundation (B1)',
    level: 'B1',
    color: 'slate',
    icon: Users,
    description: 'Fundamentos de comunicación corporativa, etiqueta y networking esencial.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-b1-${i + 1}`, 
      title: i === 0 ? 'Professional Introductions' : i === 1 ? 'Formal Emailing' : i === 2 ? 'Business Travel' : i === 9 ? 'B1 Milestone Review' : `Corporate Communication Pt. ${i}`, 
      desc: 'Habilidades esenciales para el día a día corporativo.'
    }))
  },
  {
    id: 'exec-b2',
    title: 'Management Skills (B2)',
    level: 'B2',
    color: 'blue',
    icon: PieChart,
    description: 'Gestión de equipos, liderazgo intermedio y resolución de conflictos.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-b2-${i + 1}`, 
      title: i === 0 ? 'Leading Effective Meetings' : i === 1 ? 'Negotiation Fundamentals' : i === 9 ? 'B2 Milestone Review' : `Team Management Pt. ${i}`, 
      desc: 'Habilidades para mandos intermedios y gerencia.'
    }))
  },
  {
    id: 'exec-c1',
    title: 'Advanced Corporate (C1)',
    level: 'C1',
    color: 'indigo',
    icon: Briefcase,
    description: 'Negociaciones de alto nivel, persuasión y presentaciones a inversionistas.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-c1-${i + 1}`, 
      title: i === 0 ? 'Pitching to Investors' : i === 1 ? 'Crisis Management Comms' : i === 9 ? 'C1 Milestone Review' : `Advanced Strategy Pt. ${i}`, 
      desc: 'Dominio avanzado del inglés de negocios.'
    }))
  },
  {
    id: 'exec-c2',
    title: 'Executive Presence (C2)',
    level: 'C2',
    color: 'purple',
    icon: Crown,
    description: 'Dominio total del idioma, diplomacia corporativa y oratoria ejecutiva.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-c2-${i + 1}`, 
      title: i === 0 ? 'Public Speaking for CEOs' : i === 1 ? 'Diplomatic Phrasing' : i === 9 ? 'C2 Milestone Review' : `Executive Eloquence Pt. ${i}`, 
      desc: 'El nivel más alto de elocuencia y fluidez.'
    }))
  },
  {
    id: 'exec-exec',
    title: 'Boardroom Dynamics (Exec)',
    level: 'Exec',
    color: 'amber',
    icon: Building,
    description: 'Inglés especializado para juntas directivas, M&A y estrategia global.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-exec-${i + 1}`, 
      title: i === 0 ? 'Mergers & Acquisitions Vocab' : i === 1 ? 'Board of Directors Meetings' : i === 9 ? 'Exec Milestone Review' : `Boardroom Tactics Pt. ${i}`, 
      desc: 'Casos reales de la alta dirección empresarial.'
    }))
  },
  {
    id: 'exec-mastery',
    title: 'Global Leadership (Mastery)',
    level: 'Mastery',
    color: 'rose',
    icon: Globe,
    description: 'El grado máximo. Comunicación intercultural y expansión internacional.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-mastery-${i + 1}`, 
      title: i === 0 ? 'Cross-Cultural Leadership' : i === 1 ? 'Global Market Expansion' : i === 9 ? 'Final Mastery Evaluation' : `Global Business Pt. ${i}`, 
      desc: 'Conquista el mercado internacional sin barreras.'
    }))
  }
];

export default function ProfessionalDashboard() {
  const router = useRouter();
  const { setMode, activeLanguage } = useUIStore();
  
  const [proProgress, setProProgress] = useState<LessonStatus[]>([]);
  const [kpis, setKpis] = useState<KPIStats>({ totalXP: 0, currentLevel: 1, accuracy: 0, fluencyScore: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUserPremium, setIsUserPremium] = useState(false); 
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showReadingStudio, setShowReadingStudio] = useState(false);

  const currentCurriculum = useMemo(() => {
    if (activeLanguage === 'fr') return PRO_CURRICULUM_FR;
    return PRO_CURRICULUM;
  }, [activeLanguage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, mapRes, statsRes] = await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/progress/map'),
          apiClient.get('/progress/stats')
        ]);

        const isPro = userRes.data.is_pro || userRes.data.tier === 'titanium';
        setIsUserPremium(isPro);
        setProProgress(mapRes.data.pro || []);
        
        const statsData = statsRes.data;
        setKpis({
          totalXP: statsData.total_xp || 0,
          currentLevel: 1, 
          accuracy: statsData.accuracy || 92, 
          fluencyScore: statsData.fluency_score || 85 
        });
      } catch (error) {
        console.error("Error fetching pro data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <span className="uppercase tracking-[0.3em] text-[10px] font-black animate-pulse">Initializing Titanium Interface...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 pb-20">
      
      {!isUserPremium && <UpgradeModal />}

      {/* --- PREMIUM NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 flex items-center justify-center">
              <Crown size={14} className="text-slate-950" />
            </div>
            <span className="font-black text-white text-xs tracking-[0.2em] uppercase">Onix<span className="text-amber-500">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] font-black text-amber-500 uppercase tracking-widest">
            <Shield size={12} /> Titanium Status
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Trophy size={14} className="text-amber-500" /> {kpis.totalXP} XP</span>
            <span className="flex items-center gap-1.5"><Activity size={14} className="text-emerald-500" /> {kpis.accuracy}% ACC</span>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
            <Link href="/dashboard/leaderboard" className="text-[10px] font-black text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-widest flex items-center gap-2">
              <Trophy size={14} /> Ranking
            </Link>
            <button 
              onClick={() => { setMode('student'); router.push('/dashboard'); }}
              className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              Exit Pro
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* --- HERO SECTION --- */}
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2"
          >
            Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600">Command Center.</span>
          </motion.h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">Titanium-Grade Enterprise Training Platform</p>
        </header>

        {/* --- MAIN HUB GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          
          {/* 🤝 MEETING SIMULATOR */}
          <Link href="/dashboard/pro/meeting-room" className="group relative bg-slate-900 border border-slate-800 p-8 hover:border-amber-500/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                <Video size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Boardroom Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Ejercicios en tiempo real con una junta directiva de IA. Práctica de toma de decisiones y persuasión.</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                Enter Room <ArrowLeft size={14} className="rotate-180" />
              </div>
            </div>
          </Link>

          {/* 🎙️ SPEECH ANALYSIS */}
          <div onClick={() => setShowReadingStudio(true)} className="group relative bg-slate-900 border border-slate-800 p-8 hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Mic size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Speech Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Análisis fonético avanzado. Evalúa tu fluidez, entonación y claridad ejecutiva en cada frase.</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Launch Studio <ArrowLeft size={14} className="rotate-180" />
              </div>
            </div>
          </div>

          {/* 🏢 B2B INTERVIEW */}
          <Link href="/lesson/pro-b1-1?type=pro" className="group relative bg-slate-900 border border-slate-800 p-8 hover:border-emerald-500/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">B2B Negotiations</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Simulaciones de ventas y alianzas estratégicas. Domina el cierre de contratos en el mercado global.</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                Start Simulation <ArrowLeft size={14} className="rotate-180" />
              </div>
            </div>
          </Link>

        </div>

        {/* --- CURRICULUM GRID --- */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
            <BookOpen size={20} className="text-amber-500" /> Titanium Curriculum
          </h2>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">60 Premium Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCurriculum.map((section) => (
            <div key={section.id} className="bg-slate-900 border border-slate-800 overflow-hidden">
              <div 
                onClick={() => toggleSection(section.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500">
                    <section.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{section.title}</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{section.level} • 10 Units</p>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {expandedSections.includes(section.id) && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-slate-950/50"
                  >
                    <div className="p-4 grid grid-cols-1 gap-1">
                      {section.lessons.map((lesson, idx) => {
                        const status = proProgress.find(p => p.lesson_id === lesson.id)?.status || (lesson.id === 'pro-b1-1' ? 'active' : 'locked');
                        const isLocked = status === 'locked';
                        
                        return (
                          <div 
                            key={lesson.id}
                            onClick={() => !isLocked && router.push(`/lesson/${lesson.id}?type=pro`)}
                            className={`flex items-center justify-between p-3 border border-transparent hover:border-slate-800 transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-900'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-black ${status === 'completed' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                {status === 'completed' ? <Check size={14} /> : isLocked ? <Lock size={12} /> : idx + 1}
                              </div>
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{lesson.title}</span>
                            </div>
                            <Play size={12} className={isLocked ? 'text-slate-700' : 'text-amber-500'} />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </main>

      {showReadingStudio && <ReadingStudio onClose={() => setShowReadingStudio(false)} />}
    </div>
  );
}