'use client';

/**
 * ==============================================================================
 * ONIXLINGO PRO - EXECUTIVE SUITE (TITANIUM BLACK v2)
 * ==============================================================================
 * RUTA: /dashboard/pro/page.tsx
 * TEMA: "Midnight Executive" - Ultra Dark Mode, Gold Accents, Deep Blue Gradients.
 * ESTADO: Maximizada para impacto visual.
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { 
  Briefcase, TrendingUp, Globe, Award, Lock, Play, Check, 
  PieChart, Users, Building, LogOut, ArrowLeft, Gem, Star, ChevronRight
} from 'lucide-react';

// --- DATA: EXECUTIVE CURRICULUM ---
const PRO_CURRICULUM = [
  {
    id: 'exec-b1',
    title: 'Executive Foundation (B1)',
    level: 'B1',
    color: 'slate',
    icon: Users,
    description: 'Comunicación corporativa esencial, correos formales y networking.',
    lessons: [
      { id: 'pro-b1-1', title: 'Professional Introductions & Networking', type: 'core', desc: 'Aprende a presentarte con impacto en entornos C-Level.' },
      { id: 'pro-b1-2', title: 'Formal Emailing & Corporate Etiquette', type: 'core', desc: 'Estructuras de correo para negociación y solicitud formal.' },
      { id: 'pro-b1-3', title: 'Business Travel & Logistics', type: 'milestone', desc: 'Vocabulario esencial para viajes de negocios internacionales.' },
    ]
  },
  {
    id: 'exec-b2',
    title: 'Management Skills (B2)',
    level: 'B2',
    color: 'blue',
    icon: PieChart,
    description: 'Gestión de equipos, presentaciones de ventas y negociación.',
    lessons: [
      { id: 'pro-b2-1', title: 'Leading Effective Meetings', type: 'core' },
      { id: 'pro-b2-2', title: 'Negotiation Fundamentals', type: 'core' },
      { id: 'pro-b2-3', title: 'Data Presentation & Reporting', type: 'milestone' },
    ]
  },
  {
    id: 'exec-c1',
    title: 'Strategic Proficiency (C1)',
    level: 'C1',
    color: 'indigo',
    icon: Globe,
    description: 'Análisis de mercado, gestión de crisis y lenguaje financiero.',
    lessons: [
      { id: 'pro-c1-1', title: 'Global Market Analysis', type: 'core' },
      { id: 'pro-c1-2', title: 'Crisis Management & PR', type: 'core' },
      { id: 'pro-c1-3', title: 'Financial & Legal Terminology', type: 'milestone' },
    ]
  },
  {
    id: 'director',
    title: 'Boardroom Vision (Directive)',
    level: 'C-SUITE',
    color: 'amber',
    icon: Building,
    description: 'Liderazgo de alto nivel, fusiones, adquisiciones y visión global.',
    lessons: [
      { id: 'dir-1', title: 'Organizational Strategy & Vision', type: 'core' },
      { id: 'dir-2', title: 'Mergers, Acquisitions & IPOs', type: 'core' },
      { id: 'dir-3', title: 'Executive Leadership Masterclass', type: 'capstone' },
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
            <p className="text-sm font-bold text-white">Gold Member</p>
        </div>
    </div>
    <div className="w-[1px] h-8 bg-slate-800"></div>
    <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <TrendingUp size={18} />
        </div>
        <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Performance</p>
            <p className="text-sm font-bold text-white">Top 3%</p>
        </div>
    </div>
  </div>
);

// --- COMPONENT: PRO TIMELINE NODE (MAXIMIZED) ---
const ProTimelineNode = ({ lesson, index, status, isLast }: any) => {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';
    const isActive = status === 'active';

    // RENDERIZADO ESPECIAL PARA LA TARJETA ACTIVA (MAXIMIZADA)
    if (isActive) {
        return (
            <div className="relative w-full mb-16 pl-12 group">
                 {/* Línea conectora */}
                 {!isLast && <div className="absolute left-[1.9rem] top-10 bottom-[-4rem] w-[2px] bg-slate-800 z-0"></div>}
                
                {/* Icono Activo (Flotante a la izquierda) */}
                <div className="absolute left-0 top-0 z-20">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse">
                        <Play size={28} fill="currentColor" className="ml-1" />
                    </div>
                </div>

                {/* TARJETA MAXIMIZADA */}
                <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.15)] group-hover:shadow-[0_0_80px_rgba(37,99,235,0.25)] transition-all duration-500">
                    
                    {/* Fondo con degradado sofisticado */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e3a8a] z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row">
                        
                        {/* Columna Izquierda: Información */}
                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    En Progreso
                                </span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Unit {index + 1}</span>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                                {lesson.title}
                            </h3>
                            <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl leading-relaxed">
                                {lesson.desc || "Domina las habilidades críticas para este nivel ejecutivo. Completa esta unidad para desbloquear simulaciones avanzadas."}
                            </p>

                            {/* Barra de Progreso Premium */}
                            <div className="w-full max-w-md">
                                <div className="flex justify-between text-xs font-bold text-amber-500 mb-2 tracking-widest">
                                    <span>PROGRESO ACTUAL</span>
                                    <span>35%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[35%] shadow-[0_0_20px_rgba(245,158,11,0.8)] relative">
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Acción (Thumbnail) */}
                        <div className="md:w-80 bg-slate-900/50 border-l border-white/5 p-8 flex flex-col items-center justify-center text-center relative group/btn cursor-pointer">
                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center mb-4 group-hover/btn:scale-110 transition-transform duration-300 bg-slate-900 shadow-xl">
                                <Play size={32} className="text-amber-500 ml-1" fill="currentColor" />
                            </div>
                            <h5 className="text-white font-bold text-lg mb-1">Continuar</h5>
                            <p className="text-slate-500 text-xs uppercase tracking-widest">Resume Lesson</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // RENDERIZADO STANDARD (LOCKED / COMPLETED)
    return (
        <div className="relative flex w-full mb-8 pl-12 group opacity-80 hover:opacity-100 transition-opacity">
             {/* Línea conectora */}
             {!isLast && (
                <div className={`absolute left-[1.9rem] top-[3rem] bottom-[-2rem] w-[2px] z-0 ${isCompleted ? 'bg-amber-500/40' : 'bg-slate-800'}`}></div>
            )}

            {/* Icono pequeño */}
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

            {/* Tarjeta Standard */}
            <div className={`
                flex-1 p-5 rounded-xl border transition-all duration-300 flex items-center justify-between
                ${isLocked ? 'border-slate-900 bg-slate-900/20' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}
            `}>
                <div>
                    <h4 className={`text-base font-bold mb-1 ${isLocked ? 'text-slate-600' : 'text-slate-300'}`}>
                        {lesson.title}
                    </h4>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                        Unit {index + 1}
                    </p>
                </div>
                {isCompleted && (
                    <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
                        Completado
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function ProfessionalDashboard() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();
  
  // Hardcoded para demostración visual
  const currentLessonId = 'pro-b1-1'; 

  useEffect(() => {
    if (mode === 'student') {
      router.push('/dashboard');
    }
  }, [mode, router]);

  const handleReturnToStudent = () => {
    setMode('student');
  };

  const getLessonStatus = (id: string, sectionIndex: number, lessonIndex: number) => {
     if (id === currentLessonId) return 'active';
     // Nada completado antes para que se vea el ejemplo limpio en B1
     return 'locked';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. SIDEBAR (Minimalist Vertical Bar) */}
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
            <button onClick={handleReturnToStudent} className="p-3 text-slate-600 hover:text-white transition-colors" title="Salir">
                <LogOut size={22} />
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden ring-2 ring-slate-900">
                <img src="https://ui-avatars.com/api/?name=SP&background=0f172a&color=cbd5e1" alt="Profile" />
            </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="lg:pl-24 min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
        
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
            
            {/* HERO WELCOME */}
            <div className="mb-24 pt-10">
                <h2 className="text-5xl md:text-6xl font-thin text-white mb-6 tracking-tight">
                    Good evening, <br/>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl">
                        Student Pro.
                    </span>
                </h2>
                <p className="text-slate-400 text-lg font-light max-w-3xl leading-relaxed border-l-2 border-amber-500/50 pl-6">
                    Su enfoque actual es <strong className="text-white">Negociación de Alto Nivel</strong>. 
                    El consejo espera su informe de progreso para el final del trimestre (Q4).
                </p>
            </div>

            {/* CURRICULUM SECTIONS */}
            <div className="relative">
                {PRO_CURRICULUM.map((section, sIdx) => (
                    <div key={section.id} className="mb-32 relative">
                        
                        {/* Section Title */}
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

                        {/* Lessons List */}
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