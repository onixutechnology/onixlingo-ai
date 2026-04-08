'use client';

import { useState, useEffect } from 'react';
import { Chess, type Square } from 'chess.js';
import dynamic from 'next/dynamic';
import { RefreshCw, Lightbulb, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// 🔥 BLINDAJE: Importación dinámica sin SSR de la nueva librería
const DynamicChessboard = dynamic(() => import('chessboardjsx'), { ssr: false });
const SafeChessboard = DynamicChessboard as any;

// Ejemplo de lección: "Mate en 1 con Torre"
const LESSON_FEN = "8/8/8/8/8/5k2/8/R4K2 w - - 0 1"; 
const SOLUTION_MOVE = "Ra8#"; // Torre a a8 es mate

export default function ChessTrainer() {
  const [game, setGame] = useState(new Chess(LESSON_FEN));
  const [fen, setFen] = useState(LESSON_FEN);
  const [status, setStatus] = useState("Tu turno: Juegan Blancas");
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Evitamos que el servidor de Next.js intente dibujar el tablero
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Función para manejar cuando sueltas una pieza (Ajustada para chessboardjsx)
  function onDrop({ sourceSquare, targetSquare }: { sourceSquare: Square; targetSquare: Square }) {
    if (isCompleted) return;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare, 
        promotion: 'q', 
      });

      if (!move) return; // Movimiento ilegal, la pieza regresa sola

      if (move.san === SOLUTION_MOVE || (gameCopy.isCheckmate() && SOLUTION_MOVE.includes('#'))) {
        setGame(gameCopy);
        setFen(gameCopy.fen());
        handleSuccess();
      } else {
        setStatus("Movimiento válido, pero no es el mejor. ¡Intenta buscar el Mate!");
        // Forzamos el regreso visual si no es la solución
        setFen(game.fen()); 
      }
    } catch (error) {
      setFen(game.fen()); // Snapback en caso de error
    }
  }

  const handleSuccess = () => {
    setStatus("¡Jaque Mate! Excelente 🎉");
    setIsCompleted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const resetGame = () => {
    const newGame = new Chess(LESSON_FEN);
    setGame(newGame);
    setFen(newGame.fen());
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
      <div className="w-full aspect-square mb-6 border-4 border-slate-800 rounded-lg overflow-hidden shadow-2xl bg-[#475569] flex items-center justify-center p-1">
        {isMounted ? (
          <SafeChessboard 
            width={350}
            position={fen} 
            onDrop={onDrop}
            boardStyle={{
              borderRadius: '4px',
              boxShadow: 'none',
            }}
            darkSquareStyle={{ backgroundColor: '#475569' }} 
            lightSquareStyle={{ backgroundColor: '#e2e8f0' }} 
            draggable={!isCompleted}
          />
        ) : (
          <Loader2 className="animate-spin text-slate-300" size={48} />
        )}
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
