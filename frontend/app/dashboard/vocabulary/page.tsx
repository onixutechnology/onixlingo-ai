'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, BookA, Search, Play, Brain, 
  Briefcase, Code2, Plane, Users, Coffee, 
  Lock, CheckCircle2, Sparkles
} from 'lucide-react';

// 1. CONFIGURACIÓN DE CATEGORÍAS (Colores seguros para Tailwind)
const CATEGORIES = [
  { 
    id: 'basics', 
    label: 'Life Essentials', 
    icon: Coffee, 
    theme: { base: 'orange', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', ring: 'focus:ring-orange-500', bar: 'bg-orange-500' }
  },
  { 
    id: 'business', 
    label: 'Business & Career', 
    icon: Briefcase, 
    theme: { base: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'focus:ring-indigo-500', bar: 'bg-indigo-500' }
  },
  { 
    id: 'marketing', 
    label: 'Marketing & Growth', 
    icon: Users, 
    theme: { base: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', ring: 'focus:ring-rose-500', bar: 'bg-rose-500' }
  },
  { 
    id: 'tech', 
    label: 'Technology & Dev', 
    icon: Code2, 
    theme: { base: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'focus:ring-emerald-500', bar: 'bg-emerald-500' }
  },
  { 
    id: 'travel', 
    label: 'Global Travel', 
    icon: Plane, 
    theme: { base: 'sky', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', ring: 'focus:ring-sky-500', bar: 'bg-sky-500' }
  },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function VocabularyPage() {
  const [activeCat, setActiveCat] = useState('basics');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener datos de la categoría activa
  const activeCategoryData = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];
  const Theme = activeCategoryData.theme;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans text-slate-900 selection:bg-slate-200">
      
      {/* --- HEADER STICKY --- */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors duration-200">
              <ArrowLeft size={22} strokeWidth={2.5} />
            </Link>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 text-slate-800">
              <div className={`p-2 rounded-lg ${Theme.bg} ${Theme.text}`}>
                <BookA size={24} />
              </div>
              <span>Vocabulary<span className="text-slate-400">Pro</span></span>
            </h1>
          </div>
          
          {/* Stats Pill (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 shadow-sm">
              <Brain size={14} className="text-slate-400" /> 
              <span>40 Lecciones Activas</span>
            </div>
          </div>
        </div>

        {/* --- TABS DE NAVEGACIÓN (Horizontal Scroll) --- */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-1">
          <div className="flex overflow-x-auto hide-scrollbar gap-8 pb-0 mask-gradient-right">
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header de Sección + Buscador */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
              {activeCategoryData.label}
            </h2>
            <p className="text-slate-500 font-medium">
              Domina el vocabulario esencial desde el nivel A1 hasta C1.
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
            <input 
                type="text"
                placeholder="Buscar lección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none transition-all shadow-sm
                  focus:border-transparent ${Theme.ring} focus:ring-2
                `}
            />
          </div>
        </div>

        {/* --- GRID DE LECCIONES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEVELS.flatMap((level, levelIndex) => [1, 2, 3, 4].map(part => { 
            
            // LÓGICA DE DATOS
            const moduleNum = (levelIndex * 4) + part; 
            const moduleStr = moduleNum.toString().padStart(2, '0'); // "01", "20"
            const lessonId = `${activeCat}_mod_${moduleStr}`;
            
            // Títulos dinámicos simulados para que se vea profesional
            const baseTitle = activeCategoryData.label.split(' ')[0] || "Lesson";
            const displayTitle = `${baseTitle} Mastery • Level ${level}`;
            const subTitle = `Part ${part}: Essential Vocabulary & Phrases`;
            
            // Filtro de búsqueda
            if (searchTerm && !displayTitle.toLowerCase().includes(searchTerm.toLowerCase())) return null;

            return (
              <Link href={`/lesson/vocabulary/${lessonId}`} key={lessonId} className="group block h-full">
                <div className={`
                  h-full bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden
                  hover:border-transparent hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1
                  ${Theme.ring} focus:ring-2 outline-none
                `}>
                  
                  {/* Contenido Superior */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Badge de Nivel */}
                    <div className={`
                      w-14 h-14 flex flex-col items-center justify-center rounded-2xl font-black text-lg shrink-0 shadow-inner
                      ${Theme.bg} ${Theme.text}
                    `}>
                      {level}
                      <span className="text-[9px] font-bold opacity-60 uppercase tracking-wider">Part {part}</span>
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-slate-900 truncate">
                        {displayTitle}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 mt-1 truncate">
                        {subTitle}
                      </p>
                    </div>
                  </div>

                  {/* Footer de la Card */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    
                    {/* Barra de Progreso (Simulada) */}
                    <div className="flex flex-col gap-1.5 w-1/2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${Theme.bar} w-[5%] rounded-full opacity-80`}></div>
                      </div>
                    </div>

                    {/* Botón de Acción */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm group-hover:shadow-md
                      bg-slate-50 text-slate-400 group-hover:text-white
                    `}
                    // Aquí inyectamos el color de fondo solo en hover usando style para evitar conflictos
                    style={{ '--hover-bg': `var(--${activeCat}-color)` } as React.CSSProperties}
                    >
                      {/* El botón cambia de color basado en la categoría */}
                      <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${Theme.bar}`} />
                      <Play size={18} fill="currentColor" className="ml-1 relative z-10" />
                    </div>

                  </div>
                  
                  {/* Decoración Hover (Brillo sutil) */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${Theme.bg.replace('bg-', 'from-')}`} />
                </div>
              </Link>
            );
          }))}
        </div>
        
        {/* Estado Vacío (Si la búsqueda falla) */}
        {LEVELS.flatMap(l => [1,2,3,4]).filter(p => !searchTerm || searchTerm.length < 1).length === 0 && (
            <div className="text-center py-20 opacity-50">
                <Search size={48} className="mx-auto mb-4 text-slate-300" />
                <p>No lessons found for "{searchTerm}"</p>
            </div>
        )}

      </div>
    </div>
  );
}