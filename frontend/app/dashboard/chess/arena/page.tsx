// app/dashboard/chess/arena/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePvPStore } from "@/store/usePvPStore";
import { useAuthStore } from "@/store/useAuthStore";
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
            className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all duration-200
        ${selected
                    ? `${preset.borderColor} bg-gradient-to-br ${preset.accentFrom}/20 ${preset.accentTo}/10 shadow-lg ${preset.glow}`
                    : "border-white/8 bg-slate-800/50 hover:border-white/20 hover:bg-slate-800/80"
                }`}
        >
            {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] text-white">✓</span>
            )}
            <span className="text-3xl">{preset.icon}</span>
            <span className={`text-2xl font-bold tracking-tight ${selected ? "text-white" : "text-slate-200"}`}>
                {preset.label}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${selected ? "bg-white/20 text-white" : "bg-slate-700 text-slate-400"}`}>
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
                    className="absolute inset-0 rounded-full border border-indigo-500/40 animate-ping"
                    style={{ animationDelay: `${i * 0.5}s`, animationDuration: "2s" }}
                />
            ))}
            {/* Static outer ring */}
            <span className="absolute inset-0 rounded-full border border-indigo-500/20" />
            {/* Sweep */}
            <span className="absolute inset-4 rounded-full border border-indigo-400/30 animate-spin" style={{ animationDuration: "3s" }} />
            {/* Core */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/40">
                <span className="text-3xl">♟</span>
            </div>
        </div>
    );
}

// ── Main page ────────────────────────────────────────────

export default function ChessArenaPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [selectedPreset, setSelectedPreset] = useState<TimePreset>(PRESETS[3]); // 3+2 default
    const [isJoining, setIsJoining] = useState(false);
    const localElo = user?.chess_elo ?? 1200; 

    const { matchStatus, matchId, opponent, setMatchStatus, setQueueId, initMatch } = usePvPStore();
    const isQueuing = matchStatus === "queuing";
    const isMatched = matchStatus === "matched";
    const elapsed = useElapsedTimer(isQueuing);

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
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#060a10] text-white">

            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700/10 blur-3xl" />
                <div className="absolute left-1/4 bottom-0 h-80 w-80 rounded-full bg-violet-700/8 blur-3xl" />
            </div>

            {/* ══════════ MATCHED OVERLAY ══════════ */}
            {isMatched && opponent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <div className="relative flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-slate-900/90 p-10 shadow-2xl">
                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-violet-600/10" />

                        <div className="relative flex flex-col items-center gap-3 text-center">
                            <span className="text-5xl animate-bounce">♟</span>
                            <h2 className="text-3xl font-black tracking-tight text-white">
                                Opponent Found!
                            </h2>
                            <p className="text-slate-400">Prepare to play…</p>
                        </div>

                        {/* Opponent card */}
                        <div className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-800/60 px-6 py-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-2xl font-bold shadow-lg">
                                {opponent.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">{opponent.username}</p>
                                <p className="text-sm text-slate-400">
                                    ELO <span className="font-semibold text-amber-300">{opponent.elo}</span>
                                    {" · "}
                                    {CATEGORY_LABELS[selectedPreset.category]}
                                </p>
                            </div>
                        </div>

                        {/* Progress bar countdown */}
                        <div className="w-full overflow-hidden rounded-full bg-slate-700 h-1.5">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-[grow_2.2s_linear_forwards]"
                                style={{ width: "0%" }}
                            />
                        </div>
                        <p className="text-xs text-slate-500">Launching game board…</p>
                    </div>
                </div>
            )}

            {/* ══════════ QUEUING STATE ══════════ */}
            {isQueuing && (
                <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
                    <RadarAnimation />

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-white">
                            Searching for Opponent
                        </h1>
                        <p className="text-slate-400">
                            {CATEGORY_LABELS[selectedPreset.category]}
                            {" · "}
                            {selectedPreset.label}
                            {" · "}
                            ELO ±150 of {localElo}
                        </p>
                    </div>

                    {/* Elapsed timer */}
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/60 px-5 py-2.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        <span className="font-mono text-xl font-bold tabular-nums text-white">
                            {formatElapsed(elapsed)}
                        </span>
                    </div>

                    {/* Animated dots */}
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleCancel}
                        className="mt-2 rounded-xl border border-red-500/30 bg-red-900/20 px-8 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-900/40 hover:text-white"
                    >
                        ✕ Cancel Search
                    </button>
                </div>
            )}

            {/* ══════════ LOBBY (idle) ══════════ */}
            {!isQueuing && !isMatched && (
                <div className="relative z-10 w-full max-w-3xl space-y-8 px-4 py-10">

                    {/* Page header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-900/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                            ♟ Chess Arena
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                            Find Your Match
                        </h1>
                        <p className="text-slate-400">
                            Choose your time control and enter the arena.
                        </p>
                    </div>

                    {/* Time control groups */}
                    {categories.map((cat) => (
                        <div key={cat} className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
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
                    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Selected</p>
                                <p className="text-lg font-bold text-white">
                                    {selectedPreset.sub} · {selectedPreset.label}
                                </p>
                                <p className="text-sm text-slate-400">
                                    {selectedPreset.initialSec / 60} min
                                    {selectedPreset.incrementSec > 0 ? ` + ${selectedPreset.incrementSec}s increment` : ""}
                                    {" · "}Your ELO: <span className="font-semibold text-amber-300">{localElo}</span>
                                </p>
                            </div>

                            <button
                                onClick={handlePlay}
                                disabled={isJoining}
                                className={`relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-base font-black tracking-wide text-white shadow-xl transition-all duration-200
                  bg-gradient-to-r ${selectedPreset.accentFrom} ${selectedPreset.accentTo}
                  hover:scale-105 hover:shadow-2xl disabled:opacity-60 disabled:scale-100`}
                            >
                                {isJoining ? (
                                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <span className="text-xl">{selectedPreset.icon}</span>
                                )}
                                {isJoining ? "Entering…" : "Play Now"}
                                {/* Shimmer */}
                                <span className="pointer-events-none absolute inset-0 -skew-x-12 translate-x-[-150%] bg-white/10 transition-transform duration-700 group-hover:translate-x-[150%]" />
                            </button>
                        </div>
                    </div>

                    {/* Quick-pick pills */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {PRESETS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPreset(p)}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all
                  ${selectedPreset.id === p.id
                                        ? `${p.borderColor} bg-white/10 text-white`
                                        : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
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
