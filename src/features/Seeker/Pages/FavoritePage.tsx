import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import CardList from "../Components/card/CardList";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { Skeleton } from "../../../GlobalComponents/Skeleton";
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

            {loading && (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                            <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {error && <div className="alert-error">{error}</div>}

            {!loading && !error && selectedItems.length === 0 && (
                <EmptyState
                    icon={Heart}
                    title={`No ${isJob === "job" ? "job" : "volunteer"} favorites yet`}
                    description="Save posts you're interested in and they'll show up here."
                />
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
