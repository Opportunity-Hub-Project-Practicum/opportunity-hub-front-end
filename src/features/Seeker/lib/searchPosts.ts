import type { PublicPostApi } from "../types/post";
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

const JOB_LEVEL_MAP: Record<string, string> = {
    "Entry Level": "entry_level",
    "Expert Level": "expert_level",
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

function normalizeBenefitLabel(label: string): string {
    return label.toLowerCase().replace(/\s+/g, "_").replace(/\//g, "_");
}

export function applySearchFilters(posts: PublicPostApi[], payload: SearchPayload): PublicPostApi[] {
    let filtered = [...posts];
    const filters = payload.filters;

    if (payload.category?.trim()) {
        const category = payload.category.trim().toLowerCase();
        filtered = filtered.filter((post) =>
            (post.job_role ?? "").toLowerCase().includes(category)
            || (post.post_title ?? "").toLowerCase().includes(category),
        );
    }

    if (!filters) {
        return filtered;
    }

    if (filters.jobLevel) {
        const mappedLevel = JOB_LEVEL_MAP[filters.jobLevel];
        if (mappedLevel) {
            filtered = filtered.filter((post) => post.job_level === mappedLevel);
        }
    }

    if (filters.jobTypes && filters.jobTypes.length > 0) {
        if (filters.jobTypes.includes("Remote")) {
            filtered = filtered.filter((post) => post.work_place_type === "remote");
        }
    }

    if (filters.salary && filters.salary !== "All") {
        filtered = filtered.filter((post) => postMatchesSalary(post, filters.salary!));
    }

    if (filters.education && filters.education.length > 0 && !filters.education.includes("All")) {
        const educationTerms = filters.education.map((item) => item.toLowerCase());
        filtered = filtered.filter((post) => {
            const haystack = (post.job_role ?? post.post_title ?? "").toLowerCase();
            return educationTerms.some((term) => haystack.includes(term));
        });
    }

    if (filters.benefits && filters.benefits.length > 0 && !filters.benefits.includes("All")) {
        const benefitTerms = filters.benefits.map(normalizeBenefitLabel);
        filtered = filtered.filter((post) => {
            const postBenefits = (post.benefits ?? []).map((benefit) => benefit.toLowerCase());
            return benefitTerms.some((term) =>
                postBenefits.some((benefit) => benefit.includes(term)),
            );
        });
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
        const locationQuery = payload.location.trim().toLowerCase();
        filtered = filtered.filter((post) =>
            (post.location ?? "").toLowerCase().includes(locationQuery),
        );
    }

    filtered = applySearchFilters(filtered, payload);

    return filtered.map(toPostListCardItem);
}
