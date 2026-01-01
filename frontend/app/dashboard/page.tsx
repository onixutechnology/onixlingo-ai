'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CURRICULUM } from '@/data/curriculum';
import LessonNode from '@/components/dashboard/LessonNode';
import XPBar from '@/components/ui/XPBar';
import { MessageCircle, Trophy, Zap, Unlock, Trash2, User, LogOut, LogIn } from 'lucide-react'; // <--- Iconos nuevos
import Link from 'next/link';
import { useProgressStore } from '@/store/progressStore';

export default function DashboardPage() {
  const router = useRouter();
  const { isLessonCompleted, getLessonStars, completeLesson } = useProgressStore();
  
  // ESTADOS
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null); // <--- NUEVO: Guardamos el usuario

  useEffect(() => {
    setIsMounted(true);
    // Leemos si hay alguien logueado en el navegador
    const storedUser = localStorage.getItem('currentUser');
    setCurrentUser(storedUser);
  }, []);

  const sectionStyles: Record<string, { bg: string, border: string, title: string, desc: string }> = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', title: 'text-emerald-600', desc: 'text-emerald-800/60' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', title: 'text-blue-600', desc: 'text-blue-800/60' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-100', title: 'text-orange-600', desc: 'text-orange-800/60' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', title: 'text-purple-600', desc: 'text-purple-800/60' },
  };

  const allLessonsFlat = CURRICULUM.flatMap(section => section.lessons);

  const getDynamicLessonState = (lessonId: string) => {
      const globalIndex = allLessonsFlat.findIndex(l => l.id === lessonId);

      if (!isMounted) {
          if (globalIndex === 0) return { locked: false, completed: false, stars: 0 };
          return { locked: true, completed: false, stars: 0 };
      }

      if (isLessonCompleted(lessonId)) return { locked: false, completed: true, stars: getLessonStars(lessonId) };
      if (globalIndex === 0) return { locked: false, completed: false, stars: 0 };
      
      const previousLesson = allLessonsFlat[globalIndex - 1];
      if (previousLesson && isLessonCompleted(previousLesson.id)) return { locked: false, completed: false, stars: 0 };
      
      return { locked: true, completed: false, stars: 0 };
  };

  const handleLessonClick = (lessonId: string) => {
    console.log(`🚀 Iniciando lección: ${lessonId}`);
    router.push(`/lesson/${lessonId}`);
  };

  // --- ACCIONES DE SESIÓN ---
  const handleLogout = () => {
      if(confirm("¿Cerrar sesión?")) {
          localStorage.removeItem('currentUser');
          window.location.reload();
      }
  };

  const unlockAllContent = () => {
      if(!confirm("⚡ ¿ACTIVAR MODO DIOS?")) return;
      CURRICULUM.forEach(section => {
          section.lessons.forEach(lesson => completeLesson(lesson.id, 100, 3));
      });
      window.location.reload(); 
  };

  const resetAllProgress = () => {
      if(!confirm("🗑️ ¿ESTÁS SEGURO?\nSe borrará todo el progreso.")) return;
      localStorage.removeItem('onixlingo-progress'); 
      localStorage.removeItem('avatar-storage');
      localStorage.removeItem('currentUser');
      window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
      
      {/* COLUMNA CENTRAL (MAPA) */}
      <div className="w-full max-w-xl border-x border-slate-100 min-h-screen relative pb-32">
        <header className="sticky top-0 bg-white/95 backdrop-blur-md z-40 px-4 py-3 border-b border-slate-100 flex items-center justify-between lg:hidden">
            <span className="font-extrabold text-slate-400 tracking-widest text-sm">ONIXLINGO</span>
            <div className="w-1/3"><XPBar /></div>
        </header>

        <div className="flex flex-col items-center gap-8 pt-8">
            {CURRICULUM.map((section) => {
                const style = sectionStyles[section.color] || sectionStyles['emerald'];
                return (
                    <div key={section.id} className="w-full flex flex-col items-center animate-in fade-in duration-700 slide-in-from-bottom-4">
                        <div className={`w-full ${style.bg} py-8 mb-8 px-6 border-y ${style.border} flex flex-col items-center text-center`}>
                            <h2 className={`text-2xl font-black ${style.title} uppercase tracking-wide mb-2`}>{section.title}</h2>
                            <p className={`${style.desc} font-medium max-w-sm`}>{section.description}</p>
                        </div>
                        <div className="flex flex-col items-center w-full space-y-4">
                            {section.lessons.map((lesson) => {
                                const state = getDynamicLessonState(lesson.id);
                                return (
                                    <LessonNode 
                                        key={lesson.id} 
                                        data={{ ...lesson, locked: state.locked, completed: state.completed, stars: state.stars as any }} 
                                        color={section.color} 
                                        onClick={handleLessonClick} 
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* COLUMNA DERECHA (SIDEBAR) */}
      <div className="hidden lg:flex flex-col w-96 p-8 gap-6 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
         <div className="mb-4"><XPBar /></div>

         <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="w-20 h-20 bg-blue-50 rounded-2xl mb-4 flex items-center justify-center text-4xl shadow-inner">🤖</div>
            <h3 className="font-extrabold text-slate-700 text-xl mb-1">Tutor IA</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Practica conversación libre.</p>
            <Link href="/practice" className="w-full">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_0_#1e40af] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3">
                    <MessageCircle size={20} /><span>HABLAR AHORA</span>
                </button>
            </Link>
         </div>

         <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-orange-100 text-orange-500 rounded-xl"><Zap size={24} fill="currentColor" /></div>
             <div><h4 className="font-bold text-slate-700">Racha de 3 días</h4><p className="text-xs text-slate-400 font-bold">¡No te detengas!</p></div>
         </div>

         {/* --- ZONA DE CUENTA INTELIGENTE --- */}
         <div className="mt-2">
            {currentUser ? (
                // SI ESTÁ LOGUEADO: Muestra "Hola, [Usuario]" + Botón Salir
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Conectado como</p>
                            <p className="font-bold text-slate-700">{currentUser}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cerrar Sesión">
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                // SI NO ESTÁ LOGUEADO: Muestra Botón Gigante de Login
                <button 
                    onClick={() => router.push('/login')}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-500 font-bold py-4 rounded-2xl transition-all shadow-sm active:scale-95"
                >
                    <LogIn size={20} />
                    <span>INICIAR SESIÓN</span>
                </button>
            )}
         </div>

         <div className="mt-8 p-4 border-2 border-slate-200 border-dashed rounded-2xl opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Dev Tools</p>
            <div className="space-y-2">
                <button onClick={unlockAllContent} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-700 font-bold py-2 rounded-lg text-xs transition-colors">
                    <Unlock size={14} /> DESBLOQUEAR TODO
                </button>
                <button onClick={resetAllProgress} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 font-bold py-2 rounded-lg text-xs transition-colors">
                    <Trash2 size={14} /> RESETEAR PROGRESO
                </button>
            </div>
         </div>

         <div className="text-center text-slate-300 text-xs font-bold py-4">ONIXLINGO © 2025</div>
      </div>
    </div>
  );
}