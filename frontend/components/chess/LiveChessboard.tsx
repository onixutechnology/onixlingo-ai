'use client';

import { useState, useEffect, useRef } from 'react';
import { Chess, type Square } from 'chess.js';
import CustomChessboard from './CustomChessboard';
import { Loader2, Flag, Handshake } from 'lucide-react';

interface LiveChessboardProps {
  matchId: string;
  token: string; // Token de autenticación para el WebSocket
  initialFen?: string;
  playerColor?: 'w' | 'b'; // 'w' para blancas, 'b' para negras
}

export default function LiveChessboard({ 
  matchId, 
  token, 
  initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  playerColor = 'w'
}: LiveChessboardProps) {
  const [game, setGame] = useState(new Chess(initialFen));
  const [fen, setFen] = useState(initialFen);
  const [status, setStatus] = useState("Conectando al servidor...");
  const [isConnected, setIsConnected] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Relojes (Milisegundos)
  const [whiteTime, setWhiteTime] = useState(300000); // 5 minutos por defecto
  const [blackTime, setBlackTime] = useState(300000);

  useEffect(() => {
    // Configuración de la URL del WebSocket
    const wsBaseUrl = process.env.NODE_ENV === 'production' ? 'wss://api.onixlingo.onixu.company/ws' : 'ws://127.0.0.1:8021/ws';
    const wsUrl = `${wsBaseUrl}/chess/matches/${matchId}?token=${token}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatus("¡Conectado! Esperando tu jugada.");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'move') {
          // El oponente hizo un movimiento
          const newGame = new Chess(data.fen);
          setGame(newGame);
          setFen(data.fen);
          
          if (data.time_white_ms !== undefined) setWhiteTime(data.time_white_ms);
          if (data.time_black_ms !== undefined) setBlackTime(data.time_black_ms);
          
          if (newGame.isCheckmate()) {
             setStatus("¡Jaque Mate!");
             setIsGameOver(true);
          } else if (newGame.isDraw()) {
             setStatus("Empate");
             setIsGameOver(true);
          } else {
             setStatus("Tu turno");
          }
        } else if (data.type === 'resign') {
           setStatus("El oponente se ha rendido. ¡Ganaste!");
           setIsGameOver(true);
        } else if (data.type === 'game_over') {
           if (data.result === 'win') {
              setStatus("El oponente ganó por Jaque Mate.");
           } else {
              setStatus("Partida terminada en tablas.");
           }
           setIsGameOver(true);
        } else if (data.type === 'draw_offer') {
           setStatus("El oponente ofrece tablas.");
        } else if (data.type === 'player_disconnected') {
           setStatus("El oponente se ha desconectado.");
        }
      } catch (err) {
        console.error("Error al procesar el mensaje del WebSocket:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setStatus("Desconectado del servidor.");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [matchId, token]);

  const onDrop = ({ sourceSquare, targetSquare }: { sourceSquare: Square; targetSquare: Square }) => {
    if (isGameOver || !isConnected) return;
    if (game.turn() !== playerColor) {
      setStatus("No es tu turno.");
      return;
    }

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Promoción a reina por defecto para simplificar
      });

      if (!move) return;

      // Actualizar estado local inmediatamente para evitar lag visual
      setGame(gameCopy);
      setFen(gameCopy.fen());

      if (gameCopy.isCheckmate()) {
         setStatus("¡Jaque Mate! Ganaste 🎉");
         setIsGameOver(true);
      } else if (gameCopy.isDraw()) {
         setStatus("Partida terminada en tablas.");
         setIsGameOver(true);
      } else {
         setStatus("Esperando al oponente...");
      }

      // Enviar el movimiento al servidor WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "move",
          move_san: move.san,
          move_uci: move.from + move.to + (move.promotion || ''),
          fen: gameCopy.fen(),
          time_white_ms: whiteTime,
          time_black_ms: blackTime
        }));

        if (gameCopy.isCheckmate()) {
          wsRef.current.send(JSON.stringify({
            type: "game_over",
            result: "win"
          }));
        } else if (gameCopy.isDraw()) {
          wsRef.current.send(JSON.stringify({
            type: "game_over",
            result: "draw"
          }));
        }
      }
    } catch (e) {
      console.warn("Movimiento inválido", e);
    }
  };

  const handleResign = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "resign" }));
      setStatus("Te has rendido.");
      setIsGameOver(true);
    }
  };

  const handleDrawOffer = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "draw_offer" }));
      setStatus("Oferta de tablas enviada.");
    }
  };

  // Formatear el tiempo en milisegundos a MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full rounded-none">
      {/* Status Bar: Conexión y Reloj Oponente */}
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-none ${isConnected ? 'bg-[#D4AF37]/100 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#D4AF37]/100'} ${isConnected ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:block">Conexión Segura</span>
        </div>
        <div className="font-mono text-2xl font-black text-amber-400 wood-panel-light px-4 py-1 rounded-none border border-[#502b16] shadow-inner">
          {formatTime(playerColor === 'w' ? blackTime : whiteTime)}
        </div>
      </div>

      {/* Tablero */}
      <div className="w-full aspect-square mb-6 rounded-none">
        {!isConnected && !fen ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#130a04] rounded-none border border-[#3c1e0a] gap-4">
            <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
            <p className="text-slate-500 font-medium animate-pulse">Conectando a la sala...</p>
          </div>
        ) : (
          <CustomChessboard 
            fen={fen} 
            onDrop={onDrop}
            disabled={isGameOver || !isConnected || game.turn() !== playerColor}
          />
        )}
      </div>

      {/* Info Local & Controles */}
      <div className="w-full space-y-4 rounded-none">
        {/* Status y reloj local */}
        <div className="flex justify-between items-center wood-panel-light p-3 sm:p-4 rounded-none shadow-inner">
          <div className="text-xs sm:text-sm font-bold text-slate-300 max-w-[60%]">
            {status}
          </div>
          <div className="font-mono text-2xl font-black text-amber-300 bg-[#130a04] px-4 py-1 rounded-none border border-[#3c1e0a] shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            {formatTime(playerColor === 'w' ? whiteTime : blackTime)}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button 
            onClick={handleResign}
            disabled={isGameOver || !isConnected}
            className="flex-1 py-3 bg-red-950/40 hover:bg-red-900/40 text-red-400 font-bold rounded-none flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-red-900/30 disabled:opacity-30 disabled:active:scale-100 text-xs sm:text-sm"
          >
            <Flag size={18} /> Rendirse
          </button>
          <button 
            onClick={handleDrawOffer}
            disabled={isGameOver || !isConnected}
            className="flex-1 py-3 bg-amber-950/30 hover:bg-amber-900/30 text-amber-400 font-bold rounded-none flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-amber-800/30 disabled:opacity-30 disabled:active:scale-100 text-xs sm:text-sm"
          >
            <Handshake size={18} /> Tablas
          </button>
        </div>
      </div>
    </div>

  );
}
