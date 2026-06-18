import type { PublicPostApi } from "../types/post";
import { getPostLookupName } from "../lib/postLookup";
import {
    toPostListCardItem,
    type PostListCardItem,
} from "../services/postApiService";
import { apiRequest } from "../../../services/apiClient";

export type SearchFilters = {
    experience?: string;
    salary?: string;
    jobLevel?: string;
    jobTypes?: string[];
    education?: string[];
    duration?: string;
    schedule?: string[];
    hoursPerWeek?: string;
    benefits?: string[];
    languageRequirement?: string;
};

export type SearchPayload = {
    query?: string;
    location?: string;
    category?: string;
    opportunityType?: "job" | "volunteer";
    filters?: SearchFilters;
};

export type SearchPostsParams = {
    type?: "job" | "volunteer";
    search?: string;
    location?: string;
    job_role?: string;
    work_place_type?: "remote" | "onsite" | "hybrid";
    employer_id?: number;
    job_experience?: string;
    job_level?: string;
    job_type?: string[];
    job_education?: string[];
    salary_min?: number;
    duration?: string;
    schedule?: string[];
    hours_per_week?: string;
    benefits?: string[];
    language?: string;
};

const SALARY_MIN_BY_LABEL: Record<string, number> = {
    "$100+": 100,
    "$300+": 300,
    "$500+": 500,
    "$800+": 800,
    "$1000+": 1000,
    "$1500+": 1500,
    "$2000+": 2000,
};

function appendArrayParams(searchParams: URLSearchParams, key: string, values?: string[]): void {
    if (!values?.length) {
        return;
    }

    for (const value of values) {
        searchParams.append(`${key}[]`, value);
    }
}

export function buildSearchPostsParams(payload: SearchPayload): SearchPostsParams {
    const params: SearchPostsParams = {};

    if (payload.opportunityType) {
        params.type = payload.opportunityType;
    }

    if (payload.query?.trim()) {
        params.search = payload.query.trim();
    }

    if (payload.location === "remote") {
        params.work_place_type = "remote";
    } else if (payload.location?.trim()) {
        params.location = payload.location.trim();
    }

    if (payload.category?.trim()) {
        params.job_role = payload.category.trim();
    }

    const filters = payload.filters;
    if (!filters) {
        return params;
    }

    if (filters.experience) {
        params.job_experience = filters.experience;
    }

    if (filters.jobLevel) {
        params.job_level = filters.jobLevel;
    }

    if (filters.jobTypes?.length) {
        params.job_type = filters.jobTypes;
    }

    if (filters.education?.length) {
        params.job_education = filters.education;
    }

    if (filters.salary && filters.salary !== "All") {
        const salaryMin = SALARY_MIN_BY_LABEL[filters.salary];
        if (salaryMin != null) {
            params.salary_min = salaryMin;
        }
    }

    if (filters.duration) {
        params.duration = filters.duration;
    }

    if (filters.schedule?.length) {
        params.schedule = filters.schedule;
    }

    if (filters.hoursPerWeek) {
        params.hours_per_week = filters.hoursPerWeek;
    }

    if (filters.benefits?.length && !filters.benefits.includes("all")) {
        params.benefits = filters.benefits;
    }

    if (filters.languageRequirement && filters.languageRequirement !== "none") {
        params.language = filters.languageRequirement;
    }

    return params;
}

export function hasSearchParams(params: SearchPostsParams): boolean {
    if (params.search?.trim()) {
        return true;
    }

    const scalarKeys: (keyof SearchPostsParams)[] = [
        "location",
        "job_role",
        "work_place_type",
        "employer_id",
        "job_experience",
        "job_level",
        "salary_min",
        "duration",
        "hours_per_week",
        "language",
    ];

    for (const key of scalarKeys) {
        const value = params[key];
        if (value !== undefined && value !== null && value !== "") {
            return true;
        }
    }

    const arrayKeys: (keyof SearchPostsParams)[] = ["job_type", "job_education", "schedule", "benefits"];
    for (const key of arrayKeys) {
        const value = params[key];
        if (Array.isArray(value) && value.length > 0) {
            return true;
        }
    }

    return false;
}

export async function fetchSearchPosts(params: SearchPostsParams): Promise<PublicPostApi[]> {
    if (!hasSearchParams(params)) {
        return [];
    }

    const searchParams = new URLSearchParams();

    if (params.type) {
        searchParams.set("type", params.type);
    }

    if (params.search?.trim()) {
        searchParams.set("search", params.search.trim());
    }

    if (params.location) {
        searchParams.set("location", params.location);
    }

    if (params.job_role) {
        searchParams.set("job_role", params.job_role);
    }

    if (params.work_place_type) {
        searchParams.set("work_place_type", params.work_place_type);
    }

    if (params.employer_id != null) {
        searchParams.set("employer_id", String(params.employer_id));
    }

    if (params.job_experience) {
        searchParams.set("job_experience", params.job_experience);
    }

    if (params.job_level) {
        searchParams.set("job_level", params.job_level);
    }

    if (params.salary_min != null) {
        searchParams.set("salary_min", String(params.salary_min));
    }

    if (params.duration) {
        searchParams.set("duration", params.duration);
    }

    if (params.hours_per_week) {
        searchParams.set("hours_per_week", params.hours_per_week);
    }

    if (params.language) {
        searchParams.set("language", params.language);
    }

    appendArrayParams(searchParams, "job_type", params.job_type);
    appendArrayParams(searchParams, "job_education", params.job_education);
    appendArrayParams(searchParams, "schedule", params.schedule);
    appendArrayParams(searchParams, "benefits", params.benefits);

    const query = searchParams.toString();
    const response = await apiRequest<{ posts: PublicPostApi[] }>(
        `/posts/search${query ? `?${query}` : ""}`,
        {},
        { auth: false },
    );

    return response.posts;
}

export function hasActiveSearch(payload: SearchPayload | null | undefined): boolean {
    if (!payload) {
        return false;
    }

    return hasSearchParams(buildSearchPostsParams(payload));
}

export async function runPostSearch(payload: SearchPayload): Promise<PostListCardItem[]> {
    const posts = await fetchSearchPosts(buildSearchPostsParams(payload));
    return posts.map(toPostListCardItem);
}

export function getPostLookupDisplayName(
    field: PublicPostApi["location"] | PublicPostApi["job_role"],
): string {
    return getPostLookupName(field);
}
