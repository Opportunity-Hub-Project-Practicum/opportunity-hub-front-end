import { apiRequest } from "../../../services/apiClient";
import type {
    AdminSeekerProfileReportApi,
    AdminSeekerProfileReportsResponse,
    GroupedReportedSeeker,
    ReportStatus,
    ResolveSeekerProfileReportsResponse,
} from "../types/adminSeekerProfileReport";

export type FetchAdminSeekerProfileReportsParams = {
    status?: ReportStatus;
};

function buildReportsQuery(params?: FetchAdminSeekerProfileReportsParams): string {
    if (!params?.status) {
        return "";
    }

    return `?status=${params.status}`;
}

export async function fetchAdminSeekerProfileReports(
    params?: FetchAdminSeekerProfileReportsParams,
): Promise<AdminSeekerProfileReportApi[]> {
    const response = await apiRequest<AdminSeekerProfileReportsResponse>(
        `/admin/seeker-profile-reports${buildReportsQuery(params)}`,
    );
    return response.reports;
}

export type ResolveSeekerProfileReportsAction = "dismiss" | "ban";

export async function resolveAdminSeekerProfileReports(
    seekerId: number,
    action: ResolveSeekerProfileReportsAction,
): Promise<ResolveSeekerProfileReportsResponse> {
    return apiRequest<ResolveSeekerProfileReportsResponse>(
        `/admin/seeker-profile-reports/seekers/${seekerId}/resolve`,
        {
            method: "PATCH",
            body: JSON.stringify({ action }),
        },
    );
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

export function groupReportsBySeeker(
    reports: AdminSeekerProfileReportApi[],
): GroupedReportedSeeker[] {
    const grouped = new Map<number, AdminSeekerProfileReportApi[]>();

    for (const report of reports) {
        const existing = grouped.get(report.reported_seeker_id) ?? [];
        existing.push(report);
        grouped.set(report.reported_seeker_id, existing);
    }

    return Array.from(grouped.entries())
        .map(([seekerId, seekerReports]) => {
            const sortedReports = [...seekerReports].sort((left, right) => {
                const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
                const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
                return rightTime - leftTime;
            });
            const latestReport = sortedReports[0];

            return {
                seekerId,
                seekerName: latestReport.reported_seeker_name ?? `Seeker #${seekerId}`,
                seekerEmail: latestReport.reported_seeker_email ?? "No email",
                reportCount: sortedReports.length,
                latestReportedAt: formatReportedDate(latestReport.created_at),
                status: latestReport.report_status,
                isBanned: latestReport.seeker_is_ban,
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

export function formatSeekerReportDateTime(value: string | null): string {
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
