import { CheckCircle2, DollarSign, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/path";
import SearchBox from "../../../GlobalComponents/SearchBox";
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
            <div className="grid grid-cols-6 bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium tracking-wider text-[#474C54] uppercase items-center">
                <div className="col-span-3 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab("job")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "job" ? "text-blue-600 border-b-2 border-blue-600" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        JOBS
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("volunteer")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "volunteer" ? "text-blue-600 border-b-2 border-blue-600" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        Volunteer
                    </button>
                </div>
                <div className=" text-left pl-2">Status</div>
                <div className=" text-left">Applications</div>
                <div className=" text-left pl-4">Actions</div>
            </div>

            {loading && (
                <div className="px-6 py-8 text-sm text-[#767F8C]">Loading posts...</div>
            )}

            {!loading && error && (
                <div className="px-6 py-8 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && currentItems.length === 0 && (
                <div className="px-6 py-8 text-sm text-[#767F8C]">No posts found.</div>
            )}

            {!loading && !error && currentItems.map((item) => (
                <div
                    key={item.id}
                    className="grid grid-cols-6 items-center rounded-lg border p-4 transition-all duration-300 hover:scale-[1.01] hover:border-primary hover:shadow-lg"
                >
                    <div className="col-span-3">
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

                    <div className="flex items-center pl-2">
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

                    <div className="flex justify-start  text-gray-600">
                        {item.applications}
                    </div>

                    <Link
                        to={ROUTES.HOME.POST_DETAIL(item.id)}
                        className="flex items-center justify-between pl-4"
                    >
                        <span
                            className="bg-slate-200 text-blue-600 text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-slate-200 transition-colors"
                        >
                            View Post
                        </span>
                    </Link>
                </div>
            ))}
        </div>
    );
}
