import { useCallback, useEffect, useState } from "react";
import {
    Calendar,
    Briefcase,
    CheckCircle2,
    Clock,
    DollarSign,
    GraduationCap,
    MapPin,
    Star,
    Users,
    XCircle,
    MoreVertical,
} from "lucide-react";
import SearchBox from "../../../GlobalComponents/SearchBox";
import PostDetailCard from "../../../GlobalComponents/PostDetailCard";
import SeekerProfileSection from "../../../GlobalComponents/SeekerProfileSection";
import type { SeekerFormData } from "../../../GlobalComponents/SeekerProfileSection";
import {
    fetchReports,
    MOCK_USERS,
    updateReport,
    type ReportRecord,
    type ReportStatus,
    type ReportTargetType,
    type User,
} from "../../../services/mockJobPortalApi";
import { Posts, formatSalary, getOrganizationById } from "../../../services/postService";

const toSeekerFormData = (user: User): SeekerFormData => {
    const [firstName, ...rest] = user.fullName.split(" ");

    return {
        firstName: firstName ?? user.fullName,
        lastName: rest.join(" "),
        email: user.email,
        dob: "",
        website: user.seekerProfile?.portfolioUrl ?? "",
        gender: "",
        martialStatus: "",
        Phone: user.phone ?? "",
        bio: user.bio,
        profileImage: user.avatarUrl,
        socialLinks: [],
        resume: user.seekerProfile?.resumeUrl
            ? [{ id: "resume-1", name: "resume.pdf", size: "—" }]
            : [],
        education: [],
        experience: user.seekerProfile
            ? [
                  {
                      jobTitle: user.seekerProfile.currentTitle,
                      company: "",
                      jobRole: user.seekerProfile.experienceLevel,
                      from: "",
                      to: "",
                      jobDescription: user.skills.join(", "),
                  },
              ]
            : [],
    };
};

const getDisplayName = (report: ReportRecord) => {
    if (report.targetType === "post" && report.postId) {
        return Posts.find((post) => post.id === report.postId)?.title ?? `Post #${report.postId}`;
    }

    if (report.targetType === "user" && report.userId) {
        return MOCK_USERS.find((user) => user.id === report.userId)?.fullName ?? `User #${report.userId}`;
    }

    return "Unknown";
};

const getOverviewItems = (post: (typeof Posts)[number]) => {
    const isVolunteer = post.type === "volunteer";

    return [
        {
            label: "Posted",
            value: new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            icon: Calendar,
            show: !!post.created_at,
        },
        {
            label: "Expire In",
            value: new Date(post.closed_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            icon: Clock,
            show: !!post.closed_date,
        },
        {
            label: isVolunteer ? "Benefit" : "Salary",
            value: formatSalary(post),
            icon: DollarSign,
            show: true,
        },
        {
            label: "Education",
            value: post.job_education,
            icon: GraduationCap,
            show: !isVolunteer && !!post.job_education,
        },
        {
            label: "Location",
            value: post.location,
            icon: MapPin,
            show: !!post.location,
        },
        {
            label: "Job Role",
            value: post.job_role,
            icon: Briefcase,
            show: !isVolunteer && !!post.job_role,
        },
        {
            label: "Experience",
            value: post.job_experience,
            icon: Star,
            show: !isVolunteer && !!post.job_experience,
        },
    ].filter((item) => item.show);
};

export default function ReportedPage() {
    const [search, setSearch] = useState("");
    const [targetType, setTargetType] = useState<ReportTargetType>("post");
    const [reportStatus, setReportStatus] = useState<ReportStatus>("pending");
    const [reports, setReports] = useState<ReportRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        const closeMenu = (event: MouseEvent) => {
            if (!(event.target as Element).closest("[data-action-menu]")) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchReports({
                targetType,
                status: reportStatus,
                search,
                pageSize: 50,
                delayMs: 350,
            });

            if (!response.ok) {
                throw new Error(response.error.message);
            }

            setReports(response.data.items);
        } catch (loadError) {
            setError(
                loadError instanceof Error ? loadError.message : "Failed to load reports."
            );
        } finally {
            setLoading(false);
        }
    }, [targetType, reportStatus, search]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const handleView = (report: ReportRecord) => {
        setSelectedReport(report);

        if (report.targetType === "post") {
            setShowPostModal(true);
        } else {
            setShowUserModal(true);
        }
    };

    const handleResolve = async (report: ReportRecord) => {
        const response = await updateReport(report.id, { status: "resolved" });

        if (response.ok) {
            setReports((prev) => prev.filter((item) => item.id !== report.id));
        }
    };

    const handleToggleBan = async (report: ReportRecord) => {
        const response = await updateReport(report.id, { isBanned: !report.isBanned });

        if (response.ok) {
            setReports((prev) =>
                prev.map((item) => (item.id === report.id ? response.data : item))
            );
        }
    };

    const selectedPost =
        selectedReport?.postId != null
            ? Posts.find((post) => post.id === selectedReport.postId)
            : undefined;
    const selectedOrganization = selectedPost
        ? getOrganizationById(selectedPost.employer_id)
        : undefined;
    const selectedUser =
        selectedReport?.userId != null
            ? MOCK_USERS.find((user) => user.id === selectedReport.userId)
            : undefined;

    return (
        <div className="page-container">
            <SearchBox search={search} setSearch={setSearch} />

            <div className="flex w-full justify-end">
                <div className="mb-5 rounded-lg border border-blue-200 p-3">
                    <select
                        className="outline-none"
                        value={targetType}
                        onChange={(e) => setTargetType(e.target.value as ReportTargetType)}
                    >
                        <option value="post">Reported Posts</option>
                        <option value="user">Reported Users</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-6 bg-slate-100 px-6 py-3 text-[12px] font-medium uppercase text-gray-600">
                <div className="col-span-3 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => setReportStatus("pending")}
                        className={`pb-1 font-semibold transition-colors ${
                            reportStatus === "pending"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-[#767F8C] hover:text-gray-900"
                        }`}
                    >
                        Pending
                    </button>

                    <button
                        type="button"
                        onClick={() => setReportStatus("resolved")}
                        className={`pb-1 font-semibold transition-colors ${
                            reportStatus === "resolved"
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
                    {reports.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-6 items-center px-6 py-5 transition-colors hover:bg-gray-50/40"
                        >
                            <div className="col-span-3 space-y-1">
                                <h2 className="cursor-pointer text-base font-medium text-[#18191C] transition-colors hover:text-[#0A65CC]">
                                    {getDisplayName(item)}
                                </h2>

                                <div className="space-y-1 text-sm text-[#767F8C]">
                                    <p>Reported: {item.latestReportedAt}</p>
                                    <p className="text-gray-500">{item.summary}</p>
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
                                            prev === item.id ? null : item.id
                                        )
                                    }
                                    type="button"
                                    aria-label="Open actions menu"
                                    className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>

                                {openMenuId === item.id && (
                                    <div className="absolute right-0 top-full z-20 mt-1 min-w-[9rem] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                        <button
                                            onClick={() => {
                                                handleView(item);
                                                setOpenMenuId(null);
                                            }}
                                            type="button"
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            {item.targetType === "post"
                                                ? "View Post"
                                                : "View User"}
                                        </button>

                                        {item.status === "pending" && (
                                            <button
                                                onClick={() => {
                                                    handleResolve(item);
                                                    setOpenMenuId(null);
                                                }}
                                                type="button"
                                                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50"
                                            >
                                                Resolve
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                handleToggleBan(item);
                                                setOpenMenuId(null);
                                            }}
                                            type="button"
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                                item.isBanned
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

                    {reports.length === 0 && (
                        <div className="py-10 text-center text-gray-500">
                            No reports found.
                        </div>
                    )}
                </div>
            )}

            {showPostModal && selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
                        <button
                            onClick={() => setShowPostModal(false)}
                            type="button"
                            className="absolute right-4 top-4 z-10 rounded-full bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        >
                            ✕
                        </button>

                        {selectedReport && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
                                <p className="font-semibold text-red-800">
                                    {selectedReport.reportCount} report
                                    {selectedReport.reportCount === 1 ? "" : "s"} —{" "}
                                    {selectedReport.summary}
                                </p>
                            </div>
                        )}

                        <PostDetailCard
                            post={{
                                title: selectedPost.title,
                                employment_type: selectedPost.employment_type,
                                post_description: selectedPost.post_description,
                                responsibility: selectedPost.responsibility,
                            }}
                            organization={
                                selectedOrganization ?? {
                                    name: "Unknown",
                                    image: "",
                                    industry_type: "",
                                }
                            }
                            overviewItems={getOverviewItems(selectedPost)}
                            isVolunteer={selectedPost.type === "volunteer"}
                            isBookmarked={false}
                            onBookmark={() => undefined}
                            onReport={() => undefined}
                        />
                    </div>
                </div>
            )}

            {showUserModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
                        <button
                            onClick={() => setShowUserModal(false)}
                            type="button"
                            className="absolute right-4 top-4 z-10 rounded-full bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        >
                            ✕
                        </button>

                        {selectedReport && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
                                <p className="font-semibold text-red-800">
                                    {selectedReport.reportCount} report
                                    {selectedReport.reportCount === 1 ? "" : "s"} —{" "}
                                    {selectedReport.summary}
                                </p>
                            </div>
                        )}

                        <SeekerProfileSection
                            seekerData={toSeekerFormData(selectedUser)}
                            viewOnly
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
