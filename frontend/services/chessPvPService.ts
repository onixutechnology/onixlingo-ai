// src/services/chessPvPService.ts
import apiClient from "@/lib/apiClient";

// ─── Types ───────────────────────────────────────────────

export type TimeControl = "bullet" | "blitz" | "rapid" | "classical";

export interface JoinQueuePayload {
    time_control: TimeControl;
    elo_rating: number;
    elo_range?: number;
}

export interface QueueResponse {
    id: string;
    user_id: string;
    time_control: TimeControl;
    elo_rating: number;
    elo_range: number;
    queued_at: string;
    status: "queued" | "matched" | "cancelled";
}

export interface MatchFoundPayload {
    match_id: string;
    opponent_username: string;
    opponent_elo: number;
    your_color: "white" | "black";
    time_control: TimeControl;
    initial_time_sec: number;
    increment_sec: number;
    started_at: string;
}

export interface SendMovePayload {
    san: string;      // Standard Algebraic Notation e.g. "Nf3"
    uci: string;      // UCI notation e.g. "g1f3"
    fen_after: string;
    clock_ms_left: number;
    time_spent_ms: number;
}

export interface MoveAck {
    move_number: number;
    color: "white" | "black";
    san: string;
    clock_ms_left: number;
}

export type GameEventType =
    | "move"
    | "match_found"
    | "game_over"
    | "draw_offer"
    | "clock_update"
    | "opponent_disconnected"
    | "spectator_joined";

export interface GameEvent {
    type: GameEventType;
    payload: unknown;
}

// ─── WebSocket Manager ───────────────────────────────────

/**
 * ChessSocketManager wraps a WebSocket connection for a live match.
 * Usage:
 *   const socket = new ChessSocketManager(matchId, token);
 *   socket.onMove((move) => updateBoard(move));
 *   socket.connect();
 *   socket.sendMove({ san: "e4", uci: "e2e4", ... });
 *   socket.disconnect();
 */
export class ChessSocketManager {
    private ws: WebSocket | null = null;
    private matchId: string;
    private token: string;
    private reconnectAttempts = 0;
    private readonly maxReconnects = 5;

    private handlers: Partial<Record<GameEventType, (payload: unknown) => void>> =
        {};

    constructor(matchId: string, token: string) {
        this.matchId = matchId;
        this.token = token;
    }

    /** Open the WebSocket connection. */
    connect(): void {
        const wsBase =
            process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.onixlingo.com/ws";
        const url = `${wsBase}/chess/matches/${this.matchId}?token=${this.token}`;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const gameEvent: GameEvent = JSON.parse(event.data as string);
                const handler = this.handlers[gameEvent.type];
                handler?.(gameEvent.payload);
            } catch {
                // Silently handle parse errors
            }
        };

        this.ws.onclose = (event) => {
            if (!event.wasClean && this.reconnectAttempts < this.maxReconnects) {
                const delay = Math.pow(2, this.reconnectAttempts) * 500;
                this.reconnectAttempts++;
                setTimeout(() => this.connect(), delay);
            }
        };

        this.ws.onerror = (error) => {
            // Silently handle WS errors
        };
    }

    /** Register a typed event handler. */
    on<T = unknown>(event: GameEventType, handler: (payload: T) => void): void {
        this.handlers[event] = handler as (payload: unknown) => void;
    }

    /** Convenience alias: receive opponent moves. */
    onMove(handler: (move: MoveAck) => void): void {
        this.on<MoveAck>("move", handler);
    }

    /** Convenience alias: game over event. */
    onGameOver(
        handler: (result: { result: string; termination: string }) => void
    ): void {
        this.on("game_over", handler);
    }

    /** Send a move to the server. */
    sendMove(payload: SendMovePayload): void {
        this.send("move", payload);
    }

    /** Offer or accept a draw. */
    sendDrawOffer(): void {
        this.send("draw_offer", {});
    }

    /** Resign the game. */
    sendResign(): void {
        this.send("resign", {});
    }

    private send(type: string, payload: unknown): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }

    /** Cleanly close the connection. */
    disconnect(): void {
        this.ws?.close(1000, "User left");
        this.ws = null;
    }
}

// ─── REST API Functions ──────────────────────────────────

/** Join the matchmaking queue. Returns queue position immediately. */
export async function joinMatchmakingQueue(
    payload: JoinQueuePayload
): Promise<QueueResponse> {
    const { data } = await apiClient.post<QueueResponse>(
        "/chess/matchmaking/join",
        payload
    );
    return data;
}

/** Leave the queue before a match is found. */
export async function leaveMatchmakingQueue(): Promise<void> {
    await apiClient.delete("/chess/matchmaking/leave");
}

/** Poll queue status (fallback when WebSocket is unavailable). */
export async function pollQueueStatus(): Promise<QueueResponse> {
    const { data } = await apiClient.get<QueueResponse>(
        "/chess/matchmaking/status"
    );
    return data;
}

/** Fetch a completed match record for post-game analysis. */
export async function getMatchById(matchId: string): Promise<{
    id: string;
    pgn: string;
    result: string;
    termination: string;
    white_player: { username: string; elo: number };
    black_player: { username: string; elo: number };
    moves: MoveAck[];
}> {
    const { data } = await apiClient.get(`/chess/matches/${matchId}`);
    return data;
}

/** Fetch the user's ELO history for a given time control. */
export async function getEloHistory(
    userId: string,
    timeControl: TimeControl
): Promise<{ recorded_at: string; elo_after: number; delta: number }[]> {
    const { data } = await apiClient.get(
        `/chess/users/${userId}/elo-history`,
        { params: { time_control: timeControl } }
    );
    return data;
}
