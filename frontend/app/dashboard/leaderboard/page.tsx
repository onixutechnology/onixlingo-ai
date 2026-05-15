'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Crown, 
  User, 
  ChevronLeft, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await apiClient.get('/progress/eloquence-leaderboard');
        setLeaderboard(data.leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Header Corporativo */}
      <nav className="h-14 border-b border-slate-200 px-6 flex items-center justify-between bg-white shadow-sm z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-600 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <h1 className="font-black text-[10px] tracking-[0.2em] uppercase">Executive <span className="text-teal-600">Leaderboard</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-teal-50 border border-teal-100 text-[8px] font-black text-teal-600 uppercase tracking-widest">
            Global Analytics Active
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-6 md:p-12">
        
        {/* Hero Section del Leaderboard */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex p-3 bg-teal-50 rounded-full text-teal-600 mb-6"
          >
            <Trophy size={32} />
          </motion.div>
          <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-4 uppercase">Corporate Elite Ranking</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
            Los líderes en elocuencia y estrategia de la plataforma. Compite por el dominio global.
          </p>
        </div>

        {/* Tabla de Clasificación */}
        <div className="bg-white border border-slate-200 shadow-xl overflow-hidden">
          
          <div className="grid grid-cols-[80px,1fr,150px] px-8 py-4 bg-slate-950 text-teal-500 text-[10px] font-black uppercase tracking-[0.2em]">
             <span>Rank</span>
             <span>Executive Alias</span>
             <span className="text-right">Eloquence Pts</span>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-8 py-6 flex items-center gap-8 animate-pulse">
                   <div className="w-8 h-8 bg-slate-100 rounded-none"></div>
                   <div className="flex-1 h-4 bg-slate-50 rounded-none"></div>
                   <div className="w-20 h-4 bg-slate-50 rounded-none"></div>
                </div>
              ))
            ) : (
              leaderboard.map((player, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className={`grid grid-cols-[80px,1fr,150px] px-8 py-5 items-center hover:bg-slate-50 transition-colors ${idx === 0 ? 'bg-teal-50/30' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-black ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-300'}`}>
                      #{player.rank}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center text-sm font-black ${player.is_pro ? 'bg-slate-950 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                      {player.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 uppercase tracking-tight">{player.username}</span>
                        {player.is_pro && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[7px] font-black uppercase tracking-widest shadow-sm">
                            <Crown size={8} fill="currentColor" /> Titanium
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        {idx === 0 ? 'Global Champion' : idx < 5 ? 'Elite Executive' : 'Senior Associate'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Zap size={14} className="text-teal-600" />
                       <span className="text-xl font-black text-slate-900 leading-none">{player.eloquence_points.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Footer de Motivación */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-slate-950 text-white border border-slate-800">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-600/10 text-teal-500">
                 <Award size={24} />
              </div>
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest">¿Quieres subir en el ranking?</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Completa simulaciones Pro y gana partidas de Ajedrez CEO.</p>
              </div>
           </div>
           <button 
             onClick={() => router.push('/dashboard/pro')}
             className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
           >
             Go Pro Titanium
           </button>
        </div>

      </main>

    </div>
  );
}
