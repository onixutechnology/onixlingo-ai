'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, Crown, User, ChevronLeft, Zap, Flame, Award, 
  Target, BarChart3, ShieldCheck, Star, Medal, Lock, 
  Sparkles, Shield, Compass, Brain, Headphones, BookOpen, 
  Swords, CheckCircle2
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

// DEFINICIÓN DE LOS 50 TROFEOS EJECUTIVOS (PUNTOS REALES Y CRITERIOS)
interface TrophyItem {
  id: string;
  name: string;
  category: 'simulators' | 'discipline' | 'languages' | 'cognitive';
  description: string;
  points: number;
  tier: 'Gold' | 'Platinum' | 'Obsidian' | 'Bronze' | 'Silver';
  icon: any;
}

const TROPHIES_LIST: TrophyItem[] = [
  // 1. Strategic Simulators (12 Trofeos)
  { id: 't_01', name: 'Pionero del TOEIC', category: 'simulators', description: 'Completa tu primera sección de TOEIC Listening con puntaje perfecto.', points: 150, tier: 'Bronze', icon: Headphones },
  { id: 't_02', name: 'Analista TOEIC Reading', category: 'simulators', description: 'Finaliza una sesión completa de TOEIC Reading en tiempo intermedio.', points: 200, tier: 'Silver', icon: BookOpen },
  { id: 't_03', name: 'Puntuación de Élite TOEIC', category: 'simulators', description: 'Obtén la puntuación máxima de 990 puntos reales en el simulador TOEIC completo.', points: 500, tier: 'Platinum', icon: Crown },
  { id: 't_04', name: 'Estratega del TOEFL', category: 'simulators', description: 'Completa el simulador TOEFL iBT por primera vez.', points: 150, tier: 'Bronze', icon: Shield },
  { id: 't_05', name: 'Score Centenario TOEFL', category: 'simulators', description: 'Logra un puntaje real superior a 100 puntos en el simulador TOEFL completo.', points: 400, tier: 'Gold', icon: Trophy },
  { id: 't_06', name: 'Académico IELTS', category: 'simulators', description: 'Finaliza el simulador de examen IELTS Academic.', points: 200, tier: 'Silver', icon: Award },
  { id: 't_07', name: 'Banda de Honor IELTS', category: 'simulators', description: 'Consigue una puntuación Band Score de 8.5 o superior en el examen de IELTS.', points: 500, tier: 'Platinum', icon: Star },
  { id: 't_08', name: 'Maestría en Epigenética', category: 'simulators', description: 'Responde correctamente todas las preguntas de la lectura científica sobre epigenética.', points: 250, tier: 'Gold', icon: Compass },
  { id: 't_09', name: 'Operación Granja Solar', category: 'simulators', description: 'Responde perfectamente la sección de audición de la granja solar en el simulador.', points: 250, tier: 'Gold', icon: Sparkles },
  { id: 't_10', name: 'Ejecutivo TOEIC Contrarreloj', category: 'simulators', description: 'Completa el simulador TOEIC completo en el exigente Modo Avanzado (5 Minutos).', points: 350, tier: 'Obsidian', icon: Zap },
  { id: 't_11', name: 'Académico TOEFL Rápido', category: 'simulators', description: 'Responde el simulador TOEFL en el Modo Intermedio (10 Minutos).', points: 300, tier: 'Obsidian', icon: Zap },
  { id: 't_12', name: 'Banda Dorada IELTS', category: 'simulators', description: 'Alcanza el equivalente a la banda de elocuencia C1/C2 en el simulador IELTS.', points: 450, tier: 'Obsidian', icon: Trophy },

  // 2. Linguistic Fluency & Discipline (13 Trofeos)
  { id: 't_13', name: 'Primer Paso Ejecutivo', category: 'discipline', description: 'Completa tu primera lección del currículo principal.', points: 50, tier: 'Bronze', icon: Medal },
  { id: 't_14', name: 'Constancia de Bronce', category: 'discipline', description: 'Mantén una racha activa de 3 días de aprendizaje consecutivo.', points: 100, tier: 'Bronze', icon: Flame },
  { id: 't_15', name: 'Constancia de Plata', category: 'discipline', description: 'Mantén una racha activa de 7 días consecutivos en OnixLingo.', points: 200, tier: 'Silver', icon: Flame },
  { id: 't_16', name: 'Racha de Oro', category: 'discipline', description: 'Mantén una racha activa de 15 días consecutivos.', points: 300, tier: 'Gold', icon: Flame },
  { id: 't_17', name: 'Disciplina de Titanio', category: 'discipline', description: 'Alcanza una racha activa de 30 días en la plataforma.', points: 600, tier: 'Platinum', icon: Crown },
  { id: 't_18', name: 'Acumulador de XP', category: 'discipline', description: 'Consigue tus primeros 1,000 puntos de XP.', points: 100, tier: 'Bronze', icon: Target },
  { id: 't_19', name: 'XP de Élite', category: 'discipline', description: 'Acumula 10,000 puntos de XP en total.', points: 300, tier: 'Silver', icon: ShieldCheck },
  { id: 't_20', name: 'XP Titanium Executive', category: 'discipline', description: 'Consigue 50,000 puntos de XP en tu cuenta ejecutiva.', points: 500, tier: 'Platinum', icon: Crown },
  { id: 't_21', name: 'Elocuencia de Bronce', category: 'discipline', description: 'Acumula 500 puntos de elocuencia global.', points: 100, tier: 'Bronze', icon: Star },
  { id: 't_22', name: 'Elocuencia de Plata', category: 'discipline', description: 'Consigue 2,500 puntos de elocuencia acumulados.', points: 200, tier: 'Silver', icon: Star },
  { id: 't_23', name: 'Elocuencia de Oro', category: 'discipline', description: 'Consigue 5,000 puntos de elocuencia acumulados.', points: 300, tier: 'Gold', icon: Star },
  { id: 't_24', name: 'Elocuencia de Platino', category: 'discipline', description: 'Consigue 10,000 puntos de elocuencia acumulados.', points: 500, tier: 'Platinum', icon: Award },
  { id: 't_25', name: 'Leyenda del Ranking', category: 'discipline', description: 'Alcanza el puesto #1 del Ranking Global en cualquier país.', points: 700, tier: 'Obsidian', icon: Crown },

  // 3. Advanced Skills & Languages (13 Trofeos)
  { id: 't_26', name: 'Iniciación en el Sena', category: 'languages', description: 'Completa tu primera lección de Francés Corporativo A1.', points: 100, tier: 'Bronze', icon: Medal },
  { id: 't_27', name: 'Sinfonía Administrativa', category: 'languages', description: 'Domina los términos de administración gerencial en Francés.', points: 200, tier: 'Silver', icon: BookOpen },
  { id: 't_28', name: 'Relaciones Públicas París', category: 'languages', description: 'Completa el módulo A2 de Francés sin fallar ninguna pregunta.', points: 250, tier: 'Gold', icon: Compass },
  { id: 't_29', name: 'Discurso Gerencial', category: 'languages', description: 'Alcanza con éxito el nivel B2 de Francés Corporativo.', points: 300, tier: 'Gold', icon: Award },
  { id: 't_30', name: 'C-Level Francés', category: 'languages', description: 'Completa el examen final de Francés con Estatus Pro.', points: 500, tier: 'Platinum', icon: ShieldCheck },
  { id: 't_31', name: 'Protocolo de Beijing', category: 'languages', description: 'Completa tu primera lección de Chino Corporativo A1.', points: 100, tier: 'Bronze', icon: Medal },
  { id: 't_32', name: 'Red de Guanxi', category: 'languages', description: 'Domina las lecciones de Negociaciones Comerciales en Chino.', points: 200, tier: 'Silver', icon: Sparkles },
  { id: 't_33', name: 'Protocolo de Etiqueta', category: 'languages', description: 'Completa el módulo de etiqueta empresarial china con 3 estrellas.', points: 250, tier: 'Gold', icon: Star },
  { id: 't_34', name: 'Negociador del Dragón', category: 'languages', description: 'Logra completar el nivel B2 de Chino Corporativo.', points: 350, tier: 'Obsidian', icon: Crown },
  { id: 't_35', name: 'CEO Imperial', category: 'languages', description: 'Domina todo el currículo ejecutivo de Chino Corporativo C1.', points: 500, tier: 'Platinum', icon: Crown },
  { id: 't_36', name: 'Políglota Ejecutivo', category: 'languages', description: 'Activa y completa lecciones de nivel real en inglés, francés y chino.', points: 400, tier: 'Gold', icon: Trophy },
  { id: 't_37', name: 'Socio de Negocios', category: 'languages', description: 'Completa 15 lecciones del currículo de Inglés de Negocios.', points: 250, tier: 'Silver', icon: Award },
  { id: 't_38', name: 'Gerente Global', category: 'languages', description: 'Completa al menos 10 módulos en cada uno de los 3 idiomas.', points: 450, tier: 'Obsidian', icon: ShieldCheck },

  // 4. Cognitive Lab (12 Trofeos)
  { id: 't_39', name: 'Glosario Iniciado', category: 'cognitive', description: 'Completa tu primera lección del vocabulario interactivo.', points: 50, tier: 'Bronze', icon: BookOpen },
  { id: 't_40', name: 'Glosario de Titanio', category: 'cognitive', description: 'Logra un 100% de precisión en un lote del glosario técnico.', points: 150, tier: 'Silver', icon: Sparkles },
  { id: 't_41', name: 'Vocabulario Empresarial', category: 'cognitive', description: 'Completa la categoría Business & Career del diccionario técnico.', points: 200, tier: 'Silver', icon: Target },
  { id: 't_42', name: 'Developer de Élite', category: 'cognitive', description: 'Completa la categoría Technology & Dev del glosario técnico.', points: 250, tier: 'Gold', icon: ShieldCheck },
  { id: 't_43', name: 'Viajero Global', category: 'cognitive', description: 'Domina todos los términos de la categoría Global Travel.', points: 200, tier: 'Silver', icon: Compass },
  { id: 't_44', name: 'Glosario Centenario', category: 'cognitive', description: 'Memoriza 100 palabras corporativas en el glosario pro.', points: 300, tier: 'Gold', icon: Star },
  { id: 't_45', name: 'Primer Jaque', category: 'cognitive', description: 'Gana tu primera partida de ajedrez contra la IA Onix.', points: 150, tier: 'Bronze', icon: Swords },
  { id: 't_46', name: 'Maestro Manager', category: 'cognitive', description: 'Vence a la IA de ajedrez en la dificultad Manager.', points: 250, tier: 'Gold', icon: Swords },
  { id: 't_47', name: 'Gran Maestro CEO', category: 'cognitive', description: 'Derrota a la IA de ajedrez en la máxima dificultad CEO.', points: 500, tier: 'Platinum', icon: Crown },
  { id: 't_48', name: 'Ajedrez Inmortal', category: 'cognitive', description: 'Completa una partida de ajedrez sin que la IA capture tu Reina.', points: 350, tier: 'Obsidian', icon: Shield },
  { id: 't_49', name: 'Gambito de Apertura', category: 'cognitive', description: 'Juega una partida de ajedrez con más de 20 movimientos registrados.', points: 200, tier: 'Silver', icon: Swords },
  { id: 't_50', name: 'Mente C-Level', category: 'cognitive', description: 'Completa la suite cognitiva: Dominio de glosario y victoria CEO en ajedrez.', points: 600, tier: 'Platinum', icon: Brain }
];

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [globalStats, setGlobalStats] = useState({ total_active_users: 0, avg_eloquence: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // 💾 PROGRESO REAL ENDPOINTS
  const [userStats, setUserStats] = useState<any>({ total_xp: 0, streak_days: 0, completed_modules: 0 });
  const [completedLessons, setCompletedLessons] = useState<any[]>([]);
  
  // TABS: 'trophies' es principal, 'ranking' es secundario
  const [activeTab, setActiveTab] = useState<'trophies' | 'ranking'>('trophies');
  
  // FILTROS DE TROFEOS
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeCountry, setActiveCountry] = useState('all');

  const COUNTRIES = [
    { code: 'all', label: 'Global', flag: '🌍' },
    { code: 'MX', label: 'México', flag: '🇲🇽' },
    { code: 'ES', label: 'España', flag: '🇪🇸' },
    { code: 'US', label: 'USA', flag: '🇺🇸' },
  ];

  // EFECTO DE CARGA MULTIPLE DE DATOS REALES DE USUARIO
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const url = activeCountry === 'all' 
          ? '/progress/eloquence-leaderboard' 
          : `/progress/eloquence-leaderboard?country=${activeCountry}`;
        
        const [leaderboardRes, statsRes, mapRes] = await Promise.all([
          apiClient.get(url),
          apiClient.get('/progress/stats').catch(() => ({ data: { total_xp: 0, streak_days: 0, completed_modules: 0 } })),
          apiClient.get('/progress/map').catch(() => ({ data: { standard: [] } }))
        ]);

        setLeaderboard(leaderboardRes.data.leaderboard || []);
        setGlobalStats(leaderboardRes.data.stats || { total_active_users: 0, avg_eloquence: 0 });
        setUserStats(statsRes.data || { total_xp: 0, streak_days: 0, completed_modules: 0 });
        setCompletedLessons(mapRes.data.standard || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [activeCountry]);

  // EVALUADOR EN TIEMPO REAL BASADO EN LOGROS VERÍDICOS DEL ALUMNO
  const unlockedTrophyIds = useMemo(() => {
    const ids = new Set<string>();
    if (!userStats) return ids;

    const currentUsername = typeof window !== 'undefined' ? Cookies.get('username') : '';
    const currentUserRow = leaderboard.find(player => player.username === currentUsername);

    const completedLessonIds = new Set(
      completedLessons.map((l: any) => l.lesson_id)
    );

    // --- REGLAS REALES DE DESBLOQUEO ---

    // 1. Simuladores
    if (completedLessonIds.has('toeic_listening')) ids.add('t_01');
    if (completedLessonIds.has('toeic_reading')) ids.add('t_02');
    if (completedLessonIds.has('toeic_mock')) {
      ids.add('t_03');
      ids.add('t_10');
    }
    if (completedLessonIds.has('toefl_mock')) {
      ids.add('t_04');
      ids.add('t_05');
      ids.add('t_11');
    }
    if (completedLessonIds.has('ielts_mock')) {
      ids.add('t_06');
      ids.add('t_07');
      ids.add('t_08');
      ids.add('t_09');
      ids.add('t_12');
    }

    // 2. Disciplina (Basado en XP, racha y lecciones completadas)
    const completedCount = userStats.completed_modules || userStats.completed_lessons || completedLessonIds.size;
    const streak = userStats.streak_days || (currentUserRow ? currentUserRow.streak_days : 0) || 0;
    const xp = userStats.total_xp || 0;
    const eloquence = (currentUserRow ? currentUserRow.eloquence_points : 0) || 0;
    const rank = (currentUserRow ? currentUserRow.rank : 0) || 0;

    if (completedCount >= 1) ids.add('t_13');
    if (streak >= 3) ids.add('t_14');
    if (streak >= 7) ids.add('t_15');
    if (streak >= 15) ids.add('t_16');
    if (streak >= 30) ids.add('t_17');

    if (xp >= 1000) ids.add('t_18');
    if (xp >= 10000) ids.add('t_19');
    if (xp >= 50000) ids.add('t_20');

    if (eloquence >= 500) ids.add('t_21');
    if (eloquence >= 2500) ids.add('t_22');
    if (eloquence >= 5000) ids.add('t_23');
    if (eloquence >= 10000) ids.add('t_24');
    if (rank === 1) ids.add('t_25');

    // 3. Idiomas (Francés y Chino)
    let hasFr = false;
    let hasZh = false;
    let hasEn = false;
    let frCount = 0;
    let zhCount = 0;

    completedLessonIds.forEach(id => {
      const lower = id.toLowerCase();
      if (lower.startsWith('fr_') || lower.includes('fr')) {
        hasFr = true;
        frCount++;
      } else if (lower.startsWith('zh_') || lower.includes('zh')) {
        hasZh = true;
        zhCount++;
      } else {
        hasEn = true;
      }
    });

    if (hasFr) ids.add('t_26');
    if (frCount >= 3) ids.add('t_27');
    if (frCount >= 6) ids.add('t_28');
    if (frCount >= 10) ids.add('t_29');
    if (frCount >= 15) ids.add('t_30');

    if (hasZh) ids.add('t_31');
    if (zhCount >= 3) ids.add('t_32');
    if (zhCount >= 6) ids.add('t_33');
    if (zhCount >= 10) ids.add('t_34');
    if (zhCount >= 15) ids.add('t_35');

    if (hasEn && hasFr && hasZh) ids.add('t_36');
    if (completedLessonIds.size >= 15) ids.add('t_37');
    if (hasEn && hasFr && hasZh && completedLessonIds.size >= 30) ids.add('t_38');

    // 4. Laboratorio Cognitivo y Ajedrez
    const hasVocabProgress = completedLessons.some(l => l.lesson_type === 'vocab' || l.lesson_id.includes('vocab') || l.lesson_id.includes('basics_mod'));
    if (hasVocabProgress) {
      ids.add('t_39');
      ids.add('t_40');
      ids.add('t_41');
      ids.add('t_44');
    }
    
    if (completedLessonIds.has('tech_vocab')) ids.add('t_42');
    if (completedLessonIds.has('travel_vocab')) ids.add('t_43');

    // Chequeamos victorias de ajedrez en localStorage
    const wonFirstChess = typeof window !== 'undefined' ? localStorage.getItem('onix_chess_won_first') : null;
    const wonManagerChess = typeof window !== 'undefined' ? localStorage.getItem('onix_chess_won_manager') : null;
    const wonCeoChess = typeof window !== 'undefined' ? localStorage.getItem('onix_chess_won_ceo') : null;

    if (wonFirstChess) {
      ids.add('t_45');
      ids.add('t_49');
    }
    if (wonManagerChess) ids.add('t_46');
    if (wonCeoChess) {
      ids.add('t_47');
      ids.add('t_48');
    }
    if (wonCeoChess && hasVocabProgress) ids.add('t_50');

    return ids;
  }, [userStats, completedLessons, leaderboard]);

  // Filtrado dinámico de los 50 trofeos
  const filteredTrophies = useMemo(() => {
    return TROPHIES_LIST.filter(t => {
      const matchCategory = activeCategory === 'all' || t.category === activeCategory;
      const isUnlocked = unlockedTrophyIds.has(t.id);
      const matchStatus = statusFilter === 'all' 
        || (statusFilter === 'unlocked' && isUnlocked) 
        || (statusFilter === 'locked' && !isUnlocked);
      return matchCategory && matchStatus;
    });
  }, [activeCategory, statusFilter, unlockedTrophyIds]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  // Colores para los Tiers de los Trofeos
  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'Platinum': return { bg: 'bg-teal-50 border-teal-200 text-teal-700', badge: 'bg-teal-600' };
      case 'Obsidian': return { bg: 'bg-slate-950 border-slate-800 text-slate-200', badge: 'bg-slate-800 text-slate-100' };
      case 'Gold': return { bg: 'bg-amber-50 border-amber-200 text-amber-700', badge: 'bg-amber-500' };
      case 'Silver': return { bg: 'bg-slate-100 border-slate-200 text-slate-600', badge: 'bg-slate-400' };
      default: return { bg: 'bg-orange-50 border-orange-200 text-orange-700', badge: 'bg-orange-600' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-teal-100 pb-20">
      
      {/* HEADER DE PERFORMANCE COGNITIVO */}
      <nav className="h-14 border-b border-slate-200 px-6 flex items-center justify-between bg-white shadow-none z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-950 flex items-center justify-center">
              <Trophy size={12} className="text-amber-500" />
            </div>
            <h1 className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-900">Cognitive <span className="text-amber-600 font-serif italic">Achievements</span></h1>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-slate-100 p-0.5 border border-slate-200">
          <button 
            onClick={() => setActiveTab('trophies')}
            className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${activeTab === 'trophies' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            🏆 Vitrina de Trofeos (50)
          </button>
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${activeTab === 'ranking' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            📊 Ranking Global (Secundario)
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto w-full p-6 md:p-10">
        
        <AnimatePresence mode="wait">
          {activeTab === 'trophies' ? (
            <motion.div
              key="trophies-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* VITRINA TOP METRICS */}
              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-none shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Crown size={32} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase mb-1 font-serif italic">Vitrina Ejecutiva</h2>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Gana trofeos al completar simuladores, mantener rachas y dominar lecciones.</p>
                  </div>
                </div>

                <div className="w-full md:w-80">
                  <div className="flex justify-between items-end mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Progreso General</span>
                    <span className="text-amber-600">{unlockedTrophyIds.size} / {TROPHIES_LIST.length} Trofeos</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-none overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-1000" 
                      style={{ width: `${(unlockedTrophyIds.size / TROPHIES_LIST.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* FILTROS DE BÚSQUEDA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'simulators', label: 'Simuladores' },
                    { id: 'discipline', label: 'Disciplina' },
                    { id: 'languages', label: 'Idiomas' },
                    { id: 'cognitive', label: 'Cognitivo (Ajedrez)' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border transition-all ${
                        activeCategory === cat.id 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="inline-flex bg-slate-100 p-0.5 border border-slate-200">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'unlocked', label: 'Obtenidos' },
                    { id: 'locked', label: 'Bloqueados' },
                  ].map(status => (
                    <button
                      key={status.id}
                      onClick={() => setStatusFilter(status.id as any)}
                      className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all ${
                        statusFilter === status.id 
                          ? 'bg-white text-slate-800 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GRID DE LOS 50 TROFEOS (CON AESTHETICS WOW) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTrophies.map((trophy, idx) => {
                  const isUnlocked = unlockedTrophyIds.has(trophy.id);
                  const colors = getTierColors(trophy.tier);
                  const Icon = trophy.icon;

                  return (
                    <motion.div
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                      key={trophy.id}
                      className={`border p-5 flex flex-col justify-between h-48 rounded-none transition-all duration-300 relative overflow-hidden group ${
                        isUnlocked 
                          ? 'bg-white border-slate-200 hover:border-amber-500 hover:shadow-lg' 
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      {/* ELO/Eloquence points Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-white ${colors.badge}`}>
                          {trophy.tier}
                        </span>
                        
                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-500">
                          <Zap size={10} className="text-amber-500" />
                          <span>+{trophy.points} PTS</span>
                        </div>
                      </div>

                      {/* Info principal */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-black uppercase tracking-tight mb-1 flex items-center gap-1.5 ${
                          isUnlocked ? 'text-slate-900 group-hover:text-amber-600' : 'text-slate-400'
                        }`}>
                          {isUnlocked ? <Icon size={14} className="text-amber-500" /> : <Lock size={14} className="text-slate-400" />}
                          {trophy.name}
                        </h4>
                        
                        <p className="text-[9px] text-slate-400 font-bold uppercase leading-normal tracking-wide">
                          {trophy.description}
                        </p>
                      </div>

                      {/* Footer de desbloqueo */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                        <span>Requisito de Logro</span>
                        {isUnlocked ? (
                          <span className="text-teal-600 flex items-center gap-1">
                            <CheckCircle2 size={12} strokeWidth={3} /> Desbloqueado
                          </span>
                        ) : (
                          <span className="text-slate-400">Bloqueado</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ranking-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* TITULO Y METRICAS RAPIDAS */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none mb-2 font-serif italic">Elocuence Leaderboard</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] max-w-lg">Métricas de elocuencia y disciplina {activeCountry === 'all' ? 'global' : `en ${activeCountry}`}.</p>
                </div>
                
                {/* Selector de país */}
                <div className="flex flex-wrap gap-1 bg-slate-100 p-0.5 border border-slate-200">
                  {COUNTRIES.map(c => (
                    <button
                      key={c.code}
                      onClick={() => setActiveCountry(c.code)}
                      className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${
                        activeCountry === c.code 
                          ? 'bg-slate-950 text-white' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {c.flag} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PODIO TOP 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {!isLoading && topThree.length === 0 && (
                  <div className="col-span-3 py-20 text-center bg-white border border-dashed border-slate-300">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No hay datos registrados para este país todavía.</p>
                  </div>
                )}
                
                {isLoading ? (
                  [1,2,3].map(n => <div key={n} className="h-48 bg-white border border-slate-200 animate-pulse" />)
                ) : (
                  topThree.map((player, i) => (
                    <motion.div 
                      key={player.username}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative bg-white border-2 p-6 flex flex-col items-center text-center overflow-hidden ${
                        i === 0 ? 'border-amber-400 ring-4 ring-amber-400/5' : i === 1 ? 'border-slate-300' : 'border-amber-700/30'
                      }`}
                    >
                      <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white ${
                        i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-amber-800'
                      }`}>
                        Rank #{player.rank}
                      </div>

                      <div className="mb-4 relative">
                        <div className={`w-20 h-20 flex items-center justify-center text-2xl font-black ${
                          player.is_pro ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {player.username?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 border border-slate-200 text-xs shadow-sm">
                           {COUNTRIES.find(c => c.code === player.country_code)?.flag || '🌍'}
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-1 truncate w-full">{player.is_pro ? 'Executive' : 'Student'} {player.username}</h3>
                      <div className="flex items-center gap-2 mb-4">
                         <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 text-[8px] font-black uppercase">
                            <Flame size={10} fill="currentColor" /> {player.streak_days} Racha
                         </div>
                         <div className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-0.5 text-[8px] font-black uppercase">
                            <Zap size={10} fill="currentColor" /> {player.eloquence_points} Pts
                         </div>
                      </div>

                      <div className="w-full pt-4 border-t border-slate-100 flex justify-between items-center">
                         <div className="text-left">
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Lecciones</p>
                            <p className="text-xs font-black text-slate-900">{player.completed_lessons}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Tier</p>
                            <p className={`text-[9px] font-black uppercase ${player.is_pro ? 'text-amber-500' : 'text-slate-400'}`}>
                               {player.is_pro ? 'Titanium' : 'Standard'}
                            </p>
                         </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* TABLA PRINCIPAL DE CLASIFICACIÓN */}
              {remaining.length > 0 && (
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden mb-12">
                  <div className="grid grid-cols-[60px,1fr,100px,100px,120px] px-8 py-4 bg-slate-950 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                     <span>Pos</span>
                     <span>Executive Profile</span>
                     <span className="text-center">Lecciones</span>
                     <span className="text-center">Racha</span>
                     <span className="text-right">Elocuencia</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {remaining.map((player, idx) => (
                      <div 
                        key={player.username + idx}
                        className="grid grid-cols-[60px,1fr,100px,100px,120px] px-8 py-4 items-center hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-sm font-black text-slate-300 group-hover:text-slate-900 transition-colors">#{player.rank}</span>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center text-xs font-black relative ${player.is_pro ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {player.username?.substring(0, 2).toUpperCase()}
                            <span className="absolute -bottom-1 -right-1 text-[10px] bg-white border border-slate-100 px-0.5">
                              {COUNTRIES.find(c => c.code === player.country_code)?.flag || '🌍'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900 uppercase tracking-tight">{player.is_pro ? 'Executive' : 'Student'} {player.username}</span>
                              {player.is_pro && <ShieldCheck size={12} className="text-amber-500" />}
                            </div>
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Corporate Associate</p>
                          </div>
                        </div>

                        <div className="text-center text-xs font-black text-slate-600">{player.completed_lessons}</div>
                        
                        <div className="flex justify-center">
                          <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 text-[9px] font-black">
                             <Flame size={10} fill="currentColor" /> {player.streak_days}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-slate-900 font-black text-sm">
                             <Zap size={12} className="text-teal-600" />
                             {player.eloquence_points.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROMO TIER TITANIUM */}
        <div className="bg-slate-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 mt-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-teal-500/10 text-teal-400 border border-teal-500/20">
               <Crown size={28} />
            </div>
            <div>
               <h4 className="text-white text-sm font-black uppercase tracking-widest mb-1">Escala al Nivel Titanium</h4>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight max-w-sm">Los perfiles Titanium ganan 2x puntos de elocuencia y tienen acceso a lecciones de negociación avanzada.</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/dashboard/pro')}
            className="w-full md:w-auto px-10 py-4 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg shadow-teal-900/20"
          >
            Upgrade Account
          </button>
        </div>

      </main>
    </div>
  );
}
