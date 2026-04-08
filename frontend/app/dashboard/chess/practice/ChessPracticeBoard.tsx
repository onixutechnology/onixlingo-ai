'use client';

import React from 'react';
import { Chessboard } from 'react-chessboard';

type Props = {
  fen: string;
  onDrop: (sourceSquare: string, targetSquare: string) => boolean;
  finalSquareStyles: Record<string, React.CSSProperties>;
  disabled?: boolean;
};

export default function ChessPracticeBoard({
  fen,
  onDrop,
  finalSquareStyles,
  disabled = false,
}: Props) {
  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[14px] border-[#1E293B] bg-[#1E293B]"
      style={{ touchAction: 'none' }}
    >
      <Chessboard
        id="onix-practice-board"
        position={fen}
        onPieceDrop={(sourceSquare, targetSquare) =>
          onDrop(sourceSquare, targetSquare)
        }
        boardWidth={560}
        animationDuration={250}
        arePiecesDraggable={!disabled}
        boardOrientation="white"
        autoPromoteToQueen
        customDarkSquareStyle={{ backgroundColor: '#475569' }}
        customLightSquareStyle={{ backgroundColor: '#e2e8f0' }}
        customSquareStyles={finalSquareStyles}
        customBoardStyle={{ borderRadius: '6px' }}
      />
    </div>
  );
}