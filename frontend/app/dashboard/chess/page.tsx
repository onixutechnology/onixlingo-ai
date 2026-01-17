'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Trophy, Timer, RefreshCw, RotateCcw, 
  Cpu, Award, ChevronRight, History, Zap, Shield, Crown
} from 'lucide-react';

// --- TIPOS ---
type GameStatus = 'playing' | 'checkmate' | 'draw' | 'timeout';
type Difficulty = 'easy' | 'medium' | 'hard' | 'grandmaster';

// --- CONFIGURACIÓN DE IA (Simulada para demo) ---
const AI_LEVELS = {
  easy: { name: 'Novato', elo: 600, thinkTime: 500, errorRate: 0.3 },
  medium: { name: 'Intermedio', elo: 1200, thinkTime: 1000, errorRate: 0.15 },
  hard: { name: 'Experto', elo: 1800, thinkTime: 2000, errorRate: 0.05 },
  grandmaster: { name: 'Titanium AI', elo: 3000, thinkTime: 3000, errorRate: 0.0 }
};

export default function ChessPage() {
  // --- ESTADOS DEL JUEGO ---
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [status, setStatus] = useState<GameStatus>('playing');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [history, setHistory] = useState<string[]>([]);
  
  // --- ESTADOS DE UI/JUGADOR ---
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutos
  const [blackTime, setBlackTime] = useState(600);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // --- ESTADOS DE GAMIFICATION ---
  const [xp, setXp] = useState(1250);
  const [trophies, setTrophies] = useState(['First Win', 'Sharp Mind']);
  
  // Referencia para evitar errores de tipo con Chessboard
  const SafeChessboard = Chessboard as any;

  // --- EFECTO: RELOJ ---
  useEffect(() => {
    if (status !== 'playing') return;
    
    const timer = setInterval(() => {
      if (game.turn() === 'w') {
        setWhiteTime(prev => {
          if (prev <= 0) { setStatus('timeout'); return 0; }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 0) { setStatus('timeout'); return 0; }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [game, status]);

  // --- MOTOR DE IA (Lógica de versus) ---
  const makeRandomMove = () => {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return;

    // Aquí iría la conexión con Stockfish real.
    // Simulamos inteligencia eligiendo movimientos al azar pero filtrando los malos en niveles altos
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    
    try {
      game.move(possibleMoves[randomIndex]);
      setFen(game.fen());
      setHistory(game.history());
      
      // Sonido de movimiento (Placeholder)
      // new Audio('/move.mp3').play().catch(() => {}); 
      
      setIsAiThinking(false);
      
      if (game.isGameOver()) handleGameOver();
    } catch (e) {
      console.error(e);
    }
  };

  // --- HANDLERS ---
  function onDrop(sourceSquare: any, targetSquare: any) {
    if (status !== 'playing' || isAiThinking) return false;
    
    // Si juega el humano (asumiendo humano es blancas por ahora)
    if (game.turn() !== playerColor) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      setFen(game.fen());
      setHistory(game.history());
      
      if (game.isGameOver()) {
        handleGameOver();
      } else {
        // Turno de la IA
        setIsAiThinking(true);
        setTimeout(makeRandomMove, AI_LEVELS[difficulty].thinkTime);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  const handleGameOver = () => {
    if (game.isCheckmate()) {
      setStatus('checkmate');
      if (game.turn() !== playerColor) { // Ganó el humano (el turno quedó en la IA)
        confetti({ particleCount: 150, spread: 80 });
        setXp(prev => prev + 50);
      }
    } else {
      setStatus('draw');
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setHistory([]);
    setStatus('playing');
    setWhiteTime(600);
    setBlackTime(600);
    setIsAiThinking(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 lg:p-8">
      
      {/* HEADER DE NAVEGACIÓN */}
      <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
        >
          <ArrowLeft size={20} />
          <span>Dashboard</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-xs font-bold text-slate-300">Rango: <span className="text-white">Aspirante</span></span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-full border border-indigo-500/30">
            <Zap size={16} />
            <span className="text-xs font-bold">{xp} XP</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: ESTADÍSTICAS & TROFEOS (3 cols) */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          {/* Tarjeta de Nivel */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={14} /> Nivel de Maestría
            </h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-black text-white">Nvl. 12</span>
              <span className="text-xs font-bold text-indigo-400 mb-1">2,450 / 3,000 XP</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
          </div>

          {/* Trofeos */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award size={14} /> Vitrina de Trofeos
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`aspect-square rounded-xl flex items-center justify-center border ${i <= trophies.length ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-slate-800/50 border-slate-800 text-slate-700'}`}>
                   <Crown size={20} fill={i <= trophies.length ? "currentColor" : "none"} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA CENTRAL: TABLERO (6 cols) */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col">
          
          {/* Info del Oponente (IA) */}
          <div className="flex items-center justify-between mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 shadow-lg ${isAiThinking ? 'animate-pulse ring-2 ring-red-400' : ''}`}>
                   <Cpu size={24} className="text-white" />
                </div>
                <div>
                   <h4 className="font-bold text-sm text-white">{AI_LEVELS[difficulty].name}</h4>
                   <p className="text-[10px] text-slate-400 font-mono">ELO {AI_LEVELS[difficulty].elo}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Timer size={16} className={game.turn() === 'b' ? 'text-white animate-pulse' : 'text-slate-500'} />
                <span className={`font-mono font-bold text-lg ${game.turn() === 'b' ? 'text-white' : 'text-slate-500'}`}>
                  {formatTime(blackTime)}
                </span>
             </div>
          </div>

          {/* El Tablero */}
          <div className="w-full aspect-square bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700 relative">
             {status !== 'playing' && (
                <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                   <h2 className="text-4xl font-black text-white mb-2">
                     {status === 'checkmate' ? '¡JAQUE MATE!' : 'TABLAS'}
                   </h2>
                   <p className="text-slate-300 mb-6">
                     {status === 'checkmate' && game.turn() !== playerColor ? 'Has ganado la partida' : 'Buen intento'}
                   </p>
                   <button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105">
                     Jugar de Nuevo
                   </button>
                </div>
             )}
             <SafeChessboard 
               position={fen}
               onPieceDrop={onDrop}
               animationDuration={300}
               customDarkSquareStyle={{ backgroundColor: '#334155' }}
               customLightSquareStyle={{ backgroundColor: '#94a3b8' }}
             />
          </div>

          {/* Info del Jugador (Tú) */}
          <div className="flex items-center justify-between mt-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                   <span className="font-black text-white">TU</span>
                </div>
                <div>
                   <h4 className="font-bold text-sm text-white">Estudiante</h4>
                   <p className="text-[10px] text-slate-400 font-mono">ELO 800 (Prov)</p>
                </div>
             </div>
             <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Timer size={16} className={game.turn() === 'w' ? 'text-white animate-pulse' : 'text-slate-500'} />
                <span className={`font-mono font-bold text-lg ${game.turn() === 'w' ? 'text-white' : 'text-slate-500'}`}>
                  {formatTime(whiteTime)}
                </span>
             </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: CONTROLES & HISTORIAL (3 cols) */}
        <div className="lg:col-span-3 space-y-6 order-3">
           
           {/* Selector de Dificultad */}
           <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Configuración de IA</h3>
             <div className="space-y-2">
               {(Object.keys(AI_LEVELS) as Difficulty[]).map((level) => (
                 <button 
                   key={level}
                   onClick={() => { setDifficulty(level); resetGame(); }}
                   className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                     difficulty === level 
                       ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                       : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                   }`}
                 >
                   <span className="font-bold text-sm">{AI_LEVELS[level].name}</span>
                   <span className="text-[10px] font-mono opacity-70">{AI_LEVELS[level].elo}</span>
                 </button>
               ))}
             </div>
           </div>

           {/* Historial de Movimientos */}
           <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex-1 min-h-[200px]">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <History size={14} /> PGN / Historial
              </h3>
              <div className="h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {history.reduce((result: any[], move, index) => {
                  if (index % 2 === 0) result.push([move]);
                  else result[result.length - 1].push(move);
                  return result;
                }, []).map((pair, i) => (
                  <div key={i} className="flex text-sm border-b border-slate-800/50 pb-1">
                    <span className="w-8 text-slate-500 font-mono text-xs py-1">{i + 1}.</span>
                    <span className="flex-1 text-slate-300 font-medium py-1 hover:bg-slate-800 px-2 rounded cursor-pointer">{pair[0]}</span>
                    {pair[1] && (
                      <span className="flex-1 text-slate-300 font-medium py-1 hover:bg-slate-800 px-2 rounded cursor-pointer">{pair[1]}</span>
                    )}
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-slate-600 text-xs italic text-center py-10">La partida no ha comenzado.</p>
                )}
              </div>
           </div>
           
           {/* Botones de Acción */}
           <div className="grid grid-cols-2 gap-3">
              <button onClick={resetGame} className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all group">
                <RotateCcw size={20} className="text-slate-400 group-hover:text-white mb-1" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-white">Reiniciar</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all group">
                <Zap size={20} className="text-amber-500 mb-1" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-white">Pista (-5 XP)</span>
              </button>
           </div>

        </div>

      </div>
    </div>
  );
}