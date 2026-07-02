'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Crown,
  Languages,
  Building2,
  Mic,
  ChevronRight
} from 'lucide-react';

const LandingNavbar = dynamic(() => import('@/components/LandingNavbar'), { ssr: true });
const LandingFooter = dynamic(() => import('@/components/LandingFooter'), { ssr: true });
const FloatingParticles = dynamic(() => import('@/components/FloatingParticles'), { 
  ssr: false, // Las partículas son pesadas y puramente visuales, no necesitan SSR
});

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function Home() {
  const [prices, setPrices] = useState({ pro: 129, exec: 249 });

  useEffect(() => {
    const controller = new AbortController(); // Evita fugas de memoria si el usuario cambia de página rápido
    fetch(`${API_URL}/api/v1/billing/public/pricing`, { 
      signal: controller.signal,
      next: { revalidate: 3600 } // Optimización de Next.js para cachear la respuesta
    })
      .then(res => res.json())
      .then(data => {
        setPrices({
          pro: data.display_price_pro_monthly || 129,
          exec: data.display_price_exec_monthly || 249
        });
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error("Error fetching pricing:", err);
      });

    return () => controller.abort(); // Limpieza del hook
  }, []);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#D4AF37]/30 selection:text-black font-sans overflow-x-hidden">
      
      <LandingNavbar />

      {/* --- FASE 1: HERO (SHARP EXECUTIVE) --- */}
      <main className="relative pt-32 pb-24 px-6 min-h-[85vh] flex flex-col justify-center items-center bg-slate-50 border-b border-gray-200">
        <FloatingParticles />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 mt-16 md:mt-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-sm"
          >
            <Sparkles size={12} className="text-[#D4AF37]" />
            El Sistema Ejecutivo Definitivo
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] uppercase"
          >
            Domina <span className="text-[#D4AF37]">Idiomas</span> y<br className="hidden md:block"/> Estrategia de Ajedrez
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Infraestructura cognitiva para Alta Dirección. Desarrolla fluidez, confianza y cálculo bajo presión en un ecosistema impulsado por IA de próxima generación.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center pt-8"
          >
            <Link href="/register" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto relative overflow-hidden bg-[#D4AF37] text-black text-sm font-bold py-4 px-10 rounded-none shadow-md transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl hover:bg-[#b5952f] uppercase tracking-widest border border-black">
                <span className="relative z-10 flex items-center gap-2">Explorar Ecosistema <ArrowRight size={18} /></span>
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border border-gray-300 text-black hover:bg-gray-50 hover:border-black text-sm font-bold py-4 px-10 rounded-none transition-all shadow-none uppercase tracking-widest">
                Portal de Clientes
              </button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* --- FASE 2: ECOSISTEMA (GRID CUADRADO Y LIMPIO) --- */}
      <section id="features" className="py-24 bg-[#D4AF37]/10 relative z-10 border-b border-black/20">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight uppercase">Arquitectura <span className="bg-white px-3 py-1 border border-black/10">Premium</span></h2>
            <p className="text-slate-700 max-w-2xl mx-auto font-light text-lg">Tecnología de clase mundial diseñada para acelerar tu crecimiento intelectual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Box 1: Idiomas (Largo) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="lg:col-span-2 relative overflow-hidden rounded-none border border-black bg-white p-8 flex flex-col justify-start group hover:border-[#D4AF37] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all cursor-default"
            >
              <div className="mb-6 p-4 bg-slate-50 w-fit rounded-none border border-gray-200">
                <Languages size={28} className="text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 uppercase tracking-widest">Soberanía Multilingüe</h3>
              <p className="text-slate-700 font-medium leading-relaxed">Instrucción rigurosa de Inglés, Francés y Chino adaptada al MCER. Interacción acústica con avatares nativos y retroalimentación de pronunciación instantánea con latencia ultra baja.</p>
            </motion.div>

            {/* Box 2: Ajedrez */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-none border border-black bg-white p-8 flex flex-col justify-start group hover:border-[#D4AF37] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all cursor-default"
            >
              <div className="mb-6 p-4 bg-slate-50 w-fit rounded-none border border-gray-200">
                <Crown size={28} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-widest">Ajedrez Táctico</h3>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">Entrenamiento asistido por motor de cálculo. Analiza tus blunders y mejora tu toma de decisiones bajo presión extrema.</p>
            </motion.div>

            {/* Box 3: Simulación */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-none border border-black bg-white p-8 flex flex-col justify-start group hover:border-[#D4AF37] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all cursor-default"
            >
              <div className="mb-6 p-4 bg-slate-50 w-fit rounded-none border border-gray-200">
                <Building2 size={28} className="text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-widest">Alta Dirección</h3>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">Negociaciones de M&A y juntas de directorio simuladas para entrenar situaciones ejecutivas del mundo real.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- FASE 3: PRECIOS Y CTA (BLOQUES PLANOS Y SHARP) --- */}
      <section className="py-24 bg-slate-50 relative z-10 border-t border-gray-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase">Invierte en tu <br className="md:hidden"/><span className="text-[#D4AF37]">Capital Intelectual</span></h2>
            <p className="text-slate-700 max-w-2xl mx-auto font-light text-lg">Selecciona el tier que mejor se adapte a tus ambiciones corporativas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-none border border-gray-300 bg-white p-8 flex flex-col justify-between hover:border-black transition-all shadow-none hover:shadow-xl">
              <div>
                <h3 className="font-bold text-xl uppercase tracking-widest text-slate-900 mb-2">Free</h3>
                <p className="text-gray-500 text-sm mb-8">Exploración inicial.</p>
                <div className="text-5xl font-black text-black font-mono mb-8">$0 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ mes</span></div>
                <ul className="space-y-4 mb-8 text-sm text-gray-700">
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-slate-900"/> <span>Lecciones estándar A1</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-slate-900"/> <span>2 puzzles diarios</span></li>
                </ul>
              </div>
              <Link href="/register">
                <button className="w-full bg-white border border-black text-black font-bold py-4 rounded-none hover:bg-slate-900 hover:text-white transition-colors text-sm uppercase tracking-widest">
                  Empezar Gratis
                </button>
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-none border-2 border-black bg-white p-8 flex flex-col justify-between relative shadow-[8px_8px_0px_0px_rgba(212,175,55,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] transition-all">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black text-[10px] font-bold px-4 py-1 rounded-none uppercase tracking-widest border border-black">
                Recomendado
              </div>
              <div>
                <h3 className="font-bold text-xl uppercase tracking-widest text-slate-900 mb-2">Pro</h3>
                <p className="text-gray-500 text-sm mb-8">Profesionales independientes.</p>
                <div className="text-5xl font-black text-black font-mono mb-8">${prices.pro} <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ mes</span></div>
                <ul className="space-y-4 mb-8 text-sm text-gray-800 font-medium">
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4AF37]"/> <span>Acceso ilimitado A1-C2</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4AF37]"/> <span>Ajedrez táctico ilimitado</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#D4AF37]"/> <span>Certificaciones Oficiales</span></li>
                </ul>
              </div>
              <Link href="/planes">
                <button className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-none border border-black hover:bg-[#b5952f] transition-colors text-sm uppercase tracking-widest">
                  Ver Detalles Pro
                </button>
              </Link>
            </div>

            {/* Executive */}
            <div className="rounded-none border border-gray-300 bg-white p-8 flex flex-col justify-between hover:border-black transition-all shadow-none hover:shadow-xl">
              <div>
                <h3 className="font-bold text-xl uppercase tracking-widest text-slate-900 mb-2">Executive</h3>
                <p className="text-gray-500 text-sm mb-8">Membresía Alta Dirección.</p>
                <div className="text-5xl font-black text-black font-mono mb-8">${prices.exec} <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ mes</span></div>
                <ul className="space-y-4 mb-8 text-sm text-gray-700">
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-slate-900"/> <span>Simulador Corporativo IA</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-slate-900"/> <span>Speech Analytics Avanzado</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-slate-900"/> <span>Soporte Prioritario</span></li>
                </ul>
              </div>
              <Link href="/planes">
                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-none hover:bg-black transition-colors text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                  Adquirir Executive <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <div className="border-t border-black/10">
        <LandingFooter />
      </div>
    </div>
  );
}
