'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Activity, Lock, Crown, Mic, Ticket } from 'lucide-react';

interface KPIStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  fluencyScore: number;
  totalTickets: number;
  streakDays: number;
  completedModules: number;
}

interface ProHeaderStatsProps {
  kpis: KPIStats;
  getLevelProgress: (xp: number) => number;
  setShowCommandCenter: (show: boolean) => void;
  setShowSpeechCalibrate: (show: boolean) => void;
  setShowRaffleModal: (show: boolean) => void;
}

export const ProHeaderStats = ({
  kpis,
  getLevelProgress,
  setShowCommandCenter,
  setShowSpeechCalibrate,
  setShowRaffleModal
}: ProHeaderStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 relative z-10">

      {/* 1. COMMAND STATUS */}
      <div 
        onClick={() => setShowCommandCenter(true)}
        className="group relative border border-slate-800/15 bg-white/40 p-6 hover:border-[#D4AF37]/50 hover:bg-white/60 transition-all cursor-pointer overflow-hidden backdrop-blur-sm shadow-none"
      >
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
          <Crown size={80} className="text-[#D4AF37]" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-none text-[#D4AF37] shadow-none">
                <Trophy size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Command Status</h4>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600">
                  <span className="text-slate-900 flex items-center gap-0.5">🔥 {kpis.streakDays} days streak</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-2.5 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-slate-900 text-[8px] font-black uppercase rounded-full tracking-widest shadow-none">
                LVL {kpis.currentLevel}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-black tracking-tighter text-slate-900 leading-none">{kpis.totalXP.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">XP</span>
            </div>
            <p className="text-[9px] font-bold text-slate-600 tracking-wider uppercase">
              {kpis.completedModules} módulos • {kpis.accuracy}% accuracy
            </p>
          </div>
          <div>
            <div className="flex justify-between text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1.5">
              <span>Level {kpis.currentLevel}</span>
              <span>{getLevelProgress(kpis.totalXP)}% to next</span>
            </div>
            <div className="w-full h-1 bg-slate-200 rounded-none overflow-hidden mb-4">
              <div 
                className="h-full bg-[#D4AF37] transition-all duration-1000" 
                style={{ width: `${getLevelProgress(kpis.totalXP)}%` }}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/10 flex items-center justify-between text-[9px] font-black text-slate-900 uppercase tracking-widest">
            <span>Ver Analytics Completo</span>
            <span className="text-slate-900 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>

      {/* 2. SPEECH CALIBRATION LAB */}
      <div 
        onClick={() => setShowSpeechCalibrate(true)}
        className="group relative overflow-hidden rounded-none border border-slate-800/15 bg-white/40 p-6 cursor-pointer hover:border-slate-900/40 hover:bg-white/60 transition-all backdrop-blur-md shadow-none"
      >
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
          <Activity size={100} className="text-slate-900" />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-slate-900/10 border border-slate-900/20 rounded-none text-slate-900 shadow-none">
                  <Mic size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Speech Calibration</h4>
                  <p className="text-[9px] font-bold text-slate-600 tracking-wider">Phonetic Analytics Lab</p>
                </div>
              </div>
              <div className="px-2 py-0.5 border border-slate-900/30 text-slate-900 text-[8px] font-black uppercase tracking-widest rounded-full">
                {kpis.accuracy >= 88 ? 'C1' : kpis.accuracy >= 78 ? 'B2' : 'B1'}
              </div>
            </div>
            <div className="mb-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpis.accuracy}%</span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Accuracy</span>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1">
                  <span>Pronunciation</span>
                  <span>{kpis.accuracy}%</span>
                </div>
                <div className="w-full h-1 bg-slate-200 overflow-hidden">
                  <div className="h-full bg-slate-900 transition-all" style={{ width: `${kpis.accuracy}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1">
                  <span>Fluency</span>
                  <span>{kpis.fluencyScore}%</span>
                </div>
                <div className="w-full h-1 bg-slate-200 overflow-hidden">
                  <div className="h-full bg-slate-700 transition-all" style={{ width: `${kpis.fluencyScore}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/10 flex items-center justify-between text-[9px] font-black text-slate-900 uppercase tracking-widest">
            <span>Calibration Lab</span>
            <span className="text-slate-900 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>

      {/* 3. VIP RAFFLE */}
      <div 
        className="group relative overflow-hidden rounded-none border border-slate-200 bg-white/40 p-6 backdrop-blur-md shadow-none opacity-80 cursor-default"
      >
        <div className="absolute top-0 right-0 p-1 opacity-5">
          <Ticket size={120} className="text-slate-400" />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between grayscale-[50%]">
          <div className="flex justify-between items-start mb-6">
            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-600 text-[8px] font-black uppercase rounded-full tracking-widest">
              Próximamente
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-none text-slate-500 shadow-none">
              <Ticket size={16} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">VIP Raffle</h4>
              <p className="text-[9px] font-bold text-slate-600 tracking-wider">Sorteos de Mentorías</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">Mentorías & Premios</h3>
            <p className="text-[9px] font-medium text-slate-600 leading-relaxed max-w-[200px]">
              Obtén boletos completando lecciones ejecutivas. Sorteos mensuales de iPads y sesiones 1-on-1.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[9px] font-extrabold text-slate-600 uppercase tracking-widest">
            <span>Sorteos y Privilegios</span>
            <Lock size={11} className="text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
