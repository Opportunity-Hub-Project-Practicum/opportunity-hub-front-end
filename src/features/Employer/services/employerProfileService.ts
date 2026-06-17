import { apiRequest } from "../../../services/apiClient";
import type {
    CreateEmployerContactPayload,
    EmployerContactApi,
    EmployerContactsResponse,
    EmployerProfileResponse,
    UpdateEmployerContactPayload,
    UpdateEmployerProfilePayload,
} from "../types/employerProfile";

export async function fetchEmployerProfile(): Promise<EmployerProfileResponse> {
    return apiRequest<EmployerProfileResponse>("/employer/profile");
}

export async function updateEmployerProfile(
    payload: UpdateEmployerProfilePayload,
): Promise<EmployerProfileResponse> {
    return apiRequest<EmployerProfileResponse>("/employer/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function fetchEmployerContacts(): Promise<EmployerContactApi[]> {
    const response = await apiRequest<EmployerContactsResponse>("/employer/contacts");
    return response.contacts;
}

export async function createEmployerContact(
    payload: CreateEmployerContactPayload,
): Promise<{ contact: EmployerContactApi }> {
    return apiRequest<{ contact: EmployerContactApi }>("/employer/contacts", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateEmployerContact(
    contactId: number,
    payload: UpdateEmployerContactPayload,
): Promise<{ contact: EmployerContactApi }> {
    return apiRequest<{ contact: EmployerContactApi }>(`/employer/contacts/${contactId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteEmployerContact(contactId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/employer/contacts/${contactId}`, {
        method: "DELETE",
    });
}
