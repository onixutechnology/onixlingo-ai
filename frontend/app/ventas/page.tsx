'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Check } from 'lucide-react';

export default function VentasPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-teal-100 selection:text-teal-900">
      
      {/* NAVBAR SQUARE */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between shadow-none">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-teal-600 flex items-center justify-center">
            <span className="text-white font-black text-[9px]">O</span>
          </div>
          <span className="font-black text-slate-900 text-[10px] tracking-tighter uppercase">OnixLingo AI</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[9px] font-black text-slate-500 hover:text-teal-600 transition-colors uppercase tracking-widest">Ingresar</Link>
          <Link href="/register">
             <button className="bg-teal-600 text-white px-6 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all active:scale-95">
                Crear Cuenta
             </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* HERO SQUARE */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white text-teal-700 px-4 py-1.5 border border-slate-200 mb-6">
            <ShieldCheck size={12} />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Catálogo de Licencias Corporativas</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase leading-none font-serif italic">
            Inversión en <span className="text-teal-600">Capital Humano.</span>
          </h1>
          <p className="text-[10px] text-slate-500 max-w-xl mx-auto font-bold uppercase tracking-widest opacity-80 leading-relaxed">
            Sistemas de aprendizaje de alto rendimiento diseñados para entornos de máxima exigencia técnica y ejecutiva.
          </p>
        </div>

        {/* PRICING GRID RIGID SQUARE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 bg-white">
          
          {/* FREE */}
          <div className="p-10 border-r border-b md:border-b-0 border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="mb-8">
              <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan Base</h3>
              <p className="text-lg font-black text-slate-900 uppercase font-serif italic">Standard</p>
            </div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-3xl font-black text-slate-900">$0</span>
              <span className="text-slate-400 font-bold uppercase text-[8px] tracking-widest">MXN / Acceso Base</span>
            </div>
            <ul className="space-y-4 mb-10 border-t border-slate-100 pt-6">
              {['30 Módulos de estudio', 'Motor de IA Básico', 'Reportes de Avance'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  <Check size={14} className="text-teal-500" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full py-4 bg-slate-100 border border-slate-200 text-slate-900 text-center font-black rounded-none text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-colors">
              Iniciar Registro
            </Link>
          </div>

          {/* PRO */}
          <div className="p-10 border-r border-b md:border-b-0 border-slate-200 bg-slate-50 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-600"></div>
            <div className="mb-8">
              <h3 className="text-[8px] font-black text-teal-600 uppercase tracking-widest mb-1">Alto Rendimiento</h3>
              <p className="text-lg font-black text-slate-900 uppercase font-serif italic">OnixLingo Pro</p>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-slate-900">$49</span>
              <span className="text-slate-400 font-bold uppercase text-[8px] tracking-widest">MXN / Mensual</span>
            </div>
            <p className="text-[7px] text-emerald-600 font-black uppercase mb-8 tracking-[0.2em]">Suscripción con Garantía Onixu</p>
            <ul className="space-y-4 mb-10 border-t border-slate-200 pt-6">
              {['Lecciones de Negocio', 'Análisis Fonético', 'IA Pro Sin Límites', 'Soporte Directo'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[10px] font-black text-slate-800 uppercase tracking-tight">
                  <Check size={14} className="text-teal-600" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/register?tier=pro" className="block w-full py-4 bg-teal-600 text-white text-center font-black rounded-none text-[9px] uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95">
              Contratar Plan Pro
            </Link>
          </div>

          {/* CORPORATE */}
          <div className="p-10 hover:bg-slate-50 transition-colors">
            <div className="mb-8">
              <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Soluciones B2B</h3>
              <p className="text-lg font-black text-slate-900 uppercase font-serif italic">Enterprise</p>
            </div>
            <div className="flex items-baseline gap-1 mb-8 text-slate-900">
              <span className="text-xl font-black uppercase tracking-widest font-serif italic">A Medida</span>
            </div>
            <ul className="space-y-4 mb-10 border-t border-slate-100 pt-6">
              {['Dashboard Corporativo', 'Volumen de Usuarios', 'Consultoría Técnica', 'Acuerdos de SLA'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <Check size={14} className="text-slate-300" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-slate-900 text-white text-center font-black rounded-none text-[9px] uppercase tracking-widest hover:bg-black transition-colors">
              Contactar Ventas
            </button>
          </div>

        </div>

      </main>

      {/* FOOTER SQUARE */}
      <footer className="bg-white border-t border-slate-200 py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.4em]">© 2026 ONIXLINGO ACADEMY. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex gap-10">
            <Link href="/" className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors">Inicio</Link>
            <Link href="/login" className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors">Ingresar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
