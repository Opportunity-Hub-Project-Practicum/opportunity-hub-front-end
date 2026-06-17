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
};

export async function fetchPublicPosts(params?: FetchPublicPostsParams): Promise<PublicPostApi[]> {
    const searchParams = new URLSearchParams();

    if (params?.type) {
        searchParams.set("type", params.type);
    }

    if (params?.employerId != null) {
        searchParams.set("employer_id", String(params.employerId));
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
    const post = await fetchPostDetail(postId);
    if (!post) {
        return null;
    }

    if (post.employer?.user_id) {
        return post;
    }

    const posts = await fetchPublicPosts({ type: post.type });
    const listedPost = posts.find((item) => item.post_id === postId);

    if (!listedPost?.employer) {
        return post;
    }

    return {
        ...post,
        employer: listedPost.employer,
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
