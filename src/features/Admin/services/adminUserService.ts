import { apiRequest } from "../../../services/apiClient";
import type {
    AdminEmployerResponse,
    AdminEmployersResponse,
    AdminSeekerResponse,
    AdminSeekersResponse,
    AdminSeekerApi,
} from "../types/adminUser";
import type { EmployerProfileApi } from "../../Employer/types/employerProfile";

function buildBanQuery(isBan?: boolean): string {
    if (isBan === undefined) {
        return "";
    }
    return `?is_ban=${isBan}`;
}
//--------------------------------------------------------------
 // fecting user and check for if user ban
export async function fetchAdminSeekers(isBan?: boolean): Promise<AdminSeekerApi[]> {
    const response = await apiRequest<AdminSeekersResponse>(
        `/admin/seekers${buildBanQuery(isBan)}`,
    );
    return response?.seekers ?? [];
}

export async function fetchAdminSeeker(seekerId: number): Promise<AdminSeekerApi> {
    const response = await apiRequest<AdminSeekerResponse>(`/admin/seekers/${seekerId}`);
    return response?.seeker;
}

export async function fetchAdminEmployers(isBan?: boolean): Promise<EmployerProfileApi[]> {
    const response = await apiRequest<AdminEmployersResponse>(
        `/admin/employers${buildBanQuery(isBan)}`,
    );
    return response?.employers ?? [];
}

export async function fetchAdminEmployer(employerId: number): Promise<EmployerProfileApi> {
    const response = await apiRequest<AdminEmployerResponse>(`/admin/employers/${employerId}`);
    return response?.employer;
}

//-------------------------------------------------------------------
// for ban and unban

export async function banAdminSeeker(seekerId: number): Promise<AdminSeekerApi> {
    const response = await apiRequest<AdminSeekerResponse>(`/admin/seekers/${seekerId}/ban`, {
        method: "PATCH",
    });
    return response.seeker;
}

export async function unbanAdminSeeker(seekerId: number): Promise<AdminSeekerApi> {
    const response = await apiRequest<AdminSeekerResponse>(`/admin/seekers/${seekerId}/unban`, {
        method: "PATCH",
    });
    return response.seeker;
}

export async function banAdminEmployer(employerId: number): Promise<EmployerProfileApi> {
    const response = await apiRequest<AdminEmployerResponse>(`/admin/employers/${employerId}/ban`, {
        method: "PATCH",
    });
    return response.employer;
}

export async function unbanAdminEmployer(employerId: number): Promise<EmployerProfileApi> {
    const response = await apiRequest<AdminEmployerResponse>(`/admin/employers/${employerId}/unban`, {
        method: "PATCH",
    });
    return response.employer;
}
