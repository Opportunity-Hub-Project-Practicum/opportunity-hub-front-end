export type PostEmployerApi = {
    user_id: number;
    uuid: string;
    company_name: string;
    logo_img: string | null;
};

export type PostDetailApi = {
    post_id: number;
    uuid: string;
    type: "job" | "volunteer";
    post_status: "open" | "closed";
    is_ban?: boolean;
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
    employer?: PostEmployerApi | null;
};

export type PublicPostApi = {
    post_id: number;
    uuid: string;
    type: "job" | "volunteer";
    post_title: string;
    work_place_type: string | null;
    location: string | null;
    min_salary: string | number | null;
    max_salary: string | number | null;
    job_role: string | null;
    job_level: string | null;
    closed_date: string | null;
    benefits: string[] | null;
    employer?: PostEmployerApi | null;
};

export type PostFilterCategory = {
    label: string;
    value: string;
};

export type PostFiltersData = {
    filters: Record<string, unknown>;
    categories: PostFilterCategory[];
    defaults: {
        sort: string;
        per_page: number;
    };
};

export type PostFiltersResponse = {
    success: boolean;
    message: string;
    data: PostFiltersData;
};
