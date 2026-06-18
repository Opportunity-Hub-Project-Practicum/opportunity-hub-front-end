import type { PublicPostApi } from "../types/post";
import { postMatchesLookupValue } from "./postLookup";
import {
    fetchPublicPosts,
    toPostListCardItem,
    type PostListCardItem,
} from "../services/postApiService";

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

const SALARY_RANGES: Record<string, { min: number; max: number | null }> = {
    "$100+": { min: 100, max: null },
    "$300+": { min: 300, max: null },
    "$500+": { min: 500, max: null },
    "$800+": { min: 800, max: null },
    "$1000+": { min: 1000, max: null },
    "$1500+": { min: 1500, max: null },
    "$2000+": { min: 2000, max: null },
};

function parseSalary(value: string | number | null | undefined): number | null {
    if (value == null || value === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function postMatchesSalary(post: PublicPostApi, salaryLabel: string): boolean {
    const range = SALARY_RANGES[salaryLabel];
    if (!range) {
        return true;
    }

    const minSalary = parseSalary(post.min_salary);
    const maxSalary = parseSalary(post.max_salary);

    if (minSalary == null && maxSalary == null) {
        return false;
    }

    const postMin = minSalary ?? maxSalary ?? 0;
    const postMax = maxSalary ?? minSalary ?? postMin;

    if (range.max == null) {
        return postMax >= range.min;
    }

    return postMax >= range.min && postMin <= range.max;
}

export function applySearchFilters(posts: PublicPostApi[], payload: SearchPayload): PublicPostApi[] {
    let filtered = [...posts];
    const filters = payload.filters;

    if (payload.category?.trim()) {
        filtered = filtered.filter((post) => postMatchesLookupValue(post.job_role, payload.category!));
    }

    if (!filters) {
        return filtered;
    }

    if (filters.experience) {
        filtered = filtered.filter((post) => post.job_experience === filters.experience);
    }

    if (filters.jobLevel) {
        filtered = filtered.filter((post) => post.job_level === filters.jobLevel);
    }

    if (filters.jobTypes && filters.jobTypes.length > 0) {
        filtered = filtered.filter((post) => filters.jobTypes!.includes(post.job_type ?? ""));
    }

    if (filters.salary && filters.salary !== "All") {
        filtered = filtered.filter((post) => postMatchesSalary(post, filters.salary!));
    }

    if (filters.education && filters.education.length > 0) {
        filtered = filtered.filter((post) => filters.education!.includes(post.job_education ?? ""));
    }

    if (filters.duration) {
        filtered = filtered.filter((post) => post.duration === filters.duration);
    }

    if (filters.schedule && filters.schedule.length > 0) {
        filtered = filtered.filter((post) => filters.schedule!.includes(post.schedule ?? ""));
    }

    if (filters.hoursPerWeek) {
        filtered = filtered.filter((post) => post.hours_per_week === filters.hoursPerWeek);
    }

    if (filters.benefits && filters.benefits.length > 0 && !filters.benefits.includes("all")) {
        filtered = filtered.filter((post) => {
            const postBenefits = post.benefits ?? [];
            return filters.benefits!.some((benefit) => postBenefits.includes(benefit));
        });
    }

    if (filters.languageRequirement && filters.languageRequirement !== "none") {
        filtered = filtered.filter((post) => post.language === filters.languageRequirement);
    }

    return filtered;
}

export function hasActiveSearch(payload: SearchPayload | null | undefined): boolean {
    if (!payload) {
        return false;
    }

    const hasBasicSearch = Boolean(
        payload.query?.trim()
        || payload.location?.trim()
        || payload.category?.trim(),
    );

    const hasAdvancedFilters = payload.filters
        ? Object.values(payload.filters).some((value) => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return Boolean(value);
        })
        : false;

    return hasBasicSearch || hasAdvancedFilters;
}

export async function runPostSearch(payload: SearchPayload): Promise<PostListCardItem[]> {
    const posts = await fetchPublicPosts({
        type: payload.opportunityType,
        search: payload.query?.trim() || undefined,
        workPlaceType: payload.location === "remote" ? "remote" : undefined,
    });

    let filtered = posts;

    if (payload.location && payload.location !== "remote") {
        filtered = filtered.filter((post) => postMatchesLookupValue(post.location, payload.location!));
    }

    filtered = applySearchFilters(filtered, payload);

    return filtered.map(toPostListCardItem);
}
