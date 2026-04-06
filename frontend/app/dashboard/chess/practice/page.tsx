'use client';

/**
 * ==============================================================================
 * ONIXLINGO CHESS ACADEMY - PRACTICE ARENA
 * ==============================================================================
 * RUTA: /dashboard/chess/practice/page.tsx
 * ESTADO: Production Ready (Conectado a FastAPI + Cache Busting)
 * ==============================================================================
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  ArrowLeft, Lightbulb, RotateCcw, CheckCircle2, 
  XCircle, HelpCircle, ChevronRight, Loader2, Target
} from 'lucide-react';

// --- CONFIGURACIÓN API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

function PracticeArena() {
  const params = useSearchParams();
  const router = useRouter();
  const lessonId = params.get('lessonId');
  
  // --- ESTADOS ---
  const [lessonData, setLessonData] = useState<any>(null);
  const [game, setGame] = useState<Chess>(new Chess());
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedback, setFeedback] = useState('');
  const [lastMoveSquares, setLastMoveSquares] = useState<{from?: string, to?: string}>({});
  const [isLoading, setIsLoading] = useState(true);

  // Solución Typescript para Next.js App Router con react-chessboard
  const SafeChessboard = Chessboard as any;

  // --- INICIALIZACIÓN: CONEXIÓN AL BACKEND ---
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setIsLoading(false);
        return;
      }

      try {
        const token = Cookies.get('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        // 🚀 Llamada a producción con Bust de Caché
        const res = await fetch(`${API_URL}/api/v1/chess/lessons/${lessonId}`, {
          headers: {
            'Authorization': safeToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });

        if (res.ok) {
          const data = await res.json();
          setLessonData(data);
          setGame(new Chess(data.fen));
        } else {
          console.error("No se encontró la lección o error de servidor");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, router]);

  // --- MOTOR LÓGICO DE AJEDREZ ---
  function makeMove(move: any) {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      
      if (result) {
        setGame(gameCopy);
        setLastMoveSquares({ from: result.from, to: result.to });
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (status === 'correct') return false; 

    const moveString = sourceSquare + targetSquare;
    const moveAttempt = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', 
    };

    // 1. Verificar si es un movimiento legal de ajedrez
    const isLegalMove = makeMove(moveAttempt);
    if (!isLegalMove) return false; 

    // 2. Verificar si resuelve el puzzle
    if (lessonData && moveString === lessonData.solution) {
      setStatus('correct');
      setFeedback(lessonData.explanation);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 }, colors: ['#4ade80', '#818cf8', '#facc15'] });
      
      // 🚀 POST A PRODUCCIÓN: Guardar el progreso
      saveProgress();

    } else {
      // Movimiento legal pero erróneo para el puzzle
      setStatus('wrong');
      setFeedback('Ese movimiento es válido en el ajedrez, pero no resuelve el problema táctico. Intenta de nuevo.');
      
      setTimeout(() => {
        if (lessonData) {
          setGame(new Chess(lessonData.fen));
          setStatus('idle');
          setFeedback('');
          setLastMoveSquares({});
        }
      }, 2000);
    }
    
    return true;
  }

  // --- FUNCIÓN DE GUARDADO EN BACKEND ---
  const saveProgress = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) return;
      const safeToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      await fetch(`${API_URL}/api/v1/chess/progress`, {
        method: 'POST',
        headers: {
          'Authorization': safeToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          lesson_id: lessonId,
          status: 'completed'
        })
      });
    } catch (error) {
      console.error("Error guardando progreso del ajedrez:", error);
    }
  };

  const handleReset = () => {
    if (lessonData) {
      setGame(new Chess(lessonData.fen));
      setStatus('idle');
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

  // --- RENDERIZADO CONDICIONAL ---
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
        <p className="text-slate-500 mb-8">El código de este puzzle no existe o ha expirado en el servidor.</p>
        <Link href="/dashboard/chess" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors">
          Volver al Lobby
        </Link>
      </div>
    );
  }

  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (lastMoveSquares.from && lastMoveSquares.to) {
    customSquareStyles[lastMoveSquares.from] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    customSquareStyles[lastMoveSquares.to] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* --- PANEL DE INSTRUCCIONES (IZQUIERDA) --- */}
      <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 shadow-2xl z-20 overflow-y-auto">
        <Link href="/dashboard/chess" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors font-bold text-sm bg-slate-800/50 self-start px-4 py-2 rounded-lg border border-slate-700/50">
          <ArrowLeft size={16} /> Salir al Menú
        </Link>

        <div className="flex-1">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest mb-4">
            Práctica Táctica
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
            {lessonData.title}
          </h1>
          
          <div className="bg-[#131B2C] p-6 rounded-2xl border border-slate-700/50 mb-6 shadow-inner">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HelpCircle size={14} className="text-indigo-400" /> Tu Misión
            </h3>
            <p className="text-lg font-medium text-slate-200 leading-relaxed">
              {lessonData.instruction}
            </p>
          </div>

          {/* ÁREA DE FEEDBACK DINÁMICO */}
          <div className={`transition-all duration-500 overflow-hidden ${status !== 'idle' ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
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

        {/* PANEL DE BOTONES */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3 shrink-0">
          {status === 'correct' ? (
            <button 
              onClick={() => router.push('/dashboard/chess')} 
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
            >
              Continuar Ruta <ChevronRight size={18} />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleReset} 
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <RotateCcw size={16} /> Reiniciar
              </button>
              <button 
                onClick={showHint} 
                className="py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl font-bold text-sm border border-indigo-500/30 flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <Lightbulb size={16} /> Ver Pista
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- ÁREA DEL TABLERO (DERECHA) --- */}
      <div className="flex-1 bg-[#0B0F19] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[600px] lg:max-w-[700px] aspect-square">
          <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 rounded-sm blur-2xl opacity-60 pointer-events-none"></div>
          
          <div className="relative rounded-sm overflow-hidden shadow-2xl border-[12px] border-[#18212F] bg-[#18212F]">
            <SafeChessboard 
              id="PracticeArenaBoard"
              position={game.fen()} 
              onPieceDrop={onDrop}
              animationDuration={250}
              customDarkSquareStyle={{ backgroundColor: '#475569' }} 
              customLightSquareStyle={{ backgroundColor: '#cbd5e1' }} 
              customSquareStyles={customSquareStyles}
              arePiecesDraggable={status !== 'correct'}
              customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px rgba(255, 255, 0, 0.5)' }} 
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