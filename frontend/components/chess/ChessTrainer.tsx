'use client';

import { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { RefreshCw, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

// Ejemplo de lección: "Mate en 1 con Torre"
const LESSON_FEN = "8/8/8/8/8/5k2/8/R4K2 w - - 0 1"; 
const SOLUTION_MOVE = "Ra8#"; // Torre a a8 es mate

export default function ChessTrainer() {
  const [game, setGame] = useState(new Chess(LESSON_FEN));
  const [status, setStatus] = useState("Tu turno: Juegan Blancas");
  const [isCompleted, setIsCompleted] = useState(false);

  // 👇 CORRECCIÓN AQUÍ: Usamos 'any' para evitar conflictos de tipos con la librería
  function onDrop(sourceSquare: any, targetSquare: any) {
    if (isCompleted) return false;

    try {
      const gameCopy = new Chess(game.fen());
      
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare, // ✅ Usamos 'to'
        promotion: 'q', 
      });

      if (!move) return false;

      if (move.san === SOLUTION_MOVE || (gameCopy.isCheckmate() && SOLUTION_MOVE.includes('#'))) {
        setGame(gameCopy);
        handleSuccess();
        return true;
      } else {
        setStatus("Movimiento válido, pero no es el mejor. ¡Intenta buscar el Mate!");
        return false; 
      }
    } catch (error) {
      return false;
    }
  }

  const handleSuccess = () => {
    setStatus("¡Jaque Mate! Excelente 🎉");
    setIsCompleted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const resetGame = () => {
    setGame(new Chess(LESSON_FEN));
    setStatus("Tu turno: Juegan Blancas");
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
          ♟️ Táctica Diaria
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
          {isCompleted ? 'Completado' : 'En progreso'}
        </span>
      </div>

      {/* Tablero */}
      <div className="w-full aspect-square mb-6 border-4 border-slate-800 rounded-lg overflow-hidden shadow-2xl">
        {/* El ID eliminado para evitar errores de tipo */}
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          animationDuration={200}
          customDarkSquareStyle={{ backgroundColor: '#475569' }} 
          customLightSquareStyle={{ backgroundColor: '#e2e8f0' }} 
        />
      </div>

      {/* Controles y Status */}
      <div className="w-full space-y-4">
        <div className={`p-4 rounded-xl text-center font-bold text-sm transition-colors ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
          {status}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={resetGame}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw size={18} /> Reiniciar
          </button>
          
          {!isCompleted && (
            <button className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold rounded-xl transition-colors">
              <Lightbulb size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}