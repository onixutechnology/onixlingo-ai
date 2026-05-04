// src/store/usePvPStore.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { TimeControl, MoveAck, MatchFoundPayload } from "@/services/chessPvPService";

// ─── Types ───────────────────────────────────────────────

export type MatchStatus =
    | "idle"
    | "queuing"
    | "matched"
    | "playing"
    | "game_over"
    | "aborted";

export type WsStatus = "disconnected" | "connecting" | "connected" | "error";

export interface CapturedPieces {
    white: string[]; // pieces captured BY white (i.e. black's lost pieces)
    black: string[]; // pieces captured BY black (i.e. white's lost pieces)
}

export interface PlayerInfo {
    userId: string;
    username: string;
    elo: number;
    color: "white" | "black";
}

export interface GameOverPayload {
    result: "1-0" | "0-1" | "1/2-1/2" | "aborted";
    termination: string; // "checkmate" | "timeout" | "resign" | "draw_agreement"
    white_elo_delta: number;
    black_elo_delta: number;
}

// ─── State Shape ─────────────────────────────────────────

interface PvPState {
    // Match identity
    matchId: string | null;
    matchStatus: MatchStatus;
    timeControl: TimeControl | null;
    initialTimeSec: number;
    incrementSec: number;

    // Players
    localPlayer: PlayerInfo | null;
    opponent: PlayerInfo | null;

    // Board state
    fen: string;                    // current position
    moveHistory: MoveAck[];         // ordered list of acknowledged moves
    pgn: string;                    // accumulative PGN string
    capturedPieces: CapturedPieces;
    lastMove: { from: string; to: string } | null;

    // Clocks (milliseconds)
    whiteClockMs: number;
    blackClockMs: number;
    activeColor: "white" | "black";
    clockRunning: boolean;

    // Draw / result
    drawOffered: boolean;
    drawOfferedBy: "white" | "black" | null;
    gameOver: GameOverPayload | null;

    // WebSocket
    wsStatus: WsStatus;
    queueId: string | null;
}

// ─── Actions Shape ───────────────────────────────────────

interface PvPActions {
    // Queue
    setQueueId: (id: string) => void;
    setMatchStatus: (status: MatchStatus) => void;
    setWsStatus: (status: WsStatus) => void;

    // Match setup
    initMatch: (payload: MatchFoundPayload, localUserId: string, localUsername: string, localElo: number) => void;

    // Live gameplay
    applyOpponentMove: (move: MoveAck & { fen_after: string; clock_ms_left: number }) => void;
    applyLocalMove: (
        san: string,
        uci: string,
        fenAfter: string,
        clockMsLeft: number,
        capturedPiece?: string
    ) => void;
    tickClock: (color: "white" | "black", remainingMs: number) => void;
    setActiveColor: (color: "white" | "black") => void;

    // Draw
    offerDraw: (by: "white" | "black") => void;
    clearDrawOffer: () => void;

    // Game over
    setGameOver: (payload: GameOverPayload) => void;

    // Reset
    resetMatch: () => void;
}

// ─── Initial State ────────────────────────────────────────

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialState: PvPState = {
    matchId: null,
    matchStatus: "idle",
    timeControl: null,
    initialTimeSec: 0,
    incrementSec: 0,
    localPlayer: null,
    opponent: null,
    fen: INITIAL_FEN,
    moveHistory: [],
    pgn: "",
    capturedPieces: { white: [], black: [] },
    lastMove: null,
    whiteClockMs: 0,
    blackClockMs: 0,
    activeColor: "white",
    clockRunning: false,
    drawOffered: false,
    drawOfferedBy: null,
    gameOver: null,
    wsStatus: "disconnected",
    queueId: null,
};

// ─── Store ────────────────────────────────────────────────

export const usePvPStore = create<PvPState & PvPActions>()(
    devtools(
        subscribeWithSelector((set, get) => ({
            ...initialState,

            // ── Queue ──────────────────────────────────────────

            setQueueId: (id) => set({ queueId: id }, false, "setQueueId"),

            setMatchStatus: (status) =>
                set({ matchStatus: status }, false, "setMatchStatus"),

            setWsStatus: (status) =>
                set({ wsStatus: status }, false, "setWsStatus"),

            // ── Match Setup ────────────────────────────────────

            initMatch: (payload, localUserId, localUsername, localElo) => {
                const localColor = payload.your_color;
                const opponentColor = localColor === "white" ? "black" : "white";
                const totalMs = payload.initial_time_sec * 1000;

                set(
                    {
                        matchId: payload.match_id,
                        matchStatus: "playing",
                        timeControl: payload.time_control,
                        initialTimeSec: payload.initial_time_sec,
                        incrementSec: payload.increment_sec,
                        localPlayer: {
                            userId: localUserId,
                            username: localUsername,
                            elo: localElo,
                            color: localColor,
                        },
                        opponent: {
                            userId: "",                           // populated via WS player_info event
                            username: payload.opponent_username,
                            elo: payload.opponent_elo,
                            color: opponentColor,
                        },
                        fen: INITIAL_FEN,
                        moveHistory: [],
                        pgn: "",
                        capturedPieces: { white: [], black: [] },
                        whiteClockMs: totalMs,
                        blackClockMs: totalMs,
                        activeColor: "white",
                        clockRunning: true,
                        gameOver: null,
                        drawOffered: false,
                        drawOfferedBy: null,
                    },
                    false,
                    "initMatch"
                );
            },

            // ── Live Gameplay ──────────────────────────────────

            applyOpponentMove: (move) =>
                set(
                    (state) => {
                        const nextColor: "white" | "black" =
                            move.color === "white" ? "black" : "white";
                        return {
                            fen: move.fen_after,
                            moveHistory: [...state.moveHistory, move],
                            pgn: state.pgn
                                ? `${state.pgn} ${move.san}`
                                : move.san,
                            lastMove: null,           // decoded from UCI by board component
                            whiteClockMs:
                                move.color === "white" ? move.clock_ms_left : state.whiteClockMs,
                            blackClockMs:
                                move.color === "black" ? move.clock_ms_left : state.blackClockMs,
                            activeColor: nextColor,
                        };
                    },
                    false,
                    "applyOpponentMove"
                ),

            applyLocalMove: (san, uci, fenAfter, clockMsLeft, capturedPiece) =>
                set(
                    (state) => {
                        const color = state.localPlayer?.color ?? "white";
                        const nextColor: "white" | "black" =
                            color === "white" ? "black" : "white";
                        const newCaptures = { ...state.capturedPieces };
                        if (capturedPiece) {
                            newCaptures[color] = [...newCaptures[color], capturedPiece];
                        }
                        const moveAck: MoveAck = {
                            move_number: state.moveHistory.length + 1,
                            color,
                            san,
                            clock_ms_left: clockMsLeft,
                        };
                        return {
                            fen: fenAfter,
                            moveHistory: [...state.moveHistory, moveAck],
                            pgn: state.pgn ? `${state.pgn} ${san}` : san,
                            capturedPieces: newCaptures,
                            lastMove: { from: uci.slice(0, 2), to: uci.slice(2, 4) },
                            whiteClockMs:
                                color === "white" ? clockMsLeft : state.whiteClockMs,
                            blackClockMs:
                                color === "black" ? clockMsLeft : state.blackClockMs,
                            activeColor: nextColor,
                        };
                    },
                    false,
                    "applyLocalMove"
                ),

            tickClock: (color, remainingMs) =>
                set(
                    color === "white"
                        ? { whiteClockMs: remainingMs }
                        : { blackClockMs: remainingMs },
                    false,
                    "tickClock"
                ),

            setActiveColor: (color) =>
                set({ activeColor: color }, false, "setActiveColor"),

            // ── Draw ───────────────────────────────────────────

            offerDraw: (by) =>
                set({ drawOffered: true, drawOfferedBy: by }, false, "offerDraw"),

            clearDrawOffer: () =>
                set(
                    { drawOffered: false, drawOfferedBy: null },
                    false,
                    "clearDrawOffer"
                ),

            // ── Game Over ──────────────────────────────────────

            setGameOver: (payload) =>
                set(
                    { gameOver: payload, matchStatus: "game_over", clockRunning: false },
                    false,
                    "setGameOver"
                ),

            // ── Reset ──────────────────────────────────────────

            resetMatch: () => set(initialState, false, "resetMatch"),
        })),
        { name: "PvPStore" }
    )
);

// ─── Selectors (memoised outside component render) ───────

export const selectLocalColor = (s: PvPState) =>
    s.localPlayer?.color ?? "white";

export const selectOpponentClock = (s: PvPState) =>
    s.localPlayer?.color === "white" ? s.blackClockMs : s.whiteClockMs;

export const selectLocalClock = (s: PvPState) =>
    s.localPlayer?.color === "white" ? s.whiteClockMs : s.blackClockMs;

export const selectIsLocalTurn = (s: PvPState) =>
    s.activeColor === s.localPlayer?.color;

export const selectMoveCount = (s: PvPState) => s.moveHistory.length;
