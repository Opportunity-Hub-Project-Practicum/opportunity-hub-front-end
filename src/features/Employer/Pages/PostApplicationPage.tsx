import { useState } from "react";
import PostJobForm from "../Components/PostJobForm";
import PostVolunteerForm from "../Components/PostVolunteerForm";
import { submitJobPost, submitVolunteerPost, type JobPostSubmitPayload, type VolunteerPostSubmitPayload } from "../services/postApplicationService";
export default function PostApplicationPage() {
    const [isPostJob, setIsPostJob] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleJobSubmit = async (payload: JobPostSubmitPayload) => {
        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            await submitJobPost(payload);
            setStatusMessage("Job post submitted successfully.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVolunteerSubmit = async (payload: VolunteerPostSubmitPayload) => {
        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            await submitVolunteerPost(payload);
            setStatusMessage("Volunteer post submitted successfully.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (<div className="page-container ">
        <div className="flex flex-col ">
            {statusMessage && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {statusMessage}
                </div>
            )}
            <div className="flex gap-5">
                <button
                    onClick={() => { setIsPostJob(true) }}
                    className={`px-8 ${isPostJob ? 'text-primary  bg-blue-50 rounded-lg' : ''}`}>Post Job</button>
                <button
                    onClick={() => { setIsPostJob(false) }}
                    className={`px-8 ${isPostJob ? '' : 'text-primary bg-blue-50  rounded-lg'}`}>Post Volunteer</button>
            </div>
            {isPostJob && <PostJobForm onSubmit={handleJobSubmit} isSubmitting={isSubmitting} />}
            {!isPostJob && <PostVolunteerForm onSubmit={handleVolunteerSubmit} isSubmitting={isSubmitting} />}
        </div>

    </div>

    )
}