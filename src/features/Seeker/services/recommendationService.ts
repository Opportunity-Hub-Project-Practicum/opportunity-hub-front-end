import type { HomePostCard } from "../types/homeSeeker";
import type { PublicPostApi } from "../types/post";
import { apiRequest } from "../../../services/apiClient";
import { toHomePostCard } from "./homeSeekerService";

const DEFAULT_RECOMMENDATION_LIMIT = 6;

export type RecommendationPostType = "job" | "volunteer";

export async function fetchRecommendedPosts(
    type: RecommendationPostType,
    limit = DEFAULT_RECOMMENDATION_LIMIT,
): Promise<HomePostCard[]> {
    const response = await apiRequest<{ posts: PublicPostApi[] }>(
        `/seeker/recommendations?limit=${limit}&type=${type}`,
    );

    return response.posts.map(toHomePostCard);
}
