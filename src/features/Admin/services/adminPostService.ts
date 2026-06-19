import { apiRequest } from "../../../services/apiClient";
import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import {
    formatClosedDate,
    formatPostSalary,
    formatWorkPlaceType,
} from "../../Seeker/services/postApiService";
import type { PostDetailApi } from "../../Seeker/types/post";
import type { AdminPostApi, AdminPostListItem, AdminPostsResponse } from "../types/adminPost";

const PLACEHOLDER_IMAGE = "https://placehold.co/60x60";

export type FetchAdminPostsParams = {
    type?: "job" | "volunteer";
    isBan?: boolean;
    search?: string;
};

function buildAdminPostsQuery(params?: FetchAdminPostsParams): string {
    const searchParams = new URLSearchParams();

    if (params?.type) {
        searchParams.set("type", params.type);
    }

    if (params?.isBan !== undefined) {
        searchParams.set("is_ban", String(params.isBan));
    }

    if (params?.search?.trim()) {
        searchParams.set("search", params.search.trim());
    }

    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

export async function fetchAdminPosts(params?: FetchAdminPostsParams): Promise<AdminPostApi[]> {
    const response = await apiRequest<AdminPostsResponse>(
        `/admin/posts${buildAdminPostsQuery(params)}`,
    );
    return response.posts;
}

export async function fetchAdminPost(postId: number): Promise<PostDetailApi> {
    const response = await apiRequest<{ post: PostDetailApi }>(`/admin/posts/${postId}`);
    return response.post;
}

function resolvePostImage(logoPath: string | null | undefined): string {
    const resolved = resolveAssetUrl(logoPath);
    return resolved || PLACEHOLDER_IMAGE;
}

export function mapAdminPostToListItem(post: AdminPostApi): AdminPostListItem {
    const salary = formatPostSalary(post);

    return {
        id: String(post.post_id),
        title: post.post_title,
        organizationName: post.employer?.company_name ?? "Unknown",
        image: resolvePostImage(post.employer?.logo_img),
        workPlaceType: formatWorkPlaceType(post.work_place_type),
        salary: salary || undefined,
        closeDate: formatClosedDate(post.closed_date),
        status: post.is_ban ? "Ban" : "Active",
        applications: post.applications_count ?? 0,
        type: post.type,
    };
}
