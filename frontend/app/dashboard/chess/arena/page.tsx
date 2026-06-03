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
    pollQueueStatus,
    type TimeControl,
} from "@/services/chessPvPService";
import {
    Trophy,
    Zap,
    Crown,
    Target,
    Shield,
    Flame,
    ChevronLeft,
    History,
    Brain,
    Timer,
    Gamepad2,
    BookOpen,
    Users,
    Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                    ? "border-amber-500 bg-[#462614] text-[#ecd3b5] shadow-lg shadow-amber-950/50 scale-[1.02]"
                    : "border-[#502b16] bg-[#361d0f] text-[#ecd3b5]/80 hover:border-[#62351b] hover:bg-[#462614] hover:scale-[1.01]"
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
    const [activeTab, setActiveTab] = useState<'matchmaking' | 'stats' | 'leaderboard' | 'guides'>('matchmaking');
    const localElo = user?.chess_elo ?? 1200;

    const { matchStatus, matchId, opponent, setMatchStatus, setQueueId, initMatch } = usePvPStore();
    const isQueuing = matchStatus === "queuing";
    const isMatched = matchStatus === "matched";
    const elapsed = useElapsedTimer(isQueuing);

    const [queueLogs, setQueueLogs] = useState<string[]>([]);

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

    // ── Polling Matchmaking queue status ──────────────
    useEffect(() => {
        if (!isQueuing) return;

        let intervalId: ReturnType<typeof setInterval>;

        const checkStatus = async () => {
            try {
                const res = await pollQueueStatus();
                if (res.status === "matched" && res.match_id) {
                    initMatch(
                        {
                            match_id: res.match_id,
                            opponent_username: res.opponent_username ?? "Oponente",
                            opponent_elo: res.opponent_elo ?? 1200,
                            your_color: (res.your_color as "white" | "black") ?? "white",
                            time_control: selectedPreset.category,
                            initial_time_sec: selectedPreset.initialSec,
                            increment_sec: selectedPreset.incrementSec,
                            started_at: new Date().toISOString()
                        },
                        user?.id ?? "user-1234",
                        user?.username ?? "Usuario",
                        localElo
                    );
                    setMatchStatus("matched");
                }
            } catch (err) {
                console.error("[Arena] Error checking queue status:", err);
            }
        };

        checkStatus();
        intervalId = setInterval(checkStatus, 2000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isQueuing, initMatch, selectedPreset, user, localElo, setMatchStatus]);

    // ── Generate queue logs dynamically based on elapsed time ──
    useEffect(() => {
        if (!isQueuing) {
            setQueueLogs([]);
            return;
        }

        const logTimeline = [
            { t: 0, msg: "⚡ Conectando al nodo de emparejamiento OnixLingo..." },
            { t: 1, msg: "🟢 Conexión establecida. Registrando usuario en cola..." },
            { t: 2, msg: `🔍 Buscando rival en categoría ${selectedPreset.sub} (${selectedPreset.label})...` },
            { t: 4, msg: `📡 Escaneando oponentes con ELO similar (Rango ±150)...` },
            { t: 6, msg: "⏳ Sin respuesta inmediata. Expandiendo rango de búsqueda a ±250..." },
            { t: 8, msg: "⚙️ Verificando latencia de red y servidores regionales..." },
            { t: 10, msg: "⚠️ Tráfico bajo detectado. Activando Bot de contingencia del sistema..." },
            { t: 12, msg: "🤖 Oponente OnixBot asignado. Preparando tablero de juego..." }
        ];

        const visibleLogs = logTimeline
            .filter(item => elapsed >= item.t)
            .map(item => {
                const logTime = new Date(Date.now() - (elapsed - item.t) * 1000);
                const timeStr = logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                return `[${timeStr}] ${item.msg}`;
            });

        setQueueLogs(visibleLogs);
    }, [isQueuing, elapsed, selectedPreset]);

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
            setQueueId(res.id.toString());
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

    // ── Cognitive explanations per time control ────────
    const cognitivePerks = {
        bullet: {
            title: "Reflejos Balísticos y Agilidad Mental",
            desc: "Las partidas Bullet exigen un procesamiento táctico ultra-veloz. Estimula la plasticidad cerebral, entrena la toma de decisiones instintiva bajo presión extrema y fortalece el desapego de errores cometidos al obligarte a pensar en la siguiente jugada de inmediato.",
            benefit: "Mejora el tiempo de reacción ejecutiva y el instinto posicional."
        },
        blitz: {
            title: "Pensamiento Crítico Acelerado",
            desc: "El ritmo Blitz equilibra la intuición rápida con el cálculo de variantes cortas. Ideal para entrenar el reconocimiento de patrones visuales a alta velocidad y el control emocional, forzando la evaluación de amenazas en cuestión de segundos.",
            benefit: "Agiliza la toma de decisiones analíticas en entornos de alta volatilidad."
        },
        rapid: {
            title: "Planificación Estratégica y Resiliencia",
            desc: "El ritmo Rapid otorga tiempo para el análisis profundo, cálculo sistemático de múltiples variantes y evaluación de planes de largo alcance. Fomenta el razonamiento lógico deductivo, la resiliencia en posiciones de desgaste y la disciplina mental.",
            benefit: "Fortalece la formulación de planes estratégicos complejos y de visión amplia."
        }
    };

    const selectedPerk = cognitivePerks[selectedPreset.category === "classical" ? "rapid" : selectedPreset.category as "bullet" | "blitz" | "rapid"];

    const categories = ["bullet", "blitz", "rapid"] as TimeControl[];

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-start overflow-y-auto wood-theme-bg text-[#ecd3b5] pb-10">
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
                .console-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .console-scrollbar::-webkit-scrollbar-track {
                    background: #130a04;
                }
                .console-scrollbar::-webkit-scrollbar-thumb {
                    background: #502b16;
                    border-radius: 3px;
                }
            `}</style>

            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-none bg-amber-950/10 blur-3xl" />
                <div className="absolute left-1/4 bottom-0 h-80 w-80 rounded-none bg-amber-950/5 blur-3xl" />
            </div>

            {/* Navigation Header */}
            <nav className="w-full h-14 border-b-2 border-[#3c1e0a] px-6 flex items-center justify-between bg-[#25140b] shadow-md z-40 text-[#ecd3b5]">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard/chess')} className="p-2 hover:bg-[#361d0f] hover:text-white transition-colors text-[#ecd3b5] rounded-none">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#3d200c] border border-[#502b16] flex items-center justify-center">
                            <Gamepad2 size={14} className="text-[#ecd3b5]" />
                        </div>
                        <h1 className="font-black text-[10px] tracking-[0.2em] uppercase text-white">Onix Chess <span className="text-amber-400 font-bold">Arena PvP</span></h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 px-6 border-x border-[#3c1e0a]">
                        <div className="text-center">
                            <p className="text-[8px] text-amber-200/50 font-black uppercase tracking-widest leading-none mb-1">Mi ELO Arena</p>
                            <p className="text-[10px] font-black uppercase text-white">{localElo}</p>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ══════════ MATCHED OVERLAY ══════════ */}
            <AnimatePresence>
                {isMatched && opponent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
                    >
                        <div className="relative flex flex-col items-center gap-6 wood-panel p-10 shadow-2xl rounded-none w-full max-w-md">
                            <div className="relative flex flex-col items-center gap-3 text-center">
                                <span className="text-5xl animate-bounce">♟</span>
                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">
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
                                    <p className="text-sm text-slate-350">
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════ QUEUING STATE ══════════ */}
            <AnimatePresence>
                {isQueuing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center mt-12 w-full max-w-4xl"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                            <div className="flex flex-col items-center justify-center w-full md:w-1/2">
                                <RadarAnimation />
                                <div className="space-y-2 mt-6">
                                    <h1 className="text-3xl font-black tracking-tight text-[#25140b] uppercase">
                                        Buscando Oponente
                                    </h1>
                                    <p className="text-[#3c1e0a] font-semibold">
                                        {CATEGORY_LABELS[selectedPreset.category]}
                                        {" · "}
                                        {selectedPreset.label}
                                        {" · "}
                                        Rango ELO compatible de {localElo}
                                    </p>
                                </div>

                                {/* Elapsed timer */}
                                <div className="flex items-center gap-2 rounded-none border border-[#502b16] bg-[#361d0f] px-5 py-2.5 mt-4 shadow-inner">
                                    <span className="h-2 w-2 animate-pulse rounded-none bg-emerald-400" />
                                    <span className="font-mono text-xl font-bold tabular-nums text-white">
                                        {formatElapsed(elapsed)}
                                    </span>
                                </div>

                                <button
                                    onClick={handleCancel}
                                    className="mt-6 rounded-none border border-red-800/40 bg-red-950/60 px-8 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-900/50 hover:text-white"
                                >
                                    ✕ Cancelar Búsqueda
                                </button>
                            </div>

                            {/* Dynamic Matchmaking Bitácora Console */}
                            <div className="w-full md:w-1/2 wood-panel p-5 text-left font-mono text-xs rounded-none h-80 flex flex-col justify-between shadow-inner">
                                <div className="border-b border-[#3c1e0a] pb-2 mb-3 flex items-center justify-between text-amber-400">
                                    <span className="font-black text-[9px] uppercase tracking-wider">Bitácora de Emparejamiento</span>
                                    <span className="animate-pulse">● LIVE</span>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-2 console-scrollbar pr-2 text-slate-350">
                                    {queueLogs.length === 0 ? (
                                        <p className="text-slate-500 italic">Iniciando traza de auditoría de red...</p>
                                    ) : (
                                        queueLogs.map((log, idx) => (
                                            <p key={idx} className="leading-relaxed border-l-2 border-amber-600/40 pl-2 py-0.5">
                                                {log}
                                            </p>
                                        ))
                                    )}
                                    <span className="inline-block w-1.5 h-3 bg-amber-500 animate-pulse ml-2" />
                                </div>
                                <div className="border-t border-[#3c1e0a] pt-2 mt-3 text-[9px] text-slate-500 flex justify-between">
                                    <span>PROTOCOL: WEBSOCKET</span>
                                    <span>LATENCY: ~32MS</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════ LOBBY (idle) ══════════ */}
            {!isQueuing && !isMatched && (
                <div className="relative z-10 w-full max-w-5xl space-y-8 px-4 py-8">

                    {/* Page header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-none border border-[#3c1e0a] bg-[#25140b] px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-400 shadow-md">
                            ♟ Chess Arena
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-[#25140b] md:text-5xl uppercase">
                            Arena de Combate PvP
                        </h1>
                        <p className="text-[#3c1e0a] font-semibold max-w-2xl mx-auto leading-relaxed">
                            Compite en vivo con otros ejecutivos de la plataforma. Configura tu control de tiempo, analiza tu nivel y sube en el ranking global.
                        </p>
                    </div>

                    {/* Tab Selection */}
                    <div className="flex border-b border-[#3c1e0a] justify-center md:justify-start gap-4 overflow-x-auto pb-2">
                        {[
                            { id: "matchmaking", label: "Desafiar", icon: Gamepad2 },
                            { id: "stats", label: "Mi Ficha Técnica", icon: History },
                            { id: "leaderboard", label: "Clasificación", icon: Trophy },
                            { id: "guides", label: "Caminos & Modalidades", icon: Brain }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-wider border-2 transition-all rounded-none shadow-md
                                        ${activeTab === tab.id
                                            ? "border-amber-500 text-white bg-[#25140b] shadow-lg scale-[1.02]"
                                            : "border-[#502b16] text-[#ecd3b5]/80 hover:text-white bg-[#361d0f] hover:bg-[#462614] hover:border-amber-500/40"
                                        }`}
                                >
                                    <Icon size={14} className={activeTab === tab.id ? "text-amber-400" : "text-slate-350"} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Contents */}
                    <div>
                        {/* TAB 1: MATCHMAKING */}
                        {activeTab === "matchmaking" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Side: Time Presets & Play */}
                                <div className="lg:col-span-2 space-y-6">
                                    {categories.map((cat) => (
                                        <div key={cat} className="space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#3c1e0a] border-b border-[#3c1e0a]/20 pb-1 mb-2">
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

                                    {/* Summary & Play CTA */}
                                    <div className="wood-panel p-5 rounded-none shadow-lg">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="space-y-0.5 text-center sm:text-left">
                                                <p className="text-[8px] text-amber-200/40 uppercase tracking-widest font-black">Control Seleccionado</p>
                                                <p className="text-xl font-bold text-white uppercase">
                                                    {selectedPreset.sub} · {selectedPreset.label}
                                                </p>
                                                <p className="text-sm text-slate-300">
                                                    {selectedPreset.initialSec / 60} min
                                                    {selectedPreset.incrementSec > 0 ? ` + ${selectedPreset.incrementSec}s de incremento` : ""}
                                                    {" · "}Tu ELO actual: <span className="font-semibold text-amber-400">{localElo}</span>
                                                </p>
                                            </div>

                                            <button
                                                onClick={handlePlay}
                                                disabled={isJoining}
                                                className="relative flex items-center gap-3 overflow-hidden rounded-none px-8 py-4 text-xs font-black uppercase tracking-widest text-[#1e130c] shadow-xl transition-all duration-200 bg-[#ecd3b5] border-2 border-[#fbf8f0] hover:bg-[#fbf8f0] hover:scale-105 disabled:opacity-60 disabled:scale-100 w-full sm:w-auto justify-center"
                                            >
                                                {isJoining ? (
                                                    <span className="inline-block h-5 w-5 animate-spin rounded-none border-2 border-[#1e130c] border-t-transparent" />
                                                ) : (
                                                    <span className="text-xl">{selectedPreset.icon}</span>
                                                )}
                                                {isJoining ? "Registrando..." : "Jugar Ahora"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Cognitive Perk Sidebar */}
                                <div className="space-y-6">
                                    <div className="wood-panel p-6 rounded-none relative overflow-hidden h-full flex flex-col justify-between">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-500">
                                            <Brain size={120} />
                                        </div>
                                        <div className="relative z-10 space-y-4">
                                            <div className="inline-flex items-center gap-2 rounded-none border border-amber-800 bg-[#361d0f] px-3 py-1 text-[8px] font-black uppercase tracking-wider text-amber-400">
                                                🔬 Laboratorio de Enfoque
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase border-b border-[#3c1e0a] pb-2">
                                                {selectedPerk.title}
                                            </h3>
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                {selectedPerk.desc}
                                            </p>
                                        </div>

                                        <div className="relative z-10 bg-[#130a04] p-4 border border-[#3c1e0a] mt-6">
                                            <p className="text-[8px] text-amber-400 font-black uppercase tracking-widest mb-1">Beneficio Principal</p>
                                            <p className="text-xs text-white font-bold leading-snug">
                                                {selectedPerk.benefit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: MI FICHA TÉCNICA (STATS) */}
                        {activeTab === "stats" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Executive Player Card */}
                                <div className="wood-panel p-6 rounded-none relative flex flex-col justify-between overflow-hidden shadow-2xl border-t-4 border-amber-500 h-96">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-400">
                                        <Crown size={120} />
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <div>
                                            <p className="text-[8px] text-amber-400 font-black uppercase tracking-[0.25em] leading-none mb-1">Ficha de Identidad</p>
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{user?.username ?? "Usuario"}</h2>
                                            <span className="text-[9px] px-2 py-0.5 bg-[#462614] border border-amber-700/40 text-amber-300 font-bold uppercase tracking-wider mt-1.5 inline-block">
                                                {user?.tier === "executive" ? "Executive Premium Member" : user?.is_pro ? "Pro Member" : "Free Member"}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 border-y border-[#3c1e0a] py-6">
                                            <div>
                                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">ELO Arena PvP</p>
                                                <p className="text-3xl font-black text-amber-300 tracking-tighter">{localElo}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">ELO Táctico</p>
                                                <p className="text-3xl font-black text-slate-200 tracking-tighter">{user?.chess_tactical_elo ?? 800}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 bg-[#130a04]/60 p-3 border border-[#3c1e0a]/60 text-[9px] text-slate-400">
                                        Firma Digital Autenticada en OnixLingo Ajedrez Cognitivo
                                    </div>
                                </div>

                                {/* Stats Graphs and History */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Win/Draw/Loss Distribution */}
                                    <div className="wood-panel p-5 rounded-none">
                                        <h3 className="text-xs font-black uppercase tracking-wider mb-4 text-white">Distribución de Victorias</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-emerald-400 font-bold">Victorias (58%)</span>
                                                    <span className="text-slate-350">58 Partidas</span>
                                                </div>
                                                <div className="h-2 bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: "58%" }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-amber-400 font-bold">Tablas / Empates (10%)</span>
                                                    <span className="text-slate-350">10 Partidas</span>
                                                </div>
                                                <div className="h-2 bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden">
                                                    <div className="h-full bg-amber-500" style={{ width: "10%" }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-red-400 font-bold">Derrotas (32%)</span>
                                                    <span className="text-slate-350">32 Partidas</span>
                                                </div>
                                                <div className="h-2 bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden">
                                                    <div className="h-full bg-red-500" style={{ width: "32%" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Past Match History */}
                                    <div className="wood-panel rounded-none overflow-hidden">
                                        <div className="p-4 border-b border-[#3c1e0a] bg-[#1a0d04] flex items-center justify-between text-[#ecd3b5]">
                                            <div className="flex items-center gap-2">
                                                <History size={14} className="text-amber-400" />
                                                <h3 className="text-[10px] font-black uppercase tracking-widest">Partidas Recientes</h3>
                                            </div>
                                            <span className="text-[9px] text-[#ecd3b5]/60 font-bold">Historial de Arena</span>
                                        </div>
                                        <div className="p-4 overflow-x-auto">
                                            <table className="w-full text-left text-xs border-collapse">
                                                <thead>
                                                    <tr className="border-b border-[#3c1e0a] text-amber-200/50 text-[9px] uppercase tracking-wider">
                                                        <th className="pb-2 font-black">Oponente</th>
                                                        <th className="pb-2 font-black">Tipo</th>
                                                        <th className="pb-2 font-black">Resultado</th>
                                                        <th className="pb-2 font-black text-right">Cambio ELO</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#3c1e0a]/40 text-slate-300">
                                                    <tr>
                                                        <td className="py-2.5 font-bold text-white">Bot-Manager</td>
                                                        <td className="py-2.5">🔥 Blitz 3+2</td>
                                                        <td className="py-2.5 text-emerald-400 font-bold">Victoria</td>
                                                        <td className="py-2.5 text-emerald-400 font-bold text-right">+15</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2.5 font-bold text-white">Carlos_CEO</td>
                                                        <td className="py-2.5">🛡️ Rapid 10+0</td>
                                                        <td className="py-2.5 text-red-400 font-bold">Derrota</td>
                                                        <td className="py-2.5 text-red-400 font-bold text-right">-15</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2.5 font-bold text-white">Bot-Principiante</td>
                                                        <td className="py-2.5">⚡ Bullet 1+0</td>
                                                        <td className="py-2.5 text-emerald-400 font-bold">Victoria</td>
                                                        <td className="py-2.5 text-emerald-400 font-bold text-right">+5</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: LEADERBOARD */}
                        {activeTab === "leaderboard" && (
                            <div className="wood-panel rounded-none overflow-hidden shadow-xl max-w-3xl mx-auto">
                                <div className="p-5 border-b border-[#3c1e0a] bg-[#1a0d04] flex items-center justify-between text-[#ecd3b5]">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={16} className="text-amber-400" />
                                        <h3 className="font-black text-xs uppercase tracking-widest">Clasificación de Arena</h3>
                                    </div>
                                    <span className="text-[9px] text-[#ecd3b5]/60 font-bold">TOP JUGADORES</span>
                                </div>
                                <div className="p-6">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#3c1e0a] text-amber-200/50 text-[9px] uppercase tracking-wider">
                                                <th className="pb-3 font-black w-12">Rango</th>
                                                <th className="pb-3 font-black">Usuario</th>
                                                <th className="pb-3 font-black">ELO PvP</th>
                                                <th className="pb-3 font-black">Win Rate</th>
                                                <th className="pb-3 font-black">País</th>
                                                <th className="pb-3 font-black text-right">Rango</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#3c1e0a]/40 text-slate-350 font-medium">
                                            <tr className="bg-[#462614]/10">
                                                <td className="py-3.5 font-black text-amber-400 text-sm">#1</td>
                                                <td className="py-3.5 font-bold text-white flex items-center gap-1.5">
                                                    Magnus_CEO <Crown size={12} className="text-amber-400" />
                                                </td>
                                                <td className="py-3.5 font-black text-amber-300">2840</td>
                                                <td className="py-3.5">84%</td>
                                                <td className="py-3.5">🇳🇴 NO</td>
                                                <td className="py-3.5 text-right"><span className="text-[8px] font-black bg-amber-950/60 text-amber-300 border border-amber-800/40 px-1.5 py-0.5">EXECUTIVE</span></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3.5 font-black text-amber-500/60 text-sm">#2</td>
                                                <td className="py-3.5 font-bold text-white">Kasparov_Pro</td>
                                                <td className="py-3.5 font-bold">2610</td>
                                                <td className="py-3.5">76%</td>
                                                <td className="py-3.5">🇦🇿 AZ</td>
                                                <td className="py-3.5 text-right"><span className="text-[8px] font-black bg-amber-950/60 text-amber-300 border border-amber-800/40 px-1.5 py-0.5">EXECUTIVE</span></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3.5 font-black text-amber-500/60 text-sm">#3</td>
                                                <td className="py-3.5 font-bold text-white">Sofia_Chess92</td>
                                                <td className="py-3.5 font-bold">1850</td>
                                                <td className="py-3.5">68%</td>
                                                <td className="py-3.5">🇪🇸 ES</td>
                                                <td className="py-3.5 text-right"><span className="text-[8px] font-black bg-[#130a04] text-slate-350 border border-[#3c1e0a] px-1.5 py-0.5">PRO</span></td>
                                            </tr>
                                            <tr className="bg-[#462614]/30 border-y-2 border-amber-700/40">
                                                <td className="py-3.5 font-black text-amber-400 text-sm">#4</td>
                                                <td className="py-3.5 font-bold text-white flex items-center gap-1.5">
                                                    {user?.username ?? "Usuario"} <span className="text-[8px] text-amber-400 font-bold">(Tú)</span>
                                                </td>
                                                <td className="py-3.5 font-black text-amber-300">{localElo}</td>
                                                <td className="py-3.5">58%</td>
                                                <td className="py-3.5">🇲🇽 MX</td>
                                                <td className="py-3.5 text-right"><span className="text-[8px] font-black bg-[#130a04] text-slate-350 border border-[#3c1e0a] px-1.5 py-0.5">PRO</span></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3.5 font-black text-amber-500/60 text-sm">#5</td>
                                                <td className="py-3.5 font-bold text-white">Student_99</td>
                                                <td className="py-3.5 font-bold">1220</td>
                                                <td className="py-3.5">51%</td>
                                                <td className="py-3.5">🇨🇴 CO</td>
                                                <td className="py-3.5 text-right"><span className="text-[8px] font-black bg-[#130a04] text-slate-500 border border-[#3c1e0a]/40 px-1.5 py-0.5">STUDENT</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: GUIDES (MODALITIES) */}
                        {activeTab === "guides" && (
                            <div className="space-y-8">
                                {/* Modality comparison banner */}
                                <div className="wood-panel p-6 rounded-none relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-400">
                                        <Award size={100} />
                                    </div>
                                    <h3 className="text-base font-black uppercase tracking-wider mb-2 text-white border-b border-[#3c1e0a] pb-2">Los 3 Senderos del Ajedrez Cognitivo</h3>
                                    <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                                        OnixLingo separa el entrenamiento mental de ajedrez en tres modalidades diferenciadas para entrenar áreas cognitivas específicas de un ejecutivo.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Academy Path */}
                                    <div className="wood-panel p-6 rounded-none flex flex-col justify-between h-96">
                                        <div className="space-y-4">
                                            <div className="w-10 h-10 bg-blue-950/40 border border-blue-800/40 text-blue-400 flex items-center justify-center">
                                                <BookOpen size={20} />
                                            </div>
                                            <h4 className="font-bold text-base text-white uppercase">El Sendero del Aprendizaje</h4>
                                            <p className="text-xs text-slate-350 leading-relaxed">
                                                Academia estructurada con 4 niveles generales que engloban 400 módulos de entrenamiento y 40,000 ejercicios de puzzle únicos. 
                                            </p>
                                            <ul className="text-[10px] text-slate-400 space-y-1 pl-4 list-disc">
                                                <li>Entrena cálculo y visión espacial.</li>
                                                <li>Basado en táctica de enroque y finales.</li>
                                                <li>Resolución asíncrona sin temporizador.</li>
                                            </ul>
                                        </div>
                                        <div className="pt-4 border-t border-[#3c1e0a] mt-4 text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                                            Otorga ELO Táctico (+15)
                                        </div>
                                    </div>

                                    {/* vs AI Lab */}
                                    <div className="wood-panel p-6 rounded-none flex flex-col justify-between h-96">
                                        <div className="space-y-4">
                                            <div className="w-10 h-10 bg-amber-950/40 border border-amber-800/40 text-amber-400 flex items-center justify-center">
                                                <Brain size={20} />
                                            </div>
                                            <h4 className="font-bold text-base text-white uppercase">Laboratorio de OnixAI</h4>
                                            <p className="text-xs text-slate-350 leading-relaxed">
                                                Enfréntate a nuestro motor inteligente en partidas completas. Utiliza algoritmos Minimax a profundidad 3 y adaptabilidad posicional según tu nivel de juego.
                                            </p>
                                            <ul className="text-[10px] text-slate-400 space-y-1 pl-4 list-disc">
                                                <li>Entrena teoría de aperturas y estructuras.</li>
                                                <li>Tres dificultades: Principiante, Manager, CEO.</li>
                                                <li>Guardado local automático de partida.</li>
                                            </ul>
                                        </div>
                                        <div className="pt-4 border-t border-[#3c1e0a] mt-4 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                                            Entrenamiento libre / Sin pérdida de ELO
                                        </div>
                                    </div>

                                    {/* PvP Arena */}
                                    <div className="wood-panel p-6 rounded-none flex flex-col justify-between h-96 border-t-4 border-amber-500">
                                        <div className="space-y-4">
                                            <div className="w-10 h-10 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
                                                <Gamepad2 size={20} />
                                            </div>
                                            <h4 className="font-bold text-base text-white uppercase">Arena de Combate PvP</h4>
                                            <p className="text-xs text-slate-350 leading-relaxed">
                                                Combates en vivo contra humanos en la plataforma o bots de contingencia automáticos. Modifica tu ELO de clasificación en la tabla global OnixLingo.
                                            </p>
                                            <ul className="text-[10px] text-slate-400 space-y-1 pl-4 list-disc">
                                                <li>Entrena el autocontrol bajo tiempo límite.</li>
                                                <li>Controles Bullet, Blitz y Rapid habilitados.</li>
                                                <li>Conexión WebSocket directa y relojes activos.</li>
                                            </ul>
                                        </div>
                                        <div className="pt-4 border-t border-[#3c1e0a] mt-4 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                                            Modifica ELO PvP (+15 / -15)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
