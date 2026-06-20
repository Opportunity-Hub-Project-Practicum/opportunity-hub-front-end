import { CheckCircle2, ChevronDown, Flag, MoreVertical, Users, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBox from "../../../GlobalComponents/SearchBox";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { Skeleton } from "../../../GlobalComponents/Skeleton";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import {
    banAdminPost,
    fetchAdminReports,
    groupReportsByPost,
    resolveAdminPostReports,
    unbanAdminPost,
} from "../services/adminReportService";
import {
    fetchAdminSeekerProfileReports,
    groupReportsBySeeker,
    resolveAdminSeekerProfileReports,
} from "../services/adminSeekerProfileReportService";
import { banAdminSeeker, unbanAdminSeeker } from "../services/adminUserService";
import type { GroupedReportedPost, ReportStatus, ResolvePostReportsAction } from "../types/adminReport";
import type { GroupedReportedSeeker, ReportType } from "../types/adminSeekerProfileReport";
import ResolvePostReportModal from "../Components/ResolvePostReportModal";

function parseReportStatus(value: string | null): ReportStatus {
    return value === "resolved" ? "resolved" : "pending";
}

function parseReportType(value: string | null): ReportType {
    return value === "user" ? "user" : "post";
}

export default function ReportedPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const reportStatus = parseReportStatus(searchParams.get("status"));
    const reportType = parseReportType(searchParams.get("type"));
    const [groupedPostReports, setGroupedPostReports] = useState<GroupedReportedPost[]>([]);
    const [groupedUserReports, setGroupedUserReports] = useState<GroupedReportedSeeker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [resolveTarget, setResolveTarget] = useState<GroupedReportedPost | null>(null);

    useEffect(() => {
        const closeMenu = (event: MouseEvent) => {
            if (!(event.target as Element).closest("[data-action-menu]")) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    const updateSearchParams = (status: ReportStatus, type: ReportType) => {
        setSearchParams({ status, type });
    };

    const setReportStatus = (status: ReportStatus) => {
        updateSearchParams(status, reportType);
    };

    const setReportType = (type: ReportType) => {
        updateSearchParams(reportStatus, type);
    };

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (reportType === "user") {
                const reports = await fetchAdminSeekerProfileReports({ status: reportStatus });
                setGroupedUserReports(groupReportsBySeeker(reports));
                setGroupedPostReports([]);
            } else {
                const reports = await fetchAdminReports({ status: reportStatus });
                setGroupedPostReports(groupReportsByPost(reports));
                setGroupedUserReports([]);
            }
        } catch (loadError) {
            setError(formatApiError(loadError));
        } finally {
            setLoading(false);
        }
    }, [reportStatus, reportType]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const filteredPostReports = useMemo(() => {
        if (!search.trim()) {
            return groupedPostReports;
        }

        const query = search.trim().toLowerCase();
        return groupedPostReports.filter((item) => {
            const haystack = [
                item.postTitle,
                item.employerName,
                ...item.reports.map((report) => report.report_reason),
                ...item.reports.map((report) => report.seeker_name ?? ""),
            ].join(" ").toLowerCase();

            return haystack.includes(query);
        });
    }, [groupedPostReports, search]);

    const filteredUserReports = useMemo(() => {
        if (!search.trim()) {
            return groupedUserReports;
        }

        const query = search.trim().toLowerCase();
        return groupedUserReports.filter((item) => {
            const haystack = [
                item.seekerName,
                item.seekerEmail,
                ...item.reports.map((report) => report.report_reason),
                ...item.reports.map((report) => report.employer_name ?? ""),
            ].join(" ").toLowerCase();

            return haystack.includes(query);
        });
    }, [groupedUserReports, search]);

    const handleViewPost = (group: GroupedReportedPost) => {
        navigate(`${ROUTES.ADMIN.REPORTED_DETAIL(group.postId, reportStatus)}&type=post`);
    };

    const handleViewSeeker = (group: GroupedReportedSeeker) => {
        navigate(ROUTES.ADMIN.REPORTED_USER_DETAIL(group.seekerId, reportStatus, "user"));
    };

    const handleResolvePost = async (
        group: GroupedReportedPost,
        action: ResolvePostReportsAction,
    ) => {
        setActionLoading(true);

        try {
            await resolveAdminPostReports(group.postId, action);
            setGroupedPostReports((current) =>
                current.filter((item) => item.postId !== group.postId),
            );
        } catch (resolveError) {
            setError(formatApiError(resolveError));
        } finally {
            setActionLoading(false);
            setResolveTarget(null);
        }
    };

    const handleTogglePostBan = async (group: GroupedReportedPost) => {
        setActionLoading(true);

        try {
            if (group.isBanned) {
                await unbanAdminPost(group.postId);
            } else {
                await banAdminPost(group.postId);
            }

            const nextBanned = !group.isBanned;
            setGroupedPostReports((current) =>
                current.map((item) =>
                    item.postId === group.postId
                        ? {
                            ...item,
                            isBanned: nextBanned,
                            reports: item.reports.map((report) => ({
                                ...report,
                                post_is_ban: nextBanned,
                            })),
                        }
                        : item,
                ),
            );
        } catch (banError) {
            setError(formatApiError(banError));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDismissSeekerReports = async (group: GroupedReportedSeeker) => {
        setActionLoading(true);

        try {
            await resolveAdminSeekerProfileReports(group.seekerId, "dismiss");
            setGroupedUserReports((current) =>
                current.filter((item) => item.seekerId !== group.seekerId),
            );
        } catch (resolveError) {
            setError(formatApiError(resolveError));
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleSeekerBan = async (group: GroupedReportedSeeker) => {
        setActionLoading(true);

        try {
            if (group.isBanned) {
                await unbanAdminSeeker(group.seekerId);
            } else {
                await banAdminSeeker(group.seekerId);
            }

            const nextBanned = !group.isBanned;
            setGroupedUserReports((current) =>
                current.map((item) =>
                    item.seekerId === group.seekerId
                        ? {
                            ...item,
                            isBanned: nextBanned,
                            reports: item.reports.map((report) => ({
                                ...report,
                                seeker_is_ban: nextBanned,
                            })),
                        }
                        : item,
                ),
            );
        } catch (banError) {
            setError(formatApiError(banError));
        } finally {
            setActionLoading(false);
        }
    };

    const isUserView = reportType === "user";
    const filteredReports = isUserView ? filteredUserReports : filteredPostReports;
    const isEmpty = filteredReports.length === 0;

    return (
        <div className="page-container">
            <SearchBox search={search} setSearch={setSearch} />

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm text-[#767F8C]">
                    Review reports submitted by {isUserView ? "employers" : "seekers"}.
                </p>

                <div className="w-full sm:w-auto">

                    <div className="relative w-full sm:min-w-[220px]">
                        <select
                            id="report-type"
                            name="report-type"
                            value={reportType}
                            onChange={(event) => setReportType(event.target.value as ReportType)}
                            className="w-full appearance-none rounded-lg border border-[#E4E5E8] bg-white px-3 py-2.5 pr-10 text-sm font-medium text-[#18191C] outline-none transition-colors focus:border-[#0A65CC] focus:ring-2 focus:ring-[#0A65CC]/15"
                        >
                            <option value="post">Reported Posts</option>
                            <option value="user">Reported Users</option>
                        </select>
                        <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#767F8C]"
                        />
                    </div>
                </div>
            </div>

            <div className="hidden md:grid grid-cols-6 bg-slate-100 px-6 py-3 text-[12px] font-medium uppercase text-gray-600">
                <div className="col-span-3 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => setReportStatus("pending")}
                        className={`pb-1 font-semibold transition-colors ${reportStatus === "pending"
                            ? "border-b-2 border-primary text-primary"
                            : "text-[#767F8C] hover:text-gray-900"
                            }`}
                    >
                        Pending
                    </button>

                    <button
                        type="button"
                        onClick={() => setReportStatus("resolved")}
                        className={`pb-1 font-semibold transition-colors ${reportStatus === "resolved"
                            ? "border-b-2 border-primary text-primary"
                            : "text-[#767F8C] hover:text-gray-900"
                            }`}
                    >
                        Resolved
                    </button>
                </div>

                <div className="pl-2 text-left">Status</div>
                <div className="text-left">Reports</div>
                <div className="pl-4 text-left">Actions</div>
            </div>

            <div className="flex md:hidden items-center gap-6 px-2">
                <button
                    type="button"
                    onClick={() => setReportStatus("pending")}
                    className={`pb-1 font-semibold text-sm transition-colors ${reportStatus === "pending" ? "border-b-2 border-primary text-primary" : "text-[#767F8C]"}`}
                >
                    Pending
                </button>
                <button
                    type="button"
                    onClick={() => setReportStatus("resolved")}
                    className={`pb-1 font-semibold text-sm transition-colors ${reportStatus === "resolved" ? "border-b-2 border-primary text-primary" : "text-[#767F8C]"}`}
                >
                    Resolved
                </button>
            </div>

            {loading && (
                <div className="space-y-3 py-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="my-4 alert-error">{error}</div>
            )}

            {!loading && !error && !isUserView && (
                <div className="w-full divide-y divide-[#E4E5E8]">
                    {filteredPostReports.map((item) => (
                        <div
                            key={item.postId}
                            className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-center px-6 py-5 transition-colors hover:bg-gray-50/40"
                        >
                            <div className="col-span-1 md:col-span-3 space-y-1">
                                <button
                                    type="button"
                                    onClick={() => handleViewPost(item)}
                                    className="text-left"
                                >
                                    <h2 className="text-base font-medium text-[#18191C] transition-colors hover:text-[#0A65CC]">
                                        {item.postTitle}
                                    </h2>
                                </button>

                                <div className="space-y-1 text-sm text-[#767F8C]">
                                    <p>{item.employerName}</p>
                                    <p>Reported: {item.latestReportedAt}</p>
                                </div>
                            </div>

                            <div className="flex items-center md:pl-2">
                                {!item.isBanned ? (
                                    <span className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#28A745]">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Active</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#DC3545]">
                                        <XCircle className="h-4 w-4" />
                                        <span>Ban</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-[#5E6670]">
                                <Users className="h-4 w-4 text-[#9199A3]" />
                                <span>{item.reportCount}</span>
                            </div>

                            <div className="relative md:pl-4" data-action-menu>
                                <button
                                    onClick={() =>
                                        setOpenMenuId((prev) =>
                                            prev === item.postId ? null : item.postId,
                                        )
                                    }
                                    type="button"
                                    aria-label="Open actions menu"
                                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>

                                {openMenuId === item.postId && (
                                    <div className="absolute right-0 top-full z-20 mt-1 min-w-[9rem] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                        <button
                                            onClick={() => {
                                                handleViewPost(item);
                                                setOpenMenuId(null);
                                            }}
                                            type="button"
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            View Post
                                        </button>

                                        {item.status === "pending" && (
                                            <button
                                                onClick={() => {
                                                    setResolveTarget(item);
                                                    setOpenMenuId(null);
                                                }}
                                                type="button"
                                                disabled={actionLoading}
                                                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 disabled:opacity-60"
                                            >
                                                Resolve
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                void handleTogglePostBan(item);
                                                setOpenMenuId(null);
                                            }}
                                            type="button"
                                            disabled={actionLoading}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-60 ${item.isBanned
                                                ? "text-primary"
                                                : "text-red-700"
                                                }`}
                                        >
                                            {item.isBanned ? "Unban" : "Ban"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isEmpty && (
                        <EmptyState icon={Flag} title="No reports found" description="Nothing to review right now." />
                    )}
                </div>
            )}

            {!loading && !error && isUserView && (
                <div className="w-full divide-y divide-[#E4E5E8]">
                    {filteredUserReports.map((item) => (
                        <div
                            key={item.seekerId}
                            className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-center px-6 py-5 transition-colors hover:bg-gray-50/40"
                        >
                            <div className="col-span-1 md:col-span-3 space-y-1">
                                <button
                                    type="button"
                                    onClick={() => handleViewSeeker(item)}
                                    className="text-left"
                                >
                                    <h2 className="text-base font-medium text-[#18191C] transition-colors hover:text-[#0A65CC]">
                                        {item.seekerName}
                                    </h2>
                                </button>

                                <div className="space-y-1 text-sm text-[#767F8C]">
                                    <p>{item.seekerEmail}</p>
                                    <p>Reported: {item.latestReportedAt}</p>
                                </div>
                            </div>

                            <div className="flex items-center md:pl-2">
                                {!item.isBanned ? (
                                    <span className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#28A745]">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Active</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#DC3545]">
                                        <XCircle className="h-4 w-4" />
                                        <span>Ban</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-[#5E6670]">
                                <Users className="h-4 w-4 text-[#9199A3]" />
                                <span>{item.reportCount}</span>
                            </div>

                            <div className="relative md:pl-4" data-action-menu>
                                <button
                                    onClick={() =>
                                        setOpenMenuId((prev) =>
                                            prev === item.seekerId ? null : item.seekerId,
                                        )
                                    }
                                    type="button"
                                    aria-label="Open actions menu"
                                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>

                                {openMenuId === item.seekerId && (
                                    <div className="absolute right-0 top-full z-20 mt-1 min-w-[9rem] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                        <button
                                            onClick={() => {
                                                handleViewSeeker(item);
                                                setOpenMenuId(null);
                                            }}
                                            type="button"
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            View Profile
                                        </button>

                                        {item.status === "pending" && (
                                            <button
                                                onClick={() => {
                                                    void handleDismissSeekerReports(item);
                                                    setOpenMenuId(null);
                                                }}
                                                type="button"
                                                disabled={actionLoading}
                                                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 disabled:opacity-60"
                                            >
                                                Dismiss
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                void handleToggleSeekerBan(item);
                                                setOpenMenuId(null);
                                            }}
                                            type="button"
                                            disabled={actionLoading}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-60 ${item.isBanned
                                                ? "text-primary"
                                                : "text-red-700"
                                                }`}
                                        >
                                            {item.isBanned ? "Unban" : "Ban"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isEmpty && (
                        <EmptyState icon={Flag} title="No reports found" description="Nothing to review right now." />
                    )}
                </div>
            )}
            <ResolvePostReportModal
                isOpen={resolveTarget !== null}
                postTitle={resolveTarget?.postTitle ?? ""}
                loading={actionLoading}
                onClose={() => setResolveTarget(null)}
                onIgnore={() => {
                    if (resolveTarget) {
                        void handleResolvePost(resolveTarget, "ignore");
                    }
                }}
                onBan={() => {
                    if (resolveTarget) {
                        void handleResolvePost(resolveTarget, "ban");
                    }
                }}
            />
        </div>
    );
}
