import type {
    FavoriteCardItem,
    FavoritePostApi,
    FavoritePostsResponse,
} from "../types/favoritePost";
import type { PostDetailApi } from "../types/post";
import { getPostLookupName } from "../lib/postLookup";
import { apiRequest } from "../../../services/apiClient";
import { fetchPostDetail, formatPostSalary } from "./postApiService";

export async function fetchFavoritePosts(): Promise<FavoritePostApi[]> {
    const response = await apiRequest<FavoritePostsResponse>("/seeker/favorite-posts");
    return response.favorites;
}

export async function removeFavoritePost(favoritePostId: number): Promise<void> {
    await apiRequest(`/seeker/favorite-posts/${favoritePostId}`, {
        method: "DELETE",
    });
}

export async function addFavoritePost(postId: number): Promise<FavoritePostApi> {
    const response = await apiRequest<{ favorite: FavoritePostApi }>("/seeker/favorite-posts", {
        method: "POST",
        body: JSON.stringify({ post_id: postId }),
    });
    return response.favorite;
}

export function findFavoriteForPost(
    favorites: FavoritePostApi[],
    postId: number,
): FavoritePostApi | undefined {
    return favorites.find((favorite) => favorite.post_id === postId);
}

function formatSavedDate(isoDate: string | null): string {
    if (!isoDate) {
        return "";
    }

    return `Saved on ${new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })}`;
}

function toFavoriteCardItem(
    favorite: FavoritePostApi,
    post: PostDetailApi | null,
): FavoriteCardItem | null {
    const postType = favorite.post_type ?? post?.type;
    if (postType !== "job" && postType !== "volunteer") {
        return null;
    }

    return {
        favoritePostId: favorite.favorite_post_id,
        postId: favorite.post_id,
        postType,
        organizationName: favorite.employer_name ?? post?.employer?.company_name ?? "",
        title: favorite.post_title ?? post?.post_title ?? "",
        engagementType: post?.work_place_type ?? postType,
        location: getPostLookupName(post?.location),
        salary: post ? formatPostSalary(post) : "",
        remainingDays: formatSavedDate(favorite.created_at),
        image: post?.employer?.logo_img ?? "",
        postIsBanned: Boolean(post?.is_ban ?? favorite.post_is_ban),
        isUrgent: post?.is_urgent === true,
    };
}

export async function fetchFavoriteCardItems(): Promise<FavoriteCardItem[]> {
    const favorites = await fetchFavoritePosts();

    const enriched = await Promise.all(
        favorites.map(async (favorite) => {
            const post = await fetchPostDetail(favorite.post_id);
            return toFavoriteCardItem(favorite, post);
        }),
    );

    return enriched.filter((item): item is FavoriteCardItem => item !== null);
}
