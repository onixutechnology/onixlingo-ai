'use client';

import { useEffect } from 'react';
import { Crown, Zap, Flame, ShieldCheck } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1;
  if (xp < 500) return 2;
  if (xp < 1000) return 3;
  return 4 + Math.floor((xp - 1000) / 2000);
};

interface HeaderStatsProps {
  xp: number;
  streak: number;
  onOpenStats: () => void;
}

export const HeaderStats = ({ xp, streak, onOpenStats }: HeaderStatsProps) => {
  const { energy, userTier, checkAndResetDailyLimits } = useUIStore();

  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

  const level = calculateLevel(xp);

  const getEnergyColor = (pct: number) => {
    if (pct > 50) return 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (pct > 20) return 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]';
  };

  return (
    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-none border border-sky-200 shadow-none">
      <button onClick={onOpenStats} className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 border-r border-sky-100 hover:bg-sky-50 transition-colors text-left outline-none cursor-pointer">
        <div className="text-purple-650"><Crown size={14} className="fill-purple-100" /></div>
        <div className="hidden md:block">
          <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">Nivel</p>
          <span className="text-xs font-black text-sky-950 leading-none">{level}</span>
        </div>
        <div className="md:hidden text-xs font-black text-sky-950 leading-none">{level}</div>
      </button>
      <button onClick={onOpenStats} className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 border-r border-sky-100 hover:bg-sky-50 transition-colors text-left outline-none cursor-pointer">
        <div className="text-[#D4AF37]"><Zap size={14} fill="currentColor" /></div>
        <div className="hidden md:block">
          <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">XP</p>
          <span className="text-xs font-black text-sky-950 leading-none">{xp.toLocaleString()}</span>
        </div>
        <div className="md:hidden text-xs font-black text-sky-950 leading-none">{xp >= 1000 ? (xp/1000).toFixed(1)+'k' : xp}</div>
      </button>
      <button onClick={onOpenStats} className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 border-r border-sky-100 hover:bg-sky-50 transition-colors text-left outline-none cursor-pointer">
        <div className="text-orange-500"><Flame size={14} fill="currentColor" /></div>
        <div className="hidden md:block">
          <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">Racha</p>
          <span className="text-xs font-black text-sky-950 leading-none">{streak}</span>
        </div>
        <div className="md:hidden text-xs font-black text-sky-950 leading-none">{streak}</div>
      </button>

      {/* ENERGÍA INDICATOR */}
      <div className="flex items-center gap-2 px-1 md:px-3">
        {userTier === 'free' ? (
          <div className="flex items-center gap-2">
            <div className="text-[#D4AF37] drop-shadow-[0_0_4px_rgba(245,158,11,0.4)] animate-pulse shrink-0">
              <Zap size={13} fill="currentColor" />
            </div>

            <div className="flex items-center">
              <div className="relative w-14 md:w-20 h-5 bg-sky-950 rounded-[4px] border border-sky-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                <div
                  className={`h-full rounded-[2px] ${getEnergyColor(energy)} transition-all duration-500`}
                  style={{ width: `${energy}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-900 font-mono leading-none tracking-wider drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)]">
                  {energy}%
                </span>
              </div>
              <div className="w-[3px] h-2.5 bg-sky-700 rounded-r-[2px] -ml-[1px] shadow-[0_10px_40px_rgba(14,165,233,0.08)] shrink-0" />
            </div>

            <div className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none hidden md:block">
              Energía
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[#D4AF37]">
            <ShieldCheck size={12} className="fill-emerald-50 text-[#D4AF37] shrink-0" />
            <div className="text-left hidden md:block">
              <p className="text-[8px] text-sky-600 font-black uppercase tracking-widest leading-none mb-0.5">Energía</p>
              <span className="text-[9px] font-black uppercase tracking-wider">Ilimitada</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
