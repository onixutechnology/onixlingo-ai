'use client';

import { motion } from 'framer-motion';
import { Zap, Gift, Headphones, Tablet, Smartphone, Laptop } from 'lucide-react';
import Link from 'next/link';

interface GiveawayWidgetProps {
  premiumCount: number;
}

export const GiveawayWidget = ({ premiumCount }: GiveawayWidgetProps) => {
  const prizes = [
    { limit: 100, text: '100', prize: 'Gift Card de $500', icon: 'Gift' },
    { limit: 300, text: '300', prize: 'AirPods 4', icon: 'Headphones' },
    { limit: 500, text: '500', prize: 'iPad Mini a elegir', icon: 'Tablet' },
    { limit: 700, text: '700', prize: 'Galaxy S25', icon: 'Smartphone' },
    { limit: 900, text: '900', prize: 'iPhone', icon: 'Smartphone' },
    { limit: 1500, text: '1.5k', prize: 'MacBook', icon: 'Laptop' }
  ];

  const renderIcon = (iconName: string, activeClass: string, inactiveClass: string) => {
    switch (iconName) {
      case 'Gift': return <Gift size={10} className={activeClass || inactiveClass} />;
      case 'Headphones': return <Headphones size={10} className={activeClass || inactiveClass} />;
      case 'Tablet': return <Tablet size={10} className={activeClass || inactiveClass} />;
      case 'Smartphone': return <Smartphone size={10} className={activeClass || inactiveClass} />;
      case 'Laptop': return <Laptop size={10} className={activeClass || inactiveClass} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white border border-sky-200 p-5 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group animate-fade-in-up opacity-0 [animation-delay:200ms]">
      <div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-900 mb-2">
          <span className="flex items-center gap-1.5"><Zap size={12} className="text-[#D4AF37] animate-pulse" /> Sorteos por Suscriptores Premium</span>
          <span className="text-[#D4AF37] font-black text-xs">{premiumCount.toLocaleString()} / 1500 Premium</span>
        </div>
        <div className="h-2 bg-sky-100 rounded-none overflow-hidden border border-sky-200 mb-3 relative">
          <motion.div
            className="h-full bg-[#D4AF37]/20"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((premiumCount / 1500) * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-2.5">
        {prizes.map((item, idx) => {
          const limits = prizes.map(p => p.limit);
          const unlocked = premiumCount >= item.limit;
          const active = premiumCount < item.limit && (idx === 0 || premiumCount >= limits[idx - 1]);

          return (
            <div
              key={idx}
              className={`border p-2 text-center rounded-none relative transition-all duration-200 select-none group/item hover:scale-105
                ${unlocked
                  ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10/30 text-[#D4AF37]'
                  : active
                    ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10/20 text-[#D4AF37] animate-pulse'
                    : 'border-sky-100 bg-sky-50/50 text-sky-500'
                }
              `}
            >
              <div className="text-[9px] font-black leading-none mb-1">{item.text}</div>
              <div className="flex justify-center text-[12px] mb-1">
                {renderIcon(item.icon, unlocked || active ? "text-[#D4AF37]" : "", !unlocked && !active ? "text-sky-500" : "")}
              </div>
              <div className="absolute inset-0 bg-sky-500/95 text-white p-1 text-[7px] font-black uppercase flex flex-col justify-center items-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 rounded-none z-30">
                <span className="text-center">{item.prize}</span>
                <span className="text-[5px] text-amber-300 mt-0.5 uppercase tracking-widest font-black">
                  {unlocked ? '¡Sorteado!' : active ? 'Siguiente' : 'Bloqueado'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
          <span className="text-[8px] font-black text-sky-600 uppercase tracking-widest leading-none">Estatus de Sorteo</span>
          <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest leading-none">
            {(() => {
              const limits = prizes.map(p => p.limit);
              const nextLimit = limits.find(lim => premiumCount < lim) || 1500;
              return premiumCount >= 1500
                ? '¡Todas las metas alcanzadas! 🏆'
                : `Próxima meta: ${nextLimit} (Faltan ${nextLimit - premiumCount})`;
            })()}
          </span>
        </div>
        <Link href="/legal/terms" className="text-[8px] font-black text-[#D4AF37] hover:text-teal-700 uppercase tracking-widest leading-none underline text-right">
          Términos y Condiciones
        </Link>
      </div>
    </div>
  );
};
