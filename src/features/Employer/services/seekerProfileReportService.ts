import { apiRequest } from "../../../services/apiClient";

export async function submitSeekerProfileReport(
    seekerId: number,
    reportReason: string,
): Promise<void> {
    await apiRequest("/employer/seeker-profile-reports", {
        method: "POST",
        body: JSON.stringify({
            seeker_id: seekerId,
            report_reason: reportReason,
        }),
    });
}
