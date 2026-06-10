import { BellRing, BriefcaseBusiness, UserRoundCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import EmployerPostListTable, { type EmployerPostTab } from "../Components/EmployerPostListTable";
import { mapEmployerPostToListingItem, type ListingItem } from "../lib/myJobMappers";
import { fetchFavoriteCandidates } from "../services/favoriteCandidateService";
import { fetchEmployerPosts } from "../services/employerPostService";

const RECENT_POST_LIMIT = 5;

type OverviewCounts = {
    saveCandidate: number;
    jobPosts: number;
    volunteerPosts: number;
};

const emptyCounts: OverviewCounts = {
    saveCandidate: 0,
    jobPosts: 0,
    volunteerPosts: 0,
};

export default function OverviewPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<EmployerPostTab>("JOBS");
    const [listings, setListings] = useState<ListingItem[]>([]);
    const [counts, setCounts] = useState<OverviewCounts>(emptyCounts);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOverview = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [posts, favorites] = await Promise.all([
                fetchEmployerPosts(),
                fetchFavoriteCandidates(),
            ]);

            const mappedListings = posts.map(mapEmployerPostToListingItem);

            setListings(mappedListings);
            setCounts({
                saveCandidate: favorites.length,
                jobPosts: mappedListings.filter((post) => post.postType === "job").length,
                volunteerPosts: mappedListings.filter((post) => post.postType === "volunteer").length,
            });
        } catch (loadError) {
            setError(formatApiError(loadError));
            setListings([]);
            setCounts(emptyCounts);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadOverview();
    }, [loadOverview]);

    const metricCards = useMemo(
        () => [
            { key: "saveCandidate" as const, label: "Save Candidate", icon: UserRoundCheck },
            { key: "jobPosts" as const, label: "Job Posts", icon: BriefcaseBusiness },
            { key: "volunteerPosts" as const, label: "Volunteer Posts", icon: BellRing },
        ],
        [],
    );

    const userName = user?.full_name?.trim() || "User";
    const recentEmptyMessage = `No recent ${activeTab === "JOBS" ? "job" : "volunteer"} posts found.`;

    return (
        <div className="page-container flex flex-col gap-4">
            <span>Hello, {userName}</span>
            <small className="text-gray-600">Here is your Daily Activity</small>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                {metricCards.map((metric) => (
                    <div
                        key={metric.key}
                        className="rounded-xl border border-[#E4E5E8] bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col justify-center">
                                <span className="text-2xl font-bold text-[#18191C]">
                                    {loading ? "—" : counts[metric.key]}
                                </span>
                                <span className="whitespace-nowrap text-sm text-[#767F8C]">
                                    {metric.label}
                                </span>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-subPrimary">
                                <metric.icon className="text-primary" size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className="flex flex-col gap-3">
                <span className="text-sm text-[#767F8C]">Here is your Recent Posts</span>
                <EmployerPostListTable
                    listings={listings}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onViewApplications={(postId) => {
                        navigate(`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.MY_JOB_VIEW_APPLICATION(postId)}`);
                    }}
                    loading={loading}
                    error={error}
                    limit={RECENT_POST_LIMIT}
                    loadingMessage="Loading recent posts..."
                    emptyMessage={recentEmptyMessage}
                />
            </section>
        </div>
    );
}
