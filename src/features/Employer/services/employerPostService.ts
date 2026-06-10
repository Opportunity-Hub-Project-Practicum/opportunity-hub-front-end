import { apiRequest } from "../../../services/apiClient";
import type { EmployerPostApi, EmployerPostsResponse } from "../types/employerPost";

export async function fetchEmployerPosts(): Promise<EmployerPostApi[]> {
    const response = await apiRequest<EmployerPostsResponse>("/employer/posts");
    return response.posts;
}
