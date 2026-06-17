import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Bookmark,
    Briefcase,
    Cake,
    Download,
    FileText,
    Flag,
    Globe,
    GraduationCap,
    Mail,
    Phone,
} from "lucide-react";
import BackButton from "../../Seeker/Components/BackButton";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import { resolveAssetUrl } from "../lib/resolveAssetUrl";
import {
    fetchFavoriteCandidates,
    removeFavoriteCandidate,
} from "../services/favoriteCandidateService";
import { formatDisplayDate, formatLabel } from "../../Seeker/lib/seekerProfileFormatters";
import { fetchPublicSeekerProfile } from "../../Seeker/services/seekerPublicService";
import ReportModal from "../../Seeker/Components/modal/ReportModal";
import { submitSeekerProfileReport } from "../services/seekerProfileReportService";
import type { FavoriteCandidateApi } from "../types/favoriteCandidate";
import type { SeekerProfileApi } from "../../Seeker/types/seekerProfile";

export default function SaveCandidateDetailPage() {
    const navigate = useNavigate();
    const { favouriteId } = useParams<{ favouriteId: string }>();
    const [favorite, setFavorite] = useState<FavoriteCandidateApi | null>(null);
    const [profile, setProfile] = useState<SeekerProfileApi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isProfilePrivate, setIsProfilePrivate] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const [reportMessage, setReportMessage] = useState<string | null>(null);

    const loadCandidate = useCallback(async () => {
        const parsedFavoriteId = Number(favouriteId);
        if (!favouriteId || Number.isNaN(parsedFavoriteId)) {
            setFavorite(null);
            setProfile(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsProfilePrivate(false);

        try {
            const favorites = await fetchFavoriteCandidates();
            const matchedFavorite = favorites.find(
                (item) => item.favorite_candidate_id === parsedFavoriteId,
            );

            if (!matchedFavorite) {
                setFavorite(null);
                setProfile(null);
                return;
            }

            setFavorite(matchedFavorite);

            const profileResponse = await fetchPublicSeekerProfile(matchedFavorite.seeker_id);
            if (profileResponse?.profile) {
                setProfile(profileResponse.profile);
            } else {
                setProfile(null);
                setIsProfilePrivate(true);
            }
        } catch (loadError) {
            setError(formatApiError(loadError));
            setFavorite(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, [favouriteId]);

    useEffect(() => {
        void loadCandidate();
    }, [loadCandidate]);

    const handleRemoveFavorite = async () => {
        if (!favorite) {
            return;
        }

        setIsRemoving(true);
        setActionError(null);

        try {
            await removeFavoriteCandidate(favorite.favorite_candidate_id);
            navigate(`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.SAVE_CANDIDATE}`);
        } catch (removeError) {
            setActionError(formatApiError(removeError));
        } finally {
            setIsRemoving(false);
        }
    };

    const handleReportSubmit = async (reportReason: string) => {
        if (!favorite?.seeker_id || isSubmittingReport) {
            return;
        }

        setIsSubmittingReport(true);
        setActionError(null);
        setReportMessage(null);

        try {
            await submitSeekerProfileReport(favorite.seeker_id, reportReason);
            setReportMessage("Report submitted successfully.");
            setIsReportOpen(false);
        } catch (reportError) {
            setActionError(formatApiError(reportError));
        } finally {
            setIsSubmittingReport(false);
        }
    };

    if (loading) {
        return (
            <section className="page-container">
                <BackButton />
                <p className="text-gray-500">Loading candidate profile...</p>
            </section>
        );
    }

    if (error || !favorite) {
        return (
            <section className="page-container">
                <BackButton />
                <p className="text-gray-600">
                    {error ?? "Saved candidate not found."}
                </p>
            </section>
        );
    }

    const displayName = profile?.full_name ?? favorite.seeker_name ?? `Candidate #${favorite.seeker_id}`;
    const displayEmail = favorite.seeker_email ?? profile?.email ?? "Not provided";
    const profileImage = profile?.profile_img
        ? resolveAssetUrl(profile.profile_img)
        : favorite.profile_img
            ? resolveAssetUrl(favorite.profile_img)
            : "";
    const cvUrl = resolveAssetUrl(profile?.cv_resume);
    const phoneNumber = profile?.seeker_phone_number
        ?? profile?.contacts?.find((contact) => contact.category === "phone")?.value
        ?? "Not provided";
    const website = profile?.personal_web_url
        ?? profile?.contacts?.find((contact) => contact.category === "web_url")?.value
        ?? null;

    return (
        <section className="page-container">
            <BackButton />

            {actionError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {actionError}
                </div>
            )}

            {isProfilePrivate && (
                <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    This candidate profile is private. Showing limited shortlist details only.
                </div>
            )}

            {reportMessage && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {reportMessage}
                </div>
            )}

            <div className="mb-8 flex flex-col gap-4 border-b border-[#E4E5E8] pb-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={displayName}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-[#767F8C]" />
                    )}
                    <div>
                        <h1 className="text-2xl font-semibold text-[#18191C]">{displayName}</h1>
                        <p className="text-sm text-[#767F8C]">
                            Saved on {formatDisplayDate(favorite.created_at)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        disabled={isSubmittingReport}
                        onClick={() => setIsReportOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#E4E5E8] px-4 py-2.5 text-sm font-medium text-[#5E6670] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                    >
                        <Flag size={18} />
                        Report Profile
                    </button>

                    <button
                        type="button"
                        disabled={isRemoving}
                        onClick={() => void handleRemoveFavorite()}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-[#F8F9FA] px-4 py-2.5 text-sm font-medium text-[#18191C] transition-colors hover:bg-blue-50 disabled:opacity-60"
                    >
                        <Bookmark size={18} className="fill-yellow-400 text-yellow-400" />
                        Remove from shortlist
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold uppercase tracking-wider">Biography</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            {profile?.biography ?? "Biography is not available for this candidate."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider">Work Experience</h2>
                        {profile?.work_experiences && profile.work_experiences.length > 0 ? (
                            <div className="space-y-4">
                                {profile.work_experiences.map((experience) => (
                                    <div
                                        key={experience.experience_id}
                                        className="rounded-lg border border-[#E4E5E8] bg-white p-4"
                                    >
                                        <p className="font-medium text-[#18191C]">{experience.job_title}</p>
                                        <p className="text-sm text-[#5E6670]">{experience.company_name}</p>
                                        <p className="mt-1 text-sm text-[#767F8C]">
                                            {experience.year_of_experience} years · {experience.industry}
                                        </p>
                                        {experience.description && (
                                            <p className="mt-2 text-sm text-gray-600">{experience.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">Work experience is not available.</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider">Education</h2>
                        {profile?.educations && profile.educations.length > 0 ? (
                            <div className="space-y-4">
                                {profile.educations.map((education) => (
                                    <div
                                        key={education.education_id}
                                        className="rounded-lg border border-[#E4E5E8] bg-white p-4"
                                    >
                                        <p className="font-medium text-[#18191C]">{education.degree}</p>
                                        <p className="text-sm text-[#5E6670]">{education.institution_name}</p>
                                        <p className="mt-1 text-sm text-[#767F8C]">
                                            {education.location}, {education.country}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">
                                {[favorite.education, favorite.experience].filter(Boolean).join(" · ")
                                    || "Education details are not available."}
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
                            <div className="text-[#0A65CC]"><Briefcase className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">Experience</p>
                            <p className="text-sm font-medium">{favorite.experience ?? "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[#0A65CC]"><GraduationCap className="h-5 w-5 stroke-[1.8]" /></div>
                            <p className="pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-600">Education</p>
                            <p className="text-sm font-medium">{favorite.education ?? "Not provided"}</p>
                        </div>
                    </div>

                    {profile?.cv_resume && (
                        <div className="space-y-3 rounded-lg border border-[#E8F1FC] bg-white p-6">
                            <h3 className="text-sm font-semibold">Download Resume</h3>
                            <a
                                href={cvUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#0A65CC] hover:underline"
                            >
                                <Download className="h-4 w-4" />
                                Download CV
                            </a>
                        </div>
                    )}

                    <div className="space-y-5 rounded-lg border border-[#E8F1FC] bg-white p-6">
                        <h3 className="text-sm font-semibold">Contact Information</h3>

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
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-600">Email</p>
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
        </section>
    );
}
