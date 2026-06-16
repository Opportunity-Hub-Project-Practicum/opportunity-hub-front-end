export type ReportStatus = "pending" | "resolved";

export type AdminReportApi = {
    report_id: number;
    seeker_id: number;
    seeker_name: string | null;
    seeker_email: string | null;
    post_id: number;
    post_title: string | null;
    employer_id: number | null;
    employer_name: string | null;
    report_reason: string;
    report_status: ReportStatus;
    post_is_ban: boolean;
    created_at: string | null;
    updated_at: string | null;
};

export type AdminReportsResponse = {
    reports: AdminReportApi[];
};

export type AdminReportResponse = {
    report: AdminReportApi;
    message?: string;
};

export type GroupedReportedPost = {
    postId: number;
    postTitle: string;
    employerName: string;
    reportCount: number;
    latestReportedAt: string;
    status: ReportStatus;
    isBanned: boolean;
    reports: AdminReportApi[];
};
