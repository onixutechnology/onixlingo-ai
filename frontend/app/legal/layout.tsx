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
      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
      : 'text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER SIMPLE */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-black tracking-tight text-slate-800">
            OnixLingo <span className="text-indigo-600">Legal</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR DE NAVEGACIÓN */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-2">
            <Link 
              href="/legal/terms"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${getActiveStyle('/legal/terms')}`}
            >
              <FileText size={18} /> Términos y Condiciones
            </Link>
            <Link 
              href="/legal/privacy"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${getActiveStyle('/legal/privacy')}`}
            >
              <ShieldCheck size={18} /> Política de Privacidad
            </Link>
            <Link 
              href="/legal/refunds"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${getActiveStyle('/legal/refunds')}`}
            >
              <CreditCard size={18} /> Política de Reembolsos
            </Link>
            <Link 
              href="/legal/support"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${getActiveStyle('/legal/support')}`}
            >
              <Mail size={18} /> Soporte y Contacto
            </Link>
          </div>
        </div>

        {/* CONTENIDO LEGAL */}
        <div className="flex-1 bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
