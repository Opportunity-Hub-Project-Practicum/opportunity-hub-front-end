import type { AdminPostListItem } from "./adminPost";

export type AdminOverviewCounts = {
    totalSeekers: number;
    totalEmployers: number;
    jobPosts: number;
    volunteerPosts: number;
    pendingPostReports: number;
    pendingUserReports: number;
    bannedSeekers: number;
    bannedEmployers: number;
    bannedPosts: number;
};

export type AdminOverviewPendingReport = {
    id: number;
    title: string;
    subtitle: string;
    reportCount: number;
    reportedAt: string;
    type: "post" | "user";
};

export type AdminOverviewData = {
    counts: AdminOverviewCounts;
    pendingReports: AdminOverviewPendingReport[];
    recentPosts: AdminPostListItem[];
};
