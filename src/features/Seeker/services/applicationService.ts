import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import type {
    ApplicationApi,
    AppliedCardItem,
    ApplicationsResponse,
} from "../types/application";
import type { PostDetailApi } from "../types/post";
import { getPostLookupName } from "../lib/postLookup";
import { apiRequest } from "../../../services/apiClient";
import { fetchPostDetail, formatPostSalary } from "./postApiService";

export async function fetchSeekerApplications(): Promise<ApplicationApi[]> {
    const response = await apiRequest<ApplicationsResponse>("/seeker/applications");
    return response.applications;
}

export type SubmitApplicationPayload = {
    post_id?: number;
    post_uuid?: string;
    cv_resume_file?: string | null;
};

export type SubmitApplicationResponse = {
    message: string;
    application: ApplicationApi;
};

export async function submitApplication(
    payload: SubmitApplicationPayload,
): Promise<SubmitApplicationResponse> {
    return apiRequest<SubmitApplicationResponse>("/seeker/applications", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

function formatAppliedDate(isoDate: string | null): string {
    if (!isoDate) {
        return "";
    }

    return new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function toAppliedCardItem(
    application: ApplicationApi,
    post: PostDetailApi | null,
): AppliedCardItem | null {
    const postType = post?.type;
    if (postType !== "job" && postType !== "volunteer") {
        return null;
    }

    return {
        applicationId: application.application_id,
        postId: application.post_id,
        postType,
        organizationName: application.employer_name ?? post?.employer?.company_name ?? "",
        title: application.post_title ?? post?.post_title ?? "",
        workPlaceType: post?.work_place_type ?? postType,
        location: getPostLookupName(post?.location),
        salary: post ? formatPostSalary(post) : "",
        appliedDate: formatAppliedDate(application.submission_date),
        status: application.status,
        postIsBanned: Boolean(post?.is_ban ?? application.post_is_ban),
        image: resolveAssetUrl(post?.employer?.logo_img),
    };
}

export async function fetchAppliedCardItems(): Promise<AppliedCardItem[]> {
    const applications = await fetchSeekerApplications();

    const enriched = await Promise.all(
        applications.map(async (application) => {
            const post = await fetchPostDetail(application.post_id);
            return toAppliedCardItem(application, post);
        }),
    );

    return enriched.filter((item): item is AppliedCardItem => item !== null);
}
