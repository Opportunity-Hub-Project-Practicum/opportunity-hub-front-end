import { useEffect, useState } from "react";
import FavCandidateCard from "../Components/card/candidateFavCard";
import SearchBox from "../../../GlobalComponents/SearchBox";
import {
    deleteFavouriteCandidate,
    fetchFavouriteCandidates,
    MOCK_USERS,
    type FavouriteCandidate,
} from "../../../services/mockJobPortalApi";
import { Posts } from "../../../services/postService";

type SavedCandidateItem = {
    favourite: FavouriteCandidate;
    candidateName: string;
    candidateAvatar: string;
    postTitle: string;
};

const toSavedCandidateItem = (favourite: FavouriteCandidate): SavedCandidateItem => {
    const candidate = MOCK_USERS.find((user) => user.id === favourite.candidateId);
    const post = favourite.postId
        ? Posts.find((item) => item.id === favourite.postId)
        : undefined;

    return {
        favourite,
        candidateName: candidate?.fullName ?? `Candidate #${favourite.candidateId}`,
        candidateAvatar: candidate?.avatarUrl ?? "",
        postTitle: post?.title ?? "Unknown post",
    };
};

export default function SaveCandidatePage() {
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<SavedCandidateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadSavedCandidates = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchFavouriteCandidates({
                    employerId: 1,
                    search,
                    pageSize: 50,
                    delayMs: 400,
                });

                if (!response.ok) {
                    throw new Error(response.error.message);
                }

                if (!isMounted) return;

                setItems(response.data.items.map(toSavedCandidateItem));
            } catch (loadError) {
                if (!isMounted) return;
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load saved candidates."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadSavedCandidates();

        return () => {
            isMounted = false;
        };
    }, [search]);

    const handleRemove = async (favouriteId: number) => {
        const response = await deleteFavouriteCandidate(favouriteId);

        if (response.ok) {
            setItems((prev) => prev.filter((item) => item.favourite.id !== favouriteId));
        }
    };

    return (
        <div className="page-container">
            <SearchBox search={search} setSearch={setSearch} />

            {loading && <p className="text-gray-500">Loading saved candidates...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && items.length === 0 && (
                <p className="text-gray-500">No saved candidates yet.</p>
            )}

            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <FavCandidateCard
                        key={item.favourite.id}
                        id={item.favourite.id}
                        name={item.candidateName}
                        image={item.candidateAvatar}
                        postTitle={item.postTitle}
                        isBookmarked
                        onBookmark={() => handleRemove(item.favourite.id)}
                    />
                ))}
            </div>
        </div>
    );
}
