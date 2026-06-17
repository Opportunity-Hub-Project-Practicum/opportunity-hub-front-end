import { apiRequest } from "../../../services/apiClient";

export async function submitPostReport(postId: number, reportReason: string): Promise<void> {
    await apiRequest("/seeker/reports", {
        method: "POST",
        body: JSON.stringify({
            post_id: postId,
            report_reason: reportReason,
        }),
    });
}
