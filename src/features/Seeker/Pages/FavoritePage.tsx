import { useEffect, useState } from "react";
import CardList from "../Components/card/CardList";
import { formatApiError } from "../../../services/apiClient";
import {
    fetchFavoriteCardItems,
    removeFavoritePost,
} from "../services/favoritePostService";
import type { FavoriteCardItem } from "../types/favoritePost";

export default function Favorite() {
    const [isJob, setIsJob] = useState<"job" | "volunteer">("job");
    const [items, setItems] = useState<FavoriteCardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadFavorites = async () => {
            setLoading(true);
            setError(null);

            try {
                const favorites = await fetchFavoriteCardItems();
                if (!isMounted) return;
                setItems(favorites);
            } catch (err) {
                if (!isMounted) return;
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadFavorites();

        return () => {
            isMounted = false;
        };
    }, []);

    const selectedItems = items.filter((item) => item.postType === isJob);

    const handleRemoveFavorite = async (favoritePostId: number) => {
        try {
            await removeFavoritePost(favoritePostId);
            setItems((prev) => prev.filter((item) => item.favoritePostId !== favoritePostId));
        } catch (err) {
            setError(formatApiError(err));
        }
    };

    return (
        <div>
            <div className="text-gray-600 mb-5 bg-gray-100 rounded-lg flex gap-3 p-3">
                <button
                    className={isJob === "job" ? " text-primary underline" : ""}
                    onClick={() => setIsJob("job")}
                >
                    Jobs
                </button>
                <button
                    className={isJob === "volunteer" ? " text-primary underline" : ""}
                    onClick={() => setIsJob("volunteer")}
                >
                    Volunteers
                </button>
            </div>

            {loading && <p className="text-gray-500">Loading favorites...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && selectedItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                    No {isJob === "job" ? "job" : "volunteer"} favorites found.
                </div>
            )}

            <div className="flex flex-col gap-2">
                {selectedItems.map((item) => (
                    <CardList
                        key={item.favoritePostId}
                        id={item.postId}
                        organizationName={item.organizationName}
                        title={item.title}
                        engagementType={item.engagementType}
                        location={item.location}
                        salary={item.salary}
                        remainingDays={item.remainingDays}
                        image={item.image}
                        isBanned={item.postIsBanned}
                        isUrgent={item.isUrgent}
                        isBookmarked
                        onBookmark={() => handleRemoveFavorite(item.favoritePostId)}
                    />
                ))}
            </div>
        </div>
    );
}
