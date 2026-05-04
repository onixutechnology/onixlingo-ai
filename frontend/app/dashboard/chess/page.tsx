'use client';

/**
 * ==============================================================================
 * ONIXLINGO CHESS ACADEMY - LOBBY (ULTRA TITANIUM)
 * Sincronizado con la estructura Backend: 10 lecciones por módulo
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUIStore } from '@/store/uiStore'; 
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Zap, Crown, Target, Shield, Flame, 
  Layers, Sword, Lock, Star, ChevronRight, Play, Loader2, Languages, Sparkles
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

const DAILY_PUZZLES = [
  'fundamentals-1', // 0: Domingo
  'tactics-1-1',    // 1: Lunes
  'checkmates-1',   // 2: Martes
  'fundamentals-2', // 3: Miércoles
  'tactics-1-2',    // 4: Jueves
  'checkmates-2',   // 5: Viernes
  'tactics-1-3'     // 6: Sábado
];

const MODULES_UI_CONFIG = [
  { id: 'fundamentals', title: 'Fundamentos Esenciales', desc: 'Reglas, movimientos y capturas básicas para dominar el tablero.', icon: Shield, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20', locked: false },
  { id: 'tactics-1', title: 'Táctica Básica: Patrones', desc: 'Ataques dobles, clavadas y descubiertas. Multiplica tu visión.', icon: Zap, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', locked: false },
  { id: 'checkmates', title: 'Patrones de Mate', desc: 'Acorrala al Rey enemigo sin piedad usando redes de mate clásicas.', icon: Crown, color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20', locked: false },
  { id: 'openings', title: 'Control del Centro', desc: 'Desarrollo de piezas y seguridad del Rey en la apertura.', icon: Target, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20', locked: false },
  { id: 'middlegame', title: 'Estrategia de Medio Juego', desc: 'Planes a largo plazo, estructuras de peones y maniobras.', icon: Layers, color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20', locked: false },
  { id: 'endgames', title: 'Finales Teóricos', desc: 'Convierte tu pequeña ventaja material en una victoria segura.', icon: Sword, color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/20', locked: false },
  { id: 'advanced', title: 'Cálculo Avanzado', desc: 'Sacrificios espectaculares y combinaciones de más de 5 movimientos.', icon: Flame, color: 'from-slate-700 to-slate-800', shadow: 'shadow-none', locked: true } // El módulo 7 está bloqueado hasta que se complete el resto
];

// 🔥 DICCIONARIO COMPLETO (70 Lecciones sincronizadas con tus JSONs)
const getLessonTitle = (id: string) => {
  const titles: Record<string, string> = {
    // Fundamentals (1-10)
    'fundamentals-1': 'El Tablero y sus Coordenadas',
    'fundamentals-2': 'El Peón: La Infantería',
    'fundamentals-3': 'El Caballo: Ataque en L',
    'fundamentals-4': 'El Alfil: Francotirador Diagonal',
    'fundamentals-5': 'La Torre: Muros de Piedra',
    'fundamentals-6': 'La Dama: Dominio Absoluto',
    'fundamentals-7': 'El Rey: Seguridad y Valor',
    'fundamentals-8': 'Enroque: La Fortaleza',
    'fundamentals-9': 'Captura al Paso (En Passant)',
    'fundamentals-10': 'Jaque vs. Jaque Mate',
    // Tactics-1 (1-10)
    'tactics-1-1': 'El Ataque Doble (The Fork)',
    'tactics-1-2': 'La Clavada Absoluta',
    'tactics-1-3': 'La Clavada Relativa',
    'tactics-1-4': 'Ataque a la Descubierta',
    'tactics-1-5': 'Jaque a la Descubierta',
    'tactics-1-6': 'Ataque de Rayos X',
    'tactics-1-7': 'La Desviación',
    'tactics-1-8': 'La Atracción del Rey',
    'tactics-1-9': 'Eliminación de la Defensa',
    'tactics-1-10': 'Intercepción Táctica',
    // Checkmates (1-10)
    'checkmates-1': 'Mate del Pasillo (Back-Rank)',
    'checkmates-2': 'El Beso de la Muerte',
    'checkmates-3': 'Mate Árabe',
    'checkmates-4': 'Mate de la Coz (Smothered)',
    'checkmates-5': 'Mate de Anastasia',
    'checkmates-6': 'Mate de la Charretera',
    'checkmates-7': 'Mate de Boden (Alfiles)',
    'checkmates-8': 'Mate de la Ópera (Morphy)',
    'checkmates-9': 'Defensa contra Mate del Loco',
    'checkmates-10': 'Defensa contra Mate del Pastor',
    // Openings (1-10)
    'openings-1': 'Control del Centro Clásico',
    'openings-2': 'Desarrollo Rápido de Piezas',
    'openings-3': 'Gambito de Rey',
    'openings-4': 'Apertura Italiana',
    'openings-5': 'Apertura Española (Ruy López)',
    'openings-6': 'Defensa Siciliana',
    'openings-7': 'Defensa Francesa',
    'openings-8': 'Defensa Caro-Kann',
    'openings-9': 'Gambito de Dama',
    'openings-10': 'Castigo a Errores de Apertura',
    // Middlegame (1-10)
    'middlegame-1': 'Estructura de Peones',
    'middlegame-2': 'El Peón Aislado',
    'middlegame-3': 'Mayoría de Peones',
    'middlegame-4': 'Casillas y Complejos Débiles',
    'middlegame-5': 'El Puesto Avanzado (Outpost)',
    'middlegame-6': 'Dominio de Columnas Abiertas',
    'middlegame-7': 'El Poder de las Diagonales',
    'middlegame-8': 'La Pareja de Alfiles',
    'middlegame-9': 'El Rey en el Centro (Ataque)',
    'middlegame-10': 'Sacrificios Posicionales',
    // Endgames (1-10)
    'endgames-1': 'Regla del Cuadrado',
    'endgames-2': 'La Oposición',
    'endgames-3': 'Rey y Peón vs Rey',
    'endgames-4': 'Torre y Peón vs Torre',
    'endgames-5': 'La Posición de Lucena',
    'endgames-6': 'La Posición de Philidor',
    'endgames-7': 'Finales de Alfiles',
    'endgames-8': 'Finales de Caballos',
    'endgames-9': 'Dama vs Peón (Séptima Fila)',
    'endgames-10': 'La Triangulación',
    // Advanced (1-10)
    'advanced-1': 'Cálculo de Variantes',
    'advanced-2': 'Jugadas Intermedias (Zwischenzug)',
    'advanced-3': 'Sobrecarga de Piezas',
    'advanced-4': 'Zugzwang',
    'advanced-5': 'Profilaxis',
    'advanced-6': 'Sacrificio de Calidad',
    'advanced-7': 'Ataque al Enroque',
    'advanced-8': 'Defensa Tenaz',
    'advanced-9': 'Construcción de Fortalezas',
    'advanced-10': 'Evaluación de Posiciones'
  };
  return titles[id] || `Unidad Táctica ${id.split('-')[1] || id}`;
};

// 🔥 ANIMACIONES SEGURAS PARA TYPESCRIPT
const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ChessLobbyPage() {
  const { activeLanguage, setLanguage } = useUIStore();

  const [modules, setModules] = useState<any[]>([]);
  const [stats, setStats] = useState({ elo: 0, puzzlesSolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [dailyPuzzleId, setDailyPuzzleId] = useState('tactics-1-1');

  useEffect(() => {
    if (activeLanguage !== 'en') {
      setIsLoading(false);
      return; 
    }

    const today = new Date().getDay();
    setDailyPuzzleId(DAILY_PUZZLES[today] || 'tactics-1-1');

    const fetchChessData = async () => {
      let completedLessons: string[] = [];
      let currentElo = 850;

      try {
        const token = Cookies.get('access_token');
        if (token) {
          const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
          const res = await fetch(`${API_URL}/api/v1/chess/progress`, {
            headers: { 
              'Authorization': safeToken,
              'Content-Type': 'application/json',
            },
            cache: 'no-store'
          });
          
          if (res.ok) {
            const data = await res.json();
            completedLessons = data.completed_lessons || [];
            currentElo = data.elo ? data.elo : 850 + (completedLessons.length * 15);
          }
        }
      } catch (error) {
        console.error("⚠️ Error de conexión con el backend:", error);
      } finally {
        // 🔥 LÓGICA DE PROGRESO DINÁMICO Y SECUENCIAL
        const dynamicModules = MODULES_UI_CONFIG.map(mod => {
          const lessons = Array.from({ length: 10 }).map((_, idx) => {
            const lessonId = `${mod.id}-${idx + 1}`;
            const isCompleted = completedLessons.includes(lessonId);
            
            // Lógica Secuencial: Una lección está "activa" (se puede jugar) SI es la primera del módulo, 
            // O SI la lección anterior ya fue completada.
            const previousLessonId = `${mod.id}-${idx}`;
            const isPreviousCompleted = idx === 0 ? true : completedLessons.includes(previousLessonId);
            const status = isCompleted ? 'completed' : (isPreviousCompleted ? 'active' : 'locked');

            return {
              id: lessonId,
              title: getLessonTitle(lessonId),
              status: status
            };
          });
          return { ...mod, lessons };
        });

        setModules(dynamicModules);
        setStats({ elo: currentElo, puzzlesSolved: completedLessons.length });
        setIsLoading(false);
      }
    };

    fetchChessData();
  }, [activeLanguage]);

  const calculateProgress = (lessons: any[]) => {
    if (!lessons || lessons.length === 0) return 0;
    const completed = lessons.filter((l: any) => l.status === 'completed').length;
    return Math.round((completed / lessons.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-indigo-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="animate-spin mb-6 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" size={56} strokeWidth={2} />
          <p className="font-black text-slate-300 tracking-[0.3em] uppercase text-sm animate-pulse">Iniciando Titanium Engine...</p>
        </div>
      </div>
    );
  }

  // 🔥 ESTADO DE SINCRONIZACIÓN
  if (activeLanguage === 'fr' || activeLanguage === 'zh') {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-600/5 rounded-full blur-[120px]"></div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full bg-white/[0.03] border border-white/[0.05] rounded-[3rem] p-12 text-center flex flex-col items-center justify-center backdrop-blur-2xl shadow-2xl relative overflow-hidden z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-[2rem] flex items-center justify-center mb-8 ring-1 ring-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <Crown size={48} className="text-amber-400 drop-shadow-md" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-sm">Academia en Traducción</h3>
          
          <p className="text-slate-400 mb-10 text-lg leading-relaxed font-medium">
            Las lecciones magistrales y los puzzles tácticos para <strong>{activeLanguage === 'fr' ? 'Francés' : 'Chino Mandarín'}</strong> están siendo traducidos por nuestros Grandes Maestros. 
            La terminología exacta del tablero estará disponible pronto.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button onClick={() => setLanguage('en')} className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
              Volver a Inglés
            </button>
            <Link href="/dashboard" className="bg-white/5 text-slate-300 border border-white/10 font-bold px-8 py-4 rounded-2xl hover:bg-white/10 hover:text-white transition-all active:scale-95 flex items-center justify-center">
              Regresar al Hub
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDERIZADO NORMAL DEL AJEDREZ (INGLÉS) ---
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-24 selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* BACKGROUND EFFECTS DEEP SPACE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER HERO - ESTÉTICA TITANIUM */}
      <div className="relative border-b border-white/[0.05] pb-14 pt-10 px-6 sm:px-8 z-10 bg-[#030712]/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors font-bold text-sm bg-white/[0.03] hover:bg-white/[0.08] px-5 py-2.5 rounded-xl border border-white/[0.05] shadow-sm">
            <ArrowLeft size={16} /> Volver al LMS
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Sparkles size={14} /> Titanium Academy
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                Maestría <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400">Táctica</span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                El ajedrez en OnixLingo no se trata solo de mover piezas, se trata de reconocer patrones y dominar la terminología exacta en inglés para negociaciones estratégicas.
              </p>
            </div>

            {/* METRICS CARDS */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none bg-white/[0.02] p-6 rounded-[2rem] border border-white/[0.05] backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center gap-3 text-amber-400 mb-2 relative z-10">
                  <Trophy size={24} strokeWidth={2.5} className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <span className="font-black text-4xl leading-none tracking-tighter text-white">{stats.elo}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] relative z-10">ELO Táctico</div>
              </div>
              
              <div className="flex-1 lg:flex-none bg-white/[0.02] p-6 rounded-[2rem] border border-white/[0.05] backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center gap-3 text-indigo-400 mb-2 relative z-10">
                  <Target size={24} strokeWidth={2.5} className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <span className="font-black text-4xl leading-none tracking-tighter text-white">{stats.puzzlesSolved}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] relative z-10">Resueltos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 -mt-8 relative z-20 space-y-12">
        
        {/* 🔥 TARJETA: PUZZLE DIARIO (Súper Premium) */}
        <Link href={`/dashboard/chess/practice?lessonId=${dailyPuzzleId}`} className="block group">
          <div className="relative rounded-[2.5rem] p-[1px] overflow-hidden bg-gradient-to-r from-indigo-500/50 via-amber-500/50 to-purple-500/50 shadow-[0_10px_40px_rgba(99,102,241,0.15)] group-hover:shadow-[0_10px_50px_rgba(245,158,11,0.25)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
            
            <div className="bg-[#0A0E17] relative rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
              <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
              
              <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                <div className="w-20 h-20 shrink-0 rounded-[1.5rem] bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Star size={40} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight group-hover:text-amber-300 transition-colors">
                    Reto Diario: {getLessonTitle(dailyPuzzleId)}
                  </h3>
                  <p className="text-base text-slate-400 font-medium">Resuelve el problema de hoy para mantener tu ELO y racha intactos.</p>
                  <div className="flex gap-3 mt-4">
                    <span className="text-[10px] bg-white/5 text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 font-black tracking-widest">DIFÍCIL</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 font-black tracking-widest">+25 XP</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 bg-white text-[#0B0F19] px-8 py-4 rounded-2xl font-black text-sm hover:bg-amber-400 hover:scale-105 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] w-full md:w-auto justify-center group-hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                <Play size={18} fill="currentColor" /> RESOLVER AHORA
              </div>
            </div>
          </div>
        </Link>

        {/* LISTA DE MÓDULOS ANIMADA */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-2 mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-slate-700"></span> Ruta de Aprendizaje
          </h2>
          
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
            {modules.map((module) => {
              const currentProgress = calculateProgress(module.lessons);
              const isCompleted = currentProgress === 100;

              return (
                <motion.div variants={itemVariants} key={module.id} className={`bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] border ${module.locked ? 'border-white/[0.02] opacity-50 grayscale-[50%]' : 'border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:border-white/[0.08] hover:bg-white/[0.03]'} overflow-hidden transition-all duration-500 relative group/module`}>
                  
                  {/* Cabecera del Módulo */}
                  <div className="p-6 md:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 border-b border-white/[0.05] relative z-10">
                    
                    {/* Glow completion */}
                    {isCompleted && <div className={`absolute top-1/2 right-0 w-64 h-64 -translate-y-1/2 bg-gradient-to-r ${module.color} opacity-5 rounded-full blur-[80px] pointer-events-none`}></div>}

                    <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${module.color} flex items-center justify-center text-white shrink-0 shadow-lg ${module.locked ? '' : module.shadow}`}>
                      <module.icon size={36} strokeWidth={2} />
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4">
                        <h3 className="text-2xl font-black text-white tracking-tight leading-none">{module.title}</h3>
                        {module.locked ? (
                          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 shrink-0">
                            <Lock size={18} className="text-slate-500" strokeWidth={2.5} />
                          </div>
                        ) : (
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest shrink-0 ${isCompleted ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'text-slate-300 bg-white/5 border-white/10'}`}>
                            {currentProgress}% Listo
                          </span>
                        )}
                      </div>
                      <p className="text-base text-slate-400 font-medium max-w-3xl leading-relaxed mb-6">{module.desc}</p>
                      
                      {!module.locked && (
                        <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000 relative`} style={{ width: `${currentProgress}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white/40"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lista de Lecciones interna (Lógica de Bloqueo Secuencial) */}
                  {!module.locked && (
                    <div className="bg-[#030712]/40">
                      {module.lessons.map((lesson: any, idx: number) => {
                        const isUnlocked = lesson.status === 'completed' || lesson.status === 'active';

                        return (
                          <div key={lesson.id} className="border-b border-white/[0.02] last:border-b-0">
                            {isUnlocked ? (
                              <Link 
                                href={`/dashboard/chess/practice?lessonId=${lesson.id}`} 
                                className="flex items-center justify-between p-5 md:px-10 hover:bg-white/[0.04] transition-colors group/lesson"
                              >
                                <div className="flex items-center gap-5">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border transition-all duration-500 ${lesson.status === 'completed' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] group-hover/lesson:border-indigo-400 group-hover/lesson:text-indigo-300'}`}>
                                    {lesson.status === 'completed' ? <Shield size={16} fill="currentColor"/> : idx + 1}
                                  </div>
                                  <span className={`font-bold text-base transition-colors ${lesson.status === 'completed' ? 'text-slate-500' : 'text-slate-300 group-hover/lesson:text-white'}`}>
                                    {lesson.title}
                                  </span>
                                </div>
                                
                                {lesson.status === 'completed' ? (
                                  <div className="flex gap-1.5 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10">
                                    {[1, 2, 3].map((star) => (
                                      <Star key={star} size={12} className="text-amber-500/90" fill="currentColor"/>
                                    ))}
                                  </div>
                                ) : (
                                  <button className="text-[11px] font-black text-indigo-300 flex items-center gap-2 group-hover/lesson:translate-x-1 transition-transform bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/20 tracking-widest uppercase">
                                    INICIAR <ChevronRight size={14} strokeWidth={2.5} />
                                  </button>
                                )}
                              </Link>
                            ) : (
                              // RENDERIZADO CUANDO LA LECCIÓN ESTÁ BLOQUEADA
                              <div className="flex items-center justify-between p-5 md:px-10 bg-[#030712]/60 opacity-60 grayscale-[30%] select-none cursor-not-allowed">
                                <div className="flex items-center gap-5">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border bg-white/5 border-white/5 text-slate-600">
                                    {idx + 1}
                                  </div>
                                  <span className="font-bold text-base text-slate-600">
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                  <Lock size={14} className="text-slate-600" />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}