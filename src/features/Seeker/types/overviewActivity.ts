import type { AppliedCardItem } from "./application";

export type OverviewActivityCounts = {
    appliedJobs: number;
    favoriteJobs: number;
    jobAlerts: number;
    appliedVolunteers: number;
    favoriteVolunteers: number;
    volunteerAlerts: number;
};

export type OverviewActivityData = {
    userName: string;
    profileImage: string | null;
    counts: OverviewActivityCounts;
    recentItems: {
        job: AppliedCardItem[];
        volunteer: AppliedCardItem[];
    };
};
