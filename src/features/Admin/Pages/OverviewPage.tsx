import {
    AlertTriangle,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Flag,
    ShieldBan,
    UserRound,
    Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import { fetchAdminOverviewData } from "../services/adminOverviewService";
import type { AdminOverviewCounts, AdminOverviewData } from "../types/adminOverview";

const emptyCounts: AdminOverviewCounts = {
    totalSeekers: 0,
    totalEmployers: 0,
    jobPosts: 0,
    volunteerPosts: 0,
    pendingPostReports: 0,
    pendingUserReports: 0,
    bannedSeekers: 0,
    bannedEmployers: 0,
    bannedPosts: 0,
};

const quickActions = [
    {
        label: "Manage Users",
        description: "View, ban, or unban seekers and employers",
        path: `${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.MANAGE_USER}`,
    },
    {
        label: "Review Reports",
        description: "Handle reported posts and user profiles",
        path: `${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.REPORTED}`,
    },
    {
        label: "All Posts",
        description: "Browse and moderate job and volunteer listings",
        path: `${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.ALL_POST}`,
    },
    {
        label: "Manage Values",
        description: "Edit locations and job roles used across the platform",
        path: `${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.MANAGE_VALUES}`,
    },
] as const;

export default function OverviewPage() {
    const { user } = useAuth();
    const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOverview = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchAdminOverviewData();
            setOverviewData(data);
        } catch (loadError) {
            setError(formatApiError(loadError));
            setOverviewData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadOverview();
    }, [loadOverview]);

    const counts = overviewData?.counts ?? emptyCounts;
    const pendingReports = overviewData?.pendingReports ?? [];
    const recentPosts = overviewData?.recentPosts ?? [];
    const userName = user?.full_name?.trim() || "Admin";
    const totalPendingReports = counts.pendingPostReports + counts.pendingUserReports;
    const totalBannedAccounts = counts.bannedSeekers + counts.bannedEmployers;

    const metricCards = useMemo(
        () => [
            { key: "totalSeekers" as const, label: "Total Seekers", icon: Users },
            { key: "totalEmployers" as const, label: "Total Employers", icon: Building2 },
            { key: "jobPosts" as const, label: "Active Job Posts", icon: BriefcaseBusiness },
            { key: "volunteerPosts" as const, label: "Active Volunteer Posts", icon: UserRound },
        ],
        [],
    );

    const attentionCards = useMemo(
        () => [
            {
                key: "pendingReports",
                label: "Pending Reports",
                value: totalPendingReports,
                detail: `${counts.pendingPostReports} posts · ${counts.pendingUserReports} users`,
                icon: Flag,
                accent: totalPendingReports > 0 ? "text-amber-600" : "text-[#28A745]",
            },
            {
                key: "bannedAccounts",
                label: "Banned Accounts",
                value: totalBannedAccounts,
                detail: `${counts.bannedSeekers} seekers · ${counts.bannedEmployers} employers`,
                icon: ShieldBan,
                accent: "text-[#DC3545]",
            },
            {
                key: "bannedPosts",
                label: "Banned Posts",
                value: counts.bannedPosts,
                detail: "Listings removed from public view",
                icon: AlertTriangle,
                accent: "text-[#DC3545]",
            },
        ],
        [counts, totalBannedAccounts, totalPendingReports],
    );

    return (
        <div className="page-container flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-semibold text-[#18191C]">Hello, {userName}</h1>
                <p className="mt-1 text-sm text-[#767F8C]">
                    Platform overview and items that need your attention.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <section className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-[#767F8C]">Platform Activity</h2>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-[#767F8C]">Needs Attention</h2>
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    {attentionCards.map((card) => (
                        <div
                            key={card.key}
                            className="rounded-xl border border-[#E4E5E8] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-[#18191C]">
                                        {loading ? "—" : card.value}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-[#18191C]">
                                        {card.label}
                                    </p>
                                    <p className="mt-1 text-xs text-[#767F8C]">{card.detail}</p>
                                </div>
                                <card.icon className={`h-5 w-5 shrink-0 ${card.accent}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-[#767F8C]">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {quickActions.map((action) => (
                        <Link
                            key={action.path}
                            to={action.path}
                            className="group flex items-center justify-between rounded-xl border border-[#E4E5E8] bg-white p-4 shadow-sm transition-colors hover:border-primary hover:bg-subPrimary/30"
                        >
                            <div>
                                <p className="font-medium text-[#18191C]">{action.label}</p>
                                <p className="mt-1 text-sm text-[#767F8C]">{action.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#767F8C] transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-medium text-[#767F8C]">Pending Reports</h2>
                        <Link
                            to={`${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.REPORTED}`}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E4E5E8] bg-white shadow-sm">
                        {loading && (
                            <p className="px-5 py-8 text-sm text-[#767F8C]">Loading reports...</p>
                        )}

                        {!loading && pendingReports.length === 0 && (
                            <p className="px-5 py-8 text-sm text-[#767F8C]">
                                No pending reports right now.
                            </p>
                        )}

                        {!loading && pendingReports.length > 0 && (
                            <div className="divide-y divide-[#E4E5E8]">
                                {pendingReports.map((report) => {
                                    const detailPath = report.type === "user"
                                        ? ROUTES.ADMIN.REPORTED_USER_DETAIL(report.id, "pending", "user")
                                        : ROUTES.ADMIN.REPORTED_DETAIL(report.id, "pending");

                                    return (
                                        <Link
                                            key={`${report.type}-${report.id}`}
                                            to={detailPath}
                                            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-gray-50/60"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-[#18191C]">
                                                    {report.title}
                                                </p>
                                                <p className="truncate text-sm text-[#767F8C]">
                                                    {report.subtitle}
                                                </p>
                                                <p className="mt-1 text-xs text-[#9199A3]">
                                                    {report.type === "user" ? "User report" : "Post report"}
                                                    {" · "}
                                                    {report.reportCount} report
                                                    {report.reportCount === 1 ? "" : "s"}
                                                    {" · "}
                                                    {report.reportedAt}
                                                </p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 shrink-0 text-[#767F8C]" />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-medium text-[#767F8C]">Recent Posts</h2>
                        <Link
                            to={`${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.ALL_POST}`}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E4E5E8] bg-white shadow-sm">
                        {loading && (
                            <p className="px-5 py-8 text-sm text-[#767F8C]">Loading posts...</p>
                        )}

                        {!loading && recentPosts.length === 0 && (
                            <p className="px-5 py-8 text-sm text-[#767F8C]">No posts found.</p>
                        )}

                        {!loading && recentPosts.length > 0 && (
                            <div className="divide-y divide-[#E4E5E8]">
                                {recentPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        to={ROUTES.HOME.POST_DETAIL(post.id)}
                                        className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-gray-50/60"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-[#18191C]">
                                                {post.title}
                                            </p>
                                            <p className="truncate text-sm text-[#767F8C]">
                                                {post.organizationName}
                                            </p>
                                            <p className="mt-1 text-xs text-[#9199A3]">
                                                {post.type === "job" ? "Job" : "Volunteer"}
                                                {" · "}
                                                {post.status}
                                                {" · "}
                                                {post.applications} application
                                                {post.applications === 1 ? "" : "s"}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-[#767F8C]" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
