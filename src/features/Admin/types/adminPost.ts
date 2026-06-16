import type { PostEmployerApi } from "../../Seeker/types/post";

export type AdminPostApi = {
    post_id: number;
    uuid: string;
    type: "job" | "volunteer";
    post_title: string;
    work_place_type: string | null;
    min_salary: string | number | null;
    max_salary: string | number | null;
    benefits: string[] | null;
    closed_date: string | null;
    is_ban: boolean;
    applications_count?: number;
    employer?: PostEmployerApi | null;
};

export type AdminPostsResponse = {
    posts: AdminPostApi[];
};

export type AdminPostListItem = {
    id: string;
    title: string;
    organizationName: string;
    image: string;
    workPlaceType: string;
    salary?: string;
    closeDate: string;
    status: "Active" | "Ban";
    applications: number;
    type: "job" | "volunteer";
};
