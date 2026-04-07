'use client';

/**
 * ==============================================================================
 * ONIXLINGO CHESS ACADEMY - ENTERPRISE ARENA
 * ==============================================================================
 * RUTA: /dashboard/chess/practice/page.tsx
 * ESTADO: Production Ready (Smart Guide, Auto-Snapback, AI Opponent, Titanium UI)
 * ==============================================================================
 */

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import React, { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  ArrowLeft, Lightbulb, RotateCcw, CheckCircle2, 
  XCircle, HelpCircle, ChevronRight, Loader2, Target, Bot, AlertTriangle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

const sanitizeFEN = (fen: string) => {
  if (!fen) return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  let safeFen = fen;
  if (!safeFen.includes('K') || !safeFen.includes('k')) {
    safeFen = "3k4/8/8/3p4/8/8/8/3R2K1 w - - 0 1"; 
  }
  return safeFen;
};

function PracticeArena() {
  const params = useSearchParams();
  const router = useRouter();
  const lessonId = params.get('lessonId');

  // --- ESTADOS DE UI ---
  const [lessonData, setLessonData] = useState<any>(null);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'gameover'>('playing');
  const [feedback, setFeedback] = useState('Analiza el tablero y realiza tu movimiento.');
  const [mistakes, setMistakes] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMoveSquares, setLastMoveSquares] = useState<{from?: string, to?: string}>({});

  // 🔥 SOLUCIÓN MAESTRA: Aislar el motor de ajedrez de los re-renders de React
  const engine = useRef(new Chess()); 
  const [fen, setFen] = useState("start"); // Solo usamos string para dibujar el tablero visual
  
  // Engañamos a TypeScript para que no se queje de los props personalizados
  const SafeChessboard = Chessboard as any;

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) { setIsLoading(false); return; }
      try {
        const token = Cookies.get('access_token');
        if (!token) { router.push('/login'); return; }
        const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/v1/chess/lessons/${lessonId}?t=${Date.now()}`, {
          headers: { 'Authorization': safeToken, 'Cache-Control': 'no-cache' }
        });

        if (res.ok) {
          const data = await res.json();
          setLessonData(data);
          // Cargamos el motor de forma segura
          const safeFen = sanitizeFEN(data.fen);
          engine.current.load(safeFen);
          setFen(engine.current.fen()); // Le decimos al tablero visual qué dibujar
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, router]);

  // Vigía de errores para encender la guía
  useEffect(() => {
    if (mistakes >= 3 && lessonData?.solution !== 'FREE_PLAY') {
      setShowGuide(true);
      setFeedback('¡Guías visuales activadas! Observa los aros verdes en el tablero.');
    }
  }, [mistakes, lessonData]);

  // --- MOTOR DE MOVIMIENTO ---
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (engine.current.isGameOver() || status === 'correct' || status === 'gameover') return false;

    const moveAttempt = { from: sourceSquare, to: targetSquare, promotion: 'q' };

    // 1. Intentar el movimiento en el motor aislado
    let moveResult = null;
    try {
      moveResult = engine.current.move(moveAttempt);
    } catch (e) {
      return false; // Ilegal, rebota
    }

    if (moveResult === null) return false; // Ilegal, rebota

    // 2. MODO JUEGO LIBRE (IA)
    if (lessonData?.solution === 'FREE_PLAY') {
      setFen(engine.current.fen()); // Actualiza tablero visual
      setLastMoveSquares({ from: sourceSquare, to: targetSquare });
      setFeedback('La IA está pensando...');

      if (engine.current.isGameOver()) {
        setStatus('gameover');
        setFeedback('¡Fin de la partida!');
        saveProgress();
        return true;
      }

      setTimeout(() => {
        const moves = engine.current.moves();
        if (moves.length > 0) {
          const botMove = engine.current.move(moves[Math.floor(Math.random() * moves.length)]);
          setFen(engine.current.fen()); // Actualiza tablero tras jugada de IA
          
          if (botMove && typeof botMove === 'object') {
             setLastMoveSquares({ from: botMove.from, to: botMove.to });
          }
          
          setFeedback('Tu turno.');
          if (engine.current.isGameOver()) {
            setStatus('gameover');
            saveProgress();
          }
        }
      }, 500);
      return true;
    }

    // 3. MODO PUZZLE ESTRICTO (Smart Validation)
    const moveUCI = sourceSquare + targetSquare;
    const moveSAN = moveResult.san;

    if (lessonData?.solution === moveUCI || lessonData?.solution === moveSAN) {
      // ✅ CORRECTO
      setFen(engine.current.fen());
      setStatus('correct');
      setFeedback(lessonData.explanation || '¡Brillante! Solución encontrada.');
      setShowGuide(false);
      confetti({ particleCount: 200, spread: 90, colors: ['#4ade80', '#818cf8'] });
      saveProgress();
      return true;
    } else {
      // ❌ INCORRECTO
      engine.current.undo(); // Deshacemos el movimiento en el motor para que no se arruine
      setMistakes(prev => prev + 1);
      setStatus('wrong');
      setFeedback('Movimiento incorrecto. Analiza bien el tablero.');
      setFen(engine.current.fen()); // Forzamos sync para el rebote visual
      return false; 
    }
  }

  // Estilos dinámicos (Pistas y último movimiento)
  const finalSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    
    // Resaltar último movimiento libre (Amarillo)
    if (lastMoveSquares.from && lastMoveSquares.to) {
      styles[lastMoveSquares.from] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
      styles[lastMoveSquares.to] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }

    // Dibujar Guía de Ayuda (Verde Esmeralda)
    if (showGuide && lessonData?.solution && lessonData.solution !== 'FREE_PLAY') {
      const fromSq = lessonData.solution.substring(0, 2);
      const toSq = lessonData.solution.substring(2, 4);
      styles[fromSq] = { boxShadow: 'inset 0 0 0 4px #34d399' };
      styles[toSq] = { boxShadow: 'inset 0 0 0 4px #34d399' };
    }
    
    return styles;
  }, [showGuide, lessonData, lastMoveSquares]);

  const saveProgress = async () => {
    const token = Cookies.get('access_token');
    if (!token) return;
    await fetch(`${API_URL}/api/v1/chess/progress`, {
      method: 'POST',
      headers: { 'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, status: 'completed' })
    });
  };

  const handleReset = () => {
    if (lessonData) {
      engine.current.load(sanitizeFEN(lessonData.fen));
      setFen(engine.current.fen());
      setStatus(lessonData.solution === 'FREE_PLAY' ? 'playing' : 'playing');
      setMistakes(0);
      setShowGuide(false);
      setLastMoveSquares({});
      setFeedback('Tablero reiniciado. Analiza tu jugada.');
    }
  };

  const forceHint = () => {
    setShowGuide(true);
    setFeedback('Pista visual activada. Observa los aros verdes en el tablero.');
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-indigo-500">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  if (!lessonData) return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-white">
      <Target size={64} className="text-slate-700 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Lección no disponible</h2>
      <Link href="/dashboard/chess" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold">Volver al Menú</Link>
    </div>
  );

  const isFreePlay = lessonData.solution === 'FREE_PLAY';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col md:flex-row">
      {/* PANEL IZQUIERDO */}
      <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/80 shadow-2xl z-20 overflow-y-auto">
        <Link href="/dashboard/chess" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 font-bold text-sm bg-slate-800/50 self-start px-4 py-2 rounded-lg border border-slate-700/50">
          <ArrowLeft size={16} /> Salir al Menú
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isFreePlay ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
              {isFreePlay ? 'Sandbox Mode' : 'Tactics Mode'}
            </div>
            {!isFreePlay && mistakes > 0 && (
              <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> {mistakes} Errores
              </div>
            )}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
            {lessonData.title}
          </h1>

          <div className="bg-[#131B2C] p-6 rounded-2xl border border-slate-700/50 mb-6 shadow-inner">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              {isFreePlay ? <Bot size={14} className="text-emerald-400" /> : <HelpCircle size={14} className="text-indigo-400" />} 
              Instrucción
            </h3>
            <p className="text-lg font-medium text-slate-200 leading-relaxed">
              {lessonData.instruction}
            </p>
          </div>

          <div className={`p-5 rounded-2xl border shadow-lg flex gap-4 transition-colors ${status === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : status === 'wrong' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'}`}>
            {status === 'correct' ? <CheckCircle2 className="shrink-0 w-6 h-6" /> : status === 'wrong' ? <XCircle className="shrink-0 w-6 h-6" /> : <Lightbulb className="shrink-0 w-6 h-6" />}
            <div>
              <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">
                {status === 'correct' ? '¡Perfecto!' : status === 'wrong' ? 'Intenta de Nuevo' : 'Análisis Activo'}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">{feedback}</p>
            </div>
          </div>
        </div>

        {/* BOTONERA */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3 shrink-0">
          {status === 'correct' || status === 'gameover' ? (
            <button onClick={() => router.push('/dashboard/chess')} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-xl font-black text-sm uppercase shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
              Continuar Ruta <ChevronRight size={18} />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleReset} className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm border border-slate-700 flex items-center justify-center gap-2">
                <RotateCcw size={16} /> Reiniciar
              </button>
              {!isFreePlay && (
                <button onClick={forceHint} disabled={showGuide} className="py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl font-bold text-sm border border-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                  <Lightbulb size={16} /> Ver Guía
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO (TABLERO TITANIUM) */}
      <div className="flex-1 bg-[#0F1523] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-[600px] lg:max-w-[750px] aspect-square">
          <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/20 via-slate-800 to-emerald-500/20 rounded-xl blur-2xl opacity-50 pointer-events-none"></div>
          <div className="relative rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[14px] border-[#1E293B] bg-[#1E293B]">
            <SafeChessboard 
              id="TitaniumBoard"
              position={fen} 
              onPieceDrop={onDrop}
              animationDuration={300}
              
              /* 🔥 ESTILOS NATIVOS TITANIUM 🔥 */
              customDarkSquareStyle={{ backgroundColor: '#475569' }}
              customLightSquareStyle={{ backgroundColor: '#e2e8f0' }}
              
              customSquareStyles={finalSquareStyles}
              arePiecesDraggable={status !== 'correct' && status !== 'gameover'}
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
