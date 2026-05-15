// app/dashboard/company/page.tsx
"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import {
    useCompanyStore,
    selectSeatUsagePct,
    selectIsAllSelected,
    selectSelectedCount,
} from "@/store/useCompanyStore";
import {
    assignLicenses,
    revokeLicense,
    downloadEmployeeReport,
} from "@/services/b2bService";
import { useAuthStore } from "@/store/useAuthStore";

// ── Utility helpers ────────────────────────────────────

const pct = (n: number) => `${n.toFixed(1)}%`;

const CEFR_COLORS: Record<string, string> = {
    A1: "bg-red-900/50 text-red-300 border-red-700/40",
    A2: "bg-orange-900/50 text-orange-300 border-orange-700/40",
    B1: "bg-yellow-900/50 text-yellow-200 border-yellow-700/40",
    B2: "bg-sky-900/50 text-sky-300 border-sky-700/40",
    C1: "bg-emerald-900/50 text-emerald-300 border-emerald-700/40",
    C2: "bg-violet-900/50 text-violet-300 border-violet-700/40",
};

const PLAN_BADGES: Record<string, string> = {
    titanium: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    enterprise: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    growth: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    starter: "bg-slate-600/30 text-slate-300 border-slate-500/40",
};

// ── Small reusable pieces ──────────────────────────────

function KpiCard({
    icon, value, label, sublabel, accent = "indigo",
}: {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    sublabel?: string;
    accent?: "indigo" | "emerald" | "cyan" | "rose";
}) {
    const ring: Record<string, string> = {
        indigo: "from-indigo-600/20 to-indigo-900/0 border-indigo-500/20",
        emerald: "from-emerald-600/20 to-emerald-900/0 border-emerald-500/20",
        cyan: "from-cyan-600/20 to-cyan-900/0 border-cyan-500/20",
        rose: "from-rose-600/20 to-rose-900/0 border-rose-500/20",
    };
    return (
        <div
            className={`relative flex flex-col gap-2 rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm ${ring[accent]}`}
        >
            <span className="text-2xl">{icon}</span>
            <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
            <span className="text-sm font-medium text-slate-400">{label}</span>
            {sublabel && <span className="text-xs text-slate-500">{sublabel}</span>}
        </div>
    );
}

function Skeleton({ rows = 8 }: { rows?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-white/5">
                    {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                            <div className="h-3.5 rounded bg-slate-700/70" style={{ width: `${55 + ((i + j) % 4) * 10}%` }} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

function ProgressBar({ value, max, colorClass = "bg-indigo-500" }: { value: number; max: number; colorClass?: string }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
            <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${colorClass}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

// ── Main component ─────────────────────────────────────

export default function CompanyDashboardPage() {
    const { user } = useAuthStore();
    const COMPANY_ID = user?.company_id;

    const store = useCompanyStore();
    const seatPct = useCompanyStore(selectSeatUsagePct);
    const allSelected = useCompanyStore(selectIsAllSelected);
    const selectedCount = useCompanyStore(selectSelectedCount);

    const {
        company, employees, employeeTotal, filters,
        selectedEmployeeIds, isLoadingCompany, isLoadingEmployees,
        isRefreshingCache, error,
        fetchCompany, fetchEmployees, triggerCacheRefresh,
        toggleEmployeeSelection, selectAllEmployees, clearSelection,
        setFilter, clearError,
    } = store;

    // ── Bootstrap ───────────────────────────────────────

    useEffect(() => {
        if (COMPANY_ID) {
            fetchCompany(COMPANY_ID);
            fetchEmployees(COMPANY_ID);
        }
    }, [COMPANY_ID, fetchCompany, fetchEmployees]);

    const reload = useCallback(
        (overrides?: Partial<typeof filters>) => {
            if (COMPANY_ID) fetchEmployees(COMPANY_ID, overrides);
        },
        [fetchEmployees, COMPANY_ID]
    );

    const totalPages = Math.ceil(employeeTotal / filters.page_size);

    const handlePageChange = (next: number) => {
        setFilter("page", next);
        reload({ page: next });
    };

    // ── Bulk actions ────────────────────────────────────

    const handleAssign = async () => {
        if (!selectedCount || !COMPANY_ID) return;
        await assignLicenses(COMPANY_ID, { user_ids: [...selectedEmployeeIds] });
        clearSelection();
        reload();
        fetchCompany(COMPANY_ID);
    };

    const handleRevoke = async () => {
        if (!selectedCount || !COMPANY_ID) return;
        await Promise.all([...selectedEmployeeIds].map((id) => revokeLicense(COMPANY_ID, id)));
        clearSelection();
        reload();
        fetchCompany(COMPANY_ID);
    };

    const handleCsvDownload = async () => {
        if (!COMPANY_ID) return;
        const blob = await downloadEmployeeReport(COMPANY_ID);
        const url = URL.createObjectURL(blob);
        Object.assign(document.createElement("a"), { href: url, download: "employees.csv" }).click();
        URL.revokeObjectURL(url);
    };

    // ── Render ──────────────────────────────────────────

    if (!COMPANY_ID) {
        return (
            <main className="min-h-screen bg-[#080c14] text-white flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md mx-auto p-8 border border-red-500/20 bg-red-900/10 rounded-2xl">
                    <div className="text-4xl">🏢</div>
                    <h2 className="text-2xl font-bold text-slate-200">No tienes una empresa asignada</h2>
                    <p className="text-slate-400">Este panel es exclusivo para empleados vinculados a una cuenta corporativa (B2B). Contacta a tu administrador para solicitar acceso.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#080c14] text-white">
            {/* ── Background mesh ── */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-700/10 blur-3xl" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-600/8 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

                {/* ───────────────── HEADER ─────────────────── */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        {isLoadingCompany ? (
                            <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-700" />
                        ) : (
                            <div className="flex items-center gap-3">
                                {company?.logo_url && (
                                    <Image 
                                        src={company.logo_url} 
                                        alt={company.name} 
                                        width={36} 
                                        height={36} 
                                        className="rounded-lg object-cover" 
                                    />
                                )}
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {company?.name ?? "—"}
                                </h1>
                                {company?.plan_tier && (
                                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest ${PLAN_BADGES[company.plan_tier] ?? PLAN_BADGES.starter}`}>
                                        {company.plan_tier}
                                    </span>
                                )}
                            </div>
                        )}
                        <p className="text-sm text-slate-400">
                            {company?.domain ?? "Titanium Enterprise Dashboard"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCsvDownload}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white"
                        >
                            ⬇ Export CSV
                        </button>
                        <button
                            onClick={() => COMPANY_ID && triggerCacheRefresh(COMPANY_ID)}
                            disabled={isRefreshingCache}
                            className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-4 py-2 text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-600/30 disabled:opacity-50"
                        >
                            {isRefreshingCache ? (
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                            ) : "↻"}
                            Refresh Metrics
                        </button>
                    </div>
                </header>

                {/* ───────────────── SEAT USAGE ─────────────── */}
                <section className="rounded-2xl border border-white/10 bg-slate-800/40 p-5 backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-300">License Seat Usage</span>
                        <span className="tabular-nums text-slate-400">
                            {company?.total_employees ?? 0} / {company?.max_seats ?? 0} seats
                            <span className="ml-2 font-semibold text-white">{pct(seatPct)}</span>
                        </span>
                    </div>
                    <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-700">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
                            style={{ width: `${seatPct}%` }}
                        />
                    </div>
                    {seatPct >= 90 && (
                        <p className="mt-2 text-xs text-amber-400">
                            ⚠ Approaching seat limit — consider upgrading your plan.
                        </p>
                    )}
                </section>

                {/* ───────────────── KPI CARDS ──────────────── */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <KpiCard
                        icon="👥"
                        value={company?.total_employees ?? "—"}
                        label="Total Employees"
                        sublabel="Licensed users"
                        accent="indigo"
                    />
                    <KpiCard
                        icon="⚡"
                        value={company?.active_learners_7d ?? "—"}
                        label="Active Learners (7d)"
                        sublabel="Logged a session this week"
                        accent="cyan"
                    />
                    <KpiCard
                        icon="📈"
                        value={company ? pct(company.avg_lesson_completion_pct) : "—"}
                        label="Avg Lesson Completion"
                        sublabel="Across all employees"
                        accent="emerald"
                    />
                    <KpiCard
                        icon="✅"
                        value={company ? pct(company.mandatory_completion_pct) : "—"}
                        label="Mandatory Completion"
                        sublabel="Required courses finished"
                        accent={
                            (company?.mandatory_completion_pct ?? 100) < 50 ? "rose" : "emerald"
                        }
                    />
                </section>

                {/* ───────────────── WEAKNESS LEADERBOARD ──── */}
                {(company?.top_weakness_categories?.length ?? 0) > 0 && (
                    <section className="rounded-2xl border border-rose-500/20 bg-rose-900/10 p-5">
                        <p className="mb-3 text-sm font-semibold text-rose-300">
                            🧠 Top AI-Detected Team Weaknesses
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {company!.top_weakness_categories.map((cat) => (
                                <span
                                    key={cat}
                                    className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300"
                                >
                                    {cat.replace(/_/g, " ")}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* ───────────────── ERROR BANNER ───────────── */}
                {error && (
                    <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                        <span>⛔ {error}</span>
                        <button onClick={clearError} className="ml-4 text-red-400 hover:text-white">✕</button>
                    </div>
                )}

                {/* ───────────────── EMPLOYEE TABLE ─────────── */}
                <section className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm">

                    {/* Table toolbar */}
                    <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-semibold">Employees</h2>
                            <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs text-slate-400">
                                {employeeTotal}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search */}
                            <input
                                type="search"
                                placeholder="Search name or email…"
                                value={filters.search}
                                onChange={(e) => {
                                    setFilter("search", e.target.value);
                                    reload({ search: e.target.value, page: 1 });
                                }}
                                className="w-52 rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500"
                            />

                            {/* Language filter */}
                            <select
                                value={filters.language ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value || null;
                                    setFilter("language", val);
                                    reload({ language: val, page: 1 });
                                }}
                                className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
                            >
                                <option value="">All Languages</option>
                                <option value="en">🇺🇸 English</option>
                                <option value="fr">🇫🇷 French</option>
                                <option value="zh">🇨🇳 Chinese</option>
                                <option value="chess">♟ Chess</option>
                            </select>

                            {/* Bulk actions — visible only when rows are selected */}
                            {selectedCount > 0 && (
                                <div className="flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-900/20 px-3 py-1.5">
                                    <span className="text-xs text-indigo-300">{selectedCount} selected</span>
                                    <button
                                        onClick={handleAssign}
                                        className="rounded-md bg-indigo-600/40 px-2 py-1 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/60"
                                    >
                                        Assign License
                                    </button>
                                    <button
                                        onClick={handleRevoke}
                                        className="rounded-md bg-red-600/30 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-600/50"
                                    >
                                        Revoke
                                    </button>
                                    <button onClick={clearSelection} className="text-xs text-slate-400 hover:text-white">✕</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/8 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={() => allSelected ? clearSelection() : selectAllEmployees()}
                                            className="accent-indigo-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Language</th>
                                    <th className="px-4 py-3">CEFR Level</th>
                                    <th className="px-4 py-3 w-36">Lesson Progress</th>
                                    <th className="px-4 py-3">Top Weaknesses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingEmployees ? (
                                    <Skeleton rows={8} />
                                ) : employees.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-slate-500">
                                            No employees found. Try adjusting your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((emp) => (
                                        <tr
                                            key={emp.user_id}
                                            onClick={() => toggleEmployeeSelection(emp.user_id)}
                                            className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-slate-800/40 ${selectedEmployeeIds.has(emp.user_id) ? "bg-indigo-900/20" : ""
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployeeIds.has(emp.user_id)}
                                                    onChange={() => toggleEmployeeSelection(emp.user_id)}
                                                    className="accent-indigo-500"
                                                />
                                            </td>

                                            {/* Name + email */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold">
                                                        {emp.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{emp.username}</p>
                                                        <p className="text-xs text-slate-500">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Department */}
                                            <td className="px-4 py-3 text-slate-400">
                                                {emp.department ?? <span className="text-slate-600">—</span>}
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3">
                                                <span className="rounded-full border border-white/10 bg-slate-700/50 px-2.5 py-0.5 text-xs capitalize text-slate-300">
                                                    {emp.role.replace(/_/g, " ")}
                                                </span>
                                            </td>

                                            {/* Language */}
                                            <td className="px-4 py-3 text-slate-300 uppercase text-xs font-semibold">
                                                {emp.language === "en" && "🇺🇸 EN"}
                                                {emp.language === "fr" && "🇫🇷 FR"}
                                                {emp.language === "zh" && "🇨🇳 ZH"}
                                                {emp.language === "chess" && "♟ Chess"}
                                            </td>

                                            {/* CEFR */}
                                            <td className="px-4 py-3">
                                                {emp.cefr_level ? (
                                                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${CEFR_COLORS[emp.cefr_level] ?? "border-slate-600 text-slate-400"}`}>
                                                        {emp.cefr_level}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-600">Not assessed</span>
                                                )}
                                            </td>

                                            {/* Progress bar */}
                                            <td className="px-4 py-3">
                                                <div className="space-y-1">
                                                    <ProgressBar
                                                        value={emp.lesson_completion_pct}
                                                        max={100}
                                                        colorClass={
                                                            emp.lesson_completion_pct >= 70
                                                                ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                                                                : emp.lesson_completion_pct >= 40
                                                                    ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                                                                    : "bg-gradient-to-r from-rose-500 to-red-400"
                                                        }
                                                    />
                                                    <span className="text-xs tabular-nums text-slate-500">
                                                        {pct(emp.lesson_completion_pct)} · 🔥 {emp.streak_days}d
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Weaknesses */}
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {emp.top_weaknesses.slice(0, 2).map((w) => (
                                                        <span
                                                            key={w}
                                                            className="rounded-full border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-300"
                                                        >
                                                            {w.replace(/_/g, " ")}
                                                        </span>
                                                    ))}
                                                    {emp.top_weaknesses.length > 2 && (
                                                        <span className="text-[10px] text-slate-500">
                                                            +{emp.top_weaknesses.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                            <span className="text-xs text-slate-500">
                                Page {filters.page} of {totalPages} · {employeeTotal} total
                            </span>
                            <div className="flex gap-2">
                                <button
                                    disabled={filters.page <= 1}
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-white/20 disabled:opacity-30"
                                >
                                    ← Prev
                                </button>
                                <button
                                    disabled={filters.page >= totalPages}
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-white/20 disabled:opacity-30"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
