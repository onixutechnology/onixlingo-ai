'use client';

import { Trophy, Sparkles, Award, Crown, Flame } from 'lucide-react';
import { VocabTrophy } from '@/lib/vocabTrophies';

interface VocabLeaderboardWidgetProps {
  leaderboard: any[];
}

export const VocabLeaderboardWidget = ({ leaderboard }: VocabLeaderboardWidgetProps) => {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-none shadow-[0_4px_15px_rgba(234,88,12,0.05)] flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-1 opacity-5"><Trophy size={60} className="text-slate-700" /></div>
      <div className="relative z-10 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={11} className="text-slate-700" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-700">Competencia Global</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-tight text-black leading-none">Ranking de Vocabulario</h3>
          <p className="text-[9px] text-black font-semibold leading-none mt-1.5">Top alumnos con mayor número de parejas asociadas.</p>
        </div>

        <div className="space-y-1.5 pt-2">
          {leaderboard.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-2 text-[10px] font-bold border ${item.isMe ? 'border-slate-200 bg-orange-50/20 text-black' : 'border-slate-100 text-black'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 flex items-center justify-center font-mono text-[9px] font-black ${index === 0 ? 'bg-[#D4AF37]/20 text-slate-900' : index === 1 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-slate-900'}`}>
                  {index + 1}
                </span>
                <span>{item.name ? item.name.substring(0, 2).toUpperCase() : '??'}</span>
              </div>
              <span className="font-mono text-[9px] font-black">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface VocabTrophiesWidgetProps {
  trophies: VocabTrophy[];
}

export const VocabTrophiesWidget = ({ trophies }: VocabTrophiesWidgetProps) => {
  const unlockedCount = trophies.filter(t => t.unlocked).length;

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-none shadow-[0_4px_15px_rgba(234,88,12,0.05)] flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-1 opacity-5"><Award size={60} className="text-slate-700" /></div>
      <div className="relative z-10 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={11} className="text-slate-700" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-700">Recompensas Académicas</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-tight text-black leading-none">Trofeos de Vocabulario ({unlockedCount}/100)</h3>
          <p className="text-[9px] text-black font-semibold leading-none mt-1.5">Completa lecciones y mantén tu racha activa.</p>
        </div>

        <div className="space-y-1.5 pt-1 max-h-[175px] overflow-y-auto pr-1 custom-scrollbar">
          {trophies.map((badge, idx) => (
            <div 
              key={idx}
              className={`flex items-center justify-between p-2 border ${badge.unlocked ? 'border-emerald-250 bg-[#D4AF37]/10/20 text-[#D4AF37]' : 'border-slate-100 text-slate-700 opacity-60'}`}
            >
              <div className="flex items-center gap-2">
                {badge.icon === 'Crown' && <Crown size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-slate-700'} />}
                {badge.icon === 'Flame' && <Flame size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-slate-700'} />}
                {badge.icon === 'Award' && <Award size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-slate-700'} />}
                {badge.icon === 'Sparkles' && <Sparkles size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-slate-700'} />}
                
                <div className="text-left">
                  <p className="text-[9px] font-black leading-none">{badge.title}</p>
                  <p className="text-[7px] font-bold text-slate-700 mt-0.5 leading-none">{badge.desc}</p>
                </div>
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest shrink-0 ml-1">
                {badge.unlocked ? '✓' : '🔒'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
