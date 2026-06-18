import type { OverviewActivityData } from "../types/overviewActivity";
import { countAlertItemsByType } from "../lib/alertItemMappers";
import { fetchAlertItems } from "./alertItemService";
import { fetchAppliedCardItems } from "./applicationService";
import { fetchFavoriteCardItems } from "./favoritePostService";
import { fetchSeekerProfile } from "./seekerProfileService";

const RECENT_APPLICATION_LIMIT = 5;

export async function fetchOverviewActivityData(): Promise<OverviewActivityData> {
    const [profileResponse, appliedItems, favoriteItems, alertItems] = await Promise.all([
        fetchSeekerProfile(),
        fetchAppliedCardItems(),
        fetchFavoriteCardItems(),
        fetchAlertItems(),
    ]);

    return {
        userName: profileResponse.profile.full_name?.trim() || "User",
        counts: {
            appliedJobs: appliedItems.filter((item) => item.postType === "job").length,
            favoriteJobs: favoriteItems.filter((item) => item.postType === "job").length,
            jobAlerts: countAlertItemsByType(alertItems, "job"),
            appliedVolunteers: appliedItems.filter((item) => item.postType === "volunteer").length,
            favoriteVolunteers: favoriteItems.filter((item) => item.postType === "volunteer").length,
            volunteerAlerts: countAlertItemsByType(alertItems, "volunteer"),
        },
        recentItems: {
            job: appliedItems.filter((item) => item.postType === "job").slice(0, RECENT_APPLICATION_LIMIT),
            volunteer: appliedItems
                .filter((item) => item.postType === "volunteer")
                .slice(0, RECENT_APPLICATION_LIMIT),
        },
    };
}
