'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Chess, Square, Move } from 'chess.js';

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
  // Inicializamos el motor lógico en cada renderizado basado en el FEN actual
  const game = useMemo(() => new Chess(fen), [fen]);
  const board = game.board(); 

  // Estados para el sistema Click-to-Move
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, Move>>({});

  // Limpiar selección si el tablero cambia desde afuera (ej: reinicio o movimiento)
  useEffect(() => {
    setSelectedSquare(null);
    setOptionSquares({});
  }, [fen]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // 🚀 LÓGICA CORE: CLIC PARA SELECCIONAR Y MOVER
  const handleSquareClick = (square: Square) => {
    if (disabled) return;

    // Si damos clic en la pieza que ya estaba seleccionada, la deseleccionamos
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setOptionSquares({});
      return;
    }

    const piece = game.get(square);
    const isPieceOfCurrentTurn = piece && piece.color === game.turn();

    // Si ya teníamos una pieza seleccionada y hacemos clic en un movimiento válido: ¡MOVER!
    if (selectedSquare && optionSquares[square]) {
      onDrop({ sourceSquare: selectedSquare, targetSquare: square });
      setSelectedSquare(null);
      setOptionSquares({});
      return;
    }

    // Si hacemos clic en una pieza nuestra, la seleccionamos y calculamos movimientos
    if (isPieceOfCurrentTurn) {
      setSelectedSquare(square);
      // Extraemos los movimientos legales desde esa casilla
      const moves = game.moves({ square, verbose: true }) as Move[];
      const options: Record<string, Move> = {};
      moves.forEach(m => { options[m.to] = m; });
      setOptionSquares(options);
    } else {
      // Si hacemos clic en cualquier otro lado no válido, limpiamos la selección
      setSelectedSquare(null);
      setOptionSquares({});
    }
  };

  return (
    <div className="w-full max-w-[560px] aspect-square grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden touch-none select-none shadow-inner border border-slate-700/50">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const square = `${files[colIndex]}${ranks[rowIndex]}` as Square;
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const pieceKey = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;
          
          // --- ESTADOS VISUALES ---
          const isLastMove = lastMove?.from === square || lastMove?.to === square;
          const isHint = hint?.from === square || hint?.to === square;
          const isSelected = selectedSquare === square;
          const isOption = !!optionSquares[square];
          const isCaptureOption = isOption && piece;

          // Colores de fondo dinámicos
          let bgClass = isLight ? 'bg-[#e2e8f0]' : 'bg-[#475569]';
          if (isSelected) bgClass = 'bg-[#60a5fa]/50'; // Azul brillante para la pieza seleccionada
          else if (isLastMove) bgClass = 'bg-[#facc15]/40'; // Amarillo para el último movimiento

          // Bordes de pista (Verde)
          let borderClass = '';
          if (isHint) borderClass = 'shadow-[inset_0_0_0_4px_#34d399]';

          return (
            <div
              key={square}
              onClick={() => handleSquareClick(square)}
              className={`flex items-center justify-center relative cursor-pointer ${bgClass} ${borderClass}`}
            >
              {/* Coordenadas del tablero */}
              {colIndex === 0 && <span className="absolute top-1 left-1 text-[10px] font-bold opacity-40 text-slate-900 z-0">{ranks[rowIndex]}</span>}
              {rowIndex === 7 && <span className="absolute bottom-1 right-1 text-[10px] font-bold opacity-40 text-slate-900 z-0">{files[colIndex]}</span>}

              {/* Indicador de movimiento válido (Punto azul o anillo de captura) */}
              {isOption && !isCaptureOption && (
                <div className="absolute w-[30%] h-[30%] bg-blue-500/40 rounded-full z-10 pointer-events-none" />
              )}
              {isCaptureOption && (
                <div className="absolute w-[85%] h-[85%] border-[6px] border-blue-500/40 rounded-full z-10 pointer-events-none" />
              )}

              {/* Renderizado de la pieza */}
              {pieceKey && (
                <div
                  className={`text-4xl md:text-5xl transition-transform z-20 ${
                    disabled ? 'opacity-80' : 'hover:scale-110'
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
