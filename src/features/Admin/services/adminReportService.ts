import { apiRequest } from "../../../services/apiClient";
import type {
    AdminReportApi,
    AdminReportResponse,
    AdminReportsResponse,
    GroupedReportedPost,
    ReportStatus,
} from "../types/adminReport";

export type FetchAdminReportsParams = {
    status?: ReportStatus;
};

function buildReportsQuery(params?: FetchAdminReportsParams): string {
    if (!params?.status) {
        return "";
    }

    return `?status=${params.status}`;
}

export async function fetchAdminReports(
    params?: FetchAdminReportsParams,
): Promise<AdminReportApi[]> {
    const response = await apiRequest<AdminReportsResponse>(
        `/admin/reports${buildReportsQuery(params)}`,
    );
    return response.reports;
}

export async function resolveAdminReport(reportId: number): Promise<AdminReportApi> {
    const response = await apiRequest<AdminReportResponse>(
        `/admin/reports/${reportId}/resolve`,
        { method: "PATCH" },
    );
    return response.report;
}

export async function banAdminPost(postId: number): Promise<void> {
    await apiRequest(`/admin/posts/${postId}/ban`, { method: "PATCH" });
}

export async function unbanAdminPost(postId: number): Promise<void> {
    await apiRequest(`/admin/posts/${postId}/unban`, { method: "PATCH" });
}

function formatReportedDate(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function groupReportsByPost(reports: AdminReportApi[]): GroupedReportedPost[] {
    const grouped = new Map<number, AdminReportApi[]>();

    for (const report of reports) {
        const existing = grouped.get(report.post_id) ?? [];
        existing.push(report);
        grouped.set(report.post_id, existing);
    }

    return Array.from(grouped.entries())
        .map(([postId, postReports]) => {
            const sortedReports = [...postReports].sort((left, right) => {
                const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
                const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
                return rightTime - leftTime;
            });
            const latestReport = sortedReports[0];

            return {
                postId,
                postTitle: latestReport.post_title ?? `Post #${postId}`,
                employerName: latestReport.employer_name ?? "Unknown",
                reportCount: sortedReports.length,
                latestReportedAt: formatReportedDate(latestReport.created_at),
                status: latestReport.report_status,
                isBanned: latestReport.post_is_ban,
                reports: sortedReports,
            };
        })
        .sort((left, right) => {
            const leftTime = left.reports[0]?.created_at
                ? new Date(left.reports[0].created_at).getTime()
                : 0;
            const rightTime = right.reports[0]?.created_at
                ? new Date(right.reports[0].created_at).getTime()
                : 0;
            return rightTime - leftTime;
        });
}

export function formatReportDateTime(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}
