import { mapJobPostToApi, mapVolunteerPostToApi } from "../lib/postApplicationMappers";
import type {
    CreateEmployerPostResponse,
    JobPostSubmitPayload,
    VolunteerPostSubmitPayload,
} from "../types/postApplication";
import { apiRequest } from "../../../services/apiClient";

export type {
    JobPostSubmitPayload,
    VolunteerPostSubmitPayload,
} from "../types/postApplication";

export async function submitJobPost(payload: JobPostSubmitPayload): Promise<CreateEmployerPostResponse> {
    return apiRequest<CreateEmployerPostResponse>("/employer/posts", {
        method: "POST",
        body: JSON.stringify(mapJobPostToApi(payload)),
    });
}

export async function submitVolunteerPost(
    payload: VolunteerPostSubmitPayload,
): Promise<CreateEmployerPostResponse> {
    return apiRequest<CreateEmployerPostResponse>("/employer/posts", {
        method: "POST",
        body: JSON.stringify(mapVolunteerPostToApi(payload)),
    });
}
