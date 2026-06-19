import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Plus } from "lucide-react";
import Upload, { type File as ResumeFile } from "../../libs/uploadFile";
import { fetchSeekerProfile } from "../../services/seekerProfileService";
import { uploadFile } from "../../../../services/uploadService";
import { resolveAssetUrl } from "../../../Employer/lib/resolveAssetUrl";
import { formatApiError } from "../../../../services/apiClient";

type CvOption = ResumeFile & {
    path?: string;
};

interface ApplyModalProps {
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (cvResumePath: string) => Promise<void>;
}

function toExistingCvOption(cvPath: string): CvOption {
    return {
        id: "existing-cv",
        name: cvPath.split("/").pop() ?? "Resume",
        size: "Saved on profile",
        path: cvPath,
        url: resolveAssetUrl(cvPath),
    };
}

const ApplyModal: React.FC<ApplyModalProps> = ({
    isSubmitting,
    onClose,
    onSubmit,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [existingCv, setExistingCv] = useState<CvOption | null>(null);
    const [uploadedCv, setUploadedCv] = useState<CvOption | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            setIsLoadingProfile(true);
            setError(null);

            try {
                const response = await fetchSeekerProfile();
                if (!isMounted) {
                    return;
                }

                const cvPath = response.profile.cv_resume;
                if (cvPath) {
                    const option = toExistingCvOption(cvPath);
                    setExistingCv(option);
                    setSelectedId(option.id);
                } else {
                    setExistingCv(null);
                    setSelectedId(null);
                }
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setIsLoadingProfile(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleUpload = (resume: ResumeFile) => {
        const option: CvOption = {
            ...resume,
            id: "uploaded-cv",
        };
        setUploadedCv(option);
        setSelectedId(option.id);
        setError(null);
    };

    const handleSubmit = async () => {
        const selected =
            selectedId === existingCv?.id
                ? existingCv
                : selectedId === uploadedCv?.id
                  ? uploadedCv
                  : null;

        if (!selected) {
            setError("Please select or upload a CV/Resume before applying.");
            return;
        }

        setError(null);

        try {
            let cvResumePath = selected.path ?? null;

            if (selected.raw) {
                const uploadResponse = await uploadFile(selected.raw, "resumes");
                cvResumePath = uploadResponse.path;
            }

            if (!cvResumePath) {
                setError("Please select or upload a CV/Resume before applying.");
                return;
            }

            await onSubmit(cvResumePath);
        } catch (err) {
            setError(formatApiError(err));
        }
    };

    const title = "Apply for Job";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30" onClick={!isSubmitting ? onClose : undefined} />

            <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4">
                    <h2 className="text-big font-bold text-gray-800">{title}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Select a CV/Resume from your profile or upload a new one for this application.
                    </p>
                </div>

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                {isLoadingProfile ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                        <Loader2 size={18} className="animate-spin" />
                        Loading your CV/Resume...
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {existingCv && (
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-medium text-gray-700">Your saved CV/Resume</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(existingCv.id)}
                                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                                        selectedId === existingCv.id
                                            ? "border-primary bg-blue-50"
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <FileText size={20} className="shrink-0 text-primary" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-800">
                                            {existingCv.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{existingCv.size}</p>
                                    </div>
                                    <span
                                        className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                                            selectedId === existingCv.id
                                                ? "border-primary bg-primary"
                                                : "border-gray-300"
                                        }`}
                                    />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-gray-700">
                                {existingCv ? "Or upload a new CV/Resume" : "Upload your CV/Resume"}
                            </span>

                            {uploadedCv ? (
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(uploadedCv.id)}
                                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                                        selectedId === uploadedCv.id
                                            ? "border-primary bg-blue-50"
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <FileText size={20} className="shrink-0 text-primary" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-800">
                                            {uploadedCv.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{uploadedCv.size}</p>
                                    </div>
                                    <span
                                        className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                                            selectedId === uploadedCv.id
                                                ? "border-primary bg-primary"
                                                : "border-gray-300"
                                        }`}
                                    />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <Plus size={16} />
                                        <span className="text-sm font-medium text-gray-700">
                                            Upload CV/Resume
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">Browse file or drop here. PDF only.</p>
                                    <Upload onUpload={handleUpload} inputRef={fileInputRef} />
                                </button>
                            )}

                            {uploadedCv && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUploadedCv(null);
                                        if (selectedId === uploadedCv.id) {
                                            setSelectedId(existingCv?.id ?? null);
                                        }
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    }}
                                    className="self-start text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Choose a different file
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="btn-primary-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoadingProfile || !selectedId}
                        className="btn-primary-blue flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyModal;
