import SearchBar from "../Components/searchBar";
import CardGrid from "../Components/card/CardGrid";
import CardList from "../Components/card/CardList";
import FilterBox from "../Components/FilterBox";
import { useContext, useEffect, useState } from "react";
import { Posts, getOrganizationById, formatSalary } from "../../../services/postService";
import { opportunityTypeContext } from "../../../contexts/Context";


export default function PostList() {
    const [viewType, setViewType] = useState('grid');
    const [searchResults, setSearchResults] = useState<any[]>(Posts);
    const [filteredInitialPosts, setFilteredInitialPosts] = useState<any[]>(Posts);
    const opportunityType = useContext(opportunityTypeContext);

    useEffect(() => {
        const filteredPosts = Posts.filter(post => post.type === opportunityType);
        setFilteredInitialPosts(filteredPosts);
        setSearchResults(filteredPosts);
    }, [opportunityType]);

    const handleResultsChange = (results: any[]) => {
        if (results.length === 0) {
            setSearchResults(filteredInitialPosts);
        } else {
            setSearchResults(results);
        }
    };

    return (
        <div>
            <SearchBar onResultsChange={handleResultsChange} />
            <FilterBox viewType={viewType} setViewType={setViewType} />

            <section className="page-container">
                {viewType === 'grid' ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 y-5 ">
                        {searchResults.map(item => {
                            const organization = getOrganizationById(item.employer_id);
                            return (
                                <div key={item.id} >
                                    <CardGrid
                                        id={item.id}
                                        organizationName={organization?.name || 'Unknown'}
                                        title={item.title}
                                        engagementType={item.work_place_type}
                                        location={item.location}
                                        salary={formatSalary(item)}
                                        remainingDays={item.closed_date}
                                        image={organization?.image}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {searchResults.map(item => {
                            const organization = getOrganizationById(item.employer_id);
                            return (

                                <CardList
                                    id={item.id}
                                    organizationName={organization?.name || 'Unknown'}
                                    title={item.title}
                                    engagementType={item.work_place_type}
                                    location={item.location}
                                    salary={formatSalary(item)}
                                    remainingDays={item.closed_date}
                                    image={organization?.image}
                                />

                            );
                        })}
                    </div>
                )}
            </section>

        </div>
    );
}