'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, HelpCircle } from 'lucide-react';

// --- LÓGICA DE AJEDREZ SIMPLIFICADA ---
type PieceType = 'knight' | 'rook' | 'bishop' | 'king';

interface Position {
  row: number;
  col: number;
}

const PIECES: Record<PieceType, { icon: string, name: string, hint: string }> = {
  knight: { icon: '♞', name: 'Caballo', hint: 'Se mueve en forma de "L" (2 casillas y 1 giro).' },
  rook:   { icon: '♜', name: 'Torre',   hint: 'Se mueve en línea recta (filas o columnas).' },
  bishop: { icon: '♝', name: 'Alfil',   hint: 'Se mueve solo en diagonales.' },
  king:   { icon: '♚', name: 'Rey',     hint: 'Se mueve solo 1 casilla en cualquier dirección.' },
};

export const ChessLoader = () => {
  const [activePiece, setActivePiece] = useState<PieceType>('knight');
  const [piecePos, setPiecePos] = useState<Position>({ row: 4, col: 4 });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("¡Toca una casilla válida!");

  // Inicializar juego
  useEffect(() => {
    resetRound();
  }, []);

  const resetRound = () => {
    const pieces: PieceType[] = ['knight', 'rook', 'bishop', 'king'];
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const randomRow = Math.floor(Math.random() * 8);
    const randomCol = Math.floor(Math.random() * 8);
    
    setActivePiece(randomPiece);
    setPiecePos({ row: randomRow, col: randomCol });
    setMessage("Selecciona una casilla válida...");
  };

  const isValidMove = (targetRow: number, targetCol: number) => {
    const dr = Math.abs(targetRow - piecePos.row);
    const dc = Math.abs(targetCol - piecePos.col);

    // No vale hacer clic en la misma casilla
    if (dr === 0 && dc === 0) return false;

    switch (activePiece) {
      case 'knight': return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
      case 'rook':   return (dr === 0 || dc === 0);
      case 'bishop': return (dr === dc);
      case 'king':   return (dr <= 1 && dc <= 1);
      default: return false;
    }
  };

  const handleSquareClick = (r: number, c: number) => {
    if (isValidMove(r, c)) {
      // ✅ MOVIMIENTO CORRECTO
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      setScore(s => s + 1);
      setMessage("¡Excelente! 🎉");
      
      // Pequeño delay para que vea el movimiento
      setTimeout(() => resetRound(), 600);
    } else {
      // ❌ MOVIMIENTO INCORRECTO
      setMessage("Oops, movimiento inválido. Intenta de nuevo.");
    }
  };

  // Renderizar Tablero (8x8)
  const renderBoard = () => {
    const board = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isBlack = (r + c) % 2 === 1;
        const isPieceHere = r === piecePos.row && c === piecePos.col;
        
        board.push(
          <div
            key={`${r}-${c}`}
            onClick={() => handleSquareClick(r, c)}
            className={`
              w-full h-8 sm:h-10 flex items-center justify-center text-xl cursor-pointer transition-all hover:opacity-80
              ${isBlack ? 'bg-slate-400' : 'bg-slate-200'}
              ${isPieceHere ? 'cursor-default' : ''}
            `}
          >
            {isPieceHere && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-slate-900 font-bold text-2xl sm:text-3xl"
              >
                {PIECES[activePiece].icon}
              </motion.span>
            )}
          </div>
        );
      }
    }
    return board;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Encabezado del Juego */}
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <div className="flex items-center gap-2">
            <span className="text-4xl">{PIECES[activePiece].icon}</span>
            <div className="text-left">
                <p className="font-bold text-slate-800 text-sm">Mueve el {PIECES[activePiece].name}</p>
                <p className="text-xs text-slate-500 max-w-[180px] leading-tight">{PIECES[activePiece].hint}</p>
            </div>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
            <Trophy size={14} /> {score}
        </div>
      </div>

      {/* Tablero */}
      <div className="grid grid-cols-8 border-4 border-slate-700 rounded-lg overflow-hidden shadow-xl w-full max-w-[320px]">
        {renderBoard()}
      </div>

      {/* Feedback Mensaje */}
      <p className={`mt-3 text-xs font-bold h-4 ${message.includes('Oops') ? 'text-rose-500' : 'text-emerald-600'}`}>
        {message}
      </p>
    </div>
  );
};