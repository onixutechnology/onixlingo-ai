import React from 'react';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-white py-12 px-6 text-sm text-gray-600 border-t border-gray-200 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-black text-lg uppercase tracking-widest">OnixLingo</span>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Ecosistema Educativo Global</p>
        </div>
        <div className="flex gap-6 font-bold uppercase tracking-widest text-xs flex-wrap justify-center">
          <Link href="/planes" className="hover:text-[#D4AF37] transition-colors">Planes</Link>
          <Link href="/legal/privacy" className="hover:text-[#D4AF37] transition-colors">Privacidad</Link>
          <Link href="/legal/terms" className="hover:text-[#D4AF37] transition-colors">Términos</Link>
          <Link href="/legal/cookies" className="hover:text-[#D4AF37] transition-colors">Cookies</Link>
          <Link href="/legal/support" className="hover:text-[#D4AF37] transition-colors">Soporte</Link>
        </div>
        <div className="text-center md:text-right text-xs space-y-1">
          <p className="font-bold tracking-widest">© 2026 ONIXU TECHNOLOGY.</p>
        </div>
      </div>
    </footer>
  );
}
