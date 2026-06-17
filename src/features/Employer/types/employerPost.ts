export type EmployerPostBanReportApi = {
    report_id: number;
    report_reason: string;
    report_status: "pending" | "resolved";
    created_date: string;
};

export type EmployerPostApi = {
    post_id: number;
    uuid: string;
    type: "job" | "volunteer";
    post_status: "open" | "closed";
    is_ban: boolean;
    post_title: string;
    post_description: string | null;
    responsibility: string | null;
    work_place_type: string | null;
    location: string | null;
    duration: string | null;
    schedule: string | null;
    hours_per_week: number | null;
    benefits: string[] | null;
    language: string | null;
    min_salary: string | number | null;
    max_salary: string | number | null;
    job_role: string | null;
    job_education: string | null;
    job_experience: string | null;
    job_requirement: string | null;
    job_level: string | null;
    closed_date: string | null;
    created_at: string | null;
    applications_count?: number;
    ban_reports?: EmployerPostBanReportApi[];
};

export type EmployerPostsResponse = {
    posts: EmployerPostApi[];
};
