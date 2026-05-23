'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Crown,
  BookA,
  Languages,
  Zap,
  Sparkles
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-teal-100 selection:text-teal-900">

      {/* --- NAVBAR SQUARE HIGH DENSITY --- */}
      <nav className="fixed w-full bg-white border-b border-slate-200 z-50 h-12 flex items-center shadow-none">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-teal-600 flex items-center justify-center shadow-none">
              <span className="text-white font-black text-[9px]">O</span>
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-[11px] uppercase">OnixLingo AI</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/login" className="text-[9px] font-black text-slate-500 hover:text-teal-600 uppercase tracking-widest transition-colors">
              Ingresar
            </Link>
            <Link href="/register">
              <button className="bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black py-1.5 px-4 rounded-none transition-all active:scale-95 uppercase tracking-widest">
                Crear Cuenta
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION: SQUARE & CENTERED --- */}
      <header className="pt-32 pb-20 px-6 text-center relative overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-teal-700 text-[8px] font-black uppercase tracking-[0.2em]"
          >
            <Sparkles size={10} className="text-teal-500" /> Aprendizaje Corporativo
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase font-serif italic">
            Excelencia <br /> <span className="text-teal-600">Cognitiva.</span>
          </h1>

          <p className="text-[10px] md:text-xs text-slate-500 max-w-xl mx-auto leading-relaxed font-bold uppercase tracking-widest opacity-80">
            Sistemas avanzados de tutoría en Inglés, Francés y Chino. <br />
            Optimización del pensamiento estratégico mediante ajedrez técnico.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/ventas">
              <button className="bg-slate-900 text-white text-[9px] font-black py-4 px-12 rounded-none transition-all uppercase tracking-[0.2em] shadow-lg hover:bg-teal-600">
                Ver Planes Pro
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* --- SERVICES GRID: RIGID SQUARE CARDS --- */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200">
          
          {/* Idiomas */}
          <div className="p-10 border-r border-b md:border-b-0 border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 bg-teal-600 text-white flex items-center justify-center mb-6 shadow-none">
              <Languages size={16} />
            </div>
            <h3 className="text-xs font-black text-slate-900 mb-3 tracking-widest uppercase font-serif italic">Módulo Lingüístico</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight opacity-70 mb-6">
              Entrenamiento en tres lenguas clave para el mercado global actual.
            </p>
            <div className="flex gap-2">
              {['USA', 'FRA', 'CHN'].map(l => (
                <span key={l} className="text-[7px] font-black px-2 py-0.5 border border-slate-200 text-slate-400">{l}</span>
              ))}
            </div>
          </div>

          {/* Ajedrez */}
          <div className="p-10 border-r border-b md:border-b-0 border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 bg-teal-600 text-white flex items-center justify-center mb-6 shadow-none">
              <Crown size={16} />
            </div>
            <h3 className="text-xs font-black text-slate-900 mb-3 tracking-widest uppercase font-serif italic">Centro Estratégico</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight opacity-70 mb-6">
              Academia de ajedrez diseñada para potenciar la toma de decisiones.
            </p>
            <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest">Acreditación Titanium</span>
          </div>

          {/* Tech */}
          <div className="p-10 hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 bg-teal-600 text-white flex items-center justify-center mb-6 shadow-none">
              <Zap size={16} />
            </div>
            <h3 className="text-xs font-black text-slate-900 mb-3 tracking-widest uppercase font-serif italic">Onix Core IA</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight opacity-70 mb-6">
              Motor de procesamiento de lenguaje natural de baja latencia.
            </p>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Versión 8.0.0</span>
          </div>

        </div>
      </section>

      {/* --- PRO SECTION: SQUARE DARK --- */}
      <section className="py-24 bg-slate-50 px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto bg-slate-950 p-12 md:p-16 border border-slate-800 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-teal-600"></div>
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[8px] font-black uppercase tracking-widest">
              Standard de Oro
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none font-serif italic">
              OnixLingo <span className="text-teal-400">Pro</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
              Acceso a métricas avanzadas, simuladores de juntas y soporte técnico prioritario.
            </p>
            <Link href="/register?tier=pro" className="inline-block">
              <button className="bg-white text-slate-950 px-10 py-3 rounded-none font-black text-[9px] uppercase tracking-widest hover:bg-teal-400 transition-all active:scale-95">
                Suscribirse a Pro
              </button>
            </Link>
          </div>
          <div className="w-40 h-40 bg-white/5 border border-white/10 flex items-center justify-center">
            <Zap size={64} className="text-teal-400 opacity-50" />
          </div>
        </div>
      </section>

      {/* --- FOOTER SQUARE --- */}
      <footer className="bg-white py-16 px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-teal-600 flex items-center justify-center shadow-none">
                <span className="text-white font-black text-[9px]">O</span>
              </div>
              <span className="font-black text-slate-900 tracking-widest text-[10px] uppercase">OnixLingo AI</span>
           </div>
           <div className="flex gap-10 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <Link href="/ventas" className="hover:text-teal-600 transition-colors">Ventas</Link>
              <Link href="/legal/privacy" className="hover:text-teal-600 transition-colors">Privacidad</Link>
              <Link href="/legal/terms" className="hover:text-teal-600 transition-colors">Términos</Link>
              <Link href="/legal/support" className="hover:text-teal-600 transition-colors">Soporte</Link>
           </div>
           <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">
             © 2026 ONIXU TECHNOLOGY PARTNERS.
           </p>
        </div>
      </footer>

    </div>
  );
}