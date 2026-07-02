'use client';

import { Trophy, Sparkles, Award } from 'lucide-react';
import { woodPanelStyle } from '../styles';
import { CHESS_TROPHIES } from '../chess-trophies';

interface ChessLeaderboardWidgetProps {
  leaderboard: any[];
}

export const ChessLeaderboardWidget = ({ leaderboard }: ChessLeaderboardWidgetProps) => {
  return (
    <div style={woodPanelStyle} className="p-5 rounded-none shadow-xl flex flex-col justify-between relative overflow-hidden group text-[#ecd3b5]">
      <div className="absolute top-0 right-0 p-1 opacity-5"><Trophy size={60} className="text-[#D4AF37]" /></div>
      <div className="relative z-10 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={11} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-200/50">Titanium Arena</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-tight text-white leading-none">Ranking de la Arena</h3>
          <p className="text-[9px] text-slate-300 font-semibold leading-none mt-1.5">Top alumnos con mayor ELO acumulado en la Arena.</p>
        </div>

        <div className="space-y-1.5 pt-2">
          {leaderboard.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-2 text-[10px] font-bold border ${item.isMe ? 'border-[#D4AF37]/30/40 bg-[#361d0f]/50 text-white' : 'border-[#3c1e0a]/50 text-[#ecd3b5]'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 flex items-center justify-center font-mono text-[9px] font-black ${index === 0 ? 'bg-[#D4AF37]/20 text-white' : index === 1 ? 'bg-slate-400 text-slate-900' : 'bg-amber-800 text-white'}`}>
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

interface ChessTrophiesWidgetProps {
  stats: any;
  user: any;
}

export const ChessTrophiesWidget = ({ stats, user }: ChessTrophiesWidgetProps) => {
  return (
    <div style={woodPanelStyle} className="p-5 rounded-none shadow-xl flex flex-col justify-between relative overflow-hidden group text-[#ecd3b5]">
      <div className="absolute top-0 right-0 p-1 opacity-5"><Award size={60} className="text-[#D4AF37]" /></div>
      <div className="relative z-10 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={11} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-200/50">Logros de Combate</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-tight text-white leading-none">Trofeos de Ajedrez</h3>
          <p className="text-[9px] text-slate-300 font-semibold leading-none mt-1.5">Conquista lecciones tácticas y PvP para desbloquear.</p>
        </div>

        <div className="space-y-1.5 pt-1 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #3c1e0a; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #502b16; }
          `}</style>
          {CHESS_TROPHIES.map((badge, idx) => {
            const isUnlocked = badge.condition(stats, user);
            return (
              <div 
                key={idx}
                className={`flex items-center justify-between p-2 border ${isUnlocked ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' : 'border-[#3c1e0a]/50 text-white opacity-60'}`}
              >
                <div className="flex items-center gap-2">
                  <Award size={12} className={isUnlocked ? 'text-emerald-400' : 'text-white opacity-80'} />
                  <div className="text-left">
                    <p className="text-[9px] font-black leading-none">{badge.title}</p>
                    <p className="text-[7px] font-bold text-amber-200/60 mt-0.5 leading-none">{badge.desc}</p>
                  </div>
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest shrink-0 ml-2">
                  {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
