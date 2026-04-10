'use client';

import { useState, useEffect } from 'react';
import { Chess, type Square } from 'chess.js';
import { RefreshCw, Lightbulb, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import CustomChessboard from './CustomChessboard';

// 🚀 FEN REAL DE MATE EN 1 (Mate del pasillo)
const LESSON_FEN = "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1"; 
const SOLUTION_MOVE = "Re8#"; // La Torre sube a e8 y es Jaque Mate

export default function ChessTrainer() {
  const [game, setGame] = useState(new Chess(LESSON_FEN));
  const [fen, setFen] = useState(LESSON_FEN);
  const [status, setStatus] = useState("Tu turno: Juegan Blancas");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function onDrop({ sourceSquare, targetSquare }: { sourceSquare: Square; targetSquare: Square }) {
    if (isCompleted) return;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare, 
        promotion: 'q', 
      });

      if (!move) return; 

      // 1. ACTUALIZAMOS EL TABLERO VISUALMENTE SIEMPRE (Para que veas que el clic funcionó)
      setFen(gameCopy.fen());

      // 2. VERIFICAMOS SI ES LA SOLUCIÓN
      if (move.san === SOLUTION_MOVE || (gameCopy.isCheckmate() && SOLUTION_MOVE.includes('#'))) {
        setGame(gameCopy);
        handleSuccess();
      } else {
        // 3. SI ES INCORRECTO: Mostramos error y regresamos la pieza después de 1 segundo
        setStatus("❌ Movimiento válido, pero no es la solución.");
        
        setTimeout(() => {
          setFen(game.fen()); // Regresa al FEN original guardado
          setStatus("Tu turno: Juegan Blancas");
        }, 1200); // 1.2 segundos de feedback visual
      }
    } catch (error) {
      setFen(game.fen()); 
    }
  }

  const handleSuccess = async () => {
    setStatus("¡Jaque Mate! Excelente 🎉");
    setIsCompleted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';
      await fetch(`${API_URL}/api/v1/chess/progress`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache' 
        },
        cache: 'no-store', 
        body: JSON.stringify({ lesson_id: "mod1-les1", status: "completed" })
      });
    } catch (error) {
      console.error("Error guardando progreso:", error);
    }
  };

  const resetGame = () => {
    const newGame = new Chess(LESSON_FEN);
    setGame(newGame);
    setFen(newGame.fen());
    setStatus("Tu turno: Juegan Blancas");
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto bg-slate-900/50 p-6 rounded-[2rem] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-6">
        <h3 className="font-black text-white text-xl flex items-center gap-2">
          ♟️ Táctica Diaria
        </h3>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
          {isCompleted ? 'Completado' : 'En progreso'}
        </span>
      </div>

      {/* Tablero Personalizado */}
      <div className="w-full aspect-square mb-6">
        {isMounted ? (
          <CustomChessboard 
            fen={fen} 
            onDrop={onDrop}
            disabled={isCompleted}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-lg">
            <Loader2 className="animate-spin text-slate-500" size={48} />
          </div>
        )}
      </div>

      {/* Controles y Status */}
      <div className="w-full space-y-4">
        <div className={`p-4 rounded-xl text-center font-bold text-sm transition-colors border ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : status.includes('❌') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800/50 text-slate-300 border-slate-700/50'}`}>
          {status}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={resetGame}
            className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-slate-600/50"
          >
            <RefreshCw size={18} /> Reiniciar
          </button>
          {!isCompleted && (
            <button className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/25 border border-indigo-400/20">
              <Lightbulb size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
