import { useState } from "react";
import PostJobForm from "../Components/PostJobForm";
import PostVolunteerForm from "../Components/PostVolunteerForm";
import { formatApiError } from "../../../services/apiClient";
import {
    submitJobPost,
    submitVolunteerPost,
    type JobPostSubmitPayload,
    type VolunteerPostSubmitPayload,
} from "../services/postApplicationService";

export default function PostApplicationPage() {
    const [isPostJob, setIsPostJob] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleJobSubmit = async (payload: JobPostSubmitPayload) => {
        setIsSubmitting(true);
        setStatusMessage(null);
        setErrorMessage(null);

        try {
            const response = await submitJobPost(payload);
            setStatusMessage(response.message || "Job post submitted successfully.");
        } catch (error) {
            setErrorMessage(formatApiError(error));
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVolunteerSubmit = async (payload: VolunteerPostSubmitPayload) => {
        setIsSubmitting(true);
        setStatusMessage(null);
        setErrorMessage(null);

        try {
            const response = await submitVolunteerPost(payload);
            setStatusMessage(response.message || "Volunteer post submitted successfully.");
        } catch (error) {
            setErrorMessage(formatApiError(error));
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container ">
            <div className="flex flex-col ">
                {statusMessage && (
                    <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {statusMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}
                <div className="flex gap-5">
                    <button
                        onClick={() => setIsPostJob(true)}
                        className={`px-8 ${isPostJob ? "text-primary  bg-blue-50 rounded-lg" : ""}`}
                    >
                        Post Job
                    </button>
                    <button
                        onClick={() => setIsPostJob(false)}
                        className={`px-8 ${isPostJob ? "" : "text-primary bg-blue-50  rounded-lg"}`}
                    >
                        Post Volunteer
                    </button>
                </div>
                {isPostJob && <PostJobForm onSubmit={handleJobSubmit} isSubmitting={isSubmitting} />}
                {!isPostJob && (
                    <PostVolunteerForm onSubmit={handleVolunteerSubmit} isSubmitting={isSubmitting} />
                )}
            </div>
        </div>
    );
}
