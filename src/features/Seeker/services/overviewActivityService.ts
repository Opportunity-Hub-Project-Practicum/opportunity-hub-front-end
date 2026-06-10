import type { OverviewActivityData } from "../types/overviewActivity";
import type { SeekerNotifySettingApi } from "../types/seekerProfile";
import { fetchAppliedCardItems } from "./applicationService";
import { fetchFavoriteCardItems } from "./favoritePostService";
import { fetchSeekerProfile } from "./seekerProfileService";

const RECENT_APPLICATION_LIMIT = 5;

function isAlertConfigured(
    setting: SeekerNotifySettingApi | null | undefined,
    category: "job" | "volunteer",
): boolean {
    if (!setting || setting.category !== category) {
        return false;
    }

    return Boolean(setting.role_name?.trim() || setting.location?.trim());
}

export async function fetchOverviewActivityData(): Promise<OverviewActivityData> {
    const [profileResponse, appliedItems, favoriteItems] = await Promise.all([
        fetchSeekerProfile(),
        fetchAppliedCardItems(),
        fetchFavoriteCardItems(),
    ]);

    const notifySetting = profileResponse.profile.notify_setting;

    return {
        userName: profileResponse.profile.full_name?.trim() || "User",
        counts: {
            appliedJobs: appliedItems.filter((item) => item.postType === "job").length,
            favoriteJobs: favoriteItems.filter((item) => item.postType === "job").length,
            jobAlerts: isAlertConfigured(notifySetting, "job") ? 1 : 0,
            appliedVolunteers: appliedItems.filter((item) => item.postType === "volunteer").length,
            favoriteVolunteers: favoriteItems.filter((item) => item.postType === "volunteer").length,
            volunteerAlerts: isAlertConfigured(notifySetting, "volunteer") ? 1 : 0,
        },
        recentItems: {
            job: appliedItems.filter((item) => item.postType === "job").slice(0, RECENT_APPLICATION_LIMIT),
            volunteer: appliedItems
                .filter((item) => item.postType === "volunteer")
                .slice(0, RECENT_APPLICATION_LIMIT),
        },
    };
}
