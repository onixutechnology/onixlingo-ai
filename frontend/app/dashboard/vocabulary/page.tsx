'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, BookA, Search, Play, Brain, 
  Briefcase, Code2, Plane, Users 
} from 'lucide-react';

// --- CATEGORÍAS (Deben coincidir con el prefijo de tus archivos JSON) ---
const CATEGORIES = [
  { id: 'business', label: 'Business & Career', icon: Briefcase, color: 'indigo' },
  { id: 'marketing', label: 'Marketing & Growth', icon: Users, color: 'rose' }, // Ajustado según tu imagen
  { id: 'tech', label: 'Technology & Dev', icon: Code2, color: 'emerald' },
  { id: 'travel', label: 'Global Travel', icon: Plane, color: 'amber' },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function VocabularyPage() {
  const [activeCat, setActiveCat] = useState('business');
  const [searchTerm, setSearchTerm] = useState('');

  // Encontrar datos de la categoría activa (color, label, etc.)
  const activeCategoryData = CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl md:text-2xl font-black flex items-center gap-2">
              <BookA className={`text-${activeCategoryData.color}-600`} size={28} />
              Word Mastery
            </h1>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600">
              <Brain size={16} /> <span>Vocabulario Pro</span>
            </div>
          </div>
        </div>
        
        {/* TABS DE CATEGORÍA */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex overflow-x-auto hide-scrollbar gap-6 mt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`
                pb-4 px-2 flex items-center gap-2 font-bold whitespace-nowrap transition-all border-b-4
                ${activeCat === cat.id 
                  ? `border-${cat.color}-500 text-${cat.color}-600` 
                  : 'border-transparent text-slate-400 hover:text-slate-600'}
              `}
            >
              <cat.icon size={20} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* BARRA DE BÚSQUEDA */}
        <div className="mb-8 relative max-w-md">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
                type="text"
                placeholder="Buscar lección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
        </div>

        {/* GRID DE LECCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEVELS.flatMap((level, levelIndex) => [1, 2].map(part => { // 2 partes por nivel
            
            // --- 🔧 CÁLCULO DEL ID REAL PARA QUE COINCIDA CON TUS ARCHIVOS ---
            // Nivel 0 (A1) -> part 1 -> mod_01
            // Nivel 0 (A1) -> part 2 -> mod_02
            // Nivel 1 (A2) -> part 1 -> mod_03 ...
            const moduleNum = (levelIndex * 2) + part; 
            const moduleStr = moduleNum.toString().padStart(2, '0'); // "01", "02", "10"
            
            // ID FINAL: business_mod_01 (Coincide con tu imagen 5)
            const lessonId = `${activeCat}_mod_${moduleStr}`;
            
            const title = `${activeCategoryData.label.split(' ')[0]} Mastery ${level}-${part}`;
            const color = activeCategoryData.color;
            
            if (searchTerm && !title.toLowerCase().includes(searchTerm.toLowerCase())) return null;

            return (
              <Link href={`/lesson/vocabulary/${lessonId}`} key={lessonId} className="group block">
                <div className={`
                  bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center gap-5 transition-all duration-300
                  hover:border-${color}-200 hover:shadow-xl hover:shadow-${color}-500/10 hover:-translate-y-1 relative overflow-hidden
                `}>
                  {/* Badge de Nivel */}
                  <div className={`
                    w-16 h-16 flex flex-col items-center justify-center rounded-xl font-black text-xl shrink-0
                    bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform
                  `}>
                    {level}
                    <span className="text-[10px] opacity-60">PART {part}</span>
                  </div>

                  <div className="flex-1 min-w-0 z-10">
                    <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-900 truncate">
                      {title}
                    </h3>
                    {/* Barra de progreso visual (simulada) */}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-full max-w-[120px] h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-${color}-500 w-[0%] group-hover:w-[10%] transition-all`}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Start Drill</span>
                    </div>
                  </div>

                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm
                    bg-slate-50 text-slate-400 group-hover:bg-${color}-600 group-hover:text-white
                  `}>
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </Link>
            );
          }))}
        </div>
      </div>
    </div>
  );
}