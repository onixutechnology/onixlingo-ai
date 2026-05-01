'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import Cookies from 'js-cookie'; 
import { useUIStore } from '@/store/uiStore';
import { motion } from 'framer-motion';

import { 
  ArrowLeft, BookA, Search, Play, Brain, 
  Briefcase, Code2, Plane, Users, Coffee, 
  Lock, CheckCircle2, Loader2, Home, Crown, User, Languages, Flame, Zap, Star
} from 'lucide-react';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

// 1. CONFIGURACIÓN DE CATEGORÍAS (Temas Seguros de Tailwind)
const CATEGORIES = [
  { id: 'basics', label: 'Life Essentials', icon: Coffee, theme: { base: 'orange', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', ring: 'focus:ring-orange-500', bar: 'bg-orange-500', gradient: 'from-orange-500 to-amber-500' } },
  { id: 'business', label: 'Business & Career', icon: Briefcase, theme: { base: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'focus:ring-indigo-500', bar: 'bg-indigo-500', gradient: 'from-indigo-500 to-blue-600' } },
  { id: 'marketing', label: 'Marketing & Growth', icon: Users, theme: { base: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', ring: 'focus:ring-rose-500', bar: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600' } },
  { id: 'tech', label: 'Technology & Dev', icon: Code2, theme: { base: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'focus:ring-emerald-500', bar: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-600' } },
  { id: 'travel', label: 'Global Travel', icon: Plane, theme: { base: 'sky', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', ring: 'focus:ring-sky-500', bar: 'bg-sky-500', gradient: 'from-sky-500 to-cyan-500' } },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

// 📱 BOTTOM NAV INTELIGENTE
const MobileBottomNav = ({ toggleProMode, mode }: { toggleProMode: () => void, mode: string }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>
      <Link href="/dashboard/vocabulary" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/vocabulary') ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
        <BookA size={24} strokeWidth={isActive('/dashboard/vocabulary') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Vocab</span>
      </Link>
      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-slate-900 shadow-slate-900/40 group-hover:bg-slate-800 group-hover:-translate-y-1'}`}>
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
            streak: 5, // Fallback visual, idealmente vendría de statsData.streak
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

  // 🔥 SOLUCIÓN: VARIANTES DE ANIMACIÓN DECLARADAS AQUÍ
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Cargando glosario corporativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- HEADER STICKY --- */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors duration-200 active:scale-95">
              <ArrowLeft size={22} strokeWidth={2.5} />
            </Link>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 text-slate-800">
              <div className={`p-2 rounded-xl shadow-sm ${Theme.bg} ${Theme.text} transition-colors duration-500`}>
                <BookA size={24} />
              </div>
              <span>Vocabulary<span className="text-indigo-600">Pro</span></span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
        
        {/* 🔥 ESTADO DE SINCRONIZACIÓN PARA FRANCÉS Y CHINO */}
        {activeLanguage !== 'en' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center mt-8 shadow-xl shadow-slate-200/50">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 ring-4 ring-indigo-500/10">
              <Languages size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Glosario en Sincronización</h3>
            <p className="text-slate-500 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
              El diccionario interactivo y los módulos de vocabulario específico para <strong>{activeLanguage === 'fr' ? 'Francés' : 'Chino Mandarín'}</strong> están siendo indexados. Pronto podrás expandir tu léxico corporativo en este idioma.
            </p>
            <button 
              onClick={() => setLanguage('en')} 
              className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Regresar a Inglés
            </button>
          </motion.div>
        ) : (
          <>
            {/* --- HERO METRICS SECTION --- */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            >
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Flame size={28} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Racha Actual</p>
                  <p className="text-2xl font-black text-slate-800 leading-none">{userStats.streak} Días</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Zap size={28} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Experiencia</p>
                  <p className="text-2xl font-black text-slate-800 leading-none">{userStats.totalXP.toLocaleString()} XP</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <Brain size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Palabras Dominadas</p>
                  <p className="text-2xl font-black text-slate-800 leading-none">{vocabProgress.filter(l => l.status === 'completed').length}</p>
                </div>
              </div>
            </motion.div>

            {/* --- TABS DE NAVEGACIÓN MODERNIZADAS --- */}
            <div className="mb-10">
              <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(cat.id)}
                      className={`
                        px-5 py-3 rounded-2xl flex items-center gap-2.5 text-sm font-bold whitespace-nowrap transition-all duration-300
                        ${isActive 
                          ? `bg-gradient-to-r ${cat.theme.gradient} text-white shadow-lg shadow-${cat.theme.base}-500/30 scale-105 origin-left` 
                          : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'}
                      `}
                    >
                      <cat.icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --- HEADER DE CATEGORÍA Y BUSCADOR --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <motion.div 
                key={activeCat} // Forza re-animación al cambiar
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">
                  {activeCategoryData.label}
                </h2>
                <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                  Expande tu léxico con vocabulario curado. Desde lo esencial del día a día hasta terminología técnica nivel C1.
                </p>
              </motion.div>

              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar lección o tema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`
                    w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none transition-all shadow-sm
                    focus:border-transparent ${Theme.ring} focus:ring-2 font-medium text-sm placeholder:text-slate-400
                  `}
                />
              </div>
            </div>

            {/* --- GRID DE LECCIONES ANIMADO --- */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={activeCat} // Resetea la animación cuando cambia la categoría
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
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
                    h-full rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden isolate border-2
                    ${!isLocked 
                      ? `bg-white border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-${Theme.base}-500/10 hover:-translate-y-1 cursor-pointer group` 
                      : 'bg-white/50 border-slate-200/50 opacity-70 backdrop-blur-sm cursor-not-allowed'}
                  `}>
                    
                    {/* Brillo de fondo para tarjetas activas */}
                    {!isLocked && (
                      <div className={`absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-[0.03] transition-all duration-500 ease-out z-0 pointer-events-none ${Theme.bg} group-hover:scale-150`} />
                    )}

                    {/* Capa Superior */}
                    <div className="flex items-start gap-4 mb-8 relative z-10">
                      <div className={`
                        w-14 h-14 flex flex-col items-center justify-center rounded-[1rem] font-black text-lg shrink-0 shadow-sm transition-colors duration-300
                        ${!isLocked ? `${Theme.text} ${Theme.bg} ring-1 ring-inset ring-${Theme.base}-200/50` : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'}
                      `}>
                        {level}
                        <span className="text-[9px] font-bold opacity-70 uppercase tracking-wider">Part {part}</span>
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className={`font-black text-[1.1rem] leading-tight truncate mb-1 transition-colors ${!isLocked ? 'text-slate-800 group-hover:text-slate-900' : 'text-slate-400'}`}>
                          {displayTitle}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">
                          {subTitle}
                        </p>
                      </div>
                    </div>

                    {/* Capa Inferior: Progreso y Botón */}
                    <div className="flex items-center justify-between mt-auto relative z-10">
                      <div className="flex flex-col gap-2 w-[65%]">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Dominio</span>
                          <span className={score > 0 ? Theme.text : ''}>{score}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full ${Theme.bar} rounded-full transition-all duration-1000 ease-out relative`} 
                            style={{ width: `${score}%` }}
                          >
                            {score > 0 && <div className="absolute inset-0 bg-white/20 w-full h-full"></div>}
                          </div>
                        </div>
                      </div>

                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-sm
                        ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-600 group-hover:text-white group-hover:shadow-lg'}
                      `}>
                        {!isLocked && <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${Theme.gradient}`} />}
                        <div className="relative z-10">
                          {isLocked ? <Lock size={20} strokeWidth={2.5} /> : (status === 'completed' ? <CheckCircle2 size={22} /> : <Play size={20} fill="currentColor" className="ml-0.5" />)}
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

            {/* Estado Vacío */}
            {LEVELS.flatMap(l => [1,2,3,4]).filter(p => !searchTerm || searchTerm.length < 1).length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-200 border-dashed mt-8">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Sin resultados</h3>
                <p className="text-slate-500 font-medium">No se encontraron lecciones para "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-6 bg-slate-100 text-slate-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
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