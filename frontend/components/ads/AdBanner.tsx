'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ShoppingBag, BookOpen } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

// ⚙️ CONFIGURACIÓN DE TUS ANUNCIOS
const AD_CONFIG = {
  
  // 📘 ANUNCIO 1: Sidebar (Tu enlace del libro)
  sidebar: {
    title: "English Grammar in Use",
    desc: "La biblia de la gramática. El libro #1 para pasar de B1 a B2.",
    button: "Ver precio en Amazon",
    // 👇 ¡AQUÍ ESTÁ TU ENLACE REAL!
    link: "https://amzn.to/4jxtsLh", 
    bgColor: "bg-blue-100",
    iconColor: "text-[#D4AF37]",
    icon: BookOpen
  },

  // 🎧 ANUNCIO 2: Horizontal (Puedes cambiar este link luego por unos audífonos)
  horizontal: {
    title: "Mejora tu Listening",
    desc: "Auriculares con cancelación de ruido recomendados para estudiar.",
    button: "Ver Oferta",
    link: "https://amazon.com", // 🟡 Pendiente: Busca unos audífonos y pon el link aquí
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: ShoppingBag
  }
};

export const AdBanner = ({ variant = 'horizontal', slot, style }: { variant?: 'horizontal' | 'sidebar', slot?: string, style?: React.CSSProperties }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const { userTier } = useUIStore();

  useEffect(() => {
    // Mostrar anuncios únicamente a usuarios del plan Free
    if (userTier === 'free') {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [userTier]);

  // --- MODO ADSENSE MOCK (Cuando se pasa slot y style, como en los laterales) ---
  if (slot && style) {
    return (
      <div 
        style={style} 
        className={`bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-4 rounded-none transition-opacity ${!shouldShow ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
      >
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          Espacio AdSense
        </span>
        <span className="text-[8px] font-bold text-slate-400 font-mono bg-white px-2 py-1 border border-slate-200">
          Slot: {slot}
        </span>
        {!shouldShow && (
          <span className="text-[8px] font-bold text-rose-500 mt-2 uppercase tracking-widest text-center">
            (Oculto para usuarios PRO)
          </span>
        )}
      </div>
    );
  }

  if (!shouldShow) return null;

  // --- DISEÑO SIDEBAR (Vertical) ---
  if (variant === 'sidebar') {
    const ad = AD_CONFIG.sidebar;
    return (
      <div className="mt-8 mx-4 p-5 rounded-none border border-slate-200 bg-white shadow-none relative overflow-hidden group hover:shadow-none transition-shadow">
        <div className="absolute top-0 right-0 bg-amber-400 px-2 py-1 rounded-bl-xl text-[9px] font-black text-slate-900 uppercase tracking-wider">Top Ventas</div>
        
        <div className="flex flex-col items-center text-center relative z-10">
            <div className={`w-16 h-16 ${ad.bgColor} rounded-none flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform`}>
                <ad.icon className={ad.iconColor} size={32} />
            </div>
            <h4 className="text-sm font-black text-slate-900 leading-tight mb-2 px-2">{ad.title}</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">{ad.desc}</p>
            
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="text-xs font-bold bg-[#FF9900] hover:bg-[#ffad33] text-black py-3 rounded-none w-full transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag size={14} /> {ad.button}
                </button>
            </a>
        </div>
      </div>
    );
  }

  // --- DISEÑO HORIZONTAL (Largo) ---
  const ad = AD_CONFIG.horizontal;
  return (
    <div className="my-10 w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="bg-white border border-slate-200 rounded-none p-1 flex items-center justify-between shadow-none relative overflow-hidden pr-2 sm:pr-6 hover:border-[#D4AF37]/30 transition-colors">
        
        <span className="absolute top-0 left-0 bg-white text-slate-500 text-[9px] font-bold px-2 py-1 rounded-br-lg uppercase tracking-widest z-10">
            Recomendado
        </span>

        <div className="flex items-center gap-4 sm:gap-6 p-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 ${ad.bgColor} rounded-none flex items-center justify-center shrink-0`}>
                <ad.icon className={ad.iconColor} size={28} />
            </div>
            <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-lg">{ad.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md">{ad.desc}</p>
            </div>
        </div>
        
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <button className="bg-slate-50 hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-none transition-colors shadow-none shadow-slate-900/10">
                {ad.button}
            </button>
        </a>
      </div>
      
      <div className="text-center mt-3">
        <a href="/dashboard/pro" className="text-[10px] text-slate-500 hover:text-[#D4AF37] font-medium underline transition-colors cursor-pointer">
            Eliminar anuncios con Titanium Pro
        </a>
      </div>
    </div>
  );
};