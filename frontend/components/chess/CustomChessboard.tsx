'use client';

import React, { useMemo, useState } from 'react';
import { Chess, Square } from 'chess.js';

interface CustomChessboardProps {
  fen: string;
  onDrop: (move: { sourceSquare: Square; targetSquare: Square }) => void;
  disabled?: boolean;
  lastMove?: { from?: string; to?: string };
  hint?: { from?: string; to?: string } | null;
}

const PIECE_SYMBOLS: Record<string, string> = {
  wP: '♙', wN: '♘', wB: '♗', wR: '♖', wQ: '♕', wK: '♔',
  bP: '♟', bN: '♞', bB: '♝', bR: '♜', bQ: '♛', bK: '♚'
};

export default function CustomChessboard({ fen, onDrop, disabled, lastMove, hint }: CustomChessboardProps) {
  const game = useMemo(() => new Chess(fen), [fen]);
  const board = game.board(); 

  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (draggedSquare && draggedSquare !== targetSquare) {
      onDrop({ sourceSquare: draggedSquare, targetSquare });
    }
    setDraggedSquare(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    // 🚀 SOLUCIÓN DE ARRASTRE: touch-none select-none agregados al contenedor padre
    <div className="w-full max-w-[560px] aspect-square grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden touch-none select-none">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const square = `${files[colIndex]}${ranks[rowIndex]}` as Square;
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const pieceKey = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;
          
          // Lógica de resaltado
          const isLastMove = lastMove?.from === square || lastMove?.to === square;
          const isHint = hint?.from === square || hint?.to === square;

          // Clases base y de resaltado
          let bgClass = isLight ? 'bg-[#e2e8f0]' : 'bg-[#475569]';
          if (isLastMove) bgClass = 'bg-[#facc15]/40'; // Fondo amarillento para el último movimiento
          let borderClass = '';
          if (isHint) borderClass = 'shadow-[inset_0_0_0_4px_#34d399]'; // Borde interno verde para la pista

          return (
            <div
              key={square}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, square)}
              className={`flex items-center justify-center relative ${bgClass} ${borderClass}`}
            >
              {/* Coordenadas */}
              {colIndex === 0 && <span className="absolute top-1 left-1 text-[10px] font-bold opacity-50 text-slate-800">{ranks[rowIndex]}</span>}
              {rowIndex === 7 && <span className="absolute bottom-1 right-1 text-[10px] font-bold opacity-50 text-slate-800">{files[colIndex]}</span>}

              {/* Renderizado de la pieza */}
              {pieceKey && (
                <div
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, square)}
                  className={`text-4xl md:text-5xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${
                    disabled ? 'cursor-not-allowed opacity-80' : ''
                  }`}
                  style={{ 
                    color: piece.color === 'w' ? 'white' : 'black',
                    textShadow: piece.color === 'w' ? '0 2px 4px rgba(0,0,0,0.4)' : '0 1px 2px rgba(255,255,255,0.4)'
                  }}
                >
                  {PIECE_SYMBOLS[pieceKey]}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
