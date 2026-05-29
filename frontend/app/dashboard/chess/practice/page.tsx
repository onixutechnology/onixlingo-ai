'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import confetti from 'canvas-confetti';
import { Chess, type Move, type Square } from 'chess.js';
import CustomChessboard from '@/components/chess/CustomChessboard';
import { useUIStore } from '@/store/uiStore';
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Loader2,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
const FALLBACK_FEN = '3k4/8/8/3p4/8/8/8/3R2K1 w - - 0 1';

type LessonData = {
  id?: string | number;
  title?: string;
  instruction?: string;
  explanation?: string;
  fen?: string;
  solution?: string;
};

type ArenaStatus = 'playing' | 'correct' | 'wrong' | 'gameover';

function sanitizeFEN(fen?: string | null): string {
  if (!fen || typeof fen !== 'string' || !fen.trim()) return 'start';
  try {
    const test = new Chess();
    test.load(fen.trim());
    return fen.trim();
  } catch {
    return FALLBACK_FEN;
  }
}

function PracticeArena() {
  const params = useSearchParams();
  const router = useRouter();
  const lessonId = params.get('lessonId');
  const { userTier, energy, chessPuzzlesToday, checkAndResetDailyLimits } = useUIStore();

  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [fen, setFen] = useState('start');
  const [status, setStatus] = useState<ArenaStatus>('playing');
  const [feedback, setFeedback] = useState('Analiza el tablero y realiza tu movimiento.');
  const [mistakes, setMistakes] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [lastMoveSquares, setLastMoveSquares] = useState<{ from?: string; to?: string }>({});

  const gameRef = useRef(new Chess());
  const mountedRef = useRef(true);

  const isFreePlay = lessonData?.solution === 'FREE_PLAY';

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const syncFen = useCallback(() => {
    setFen(gameRef.current.fen());
  }, []);

  const saveProgress = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token || !lessonId) return;

    // Consume 10% de energía si es plan gratuito e incrementa el contador
    const { consumeEnergy, addChessPuzzle, userTier } = useUIStore.getState();
    if (userTier === 'free') {
      consumeEnergy(20);
      addChessPuzzle();
    }

    try {
      await fetch(`${API_URL}/api/v1/chess/progress`, {
        method: 'POST',
        headers: {
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          status: 'completed',
        }),
      });
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  }, [lessonId]);

  const loadPosition = useCallback((data: LessonData) => {
    const safeFen = sanitizeFEN(data?.fen);
    try {
      const nextGame = new Chess();
      if (safeFen !== 'start') {
        nextGame.load(safeFen);
      }
      gameRef.current = nextGame;
      setFen(nextGame.fen());
      setStatus('playing');
      setMistakes(0);
      setShowGuide(false);
      setLastMoveSquares({});
      setIsBotThinking(false);
      setFeedback('Analiza el tablero y realiza tu movimiento.');
    } catch (error) {
      console.error('Error cargando FEN:', error);
      const fallback = new Chess();
      fallback.load(FALLBACK_FEN);
      gameRef.current = fallback;
      setFen(fallback.fen());
      setFeedback('Se cargó una posición segura de respaldo.');
    }
  }, []);

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
        const res = await fetch(`${API_URL}/api/v1/chess/lessons/${lessonId}`, {
          headers: {
            Authorization: safeToken,
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: LessonData = await res.json();
        
        if (!mountedRef.current) return;
        setLessonData(data);
        loadPosition(data);
      } catch (error) {
        console.error('Error cargando lección:', error);
        if (mountedRef.current) setLessonData(null);
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, loadPosition, router]);

  useEffect(() => {
    if (!isFreePlay && mistakes >= 3) {
      setShowGuide(true);
      setFeedback('¡Guía visual activada! Observa los cuadros marcados en verde.');
    }
  }, [mistakes, isFreePlay]);

  const playBotMove = useCallback(async () => {
    if (!isFreePlay || gameRef.current.isGameOver()) return;

    setIsBotThinking(true);
    setFeedback('La IA está pensando...');

    await new Promise((resolve) => setTimeout(resolve, 400));
    const legalMoves = gameRef.current.moves({ verbose: true }) as Move[];

    if (legalMoves.length === 0) {
      setIsBotThinking(false);
      setStatus('gameover');
      setFeedback('¡Fin de la partida!');
      await saveProgress();
      return;
    }

    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    gameRef.current.move({
      from: randomMove.from,
      to: randomMove.to,
      promotion: randomMove.promotion ?? 'q',
    });

    setLastMoveSquares({ from: randomMove.from, to: randomMove.to });
    syncFen();
    setIsBotThinking(false);

    if (gameRef.current.isGameOver()) {
      setStatus('gameover');
      setFeedback('¡Fin de la partida!');
      await saveProgress();
      return;
    }

    setStatus('playing');
    setFeedback('Tu turno.');
  }, [isFreePlay, saveProgress, syncFen]);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: Square; targetSquare: Square }) => {
      if (!lessonData || isBotThinking || status === 'correct' || status === 'gameover' || !targetSquare || gameRef.current.isGameOver()) return;

      let moveResult: Move | null = null;
      try {
        moveResult = gameRef.current.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        });
      } catch {
        return;
      }

      if (!moveResult) return;

      setLastMoveSquares({ from: sourceSquare, to: targetSquare });
      syncFen();

      if (isFreePlay) {
        if (gameRef.current.isGameOver()) {
          setStatus('gameover');
          setFeedback('¡Fin de la partida!');
          void saveProgress();
          return;
        }
        void playBotMove();
        return;
      }

      const moveUci = `${sourceSquare}${targetSquare}`;
      const moveSan = moveResult.san?.trim() || '';
      const solution = lessonData.solution?.trim() || '';

      if (solution && (solution === moveUci || solution === moveSan)) {
        setStatus('correct');
        setShowGuide(false);
        setFeedback(lessonData.explanation || '¡Brillante! Solución encontrada.');
        confetti({
          particleCount: 180,
          spread: 90,
          colors: ['#4ade80', '#818cf8', '#facc15'],
        });
        void saveProgress();
        return;
      }

      gameRef.current.undo();
      syncFen();
      setLastMoveSquares({});
      setMistakes((prev) => prev + 1);
      setStatus('wrong');
      setFeedback('Movimiento incorrecto. Analiza bien el tablero.');
    },
    [isBotThinking, isFreePlay, lessonData, playBotMove, saveProgress, status, syncFen]
  );

  const handleReset = useCallback(() => {
    if (!lessonData) return;
    loadPosition(lessonData);
    setFeedback('Tablero reiniciado. Analiza tu jugada.');
  }, [lessonData, loadPosition]);

  const forceHint = useCallback(() => {
    setShowGuide(true);
    setFeedback('Pista visual activada. Observa los cuadros verdes.');
  }, []);

  // Preparar pista visual de la solución (si showGuide está activo)
  const solutionHint = useMemo(() => {
    if (showGuide && lessonData?.solution && lessonData.solution !== 'FREE_PLAY') {
      const solution = lessonData.solution.trim();
      if (/^[a-h][1-8][a-h][1-8]$/.test(solution)) {
        return {
          from: solution.slice(0, 2),
          to: solution.slice(2, 4),
        };
      }
    }
    return null;
  }, [showGuide, lessonData]);

  if (userTier === 'free' && (chessPuzzlesToday >= 5 || energy < 20)) {
    return (
      <div className="min-h-screen wood-theme-bg flex items-center justify-center text-[#ecd3b5] p-6 relative overflow-hidden font-sans">
        <style>{`
          .wood-theme-bg {
            background-color: #130a04;
            background-image: 
              repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 160px, rgba(0,0,0,0.3) 160px, rgba(0,0,0,0.3) 162px),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 90px, rgba(0,0,0,0.25) 90px, rgba(0,0,0,0.25) 92px),
              linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
          }
          .wood-panel {
            background: #25140b;
            border: 3px solid #3c1e0a;
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.03), inset 0 -4px 10px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.6);
          }
        `}</style>
        
        <div className="wood-panel p-10 max-w-md w-full shadow-2xl rounded-none text-center relative z-10 animate-in fade-in">
          <div className="w-16 h-16 bg-[#3c1e0a] border border-[#502b16] text-amber-500 flex items-center justify-center mx-auto mb-6">
            <Target size={32} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-serif font-black italic uppercase tracking-wider text-amber-400 mb-2">
            {chessPuzzlesToday >= 5 ? "Límite Diario de Puzzles" : "Energía Insuficiente"}
          </h2>
          <p className="text-[10px] text-slate-350 leading-relaxed mb-8 uppercase tracking-wider">
            {chessPuzzlesToday >= 5 
              ? "En el Plan Free estás limitado a resolver 5 puzzles de ajedrez al día." 
              : `Cada puzzle de ajedrez consume 20% de energía. Tu energía actual es de ${energy}%.`}
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/dashboard/pricing')}
              className="w-full py-4 bg-[#ecd3b5] hover:bg-[#fbf8f0] text-[#1e130c] font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none border border-[#fbf8f0] shadow-lg shadow-black/40"
            >
              Subir a Pro / Executive
            </button>
            <button 
              onClick={() => router.push('/dashboard/chess')}
              className="w-full py-3 border border-[#502b16] bg-transparent text-slate-450 hover:text-white font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c0d02] flex items-center justify-center text-amber-500">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen wood-theme-bg flex flex-col items-center justify-center text-[#ecd3b5] px-6 text-center rounded-none">
        <style>{`
          .wood-theme-bg {
            background-color: #130a04;
            background-image: 
              repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 160px, rgba(0,0,0,0.3) 160px, rgba(0,0,0,0.3) 162px),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 90px, rgba(0,0,0,0.25) 90px, rgba(0,0,0,0.25) 92px),
              linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
          }
        `}</style>
        <Target size={64} className="text-[#3c1e0a] mb-6" />
        <h2 className="text-2xl font-bold mb-2">Lección no disponible</h2>
        <p className="text-slate-300 mb-6">No pudimos cargar la práctica de ajedrez.</p>
        <Link href="/dashboard/chess" className="px-6 py-3 bg-[#ecd3b5] text-[#1e130c] border border-[#fbf8f0] rounded-none font-bold">
          Volver al Menú
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen wood-theme-bg text-[#ecd3b5] font-sans flex flex-col md:flex-row relative rounded-none">
      <style>{`
        .wood-theme-bg {
          background-color: #130a04;
          background-image: 
            repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 160px, rgba(0,0,0,0.3) 160px, rgba(0,0,0,0.3) 162px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 90px, rgba(0,0,0,0.25) 90px, rgba(0,0,0,0.25) 92px),
            linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
        }
        .wood-panel {
          background: #25140b;
          border: 3px solid #3c1e0a;
          box-shadow: inset 0 2px 5px rgba(255,255,255,0.03), inset 0 -4px 10px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.6);
        }
        .wood-panel-light {
          background: #361d0f;
          border: 2px solid #502b16;
          box-shadow: inset 0 1px 3px rgba(255,255,255,0.03), inset 0 -2px 5px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.4);
        }
      `}</style>

      <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-[#3c1e0a]/60 bg-[#25140b]/90 shadow-2xl z-20 overflow-y-auto rounded-none">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/chess" className="inline-flex items-center gap-2 text-[#ecd3b5] hover:text-white font-bold text-sm bg-[#361d0f] px-4 py-2 rounded-none border border-[#502b16]">
            <ArrowLeft size={16} /> Salir al Menú
          </Link>
          {userTier === 'free' ? (
            <div className="flex items-center">
              {/* Cuerpo de la Batería */}
              <div className="relative w-14 h-5 bg-slate-950 rounded-[4px] border border-slate-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                <div 
                  className={`h-full rounded-[2px] transition-all duration-500 ${
                    energy > 50 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                      : energy > 20 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                        : 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                  }`}
                  style={{ width: `${energy}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white font-mono leading-none tracking-wider drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)]">
                  {energy}%
                </span>
              </div>
              {/* Polo Positivo */}
              <div className="w-[3px] h-2.5 bg-slate-700 rounded-r-[2px] -ml-[1px] shadow-sm shrink-0" />
            </div>
          ) : (
            <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400">Energía Ilimitada</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className={`px-3 py-1 rounded-none border text-[10px] font-black uppercase tracking-widest ${isFreePlay ? 'bg-emerald-950/60 text-emerald-350 border-emerald-800/40' : 'bg-amber-950/60 text-amber-300 border-amber-800/40'}`}>
              {isFreePlay ? 'Sandbox Mode' : 'Tactics Mode'}
            </div>

            {!isFreePlay && mistakes > 0 && (
              <div className="px-3 py-1 rounded-none bg-red-955/60 text-red-300 border border-red-800/40 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> {mistakes} Errores
              </div>
            )}

            {isBotThinking && (
              <div className="px-3 py-1 rounded-none bg-amber-955/60 text-amber-300 border border-amber-800/40 text-[10px] font-bold flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> IA pensando
              </div>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
            {lessonData.title || 'Chess Practice'}
          </h1>

          <div className="bg-[#130a04] p-6 rounded-none border border-[#3c1e0a] mb-6 shadow-inner">
            <h3 className="text-xs font-bold text-amber-200/40 uppercase tracking-wider mb-3 flex items-center gap-2">
              {isFreePlay ? <Bot size={14} className="text-emerald-400" /> : <HelpCircle size={14} className="text-amber-400" />}
              Instrucción
            </h3>
            <p className="text-lg font-medium text-slate-200 leading-relaxed">
              {lessonData.instruction || 'Juega la posición mostrada en el tablero.'}
            </p>
          </div>

          <div className={`p-5 rounded-none border shadow-lg flex gap-4 transition-colors ${status === 'correct' ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300' : status === 'wrong' ? 'bg-red-955/60 border-red-800/40 text-red-300' : 'bg-[#361d0f] border-[#502b16] text-[#ecd3b5]'}`}>
            {status === 'correct' ? <CheckCircle2 className="shrink-0 w-6 h-6" /> : status === 'wrong' ? <XCircle className="shrink-0 w-6 h-6" /> : <Lightbulb className="shrink-0 w-6 h-6" />}
            <div>
              <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">
                {status === 'correct' ? '¡Perfecto!' : status === 'wrong' ? 'Intenta de Nuevo' : status === 'gameover' ? 'Partida Terminada' : 'Análisis Activo'}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">{feedback}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#3c1e0a] space-y-3 shrink-0">
          {status === 'correct' || status === 'gameover' ? (
            <button onClick={() => router.push('/dashboard/chess')} className="w-full py-4 bg-[#ecd3b5] hover:bg-[#fbf8f0] text-[#1e130c] rounded-none font-black text-sm uppercase shadow-lg border border-[#fbf8f0] flex items-center justify-center gap-2">
              Continuar Ruta <ChevronRight size={18} />
            </button>
          ) : (
            <div className={`grid gap-3 ${isFreePlay ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <button onClick={handleReset} className="py-3 bg-[#361d0f] hover:bg-[#462614] text-[#ecd3b5] rounded-none font-bold text-sm border border-[#502b16] flex items-center justify-center gap-2">
                <RotateCcw size={16} /> Reiniciar
              </button>

              {!isFreePlay && (
                <button onClick={forceHint} disabled={showGuide} className="py-3 bg-amber-955/60 hover:bg-[#462614] text-amber-400 rounded-none font-bold text-sm border border-amber-800/40 flex items-center justify-center gap-2 disabled:opacity-50">
                  <Lightbulb size={16} /> Ver Guía
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-[#130a04] flex items-center justify-center p-4 md:p-8 relative overflow-hidden rounded-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[600px] lg:max-w-[750px] aspect-square rounded-none">
          <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/5 via-[#25140b] to-amber-500/5 rounded-none blur-3xl opacity-40 pointer-events-none" />

          {/* TABLERO CUSTOM IMPLEMENTADO AQUÍ */}
          <div className="relative rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex justify-center items-center bg-[#3c1e0a] p-2 border-[14px] border-[#3c1e0a]">
            <CustomChessboard
              fen={fen}
              onDrop={onDrop}
              disabled={isBotThinking || status === 'correct' || status === 'gameover'}
              lastMove={lastMoveSquares}
              hint={solutionHint}
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
      <div className="min-h-screen bg-[#1c0d02] flex items-center justify-center text-amber-500 rounded-none">
        <Loader2 className="animate-spin" size={48} />
      </div>
    }>
      <PracticeArena />
    </Suspense>
  );
}
