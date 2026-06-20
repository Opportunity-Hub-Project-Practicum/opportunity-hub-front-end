import { Search } from "lucide-react";
import SearchBar, { type SearchBarInitialState } from "../Components/searchBar";
import CardGrid from "../Components/card/CardGrid";
import CardList from "../Components/card/CardList";
import FilterBox from "../Components/FilterBox";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import type { PostListCardItem } from "../services/postApiService";
import type { SearchFilters } from "../lib/searchPosts";
import { setOpportunityTypeContext } from "../../../contexts/Context";
import { sortPostListItems, type PostListSortOption } from "../lib/sortPostListItems";

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
    const [sortBy, setSortBy] = useState<PostListSortOption>("latest");
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

    const displayedResults = useMemo(
        () => sortPostListItems(searchResults, sortBy),
        [searchResults, sortBy],
    );

    return (
        <div>
            <SearchBar
                key={location.key}
                initialState={searchBarInitialState}
                onResultsChange={setSearchResults}
            />
            <FilterBox
                viewType={viewType}
                setViewType={setViewType}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            <section className="page-container">
                {displayedResults.length === 0 && (
                    <EmptyState
                        icon={Search}
                        title="No results yet"
                        description="Search for jobs or volunteer opportunities to see results here."
                    />
                )}

                {viewType === "grid" && (
                    <div className="grid grid-cols-2 gap-5 y-5 lg:grid-cols-3">
                        {displayedResults.map((item) => (
                            <div key={item.postId}>
                                <CardGrid
                                    id={item.postId}
                                    employerId={item.employerId}
                                    organizationName={item.organizationName}
                                    title={item.title}
                                    engagementType={item.engagementType}
                                    location={item.location}
                                    salary={item.salary}
                                    remainingDays={item.remainingDays}
                                    image={item.image}
                                    isUrgent={item.isUrgent}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {viewType !== "grid" && (
                    <div className="flex flex-col gap-5">
                        {displayedResults.map((item) => (
                            <CardList
                                key={item.postId}
                                id={item.postId}
                                employerId={item.employerId}
                                organizationName={item.organizationName}
                                title={item.title}
                                engagementType={item.engagementType}
                                location={item.location}
                                salary={item.salary}
                                remainingDays={item.remainingDays}
                                image={item.image}
                                isUrgent={item.isUrgent}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
