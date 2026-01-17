'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// ✅ IMPORTACIÓN CORREGIDA: Importamos 'Square' explícitamente
import { Chess, type Square } from 'chess.js'; 
import { Chessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';
import Cookies from 'js-cookie'; 
import { 
  ArrowLeft, Trophy, Timer, RefreshCw, 
  Cpu, History, Zap, Shield, Crown, User, 
  Flame, BarChart3, HelpCircle, X, Volume2, VolumeX
} from 'lucide-react';

// --- CONFIGURACIÓN DE IA ---
type GameStatus = 'playing' | 'checkmate' | 'draw' | 'timeout';
type Difficulty = 'easy' | 'medium' | 'hard' | 'grandmaster';

const AI_LEVELS = {
  easy: { name: 'Novato', elo: 600, thinkTime: 500, color: 'text-green-400', border: 'border-green-500/50', desc: 'Ideal para aprender.' },
  medium: { name: 'Intermedio', elo: 1200, thinkTime: 1000, color: 'text-blue-400', border: 'border-blue-500/50', desc: 'Desafío equilibrado.' },
  hard: { name: 'Experto', elo: 1800, thinkTime: 2000, color: 'text-purple-400', border: 'border-purple-500/50', desc: 'Castiga errores.' },
  grandmaster: { name: 'Titanium AI', elo: 3000, thinkTime: 3000, color: 'text-rose-400', border: 'border-rose-500/50', desc: 'Motor neuronal.' }
};

export default function ChessPage() {
  // --- ESTADOS JUEGO ---
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState<GameStatus>('playing');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [history, setHistory] = useState<string[]>([]);
  
  // --- ESTADOS VISUALES/INTERACTIVOS ---
  // ✅ CORRECCIÓN: 'moveFrom' ahora acepta 'Square' o null, no string vacío
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // --- ESTADOS DE DATOS ---
  const [userData, setUserData] = useState({ name: 'Estudiante', xp: 0, level: 1 });
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Truco para evitar error de tipos en JSX si la librería molesta
  const SafeChessboard = Chessboard as any;

  // --- SONIDOS ---
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);
  const checkSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializa tus audios aquí si los tienes
  }, []);

  // 1. CARGA DE DATOS
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('access_token');
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/v1/progress/stats`, {
           headers: { 'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           setUserData({
             name: data.username || 'Estudiante',
             xp: data.total_xp,
             level: Math.floor(data.total_xp / 1000) + 1
           });
        }
      } catch (e) { console.error(e); }
    };
    fetchUserData();
  }, []);

  // 2. RELOJ
  useEffect(() => {
    if (status !== 'playing') return;
    const timer = setInterval(() => {
      if (game.turn() === 'w') setWhiteTime(p => (p <= 0 ? 0 : p - 1));
      else setBlackTime(p => (p <= 0 ? 0 : p - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [game, status]);

  // 3. LÓGICA DE MOVIMIENTO SEGURA
  function safeGameMutate(modify: (g: Chess) => void) {
    setGame((g) => {
      const update = new Chess(g.fen()); 
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    safeGameMutate((gameCopy) => {
      const possibleMoves = gameCopy.moves();
      if (gameCopy.isGameOver() || gameCopy.isDraw() || possibleMoves.length === 0) return;
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      gameCopy.move(possibleMoves[randomIndex]);
      
      setHistory(gameCopy.history());
      setIsAiThinking(false);
      if (gameCopy.isGameOver()) handleGameOver(gameCopy);
    });
  }

  // ✅ CORRECCIÓN: Tipado explícito de sourceSquare y targetSquare
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (status !== 'playing' || isAiThinking || game.turn() !== 'w') return false;

    let move = null;
    safeGameMutate((gameCopy) => {
      try {
        move = gameCopy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        });
        
        if (move) {
           setHistory(gameCopy.history());
           setOptionSquares({}); 
        }
      } catch (e) { move = null; }
    });

    if (move) {
        if (game.isGameOver()) {
            handleGameOver(game);
        } else {
            setIsAiThinking(true);
            setTimeout(makeRandomMove, AI_LEVELS[difficulty].thinkTime);
        }
        return true;
    }
    return false;
  }

  // 4. VISUALES: DÓNDE MOVER
  // ✅ CORRECCIÓN: El parámetro square es de tipo Square
  function getMoveOptions(square: Square) {
    // Ahora TS sabe que 'square' es válido para game.moves()
    const moves = game.moves({ square, verbose: true });
    
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newSquares: any = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to as Square) && game.get(move.to as Square).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(255,0,0,.5) 25%, transparent 25%)' 
            : 'radial-gradient(circle, rgba(99,102,241,.5) 25%, transparent 25%)',
        borderRadius: '50%',
      };
      return move;
    });
    newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' }; 
    setOptionSquares(newSquares);
  }

  // ✅ CORRECCIÓN: El parámetro es Square
  function onSquareClick(square: Square) {
    if(status !== 'playing' || isAiThinking) return;

    setRightClickedSquares({});

    // Si ya seleccionaste una pieza y haces click en destino
    if (moveFrom) {
       // Intentamos mover desde 'moveFrom' (que es Square) a 'square' (que es Square)
       const moveResult = onDrop(moveFrom, square);
       setMoveFrom(null); // Reseteamos a null
       setOptionSquares({});
       if(moveResult) return; 
    }

    setMoveFrom(square);
    getMoveOptions(square);
  }

  const handleGameOver = (finalGame: Chess) => {
    if (finalGame.isCheckmate()) {
      setStatus('checkmate');
      if (finalGame.turn() === 'b') { 
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        setUserData(prev => ({ ...prev, xp: prev.xp + 50 })); 
      }
    } else {
      setStatus('draw');
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setHistory([]);
    setStatus('playing');
    setWhiteTime(600);
    setBlackTime(600);
    setIsAiThinking(false);
    setOptionSquares({});
    setMoveFrom(null);
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans p-4 md:p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <Link href="/dashboard" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-bold tracking-tight">Salir</span>
        </Link>
        <div className="flex items-center gap-4">
             <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-full ${soundEnabled ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}
             >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
             </button>
            <span className="hidden md:block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold animate-pulse">
                ● Servidor Activo
            </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* IZQUIERDA: JUGADOR */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-[#131B2C] p-6 rounded-2xl border border-slate-800/60 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-500/20">
                    {userData.name.substring(0,2).toUpperCase()}
                 </div>
                 <div>
                    <h3 className="font-bold text-white text-lg">{userData.name}</h3>
                    <div className="flex items-center gap-2">
                        <Shield size={12} className="text-indigo-400"/>
                        <span className="text-xs font-bold text-indigo-400 tracking-wider">ESTUDIANTE PRO</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400">Nivel {userData.level}</span>
                        <span className="text-white">{userData.xp} XP</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${(userData.xp % 1000) / 10}%` }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-1">
                            <Flame size={12} className="text-orange-500" /> Racha Semanal
                        </h4>
                        <span className="text-xs font-bold text-orange-400">5 Días</span>
                    </div>
                    <div className="flex justify-between gap-1">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                            <div key={idx} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${idx < 5 ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>{day}</div>
                        ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTRO: TABLERO INTERACTIVO */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col">
          
          {/* Tarjeta IA */}
          <div className={`flex items-center justify-between mb-4 bg-[#131B2C] p-4 rounded-2xl border ${AI_LEVELS[difficulty].border} shadow-lg transition-all duration-500`}>
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800 border border-slate-700 ${isAiThinking ? 'animate-bounce' : ''}`}>
                   <Cpu size={24} className={AI_LEVELS[difficulty].color} />
                </div>
                <div>
                   <h4 className={`font-bold ${AI_LEVELS[difficulty].color}`}>{AI_LEVELS[difficulty].name}</h4>
                   <div className="flex items-center gap-2">
                       <span className={`relative inline-flex rounded-full h-2 w-2 ${isAiThinking ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                       <p className="text-[10px] text-slate-400 font-mono tracking-wider">{isAiThinking ? 'PENSANDO...' : 'EN ESPERA'}</p>
                   </div>
                </div>
             </div>
             <div className={`px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 font-mono font-bold text-xl shadow-inner ${game.turn() === 'b' ? 'text-white ring-2 ring-indigo-500/50' : 'text-slate-500'}`}>
                {formatTime(blackTime)}
             </div>
          </div>

          {/* TABLERO */}
          <div className="relative group select-none"> 
              <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-purple-600/20 rounded-xl blur-lg opacity-50"></div>
              
              <div className="relative w-full aspect-square bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-[6px] border-[#1E293B]">
                 
                 {/* OVERLAY DE FIN DE JUEGO */}
                 {status !== 'playing' && (
                    <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-in zoom-in duration-300">
                       <Crown size={64} className="text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                       <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                         {status === 'checkmate' ? (game.turn() === 'b' ? '¡VICTORIA!' : 'DERROTA') : 'TABLAS'}
                       </h2>
                       <button onClick={resetGame} className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1">
                         Jugar Otra Vez
                       </button>
                    </div>
                 )}

                 <SafeChessboard 
                   position={game.fen()} 
                   onPieceDrop={onDrop} 
                   onSquareClick={onSquareClick}
                   customSquareStyles={{
                      ...optionSquares,
                      ...rightClickedSquares,
                   }}
                   animationDuration={200}
                   arePiecesDraggable={status === 'playing' && !isAiThinking}
                   customDarkSquareStyle={{ backgroundColor: '#334155' }}
                   customLightSquareStyle={{ backgroundColor: '#94a3b8' }}
                 />
              </div>
          </div>

          {/* Tarjeta Usuario */}
          <div className="flex items-center justify-between mt-4 bg-[#131B2C] p-4 rounded-2xl border border-slate-700 shadow-lg">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-600 shadow-lg shadow-indigo-600/30">
                   <User size={24} className="text-white" />
                </div>
                <div>
                   <h4 className="font-bold text-white">{userData.name}</h4>
                   <div className="flex items-center gap-2">
                       <span className={`h-2 w-2 rounded-full ${game.turn() === 'w' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                       <p className="text-[10px] text-indigo-300 font-mono tracking-wider">{game.turn() === 'w' ? 'TU TURNO' : 'ESPERANDO...'}</p>
                   </div>
                </div>
             </div>
             <div className={`px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 font-mono font-bold text-xl shadow-inner ${game.turn() === 'w' ? 'text-white ring-2 ring-emerald-500/50' : 'text-slate-500'}`}>
                {formatTime(whiteTime)}
             </div>
          </div>
        </div>

        {/* DERECHA: CONTROLES */}
        <div className="lg:col-span-3 space-y-6 order-3">
           {/* Selector */}
           <div className="bg-[#131B2C] p-1 rounded-2xl border border-slate-800 shadow-xl">
             <div className="p-4 border-b border-slate-800 mb-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Configurar Motor</h3>
             </div>
             <div className="space-y-1 p-2">
               {(Object.keys(AI_LEVELS) as Difficulty[]).map((level) => (
                 <button 
                   key={level}
                   onClick={() => { setDifficulty(level); resetGame(); }}
                   className={`w-full group text-left px-4 py-3 rounded-xl border transition-all duration-300 ${
                     difficulty === level ? 'bg-slate-800 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-transparent hover:bg-slate-800/50'
                   }`}
                 >
                   <div className="flex items-center justify-between mb-1">
                       <span className={`font-bold text-sm ${difficulty === level ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{AI_LEVELS[level].name}</span>
                       <div className={`w-2 h-2 rounded-full ${level === difficulty ? 'bg-indigo-500 shadow-[0_0_10px_currentColor]' : 'bg-slate-700'}`}></div>
                   </div>
                   <p className="text-[10px] text-slate-500 line-clamp-1">{AI_LEVELS[level].desc}</p>
                 </button>
               ))}
             </div>
           </div>

           {/* Historial */}
           <div className="bg-[#0F1420] rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[280px] shadow-inner">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                 <span className="text-[10px] font-mono text-slate-500">TERMINAL.PGN</span>
                 <BarChart3 size={14} className="text-slate-600"/>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs custom-scrollbar">
                {history.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                        <History size={32} className="mb-2"/>
                        <p>Esperando movimiento...</p>
                    </div>
                )}
                {history.reduce((result: any[], move, index) => {
                  if (index % 2 === 0) result.push([move]);
                  else result[result.length - 1].push(move);
                  return result;
                }, []).map((pair, i) => (
                  <div key={i} className="flex border-b border-slate-800/30 pb-1 hover:bg-white/5 transition-colors">
                    <span className="w-8 text-slate-600 text-right pr-2">{i + 1}.</span>
                    <span className="w-16 text-indigo-400 font-bold">{pair[0]}</span>
                    {pair[1] && <span className="text-emerald-400 font-bold">{pair[1]}</span>}
                  </div>
                ))}
              </div>
           </div>

           <button onClick={resetGame} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-bold transition-all flex items-center justify-center gap-2 group">
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500"/>
              Reiniciar Partida
           </button>
        </div>
      </div>
    </div>
  );
}