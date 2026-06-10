import type {
    SeekerContactApi,
    SeekerEducationApi,
    SeekerNotifySettingResponse,
    SeekerProfileResponse,
    SeekerWorkExperienceApi,
    UpdateSeekerNotifyPayload,
    UpdateSeekerProfilePayload,
} from "../types/seekerProfile";
import { apiRequest } from "../../../services/apiClient";

export async function fetchSeekerProfile(): Promise<SeekerProfileResponse> {
    return apiRequest<SeekerProfileResponse>("/seeker/profile");
}

export async function updateSeekerProfile(
    payload: UpdateSeekerProfilePayload,
): Promise<SeekerProfileResponse> {
    return apiRequest<SeekerProfileResponse>("/seeker/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function fetchNotifySettings(): Promise<SeekerNotifySettingResponse> {
    return apiRequest<SeekerNotifySettingResponse>("/seeker/notify-settings");
}

export async function updateNotifySettings(
    payload: UpdateSeekerNotifyPayload,
): Promise<SeekerNotifySettingResponse> {
    return apiRequest<SeekerNotifySettingResponse>("/seeker/notify-settings", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function createContact(payload: {
    category: "phone" | "social" | "web_url";
    label: string;
    value: string;
}): Promise<{ contact: SeekerContactApi }> {
    return apiRequest<{ contact: SeekerContactApi }>("/seeker/contacts", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateContact(
    contactId: number,
    payload: { label?: string; value?: string; category?: string },
): Promise<{ contact: SeekerContactApi }> {
    return apiRequest<{ contact: SeekerContactApi }>(`/seeker/contacts/${contactId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function createEducation(payload: {
    institution_name: string;
    degree: string;
    location: string;
    country: string;
    start_date: string;
    end_date?: string | null;
}): Promise<{ education: SeekerEducationApi }> {
    return apiRequest<{ education: SeekerEducationApi }>("/seeker/educations", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function createWorkExperience(payload: {
    company_name: string;
    job_title: string;
    job_role: string;
    year_of_experience: number;
    industry: string;
    start_date: string;
    end_date?: string | null;
    description?: string | null;
}): Promise<{ work_experience: SeekerWorkExperienceApi }> {
    return apiRequest("/seeker/work-experiences", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
