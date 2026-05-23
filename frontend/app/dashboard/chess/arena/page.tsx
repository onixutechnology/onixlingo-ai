// app/dashboard/chess/arena/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePvPStore } from "@/store/usePvPStore";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/apiClient";
import {
    joinMatchmakingQueue,
    leaveMatchmakingQueue,
    type TimeControl,
} from "@/services/chessPvPService";

// ── Time control catalogue ──────────────────────────────

interface TimePreset {
    id: string;
    label: string;
    sub: string;
    initialSec: number;
    incrementSec: number;
    category: TimeControl;
    icon: string;
    accentFrom: string;
    accentTo: string;
    borderColor: string;
    glow: string;
}

const PRESETS: TimePreset[] = [
    {
        id: "bullet-1-0", label: "1+0", sub: "Bullet",
        initialSec: 60, incrementSec: 0, category: "bullet",
        icon: "⚡", accentFrom: "from-rose-600", accentTo: "to-red-500",
        borderColor: "border-rose-500/40", glow: "shadow-rose-500/20",
    },
    {
        id: "bullet-2-1", label: "2+1", sub: "Bullet",
        initialSec: 120, incrementSec: 1, category: "bullet",
        icon: "⚡", accentFrom: "from-rose-600", accentTo: "to-orange-500",
        borderColor: "border-rose-500/40", glow: "shadow-rose-500/20",
    },
    {
        id: "blitz-3-0", label: "3+0", sub: "Blitz",
        initialSec: 180, incrementSec: 0, category: "blitz",
        icon: "🔥", accentFrom: "from-amber-500", accentTo: "to-yellow-400",
        borderColor: "border-amber-500/40", glow: "shadow-amber-500/20",
    },
    {
        id: "blitz-3-2", label: "3+2", sub: "Blitz",
        initialSec: 180, incrementSec: 2, category: "blitz",
        icon: "🔥", accentFrom: "from-amber-500", accentTo: "to-orange-400",
        borderColor: "border-amber-500/40", glow: "shadow-amber-500/20",
    },
    {
        id: "blitz-5-0", label: "5+0", sub: "Blitz",
        initialSec: 300, incrementSec: 0, category: "blitz",
        icon: "🔥", accentFrom: "from-yellow-500", accentTo: "to-amber-400",
        borderColor: "border-yellow-500/40", glow: "shadow-yellow-500/20",
    },
    {
        id: "rapid-10-0", label: "10+0", sub: "Rapid",
        initialSec: 600, incrementSec: 0, category: "rapid",
        icon: "🛡️", accentFrom: "from-emerald-600", accentTo: "to-cyan-500",
        borderColor: "border-emerald-500/40", glow: "shadow-emerald-500/20",
    },
    {
        id: "rapid-15-10", label: "15+10", sub: "Rapid",
        initialSec: 900, incrementSec: 10, category: "rapid",
        icon: "🛡️", accentFrom: "from-teal-600", accentTo: "to-emerald-400",
        borderColor: "border-teal-500/40", glow: "shadow-teal-500/20",
    },
];

const CATEGORY_LABELS: Record<TimeControl, string> = {
    bullet: "⚡ Bullet",
    blitz: "🔥 Blitz",
    rapid: "🛡️ Rapid",
    classical: "🏛️ Classical",
};

// ── Helpers ─────────────────────────────────────────────

function useElapsedTimer(active: boolean) {
    const [elapsed, setElapsed] = useState(0);
    const ref = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        if (active) {
            setElapsed(0);
            ref.current = setInterval(() => setElapsed((s) => s + 1), 1000);
        } else {
            if (ref.current) clearInterval(ref.current);
        }
        return () => { if (ref.current) clearInterval(ref.current); };
    }, [active]);
    return elapsed;
}

function formatElapsed(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// ── Sub-components ───────────────────────────────────────

function PresetCard({
    preset, selected, onSelect,
}: {
    preset: TimePreset;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={`group relative flex flex-col items-center gap-2 rounded-none border-2 p-5 text-center transition-all duration-200
        ${selected
                    ? "border-amber-500 bg-[#462614] text-[#ecd3b5] shadow-lg shadow-amber-950/50"
                    : "border-[#502b16] bg-[#361d0f] text-[#ecd3b5]/80 hover:border-[#62351b] hover:bg-[#462614]"
                }`}
        >
            {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-none bg-amber-500/20 text-[10px] text-amber-300 border border-amber-500/40">✓</span>
            )}
            <span className="text-3xl">{preset.icon}</span>
            <span className={`text-2xl font-bold tracking-tight ${selected ? "text-white" : "text-[#ecd3b5]"}`}>
                {preset.label}
            </span>
            <span className={`rounded-none px-2.5 py-0.5 text-xs font-semibold ${selected ? "bg-amber-950/60 text-amber-300 border border-amber-800/40" : "bg-[#25140b] text-[#ecd3b5]/60 border border-[#3c1e0a]"}`}>
                {preset.sub}
            </span>
        </button>
    );
}

function RadarAnimation() {
    return (
        <div className="relative flex h-48 w-48 items-center justify-center">
            {/* Rings */}
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="absolute inset-0 rounded-none border border-amber-600/40 animate-ping"
                    style={{ animationDelay: `${i * 0.5}s`, animationDuration: "2s" }}
                />
            ))}
            {/* Static outer ring */}
            <span className="absolute inset-0 rounded-none border border-amber-800/20" />
            {/* Sweep */}
            <span className="absolute inset-4 rounded-none border border-amber-500/30 animate-spin" style={{ animationDuration: "3s" }} />
            {/* Core */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-none bg-gradient-to-br from-[#462614] to-[#25140b] border-2 border-[#62351b] shadow-2xl shadow-amber-950/50">
                <span className="text-3xl text-amber-400">♟</span>
            </div>
        </div>
    );
}

// ── Main page ────────────────────────────────────────────

export default function ChessArenaPage() {
    const router = useRouter();
    const { user, updateUser } = useAuthStore();
    const [selectedPreset, setSelectedPreset] = useState<TimePreset>(PRESETS[3]); // 3+2 default
    const [isJoining, setIsJoining] = useState(false);
    const localElo = user?.chess_elo ?? 1200; 

    const { matchStatus, matchId, opponent, setMatchStatus, setQueueId, initMatch } = usePvPStore();
    const isQueuing = matchStatus === "queuing";
    const isMatched = matchStatus === "matched";
    const elapsed = useElapsedTimer(isQueuing);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await apiClient.get('/users/me');
                updateUser({
                    chess_elo: userRes.data.chess_elo,
                    chess_tactical_elo: userRes.data.chess_tactical_elo,
                });
            } catch (e) {
                console.error("⚠️ Error syncing user ELO in arena:", e);
            }
        };
        fetchUserData();
    }, [updateUser]);

    // ── Redirect when a match is confirmed ──────────────
    useEffect(() => {
        if (isMatched && matchId) {
            const timeout = setTimeout(() => {
                router.push(`/dashboard/chess/play/${matchId}`);
            }, 2200);
            return () => clearTimeout(timeout);
        }
    }, [isMatched, matchId, router]);

    // ── Handlers ────────────────────────────────────────

    const handlePlay = async () => {
        if (isJoining) return;
        setIsJoining(true);
        try {
            const res = await joinMatchmakingQueue({
                time_control: selectedPreset.category,
                elo_rating: localElo,
                elo_range: 150,
            });
            setQueueId(res.id);
            setMatchStatus("queuing");
        } catch (err) {
            console.error("[Arena] Failed to join queue", err);
            setMatchStatus("idle");
        } finally {
            setIsJoining(false);
        }
    };

    const handleCancel = async () => {
        try {
            await leaveMatchmakingQueue();
        } finally {
            setMatchStatus("idle");
        }
    };

    // ── Grouped presets ──────────────────────────────────
    const categories = ["bullet", "blitz", "rapid"] as TimeControl[];

    // ─────────────────────────────────────────────────────

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden wood-theme-bg text-[#ecd3b5] rounded-none">
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

            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-none bg-amber-950/10 blur-3xl" />
                <div className="absolute left-1/4 bottom-0 h-80 w-80 rounded-none bg-amber-950/5 blur-3xl" />
            </div>

            {/* ══════════ MATCHED OVERLAY ══════════ */}
            {isMatched && opponent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="relative flex flex-col items-center gap-6 wood-panel p-10 shadow-2xl rounded-none w-full max-w-md">
                        <div className="relative flex flex-col items-center gap-3 text-center">
                            <span className="text-5xl animate-bounce">♟</span>
                            <h2 className="text-3xl font-black tracking-tight text-white">
                                ¡Oponente Encontrado!
                            </h2>
                            <p className="text-amber-200/80">Prepárate para jugar...</p>
                        </div>

                        {/* Opponent card */}
                        <div className="relative flex items-center gap-4 rounded-none border border-[#502b16] bg-[#361d0f] px-6 py-4 w-full">
                            <div className="flex h-14 w-14 items-center justify-center rounded-none bg-[#ecd3b5] text-[#1e130c] text-2xl font-bold shadow-lg border border-[#fbf8f0]">
                                {opponent.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">{opponent.username}</p>
                                <p className="text-sm text-slate-300">
                                    ELO <span className="font-semibold text-amber-400">{opponent.elo}</span>
                                    {" · "}
                                    {CATEGORY_LABELS[selectedPreset.category]}
                                </p>
                            </div>
                        </div>

                        {/* Progress bar countdown */}
                        <div className="w-full overflow-hidden rounded-none bg-[#130a04] border border-[#3c1e0a] h-2">
                            <div
                                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 animate-[grow_2.2s_linear_forwards]"
                                style={{ width: "0%" }}
                            />
                        </div>
                        <p className="text-xs text-amber-200/50">Iniciando tablero de juego...</p>
                    </div>
                </div>
            )}

            {/* ══════════ QUEUING STATE ══════════ */}
            {isQueuing && (
                <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
                    <RadarAnimation />

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-white">
                            Buscando Oponente
                        </h1>
                        <p className="text-slate-300">
                            {CATEGORY_LABELS[selectedPreset.category]}
                            {" · "}
                            {selectedPreset.label}
                            {" · "}
                            ELO ±150 de {localElo}
                        </p>
                    </div>

                    {/* Elapsed timer */}
                    <div className="flex items-center gap-2 rounded-none border border-[#502b16] bg-[#361d0f] px-5 py-2.5">
                        <span className="h-2 w-2 animate-pulse rounded-none bg-emerald-400" />
                        <span className="font-mono text-xl font-bold tabular-nums text-white">
                            {formatElapsed(elapsed)}
                        </span>
                    </div>

                    {/* Animated dots */}
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="h-2 w-2 rounded-none bg-amber-500 animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleCancel}
                        className="mt-2 rounded-none border border-red-800/40 bg-red-950/60 px-8 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-900/50 hover:text-white"
                    >
                        ✕ Cancelar Búsqueda
                    </button>
                </div>
            )}

            {/* ══════════ LOBBY (idle) ══════════ */}
            {!isQueuing && !isMatched && (
                <div className="relative z-10 w-full max-w-3xl space-y-8 px-4 py-10">

                    {/* Page header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-none border border-amber-850 bg-amber-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
                            ♟ Chess Arena
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                            Encuentra tu Partida
                        </h1>
                        <p className="text-slate-300">
                            Elige el control de tiempo y entra a la arena de combate.
                        </p>
                    </div>

                    {/* Time control groups */}
                    {categories.map((cat) => (
                        <div key={cat} className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-200/40">
                                {CATEGORY_LABELS[cat]}
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {PRESETS.filter((p) => p.category === cat).map((preset) => (
                                    <PresetCard
                                        key={preset.id}
                                        preset={preset}
                                        selected={selectedPreset.id === preset.id}
                                        onSelect={() => setSelectedPreset(preset)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Selected summary + CTA */}
                    <div className="wood-panel p-5 rounded-none">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-0.5 text-center sm:text-left">
                                <p className="text-xs text-amber-200/40 uppercase tracking-wider">Seleccionado</p>
                                <p className="text-lg font-bold text-white">
                                    {selectedPreset.sub} · {selectedPreset.label}
                                </p>
                                <p className="text-sm text-slate-300">
                                    {selectedPreset.initialSec / 60} min
                                    {selectedPreset.incrementSec > 0 ? ` + ${selectedPreset.incrementSec}s de incremento` : ""}
                                    {" · "}Tu ELO: <span className="font-semibold text-amber-400">{localElo}</span>
                                </p>
                            </div>

                            <button
                                onClick={handlePlay}
                                disabled={isJoining}
                                className="relative flex items-center gap-3 overflow-hidden rounded-none px-8 py-4 text-base font-black tracking-wide text-[#1e130c] shadow-xl transition-all duration-200 bg-[#ecd3b5] border-2 border-[#fbf8f0] hover:bg-[#fbf8f0] hover:scale-105 disabled:opacity-60 disabled:scale-100 w-full sm:w-auto justify-center"
                            >
                                {isJoining ? (
                                    <span className="inline-block h-5 w-5 animate-spin rounded-none border-2 border-[#1e130c] border-t-transparent" />
                                ) : (
                                    <span className="text-xl">{selectedPreset.icon}</span>
                                )}
                                {isJoining ? "Ingresando..." : "Jugar Ahora"}
                            </button>
                        </div>
                    </div>

                    {/* Quick-pick pills */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {PRESETS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPreset(p)}
                                className={`rounded-none border px-3 py-1 text-xs font-semibold transition-all
                  ${selectedPreset.id === p.id
                                        ? "border-amber-500 bg-[#462614] text-[#ecd3b5]"
                                        : "border-[#502b16] bg-[#361d0f] text-amber-200/50 hover:bg-[#462614] hover:text-[#ecd3b5]"
                                    }`}
                            >
                                {p.icon} {p.label}
                            </button>
                        ))}
                    </div>

                </div>
            )}

            {/* Keyframe for match-found bar */}
            <style>{`
        @keyframes grow {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
        </main>
    );
}
