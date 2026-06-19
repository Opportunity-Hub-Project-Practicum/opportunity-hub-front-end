import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    FileText,
    Flag,
    Star,
    UserPlus,
} from "lucide-react";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import { resolveAssetUrl } from "../lib/resolveAssetUrl";
import {
    addFavoriteCandidate,
    fetchFavoriteCandidates,
    removeFavoriteCandidate,
} from "../services/favoriteCandidateService";
import { updateEmployerApplicationStatus } from "../services/employerApplicationService";
import { submitSeekerProfileReport } from "../services/seekerProfileReportService";
import ReportModal from "../../Seeker/Components/modal/ReportModal";
import type { KanbanApplication } from "../types/employerApplication";

interface ApplicationFormProps {
    isOpen: boolean;
    application: KanbanApplication | null;
    postId: string | number;
    onClose: () => void;
    onStatusUpdated: () => Promise<void> | void;
}

function getCvFileName(path: string): string {
    return path.split("/").pop() ?? "Resume";
}

function isPdfPath(path: string): boolean {
    return /\.pdf$/i.test(path);
}

export default function ApplicationForm({
    isOpen,
    application,
    postId,
    onClose,
    onStatusUpdated,
}: ApplicationFormProps) {
    const navigate = useNavigate();
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [favoriteCandidateId, setFavoriteCandidateId] = useState<number | null>(null);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const [reportMessage, setReportMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !application) {
            setFavoriteCandidateId(null);
            setFavoriteMessage(null);
            setReportMessage(null);
            return;
        }

        let isMounted = true;

        const loadFavoriteState = async () => {
            setError(null);
            setFavoriteMessage(null);

            try {
                const favorites = await fetchFavoriteCandidates();

                if (!isMounted) {
                    return;
                }

                const matchedFavorite = favorites.find(
                    (favorite) => favorite.seeker_id === application.seekerId,
                );
                setFavoriteCandidateId(matchedFavorite?.favorite_candidate_id ?? null);
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(loadError));
            }
        };

        void loadFavoriteState();

        return () => {
            isMounted = false;
        };
    }, [application?.seekerId, isOpen]);

    if (!isOpen || !application) {
        return null;
    }

    const cvPath = application.raw.cv_resume_file;
    const cvUrl = cvPath ? resolveAssetUrl(cvPath) : null;
    const cvFileName = cvPath ? getCvFileName(cvPath) : null;

    const handleViewSeekerProfile = () => {
        onClose();
        navigate(`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.SEEKER_PROFILE(application.seekerId)}`);
    };

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
        <div className="w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-8">
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

            <div className="mb-6 flex w-full flex-col items-start justify-between gap-6 border-b border-[#E4E5E8] pb-6 md:flex-row md:items-center">
                <div>
                    <button
                        type="button"
                        onClick={handleViewSeekerProfile}
                        className="text-left text-xl font-semibold text-[#0A65CC] hover:underline"
                    >
                        {application.userName}
                    </button>
                    <p className="mt-1 text-xs text-[#767F8C]">
                        Applied: {application.appliedDate || "Not provided"}
                    </p>
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

            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">Submitted CV / Resume</h3>

                {!cvPath || !cvUrl ? (
                    <p className="text-sm text-gray-600">
                        No CV/Resume was submitted with this application.
                    </p>
                ) : (
                    <>
                        <div className="flex items-center justify-between rounded-lg border border-[#E4E5E8] bg-[#FCFDFE] p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="rounded bg-red-50 p-2 text-red-500">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[#474C54]">
                                        {cvFileName}
                                    </p>
                                    <p className="text-[11px] font-bold uppercase text-gray-600">
                                        Application CV
                                    </p>
                                </div>
                            </div>
                            <a
                                href={cvUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="rounded bg-[#E8F1FC] p-2.5 text-[#0A65CC] transition-colors hover:bg-[#D4E6FC]"
                            >
                                <Download className="h-4 w-4 stroke-[2.5]" />
                            </a>
                        </div>

                        {isPdfPath(cvPath) && (
                            <iframe
                                src={cvUrl}
                                title={`${application.userName} CV`}
                                className="h-[70vh] w-full rounded-lg border border-[#E4E5E8] bg-gray-50"
                            />
                        )}
                    </>
                )}
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
