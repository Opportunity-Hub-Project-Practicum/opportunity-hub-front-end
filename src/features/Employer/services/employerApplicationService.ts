import { apiRequest } from "../../../services/apiClient";
import type {
    EmployerApplicationApi,
    EmployerApplicationsResponse,
    UpdateEmployerApplicationStatusPayload,
    UpdateEmployerApplicationStatusResponse,
} from "../types/employerApplication";

export async function fetchEmployerPostApplications(
    postId: number | string,
): Promise<EmployerApplicationApi[]> {
    const response = await apiRequest<EmployerApplicationsResponse>(
        `/employer/posts/${postId}/applications`,
    );
    return response.applications;
}

export async function updateEmployerApplicationStatus(
    postId: number | string,
    applicationId: number | string,
    payload: UpdateEmployerApplicationStatusPayload,
): Promise<EmployerApplicationApi> {
    const response = await apiRequest<UpdateEmployerApplicationStatusResponse>(
        `/employer/posts/${postId}/applications/${applicationId}/status`,
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );
    return response.application;
}
