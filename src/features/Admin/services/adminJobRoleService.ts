import { apiRequest } from "../../../services/apiClient";
import type {
    AdminJobRoleApi,
    AdminJobRoleResponse,
    AdminJobRolesResponse,
} from "../types/adminValue";

export async function fetchAdminJobRoles(): Promise<AdminJobRoleApi[]> {
    const response = await apiRequest<AdminJobRolesResponse>("/admin/job-roles");
    return response.job_roles;
}

export async function createAdminJobRole(name: string): Promise<AdminJobRoleApi> {
    const response = await apiRequest<AdminJobRoleResponse>("/admin/job-roles", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
    return response.job_role;
}

export async function updateAdminJobRole(
    jobRoleId: number,
    name: string,
): Promise<AdminJobRoleApi> {
    const response = await apiRequest<AdminJobRoleResponse>(`/admin/job-roles/${jobRoleId}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
    });
    return response.job_role;
}

export async function deleteAdminJobRole(jobRoleId: number): Promise<void> {
    await apiRequest<{ message: string }>(`/admin/job-roles/${jobRoleId}`, {
        method: "DELETE",
    });
}
