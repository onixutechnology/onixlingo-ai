'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import Cookies from 'js-cookie'; 
import { useUIStore } from '@/store/uiStore';
import { motion, Variants } from 'framer-motion';

import { 
  ArrowLeft, BookA, Search, Play, Brain, 
  Briefcase, Code2, Plane, Users, Coffee, 
  Lock, CheckCircle2, Loader2, Home, Crown, User, Languages, Flame, Zap, Sparkles
} from 'lucide-react';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

// 1. CONFIGURACIÓN DE CATEGORÍAS (Temas Ultra Premium)
const CATEGORIES = [
  { id: 'basics', label: 'Life Essentials', icon: Coffee, theme: { base: 'orange', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', ring: 'focus:ring-orange-500', bar: 'bg-gradient-to-r from-orange-400 to-orange-500', gradient: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/20' } },
  { id: 'business', label: 'Business & Career', icon: Briefcase, theme: { base: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'focus:ring-indigo-500', bar: 'bg-gradient-to-r from-indigo-500 to-blue-500', gradient: 'from-indigo-600 to-blue-600', shadow: 'shadow-indigo-500/20' } },
  { id: 'marketing', label: 'Marketing & Growth', icon: Users, theme: { base: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', ring: 'focus:ring-rose-500', bar: 'bg-gradient-to-r from-rose-400 to-rose-500', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' } },
  { id: 'tech', label: 'Technology & Dev', icon: Code2, theme: { base: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'focus:ring-emerald-500', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-500', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' } },
  { id: 'travel', label: 'Global Travel', icon: Plane, theme: { base: 'sky', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', ring: 'focus:ring-sky-500', bar: 'bg-gradient-to-r from-sky-400 to-sky-500', gradient: 'from-sky-500 to-cyan-500', shadow: 'shadow-sky-500/20' } },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

// 📱 BOTTOM NAV INTELIGENTE
const MobileBottomNav = ({ toggleProMode, mode }: { toggleProMode: () => void, mode: string }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>
      <Link href="/dashboard/vocabulary" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/vocabulary') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <BookA size={24} strokeWidth={isActive('/dashboard/vocabulary') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Vocab</span>
      </Link>
      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-slate-50 cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-slate-900 shadow-slate-900/40 hover:-translate-y-1'}`}>
          <Crown size={28} fill="currentColor" />
        </div>
        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity ${isActive('/dashboard/chess') ? 'text-amber-600 opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`}>
          Ajedrez
        </span>
      </Link>
      <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/profile') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <User size={24} strokeWidth={isActive('/dashboard/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Perfil</span>
      </Link>
      <button onClick={toggleProMode} className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${mode === 'professional' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <Briefcase size={24} strokeWidth={mode === 'professional' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Pro</span>
      </button>
    </div>
  );
};

export default function VocabularyPage() {
  const router = useRouter();
  
  // 🔥 ESTADO GLOBAL (Zustand)
  const { mode, setMode, activeLanguage, setLanguage } = useUIStore();
  
  // Estados de UI
  const [activeCat, setActiveCat] = useState('basics');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de Datos Reales
  const [vocabProgress, setVocabProgress] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ streak: 0, totalXP: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Obtener datos de la categoría activa para estilos
  const activeCategoryData = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];
  const Theme = activeCategoryData.theme;

  // --- EFECTO: CARGAR PROGRESO DEL BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const headers = { 
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json' 
        };

        const [mapRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/progress/map`, { headers, cache: 'no-store' }).catch(() => null),
          fetch(`${API_URL}/api/v1/progress/stats`, { headers, cache: 'no-store' }).catch(() => null)
        ]);

        if (mapRes && mapRes.ok) {
          const mapData = await mapRes.json();
          setVocabProgress(mapData.vocab || []); 
        }

        if (statsRes && statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats({
            streak: statsData.streak || 0, // 🔥 ARREGLADO: Ya no está hardcodeado a 5
            totalXP: statsData.total_xp || 0
          });
        }
      } catch (error) {
        console.error("Error cargando vocabulario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const toggleProMode = () => {
    setMode(mode === 'professional' ? 'student' : 'professional');
    router.push(mode === 'professional' ? '/dashboard' : '/dashboard/pro');
  };

  const getLessonState = (lessonId: string) => {
    const lessonData = vocabProgress.find(p => p.lesson_id === lessonId);
    if (lessonData) {
      if (lessonData.status === 'completed') return 'completed';
      if (lessonData.status === 'active' || lessonData.is_unlocked) return 'active';
    }
    if (lessonId === 'basics_mod_01') return 'active';
    return 'locked';
  };

  const getScore = (lessonId: string) => {
    const lessonData = vocabProgress.find(p => p.lesson_id === lessonId);
    return lessonData ? lessonData.score : 0;
  };

  // 🔥 SOLUCIÓN ESTRICTA DE TYPESCRIPT 🔥
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any } 
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Sincronizando Módulos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      
      {/* BACKGROUND DECORATIVO DE ALTO NIVEL */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 bg-gradient-to-b ${Theme.gradient} transition-colors duration-1000`} />
        <div className="absolute top-[20%] -left-[10%] w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-10 bg-indigo-500" />
      </div>

      {/* --- HEADER STICKY PREMIUM --- */}
      <div className="bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200 text-slate-500 transition-all duration-200 active:scale-95 border border-slate-200/50">
              <ArrowLeft size={22} strokeWidth={2.5} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 text-slate-800 drop-shadow-sm">
              <div className={`p-2.5 rounded-2xl shadow-lg ${Theme.shadow} ${Theme.bg} ${Theme.text} transition-colors duration-500`}>
                <BookA size={24} strokeWidth={2.5} />
              </div>
              <span>Vocabulary<span className="text-indigo-600">Pro</span></span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        
        {/* 🔥 ESTADO DE SINCRONIZACIÓN PARA FRANCÉS Y CHINO */}
        {activeLanguage !== 'en' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center mt-8 shadow-2xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 ring-4 ring-white shadow-xl shadow-indigo-500/10">
              <Languages size={48} strokeWidth={2} />
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Glosario en Sincronización</h3>
            <p className="text-slate-500 max-w-2xl mx-auto mb-10 text-lg leading-relaxed font-medium">
              El diccionario interactivo y los módulos de vocabulario específico para <strong>{activeLanguage === 'fr' ? 'Francés' : 'Chino Mandarín'}</strong> están siendo indexados. Pronto podrás expandir tu léxico corporativo en este idioma.
            </p>
            <button 
              onClick={() => setLanguage('en')} 
              className="bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20 flex items-center gap-3"
            >
              <ArrowLeft size={18} /> Regresar a Inglés
            </button>
          </motion.div>
        ) : (
          <>
            {/* --- HERO METRICS SECTION ULTRA PREMIUM --- */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {/* Card Racha */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 flex items-center justify-center shadow-inner border border-orange-200/50 relative z-10">
                  <Flame size={32} fill="currentColor" className="drop-shadow-sm" />
                </div>
                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Racha Actual</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">{userStats.streak} <span className="text-xl text-slate-500 font-bold">Días</span></p>
                </div>
              </div>

              {/* Card Experiencia */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 flex items-center justify-center shadow-inner border border-amber-200/50 relative z-10">
                  <Zap size={32} fill="currentColor" className="drop-shadow-sm" />
                </div>
                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Experiencia</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">{userStats.totalXP.toLocaleString()} <span className="text-xl text-slate-500 font-bold">XP</span></p>
                </div>
              </div>

              {/* Card Palabras */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-200/50 relative z-10">
                  <Brain size={32} strokeWidth={2.5} className="drop-shadow-sm" />
                </div>
                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Dominadas</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">{vocabProgress.filter(l => l.status === 'completed').length}</p>
                </div>
              </div>
            </motion.div>

            {/* --- TABS DE NAVEGACIÓN MODERNIZADAS --- */}
            <div className="mb-12 bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-slate-200 shadow-sm inline-block max-w-full overflow-x-auto hide-scrollbar">
              <div className="flex gap-2 w-max">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(cat.id)}
                      className={`
                        px-6 py-3.5 rounded-[1.5rem] flex items-center gap-3 text-sm font-bold whitespace-nowrap transition-all duration-300
                        ${isActive 
                          ? `bg-gradient-to-r ${cat.theme.gradient} text-white shadow-lg ${cat.theme.shadow}` 
                          : 'bg-transparent text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-800'}
                      `}
                    >
                      <cat.icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} strokeWidth={isActive ? 2.5 : 2} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --- HEADER DE CATEGORÍA Y BUSCADOR --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
              <motion.div 
                key={activeCat}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={20} className={Theme.text} />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Módulo Seleccionado</h3>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter mb-4">
                  {activeCategoryData.label}
                </h2>
                <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                  Expande tu léxico con vocabulario curado. Desde lo esencial del día a día hasta terminología técnica nivel C1 para profesionales.
                </p>
              </motion.div>

              <div className="relative w-full lg:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input 
                  type="text"
                  placeholder="Buscar lección o tema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`
                    w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-[1.5rem] outline-none transition-all shadow-lg shadow-slate-200/20
                    focus:border-transparent ${Theme.ring} focus:ring-4 font-bold text-base placeholder:text-slate-400 text-slate-800
                  `}
                />
              </div>
            </div>

            {/* --- GRID DE LECCIONES ANIMADO ULTRA PREMIUM --- */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={activeCat}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {LEVELS.flatMap((level, levelIndex) => [1, 2, 3, 4].map(part => { 
                const moduleNum = (levelIndex * 4) + part; 
                const moduleStr = moduleNum.toString().padStart(2, '0'); 
                const lessonId = `${activeCat}_mod_${moduleStr}`;
                
                const status = getLessonState(lessonId);
                const score = getScore(lessonId);
                const isLocked = status === 'locked';

                const baseTitle = activeCategoryData.label.split(' ')[0] || "Lesson";
                const displayTitle = `${baseTitle} Mastery • Level ${level}`;
                const subTitle = `Part ${part}: Essential Vocabulary & Phrases`;
                
                if (searchTerm && !displayTitle.toLowerCase().includes(searchTerm.toLowerCase()) && !subTitle.toLowerCase().includes(searchTerm.toLowerCase())) return null;

                const CardContent = (
                  <div className={`
                    h-full rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 relative overflow-hidden isolate
                    ${!isLocked 
                      ? `bg-white/80 backdrop-blur-xl border border-slate-100 hover:border-transparent hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer group` 
                      : 'bg-slate-50/80 border border-slate-200/60 opacity-80 backdrop-blur-sm cursor-not-allowed grayscale-[20%]'}
                  `}>
                    
                    {/* Brillo dinámico hover */}
                    {!isLocked && (
                      <div className={`absolute -right-24 -top-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 ease-out z-0 pointer-events-none ${Theme.bg} group-hover:scale-150`} />
                    )}

                    {/* Capa Superior */}
                    <div className="flex items-start gap-5 mb-10 relative z-10">
                      <div className={`
                        w-16 h-16 flex flex-col items-center justify-center rounded-[1.2rem] font-black text-xl shrink-0 shadow-sm transition-colors duration-500
                        ${!isLocked ? `${Theme.text} ${Theme.bg} ring-1 ring-inset ring-${Theme.base}-200/50` : 'bg-slate-200 text-slate-400 ring-1 ring-slate-300'}
                      `}>
                        {level}
                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-0.5">Pt.{part}</span>
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className={`font-black text-xl leading-tight truncate mb-2 transition-colors ${!isLocked ? 'text-slate-800 group-hover:text-slate-950' : 'text-slate-400'}`}>
                          {displayTitle}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
                          {subTitle}
                        </p>
                      </div>
                    </div>

                    {/* Capa Inferior: Progreso y Botón */}
                    <div className="flex items-center justify-between mt-auto relative z-10">
                      <div className="flex flex-col gap-2.5 w-[65%]">
                        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Dominio</span>
                          <span className={score > 0 ? Theme.text : ''}>{score}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full ${Theme.bar} rounded-full transition-all duration-1000 ease-out relative`} 
                            style={{ width: `${score}%` }}
                          >
                            {score > 0 && <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent w-full h-full"></div>}
                          </div>
                        </div>
                      </div>

                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden shadow-md
                        ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-600 group-hover:text-white group-hover:shadow-xl group-hover:scale-110'}
                      `}>
                        {!isLocked && <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${Theme.gradient}`} />}
                        <div className="relative z-10">
                          {isLocked ? <Lock size={20} strokeWidth={2.5} /> : (status === 'completed' ? <CheckCircle2 size={24} /> : <Play size={22} fill="currentColor" className="ml-1" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <motion.div variants={itemVariants} key={lessonId} className="block h-full">
                    {isLocked ? (
                      CardContent
                    ) : (
                      <Link href={`/lesson/vocabulary/${lessonId}?type=vocab`} className="block h-full outline-none">
                        {CardContent}
                      </Link>
                    )}
                  </motion.div>
                );
              }))}
            </motion.div>

            {/* Estado Vacío Premium */}
            {LEVELS.flatMap(l => [1,2,3,4]).filter(p => !searchTerm || searchTerm.length < 1).length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white/60 backdrop-blur-md rounded-[3rem] border-2 border-slate-200 border-dashed mt-10 shadow-sm">
                <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-200/50">
                  <Search size={40} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Sin resultados</h3>
                <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">No se encontraron lecciones o vocabulario coincidente con "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-8 bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                  Limpiar búsqueda
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
      
      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />
    </div>
  );
}