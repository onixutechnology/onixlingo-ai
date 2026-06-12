'use client';

import React from 'react';
import { X, Zap, Flame, Calendar, TrendingUp, Award } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

interface StatsModalProps {
  onClose: () => void;
  userStats: any;
}

export function StatsModal({ onClose, userStats }: StatsModalProps) {
  const { activeLanguage } = useUIStore();
  
  const xpHistory = userStats?.xp_history || [];

  const now = new Date();
  const currentMonth = now.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1; 

  const lastActivityDate = userStats.last_activity_at ? new Date(userStats.last_activity_at) : new Date();
  
  const formatDate = (isoString: string) => {
    if (!isoString) return 'Desconocido';
    return new Date(isoString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-slate-50/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white border border-slate-200 p-6 md:p-8 max-w-4xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 rounded-none overflow-hidden flex flex-col md:flex-row gap-8">
        
        {/* Header Ribbon */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 bg-white hover:bg-white rounded-full p-2 transition-all"
        >
          <X size={18} />
        </button>

        {/* LEFT PANEL: STREAK */}
        <div className="flex-1 border-r border-slate-200 pr-0 md:pr-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#D4AF37]/10 p-3 rounded-full border border-rose-100">
              <Flame size={24} className="text-rose-500" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Historial de Constancia</h3>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Racha Actual: {userStats.streak} Días</p>
            </div>
          </div>

          {/* Calendar Mockup */}
          <div className="bg-white border border-slate-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                <Calendar size={12} /> {currentMonth}
              </span>
              <span className="text-[9px] bg-rose-100 text-rose-700 px-2 py-0.5 font-bold uppercase border border-[#D4AF37]/30">En Racha</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                <div key={d} className="text-center text-[8px] font-black text-slate-500">{d}</div>
              ))}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square border border-transparent" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayDate = new Date(now.getFullYear(), now.getMonth(), i + 1);
                const d1 = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
                const d2 = new Date(lastActivityDate.getFullYear(), lastActivityDate.getMonth(), lastActivityDate.getDate());
                
                const diffTime = d2.getTime() - d1.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                
                const isActive = diffDays >= 0 && diffDays < (userStats.streak || 0);
                const isToday = d1.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                
                return (
                  <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center text-[10px] font-bold border transition-colors ${
                      isToday ? 'bg-[#D4AF37]/100 text-slate-900 border-rose-600 shadow-none ring-2 ring-rose-200' :
                      isActive ? 'bg-rose-100 text-rose-700 border-[#D4AF37]/30' : 
                      'bg-white text-slate-300 border-slate-200'
                    }`}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 border-l-4 border-rose-500 flex items-start gap-3">
            <TrendingUp size={16} className="text-rose-500 mt-0.5" />
            <p className="text-[9px] text-slate-300 font-medium leading-relaxed">
              Mantener una racha activa incrementa tus multiplicadores de XP diarios. Estás en el <strong className="text-slate-900">Top 15%</strong> de usuarios corporativos más consistentes.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: XP HISTORY */}
        <div className="flex-1">
          {userStats.level_details && (
            <div className="bg-slate-50 border border-slate-800 p-5 mb-6 rounded-none relative overflow-hidden shadow-none">
              <div className="absolute -right-6 -top-6 text-slate-900 opacity-50 rotate-12">
                <Award size={100} />
              </div>
              <div className="flex justify-between items-end mb-3 relative z-10">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nivel Actual</h4>
                  <p className="text-3xl font-black text-amber-400 leading-none mt-1">{userStats.level_details.level}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Nivel {userStats.level_details.next_level}</h4>
                  <p className="text-[10px] font-black text-slate-900 mt-1 tracking-wider">Faltan {userStats.level_details.xp_to_next.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="w-full bg-slate-50 h-2 mt-3 relative z-10 border border-slate-700">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full relative" style={{ width: `${userStats.level_details.progress_percent}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 mt-6 md:mt-0">
            <div className="bg-[#D4AF37]/10 p-2.5 rounded-full border border-amber-100">
              <Zap size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Historial de Experiencia</h3>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Total Acumulado: {userStats.xp.toLocaleString()} XP</p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {xpHistory.length === 0 ? (
              <p className="text-xs text-slate-500 font-semibold p-4 text-center border border-dashed border-slate-200">No hay actividad reciente.</p>
            ) : (
              xpHistory.map((log: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-200 p-3 flex items-center justify-between hover:border-amber-300 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-colors">
                      <Zap size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider">{log.module}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{formatDate(log.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#D4AF37]">+{log.amount}</span>
                    <span className="text-[8px] font-bold text-slate-500 ml-1">XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
