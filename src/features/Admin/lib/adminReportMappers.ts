import {
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    GraduationCap,
    MapPin,
    Star,
} from "lucide-react";
import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import type { Organization } from "../../Seeker/Components/card/CardCompany";
import {
    formatClosedDate,
    formatPostSalary,
} from "../../Seeker/services/postApiService";
import { getPostLookupName } from "../../Seeker/lib/postLookup";
import type { PostDetailApi } from "../../Seeker/types/post";

function formatPostedDate(isoDate: string | null): string {
    if (!isoDate) {
        return "";
    }

    return new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function buildPostOverviewItems(post: PostDetailApi) {
    const isVolunteer = post.type === "volunteer";

    return [
        {
            label: "Posted",
            value: formatPostedDate(post.created_at),
            icon: Calendar,
            show: !!post.created_at,
        },
        {
            label: "Expire In",
            value: formatClosedDate(post.closed_date),
            icon: Clock,
            show: !!post.closed_date,
        },
        {
            label: isVolunteer ? "Benefit" : "Salary",
            value: formatPostSalary(post),
            icon: DollarSign,
            show: true,
        },
        {
            label: "Education",
            value: post.job_education ?? "",
            icon: GraduationCap,
            show: !isVolunteer && !!post.job_education,
        },
        {
            label: "Location",
            value: getPostLookupName(post.location),
            icon: MapPin,
            show: !!getPostLookupName(post.location),
        },
        {
            label: "Job Role",
            value: getPostLookupName(post.job_role),
            icon: Briefcase,
            show: !isVolunteer && !!getPostLookupName(post.job_role),
        },
        {
            label: "Experience",
            value: post.job_experience ?? "",
            icon: Star,
            show: !isVolunteer && !!post.job_experience,
        },
    ].filter((item) => item.show);
}

export function buildPostOrganization(post: PostDetailApi): Organization {
    const logo = post.employer?.logo_img;
    const resolvedLogo = logo ? resolveAssetUrl(logo) : "";

    return {
        name: post.employer?.company_name ?? "Unknown",
        image: resolvedLogo === "#" ? "" : resolvedLogo,
        industry_type: "",
    };
}
