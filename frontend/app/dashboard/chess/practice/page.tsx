'use client';

/**
 * ==============================================================================
 * ONIXLINGO CHESS ACADEMY - PRACTICE ARENA
 * ==============================================================================
 * RUTA: /dashboard/chess/practice/page.tsx
 * ESTADO: Production Ready (Patrón Oficial de Estado Separado FEN/Engine)
 * ==============================================================================
 */

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  ArrowLeft, Lightbulb, RotateCcw, CheckCircle2, 
  XCircle, HelpCircle, ChevronRight, Loader2, Target, Bot
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

const sanitizeFEN = (fen: string) => {
  if (!fen) return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  let safeFen = fen;
  if (!safeFen.includes('K') || !safeFen.includes('k')) {
    console.warn("⚠️ FEN corregido automáticamente.");
    safeFen = "3k4/8/8/3p4/8/8/8/3R2K1 w - - 0 1"; 
  }
  return safeFen;
};

function PracticeArena() {
  const params = useSearchParams();
  const router = useRouter();
  const lessonId = params.get('lessonId');

  const [lessonData, setLessonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🔥 LA SOLUCIÓN: Separar el Motor (game) de la Vista (fenText)
  const [game] = useState(new Chess()); // Motor Lógico Mutable
  const [fenText, setFenText] = useState('start'); // Conductor Visual
  
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'playing'>('idle');
  const [feedback, setFeedback] = useState('');
  const [lastMoveSquares, setLastMoveSquares] = useState<{from?: string, to?: string}>({});

  const SafeChessboard = Chessboard as any;

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) { setIsLoading(false); return; }
      try {
        const token = Cookies.get('access_token');
        if (!token) { router.push('/login'); return; }

        const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/v1/chess/lessons/${lessonId}?t=${Date.now()}`, {
          headers: { 'Authorization': safeToken }
        });

        if (res.ok) {
          const data = await res.json();
          setLessonData(data);
          
          // Inicializamos el motor y la vista
          const safeFen = sanitizeFEN(data.fen);
          game.load(safeFen);
          setFenText(game.fen()); // Dispara el render del tablero
          
          if (data.solution === 'FREE_PLAY') setStatus('playing');
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, router, game]);

  // --- LÓGICA DE MOVIMIENTO INFALIBLE ---
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (status === 'correct' || game.isGameOver()) return false;

    let moveResult = null;
    
    // 1. Intentar el movimiento en el motor interno
    try {
      moveResult = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });
    } catch (e) {
      console.log("Movimiento ilegal bloqueado:", e);
      return false; // Pieza regresa
    }

    // Si es null, el árbitro dice que no es legal
    if (moveResult === null) return false; // Pieza regresa

    // 2. EL MOVIMIENTO ES LEGAL: Actualizamos la vista Inmediatamente
    setFenText(game.fen());
    setLastMoveSquares({ from: sourceSquare, to: targetSquare });

    const moveString = sourceSquare + targetSquare;

    // 3A. MODO IA: JUEGO LIBRE
    if (lessonData?.solution === 'FREE_PLAY') {
      if (game.isGameOver()) {
        setStatus('correct');
        setFeedback('¡Partida terminada!');
        confetti({ particleCount: 200, spread: 90 });
        saveProgress();
        return true;
      }
      
      setTimeout(() => {
        const moves = game.moves();
        if (moves.length > 0) {
          const randomMove = moves[Math.floor(Math.random() * moves.length)];
          game.move(randomMove);
          setFenText(game.fen()); // Actualiza vista para movimiento de IA
        }
      }, 500);
      return true;
    }

    // 3B. MODO PUZZLE
    if (moveString === lessonData?.solution) {
      setStatus('correct');
      setFeedback(lessonData.explanation || '¡Excelente movimiento!');
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 }, colors: ['#4ade80', '#818cf8', '#facc15'] });
      saveProgress();
    } else {
      setStatus('wrong');
      setFeedback('Movimiento válido en ajedrez, pero incorrecto para este puzzle.');
      
      // Deshacer movimiento después de un momento
      setTimeout(() => {
        game.load(sanitizeFEN(lessonData.fen));
        setFenText(game.fen());
        setStatus('idle');
        setFeedback('');
        setLastMoveSquares({});
      }, 1500);
    }

    return true; // La pieza se suelta exitosamente
  }

  const saveProgress = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) return;
      await fetch(`${API_URL}/api/v1/chess/progress`, {
        method: 'POST',
        headers: { 
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ lesson_id: lessonId, status: 'completed' })
      });
    } catch (error) {
      console.error("Error guardando progreso:", error);
    }
  };

  const handleReset = () => {
    if (lessonData) {
      game.load(sanitizeFEN(lessonData.fen));
      setFenText(game.fen());
      setStatus(lessonData.solution === 'FREE_PLAY' ? 'playing' : 'idle');
      setFeedback('');
      setLastMoveSquares({});
    }
  };

  const showHint = () => {
    if (lessonData) {
      setFeedback(lessonData.hint);
      setStatus('wrong'); 
    }
  };

  // --- RENDERIZADO VISUAL ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold text-slate-400 tracking-widest uppercase text-sm">Cargando Tablero...</p>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-white">
        <Target size={64} className="text-slate-700 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Lección no encontrada</h2>
        <Link href="/dashboard/chess" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors">Volver al Lobby</Link>
      </div>
    );
  }

  const isFreePlay = lessonData.solution === 'FREE_PLAY';
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (lastMoveSquares.from && lastMoveSquares.to) {
    customSquareStyles[lastMoveSquares.from] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    customSquareStyles[lastMoveSquares.to] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col md:flex-row">
      <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 shadow-2xl z-20 overflow-y-auto">
        <Link href="/dashboard/chess" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors font-bold text-sm bg-slate-800/50 self-start px-4 py-2 rounded-lg border border-slate-700/50">
          <ArrowLeft size={16} /> Salir al Menú
        </Link>

        <div className="flex-1">
          <div className={`inline-block px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-4 ${isFreePlay ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
            {isFreePlay ? 'Modo: Juego Interactivo vs IA' : 'Práctica Táctica'}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
            {lessonData.title}
          </h1>

          <div className="bg-[#131B2C] p-6 rounded-2xl border border-slate-700/50 mb-6 shadow-inner">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              {isFreePlay ? <Bot size={14} className="text-emerald-400" /> : <HelpCircle size={14} className="text-indigo-400" />} 
              Tu Misión
            </h3>
            <p className="text-lg font-medium text-slate-200 leading-relaxed">
              {lessonData.instruction}
            </p>
          </div>

          <div className={`transition-all duration-500 overflow-hidden ${status === 'correct' || status === 'wrong' ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
            <div className={`p-5 rounded-2xl border shadow-lg flex gap-4 ${status === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
              {status === 'correct' ? <CheckCircle2 className="shrink-0 w-6 h-6" /> : <XCircle className="shrink-0 w-6 h-6" />}
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">
                  {status === 'correct' ? '¡Brillante!' : 'Análisis del Motor'}
                </h4>
                <p className="text-sm opacity-90 leading-relaxed">{feedback}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3 shrink-0">
          {status === 'correct' ? (
            <button onClick={() => router.push('/dashboard/chess')} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
              Continuar Ruta <ChevronRight size={18} />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleReset} className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors active:scale-95">
                <RotateCcw size={16} /> Reiniciar
              </button>
              <button onClick={showHint} className="py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl font-bold text-sm border border-indigo-500/30 flex items-center justify-center gap-2 transition-colors active:scale-95">
                <Lightbulb size={16} /> Ver Pista
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-[#0B0F19] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[600px] lg:max-w-[700px] aspect-square">
          <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 rounded-sm blur-2xl opacity-60 pointer-events-none"></div>
          
          <div className="relative rounded-sm overflow-hidden shadow-2xl border-[12px] border-[#18212F] bg-[#18212F]">
            <SafeChessboard 
              id="PracticeArenaBoard"
              position={fenText} // 🔥 MAGIA: Lee directo del estado de texto
              onPieceDrop={onDrop}
              animationDuration={200}
              customDarkSquareStyle={{ backgroundColor: '#475569' }} 
              customLightSquareStyle={{ backgroundColor: '#cbd5e1' }} 
              customSquareStyles={customSquareStyles}
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
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin" size={48} />
      </div>
    }>
      <PracticeArena />
    </Suspense>
  );
}
