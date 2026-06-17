import { apiRequest } from "../../../services/apiClient";
import type { EmployerPostApi, EmployerPostsResponse } from "../types/employerPost";

export type UpdateEmployerPostPayload = {
    post_status?: "open" | "closed";
    closed_date?: string | null;
};

export async function fetchEmployerPosts(): Promise<EmployerPostApi[]> {
    const response = await apiRequest<EmployerPostsResponse>("/employer/posts");
    return response?.posts ?? [];
}

export async function updateEmployerPost(
    postId: number,
    payload: UpdateEmployerPostPayload,
): Promise<EmployerPostApi> {
    const response = await apiRequest<{ post: EmployerPostApi }>(`/employer/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return response.post;
}
