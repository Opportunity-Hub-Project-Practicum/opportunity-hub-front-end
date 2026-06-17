import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import BackButton from "../../Seeker/Components/BackButton";
import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import { formatDisplayDate, formatLabel } from "../../Seeker/lib/seekerProfileFormatters";
import SeekerProfileReportDetailsPanel from "../Components/SeekerProfileReportDetailsPanel";
import { banAdminSeeker, fetchAdminSeeker, unbanAdminSeeker } from "../services/adminUserService";
import {
    fetchAdminSeekerProfileReports,
    groupReportsBySeeker,
    resolveAdminSeekerProfileReports,
} from "../services/adminSeekerProfileReportService";
import type { AdminSeekerApi } from "../types/adminUser";
import type { GroupedReportedSeeker, ReportStatus } from "../types/adminSeekerProfileReport";

function parseReportStatus(value: string | null): ReportStatus {
    return value === "resolved" ? "resolved" : "pending";
}

export default function ReportedSeekerDetailPage() {
    const navigate = useNavigate();
    const { seekerId: seekerIdParam } = useParams<{ seekerId: string }>();
    const [searchParams] = useSearchParams();
    const seekerId = Number(seekerIdParam);
    const reportStatus = parseReportStatus(searchParams.get("status"));

    const [seekerProfile, setSeekerProfile] = useState<AdminSeekerApi | null>(null);
    const [reportGroup, setReportGroup] = useState<GroupedReportedSeeker | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!seekerId || Number.isNaN(seekerId)) {
            setLoading(false);
            setError("Invalid seeker id.");
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [seeker, reports] = await Promise.all([
                    fetchAdminSeeker(seekerId),
                    fetchAdminSeekerProfileReports({ status: reportStatus }),
                ]);

                if (!isMounted) {
                    return;
                }

                const grouped = groupReportsBySeeker(reports).find(
                    (item) => item.seekerId === seekerId,
                );

                if (!grouped) {
                    setError("No reports found for this seeker.");
                    return;
                }

                setSeekerProfile(seeker);
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
    }, [seekerId, reportStatus]);

    const backPath = useMemo(
        () => `${ROUTES.ADMIN.ROOT}/${ROUTES.ADMIN.REPORTED}?status=${reportStatus}&type=user`,
        [reportStatus],
    );

    const handleResolve = async (action: "dismiss" | "ban") => {
        if (!reportGroup) {
            return;
        }

        setActionLoading(true);
        setActionError(null);

        try {
            const response = await resolveAdminSeekerProfileReports(reportGroup.seekerId, action);
            setReportGroup((current) =>
                current
                    ? {
                        ...current,
                        status: "resolved",
                        isBanned: response.seeker_is_ban,
                        reports: response.reports.filter(
                            (report) => report.reported_seeker_id === current.seekerId,
                        ),
                    }
                    : current,
            );
            setSeekerProfile((current) =>
                current ? { ...current, is_ban: response.seeker_is_ban } : current,
            );

            if (reportStatus === "pending") {
                navigate(backPath, { replace: true });
            }
        } catch (resolveError) {
            setActionError(formatApiError(resolveError));
        } finally {
            setActionLoading(false);
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
                await unbanAdminSeeker(reportGroup.seekerId);
            } else {
                await banAdminSeeker(reportGroup.seekerId);
            }

            const nextBanned = !reportGroup.isBanned;
            setReportGroup((current) =>
                current
                    ? {
                        ...current,
                        isBanned: nextBanned,
                        reports: current.reports.map((report) => ({
                            ...report,
                            seeker_is_ban: nextBanned,
                        })),
                    }
                    : current,
            );
            setSeekerProfile((current) =>
                current ? { ...current, is_ban: nextBanned } : current,
            );
        } catch (banError) {
            setActionError(formatApiError(banError));
        } finally {
            setActionLoading(false);
        }
    };

    const latestExperience = seekerProfile?.work_experiences?.[0];
    const profileImage = seekerProfile?.profile_img
        ? resolveAssetUrl(seekerProfile.profile_img)
        : "";

    return (
        <div className="space-y-6">
            <BackButton />

            {loading && (
                <div className="py-16 text-center text-sm text-[#767F8C]">
                    Loading reported seeker...
                </div>
            )}

            {!loading && error && (
                <div className="py-16 text-center text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && seekerProfile && reportGroup && (
                <>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#18191C]">
                                {reportGroup.seekerName}
                            </h1>
                            <p className="mt-1 text-sm text-[#767F8C]">
                                {reportGroup.seekerEmail} · {reportGroup.reportCount} report
                                {reportGroup.reportCount === 1 ? "" : "s"}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {reportGroup.status === "pending" && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => void handleResolve("dismiss")}
                                        disabled={actionLoading}
                                        className="rounded-sm bg-[#28A745] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#218838] disabled:opacity-60"
                                    >
                                        Dismiss Report
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleResolve("ban")}
                                        disabled={actionLoading}
                                        className="rounded-sm bg-[#DC3545] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c82333] disabled:opacity-60"
                                    >
                                        Resolve & Ban
                                    </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => void handleToggleBan()}
                                disabled={actionLoading}
                                className={`rounded-sm px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${reportGroup.isBanned
                                    ? "bg-[#0A65CC] hover:bg-[#0851a3]"
                                    : "bg-[#DC3545] hover:bg-[#c82333]"
                                    }`}
                            >
                                {reportGroup.isBanned ? "Unban Seeker" : "Ban Seeker"}
                            </button>
                        </div>
                    </div>

                    {actionError && (
                        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {actionError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
                        <div className="rounded-xl border border-[#E4E5E8] bg-white p-6">
                            <div className="mb-6 flex items-center gap-4 border-b border-[#E4E5E8] pb-6">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={reportGroup.seekerName}
                                        className="h-20 w-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-full bg-[#767F8C]" />
                                )}
                                <div>
                                    <p className="text-lg font-semibold text-[#18191C]">
                                        {reportGroup.seekerName}
                                    </p>
                                    <p className="text-sm text-[#767F8C]">
                                        {reportGroup.isBanned ? "Banned" : "Active"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wider">
                                        Biography
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-600">
                                        {seekerProfile.biography ?? "No biography provided."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs font-medium uppercase text-gray-500">
                                            Date of Birth
                                        </p>
                                        <p>{formatDisplayDate(seekerProfile.birth_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-gray-500">
                                            Gender
                                        </p>
                                        <p>{formatLabel(seekerProfile.gender)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-gray-500">
                                            Education
                                        </p>
                                        <p>{seekerProfile.educations?.[0]?.degree ?? "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-gray-500">
                                            Experience
                                        </p>
                                        <p>
                                            {latestExperience
                                                ? `${latestExperience.job_title} at ${latestExperience.company_name}`
                                                : "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SeekerProfileReportDetailsPanel reports={reportGroup.reports} />
                    </div>
                </>
            )}
        </div>
    );
}
