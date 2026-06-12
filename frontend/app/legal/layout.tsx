'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, FileText, ShieldCheck, CreditCard, Mail } from 'lucide-react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getActiveStyle = (path: string) => {
    return pathname === path
      ? 'bg-[#D4AF37]/20 text-[#D4AF37] shadow-none border border-[#D4AF37]/30'
      : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#D4AF37]/30 selection:text-slate-900">
      
      {/* HEADER SIMPLE */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-none hover:bg-[#D4AF37]/20 text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-black tracking-tight text-slate-900 font-serif italic">
            OnixLingo <span className="text-[#D4AF37]">Legal</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR DE NAVEGACIÓN */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-2">
            <Link 
              href="/legal/terms"
              className={`flex items-center gap-3 px-4 py-3 rounded-none font-bold text-[10px] uppercase tracking-widest transition-all ${getActiveStyle('/legal/terms')}`}
            >
              <FileText size={18} /> Términos y Condiciones
            </Link>
            <Link 
              href="/legal/privacy"
              className={`flex items-center gap-3 px-4 py-3 rounded-none font-bold text-[10px] uppercase tracking-widest transition-all ${getActiveStyle('/legal/privacy')}`}
            >
              <ShieldCheck size={18} /> Política de Privacidad
            </Link>
            <Link 
              href="/legal/refunds"
              className={`flex items-center gap-3 px-4 py-3 rounded-none font-bold text-[10px] uppercase tracking-widest transition-all ${getActiveStyle('/legal/refunds')}`}
            >
              <CreditCard size={18} /> Política de Reembolsos
            </Link>
            <Link 
              href="/legal/support"
              className={`flex items-center gap-3 px-4 py-3 rounded-none font-bold text-[10px] uppercase tracking-widest transition-all ${getActiveStyle('/legal/support')}`}
            >
              <Mail size={18} /> Soporte y Contacto
            </Link>
          </div>
        </div>

        {/* CONTENIDO LEGAL */}
        <div className="flex-1 bg-white p-8 md:p-12 rounded-none border border-slate-200 shadow-none">
          {children}
        </div>
      </div>
    </div>
  );
}
