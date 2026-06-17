import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Briefcase,
    Cake,
    Download,
    FileText,
    Flag,
    Globe,
    GraduationCap,
    Mail,
    Phone,
    Star,
    UserPlus,
} from "lucide-react";
import { formatApiError } from "../../../services/apiClient";
import { resolveAssetUrl } from "../lib/resolveAssetUrl";
import {
    addFavoriteCandidate,
    fetchFavoriteCandidates,
    removeFavoriteCandidate,
} from "../services/favoriteCandidateService";
import { updateEmployerApplicationStatus } from "../services/employerApplicationService";
import { submitSeekerProfileReport } from "../services/seekerProfileReportService";
import { formatDisplayDate, formatLabel } from "../../Seeker/lib/seekerProfileFormatters";
import { fetchPublicSeekerProfile } from "../../Seeker/services/seekerPublicService";
import ReportModal from "../../Seeker/Components/modal/ReportModal";
import type { KanbanApplication } from "../types/employerApplication";
import type { SeekerProfileApi } from "../../Seeker/types/seekerProfile";

interface ApplicationFormProps {
    isOpen: boolean;
    application: KanbanApplication | null;
    postId: string | number;
    onClose: () => void;
    onStatusUpdated: () => Promise<void> | void;
}

export default function ApplicationForm({
    isOpen,
    application,
    postId,
    onClose,
    onStatusUpdated,
}: ApplicationFormProps) {
    const [profile, setProfile] = useState<SeekerProfileApi | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [favoriteCandidateId, setFavoriteCandidateId] = useState<number | null>(null);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const [reportMessage, setReportMessage] = useState<string | null>(null);

    useEffect(() => {
        const seekerRef = application?.seekerUuid ?? application?.seekerId;
        if (!isOpen || seekerRef == null) {
            setProfile(null);
            setFavoriteCandidateId(null);
            setFavoriteMessage(null);
            setReportMessage(null);
            return;
        }

        let isMounted = true;

        const loadApplicationDetails = async () => {
            setIsLoadingProfile(true);
            setError(null);
            setFavoriteMessage(null);

            try {
                const [profileResponse, favorites] = await Promise.all([
                    fetchPublicSeekerProfile(seekerRef),
                    fetchFavoriteCandidates(),
                ]);

                if (!isMounted) {
                    return;
                }

                setProfile(profileResponse?.profile ?? null);

                const matchedFavorite = favorites.find(
                    (favorite) => favorite.seeker_id === application.seekerId,
                );
                setFavoriteCandidateId(matchedFavorite?.favorite_candidate_id ?? null);
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(loadError));
            } finally {
                if (isMounted) {
                    setIsLoadingProfile(false);
                }
            }
        };

        void loadApplicationDetails();

        return () => {
            isMounted = false;
        };
    }, [application?.seekerId, application?.seekerUuid, isOpen]);

    if (!isOpen || !application) {
        return null;
    }

    const displayName = profile?.full_name ?? application.userName;
    const displayEmail = application.seekerEmail ?? profile?.email ?? "Not provided";
    const cvUrl = resolveAssetUrl(application.raw.cv_resume_file ?? profile?.cv_resume);
    const phoneNumber = profile?.seeker_phone_number
        ?? profile?.contacts?.find((contact) => contact.category === "phone")?.value
        ?? "Not provided";
    const website = profile?.personal_web_url
        ?? profile?.contacts?.find((contact) => contact.category === "web_url")?.value
        ?? null;
    const latestEducation = profile?.educations?.[0];
    const latestExperience = profile?.work_experiences?.[0];

    const handleToggleFavorite = async () => {
        setIsFavoriteLoading(true);
        setError(null);
        setFavoriteMessage(null);

        try {
            if (favoriteCandidateId) {
                await removeFavoriteCandidate(favoriteCandidateId);
                setFavoriteCandidateId(null);
                setFavoriteMessage("Candidate removed from shortlist.");
                return;
            }

            const favorite = await addFavoriteCandidate(application.seekerId);
            setFavoriteCandidateId(favorite.favorite_candidate_id);
            setFavoriteMessage("Candidate saved to shortlist.");
        } catch (toggleError) {
            setError(formatApiError(toggleError));
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleStatusUpdate = async (status: "rejected" | "hired" | "pending") => {
        setIsUpdatingStatus(true);
        setError(null);

        try {
            await updateEmployerApplicationStatus(postId, application.applicationId, {
                status,
                current_column_id: null,
            });
            await onStatusUpdated();
            onClose();
        } catch (updateError) {
            setError(formatApiError(updateError));
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleReportSubmit = async (reportReason: string) => {
        if (!application?.seekerId || isSubmittingReport) {
            return;
        }

        setIsSubmittingReport(true);
        setError(null);
        setReportMessage(null);

        try {
            await submitSeekerProfileReport(application.seekerId, reportReason);
            setReportMessage("Report submitted successfully.");
            setIsReportOpen(false);
        } catch (reportError) {
            setError(formatApiError(reportError));
        } finally {
            setIsSubmittingReport(false);
        }
    };

    return (
        <div className="w-full overflow-y-auto rounded-lg border border-slate-200 bg-slate-200 p-8">
            <button className="mb-5" onClick={onClose} type="button">
                <ArrowLeft />
            </button>

            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {favoriteMessage && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {favoriteMessage}
                </div>
            )}

            {reportMessage && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {reportMessage}
                </div>
            )}

            <div className="mb-8 flex w-full flex-col items-start justify-between gap-6 border-b border-[#E4E5E8] pb-6 md:flex-row md:items-center">
                <div className="flex items-center space-x-4">
                    {profile?.profile_img ? (
                        <img
                            src={resolveAssetUrl(profile.profile_img)}
                            alt={displayName}
                            className="h-16 w-16 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-16 w-16 shrink-0 rounded-full bg-[#767F8C]" />
                    )}
                    <div>
                        <h1 className="text-xl font-semibold">{displayName}</h1>
                        <p className="text-sm text-[#5E6670]">
                            {latestExperience?.job_title ?? application.role}
                        </p>
                        <p className="text-xs text-[#767F8C]">
                            Applied: {application.appliedDate || "Not provided"}
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                    <button
                        type="button"
                        disabled={isSubmittingReport}
                        onClick={() => setIsReportOpen(true)}
                        title="Report profile"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#E4E5E8] px-5 py-3 text-sm font-semibold text-[#5E6670] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60 md:flex-none"
                    >
                        <Flag className="h-4 w-4" />
                        <span>Report</span>
                    </button>

                    <button
                        type="button"
                        disabled={isFavoriteLoading || isUpdatingStatus}
                        onClick={() => void handleToggleFavorite()}
                        title={favoriteCandidateId ? "Remove from shortlist" : "Save to shortlist"}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60 md:flex-none ${
                            favoriteCandidateId
                                ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                : "border-primary text-primary hover:bg-blue-50"
                        }`}
                    >
                        <Star
                            className={`h-4 w-4 ${favoriteCandidateId ? "fill-yellow-400 text-yellow-400" : ""}`}
                        />
                        <span>{favoriteCandidateId ? "Saved" : "Save Candidate"}</span>
                    </button>

                    {application.status !== "pending" && (
                        <button
                            type="button"
                            disabled={isUpdatingStatus}
                            onClick={() => void handleStatusUpdate("pending")}
                            className="inline-flex flex-1 items-center justify-center rounded-md border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-blue-50 disabled:opacity-60 md:flex-none"
                        >
                            Move to Pending
                        </button>
                    )}

                    {application.status !== "rejected" && (
                        <button
                            type="button"
                            disabled={isUpdatingStatus}
                            onClick={() => void handleStatusUpdate("rejected")}
                            className="inline-flex flex-1 items-center justify-center rounded-md bg-[#E02424] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 md:flex-none"
                        >
                            Reject
                        </button>
                    )}

                    {application.status !== "hired" && (
                        <button
                            type="button"
                            disabled={isUpdatingStatus}
                            onClick={() => void handleStatusUpdate("hired")}
                            className="inline-flex flex-1 items-center justify-center space-x-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 md:flex-none"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Hire Candidate</span>
                        </button>
                    )}
                </div>
            </div>

            {isLoadingProfile && (
                <p className="mb-6 text-sm text-[#767F8C]">Loading candidate profile...</p>
            )}

            <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider">Biography</h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                            {profile?.biography ?? "Biography is not available for this candidate."}
                        </p>
                    </div>

                    <hr className="border-[#E4E5E8]" />

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider">Experience</h3>
                        {latestExperience ? (
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="font-medium text-[#18191C]">{latestExperience.job_title}</p>
                                <p>{latestExperience.company_name}</p>
                                <p>{latestExperience.year_of_experience} years experience</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">
                                Experience details are not available.
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-lg border border-[#E8F1FC] bg-white p-6">
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><Cake className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">Date of Birth</p>
                            <p className="text-sm font-medium">{formatDisplayDate(profile?.birth_date)}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><FileText className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">Marital Status</p>
                            <p className="text-sm font-medium">{formatLabel(profile?.marital_status)}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><UserPlus className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">Gender</p>
                            <p className="text-sm font-medium">{formatLabel(profile?.gender)}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><Briefcase className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">Experience</p>
                            <p className="text-sm font-medium">
                                {latestExperience
                                    ? `${latestExperience.year_of_experience} Years`
                                    : "Not provided"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><GraduationCap className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">Education</p>
                            <p className="text-sm font-medium">
                                {latestEducation?.degree ?? "Not provided"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-lg border border-[#E8F1FC] bg-white p-6">
                        <h4 className="text-sm font-semibold">Download Resume</h4>
                        <div className="flex items-center justify-between rounded-md border border-[#E4E5E8] bg-[#FCFDFE] p-3.5">
                            <div className="flex items-center space-x-3">
                                <div className="rounded bg-red-50 p-2 text-red-500"><FileText className="h-6 w-6" /></div>
                                <div>
                                    <p className="max-w-35 truncate text-xs font-medium text-[#474C54]">{displayName}</p>
                                    <p className="text-[11px] font-bold uppercase text-gray-600">CV</p>
                                </div>
                            </div>
                            <a
                                href={cvUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded bg-[#E8F1FC] p-2.5 text-[#0A65CC] transition-colors hover:bg-[#D4E6FC]"
                            >
                                <Download className="h-4 w-4 stroke-[2.5]" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-5 rounded-lg border border-[#E8F1FC] bg-white p-6">
                        <h4 className="text-sm font-semibold">Contact Information</h4>

                        {website && (
                            <div className="flex items-start space-x-3">
                                <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[#0A65CC]" />
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-600">Website</p>
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="break-all text-sm font-medium hover:text-[#0A65CC]"
                                    >
                                        {website}
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start space-x-3">
                            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#0A65CC]" />
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-600">Phone</p>
                                <p className="text-sm font-medium">{phoneNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#0A65CC]" />
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-600">Email Address</p>
                                <a href={`mailto:${displayEmail}`} className="break-all text-sm font-medium hover:text-[#0A65CC]">
                                    {displayEmail}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isReportOpen && (
                <ReportModal
                    variant="profile"
                    onClose={() => setIsReportOpen(false)}
                    onSubmit={(reportReason) => void handleReportSubmit(reportReason)}
                />
            )}
        </div>
    );
}
