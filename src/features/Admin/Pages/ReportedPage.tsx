import { CheckCircle2, MoreVertical, Users, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBox from "../../../GlobalComponents/SearchBox";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import {
    banAdminPost,
    fetchAdminReports,
    groupReportsByPost,
    resolveAdminReport,
    unbanAdminPost,
} from "../services/adminReportService";
import type { GroupedReportedPost, ReportStatus } from "../types/adminReport";

function parseReportStatus(value: string | null): ReportStatus {
    return value === "resolved" ? "resolved" : "pending";
}

export default function ReportedPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const reportStatus = parseReportStatus(searchParams.get("status"));
    const [groupedReports, setGroupedReports] = useState<GroupedReportedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const closeMenu = (event: MouseEvent) => {
            if (!(event.target as Element).closest("[data-action-menu]")) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    const setReportStatus = (status: ReportStatus) => {
        setSearchParams({ status });
    };

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const reports = await fetchAdminReports({ status: reportStatus });
            setGroupedReports(groupReportsByPost(reports));
        } catch (loadError) {
            setError(formatApiError(loadError));
        } finally {
            setLoading(false);
        }
    }, [reportStatus]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const filteredReports = useMemo(() => {
        if (!search.trim()) {
            return groupedReports;
        }

        const query = search.trim().toLowerCase();
        return groupedReports.filter((item) => {
            const haystack = [
                item.postTitle,
                item.employerName,
                ...item.reports.map((report) => report.report_reason),
                ...item.reports.map((report) => report.seeker_name ?? ""),
            ].join(" ").toLowerCase();

            return haystack.includes(query);
        });
    }, [groupedReports, search]);

    const handleView = (group: GroupedReportedPost) => {
        navigate(ROUTES.ADMIN.REPORTED_DETAIL(group.postId, reportStatus));
    };

    const handleResolve = async (group: GroupedReportedPost) => {
        setActionLoading(true);

        try {
            await Promise.all(
                group.reports.map((report) => resolveAdminReport(report.report_id)),
            );
            setGroupedReports((current) =>
                current.filter((item) => item.postId !== group.postId),
            );
        } catch (resolveError) {
            setError(formatApiError(resolveError));
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleBan = async (group: GroupedReportedPost) => {
        setActionLoading(true);

        try {
            if (group.isBanned) {
                await unbanAdminPost(group.postId);
            } else {
                await banAdminPost(group.postId);
            }

            const nextBanned = !group.isBanned;
            setGroupedReports((current) =>
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

    return (
        <div className="page-container">
            <SearchBox search={search} setSearch={setSearch} />

            <div className="grid grid-cols-6 bg-slate-100 px-6 py-3 text-[12px] font-medium uppercase text-gray-600">
                <div className="col-span-3 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => setReportStatus("pending")}
                        className={`pb-1 font-semibold transition-colors ${reportStatus === "pending"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-[#767F8C] hover:text-gray-900"
                            }`}
                    >
                        Pending
                    </button>

                    <button
                        type="button"
                        onClick={() => setReportStatus("resolved")}
                        className={`pb-1 font-semibold transition-colors ${reportStatus === "resolved"
                            ? "border-b-2 border-blue-600 text-blue-600"
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

            {loading && (
                <div className="py-10 text-center text-gray-500">Loading reports...</div>
            )}

            {error && (
                <div className="py-10 text-center text-red-600">{error}</div>
            )}

            {!loading && !error && (
                <div className="w-full divide-y divide-[#E4E5E8]">
                    {filteredReports.map((item) => (
                        <div
                            key={item.postId}
                            className="grid grid-cols-6 items-center px-6 py-5 transition-colors hover:bg-gray-50/40"
                        >
                            <div className="col-span-3 space-y-1">
                                <button
                                    type="button"
                                    onClick={() => handleView(item)}
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

                            <div className="flex items-center pl-2">
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

                            <div className="relative pl-4" data-action-menu>
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
                                                handleView(item);
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
                                                    void handleResolve(item);
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
                                                void handleToggleBan(item);
                                                setOpenMenuId(null);
                                            }}
                                            type="button"
                                            disabled={actionLoading}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-60 ${item.isBanned
                                                ? "text-blue-700"
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

                    {filteredReports.length === 0 && (
                        <div className="py-10 text-center text-gray-500">
                            No reports found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
