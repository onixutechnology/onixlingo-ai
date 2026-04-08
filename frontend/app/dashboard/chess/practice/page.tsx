'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import confetti from 'canvas-confetti';
import { Chess, type Square, type Move } from 'chess.js';
import { Chessboard } from 'react-chessboard';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';
const FALLBACK_FEN = '3k4/8/8/3p4/8/8/8/3R2K1 w - - 0 1';
const START_FEN = 'start';

type LessonData = {
  id?: string | number;
  title?: string;
  instruction?: string;
  explanation?: string;
  fen?: string;
  solution?: string;
};

type ArenaStatus = 'playing' | 'correct' | 'wrong' | 'gameover';

function sanitizeFEN(fen?: string | null) {
  if (!fen || typeof fen !== 'string' || !fen.trim()) return START_FEN;
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

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [fen, setFen] = useState<string>(START_FEN);
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

  const saveProgress = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token || !lessonId) return;

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

  const syncBoardFromGame = useCallback(() => {
    setFen(gameRef.current.fen());
  }, []);

  const loadLessonPosition = useCallback((data: LessonData) => {
    const safeFen = sanitizeFEN(data?.fen);

    try {
      if (safeFen === START_FEN) {
        gameRef.current = new Chess();
      } else {
        const nextGame = new Chess();
        nextGame.load(safeFen);
        gameRef.current = nextGame;
      }
      setFen(gameRef.current.fen());
      setStatus('playing');
      setMistakes(0);
      setShowGuide(false);
      setLastMoveSquares({});
      setIsBotThinking(false);
      setFeedback('Analiza el tablero y realiza tu movimiento.');
    } catch (error) {
      console.error('Error cargando posición:', error);
      const fallbackGame = new Chess();
      fallbackGame.load(FALLBACK_FEN);
      gameRef.current = fallbackGame;
      setFen(gameRef.current.fen());
      setFeedback('Se cargó una posición de respaldo por seguridad.');
    }
  }, []);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setIsLoading(false);
        setLessonData(null);
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
          method: 'GET',
          headers: {
            Authorization: safeToken,
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });

        if (!res.ok) {
          throw new Error(`No se pudo cargar la lección: ${res.status}`);
        }

        const data: LessonData = await res.json();

        if (!mountedRef.current) return;

        setLessonData(data);
        loadLessonPosition(data);
      } catch (error) {
        console.error('Error cargando lección:', error);
        if (mountedRef.current) {
          setLessonData(null);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchLesson();
  }, [lessonId, loadLessonPosition, router]);

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

    await new Promise((resolve) => setTimeout(resolve, 350));

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
    syncBoardFromGame();
    setIsBotThinking(false);

    if (gameRef.current.isGameOver()) {
      setStatus('gameover');
      setFeedback('¡Fin de la partida!');
      await saveProgress();
      return;
    }

    setStatus('playing');
    setFeedback('Tu turno.');
  }, [isFreePlay, saveProgress, syncBoardFromGame]);

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      if (!lessonData) return false;
      if (isBotThinking) return false;
      if (status === 'correct' || status === 'gameover') return false;
      if (gameRef.current.isGameOver()) return false;

      let moveResult: Move | null = null;

      try {
        moveResult = gameRef.current.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        });
      } catch {
        return false;
      }

      if (!moveResult) return false;

      setLastMoveSquares({ from: sourceSquare, to: targetSquare });
      syncBoardFromGame();

      if (isFreePlay) {
        if (gameRef.current.isGameOver()) {
          setStatus('gameover');
          setFeedback('¡Fin de la partida!');
          void saveProgress();
          return true;
        }

        void playBotMove();
        return true;
      }

      const moveUci = `${sourceSquare}${targetSquare}`;
      const moveSan = moveResult.san?.trim();
      const solution = lessonData.solution?.trim();

      if (solution && (solution === moveUci || solution === moveSan)) {
        setStatus('correct');
        setShowGuide(false);
        setFeedback(lessonData.explanation || '¡Brillante! Solución encontrada.');
        confetti({
          particleCount: 160,
          spread: 85,
          colors: ['#4ade80', '#818cf8', '#facc15'],
        });
        void saveProgress();
        return true;
      }

      gameRef.current.undo();
      syncBoardFromGame();
      setLastMoveSquares({});
      setMistakes((prev) => prev + 1);
      setStatus('wrong');
      setFeedback('Movimiento incorrecto. Analiza bien el tablero.');
      return false;
    },
    [isBotThinking, isFreePlay, lessonData, playBotMove, saveProgress, status, syncBoardFromGame]
  );

  const handleReset = useCallback(() => {
    if (!lessonData) return;
    loadLessonPosition(lessonData);
    setFeedback('Tablero reiniciado. Analiza tu jugada.');
  }, [lessonData, loadLessonPosition]);

  const forceHint = useCallback(() => {
    setShowGuide(true);
    setFeedback('Pista visual activada. Observa los cuadros verdes.');
  }, []);

  const finalSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (lastMoveSquares.from) {
      styles[lastMoveSquares.from] = {
        backgroundColor: 'rgba(250, 204, 21, 0.35)',
      };
    }

    if (lastMoveSquares.to) {
      styles[lastMoveSquares.to] = {
        backgroundColor: 'rgba(250, 204, 21, 0.35)',
      };
    }

    if (showGuide && lessonData?.solution && lessonData.solution !== 'FREE_PLAY') {
      const solution = lessonData.solution.trim();

      if (/^[a-h][1-8][a-h][1-8]$/.test(solution)) {
        const fromSq = solution.slice(0, 2);
        const toSq = solution.slice(2, 4);

        styles[fromSq] = {
          ...(styles[fromSq] || {}),
          boxShadow: 'inset 0 0 0 4px #34d399',
        };

        styles[toSq] = {
          ...(styles[toSq] || {}),
          boxShadow: 'inset 0 0 0 4px #34d399',
        };
      }
    }

    return styles;
  }, [lastMoveSquares, lessonData, showGuide]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-white px-6 text-center">
        <Target size={64} className="text-slate-700 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Lección no disponible</h2>
        <p className="text-slate-400 mb-6">No pudimos cargar la práctica de ajedrez.</p>
        <Link
          href="/dashboard/chess"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold"
        >
          Volver al Menú
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col md:flex-row relative">
      <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/80 shadow-2xl z-20 overflow-y-auto">
        <Link
          href="/dashboard/chess"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 font-bold text-sm bg-slate-800/50 self-start px-4 py-2 rounded-lg border border-slate-700/50"
        >
          <ArrowLeft size={16} /> Salir al Menú
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div
              className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                isFreePlay
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {isFreePlay ? 'Sandbox Mode' : 'Tactics Mode'}
            </div>

            {!isFreePlay && mistakes > 0 && (
              <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> {mistakes} Errores
              </div>
            )}

            {isBotThinking && (
              <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> IA pensando
              </div>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
            {lessonData.title || 'Chess Practice'}
          </h1>

          <div className="bg-[#131B2C] p-6 rounded-2xl border border-slate-700/50 mb-6 shadow-inner">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              {isFreePlay ? (
                <Bot size={14} className="text-emerald-400" />
              ) : (
                <HelpCircle size={14} className="text-indigo-400" />
              )}
              Instrucción
            </h3>
            <p className="text-lg font-medium text-slate-200 leading-relaxed">
              {lessonData.instruction || 'Juega la posición mostrada en el tablero.'}
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border shadow-lg flex gap-4 transition-colors ${
              status === 'correct'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : status === 'wrong'
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
            }`}
          >
            {status === 'correct' ? (
              <CheckCircle2 className="shrink-0 w-6 h-6" />
            ) : status === 'wrong' ? (
              <XCircle className="shrink-0 w-6 h-6" />
            ) : (
              <Lightbulb className="shrink-0 w-6 h-6" />
            )}

            <div>
              <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">
                {status === 'correct'
                  ? '¡Perfecto!'
                  : status === 'wrong'
                  ? 'Intenta de Nuevo'
                  : status === 'gameover'
                  ? 'Partida Terminada'
                  : 'Análisis Activo'}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">{feedback}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3 shrink-0">
          {status === 'correct' || status === 'gameover' ? (
            <button
              onClick={() => router.push('/dashboard/chess')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-xl font-black text-sm uppercase shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              Continuar Ruta <ChevronRight size={18} />
            </button>
          ) : (
            <div className={`grid gap-3 ${isFreePlay ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <button
                onClick={handleReset}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm border border-slate-700 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Reiniciar
              </button>

              {!isFreePlay && (
                <button
                  onClick={forceHint}
                  disabled={showGuide}
                  className="py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl font-bold text-sm border border-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lightbulb size={16} /> Ver Guía
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-[#0F1523] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[600px] lg:max-w-[750px] aspect-square">
          <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/20 via-slate-800 to-emerald-500/20 rounded-xl blur-2xl opacity-50 pointer-events-none" />

          <div className="relative rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[14px] border-[#1E293B] bg-[#1E293B]">
            <Chessboard
              id="onixlingo-practice-board"
              position={fen}
              onPieceDrop={onDrop}
              boardWidth={560}
              animationDuration={250}
              arePiecesDraggable={status !== 'correct' && status !== 'gameover' && !isBotThinking}
              boardOrientation="white"
              autoPromoteToQueen
              customDarkSquareStyle={{ backgroundColor: '#475569' }}
              customLightSquareStyle={{ backgroundColor: '#e2e8f0' }}
              customSquareStyles={finalSquareStyles}
              customBoardStyle={{
                borderRadius: '6px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-indigo-500">
          <Loader2 className="animate-spin" size={48} />
        </div>
      }
    >
      <PracticeArena />
    </Suspense>
  );
}