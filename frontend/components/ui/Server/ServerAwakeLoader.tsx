'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, HelpCircle, Server, Zap, Brain } from 'lucide-react';

// ============================================================================
// 1. SUB-COMPONENTE: CHESS LOADER (Lógica del Juego)
// ============================================================================

type PieceType = 'knight' | 'rook' | 'bishop' | 'king';

interface Position {
  row: number;
  col: number;
}

const PIECES: Record<PieceType, { icon: string, name: string, hint: string }> = {
  knight: { icon: '♞', name: 'Caballo', hint: 'Movimiento en "L" (2 casillas y 1 giro).' },
  rook:   { icon: '♜', name: 'Torre',   hint: 'Movimiento recto (filas o columnas).' },
  bishop: { icon: '♝', name: 'Alfil',   hint: 'Movimiento en diagonales.' },
  king:   { icon: '♚', name: 'Rey',     hint: 'Solo 1 casilla en cualquier dirección.' },
};

const ChessGame = () => {
  const [activePiece, setActivePiece] = useState<PieceType>('knight');
  const [piecePos, setPiecePos] = useState<Position>({ row: 4, col: 4 });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("¡Toca una casilla válida!");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    resetRound();
  }, []);

  const resetRound = () => {
    const pieces: PieceType[] = ['knight', 'rook', 'bishop', 'king'];
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    // Evitamos bordes extremos para facilitar el juego visualmente
    const randomRow = Math.floor(Math.random() * 6) + 1; 
    const randomCol = Math.floor(Math.random() * 6) + 1;
    
    setActivePiece(randomPiece);
    setPiecePos({ row: randomRow, col: randomCol });
    setMessage("¿A dónde puede moverse?");
  };

  const isValidMove = (targetRow: number, targetCol: number) => {
    const dr = Math.abs(targetRow - piecePos.row);
    const dc = Math.abs(targetCol - piecePos.col);

    if (dr === 0 && dc === 0) return false; // Misma casilla

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
      // ✅ ÉXITO
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }, colors: ['#6366f1', '#10b981'] });
      setScore(s => s + 10);
      setMessage("¡Excelente! +10 XP");
      // Mover la pieza visualmente a la nueva posición antes de reiniciar
      setPiecePos({ row: r, col: c });
      
      setTimeout(() => resetRound(), 800);
    } else {
      // ❌ ERROR
      setShake(true);
      setMessage("Movimiento inválido. Intenta de nuevo.");
      setTimeout(() => setShake(false), 500);
    }
  };

  // Renderizar Tablero 8x8
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
              w-full h-8 sm:h-9 flex items-center justify-center text-xl cursor-pointer transition-colors duration-200
              ${isBlack ? 'bg-slate-300 hover:bg-slate-400' : 'bg-white hover:bg-white'}
              ${isPieceHere ? 'cursor-default ring-2 ring-indigo-500 z-10' : ''}
            `}
          >
            {isPieceHere && (
              <motion.span 
                layoutId="piece"
                className="text-slate-900 font-bold text-2xl drop-shadow-none select-none"
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
    <div className={`flex flex-col items-center w-full ${shake ? 'animate-shake' : ''}`}>
      {/* Header del Juego */}
      <div className="flex items-center justify-between w-full mb-4 px-1">
        <div className="flex items-center gap-3 bg-white p-2 rounded-none border border-slate-200 w-full">
            <span className="text-4xl">{PIECES[activePiece].icon}</span>
            <div className="text-left flex-1">
                <p className="font-bold text-slate-900 text-sm">Mueve el {PIECES[activePiece].name}</p>
                <p className="text-[10px] text-slate-600 leading-tight">{PIECES[activePiece].hint}</p>
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-none font-bold text-sm flex items-center gap-1">
                <Trophy size={14} /> {score}
            </div>
        </div>
      </div>

      {/* Tablero */}
      <div className="grid grid-cols-8 border-4 border-slate-800 rounded-none overflow-hidden shadow-2xl w-full max-w-[320px] bg-slate-50">
        {renderBoard()}
      </div>

      {/* Feedback Mensaje */}
      <p className={`mt-3 text-xs font-bold h-4 transition-colors ${message.includes('inválido') ? 'text-rose-500' : 'text-[#D4AF37]'}`}>
        {message}
      </p>
    </div>
  );
};

// ============================================================================
// 2. COMPONENTE PRINCIPAL: SERVER AWAKE LOADER
// ============================================================================

export const ServerAwakeLoader = () => {
  const [progress, setProgress] = useState(0);
  
  // Timer de la barra de progreso (Simulación de 50s)
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((old) => {
        // Se detiene visualmente en 98% hasta que el fetch real termine y desmonte el componente
        if (old >= 98) return 98; 
        
        // Al principio carga rápido (ilusión), luego lento (realidad)
        const increment = old < 30 ? 1.5 : 0.3; 
        return old + increment;
      });
    }, 200); 

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/95 backdrop-blur-md px-4 animate-in fade-in duration-500">
      
      <div className="w-full max-w-md bg-white rounded-none p-6 shadow-2xl text-center border border-slate-200 relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Título */}
        <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
                <Brain className="text-[#D4AF37]" size={24} />
                Entrenando Mente...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
                El servidor está despertando. ¡Aprovecha para practicar!
            </p>
        </div>

        {/* --- JUEGO DE AJEDREZ --- */}
        <ChessGame />

        {/* Barra de Progreso Inferior */}
        <div className="mt-8 pt-4 border-t border-slate-200">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
            <span className="flex items-center gap-1"><Server size={10} /> Conectando Servidor</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full h-2 bg-white rounded-full overflow-hidden relative">
            {/* Brillo animado */}
            <div className="absolute top-0 left-0 w-full h-full bg-white overflow-hidden">
                 <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent z-10 absolute"
                 />
            </div>
            
            <motion.div 
              className="h-full bg-[#D4AF37]/20 rounded-full relative z-0"
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-[9px] text-slate-300 mt-2 text-center">
            Esto puede tomar hasta 50 segundos en conexión fría.
          </p>
        </div>

      </div>
    </div>
  );
};