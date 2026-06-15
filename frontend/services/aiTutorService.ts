// src/services/aiTutorService.ts
import apiClient from "@/lib/apiClient";

// ─── Types ───────────────────────────────────────────────

export type TutorLanguage = "en" | "fr" | "zh";

export interface ChatSessionCreate {
    language: TutorLanguage;
    title?: string;
    context?: {
        lesson_id?: string;
        topic?: string;
        scenario?: string;
        cefr_level?: string;
    };
}

export interface ChatSessionSummary {
    id: string;
    language: TutorLanguage;
    title: string | null;
    token_count: number;
    is_active: boolean;
    created_at: string;
}

export interface ChatMessage {
    id: string;
    session_id: string;
    role: "user" | "assistant" | "system";
    content: string;
    audio_url: string | null;
    tokens_used: number;
    metadata_json: Record<string, unknown>;
    created_at: string;
}

export interface ChatSessionDetail extends ChatSessionSummary {
    user_id: string;
    closed_at: string | null;
    messages: ChatMessage[];
    updated_at: string | null;
}

export interface SendMessagePayload {
    content: string;
    audio_url?: string;
}

export interface PronunciationEvaluationResult {
    id: string;
    overall_score: number;          // 0–100
    phoneme_scores: Record<string, number>;
    tone_scores: Record<string, number>;  // Chinese tones
    fluency_score: number;
    completeness_pct: number;
    feedback_text: string;
    audio_url: string;
    created_at: string;
}

export interface SRSSessionResult {
    cards_reviewed: number;
    cards_due_tomorrow: number;
    avg_ease_factor: number;
    xp_earned: number;
}

// ─── Session Management ───────────────────────────────────

/** Start a new AI tutor chat session. */
export async function createChatSession(
    payload: ChatSessionCreate
): Promise<ChatSessionDetail> {
    const { data } = await apiClient.post<ChatSessionDetail>(
        "/ai/sessions",
        payload
    );
    return data;
}

/** List all past sessions for the current user (lightweight). */
export async function listChatSessions(params?: {
    language?: TutorLanguage;
    page?: number;
    page_size?: number;
}): Promise<{ items: ChatSessionSummary[]; total: number }> {
    const { data } = await apiClient.get("/ai/sessions", { params });
    return data;
}

/** Get a session with its full message history. */
export async function getChatSession(
    sessionId: string
): Promise<ChatSessionDetail> {
    const { data } = await apiClient.get<ChatSessionDetail>(
        `/ai/sessions/${sessionId}`
    );
    return data;
}

/** Soft-close a session (sets is_active = false). */
export async function closeChatSession(sessionId: string): Promise<void> {
    await apiClient.patch(`/ai/sessions/${sessionId}`, { is_active: false });
}

// ─── Messaging ────────────────────────────────────────────

/**
 * Send a text message to the AI tutor.
 * The server streams back the assistant reply; this function
 * returns the completed assistant ChatMessage once streaming ends.
 */
export async function sendMessage(
    sessionId: string,
    payload: SendMessagePayload
): Promise<ChatMessage> {
    const { data } = await apiClient.post<ChatMessage>(
        `/ai/sessions/${sessionId}/messages`,
        payload
    );
    return data;
}

/**
 * Send a text message and receive the AI response as a ReadableStream.
 * Intended for use with the `useChat` hook for live token-by-token rendering.
 *
 * @example
 * const stream = await streamMessage(sessionId, { content: "Explícame el subjuntivo" });
 * const reader = stream.getReader();
 * while (true) {
 *   const { done, value } = await reader.read();
 *   if (done) break;
 *   appendToken(new TextDecoder().decode(value));
 * }
 */
export async function streamMessage(
    sessionId: string,
    payload: SendMessagePayload
): Promise<ReadableStream<Uint8Array>> {
    const baseUrl =
        process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8020';

    const response = await fetch(
        `${baseUrl}/ai/sessions/${sessionId}/messages/stream`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok || !response.body) {
        throw new Error(`Stream error: ${response.status} ${response.statusText}`);
    }

    return response.body;
}

// ─── Pronunciation Evaluation ─────────────────────────────

/**
 * Upload a recorded audio Blob to the pronunciation evaluator.
 * Sends as multipart/form-data; the backend runs Azure STT + phoneme scoring.
 *
 * @param language  - Target language (en | fr | zh)
 * @param audioBlob - Raw audio blob (webm, wav, or ogg)
 * @param referenceText - The text the user was supposed to pronounce
 */
export async function evaluatePronunciation(
    language: TutorLanguage,
    audioBlob: Blob,
    referenceText: string
): Promise<PronunciationEvaluationResult> {
    const form = new FormData();
    form.append("audio", audioBlob, "recording.webm");
    form.append("reference_text", referenceText);
    form.append("language", language);

    const { data } = await apiClient.post<PronunciationEvaluationResult>(
        "/ai/pronunciation/evaluate",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
}

/**
 * Fetch the last N pronunciation evaluations for the current user.
 * Used in the profile page to render phoneme progress charts.
 */
export async function getPronunciationHistory(
    language: TutorLanguage,
    limit = 20
): Promise<PronunciationEvaluationResult[]> {
    const { data } = await apiClient.get<PronunciationEvaluationResult[]>(
        "/ai/pronunciation/history",
        { params: { language, limit } }
    );
    return data;
}

// ─── SRS (Spaced Repetition) ──────────────────────────────

/** Fetch the cards due today for the current user. */
export async function getDueCards(
    language: TutorLanguage,
    limit = 20
): Promise<{
    id: string;
    front: string;
    back: string;
    card_type: string;
    extra_json: Record<string, unknown>;
}[]> {
    const { data } = await apiClient.get("/ai/srs/due", {
        params: { language, limit },
    });
    return data;
}

/**
 * Submit a review result for an SRS card.
 * quality: 0 (blackout) → 5 (perfect recall) — SM-2 scale.
 */
export async function submitCardReview(
    cardId: string,
    quality: 0 | 1 | 2 | 3 | 4 | 5
): Promise<{ next_due_at: string; new_interval_days: number }> {
    const { data } = await apiClient.post(`/ai/srs/cards/${cardId}/review`, {
        quality,
    });
    return data;
}

/** End an SRS session and retrieve the XP/summary reward. */
export async function finishSRSSession(
    language: TutorLanguage
): Promise<SRSSessionResult> {
    const { data } = await apiClient.post<SRSSessionResult>(
        "/ai/srs/finish",
        { language }
    );
    return data;
}

// ─── Helpers ──────────────────────────────────────────────

import Cookies from 'js-cookie';

/** Retrieve the stored JWT access token from cookies. */
function getAccessToken(): string {
    return Cookies.get('access_token') ?? "";
}

