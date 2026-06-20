import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import { getPostLookupName } from "../lib/postLookup";
import type {
    PostDetailApi,
    PostFiltersData,
    PostFiltersResponse,
    PublicPostApi,
} from "../types/post";
import { apiRequest } from "../../../services/apiClient";

export type FetchPublicPostsParams = {
    type?: "job" | "volunteer";
    employerId?: number;
    search?: string;
    workPlaceType?: "remote" | "onsite" | "hybrid";
    sort?: "latest" | "most_applications" | "urgent_first";
    isUrgent?: boolean;
    limit?: number;
};

export type PostListCardItem = {
    postId: number;
    employerId?: number;
    organizationName: string;
    title: string;
    engagementType: string;
    location: string;
    salary: string;
    remainingDays: string;
    image: string;
    isUrgent: boolean;
};

export async function fetchPublicPosts(params?: FetchPublicPostsParams): Promise<PublicPostApi[]> {
    const searchParams = new URLSearchParams();

    if (params?.type) {
        searchParams.set("type", params.type);
    }

    if (params?.employerId != null) {
        searchParams.set("employer_id", String(params.employerId));
    }

    if (params?.search?.trim()) {
        searchParams.set("search", params.search.trim());
    }

    if (params?.workPlaceType) {
        searchParams.set("work_place_type", params.workPlaceType);
    }

    if (params?.sort) {
        searchParams.set("sort", params.sort);
    }

    if (params?.isUrgent === true) {
        searchParams.set("is_urgent", "1");
    }

    if (params?.limit != null) {
        searchParams.set("limit", String(params.limit));
    }

    const query = searchParams.toString();
    const response = await apiRequest<{ posts: PublicPostApi[] }>(
        `/posts${query ? `?${query}` : ""}`,
        {},
        { auth: false },
    );
    return response?.posts ?? [];
}

export async function fetchPostFilters(): Promise<PostFiltersData> {
    const response = await apiRequest<PostFiltersResponse>(
        "/posts/filters",
        {},
        { auth: false },
    );
    return response?.data ?? { filters: {}, categories: [], defaults: { sort: "", per_page: 10 } };
}

export type PopularCategoryApi = {
    label: string;
    value: string;
    count: number;
};

export async function fetchPopularCategories(limit = 6): Promise<PopularCategoryApi[]> {
    const response = await apiRequest<{ categories: PopularCategoryApi[] }>(
        `/posts/popular-categories?limit=${limit}`,
        {},
        { auth: false },
    );
    return response.categories;
}

export async function fetchPostDetail(postId: number): Promise<PostDetailApi | null> {
    try {
        const response = await apiRequest<{ post: PostDetailApi }>(
            `/posts/${postId}`,
            {},
            { auth: false },
        );
        return response.post;
    } catch {
        return null;
    }
}

export async function fetchPostDetailWithEmployer(postId: number): Promise<PostDetailApi | null> {
    return fetchPostDetail(postId);
}

export function toPostListCardItem(post: PublicPostApi): PostListCardItem {
    return {
        postId: post.post_id,
        employerId: post.employer?.user_id,
        organizationName: post.employer?.company_name ?? "Unknown",
        title: post.post_title,
        engagementType: formatWorkPlaceType(post.work_place_type ?? post.type),
        location: getPostLookupName(post.location),
        salary: formatPostSalary(post),
        remainingDays: formatClosedDate(post.closed_date),
        image: resolveAssetUrl(post.employer?.logo_img),
        isUrgent: post.is_urgent === true,
    };
}

export function formatWorkPlaceType(value: string | null | undefined): string {
    if (!value) {
        return "";
    }

    return value
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export function formatPostSalary(post: Pick<PublicPostApi, "type" | "min_salary" | "max_salary" | "benefits">): string {
    if (post.type === "job") {
        if (post.min_salary == null || post.max_salary == null) {
            return "";
        }
        return `$${post.min_salary} - $${post.max_salary}`;
    }

    if (post.benefits && post.benefits.length > 0) {
        return post.benefits.join(", ");
    }

    return "Unpaid";
}

export function formatClosedDate(isoDate: string | null): string {
    if (!isoDate) {
        return "";
    }

    return new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
