'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CustomChessboard from '@/components/chess/CustomChessboard';
import { Chess } from 'chess.js';
import { 
  Trophy, 
  RotateCcw, 
  ChevronLeft, 
  Brain, 
  History,
  Zap,
  Target,
  Swords
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChessVsAIPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [game, setGame] = useState(new Chess());
  const [openingName, setOpeningName] = useState('Estándar');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Su turno');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('manager'); // principiante, manager, ceo

  // 🧠 MOTOR DE ANÁLISIS COGNITIVO EN TIEMPO REAL (Real-time decision analytics)
  const cognitiveMetrics = useMemo(() => {
    const playerMoves = moveHistory.filter((_, idx) => idx % 2 === 0);
    const totalMoves = playerMoves.length;

    if (totalMoves === 0) {
      return {
        accuracy: 0,
        control: 0,
        style: 'Analizando Apertura...',
        desc: 'Realiza tu primer movimiento para iniciar el análisis cognitivo táctico y posicional en tiempo real.'
      };
    }

    // --- CÁLCULO DE PRECISIÓN TÁCTICA ---
    let accuracyScore = 85;
    const captures = playerMoves.filter(m => m.includes('x')).length;
    const checks = playerMoves.filter(m => m.includes('+') || m.includes('#')).length;
    const castles = playerMoves.filter(m => m.includes('O-O') || m.includes('O-O-O')).length;
    const majorPieces = playerMoves.filter(m => /^[QR]/.test(m)).length;
    const minorPieces = playerMoves.filter(m => /^[NB]/.test(m)).length;
    const pawnMoves = playerMoves.filter(m => /^[a-h]/.test(m)).length;

    if (castles > 0) accuracyScore += 5;
    if (totalMoves > 6 && (pawnMoves / totalMoves) > 0.6) {
      accuracyScore -= 10;
    }
    accuracyScore += (checks * 3);

    if (difficulty === 'manager') {
      accuracyScore -= (totalMoves * 0.4);
    } else if (difficulty === 'ceo') {
      accuracyScore -= (totalMoves * 0.8);
    } else {
      accuracyScore += (totalMoves * 0.2);
    }

    accuracyScore = Math.max(35, Math.min(98, Math.round(accuracyScore)));

    // --- CÁLCULO DE CONTROL DE POSICIÓN ---
    let controlScore = 50;
    if (castles > 0) controlScore += 15;
    const developmentRatio = totalMoves > 0 ? (minorPieces / totalMoves) : 0;
    controlScore += Math.round(developmentRatio * 20);
    controlScore += (captures * 2);

    const earlyQueenMoves = playerMoves.slice(0, 5).filter(m => m.startsWith('Q')).length;
    if (earlyQueenMoves > 1) {
      controlScore -= 15;
    }

    controlScore = Math.max(20, Math.min(95, Math.round(controlScore)));

    // --- DETERMINACIÓN DEL ESTILO DE JUEGO ---
    let style = 'Equilibrado';
    let desc = 'Tu juego muestra un excelente balance entre el control posicional y la iniciativa táctica.';

    if (totalMoves < 3) {
      style = 'Apertura Teórica';
      desc = 'Estás estableciendo tu estructura de peones inicial y desarrollando tus primeras piezas.';
    } else if (checks > 0 || captures > (0.4 * totalMoves)) {
      style = 'Agresivo - Táctico';
      desc = 'Buscas activamente amenazas tácticas, intercambios dinámicos y jaques constantes al rey rival.';
    } else if (castles > 0 && minorPieces > (0.4 * totalMoves)) {
      style = 'Sólido - Posicional';
      desc = 'Priorizas la seguridad del rey, la estructura sólida de peones y la armonía de tus piezas antes de atacar.';
    } else if (majorPieces > (0.3 * totalMoves)) {
      style = 'Dinámico - Ofensivo';
      desc = 'Utilizas tus piezas mayores pesadas para presionar líneas abiertas e infiltrar el campo enemigo.';
    } else if (pawnMoves > (0.5 * totalMoves)) {
      style = 'Estratégico de Peones';
      desc = 'Te enfocas en el control de casillas clave mediante cadenas de peones, controlando el espacio lentamente.';
    }

    return {
      accuracy: accuracyScore,
      control: controlScore,
      style,
      desc
    };
  }, [moveHistory, difficulty]);

  // 💾 RETOMAR PARTIDA GUARDADA
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [pendingFen, setPendingFen] = useState<string | null>(null);
  const [pendingDiff, setPendingDiff] = useState<string | null>(null);

  // Cargar partida al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFen = localStorage.getItem('onix_chess_fen');
      const savedDiff = localStorage.getItem('onix_chess_difficulty');
      if (savedFen) {
        setPendingFen(savedFen);
        if (savedDiff) setDifficulty(savedDiff);
        setShowResumePrompt(true);
      } else {
        startNewGameWithAI();
      }
    }
  }, []);

  async function startNewGameWithAI() {
    setIsLoading(true);
    setStatus('Cargando Apertura Magistral...');
    try {
      const { token } = useAuthStore.getState();
      const safeToken = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8020'}/api/v1/chess/ai-opening`, {
        headers: { Authorization: safeToken }
      });
      if (res.ok) {
        const data = await res.json();
        setGame(new Chess(data.fen));
        setOpeningName(data.name);
      } else {
        setGame(new Chess());
        setOpeningName('Clásica');
      }
    } catch (e) {
      setGame(new Chess());
      setOpeningName('Clásica');
    } finally {
      setMoveHistory([]);
      setIsGameOver(false);
      setWinner(null);
      setStatus('Su turno');
      localStorage.removeItem('onix_chess_fen');
      setIsLoading(false);
    }
  }

  function makeAMove(move: any) {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(move);
      setGame(gameCopy);
      setMoveHistory(gameCopy.history());
      
      // Auto-guardar posición FEN actual
      localStorage.setItem('onix_chess_fen', gameCopy.fen());
      localStorage.setItem('onix_chess_difficulty', difficulty);
      
      return result;
    } catch (e) {
      return null;
    }
  }

  async function onDrop(sourceSquare: string, targetSquare: string) {
    if (isGameOver || isLoading) return false;

    // Crear clon local sincrónico basado en el FEN actual
    const gameCopy = new Chess(game.fen());
    let move = null;
    try {
      move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', 
      });
    } catch (e) {
      return false;
    }

    if (move === null) return false;

    // Actualizar inmediatamente el estado del usuario en el frontend
    setGame(gameCopy);
    setMoveHistory(gameCopy.history());
    
    // Auto-guardar posición FEN actual del movimiento del usuario
    localStorage.setItem('onix_chess_fen', gameCopy.fen());
    localStorage.setItem('onix_chess_difficulty', difficulty);

    setIsLoading(true);
    setStatus('OnixAI pensando...');

    // Capturamos el FEN exacto del movimiento del usuario para evitar cierres stale
    const userMoveFen = gameCopy.fen();

    try {
      const response = await apiClient.post('/chess/engine-move', {
        fen: userMoveFen,
        difficulty: difficulty
      });

      if (response.data.move_uci) {
        // Clonar el tablero después del movimiento del usuario para aplicar la jugada de la IA
        const aiGameCopy = new Chess(userMoveFen);
        aiGameCopy.move(response.data.move_uci);
        setGame(aiGameCopy);
        setMoveHistory(aiGameCopy.history());
        
        // Auto-guardar posición FEN actual después de la respuesta de la IA
        localStorage.setItem('onix_chess_fen', aiGameCopy.fen());
        localStorage.setItem('onix_chess_difficulty', difficulty);
        
        if (response.data.game_over) {
          setIsGameOver(true);
          const winVal = response.data.result === '1-0' ? 'Blancas' : response.data.result === '0-1' ? 'Negras' : 'Tablas';
          setWinner(winVal);
          setStatus('Partida Terminada');
          localStorage.removeItem('onix_chess_fen');
          
          if (winVal === 'Blancas') {
            localStorage.setItem('onix_chess_won_first', 'true');
            if (difficulty === 'manager') localStorage.setItem('onix_chess_won_manager', 'true');
            if (difficulty === 'ceo') localStorage.setItem('onix_chess_won_ceo', 'true');
          }
        } else {
          setStatus('Su turno');
        }
      } else if (response.data.game_over) {
        setIsGameOver(true);
        const winVal = response.data.result === '1-0' ? 'Blancas' : response.data.result === '0-1' ? 'Negras' : 'Tablas';
        setWinner(winVal);
        setStatus('Partida Terminada');
        localStorage.removeItem('onix_chess_fen');
        
        if (winVal === 'Blancas') {
          localStorage.setItem('onix_chess_won_first', 'true');
          if (difficulty === 'manager') localStorage.setItem('onix_chess_won_manager', 'true');
          if (difficulty === 'ceo') localStorage.setItem('onix_chess_won_ceo', 'true');
        }
      }
    } catch (error) {
      console.error("Chess Error:", error);
      setStatus('Error de conexión');
    } finally {
      setIsLoading(false);
    }

    return true;
  }

  function resetGame() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onix_chess_fen');
    }
    startNewGameWithAI();
  }

  return (
    <div className="min-h-screen wood-theme-bg text-[#ecd3b5] flex flex-col rounded-none">
      <style>{`
        .wood-theme-bg {
          background-color: #130a04;
          background-image: 
            repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 160px, rgba(0,0,0,0.3) 160px, rgba(0,0,0,0.3) 162px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 90px, rgba(0,0,0,0.25) 90px, rgba(0,0,0,0.25) 92px),
            linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
        }
        .wood-panel {
          background: #25140b;
          border: 3px solid #3c1e0a;
          box-shadow: inset 0 2px 5px rgba(255,255,255,0.03), inset 0 -4px 10px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.6);
        }
        .wood-panel-light {
          background: #361d0f;
          border: 2px solid #502b16;
          box-shadow: inset 0 1px 3px rgba(255,255,255,0.03), inset 0 -2px 5px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.4);
        }
      `}</style>

      {/* Header Corporativo */}
      <nav className="h-14 border-b-2 border-[#3c1e0a] px-6 flex items-center justify-between bg-[#25140b] shadow-none z-40 text-[#ecd3b5] rounded-none">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#361d0f] hover:text-slate-900 transition-colors text-[#ecd3b5] rounded-none">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#3d200c] border border-[#502b16] flex items-center justify-center">
              <Swords size={14} className="text-[#ecd3b5]" />
            </div>
            <h1 className="font-black text-[10px] tracking-[0.2em] uppercase text-slate-900">Onix Chess <span className="text-amber-400 font-bold">Cognitive Lab</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 px-6 border-x border-[#3c1e0a]">
            <div className="text-center">
              <p className="text-[8px] text-amber-200/50 font-black uppercase tracking-widest leading-none mb-1">Apertura Magistral</p>
              <p className="text-[10px] font-black uppercase text-amber-400 truncate max-w-[200px]">{openingName}</p>
            </div>
            <div className="text-center border-l border-[#3c1e0a] pl-6">
              <p className="text-[8px] text-amber-200/50 font-black uppercase tracking-widest leading-none mb-1">Status</p>
              <p className={`text-[10px] font-black uppercase ${isLoading ? 'text-amber-400 animate-pulse' : 'text-slate-900'}`}>{status}</p>
            </div>
          </div>
          <button onClick={resetGame} className="flex items-center gap-2 px-4 py-1.5 bg-[#ecd3b5] text-[#1e130c] text-[9px] font-black uppercase tracking-widest hover:bg-[#fbf8f0] transition-all active:scale-95 rounded-none">
            <RotateCcw size={12} /> New Game
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col lg:flex-row gap-8">
        
        {/* Lado Izquierdo: El Tablero */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-[550px] aspect-square shadow-2xl shadow-black/80 rounded-none">
            <CustomChessboard 
              fen={game.fen()} 
              onDrop={({ sourceSquare, targetSquare }) => onDrop(sourceSquare, targetSquare)}
              disabled={isGameOver || isLoading}
            />
          </div>
          
          <div className="w-full max-w-[550px] flex items-center justify-between wood-panel-light p-4 shadow-none rounded-none">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#25140b] border border-[#3c1e0a] flex items-center justify-center text-amber-400 rounded-none">
                   <Target size={18} />
                </div>
                <div>
                   <p className="text-[8px] text-amber-200/60 font-black uppercase tracking-widest">Nivel Ejecutivo</p>
                   <div className="flex gap-2 mt-1">
                      {['principiante', 'manager', 'ceo', 'titanium'].map((lvl) => (
                        <button 
                          key={lvl}
                          onClick={() => setDifficulty(lvl)}
                          className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-all rounded-none ${difficulty === lvl ? 'bg-[#ecd3b5] text-[#1e130c]' : 'bg-[#25140b] text-[#ecd3b5]/60 border border-[#3c1e0a] hover:bg-[#361d0f]'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
             
             {/* ELO dinámico y Barra de Nivel */}
             <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-24 bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden">
                      <div className={`h-full bg-[#ecd3b5] transition-all duration-500 ${difficulty === 'principiante' ? 'w-1/4' : difficulty === 'manager' ? 'w-2/4' : difficulty === 'ceo' ? 'w-3/4' : 'w-full !bg-purple-500'}`}></div>
                   </div>
                   <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest">{difficulty === 'principiante' ? 'Lvl 1' : difficulty === 'manager' ? 'Lvl 5' : difficulty === 'ceo' ? 'Lvl 10' : 'Lvl 5000'}</span>
                </div>
                <p className="text-[9px] text-amber-200/50 font-bold uppercase tracking-wider">
                  Tu ELO Táctico: <span className="text-slate-900 font-black">{user?.chess_tactical_elo ?? 800}</span>
                </p>
             </div>
          </div>
        </div>

        {/* Lado Derecho: Panel de Análisis y Movimientos */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          
          {/* Tarjeta de Historial */}
          <div className="flex-1 wood-panel shadow-none flex flex-col overflow-hidden rounded-none">
             <div className="p-4 border-b border-[#3c1e0a] bg-[#1a0d04] flex items-center justify-between text-[#ecd3b5]">
                <div className="flex items-center gap-2">
                   <History size={16} className="text-amber-400" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">Move History</h3>
                </div>
                <span className="text-[10px] font-black text-amber-200/60">{Math.ceil(moveHistory.length / 2)} Rounds</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#130a04]">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                   {moveHistory.reduce((acc: any[], move, i) => {
                      if (i % 2 === 0) acc.push([move]);
                      else acc[acc.length - 1].push(move);
                      return acc;
                   }, []).map((pair, i) => (
                      <React.Fragment key={i}>
                         <div className="flex items-center gap-3 py-1.5 border-b border-[#3c1e0a]/30">
                            <span className="text-[10px] font-black text-[#D4AF37]/60 w-4">{i + 1}.</span>
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{pair[0]}</span>
                         </div>
                         <div className="flex items-center gap-3 py-1.5 border-b border-[#3c1e0a]/30">
                            {pair[1] && <span className="text-[11px] font-black text-[#ecd3b5]/80 uppercase tracking-tight">{pair[1]}</span>}
                         </div>
                      </React.Fragment>
                   ))}
                </div>
             </div>
          </div>

           {/* Tarjeta de Métricas Cognitivas */}
           <div className="wood-panel p-6 shadow-none relative overflow-hidden rounded-none">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-400">
                 <Brain size={80} />
               </div>
               <div className="relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-amber-400">Cognitive Analysis</h3>
                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between items-end mb-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-amber-200/60">Tactical Accuracy</p>
                          <p className="text-xs font-black text-[#ecd3b5]">{cognitiveMetrics.accuracy}%</p>
                       </div>
                       <div className="h-1 bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden">
                          <div className="h-full bg-[#D4AF37]/100 transition-all duration-500" style={{ width: `${cognitiveMetrics.accuracy}%` }}></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between items-end mb-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-amber-200/60">Position Control</p>
                          <p className="text-xs font-black text-[#ecd3b5]">{cognitiveMetrics.control}%</p>
                       </div>
                       <div className="h-1 bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden">
                          <div className="h-full bg-[#D4AF37]/20 transition-all duration-500" style={{ width: `${cognitiveMetrics.control}%` }}></div>
                       </div>
                    </div>
                 </div>
                 <div className="mt-6 flex items-center gap-3 p-3 bg-[#130a04] border border-[#3c1e0a] rounded-none">
                    <Zap size={14} className="text-[#D4AF37] flex-shrink-0" />
                    <p className="text-[9px] font-bold text-slate-300 leading-tight">Tu estilo de juego es <span className="text-[#ecd3b5] font-bold">{cognitiveMetrics.style}</span>. {cognitiveMetrics.desc}</p>
                 </div>
              </div>
           </div>

        </div>

      </main>

      {/* Modal de Fin de Juego */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#130a04]/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#25140b] border-2 border-[#3c1e0a] max-w-sm w-full p-10 text-center shadow-2xl rounded-none text-[#ecd3b5]"
            >
              <div className="w-16 h-16 bg-[#130a04] border border-[#3c1e0a] text-amber-400 flex items-center justify-center mx-auto mb-6 rounded-none">
                <Trophy size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">¡Jaque Mate!</h2>
              <p className="text-xs text-amber-200/60 font-bold uppercase tracking-widest mb-8">Ganador: <span className="text-slate-900">{winner}</span></p>
              <div className="space-y-3">
                <button 
                  onClick={resetGame}
                  className="w-full py-3 bg-[#ecd3b5] text-[#1e130c] font-black uppercase tracking-widest text-[10px] hover:bg-[#fbf8f0] transition-all rounded-none"
                >
                  Nuevo Juego
                </button>
                <button 
                  onClick={() => router.back()}
                  className="w-full py-3 border border-[#502b16] bg-[#361d0f] text-[#ecd3b5] font-black uppercase tracking-widest text-[10px] hover:bg-[#462614] transition-all rounded-none"
                >
                  Volver al Menú
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showResumePrompt && pendingFen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#130a04]/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#25140b] border-2 border-[#3c1e0a] max-w-sm w-full p-10 text-center shadow-2xl border-t-4 border-[#D4AF37]/30 rounded-none text-[#ecd3b5]"
            >
              <div className="w-16 h-16 bg-[#130a04] border border-[#3c1e0a] text-amber-400 flex items-center justify-center mx-auto mb-6 rounded-none">
                <Brain size={32} className="animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Partida Detectada ♟️</h2>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                Hemos encontrado una partida de ajedrez guardada con dificultad <span className="text-slate-900 font-black">{pendingDiff || 'manager'}</span>. ¿Quieres reanudar tu juego o comenzar uno nuevo?
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const loadedGame = new Chess(pendingFen);
                    setGame(loadedGame);
                    setMoveHistory(loadedGame.history());
                    if (pendingDiff) setDifficulty(pendingDiff);
                    setShowResumePrompt(false);
                  }}
                  className="w-full py-3 bg-[#ecd3b5] text-[#1e130c] font-black uppercase tracking-widest text-[10px] hover:bg-[#fbf8f0] transition-all rounded-none"
                >
                  Sí, Reanudar Partida
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('onix_chess_fen');
                    resetGame();
                    setShowResumePrompt(false);
                  }}
                  className="w-full py-3 border border-[#502b16] bg-[#361d0f] text-[#ecd3b5] font-black uppercase tracking-widest text-[10px] hover:bg-[#462614] transition-all rounded-none"
                >
                  No, Iniciar de Cero
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
