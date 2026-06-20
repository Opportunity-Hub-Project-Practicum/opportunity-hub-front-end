import { useState } from "react";
import { Briefcase, CheckCircle2, ShieldAlert, Users, XCircle } from "lucide-react";
import type { ListingItem } from "../lib/myJobMappers";
import PostBanReasonModal from "./PostBanReasonModal";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { Skeleton } from "../../../GlobalComponents/Skeleton";

export type EmployerPostTab = "JOBS" | "Volunteer";

type EmployerPostListTableProps = {
    listings: ListingItem[];
    activeTab: EmployerPostTab;
    onTabChange: (tab: EmployerPostTab) => void;
    onViewApplications: (postId: number) => void;
    onTogglePostStatus?: (item: ListingItem) => void;
    onClosePost?: (item: ListingItem) => void;
    updatingPostId?: number | null;
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
    onTogglePostStatus,
    onClosePost,
    updatingPostId = null,
    loading = false,
    error = null,
    limit,
    loadingMessage = "Loading your posts...",
    emptyMessage = "No posts found.",
}: EmployerPostListTableProps) {
    const [banReasonListing, setBanReasonListing] = useState<ListingItem | null>(null);
    const expectedPostType = activeTab === "JOBS" ? "job" : "volunteer";
    const filteredListings = listings
        .filter((item) => item.postType === expectedPostType)
        .slice(0, limit);

    return (
        <>
        <div className="w-full overflow-hidden rounded-md border border-[#E4E5E8] bg-white">
            <div className="hidden md:grid grid-cols-12 items-center bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium uppercase tracking-wider text-[#474C54]">
                <div className="col-span-5 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => onTabChange("JOBS")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "JOBS" ? "border-b-2 border-primary text-primary" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        JOBS
                    </button>
                    <button
                        type="button"
                        onClick={() => onTabChange("Volunteer")}
                        className={`pb-1 font-semibold transition-colors ${activeTab === "Volunteer" ? "border-b-2 border-primary text-primary" : "text-[#767F8C] hover:text-gray-900"}`}
                    >
                        Volunteer
                    </button>
                </div>
                <div className="col-span-2 pl-2 text-left">Status</div>
                <div className="col-span-2 text-left">Applications</div>
                <div className="col-span-3 pl-4 text-left">Actions</div>
            </div>

            <div className="flex md:hidden items-center gap-6 px-4 pt-4">
                <button
                    type="button"
                    onClick={() => onTabChange("JOBS")}
                    className={`pb-1 font-semibold text-sm transition-colors ${activeTab === "JOBS" ? "border-b-2 border-primary text-primary" : "text-[#767F8C]"}`}
                >
                    JOBS
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange("Volunteer")}
                    className={`pb-1 font-semibold text-sm transition-colors ${activeTab === "Volunteer" ? "border-b-2 border-primary text-primary" : "text-[#767F8C]"}`}
                >
                    Volunteer
                </button>
            </div>

            {loading && (
                <div className="space-y-3 p-6">
                    <span className="sr-only">{loadingMessage}</span>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="m-6 alert-error">{error}</div>
            )}

            {!loading && !error && (
                <div className="w-full divide-y divide-[#E4E5E8]">
                    {filteredListings.length === 0 ? (
                        <EmptyState icon={Briefcase} title={emptyMessage} />
                    ) : (
                        filteredListings.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center px-6 py-5 transition-colors hover:bg-gray-50/40"
                            >
                                <div className="col-span-1 md:col-span-5 space-y-1">
                                    <h2 className="cursor-pointer text-base font-medium text-[#18191C] transition-colors hover:text-primary">
                                        {item.title}
                                    </h2>
                                    <div className="flex items-center space-x-1.5 text-sm text-[#767F8C]">
                                        <span>{item.type}</span>
                                        <span>•</span>
                                        <span>{item.timeRemaining}</span>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 flex items-center md:pl-2">
                                    {item.status === "Banned" ? (
                                        <button
                                            type="button"
                                            onClick={() => setBanReasonListing(item)}
                                            className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#DC3545] underline-offset-2 transition-colors hover:underline"
                                        >
                                            <ShieldAlert className="h-4 w-4" />
                                            <span>Banned</span>
                                        </button>
                                    ) : item.status === "Active" ? (
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

                                <div className="col-span-1 md:col-span-2 flex items-center space-x-2 text-sm text-[#5E6670]">
                                    <Users className="h-4 w-4 text-[#9199A3]" />
                                    <span>{item.applicationsCount} Applications</span>
                                </div>

                                <div className="col-span-1 md:col-span-3 flex flex-wrap items-center md:justify-end gap-2 md:pl-4">
                                    <button
                                        onClick={() => onViewApplications(item.postId)}
                                        type="button"
                                        disabled={item.status === "Banned"}
                                        className="rounded-sm bg-subPrimary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-subPrimary/70 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        View Applications
                                    </button>

                                    {item.status === "Active" && onClosePost && (
                                        <button
                                            type="button"
                                            title="Close listing"
                                            disabled={updatingPostId === item.postId}
                                            onClick={() => onClosePost(item)}
                                            className="rounded-sm border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Close
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        title={item.status === "Expire" ? "Reopen listing" : "Extend listing duration"}
                                        disabled={
                                            item.status === "Banned"
                                            || !onTogglePostStatus
                                            || updatingPostId === item.postId
                                        }
                                        onClick={() => onTogglePostStatus?.(item)}
                                        className={`rounded-sm border px-3 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                            item.status === "Active"
                                                ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                                                : "border-green-200 text-green-700 hover:bg-green-50"
                                        }`}
                                    >
                                        {item.status === "Expire" ? "Reopen" : "Extend"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>

        <PostBanReasonModal
            isOpen={banReasonListing != null}
            postTitle={banReasonListing?.title ?? ""}
            reports={banReasonListing?.banReports ?? []}
            onClose={() => setBanReasonListing(null)}
        />
        </>
    );
}
