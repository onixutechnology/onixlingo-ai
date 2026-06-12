"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <nav 
          className="w-full md:w-[95%] lg:w-[90%] bg-gradient-to-r from-slate-50 via-[#D4AF37] to-slate-50 shadow-2xl transition-all"
          style={{ clipPath: "polygon(0 0, 100% 0, 97% 100%, 3% 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 shrink-0 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-white rounded-none flex items-center justify-center text-black font-bold shadow-none shadow-white/20">
                <span className="mt-0.5">O</span>
              </div>
              <span className="font-bold text-slate-900 tracking-[0.2em] text-xl uppercase whitespace-nowrap">OnixLingo</span>
            </Link>
            
            <div className="hidden lg:flex gap-4 xl:gap-8 items-center text-xs xl:text-sm font-bold text-slate-900/90 uppercase tracking-[0.2em] whitespace-nowrap">
              <Link href="/caracteristicas" className="hover:text-slate-900 transition-colors">Características</Link>
              <Link href="/vocabulario" className="hover:text-slate-900 transition-colors">Vocabulario</Link>
              <Link href="/programa-ejecutivo" className="hover:text-slate-900 transition-colors">Ejecutivo</Link>
              <Link href="/planes" className="hover:text-slate-900 transition-colors">Planes</Link>
            </div>

            <div className="flex gap-4 xl:gap-5 items-center shrink-0">
              <Link href="/login" className="hidden lg:block text-xs xl:text-sm font-bold text-slate-900 hover:text-gray-200 uppercase tracking-[0.2em] whitespace-nowrap transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="hidden sm:block">
                <button className="bg-white hover:bg-white text-black border border-white text-xs xl:text-sm font-bold py-2 xl:py-2.5 px-4 xl:px-6 rounded-none transition-all shadow-none hover:shadow-none hover:scale-105 active:scale-95 uppercase tracking-[0.2em] whitespace-nowrap">
                  Crear Cuenta
                </button>
              </Link>
              {/* Botón menú móvil */}
              <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Menú Móvil Desplegable */}
        {isMenuOpen && (
          <div className="w-full absolute top-[80px] lg:hidden bg-white border-b border-gray-200 shadow-none px-6 py-4 flex flex-col gap-4 text-xs font-bold text-gray-800 uppercase tracking-[0.2em]">
            <Link href="/caracteristicas" className="hover:text-[#D4AF37] transition-colors" onClick={() => setIsMenuOpen(false)}>Características</Link>
            <Link href="/vocabulario" className="hover:text-[#D4AF37] transition-colors" onClick={() => setIsMenuOpen(false)}>Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="hover:text-[#D4AF37] transition-colors" onClick={() => setIsMenuOpen(false)}>Ejecutivo</Link>
            <Link href="/planes" className="hover:text-[#D4AF37] transition-colors" onClick={() => setIsMenuOpen(false)}>Planes</Link>
            <div className="h-px bg-gray-200 my-2"></div>
            <Link href="/login" className="hover:text-[#D4AF37] transition-colors" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
          </div>
        )}
      </div>
    </>
  );
}
