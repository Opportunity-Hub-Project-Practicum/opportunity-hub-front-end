import { apiRequest } from "../../../services/apiClient";
import type { PublicStats, PublicStatsResponse } from "../types/publicStats";

export async function fetchPublicStats(): Promise<PublicStats> {
    const response = await apiRequest<PublicStatsResponse>(
        "/stats",
        {},
        { auth: false },
    );
    return response?.stats ?? { total_seekers: 0, total_employers: 0 };
}
