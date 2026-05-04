// src/store/useCompanyStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
    CompanyDetailResponse,
    CompanyResponse,
    EmployeeRow,
} from "@/services/b2bService";
import {
    getCompanyDetail,
    getCompanyEmployees,
    refreshAnalyticsCache,
} from "@/services/b2bService";

// ─── Types ───────────────────────────────────────────────

export interface EmployeeFilters {
    search: string;
    department_id: string | null;
    language: string | null;
    page: number;
    page_size: number;
}

// ─── State Shape ─────────────────────────────────────────

interface CompanyState {
    // Company data
    company: CompanyDetailResponse | null;
    companiesList: CompanyResponse[];     // for SuperAdmin switching between tenants

    // Employee table
    employees: EmployeeRow[];
    selectedEmployeeIds: Set<string>;
    employeeTotal: number;
    filters: EmployeeFilters;

    // UI state
    isLoadingCompany: boolean;
    isLoadingEmployees: boolean;
    isRefreshingCache: boolean;
    error: string | null;
}

// ─── Actions Shape ───────────────────────────────────────

interface CompanyActions {
    // Data fetching
    fetchCompany: (companyId: string) => Promise<void>;
    fetchEmployees: (companyId: string, filters?: Partial<EmployeeFilters>) => Promise<void>;
    triggerCacheRefresh: (companyId: string) => Promise<void>;

    // Filters
    setFilter: <K extends keyof EmployeeFilters>(key: K, value: EmployeeFilters[K]) => void;
    resetFilters: () => void;

    // Employee selection (for bulk license actions)
    toggleEmployeeSelection: (userId: string) => void;
    selectAllEmployees: () => void;
    clearSelection: () => void;

    // SuperAdmin tenant switching
    setCompaniesList: (companies: CompanyResponse[]) => void;

    // Misc
    clearError: () => void;
    reset: () => void;
}

// ─── Defaults ────────────────────────────────────────────

const DEFAULT_FILTERS: EmployeeFilters = {
    search: "",
    department_id: null,
    language: null,
    page: 1,
    page_size: 25,
};

const initialState: CompanyState = {
    company: null,
    companiesList: [],
    employees: [],
    selectedEmployeeIds: new Set(),
    employeeTotal: 0,
    filters: DEFAULT_FILTERS,
    isLoadingCompany: false,
    isLoadingEmployees: false,
    isRefreshingCache: false,
    error: null,
};

// ─── Store ────────────────────────────────────────────────

export const useCompanyStore = create<CompanyState & CompanyActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // ── Fetching ─────────────────────────────────────

                fetchCompany: async (companyId) => {
                    set({ isLoadingCompany: true, error: null }, false, "fetchCompany/pending");
                    try {
                        const company = await getCompanyDetail(companyId);
                        set({ company, isLoadingCompany: false }, false, "fetchCompany/fulfilled");
                    } catch (err) {
                        const msg = err instanceof Error ? err.message : "Failed to load company";
                        set({ error: msg, isLoadingCompany: false }, false, "fetchCompany/rejected");
                    }
                },

                fetchEmployees: async (companyId, overrides) => {
                    const filters = { ...get().filters, ...overrides };
                    set(
                        { filters, isLoadingEmployees: true, error: null },
                        false,
                        "fetchEmployees/pending"
                    );
                    try {
                        const result = await getCompanyEmployees(companyId, {
                            page: filters.page,
                            page_size: filters.page_size,
                            search: filters.search || undefined,
                            department_id: filters.department_id ?? undefined,
                            language: filters.language ?? undefined,
                        });
                        set(
                            {
                                employees: result.items,
                                employeeTotal: result.total,
                                isLoadingEmployees: false,
                                selectedEmployeeIds: new Set(),  // clear stale selections on reload
                            },
                            false,
                            "fetchEmployees/fulfilled"
                        );
                    } catch (err) {
                        const msg = err instanceof Error ? err.message : "Failed to load employees";
                        set(
                            { error: msg, isLoadingEmployees: false },
                            false,
                            "fetchEmployees/rejected"
                        );
                    }
                },

                triggerCacheRefresh: async (companyId) => {
                    set({ isRefreshingCache: true }, false, "triggerCacheRefresh/pending");
                    try {
                        await refreshAnalyticsCache(companyId);
                        // Re-fetch company to hydrate updated metrics
                        await get().fetchCompany(companyId);
                    } catch (err) {
                        const msg = err instanceof Error ? err.message : "Cache refresh failed";
                        set({ error: msg }, false, "triggerCacheRefresh/rejected");
                    } finally {
                        set({ isRefreshingCache: false }, false, "triggerCacheRefresh/done");
                    }
                },

                // ── Filters ──────────────────────────────────────

                setFilter: (key, value) =>
                    set(
                        (state) => ({
                            filters: {
                                ...state.filters,
                                [key]: value,
                                // Reset to page 1 whenever a non-page filter changes
                                page: key === "page" ? (value as number) : 1,
                            },
                        }),
                        false,
                        `setFilter/${key}`
                    ),

                resetFilters: () =>
                    set({ filters: DEFAULT_FILTERS }, false, "resetFilters"),

                // ── Employee Selection ────────────────────────────

                toggleEmployeeSelection: (userId) =>
                    set(
                        (state) => {
                            const next = new Set(state.selectedEmployeeIds);
                            next.has(userId) ? next.delete(userId) : next.add(userId);
                            return { selectedEmployeeIds: next };
                        },
                        false,
                        "toggleEmployeeSelection"
                    ),

                selectAllEmployees: () =>
                    set(
                        (state) => ({
                            selectedEmployeeIds: new Set(state.employees.map((e) => e.user_id)),
                        }),
                        false,
                        "selectAllEmployees"
                    ),

                clearSelection: () =>
                    set({ selectedEmployeeIds: new Set() }, false, "clearSelection"),

                // ── SuperAdmin ────────────────────────────────────

                setCompaniesList: (companies) =>
                    set({ companiesList: companies }, false, "setCompaniesList"),

                // ── Misc ─────────────────────────────────────────

                clearError: () => set({ error: null }, false, "clearError"),

                reset: () =>
                    set({ ...initialState, selectedEmployeeIds: new Set() }, false, "reset"),
            }),
            {
                name: "onixlingo-company-store",
                // Only persist non-sensitive UI preferences, not the full employee list
                partialize: (state) => ({
                    filters: state.filters,
                    company: state.company
                        ? { id: state.company.id, name: state.company.name, slug: state.company.slug }
                        : null,
                }),
            }
        ),
        { name: "CompanyStore" }
    )
);

// ─── Selectors ────────────────────────────────────────────

export const selectSelectedCount = (s: CompanyState) =>
    s.selectedEmployeeIds.size;

export const selectIsAllSelected = (s: CompanyState) =>
    s.employees.length > 0 &&
    s.employees.every((e) => s.selectedEmployeeIds.has(e.user_id));

export const selectSelectedEmployees = (s: CompanyState) =>
    s.employees.filter((e) => s.selectedEmployeeIds.has(e.user_id));

export const selectWeaknessLeaderboard = (s: CompanyState) =>
    s.company?.top_weakness_categories ?? [];

export const selectSeatUsagePct = (s: CompanyState): number => {
    if (!s.company || s.company.max_seats === 0) return 0;
    return Math.min(
        100,
        Math.round((s.company.total_employees / s.company.max_seats) * 100)
    );
};
