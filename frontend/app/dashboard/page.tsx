'use client';

/**
 * ==============================================================================
 * ONIXLINGO LMS DASHBOARD - STUDENT EDITION (FREE TIER)
 * ==============================================================================
 * RUTA: /dashboard/page.tsx
 * ESTADO: Acceso Libre con Publicidad (Se oculta si es Premium)
 * ==============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import Sidebar from '@/components/dashboard/sidebar'; 

// --- 📢 IMPORTACIÓN DE ANUNCIOS ---
import { AdBanner } from '@/components/ads/AdBanner';

import { 
  LogOut, ChevronRight, Play, Lock, Check, Home,
  Trophy, Zap, Flame, Headphones, BookOpen, PenTool, 
  Mic, Shield, LayoutGrid, User
} from 'lucide-react';

import { CURRICULUM } from '@/data/curriculum';
import { useProgressStore } from '@/store/progressStore';

type LessonStatus = 'locked' | 'active' | 'completed';

interface ThemeConfig {
  primary: string;    
  bg: string;         
  border: string;     
  iconBg: string;     
  accent: string;     
  shadow: string;
  gradient: string;
}

const COLOR_VARIANTS: Record<string, { bg: string, text: string, hoverBorder: string, hoverShadow: string }> = {
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-emerald-100' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hoverBorder: 'hover:border-blue-300', hoverShadow: 'hover:shadow-blue-100' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hoverBorder: 'hover:border-orange-300', hoverShadow: 'hover:shadow-orange-100' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hoverBorder: 'hover:border-purple-300', hoverShadow: 'hover:shadow-purple-100' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hoverBorder: 'hover:border-indigo-300', hoverShadow: 'hover:shadow-indigo-100' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', hoverBorder: 'hover:border-rose-300', hoverShadow: 'hover:shadow-rose-100' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', hoverBorder: 'hover:border-amber-300', hoverShadow: 'hover:shadow-amber-100' },
};

const getProfessionalTheme = (colorName: string, status: LessonStatus): ThemeConfig => {
  if (status === 'locked') {
    return {
      primary: 'text-slate-300',
      bg: 'bg-slate-50',
      border: 'border-slate-100',
      iconBg: 'bg-slate-100',
      accent: 'bg-slate-300',
      shadow: 'shadow-none',
      gradient: 'from-slate-50 to-slate-50'
    };
  }

  const themes: Record<string, ThemeConfig> = {
    emerald: { 
        primary: 'text-emerald-700', bg: 'bg-white', border: 'border-emerald-100', 
        iconBg: 'bg-emerald-50', accent: 'bg-emerald-600', shadow: 'shadow-emerald-200/50',
        gradient: 'from-emerald-500 to-teal-600'
    },
    blue: { 
        primary: 'text-blue-700', bg: 'bg-white', border: 'border-blue-100', 
        iconBg: 'bg-blue-50', accent: 'bg-blue-600', shadow: 'shadow-blue-200/50',
        gradient: 'from-blue-600 to-indigo-600'
    },
    orange: { 
        primary: 'text-orange-700', bg: 'bg-white', border: 'border-orange-100', 
        iconBg: 'bg-orange-50', accent: 'bg-orange-600', shadow: 'shadow-orange-200/50',
        gradient: 'from-orange-500 to-red-500'
    },
    purple: { 
        primary: 'text-purple-700', bg: 'bg-white', border: 'border-purple-100', 
        iconBg: 'bg-purple-50', accent: 'bg-purple-600', shadow: 'shadow-purple-200/50',
        gradient: 'from-purple-600 to-violet-600'
    },
  };

  return themes[colorName] || themes['blue'];
};

const getLessonDescription = (title: string) => {
    if (title.includes("Hello")) return "Domina los saludos básicos, presentaciones formales y el verbo To Be.";
    if (title.includes("Routine")) return "Aprende a describir tu día a día, horarios y hábitos frecuentes.";
    if (title.includes("Food")) return "Vocabulario esencial para restaurantes, ordenar comida y supermercado.";
    if (title.includes("Numbers")) return "Conteo, precios, fechas importantes y edades.";
    if (title.includes("Checkpoint")) return "Evaluación integral de conocimientos adquiridos en este nivel.";
    return "Lección fundamental para avanzar en tu dominio del idioma inglés.";
};

const HeaderStats = ({ xp, streak }: { xp: number, streak: number }) => (
  <div className="hidden md:flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 px-3 border-r border-slate-200">
      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
        <Zap size={20} fill="currentColor" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experiencia</p>
        <span className="text-lg font-black text-slate-800">{xp} XP</span>
      </div>
    </div>
    <div className="flex items-center gap-3 px-3">
      <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
        <Flame size={20} fill="currentColor" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Racha</p>
        <span className="text-lg font-black text-slate-800">{streak} Días</span>
      </div>
    </div>
  </div>
);

const MobileBottomNav = () => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-4 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
    <Link href="/dashboard" className="flex flex-col items-center gap-1.5 text-indigo-600">
      <Home size={28} strokeWidth={2.5} />
    </Link>
    <Link href="/practice" className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
      <Mic size={28} />
    </Link>
    <div className="w-16 h-16 -mt-10 bg-indigo-600 rounded-2xl rotate-45 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 border-4 border-slate-50 group cursor-pointer hover:scale-105 transition-transform">
      <Play size={24} fill="currentColor" className="ml-1 -rotate-45" />
    </div>
    <Link href="#" className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
      <Trophy size={28} />
    </Link>
    <Link href="#" className="flex flex-col items-center gap-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
      <User size={28} />
    </Link>
  </div>
);

const TimelineNode = ({ id, title, status, stars, index, isLast, color, onClick }: any) => {
  const theme = getProfessionalTheme(color, status);
  const description = getLessonDescription(title);
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS['blue'];
  
  return (
    <div className="relative flex group w-full mb-8">
      {!isLast && (
        <div className="absolute left-[2.2rem] md:left-[2.7rem] top-[5rem] bottom-[-2rem] w-[3px] bg-slate-100 z-0 rounded-full"></div>
      )}

      <div className="relative z-10 mr-6 md:mr-10 flex-shrink-0 pt-2">
        <button
          onClick={() => status !== 'locked' && onClick(id)}
          disabled={status === 'locked'}
          className={`
            w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center border-0 transition-all duration-300 shadow-lg
            ${status === 'active' ? `bg-gradient-to-br ${theme.gradient} text-white shadow-xl shadow-indigo-500/30 scale-110 ring-4 ring-white` : ''}
            ${status === 'completed' ? `bg-white border-2 ${theme.border} ${theme.primary}` : ''}
            ${status === 'locked' ? 'bg-slate-50 border-2 border-slate-100 text-slate-300' : ''}
          `}
        >
          {status === 'locked' && <Lock size={24} />}
          {status === 'active' && <Play size={32} fill="currentColor" className="ml-1" />}
          {status === 'completed' && <Check size={36} strokeWidth={4} />}
        </button>
      </div>

      <div 
        onClick={() => status !== 'locked' && onClick(id)}
        className={`
          flex-1 p-6 md:p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden group/card
          ${status === 'locked' 
            ? 'bg-transparent border-2 border-dashed border-slate-200 opacity-60' 
            : `bg-white border-2 border-slate-100 ${variant.hoverBorder} hover:shadow-2xl ${variant.hoverShadow} hover:-translate-y-1`
          }
        `}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest ${status === 'active' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                Módulo {index + 1}
              </span>
              {status === 'active' && (
                <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 animate-pulse">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> EN CURSO
                </span>
              )}
            </div>
            
            <h3 className={`text-xl md:text-2xl font-black leading-tight mb-2 ${status === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>
              {title}
            </h3>
            
            <p className={`text-sm md:text-base leading-relaxed ${status === 'locked' ? 'text-slate-300' : 'text-slate-500'}`}>
                {description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {status === 'completed' && (
                <div className="flex gap-1 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                {[1, 2, 3].map((s) => (
                    <Trophy key={s} size={18} className={s <= stars ? 'text-amber-500 fill-amber-500' : 'text-amber-200'} />
                ))}
                </div>
            )}
            
            {status !== 'locked' && status !== 'completed' && (
                <div className={`p-4 rounded-2xl ${theme.iconBg} ${theme.primary} transition-transform group-hover/card:translate-x-1`}>
                <ChevronRight size={24} />
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CertCard = ({ title, desc, icon: Icon, href, active = false, color }: any) => {
    const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS['indigo'];
    
    return (
        <Link href={href} className="block group h-full">
            <div className={`
                relative overflow-hidden rounded-[2rem] border-2 p-8 transition-all duration-300 h-full flex flex-col
                ${active 
                    ? 'bg-slate-900 border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1' 
                    : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1'
                }
            `}>
                <div className="flex items-start justify-between mb-6">
                    <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm 
                        ${active ? `bg-${color}-500 text-white` : `${variant.bg} ${variant.text} group-hover:scale-110 transition-transform`}
                    `}>
                        <Icon size={32} strokeWidth={2} />
                    </div>
                    {active && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black bg-indigo-500 text-white px-3 py-1 rounded-lg uppercase tracking-widest mb-1">Recomendado</span>
                            <span className="text-[10px] font-bold text-slate-400">20 min</span>
                        </div>
                    )}
                </div>
                
                <div className="mt-auto">
                    <h4 className={`text-xl font-black mb-2 leading-tight ${active ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
                    <p className={`text-sm leading-relaxed ${active ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
                </div>
            </div>
        </Link>
    );
};

export default function DashboardPage() {
  const router = useRouter();
  const { mode, setMode } = useUIStore(); 
  const { isLessonCompleted, getLessonStars } = useProgressStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({ xp: 0, lessons: 0, streak: 0 });

  useEffect(() => {
    if (mode === 'professional') {
      router.push('/dashboard/pro');
    }
  }, [mode, router]);
  
  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem('currentUser');
    setCurrentUser(user);

    const localProgress = localStorage.getItem('onixlingo-progress');
    if (localProgress) {
        try {
            const p = JSON.parse(localProgress);
            const completedCount = Object.keys(p.state?.completedLessons || {}).length;
            setUserStats({ xp: completedCount * 150, lessons: completedCount, streak: 3 });
        } catch (e) { console.error(e); }
    }

    if (user) {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (
            process.env.NODE_ENV === 'development' 
                ? 'http://127.0.0.1:8001'
                : 'https://onixlingo-bckend.onrender.com'
        );

        fetch(`${BASE_URL}/api/v1/user/progress-map/${user}`)
            .then(res => res.json())
            .then(data => {
                if (Object.keys(data).length > 0) {
                    useProgressStore.getState().loadProgressFromDB(data);
                    const count = Object.keys(data).length;
                    setUserStats({ xp: count * 150, lessons: count, streak: 5 });
                }
            })
            .catch(err => console.error("Error sincronizando:", err));
    }
  }, []);

  const allLessonsFlat = useMemo(() => CURRICULUM.flatMap(section => section.lessons), []);

  const getLessonState = (lessonId: string): LessonStatus => {
    if (!isMounted) return 'locked';
    if (isLessonCompleted(lessonId)) return 'completed';
    const index = allLessonsFlat.findIndex(l => l.id === lessonId);
    if (index === 0) return 'active';
    const prevLesson = allLessonsFlat[index - 1];
    return isLessonCompleted(prevLesson.id) ? 'active' : 'locked';
  };

  const getStars = (lessonId: string) => isMounted ? getLessonStars(lessonId) : 0;
  const handleLessonClick = (id: string) => router.push(`/lesson/${id}`);
  // Busca esta línea al inicio del componente DashboardPage

const handleLogout = () => {
    if(confirm("¿Cerrar sesión?")) {
      // 1. Borrar datos de usuario
      localStorage.removeItem('currentUser');
      
      // 2. 🚨 BORRAR LA MARCA "TITANIUM" (La que pusimos en SuccessPage)
      localStorage.removeItem('onix_tier');

      // 3. 🚨 BORRAR LA PERSISTENCIA DE LA UI
      // Esto elimina el archivo de guardado de Zustand del navegador
      localStorage.removeItem('onixlingo-ui-prefs'); 

      // 4. Resetear el estado en memoria inmediatamente
      setMode('student'); 

      // 5. Redirigir al login y refrescar caché de Next.js
      router.push('/login');
      router.refresh(); 
    }
  };

  const handleUnlockAll = async () => {
    if (!currentUser) return alert("Error: No hay usuario activo.");

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (
        process.env.NODE_ENV === 'development' 
            ? 'http://127.0.0.1:8001' 
            : 'https://onixlingo-bckend.onrender.com'
    );

    try {
        const response = await fetch(`${BASE_URL}/api/v1/debug/unlock-all/${currentUser}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert("🔓 MODO DIOS ACTIVADO: Niveles desbloqueados.");
            window.location.reload(); 
        } else {
            alert("Error: No se pudo desbloquear.");
        }
    } catch (error) {
        console.error(error);
        alert(`Error de conexión con ${BASE_URL}. ¿El backend está encendido?`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] font-sans text-slate-900 pb-32 lg:pb-0 selection:bg-indigo-100 selection:text-indigo-900">
      
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 md:px-10 h-24 flex items-center justify-between shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-105 transition-transform cursor-pointer">
            <span className="text-white font-black text-2xl">O</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-slate-900 text-2xl tracking-tighter leading-none">OnixLingo</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Enterprise Learning</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <HeaderStats xp={userStats.xp} streak={userStats.streak} />
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

          {currentUser ? (
            <div className="flex items-center gap-4 cursor-pointer hover:bg-white p-2 rounded-full md:pr-6 border border-transparent hover:border-slate-200 transition-all group" onClick={handleLogout}>
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md group-hover:bg-indigo-600 transition-colors">
                {currentUser.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-right leading-none">
                <p className="text-sm font-bold text-slate-800 mb-1">{currentUser}</p>
                <div className="flex items-center gap-1 justify-end">
                    <LogOut size={10} className="text-slate-400" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Cerrar Sesión</p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => router.push('/login')} className="text-sm font-bold text-white bg-slate-900 px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 pt-12 px-6 sm:px-10">
        
        <div className="flex-1 min-w-0">
          
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Bienvenido, {currentUser || 'Estudiante'}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed mb-6">
              Continúa tu ruta de aprendizaje. Estás a <span className="font-bold text-indigo-600">3 módulos</span> de tu próxima certificación oficial.
            </p>

            <button
              onClick={handleUnlockAll}
              className="bg-red-600 text-white font-black py-3 px-6 rounded-xl shadow-lg border-2 border-red-500 hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-3 animate-pulse"
            >
              <span className="text-2xl">🔓</span>
              <div className="text-left leading-none">
                <span className="block text-xs opacity-80 uppercase tracking-widest">Dev Tools</span>
                <span className="text-sm">Desbloquear Todo</span>
              </div>
            </button>
          </div>

          {/* 📢 AQUÍ HE COLOCADO EL ANUNCIO HORIZONTAL */}
          <AdBanner variant="horizontal" />

          <div className="space-y-16">
            {CURRICULUM.map((section, sIdx) => {
                const safeColor = COLOR_VARIANTS[section.color] || COLOR_VARIANTS['blue'];
                return (
                    <div key={section.id} className="relative">
                        <div className="flex items-end gap-4 mb-8 border-b-2 border-slate-200 pb-4">
                            <div className={`p-3 rounded-2xl ${safeColor.bg} ${safeColor.text} shadow-sm`}>
                                <LayoutGrid size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{section.title}</h2>
                                <p className="text-sm text-slate-500 font-medium">{section.description}</p>
                            </div>
                        </div>

                        <div className="pl-4">
                            {section.lessons.map((lesson, lIdx) => (
                                <TimelineNode 
                                    key={lesson.id}
                                    id={lesson.id}
                                    title={lesson.title}
                                    status={getLessonState(lesson.id)}
                                    stars={getStars(lesson.id)}
                                    index={allLessonsFlat.findIndex(l => l.id === lesson.id)}
                                    isLast={lIdx === section.lessons.length - 1}
                                    color={section.color}
                                    onClick={handleLessonClick}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
          </div>

          <div className="mt-24 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-2">
                    <Shield className="text-indigo-600" size={32} /> 
                    Centro de Certificación
                </h2>
                <p className="text-slate-500">Exámenes oficiales simulados para validación profesional.</p>
              </div>
              <span className="hidden sm:inline-block bg-white text-slate-800 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                POWERED BY ETS®
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CertCard title="Listening Comprehension" desc="Audio, fotografías y conversaciones reales." icon={Headphones} href="/lesson/toeic_listening" active={true} color="indigo" />
              <CertCard title="Reading Analysis" desc="Gramática, textos complejos y comprensión." icon={BookOpen} href="/lesson/toeic_reading" color="emerald" />
              <CertCard title="Writing Proficiency" desc="Redacción de ensayos y correos formales." icon={PenTool} href="/lesson/toeic_writing" color="rose" />
              <CertCard title="Speaking Evaluation" desc="Entrevistas y pruebas de pronunciación." icon={Mic} href="/lesson/toeic_speaking" color="amber" />
            </div>
          </div>
          
        </div>

        <Sidebar userStats={userStats} />

      </div>

      <MobileBottomNav />

    </div>
  );
}