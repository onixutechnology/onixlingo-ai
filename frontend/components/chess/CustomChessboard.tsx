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

// Usamos símbolos rellenos sólidos (los de tipo 'black') para ambas piezas.
// Así podemos colorearlas uniformemente como Ivory y Ebony.
// El sufijo \uFE0E fuerza a Windows/iOS a renderizarlos como texto y no como emojis morados.
const PIECE_SYMBOLS: Record<string, string> = {
  wP: '♟\uFE0E', wN: '♞\uFE0E', wB: '♝\uFE0E', wR: '♜\uFE0E', wQ: '♛\uFE0E', wK: '♚\uFE0E',
  bP: '♟\uFE0E', bN: '♞\uFE0E', bB: '♝\uFE0E', bR: '♜\uFE0E', bQ: '♛\uFE0E', bK: '♚\uFE0E'
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
    <div className="w-full max-w-[560px] aspect-square grid grid-cols-8 grid-rows-8 rounded-none overflow-hidden touch-none select-none shadow-2xl border-8 border-[#3d200c] bg-[#3d200c]">
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

          // Colores de fondo de madera premium
          // Light Maple: #ecd3b5, Dark Walnut/Rosewood: #8a5229
          const baseColor = isLight ? '#ecd3b5' : '#8a5229';

          // Color de coordenadas premium
          const coordColor = isLight ? 'text-amber-950/60' : 'text-amber-100/60';

          // Bordes de pista (Verde)
          let borderClass = 'border border-amber-950/15';
          if (isHint) borderClass += ' shadow-[inset_0_0_0_4px_#34d399]';

          return (
            <div
              key={square}
              onClick={() => handleSquareClick(square)}
              className={`flex items-center justify-center relative cursor-pointer ${borderClass}`}
              style={{ backgroundColor: baseColor }}
            >
              {/* Capas de selección y último movimiento (Preserva textura inferior de madera) */}
              {isSelected && (
                <div className="absolute inset-0 bg-amber-600/30 z-10 pointer-events-none" />
              )}
              {isLastMove && (
                <div className="absolute inset-0 bg-amber-400/30 z-10 pointer-events-none" />
              )}

              {/* Coordenadas del tablero */}
              {colIndex === 0 && (
                <span className={`absolute top-1 left-1 text-[10px] font-extrabold ${coordColor} z-0 select-none`}>
                  {ranks[rowIndex]}
                </span>
              )}
              {rowIndex === 7 && (
                <span className={`absolute bottom-1 right-1 text-[10px] font-extrabold ${coordColor} z-0 select-none`}>
                  {files[colIndex]}
                </span>
              )}

              {/* Indicador de movimiento válido (Punto ámbar o anillo de captura) */}
              {isOption && !isCaptureOption && (
                <div className="absolute w-[30%] h-[30%] bg-amber-500/40 rounded-full z-10 pointer-events-none" />
              )}
              {isCaptureOption && (
                <div className="absolute w-[85%] h-[85%] border-[6px] border-amber-500/40 rounded-full z-10 pointer-events-none" />
              )}

              {/* Renderizado de la pieza */}
              {pieceKey && (
                <div
                  className={`text-4xl md:text-5xl transition-transform z-20 ${
                    disabled ? 'opacity-80' : 'hover:scale-110'
                  }`}
                  style={{ 
                    color: piece.color === 'w' ? '#fbf8f0' : '#1e130c',
                    textShadow: piece.color === 'w' 
                      ? '1px 1.5px 3px rgba(0,0,0,0.45), 0px 0px 1px rgba(0,0,0,0.5)' 
                      : '1px 1.5px 3px rgba(0,0,0,0.75), 0px 0px 1px rgba(255,255,255,0.15)'
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
