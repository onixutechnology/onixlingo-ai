'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Lock, 
  Flame, 
  BookOpen, 
  Swords, 
  ArrowLeft,
  Calendar,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import Cookies from 'js-cookie';

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', code: 'streak_7', title: 'Racha de 7 Días', description: 'Mantén tu racha de estudio por una semana completa.', icon: Flame },
  { id: '2', code: 'streak_30', title: 'Racha de 30 Días', description: 'Compromiso total: 30 días de aprendizaje ininterrumpido.', icon: Zap },
  { id: '3', code: 'master_a1', title: 'Maestro de Nivel A1', description: 'Completa todas las lecciones del nivel A1 en cualquier idioma.', icon: BookOpen },
  { id: '4', code: 'chess_grandmaster', title: 'Gran Maestro de Ajedrez', description: 'Completa 5 acertijos o lecciones de ajedrez táctico.', icon: Swords },
  { id: '5', code: 'perfectionist', title: 'Perfeccionista', description: 'Obtén una puntuación de 100 en cualquier lección.', icon: Target },
];

export default function ProfilePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/progress/stats');
        setStats(res.data);
        setUnlockedCodes(res.data.achievements || []);
      } catch (err) {
        console.error("Error fetching profile stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 h-14 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-none transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black text-xs tracking-[0.2em] uppercase">Perfil Ejecutivo</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* User Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-none shadow-sm mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-teal-600 flex items-center justify-center text-white text-4xl font-black rounded-none">
            {stats?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black tracking-tighter mb-1 uppercase">{stats?.username}</h2>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-4">{stats?.level_label}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-slate-50 px-4 py-2 border border-slate-100">
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Total XP</p>
                <p className="text-lg font-black">{stats?.total_xp}</p>
              </div>
              <div className="bg-slate-50 px-4 py-2 border border-slate-100">
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Días en Racha</p>
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-orange-500 fill-orange-500" />
                  <p className="text-lg font-black">{stats?.streak_days}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Trophy size={24} className="text-teal-600" />
            <h3 className="text-xl font-black tracking-tight uppercase">Logros y Reconocimientos</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedCodes.includes(ach.code);
              const Icon = ach.icon;

              return (
                <div 
                  key={ach.id} 
                  className={`border p-6 flex items-start gap-5 transition-all ${
                    isUnlocked 
                      ? 'bg-white border-teal-200 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 opacity-70'
                  }`}
                >
                  <div className={`w-14 h-14 flex-shrink-0 flex items-center justify-center border-2 ${
                    isUnlocked 
                      ? 'border-teal-600 bg-teal-50 text-teal-600' 
                      : 'border-slate-300 bg-slate-100 text-slate-400'
                  }`}>
                    {isUnlocked ? <Icon size={28} /> : <Lock size={24} />}
                  </div>
                  
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-tight mb-1 ${
                      isUnlocked ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {ach.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                      {ach.description}
                    </p>
                    {isUnlocked && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
                        <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest">Desbloqueado</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}