import SearchBar from "../Components/searchBar";
import CardGrid from "../Components/card/CardGrid";
import CardList from "../Components/card/CardList";
import FilterBox from "../Components/FilterBox";
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { opportunityTypeContext } from "../../../contexts/Context";
import { formatApiError } from "../../../services/apiClient";
import {
    fetchPublicPosts,
    toPostListCardItem,
    type PostListCardItem,
} from "../services/postApiService";

type PostListNavigationState = {
    results?: PostListCardItem[];
};

export default function PostList() {
    const [viewType, setViewType] = useState("grid");
    const [searchResults, setSearchResults] = useState<PostListCardItem[]>([]);
    const [defaultPosts, setDefaultPosts] = useState<PostListCardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const opportunityType = useContext(opportunityTypeContext);
    const location = useLocation();
    const navigationState = location.state as PostListNavigationState | null;

    const loadDefaultPosts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const posts = await fetchPublicPosts({ type: opportunityType });
            const cards = posts.map(toPostListCardItem);
            setDefaultPosts(cards);

            if (!navigationState?.results?.length) {
                setSearchResults(cards);
            }
        } catch (loadError) {
            setError(formatApiError(loadError));
            setDefaultPosts([]);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [navigationState?.results, opportunityType]);

    useEffect(() => {
        if (navigationState?.results?.length) {
            setSearchResults(navigationState.results);
        }
    }, [navigationState?.results]);

    useEffect(() => {
        void loadDefaultPosts();
    }, [loadDefaultPosts]);

    const handleResultsChange = (results: PostListCardItem[]) => {
        if (results.length === 0) {
            setSearchResults(defaultPosts);
            return;
        }

        setSearchResults(results);
    };

    return (
        <div>
            <SearchBar onResultsChange={handleResultsChange} />
            <FilterBox viewType={viewType} setViewType={setViewType} />

            <section className="page-container">
                {loading && <p className="text-sm text-gray-500">Loading posts...</p>}
                {!loading && error && <p className="text-sm text-red-600">{error}</p>}
                {!loading && !error && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500">No posts found.</p>
                )}

                {!loading && !error && viewType === "grid" && (
                    <div className="grid grid-cols-2 gap-5 y-5 lg:grid-cols-3">
                        {searchResults.map((item) => (
                            <div key={item.postId}>
                                <CardGrid
                                    id={item.postId}
                                    organizationName={item.organizationName}
                                    title={item.title}
                                    engagementType={item.engagementType}
                                    location={item.location}
                                    salary={item.salary}
                                    remainingDays={item.remainingDays}
                                    image={item.image}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && viewType !== "grid" && (
                    <div className="flex flex-col gap-5">
                        {searchResults.map((item) => (
                            <CardList
                                key={item.postId}
                                id={item.postId}
                                organizationName={item.organizationName}
                                title={item.title}
                                engagementType={item.engagementType}
                                location={item.location}
                                salary={item.salary}
                                remainingDays={item.remainingDays}
                                image={item.image}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
