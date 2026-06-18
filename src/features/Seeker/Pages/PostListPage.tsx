import SearchBar, { type SearchBarInitialState } from "../Components/searchBar";
import CardGrid from "../Components/card/CardGrid";
import CardList from "../Components/card/CardList";
import FilterBox from "../Components/FilterBox";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import type { PostListCardItem } from "../services/postApiService";
import type { SearchFilters } from "../lib/searchPosts";
import { setOpportunityTypeContext } from "../../../contexts/Context";

type PostListNavigationState = {
    results?: PostListCardItem[];
    filters?: SearchFilters;
    searchTerm?: string;
    location?: string;
    category?: string;
    opportunityType?: "job" | "volunteer";
};

export default function PostList() {
    const [viewType, setViewType] = useState("grid");
    const [searchResults, setSearchResults] = useState<PostListCardItem[]>([]);
    const location = useLocation();
    const setOpportunityType = useContext(setOpportunityTypeContext);
    const navigationState = location.state as PostListNavigationState | null;
    const searchBarInitialState = useMemo<SearchBarInitialState>(
        () => ({
            searchTerm: navigationState?.searchTerm ?? "",
            location: navigationState?.location ?? "",
            category: navigationState?.category ?? "",
            filters: navigationState?.filters ?? {},
        }),
        [location.key],
    );

    useEffect(() => {
        if (navigationState?.opportunityType) {
            setOpportunityType(navigationState.opportunityType);
        }
    }, [location.key, navigationState?.opportunityType, setOpportunityType]);

    useEffect(() => {
        if (navigationState?.results) {
            setSearchResults(navigationState.results);
        }
    }, [location.key, navigationState?.results]);

    return (
        <div>
            <SearchBar
                key={location.key}
                initialState={searchBarInitialState}
                onResultsChange={setSearchResults}
            />
            <FilterBox viewType={viewType} setViewType={setViewType} />

            <section className="page-container">
                {searchResults.length === 0 && (
                    <p className="text-sm text-gray-500">Search for jobs or volunteers to see results.</p>
                )}

                {viewType === "grid" && (
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

                {viewType !== "grid" && (
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
