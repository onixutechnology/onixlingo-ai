'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Chess, type Square } from 'chess.js'; // Importamos tipos
import { Chessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { 
  ArrowLeft, Lightbulb, RotateCcw, CheckCircle2, 
  XCircle, HelpCircle, ChevronRight 
} from 'lucide-react';

// --- BASE DE DATOS DE LECCIONES ---
const LESSON_DB: Record<string, any> = {
  'fork': {
    title: 'El Ataque Doble (The Fork)',
    instruction: 'Mueve el Caballo para atacar al Rey y a la Dama simultáneamente.',
    fen: '8/8/8/3q4/8/8/1N6/K7 w - - 0 1', 
    solution: 'b2c4', 
    hint: 'Busca una casilla desde donde el Caballo amenace dos piezas valiosas.',
    explanation: '¡Excelente! Al dar Jaque, el Rey debe moverse, y tú capturarás la Dama en el siguiente turno.'
  },
  'pin': {
    title: 'La Clavada (The Pin)',
    instruction: 'Inmoviliza al Caballo negro usando tu Alfil.',
    fen: 'k7/8/2n5/8/8/8/2B5/K7 w - - 0 1', 
    solution: 'c2e4',
    hint: 'Coloca tu Alfil en la misma diagonal que el Caballo y el Rey enemigo.',
    explanation: '¡Correcto! El Caballo no puede moverse porque dejaría a su Rey en Jaque. Es una "Clavada Absoluta".'
  },
  'mate-1': {
    title: 'Mate del Pasillo',
    instruction: 'Las blancas dan Jaque Mate en 1 movimiento.',
    fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
    solution: 'd1d8',
    hint: 'La Torre puede controlar toda la última fila. Los peones bloquean al Rey.',
    explanation: '¡Jaque Mate! El Rey está atrapado por sus propios peones y no tiene escapatoria.'
  }
};

function PracticeArena() {
  const params = useSearchParams();
  const router = useRouter();
  const lessonId = params.get('lessonId');
  
  const lessonData = lessonId ? LESSON_DB[lessonId] : null;

  // --- ESTADOS ---
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedback, setFeedback] = useState('');
  
  // 👇 SOLUCIÓN ERROR DE TIPO: Convertimos Chessboard a 'any'
  const SafeChessboard = Chessboard as any;

  // Inicializar tablero
  useEffect(() => {
    if (lessonData) {
      const newGame = new Chess(lessonData.fen);
      setGame(newGame);
      setStatus('idle');
      setFeedback('');
    }
  }, [lessonData]);

  // --- LÓGICA DE VALIDACIÓN ---
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (status === 'correct') return false; 

    // 1. Intentar mover en la lógica interna (Validación de Ajedrez)
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    };

    // 2. Verificar si es la SOLUCIÓN CORRECTA del Puzzle
    const moveString = sourceSquare + targetSquare;

    if (lessonData && moveString === lessonData.solution) {
       // Movimiento Correcto
       const gameCopy = new Chess(game.fen());
       gameCopy.move(move);
       setGame(gameCopy);
       setStatus('correct');
       setFeedback(lessonData.explanation);
       confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
       return true;
    } else {
       // Movimiento Incorrecto
       try {
         const gameCopy = new Chess(game.fen());
         const result = gameCopy.move(move); // Intenta mover en el tablero virtual
         
         if (result) {
            // Es un movimiento legal de ajedrez, pero NO es la solución
            setGame(gameCopy);
            setStatus('wrong');
            setFeedback('Ese movimiento es válido, pero no resuelve el problema. Intenta de nuevo.');
            
            // Regresamos la pieza después de 1 segundo
            setTimeout(() => {
                if (lessonData) {
                    const resetGame = new Chess(lessonData.fen);
                    setGame(resetGame);
                    setStatus('idle');
                    setFeedback('');
                }
            }, 1500);
            return true;
         }
       } catch (e) {
         return false; // Movimiento ilegal
       }
    }
    return false;
  }

  const handleReset = () => {
    if (lessonData) {
        setGame(new Chess(lessonData.fen));
        setStatus('idle');
        setFeedback('');
    }
  };

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Lección no encontrada</h2>
            <Link href="/dashboard/chess" className="text-indigo-400 hover:underline">Volver al Lobby</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* --- BARRA LATERAL IZQUIERDA --- */}
      <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50">
         <Link href="/dashboard/chess" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors font-bold text-sm">
            <ArrowLeft size={16} /> Salir
         </Link>

         <div className="flex-1">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest mb-4">
                Práctica Táctica
            </div>
            <h1 className="text-3xl font-black text-white mb-4 leading-tight">{lessonData.title}</h1>
            
            <div className="bg-[#131B2C] p-5 rounded-2xl border border-slate-700/50 mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <HelpCircle size={14} /> Misión
                </h3>
                <p className="text-lg font-medium text-white">{lessonData.instruction}</p>
            </div>

            {/* FEEDBACK AREA */}
            <div className={`transition-all duration-500 overflow-hidden ${status !== 'idle' ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
                <div className={`p-4 rounded-xl border flex gap-3 ${status === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                    {status === 'correct' ? <CheckCircle2 className="shrink-0" /> : <XCircle className="shrink-0" />}
                    <div>
                        <h4 className="font-bold text-sm mb-1">{status === 'correct' ? '¡Excelente!' : 'Incorrecto'}</h4>
                        <p className="text-sm opacity-90 leading-snug">{feedback}</p>
                    </div>
                </div>
            </div>
         </div>

         {/* BOTONES */}
         <div className="mt-auto pt-6 space-y-3">
            {status === 'correct' ? (
                <button onClick={() => router.push('/dashboard/chess')} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:translate-y-[-2px]">
                    Continuar <ChevronRight size={20} />
                </button>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleReset} className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors">
                        <RotateCcw size={18} /> Reiniciar
                    </button>
                    {/* 👇 SOLUCIÓN ERROR: Función limpia en lugar de || */}
                    <button 
                        onClick={() => {
                            setFeedback(lessonData.hint);
                            setStatus('wrong'); // Mostramos hint como feedback
                        }} 
                        className="py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl font-bold border border-indigo-500/30 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Lightbulb size={18} /> Pista
                    </button>
                </div>
            )}
         </div>
      </div>

      {/* --- ÁREA DEL TABLERO (Derecha) --- */}
      <div className="flex-1 bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]"></div>
         
         <div className="relative z-10 w-full max-w-[600px] aspect-square">
            <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-[8px] border-[#1E293B]">
                {/* 👇 USAMOS SafeChessboard PARA EVITAR ERRORES DE TIPO EN position */}
                <SafeChessboard 
                    position={game.fen()} 
                    onPieceDrop={onDrop}
                    animationDuration={300}
                    customDarkSquareStyle={{ backgroundColor: '#334155' }}
                    customLightSquareStyle={{ backgroundColor: '#94a3b8' }}
                    arePiecesDraggable={status !== 'correct'}
                />
            </div>
         </div>
      </div>

    </div>
  );
}

export default function PracticePage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Cargando Arena...</div>}>
            <PracticeArena />
        </Suspense>
    );
}