import { CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import type { ListingItem } from "../lib/myJobMappers";

export type EmployerPostTab = "JOBS" | "Volunteer";

type EmployerPostListTableProps = {
    listings: ListingItem[];
    activeTab: EmployerPostTab;
    onTabChange: (tab: EmployerPostTab) => void;
    onViewApplications: (postId: number) => void;
    loading?: boolean;
    error?: string | null;
    limit?: number;
    loadingMessage?: string;
    emptyMessage?: string;
};

export default function EmployerPostListTable({
    listings,
    activeTab,
    onTabChange,
    onViewApplications,
    loading = false,
    error = null,
    limit,
    loadingMessage = "Loading your posts...",
    emptyMessage = "No posts found.",
}: EmployerPostListTableProps) {
    const expectedPostType = activeTab === "JOBS" ? "job" : "volunteer";
    const filteredListings = listings
        .filter((item) => item.postType === expectedPostType)
        .slice(0, limit);

    return (
        <div className="w-full overflow-hidden rounded-md border border-[#E4E5E8] bg-white">
            <div className="grid grid-cols-12 items-center bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#474C54]">
                <div className="col-span-5 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => onTabChange("JOBS")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "JOBS" ? "border-b-2 border-[#0A65CC] text-[#0A65CC]" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        JOBS
                    </button>
                    <button
                        type="button"
                        onClick={() => onTabChange("Volunteer")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "Volunteer" ? "border-b-2 border-[#0A65CC] text-[#0A65CC]" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        Volunteer
                    </button>
                </div>
                <div className="col-span-2 pl-2 text-left">Status</div>
                <div className="col-span-2 text-left">Applications</div>
                <div className="col-span-3 pl-4 text-left">Actions</div>
            </div>

            {loading && (
                <div className="px-6 py-10 text-sm text-[#767F8C]">{loadingMessage}</div>
            )}

            {!loading && error && (
                <div className="px-6 py-10 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && (
                <div className="w-full divide-y divide-[#E4E5E8]">
                    {filteredListings.length === 0 ? (
                        <div className="px-6 py-10 text-sm text-[#767F8C]">{emptyMessage}</div>
                    ) : (
                        filteredListings.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 items-center px-6 py-5 transition-colors hover:bg-gray-50/40"
                            >
                                <div className="col-span-5 space-y-1">
                                    <h2 className="cursor-pointer text-base font-medium text-[#18191C] transition-colors hover:text-[#0A65CC]">
                                        {item.title}
                                    </h2>
                                    <div className="flex items-center space-x-1.5 text-sm text-[#767F8C]">
                                        <span>{item.type}</span>
                                        <span>•</span>
                                        <span>{item.timeRemaining}</span>
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center pl-2">
                                    {item.status === "Active" ? (
                                        <span className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#28A745]">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span>Active</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#DC3545]">
                                            <XCircle className="h-4 w-4" />
                                            <span>Expire</span>
                                        </span>
                                    )}
                                </div>

                                <div className="col-span-2 flex items-center space-x-2 text-sm text-[#5E6670]">
                                    <Users className="h-4 w-4 text-[#9199A3]" />
                                    <span>{item.applicationsCount} Applications</span>
                                </div>

                                <div className="col-span-3 flex items-center justify-between pl-4">
                                    <button
                                        onClick={() => onViewApplications(item.postId)}
                                        type="button"
                                        className="rounded-sm bg-[#F1F2F4] px-5 py-2.5 text-sm font-semibold text-[#0A65CC] transition-colors hover:bg-[#E4E5E8]"
                                    >
                                        View Applications
                                    </button>

                                    {item.status === "Active" ? (
                                        <button type="button" title="Ending Soon" className="p-1 text-[#E0513E] hover:opacity-80">
                                            <Clock className="h-5 w-5 transform stroke-2" />
                                        </button>
                                    ) : (
                                        <button type="button" title="Renew Listing" className="p-1 text-[#7ED321] hover:opacity-80">
                                            <Clock className="h-5 w-5 transform stroke-2" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
