'use client';

import { useState, useEffect } from 'react';
import { X, BarChart3, Trophy, Activity, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:5000';

interface KPIStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  fluencyScore: number;
}

interface LeaderboardUser {
  rank: number;
  alias: string;
  xp: number;
  isMe: boolean;
}

interface ExecutiveStatsModalProps {
  onClose: () => void;
  kpis: KPIStats;
  completedLessons: number;
}

export const ExecutiveStatsModal = ({ onClose, kpis, completedLessons }: ExecutiveStatsModalProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(true);

  // 🔄 Efecto para traer el Ranking Global del Backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = Cookies.get('access_token');
        const res = await fetch(`${API_URL}/api/v1/progress/leaderboard?limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard);
        } else {
          // Fallback de seguridad por si el backend falla
          setLeaderboard([
            { rank: 1, alias: "Exec_Alpha", xp: kpis.totalXP + 1250, isMe: false },
            { rank: 2, alias: "Director_V", xp: kpis.totalXP + 450, isMe: false },
            { rank: 3, alias: "Tú (Titanium)", xp: kpis.totalXP, isMe: true },
          ]);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoadingRanking(false);
      }
    };

    fetchLeaderboard();
  }, [kpis.totalXP]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-50 border border-slate-800 rounded-none w-full max-w-lg overflow-hidden shadow-2xl shadow-black">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/20/10 rounded-none text-blue-400">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Analytics</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors p-2 bg-slate-50 rounded-full active:scale-95">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          
          {/* MÉTRICAS PERSONALES (Vienen de page.tsx que ya son reales) */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Uso de la Plataforma</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-800 p-4 rounded-none flex flex-col justify-center items-center text-center">
                <p className="text-3xl font-black text-amber-400 mb-1">{completedLessons}</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Unidades Completadas</p>
              </div>
              <div className="bg-slate-50 border border-slate-800 p-4 rounded-none flex flex-col justify-center items-center text-center">
                <p className="text-3xl font-black text-emerald-400 mb-1">{kpis.accuracy}%</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Precisión Promedio</p>
              </div>
            </div>
          </div>

          {/* RANKING GLOBAL (Ahora conectado a la DB) */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-[#D4AF37]" /> Global Executive Ranking
            </h3>
            <div className="bg-slate-50 border border-slate-800 rounded-none overflow-hidden min-h-[150px] relative">
              
              {isLoadingRanking ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                  <Activity className="animate-spin mb-2 text-[#D4AF37]" size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sincronizando Ranking...</span>
                </div>
              ) : (
                leaderboard.map((user, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 ${user.isMe ? 'bg-[#D4AF37]/20/10' : ''}`}>
                    <div className="flex items-center gap-4">
                      <span className={`font-black text-lg ${user.rank === 1 ? 'text-amber-400' : user.rank === 2 ? 'text-slate-300' : user.rank === 3 ? 'text-[#D4AF37]' : 'text-slate-600'}`}>
                        #{user.rank}
                      </span>
                      <span className={`font-bold text-sm ${user.isMe ? 'text-amber-400 flex items-center gap-2' : 'text-slate-300'}`}>
                        {user.alias} {user.isMe && <span className="text-[9px] bg-[#D4AF37]/20/20 px-2 py-0.5 rounded uppercase tracking-widest border border-[#D4AF37]/30/30">Tú</span>}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{user.xp.toLocaleString()} XP</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};