// src/services/b2bService.ts
import apiClient from "@/lib/apiClient";

// ─── Types (mirrors domain_schemas.py) ───────────────────

export interface CompanyResponse {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    plan_tier: "starter" | "growth" | "enterprise" | "titanium";
    is_active: boolean;
    max_seats: number;
    country_code: string | null;
    timezone: string;
    logo_url: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface CompanyDetailResponse extends CompanyResponse {
    total_employees: number;
    active_learners_7d: number;
    avg_lesson_completion_pct: number;
    mandatory_completion_pct: number;
    top_weakness_categories: string[];
    total_ai_tokens_used: number;
    licenses_count: number;
}

export interface EmployeeRow {
    user_id: string;
    username: string;
    email: string;
    department: string | null;
    role: string;
    language: string;
    cefr_level: string | null;
    lesson_completion_pct: number;
    streak_days: number;
    top_weaknesses: string[];
    last_active_at: string | null;
}

export interface EmployeeListResponse {
    items: EmployeeRow[];
    total: number;
    page: number;
    page_size: number;
}

export interface AssignLicensePayload {
    user_ids: string[];
    languages?: string[];
}

export interface CompanyUpdate {
    name?: string;
    domain?: string;
    plan_tier?: string;
    max_seats?: number;
    is_active?: boolean;
    languages?: string[];
    logo_url?: string;
    metadata_json?: Record<string, unknown>;
}

// ─── API Functions ────────────────────────────────────────

/**
 * Fetch full company detail including analytics cache metrics.
 * Used by the B2B Manager dashboard.
 */
export async function getCompanyDetail(
    companyId: string
): Promise<CompanyDetailResponse> {
    const { data } = await apiClient.get<CompanyDetailResponse>(
        `/b2b/companies/${companyId}`
    );
    return data;
}

/**
 * List employees with their AI-generated weakness data and progress.
 * Supports server-side pagination + optional department filter.
 */
export async function getCompanyEmployees(
    companyId: string,
    params?: {
        page?: number;
        page_size?: number;
        department_id?: string;
        search?: string;
        language?: string;
    }
): Promise<EmployeeListResponse> {
    const { data } = await apiClient.get<EmployeeListResponse>(
        `/b2b/companies/${companyId}/employees`,
        { params }
    );
    return data;
}

/**
 * Assign platform licenses to one or more employees.
 * Returns the updated seat count.
 */
export async function assignLicenses(
    companyId: string,
    payload: AssignLicensePayload
): Promise<{ seats_used: number; seats_total: number }> {
    const { data } = await apiClient.post(
        `/b2b/companies/${companyId}/licenses/assign`,
        payload
    );
    return data;
}

/**
 * Revoke license from a single employee.
 */
export async function revokeLicense(
    companyId: string,
    userId: string
): Promise<void> {
    await apiClient.delete(
        `/b2b/companies/${companyId}/licenses/revoke/${userId}`
    );
}

/**
 * Update mutable company fields (PATCH).
 */
export async function updateCompany(
    companyId: string,
    payload: CompanyUpdate
): Promise<CompanyResponse> {
    const { data } = await apiClient.patch<CompanyResponse>(
        `/b2b/companies/${companyId}`,
        payload
    );
    return data;
}

/**
 * Force-refresh the CompanyAnalyticsCache for a tenant.
 * Triggers the background Celery task synchronously (admin only).
 */
export async function refreshAnalyticsCache(
    companyId: string
): Promise<{ last_refreshed_at: string }> {
    const { data } = await apiClient.post(
        `/b2b/companies/${companyId}/analytics/refresh`
    );
    return data;
}

/**
 * Download a CSV report of all employees' progress.
 * Returns a Blob for client-side download trigger.
 */
export async function downloadEmployeeReport(
    companyId: string
): Promise<Blob> {
    const { data } = await apiClient.get(
        `/b2b/companies/${companyId}/reports/employees.csv`,
        { responseType: "blob" }
    );
    return data;
}
