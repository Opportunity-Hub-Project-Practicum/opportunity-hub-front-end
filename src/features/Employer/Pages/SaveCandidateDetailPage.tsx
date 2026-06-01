import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    Calendar,
    Clock,
    GraduationCap,
    DollarSign,
    MapPin,
    Briefcase,
    Star,
} from "lucide-react";
import PostDetailCard from "../../../GlobalComponents/PostDetailCard";
import BackButton from "../../Seeker/Components/BackButton";
import ReportModal from "../../Seeker/Components/modal/ReportModal";
import { MOCK_FAVOURITE_CANDIDATES, MOCK_USERS } from "../../../services/mockJobPortalApi";
import { Posts, getOrganizationById, formatSalary } from "../../../services/postService";

export default function SaveCandidateDetailPage() {
    const { favouriteId } = useParams<{ favouriteId: string }>();
    const [isBookmarked, setIsBookmarked] = useState(true);
    const [isReport, setIsReport] = useState(false);

    const favourite = MOCK_FAVOURITE_CANDIDATES.find(
        (item) => item.id === parseInt(favouriteId || "0")
    );
    const candidate = favourite
        ? MOCK_USERS.find((user) => user.id === favourite.candidateId)
        : undefined;
    const post = favourite?.postId
        ? Posts.find((item) => item.id === favourite.postId)
        : undefined;

    if (!favourite || !post) {
        return (
            <div className="page-container">
                <BackButton />
                <p className="text-gray-600">Saved candidate or post not found.</p>
            </div>
        );
    }

    const organization = getOrganizationById(post.employer_id);
    const isVolunteer = post.type === "volunteer";

    const overviewItems = [
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

    return (
        <section className="page-container">
            <BackButton />

            {candidate && (
                <div className="mb-5 rounded-lg border border-primary bg-blue-50 p-4">
                    <p className="font-semibold text-primaryDark">
                        Saved candidate: {candidate.fullName}
                    </p>
                    {favourite.note && (
                        <p className="mt-1 text-sm text-gray-600">{favourite.note}</p>
                    )}
                </div>
            )}

            <PostDetailCard
                post={{
                    title: post.title,
                    employment_type: post.employment_type,
                    post_description: post.post_description,
                    responsibility: post.responsibility,
                }}
                organization={
                    organization ?? {
                        name: "Unknown",
                        image: "",
                        industry_type: "",
                    }
                }
                overviewItems={overviewItems}
                isVolunteer={isVolunteer}
                isBookmarked={isBookmarked}
                onBookmark={() => setIsBookmarked((prev) => !prev)}
                onReport={() => setIsReport(true)}
            />

            {isReport && (
                <ReportModal
                    onClose={() => setIsReport(false)}
                    onSubmit={() => setIsReport(false)}
                />
            )}
        </section>
    );
}
