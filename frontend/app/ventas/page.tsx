'use client';
import LandingFooter from '@/components/LandingFooter';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Check } from 'lucide-react';

export default function VentasPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#D4AF37]/20 selection:text-black">
      
      {/* NAVBAR SQUARE */}
      <nav className="sticky top-0 z-50 bg-white border-b border-black px-6 h-12 flex items-center justify-between shadow-none">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#D4AF37] flex items-center justify-center">
            <span className="text-black font-black text-[9px]">O</span>
          </div>
          <span className="font-black text-slate-900 text-[10px] tracking-tighter uppercase">OnixLingo</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[9px] font-black text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-widest">Ingresar</Link>
          <Link href="/register">
             <button className="bg-[#D4AF37] text-black px-6 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-[#b5952f] transition-all active:scale-95">
                Crear Cuenta
             </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 bg-white">
        
        {/* HERO SQUARE */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white text-[#D4AF37] px-4 py-1.5 border border-black mb-6">
            <ShieldCheck size={12} />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Catálogo de Licencias Individuales</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-4 uppercase leading-none font-serif italic">
            Inversión en <span className="text-[#D4AF37]">tu Aprendizaje.</span>
          </h1>
          <p className="text-[10px] text-gray-600 max-w-xl mx-auto font-bold uppercase tracking-widest opacity-80 leading-relaxed">
            Sistemas de aprendizaje de alto rendimiento diseñados con licencias normales para usuarios individuales.
          </p>
        </div>

        {/* PRICING GRID RIGID SQUARE */}
        {/* PRICING GRID RIGID SQUARE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black bg-white">
          
          {/* FREE */}
          <div className="p-10 border-r border-b md:border-b-0 border-black hover:bg-white transition-colors flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Básico</h3>
                <p className="text-lg font-black text-black uppercase font-serif italic">Free</p>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-3xl font-black text-black">$0</span>
                <span className="text-slate-500 font-bold uppercase text-[8px] tracking-widest">MXN / mes</span>
              </div>
              <ul className="space-y-4 mb-10 border-t border-black/10 pt-6">
                <li className="flex items-start gap-3 text-[10px] font-bold text-gray-700 uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Lecciones A1 (Inglés)</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-bold text-gray-700 uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Vocabulario: 1 lección al día (Inglés)</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-bold text-gray-700 uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Ajedrez: 2 puzzles al día (Inglés)</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-bold text-gray-700 uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Idiomas: Español, Francés, Chino</span>
                </li>
              </ul>
            </div>
            <Link href="/register" className="block w-full py-4 bg-white border border-black text-black text-center font-black rounded-none text-[9px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-colors">
              Iniciar Registro
            </Link>
          </div>
 
          {/* PRO */}
          <div className="p-10 border-r border-b md:border-b-0 border-black bg-white relative flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
            <div>
              <div className="mb-8">
                <h3 className="text-[8px] font-black text-black uppercase tracking-widest mb-1">Estándar</h3>
                <p className="text-lg font-black text-black uppercase font-serif italic">Pro</p>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm text-slate-600 line-through mr-1">$199</span><span className="text-3xl font-black text-black">$129</span>
                <span className="text-slate-500 font-bold uppercase text-[8px] tracking-widest">MXN / mes</span>
              </div>
              <p className="text-[7px] text-slate-500 font-black uppercase mb-8 tracking-[0.2em]">Suscripción con Garantía Onixu</p>
              <ul className="space-y-4 mb-10 border-t border-black/10 pt-6">
                <li className="flex items-start gap-3 text-[10px] font-black text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-[#D4AF37] shrink-0 mt-0.5" /> <span>Acceso ilimitado a 900 lecciones (A1-C1)</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-black text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-[#D4AF37] shrink-0 mt-0.5" /> <span>Sin anuncios publicitarios</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-black text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-[#D4AF37] shrink-0 mt-0.5" /> <span>Vocabulario y ajedrez ilimitados</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-black text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-[#D4AF37] shrink-0 mt-0.5" /> <span>Idiomas: Español, Francés, Chino</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-black text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-[#D4AF37] shrink-0 mt-0.5" /> <span>Sorteos premium por volumen de usuario</span>
                </li>
              </ul>
            </div>
            <Link href="/register?tier=pro" className="block w-full py-4 bg-white text-[#D4AF37] text-center font-black rounded-none text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-none active:scale-95">
              Contratar Plan Pro
            </Link>
          </div>
 
          {/* EXECUTIVE */}
          <div className="p-10 bg-[#D4AF37]/20 transition-colors flex flex-col justify-between relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]"></div>
            <div>
              <div className="mb-8">
                <h3 className="text-[8px] font-black text-black uppercase tracking-widest mb-1">Titanium</h3>
                <p className="text-lg font-black text-black uppercase font-serif italic">Executive</p>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm text-slate-500 line-through mr-1">$399</span><span className="text-3xl font-black text-black">$249</span>
                <span className="text-gray-600 font-bold uppercase text-[8px] tracking-widest">MXN / mes</span>
              </div>
              <p className="text-[7px] text-black font-black uppercase mb-8 tracking-[0.2em]">Acceso Titanium Completo</p>
              <ul className="space-y-4 mb-10 border-t border-black/10 pt-6">
                <li className="flex items-start gap-3 text-[10px] font-bold text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Desbloqueo completo del sistema</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-bold text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Temario Executive de Negocios</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-bold text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Tutoría conversacional interactiva</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-bold text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Idiomas: Español, Francés, Chino</span>
                </li>
                <li className="flex items-start gap-3 text-[10px] font-bold text-black uppercase tracking-tight leading-relaxed">
                  <Check size={14} className="text-black shrink-0 mt-0.5" /> <span>Acceso ilimitado a sorteos premium</span>
                </li>
              </ul>
            </div>
            <Link href="/register?tier=executive" className="block w-full py-4 bg-[#D4AF37] text-black border border-[#D4AF37] text-center font-black rounded-none text-[9px] uppercase tracking-widest hover:bg-[#b5952f] transition-colors">
              Adquirir Executive
            </Link>
          </div>
        </div>

      </main>

      {/* FOOTER SQUARE */}
      <LandingFooter />
    </div>
  );
}
