'use client';
import LandingFooter from '@/components/LandingFooter';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Mic, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Gem,
  Crown,
  Languages,
  LayoutGrid,
  Building2,
  Zap,
  Trophy,
  User
} from 'lucide-react';
import FloatingParticles from '@/components/FloatingParticles';
import LandingNavbar from '@/components/LandingNavbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#D4AF37]/30 selection:text-black">
      
      <LandingNavbar />

      {/* --- SECCIÓN 1: HERO (NEGRO) --- */}
      <main className="pt-40 pb-24 px-6 relative overflow-hidden bg-slate-50">
        <FloatingParticles />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-none">
            <Sparkles size={12} className="text-[#D4AF37]" />
            El Sistema Universal
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] uppercase">
            Aprende Inglés, Francés, Chino y Ajedrez
          </h1>

          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-light">
            La infraestructura que sostiene el crecimiento moderno. Desarrolla fluidez, confianza y estrategia bajo un mismo ecosistema profesional.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#D4AF37] text-black border border-[#D4AF37] text-lg font-bold py-4 px-10 rounded-none shadow-xl shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:bg-[#b5952f] uppercase tracking-widest">
                Explorar Ecosistema <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border border-gray-300 text-black hover:border-black hover:bg-white text-lg font-bold py-4 px-10 rounded-none transition-all shadow-none hover:shadow-none uppercase tracking-widest">
                Portal de Clientes
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* --- SECCIÓN 2: MÉTRICAS (BLANCA LIMPIA) --- */}
      <section className="py-20 bg-white border-y border-gray-200 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-none p-8 flex gap-4 items-start shadow-none hover:shadow-none transition-shadow animate-fade-in-up [animation-delay:200ms] opacity-0">
              <div className="p-3 bg-slate-50 text-slate-900 shrink-0"><LayoutGrid size={24} /></div>
              <div>
                <h4 className="font-bold text-black uppercase tracking-widest text-sm mb-2">Integración Total</h4>
                <p className="text-gray-800 text-sm leading-relaxed">Unión perfecta de software corporativo y educación en múltiples idiomas.</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-none p-8 flex gap-4 items-start shadow-none hover:shadow-none transition-shadow animate-fade-in-up [animation-delay:400ms] opacity-0">
              <div className="p-3 bg-slate-50 text-slate-900 shrink-0"><User size={24} /></div>
              <div>
                <h4 className="font-bold text-black uppercase tracking-widest text-sm mb-2">Capacitación Experta</h4>
                <p className="text-gray-800 text-sm leading-relaxed">Formamos para el dominio absoluto con simuladores de IA avanzados.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-none p-8 flex gap-4 items-start shadow-none hover:shadow-none transition-shadow animate-fade-in-up [animation-delay:600ms] opacity-0">
              <div className="p-3 bg-slate-50 text-slate-900 shrink-0"><CheckCircle2 size={24} /></div>
              <div>
                <h4 className="font-bold text-black uppercase tracking-widest text-sm mb-2">Garantía Vitalicia</h4>
                <p className="text-gray-800 text-sm leading-relaxed">Soporte técnico blindado y actualización continua de lecciones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: ECOSISTEMA ESPACIAL (DORADO 20%) --- */}
      <section id="features" className="py-32 bg-[#D4AF37]/20 text-black relative z-10 border-b border-[#D4AF37]/30 overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 md:flex justify-between items-end border-b border-black/10 pb-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-black tracking-widest uppercase mb-4">Nuestro <span className="text-slate-900 bg-white px-2 py-1">Ecosistema</span></h2>
              <p className="text-black text-lg font-bold leading-relaxed">
                Tecnología de clase mundial diseñada para escalar sin límites, con máxima seguridad y un rendimiento operativo insuperable.
              </p>
            </div>
            <div className="hidden md:block">
              <button className="text-black font-bold uppercase tracking-widest text-sm hover:text-slate-900 transition-colors flex items-center gap-2 bg-[#D4AF37] px-4 py-2 border border-black">
                Explorar <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Idiomas */}
            <div className="lg:col-span-2 group bg-white p-8 rounded-none border border-black hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0 [animation-delay:100ms]">
              <div className="w-12 h-12 bg-white text-slate-900 border border-black rounded-none flex items-center justify-center mb-6">
                <Languages size={24} />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3 uppercase tracking-widest">Soberanía Multilingüe</h3>
              <p className="text-black font-medium leading-relaxed mb-6">
                Instrucción rigurosa de Inglés, Francés y Chino Mandarín adaptada a los estándares de competencia del MCER. Interacción acústica con avatares nativos y retroalimentación de pronunciación instantánea.
              </p>
            </div>

            {/* Ajedrez */}
            <div className="group bg-white p-8 rounded-none border border-black hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0 [animation-delay:200ms]">
              <div className="w-12 h-12 bg-white text-slate-900 border border-black rounded-none flex items-center justify-center mb-6">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">Ajedrez Táctico</h3>
              <p className="text-black font-medium leading-relaxed text-sm">
                Entrenamiento y puzzles asistidos por IA. Analiza tus blunders y mejora tu cálculo bajo presión.
              </p>
            </div>

            {/* Simulación Ejecutiva */}
            <div className="group bg-white p-8 rounded-none border border-black hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0 [animation-delay:300ms]">
              <div className="w-12 h-12 bg-white text-slate-900 border border-black rounded-none flex items-center justify-center mb-6">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">Simulación Alta Dirección</h3>
              <p className="text-black font-medium leading-relaxed text-sm">
                Negociaciones, reuniones de directorio y presentaciones frente a inversores controlados por IA corporativa.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECCIÓN 4: CTA FINAL (NEGRO) --- */}
      <section className="py-32 bg-slate-50 text-center px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight uppercase">
            El conocimiento global <br/>en tus manos.
          </h2>
          <p className="text-xl text-slate-700 font-light max-w-2xl mx-auto">
            Únete a OnixLingo y transforma la forma en la que aprendes, compites y te comunicas con el mundo.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/register">
              <button className="bg-[#D4AF37] text-black border border-[#D4AF37] text-xl font-bold py-5 px-12 rounded-none transition-all shadow-xl shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 uppercase tracking-widest">
                Crear Cuenta Corporativa
              </button>
            </Link>
            <p className="text-sm text-slate-600 font-medium">Acceso inmediato a la infraestructura de formación.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <LandingFooter />

    </div>
  );
}
