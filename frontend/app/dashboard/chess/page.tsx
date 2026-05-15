'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { 
  Trophy, 
  RotateCcw, 
  ChevronLeft, 
  Brain, 
  Activity, 
  History,
  Zap,
  Target,
  Swords,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChessPage() {
  const router = useRouter();
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Su turno');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('manager'); // principiante, manager, ceo

  function makeAMove(move: any) {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(move);
      setGame(gameCopy);
      setMoveHistory(gameCopy.history());
      return result;
    } catch (e) {
      return null;
    }
  }

  async function onDrop(sourceSquare: string, targetSquare: string) {
    if (isGameOver || isLoading) return false;

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', 
    });

    if (move === null) return false;

    setIsLoading(true);
    setStatus('OnixAI pensando...');

    try {
      const response = await apiClient.post('/chess/engine-move', {
        fen: game.fen(),
        difficulty: difficulty
      });

      if (response.data.move_uci) {
        const gameCopy = new Chess(game.fen());
        gameCopy.move(response.data.move_uci);
        setGame(gameCopy);
        setMoveHistory(gameCopy.history());
        
        if (response.data.game_over) {
          setIsGameOver(true);
          setWinner(response.data.result === '1-0' ? 'Blancas' : response.data.result === '0-1' ? 'Negras' : 'Tablas');
          setStatus('Partida Terminada');
        } else {
          setStatus('Su turno');
        }
      } else if (response.data.game_over) {
        setIsGameOver(true);
        setWinner(response.data.result === '1-0' ? 'Blancas' : response.data.result === '0-1' ? 'Negras' : 'Tablas');
        setStatus('Partida Terminada');
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
    setGame(new Chess());
    setMoveHistory([]);
    setIsGameOver(false);
    setWinner(null);
    setStatus('Su turno');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header Corporativo */}
      <nav className="h-14 border-b border-slate-200 px-6 flex items-center justify-between bg-white shadow-sm z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 flex items-center justify-center">
              <Swords size={14} className="text-white" />
            </div>
            <h1 className="font-black text-[10px] tracking-[0.2em] uppercase">Onix Chess <span className="text-slate-400 font-bold">Cognitive Lab</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 px-6 border-x border-slate-100">
            <div className="text-center">
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Status</p>
              <p className={`text-[10px] font-black uppercase ${isLoading ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>{status}</p>
            </div>
          </div>
          <button onClick={resetGame} className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
            <RotateCcw size={12} /> New Game
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col lg:flex-row gap-8 overflow-hidden">
        
        {/* Lado Izquierdo: El Tablero */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-[550px] aspect-square shadow-2xl shadow-slate-300 border-8 border-white">
            <Chessboard 
              position={game.fen()} 
              onPieceDrop={onDrop}
              boardOrientation="white"
              customDarkSquareStyle={{ backgroundColor: '#1e293b' }}
              customLightSquareStyle={{ backgroundColor: '#f1f5f9' }}
            />
          </div>
          
          <div className="w-full max-w-[550px] flex items-center justify-between bg-white border border-slate-200 p-4 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-400">
                   <Target size={18} />
                </div>
                <div>
                   <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Nivel Ejecutivo</p>
                   <div className="flex gap-2 mt-1">
                      {['principiante', 'manager', 'ceo'].map((lvl) => (
                        <button 
                          key={lvl}
                          onClick={() => setDifficulty(lvl)}
                          className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-all ${difficulty === lvl ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full bg-slate-900 transition-all duration-500 ${difficulty === 'principiante' ? 'w-1/3' : difficulty === 'manager' ? 'w-2/3' : 'w-full'}`}></div>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{difficulty === 'principiante' ? 'Lvl 1' : difficulty === 'manager' ? 'Lvl 5' : 'Lvl 10'}</span>
             </div>
          </div>
        </div>

        {/* Lado Derecho: Panel de Análisis y Movimientos */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          
          {/* Tarjeta de Historial */}
          <div className="flex-1 bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <History size={16} className="text-slate-400" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">Move History</h3>
                </div>
                <span className="text-[10px] font-black text-slate-400">{Math.ceil(moveHistory.length / 2)} Rounds</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                   {moveHistory.reduce((acc: any[], move, i) => {
                      if (i % 2 === 0) acc.push([move]);
                      else acc[acc.length - 1].push(move);
                      return acc;
                   }, []).map((pair, i) => (
                      <React.Fragment key={i}>
                         <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-300 w-4">{i + 1}.</span>
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{pair[0]}</span>
                         </div>
                         <div className="flex items-center gap-3 py-1.5 border-b border-slate-50">
                            {pair[1] && <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{pair[1]}</span>}
                         </div>
                      </React.Fragment>
                   ))}
                </div>
             </div>
          </div>

          {/* Tarjeta de Métricas Cognitivas */}
          <div className="bg-slate-900 text-white p-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={80} />
             </div>
             <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-amber-500">Cognitive Analysis</h3>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between items-end mb-1">
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tactical Accuracy</p>
                         <p className="text-xs font-black">84%</p>
                      </div>
                      <div className="h-1 bg-slate-800">
                         <div className="h-full bg-emerald-500 w-[84%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-end mb-1">
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Position Control</p>
                         <p className="text-xs font-black">62%</p>
                      </div>
                      <div className="h-1 bg-slate-800">
                         <div className="h-full bg-blue-500 w-[62%]"></div>
                      </div>
                   </div>
                </div>
                <div className="mt-6 flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                   <Zap size={14} className="text-amber-500" />
                   <p className="text-[9px] font-bold text-slate-400 leading-tight">Tu estilo de juego es <span className="text-white">Agresivo - Táctico</span>. Estás mejorando tu capacidad de respuesta bajo presión.</p>
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
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-sm w-full p-10 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-slate-950 text-amber-500 flex items-center justify-center mx-auto mb-6">
                <Trophy size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Checkmate!</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Ganador: <span className="text-slate-900">{winner}</span></p>
              <div className="space-y-3">
                <button 
                  onClick={resetGame}
                  className="w-full py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all"
                >
                  New Match
                </button>
                <button 
                  onClick={() => router.back()}
                  className="w-full py-3 border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}