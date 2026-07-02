'use client';
import LandingNavbar from '@/components/LandingNavbar';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, ChevronRight, Play
} from 'lucide-react';

const languages = [
  { id: 'en', flag: '🇺🇸', name: 'Inglés', count: '3,000+ palabras' },
  { id: 'fr', flag: '🇫🇷', name: 'Francés', count: '3,000+ palabras' },
  { id: 'zh', flag: '🇨🇳', name: 'Chino Mandarín', count: '3,000+ palabras' },
];

const categories = [
  { id: 'basics', title: 'Fundamentos Cotidianos', desc: 'Interacciones básicas cotidianas y cortesía.' },
  { id: 'lifestyle', title: 'Estilo de Vida', desc: 'Bienestar, pasatiempos y salud diaria.' },
  { id: 'travel', title: 'Viajes y Exploración', desc: 'Vocabulario esencial para turismo y aeropuertos.' },
  { id: 'business', title: 'Negocios y Corporativo', desc: 'Términos estándar del trabajo y reuniones.' },
  { id: 'marketing', title: 'Marketing y Ventas', desc: 'Campañas, métricas, publicidad y branding.' },
  { id: 'negotiation', title: 'Negociación', desc: 'Resolución de conflictos y tratos.' },
  { id: 'networking', title: 'Networking y Sociales', desc: 'Relaciones profesionales y contactos.' },
  { id: 'finance', title: 'Finanzas e Inversiones', desc: 'Mercados bursátiles, presupuestos y activos.' },
  { id: 'leadership', title: 'Liderazgo Ejecutivo', desc: 'Gestión de equipos, visión y oratoria.' },
  { id: 'innovation', title: 'Innovación', desc: 'Investigación, desarrollo y futuro.' },
  { id: 'tech', title: 'Tecnología y Datos', desc: 'Software, hardware, internet y seguridad.' }
];

const levels = [
  { id: 1, name: 'A1', desc: 'Principiante', color: 'text-[#D4AF37] bg-gray-200' },
  { id: 2, name: 'A2', desc: 'Elemental', color: 'text-[#D4AF37] bg-emerald-200' },
  { id: 3, name: 'B1', desc: 'Intermedio', color: 'text-gray-900 bg-indigo-100' },
  { id: 4, name: 'B2', desc: 'Avanzado', color: 'text-indigo-800 bg-indigo-200' },
  { id: 5, name: 'C1', desc: 'Fluidez', color: 'text-pink-700 bg-pink-100' },
  { id: 6, name: 'C2', desc: 'Maestría', color: 'text-pink-800 bg-pink-200' },
];

const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));
const levelMap = Object.fromEntries(levels.map(l => [l.id, l]));

export default function VocabularioPage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [selectedLevel, setSelectedLevel] = useState(4); // Default to B2

  const handleStartDrill = () => {
    // Navigate directly to the actual interactive drill
    const lessonId = `${selectedCategory}_mod_${selectedLevel}`;
    router.push(`/lesson/vocabulary/${lessonId}?lang=${selectedLang}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#D4AF37]/30 selection:text-black pb-20">
      
      {/* NAVBAR */}
      <LandingNavbar />

      {/* HERO SECTION (WHITE) */}
      <header className="pt-28 pb-12 px-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#D4AF37]/10 blur-[130px] opacity-40 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-none">
            <BookOpen size={12} className="text-[#D4AF37] animate-pulse" />
            Estructuración Léxica Avanzada (SRS)
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Expansión de Vocabulario<br />
            <span className="text-[#D4AF37]">Permanente y Científica.</span>
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-light">
            Domina 3,000+ términos clave por idioma mediante algoritmos de repetición espaciada y simuladores interactivos diseñados para retención activa bajo estrés.
          </p>
        </div>
      </header>

      {/* LANGUAGE SELECTOR (WHITE) */}
      <section className="py-6 px-6 bg-white border-y border-black shadow-none">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-base text-black">1. Vector de Aprendizaje</h3>
            <p className="text-gray-600 text-xs mt-0.5">Selecciona el idioma objetivo alineado con la currícula del MCER.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLang(l.id)}
                className={`flex-1 md:flex-none flex items-center gap-3 px-5 py-3 border font-bold transition-all ${selectedLang === l.id ? 'border-black bg-white text-slate-900 shadow-none' : 'border-gray-200 bg-white hover:border-gray-400 text-black'}`}
              >
                <span className="text-xl">{l.flag}</span>
                <div className="text-left">
                  <p className="text-xs font-black">{l.name}</p>
                  <p className={`text-[9px] font-semibold ${selectedLang === l.id ? 'text-slate-700' : 'text-slate-500'}`}>{l.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY & LEVEL SELECTOR (GOLD 20%) */}
      <section className="py-16 px-6 bg-[#D4AF37]/20 border-b border-black">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* CATEGORIES */}
          <div>
            <div className="mb-6 text-center md:text-left">
              <h3 className="font-bold text-xl text-black">2. Módulos Temáticos</h3>
              <p className="text-black text-xs mt-0.5 font-medium">Selecciona el área de enfoque léxico.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${selectedCategory === c.id ? 'border-black bg-white text-slate-900 shadow-none' : 'border-black/20 bg-white hover:border-black/50 hover:bg-white shadow-none'}`}
                >
                  <h4 className={`font-bold text-sm mb-1 ${selectedCategory === c.id ? 'text-slate-900' : 'text-black'}`}>{c.title}</h4>
                  <p className={`text-[10px] font-medium ${selectedCategory === c.id ? 'text-slate-700' : 'text-gray-600'}`}>{c.desc}</p>
                  <div className={`mt-3 flex items-center gap-1 text-[10px] font-bold ${selectedCategory === c.id ? 'text-[#D4AF37]' : 'text-black/50'}`}>
                    {selectedCategory === c.id ? 'Seleccionado' : 'Elegir'} <ChevronRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEVELS */}
          <div>
            <div className="mb-6 text-center md:text-left">
              <h3 className="font-bold text-xl text-black">3. Nivel de Fluidez (MCER)</h3>
              <p className="text-black text-xs mt-0.5 font-medium">Selecciona la dificultad de las palabras.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-6 py-3 border font-bold transition-all flex flex-col items-center flex-1 ${selectedLevel === lvl.id ? 'border-black bg-white text-slate-900 shadow-none' : 'border-black/20 bg-white hover:bg-white shadow-none'}`}
                >
                  <span className={`text-sm px-2 py-0.5 mb-1 ${selectedLevel === lvl.id ? 'text-black bg-[#D4AF37]' : 'text-black bg-gray-200'}`}>{lvl.name}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${selectedLevel === lvl.id ? 'text-slate-700' : 'text-gray-600'}`}>{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* START DRILL CTA (BLACK) */}
      <section className="py-12 px-6 bg-slate-50 text-slate-900 border-t border-black text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto shadow-inner rounded-none">
            <Play size={28} className="ml-1" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-slate-900">Iniciar Simulador Interactivo</h4>
            <p className="text-slate-600 text-sm">
              Módulo: <span className="font-bold text-[#D4AF37]">{categoryMap[selectedCategory]?.title}</span> - Nivel: <span className="font-bold text-[#D4AF37]">{levelMap[selectedLevel]?.name}</span>
            </p>
          </div>
          <button
            onClick={handleStartDrill}
            className="w-full md:w-auto bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-4 px-12 text-sm tracking-wider uppercase transition-all shadow-none hover:scale-105 active:scale-95 border border-[#D4AF37]"
          >
            Comenzar Entrenamiento
          </button>
        </div>
      </section>

    </div>
  );
}
