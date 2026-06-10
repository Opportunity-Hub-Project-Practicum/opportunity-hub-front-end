import { useCallback, useEffect, useMemo, useState } from "react";
import FavCandidateCard from "../Components/card/candidateFavCard";
import SearchBox from "../../../GlobalComponents/SearchBox";
import { formatApiError } from "../../../services/apiClient";
import {
    filterFavoriteCandidates,
    mapFavoriteCandidateToCardItem,
} from "../lib/favoriteCandidateMappers";
import {
    fetchFavoriteCandidates,
    removeFavoriteCandidate,
} from "../services/favoriteCandidateService";
import type { FavoriteCandidateApi } from "../types/favoriteCandidate";

export default function SaveCandidatePage() {
    const [search, setSearch] = useState("");
    const [favorites, setFavorites] = useState<FavoriteCandidateApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const loadSavedCandidates = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchFavoriteCandidates();
            setFavorites(response);
        } catch (loadError) {
            setError(formatApiError(loadError));
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSavedCandidates();
    }, [loadSavedCandidates]);

    const items = useMemo(
        () => filterFavoriteCandidates(favorites, search).map(mapFavoriteCandidateToCardItem),
        [favorites, search],
    );

    const handleRemove = async (favoriteCandidateId: number) => {
        setActionError(null);

        try {
            await removeFavoriteCandidate(favoriteCandidateId);
            setFavorites((prev) =>
                prev.filter((item) => item.favorite_candidate_id !== favoriteCandidateId),
            );
        } catch (removeError) {
            setActionError(formatApiError(removeError));
        }
    };

    return (
        <div className="page-container">
            <SearchBox search={search} setSearch={setSearch} />

            {loading && <p className="text-gray-500">Loading saved candidates...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {actionError && <p className="text-red-600">{actionError}</p>}

            {!loading && !error && items.length === 0 && (
                <p className="text-gray-500">No saved candidates yet.</p>
            )}

            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <FavCandidateCard
                        key={item.favoriteCandidateId}
                        id={item.favoriteCandidateId}
                        name={item.name}
                        image={item.image}
                        subtitle={item.subtitle}
                        isBookmarked
                        onBookmark={() => void handleRemove(item.favoriteCandidateId)}
                    />
                ))}
            </div>
        </div>
    );
}
