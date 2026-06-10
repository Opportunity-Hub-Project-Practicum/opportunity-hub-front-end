import { apiRequest } from "../../../services/apiClient";
import type { SeekerProfileResponse } from "../types/seekerProfile";

export async function fetchPublicSeekerProfile(
    seekerRef: number | string,
): Promise<SeekerProfileResponse | null> {
    try {
        return await apiRequest<SeekerProfileResponse>(`/seekers/${seekerRef}`, {}, { auth: false });
    } catch {
        return null;
    }
}
