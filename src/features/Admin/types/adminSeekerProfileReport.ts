export type ReportStatus = "pending" | "resolved";

export type AdminSeekerProfileReportApi = {
    seeker_profile_report_id: number;
    employer_id: number;
    employer_name: string | null;
    employer_email: string | null;
    reported_seeker_id: number;
    reported_seeker_name: string | null;
    reported_seeker_email: string | null;
    seeker_is_ban: boolean;
    report_reason: string;
    report_status: ReportStatus;
    created_at: string | null;
    updated_at: string | null;
};

export type AdminSeekerProfileReportsResponse = {
    reports: AdminSeekerProfileReportApi[];
};

export type ResolveSeekerProfileReportsResponse = {
    message: string;
    seeker_is_ban: boolean;
    reports: AdminSeekerProfileReportApi[];
};

export type GroupedReportedSeeker = {
    seekerId: number;
    seekerName: string;
    seekerEmail: string;
    reportCount: number;
    latestReportedAt: string;
    status: ReportStatus;
    isBanned: boolean;
    reports: AdminSeekerProfileReportApi[];
};

export type ReportType = "post" | "user";
