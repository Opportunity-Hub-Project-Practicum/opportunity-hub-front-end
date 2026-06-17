import type { FavoriteCandidateApi, SavedCandidateCardItem } from "../types/favoriteCandidate";
import { resolveAssetUrl } from "./resolveAssetUrl";

function formatCandidateSubtitle(favorite: FavoriteCandidateApi): string | undefined {
    const parts = [favorite.education, favorite.experience].filter(
        (value): value is string => Boolean(value?.trim()),
    );

    if (parts.length === 0) {
        return undefined;
    }

    return parts.join(" · ");
}

export function mapFavoriteCandidateToCardItem(
    favorite: FavoriteCandidateApi,
): SavedCandidateCardItem {
    return {
        favoriteCandidateId: favorite.favorite_candidate_id,
        seekerId: favorite.seeker_id,
        name: favorite.seeker_name?.trim() || `Candidate #${favorite.seeker_id}`,
        image: favorite.profile_img ? resolveAssetUrl(favorite.profile_img) : "",
        subtitle: formatCandidateSubtitle(favorite),
    };
}

export function filterFavoriteCandidates(
    favorites: FavoriteCandidateApi[],
    search: string,
): FavoriteCandidateApi[] {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
        return favorites;
    }

    return favorites.filter((favorite) => {
        const haystack = [
            favorite.seeker_name,
            favorite.seeker_email,
            favorite.education,
            favorite.experience,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(normalizedSearch);
    });
}
