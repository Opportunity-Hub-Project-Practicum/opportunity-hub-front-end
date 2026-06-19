import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PostDetailCard from "../../../GlobalComponents/PostDetailCard";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import BackButton from "../../Seeker/Components/BackButton";
import {
    formatWorkPlaceType,
} from "../../Seeker/services/postApiService";
import { fetchAdminPost } from "../services/adminPostService";
import type { PostDetailApi } from "../../Seeker/types/post";
import ReportDetailsPanel from "../Components/ReportDetailsPanel";
import ResolvePostReportModal from "../Components/ResolvePostReportModal";
import {
    buildPostOrganization,
    buildPostOverviewItems,
} from "../lib/adminReportMappers";
import {
    banAdminPost,
    fetchAdminReports,
    groupReportsByPost,
    resolveAdminPostReports,
    unbanAdminPost,
} from "../services/adminReportService";
import type { GroupedReportedPost, ReportStatus, ResolvePostReportsAction } from "../types/adminReport";

function parseReportStatus(value: string | null): ReportStatus {
    return value === "resolved" ? "resolved" : "pending";
}

export default function ReportedPostDetailPage() {
    const navigate = useNavigate();
    const { postId: postIdParam } = useParams<{ postId: string }>();
    const [searchParams] = useSearchParams();
    const postId = Number(postIdParam);
    const reportStatus = parseReportStatus(searchParams.get("status"));

    const [postDetail, setPostDetail] = useState<PostDetailApi | null>(null);
    const [reportGroup, setReportGroup] = useState<GroupedReportedPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

    useEffect(() => {
        if (!postId || Number.isNaN(postId)) {
            setLoading(false);
            setError("Invalid post id.");
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [post, reports] = await Promise.all([
                    fetchAdminPost(postId),
                    fetchAdminReports({ status: reportStatus }),
                ]);

                if (!isMounted) {
                    return;
                }

                if (!post) {
                    setError("Post not found.");
                    return;
                }

                const grouped = groupReportsByPost(reports).find(
                    (item) => item.postId === postId,
                );

                if (!grouped) {
                    setError("No reports found for this post.");
                    return;
                }

                setPostDetail(post);
                setReportGroup(grouped);
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(loadError));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadData();

        return () => {
            isMounted = false;
        };
    }, [postId, reportStatus]);

    const backPath = useMemo(
        () => `${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.REPORTED}?status=${reportStatus}&type=post`,
        [reportStatus],
    );

    const handleResolve = async (action: ResolvePostReportsAction) => {
        if (!reportGroup) {
            return;
        }

        setActionLoading(true);
        setActionError(null);

        try {
            const response = await resolveAdminPostReports(reportGroup.postId, action);
            setReportGroup((current) =>
                current
                    ? {
                        ...current,
                        status: "resolved",
                        isBanned: response.post_is_ban,
                        reports: response.reports.filter(
                            (report) => report.post_id === current.postId,
                        ),
                    }
                    : current,
            );

            if (reportStatus === "pending") {
                navigate(backPath, { replace: true });
            }
        } catch (resolveError) {
            setActionError(formatApiError(resolveError));
        } finally {
            setActionLoading(false);
            setIsResolveModalOpen(false);
        }
    };

    const handleToggleBan = async () => {
        if (!reportGroup) {
            return;
        }

        setActionLoading(true);
        setActionError(null);

        try {
            if (reportGroup.isBanned) {
                await unbanAdminPost(reportGroup.postId);
            } else {
                await banAdminPost(reportGroup.postId);
            }

            const nextBanned = !reportGroup.isBanned;
            setReportGroup((current) =>
                current
                    ? {
                        ...current,
                        isBanned: nextBanned,
                        reports: current.reports.map((report) => ({
                            ...report,
                            post_is_ban: nextBanned,
                        })),
                    }
                    : current,
            );
        } catch (banError) {
            setActionError(formatApiError(banError));
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <BackButton />

            {loading && (
                <div className="py-16 text-center text-sm text-[#767F8C]">
                    Loading reported post...
                </div>
            )}

            {!loading && error && (
                <div className="py-16 text-center text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && postDetail && reportGroup && (
                <>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#18191C]">
                                {reportGroup.postTitle}
                            </h1>
                            <p className="mt-1 text-sm text-[#767F8C]">
                                {reportGroup.employerName} · {reportGroup.reportCount} report
                                {reportGroup.reportCount === 1 ? "" : "s"}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {reportGroup.status === "pending" && (
                                <button
                                    type="button"
                                    onClick={() => setIsResolveModalOpen(true)}
                                    disabled={actionLoading}
                                    className="rounded-sm bg-[#28A745] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#218838] disabled:opacity-60"
                                >
                                    Resolve
                                </button>
                            )}
                            {reportGroup.status !== "pending" && (
                                <button
                                    type="button"
                                    onClick={() => void handleToggleBan()}
                                    disabled={actionLoading}
                                    className={`rounded-sm px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${reportGroup.isBanned
                                        ? "bg-[#0A65CC] hover:bg-[#0851a3]"
                                        : "bg-[#DC3545] hover:bg-[#c82333]"
                                        }`}
                                >
                                    {reportGroup.isBanned ? "Unban Post" : "Ban Post"}
                                </button>
                            )}
                        </div>
                    </div>

                    {actionError && (
                        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {actionError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
                        <div className="rounded-xl border border-[#E4E5E8] bg-white p-6">
                            <PostDetailCard
                                post={{
                                    title: postDetail.post_title,
                                    employment_type: formatWorkPlaceType(postDetail.work_place_type),
                                    post_description: postDetail.post_description ?? "",
                                    responsibility: postDetail.responsibility ?? "",
                                    job_requirement: postDetail.job_requirement ?? "",
                                }}
                                organization={buildPostOrganization(postDetail)}
                                overviewItems={buildPostOverviewItems(postDetail)}
                                isVolunteer={postDetail.type === "volunteer"}
                                showActions={false}
                            />
                        </div>

                        <ReportDetailsPanel reports={reportGroup.reports} />
                    </div>
                    <ResolvePostReportModal
                        isOpen={isResolveModalOpen}
                        postTitle={reportGroup.postTitle}
                        loading={actionLoading}
                        onClose={() => setIsResolveModalOpen(false)}
                        onIgnore={() => void handleResolve("ignore")}
                        onBan={() => void handleResolve("ban")}
                    />
                </>
            )}
        </div>
    );
}
