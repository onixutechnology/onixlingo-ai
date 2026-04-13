'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import Cookies from 'js-cookie'; 
import { useUIStore } from '@/store/uiStore';

import { 
  ArrowLeft, BookA, Search, Play, Brain, 
  Briefcase, Code2, Plane, Users, Coffee, 
  Lock, CheckCircle2, Loader2, Home, Crown, User
} from 'lucide-react';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

// 1. CONFIGURACIÓN DE CATEGORÍAS
const CATEGORIES = [
  { id: 'basics', label: 'Life Essentials', icon: Coffee, theme: { base: 'orange', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', ring: 'focus:ring-orange-500', bar: 'bg-orange-500' } },
  { id: 'business', label: 'Business & Career', icon: Briefcase, theme: { base: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'focus:ring-indigo-500', bar: 'bg-indigo-500' } },
  { id: 'marketing', label: 'Marketing & Growth', icon: Users, theme: { base: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', ring: 'focus:ring-rose-500', bar: 'bg-rose-500' } },
  { id: 'tech', label: 'Technology & Dev', icon: Code2, theme: { base: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'focus:ring-emerald-500', bar: 'bg-emerald-500' } },
  { id: 'travel', label: 'Global Travel', icon: Plane, theme: { base: 'sky', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', ring: 'focus:ring-sky-500', bar: 'bg-sky-500' } },
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
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-emerald-600 shadow-emerald-500/40 group-hover:bg-emerald-500 group-hover:-translate-y-1'}`}>
          <Crown size={28} fill="currentColor" />
        </div>
        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity ${isActive('/dashboard/chess') ? 'text-amber-600 opacity-100' : 'text-emerald-600 opacity-0 group-hover:opacity-100'}`}>
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
  const { mode, setMode } = useUIStore();
  
  // Estados de UI
  const [activeCat, setActiveCat] = useState('basics');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de Datos Reales
  const [vocabProgress, setVocabProgress] = useState<any[]>([]);
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

        const res = await fetch(`${API_URL}/api/v1/progress/map`, { 
          headers,
          cache: 'no-store' 
        });

        if (res.ok) {
          const data = await res.json();
          setVocabProgress(data.vocab || []); 
        }
      } catch (error) {
        console.error("Error cargando vocabulario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- MODO PRO TOGGLE ---
  const toggleProMode = () => {
    setMode(mode === 'professional' ? 'student' : 'professional');
    router.push(mode === 'professional' ? '/dashboard' : '/dashboard/pro');
  };

  // --- HELPER PARA SABER ESTADO DE LECCIÓN ---
  const getLessonState = (lessonId: string) => {
    const lessonData = vocabProgress.find(p => p.lesson_id === lessonId);
    
    if (lessonData) {
      if (lessonData.status === 'completed') return 'completed';
      if (lessonData.status === 'active' || lessonData.is_unlocked) return 'active';
    }

    // Nivel 1 siempre activo
    if (lessonId === 'basics_mod_01') return 'active';

    return 'locked';
  };

  const getScore = (lessonId: string) => {
    const lessonData = vocabProgress.find(p => p.lesson_id === lessonId);
    return lessonData ? lessonData.score : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-slate-400 font-bold text-sm animate-pulse">Cargando glosario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- HEADER STICKY --- */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors duration-200 active:scale-95">
              <ArrowLeft size={22} strokeWidth={2.5} />
            </Link>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 text-slate-800">
              <div className={`p-2 rounded-xl shadow-sm ${Theme.bg} ${Theme.text}`}>
                <BookA size={24} />
              </div>
              <span>Vocabulary<span className="text-indigo-600">Pro</span></span>
            </h1>
          </div>
          {/* Stats Pill */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
              <Brain size={16} className="text-indigo-500" /> 
              <span>{vocabProgress.filter(l => l.status === 'completed').length} Dominadas</span>
            </div>
          </div>
        </div>

        {/* --- TABS DE NAVEGACIÓN --- */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-1">
          <div className="flex overflow-x-auto hide-scrollbar gap-8 pb-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`
                    pb-4 px-1 flex items-center gap-2.5 text-sm font-bold whitespace-nowrap transition-all border-b-[3px]
                    ${isActive 
                      ? `${cat.theme.border} ${cat.theme.text}` 
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}
                  `}
                >
                  <cat.icon size={18} className={isActive ? 'scale-110 transition-transform' : ''} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header de Sección + Buscador */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">
              {activeCategoryData.label}
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl">
              Domina el vocabulario esencial desde el nivel A1 hasta C1. Palabras técnicas, frases comunes y expresiones nativas.
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar lección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all shadow-sm
                focus:border-transparent ${Theme.ring} focus:ring-2 font-medium text-sm placeholder:text-slate-400
              `}
            />
          </div>
        </div>

        {/* --- GRID DE LECCIONES --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {LEVELS.flatMap((level, levelIndex) => [1, 2, 3, 4].map(part => { 
            // GENERACIÓN DE ID LÓGICO
            const moduleNum = (levelIndex * 4) + part; 
            const moduleStr = moduleNum.toString().padStart(2, '0'); 
            const lessonId = `${activeCat}_mod_${moduleStr}`;
            
            // ESTADO REAL DESDE DB
            const status = getLessonState(lessonId);
            const score = getScore(lessonId);
            const isLocked = status === 'locked';

            // Títulos dinámicos
            const baseTitle = activeCategoryData.label.split(' ')[0] || "Lesson";
            const displayTitle = `${baseTitle} Mastery • Level ${level}`;
            const subTitle = `Part ${part}: Essential Vocabulary & Phrases`;
            
            // Filtro de búsqueda
            if (searchTerm && !displayTitle.toLowerCase().includes(searchTerm.toLowerCase())) return null;

            // 🔥 RENDERIZADO DE TARJETA
            const CardContent = (
              <div className={`
                h-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 
                relative overflow-hidden isolate
                ${!isLocked ? `hover:border-transparent hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 cursor-pointer ${Theme.ring} focus:ring-2` : 'opacity-60 cursor-not-allowed bg-slate-50/50'}
              `}>
                
                {/* CAPA 0: Decoración de Fondo */}
                {!isLocked && (
                  <div className={`
                    absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-500 ease-out z-0 pointer-events-none
                    ${Theme.bg} group-hover:scale-150
                  `} />
                )}

                {/* CAPA 10: Contenido Superior */}
                <div className="flex items-start gap-4 mb-6 relative z-10">
                  <div className={`
                    w-14 h-14 flex flex-col items-center justify-center rounded-2xl font-black text-lg shrink-0 shadow-sm
                    ${!isLocked ? `${Theme.text} ${Theme.bg} border border-${Theme.base}-100` : 'bg-slate-200 text-slate-400'}
                  `}>
                    {level}
                    <span className="text-[9px] font-bold opacity-70 uppercase tracking-wider">Part {part}</span>
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className={`font-bold text-lg leading-tight truncate ${!isLocked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {displayTitle}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-1.5 truncate">
                      {subTitle}
                    </p>
                  </div>
                </div>

                {/* CAPA 10: Footer (Progreso y Botón) */}
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 relative z-10">
                  {/* Barra de Progreso */}
                  <div className="flex flex-col gap-1.5 w-[60%]">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Score</span>
                      <span className={score > 0 ? Theme.text : ''}>{score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${Theme.bar} rounded-full transition-all duration-1000`} 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Botón de Acción */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm relative overflow-hidden
                    ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-600 group-hover:text-white'}
                  `}>
                    {!isLocked && <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${Theme.bar}`} />}
                    <div className="relative z-10">
                      {isLocked ? <Lock size={18} /> : (status === 'completed' ? <CheckCircle2 size={18} /> : <Play size={18} fill="currentColor" className="ml-1" />)}
                    </div>
                  </div>
                </div>
              </div>
            );

            return isLocked ? (
              <div key={lessonId} className="block h-full">{CardContent}</div>
            ) : (
              <Link href={`/lesson/vocabulary/${lessonId}?type=vocab`} key={lessonId} className="group block h-full active:scale-95 transition-transform">
                {CardContent}
              </Link>
            );
          }))}
        </div>

        {/* Estado Vacío */}
        {LEVELS.flatMap(l => [1,2,3,4]).filter(p => !searchTerm || searchTerm.length < 1).length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No se encontraron lecciones para "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')} className="mt-4 text-indigo-600 text-sm font-bold hover:underline">
              Limpiar búsqueda
            </button>
          </div>
        )}

      </div>
      
      {/* 🟢 BARRA MÓVIL INTEGRADA AQUÍ */}
      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />

    </div>
  );
}
