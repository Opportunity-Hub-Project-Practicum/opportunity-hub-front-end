import { apiRequest } from "../../../services/apiClient";
import type {
    CreateFavoriteCandidateResponse,
    FavoriteCandidateApi,
    FavoriteCandidatesResponse,
} from "../types/favoriteCandidate";

export async function fetchFavoriteCandidates(): Promise<FavoriteCandidateApi[]> {
    const response = await apiRequest<FavoriteCandidatesResponse>("/employer/favorite-candidates");
    return response.favorites;
}

export async function addFavoriteCandidate(seekerId: number): Promise<FavoriteCandidateApi> {
    const response = await apiRequest<CreateFavoriteCandidateResponse>("/employer/favorite-candidates", {
        method: "POST",
        body: JSON.stringify({ seeker_id: seekerId }),
    });
    return response.favorite;
}

export async function removeFavoriteCandidate(favoriteCandidateId: number): Promise<void> {
    await apiRequest<{ message: string }>(`/employer/favorite-candidates/${favoriteCandidateId}`, {
        method: "DELETE",
    });
}
