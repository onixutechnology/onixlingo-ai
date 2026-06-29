"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó las cookies
    const cookieConsent = localStorage.getItem('onixlingo_cookie_consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('onixlingo_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('onixlingo_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 md:p-6 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-black uppercase tracking-widest text-sm">Política de Cookies</span>
          </div>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
            Utilizamos cookies propias y de terceros, incluyendo Google AdSense, para analizar el tráfico, personalizar contenido y mostrar anuncios relevantes. Al hacer clic en "Aceptar", consientes el uso de todas las cookies. Consulta nuestra{' '}
            <Link href="/legal/cookies" className="text-[#D4AF37] hover:underline font-bold">
              Política de Cookies
            </Link>{' '}
            para más información.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={declineCookies}
            className="flex-1 md:flex-none border border-gray-300 bg-white text-gray-700 text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Rechazar
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none bg-[#D4AF37] border border-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest px-6 py-2 hover:bg-[#b5952f] transition-colors shadow-lg shadow-[#D4AF37]/20"
          >
            Aceptar Todas
          </button>
          <button 
            onClick={declineCookies}
            className="text-gray-400 hover:text-black transition-colors hidden md:block ml-2"
          >
            <X size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
