import { Briefcase, CheckCircle2, DollarSign, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/path";
import SearchBox from "../../../GlobalComponents/SearchBox";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { Skeleton } from "../../../GlobalComponents/Skeleton";
import { formatApiError } from "../../../services/apiClient";
import {
    fetchAdminPosts,
    mapAdminPostToListItem,
} from "../services/adminPostService";
import type { AdminPostListItem } from "../types/adminPost";

export default function AllPostPage() {
    const [activeTab, setActiveTab] = useState<"job" | "volunteer">("job");
    const [search, setSearch] = useState("");
    const [posts, setPosts] = useState<AdminPostListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPosts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchAdminPosts({ type: activeTab });
            setPosts(data.map(mapAdminPostToListItem));
        } catch (loadError) {
            setError(formatApiError(loadError));
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const currentItems = useMemo(() => {
        const tabPosts = posts.filter((post) => post.type === activeTab);

        if (!search.trim()) {
            return tabPosts;
        }

        const query = search.trim().toLowerCase();
        return tabPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(query)
                || post.organizationName.toLowerCase().includes(query),
        );
    }, [activeTab, posts, search]);

    return (
        <div className="space-y-4">
            <SearchBox search={search} setSearch={setSearch} />
            <div className="hidden md:grid grid-cols-6 bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium tracking-wider text-[#474C54] uppercase items-center">
                <div className="col-span-3 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab("job")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "job" ? "text-primary border-b-2 border-primary" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        JOBS
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("volunteer")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "volunteer" ? "text-primary border-b-2 border-primary" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        Volunteer
                    </button>
                </div>
                <div className=" text-left pl-2">Status</div>
                <div className=" text-left">Applications</div>
                <div className=" text-left pl-4">Actions</div>
            </div>

            <div className="flex md:hidden items-center gap-6 px-2">
                <button
                    type="button"
                    onClick={() => setActiveTab("job")}
                    className={`pb-1 font-semibold text-sm transition-colors ${activeTab === "job" ? "text-primary border-b-2 border-primary" : "text-[#767F8C]"}`}
                >
                    JOBS
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("volunteer")}
                    className={`pb-1 font-semibold text-sm transition-colors ${activeTab === "volunteer" ? "text-primary border-b-2 border-primary" : "text-[#767F8C]"}`}
                >
                    Volunteer
                </button>
            </div>

            {loading && (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4 flex gap-4">
                            <Skeleton className="h-15 w-15 shrink-0 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="alert-error">{error}</div>
            )}

            {!loading && !error && currentItems.length === 0 && (
                <EmptyState
                    icon={Briefcase}
                    title="No posts found"
                    description="Try a different search term or switch tabs to see job and volunteer listings."
                />
            )}

            {!loading && !error && currentItems.map((item) => (
                <div
                    key={item.id}
                    className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-center rounded-lg border p-4 transition-all duration-300 md:hover:scale-[1.01] hover:border-primary hover:shadow-lg"
                >
                    <div className="col-span-1 md:col-span-3">
                        <div className="flex gap-4">
                            <img
                                src={item.image}
                                alt={item.organizationName}
                                className="h-15 w-15 rounded-lg border bg-white object-cover"
                            />

                            <div className="flex flex-col justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold">
                                        {item.title}
                                    </p>

                                    <span className="h-fit w-fit rounded-2xl bg-subPrimary px-2 py-1 text-sm text-primaryDark">
                                        {item.workPlaceType}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {item.salary && (
                                        <span className="flex items-center text-sm text-gray-500">
                                            <DollarSign
                                                size={15}
                                                className="text-primary"
                                            />
                                            {item.salary}
                                        </span>
                                    )}

                                    <span className="text-sm text-gray-500">
                                        <span className="mr-1 text-red-700">
                                            Close on
                                        </span>
                                        {item.closeDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-start md:pl-2">
                        <span className="text-xs font-medium uppercase text-gray-400 md:hidden">Status</span>
                        {item.status === "Active" ? (
                            <span className="inline-flex items-center space-x-1.5 text-sm text-[#28A745] font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Active</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center space-x-1.5 text-sm text-[#DC3545] font-medium">
                                <XCircle className="h-4 w-4" />
                                <span>Ban</span>
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between md:justify-start text-gray-600">
                        <span className="text-xs font-medium uppercase text-gray-400 md:hidden">Applications</span>
                        {item.applications}
                    </div>

                    <Link
                        to={ROUTES.HOME.POST_DETAIL(item.id)}
                        className="flex items-center justify-between md:pl-4"
                    >
                        <span className="text-xs font-medium uppercase text-gray-400 md:hidden">Actions</span>
                        <span className="bg-subPrimary text-primary text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-subPrimary/70 transition-colors">
                            View Post
                        </span>
                    </Link>
                </div>
            ))}
        </div>
    );
}
