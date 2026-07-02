'use client';

import React from 'react';
import { Trophy, Sparkles, Award } from 'lucide-react';

interface KPIStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  fluencyScore: number;
  totalTickets: number;
  streakDays: number;
  completedModules: number;
}

export const ProStatsWidgets = ({ leaderboard, kpis }: { leaderboard: any[], kpis: KPIStats }) => {
  return (
    <>
      {/* Columna 2: Ranking Executive */}
      <div className="bg-white/40 border border-teal-800/15 p-5 rounded-none backdrop-blur-sm shadow-none flex flex-col justify-between relative overflow-hidden group text-slate-900">
        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
          <Trophy size={60} className="text-teal-800" />
        </div>
        <div className="relative z-10 space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={11} className="text-teal-800" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-teal-800/60">Alta Dirección Performance</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none">Ranking Executive</h3>
            <p className="text-[9px] text-slate-600 font-semibold leading-none mt-1.5">Top ejecutivos con mayor puntuación acumulada.</p>
          </div>

          <div className="space-y-1.5 pt-2">
            {leaderboard.map((item, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-2 text-[10px] font-bold border ${item.isMe ? 'border-teal-500/40 bg-teal-50/20 text-teal-900' : 'border-teal-800/10 text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 flex items-center justify-center font-mono text-[9px] font-black ${index === 0 ? 'bg-[#D4AF37]/20 text-slate-900' : index === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-slate-900'}`}>
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

      {/* Columna 3: Trofeos de Liderazgo */}
      <div className="bg-white/40 border border-teal-800/15 p-5 rounded-none backdrop-blur-sm shadow-none flex flex-col justify-between relative overflow-hidden group text-slate-900">
        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
          <Award size={60} className="text-teal-800" />
        </div>
        <div className="relative z-10 space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={11} className="text-teal-800" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-teal-800/60">Milestones C-Level</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none">Trofeos de Liderazgo</h3>
            <p className="text-[9px] text-slate-600 font-semibold leading-none mt-1.5">Completa desafíos ejecutivos para ganar insignias.</p>
          </div>

          <div className="space-y-1.5 pt-1">
            {[
              { title: 'Orador Alta Dirección', desc: 'Precisión de pronunciación >= 80%', unlocked: kpis.accuracy >= 80 },
              { title: 'Líder Global', desc: 'Acumula más de 1,000 XP en tu carrera', unlocked: kpis.totalXP >= 1000 },
              { title: 'Negociador de Élite', desc: 'Completa al menos 1 módulo premium', unlocked: kpis.completedModules >= 1 }
            ].map((badge, idx) => (
              <div 
                key={idx}
                className={`flex items-center justify-between p-2 border ${badge.unlocked ? 'border-emerald-500/30 bg-[#D4AF37]/10/20 text-[#D4AF37]' : 'border-teal-800/10 text-slate-500 opacity-60'}`}
              >
                <div className="flex items-center gap-2">
                  <Award size={12} className={badge.unlocked ? 'text-[#D4AF37]' : 'text-slate-500'} />
                  <div className="text-left">
                    <p className="text-[9px] font-black leading-none">{badge.title}</p>
                    <p className="text-[7px] font-bold text-slate-600 mt-0.5 leading-none">{badge.desc}</p>
                  </div>
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest">
                  {badge.unlocked ? 'Desbloqueado' : 'Bloqueado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
