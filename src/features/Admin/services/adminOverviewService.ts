import { fetchPublicStats } from "../../Seeker/services/publicStatsService";
import { groupReportsByPost, fetchAdminReports } from "./adminReportService";
import { fetchAdminPosts, mapAdminPostToListItem } from "./adminPostService";
import {
    fetchAdminSeekerProfileReports,
    groupReportsBySeeker,
} from "./adminSeekerProfileReportService";
import { fetchAdminEmployers, fetchAdminSeekers } from "./adminUserService";
import type {
    AdminOverviewData,
    AdminOverviewPendingReport,
} from "../types/adminOverview";

const RECENT_POST_LIMIT = 5;
const PENDING_REPORT_LIMIT = 5;

function buildPendingReports(
    postReports: ReturnType<typeof groupReportsByPost>,
    userReports: ReturnType<typeof groupReportsBySeeker>,
): AdminOverviewPendingReport[] {
    const postItems: AdminOverviewPendingReport[] = postReports.map((item) => ({
        id: item.postId,
        title: item.postTitle,
        subtitle: item.employerName,
        reportCount: item.reportCount,
        reportedAt: item.latestReportedAt,
        type: "post",
    }));

    const userItems: AdminOverviewPendingReport[] = userReports.map((item) => ({
        id: item.seekerId,
        title: item.seekerName,
        subtitle: item.seekerEmail,
        reportCount: item.reportCount,
        reportedAt: item.latestReportedAt,
        type: "user",
    }));

    return [...postItems, ...userItems]
        .sort((left, right) => {
            const leftTime = left.reportedAt === "—" ? 0 : new Date(left.reportedAt).getTime();
            const rightTime = right.reportedAt === "—" ? 0 : new Date(right.reportedAt).getTime();
            return rightTime - leftTime;
        })
        .slice(0, PENDING_REPORT_LIMIT);
}

export async function fetchAdminOverviewData(): Promise<AdminOverviewData> {
    const [
        publicStats,
        seekers,
        employers,
        bannedSeekers,
        bannedEmployers,
        posts,
        bannedPosts,
        pendingPostReports,
        pendingUserReports,
    ] = await Promise.all([
        fetchPublicStats(),
        fetchAdminSeekers(),
        fetchAdminEmployers(),
        fetchAdminSeekers(true),
        fetchAdminEmployers(true),
        fetchAdminPosts(),
        fetchAdminPosts({ isBan: true }),
        fetchAdminReports({ status: "pending" }),
        fetchAdminSeekerProfileReports({ status: "pending" }),
    ]);

    const groupedPostReports = groupReportsByPost(pendingPostReports);
    const groupedUserReports = groupReportsBySeeker(pendingUserReports);

    const recentPosts = [...posts]
        .sort((left, right) => right.post_id - left.post_id)
        .slice(0, RECENT_POST_LIMIT)
        .map(mapAdminPostToListItem);

    return {
        counts: {
            totalSeekers: publicStats.total_seekers ?? seekers.length,
            totalEmployers: publicStats.total_employers ?? employers.length,
            jobPosts: posts.filter((post) => post.type === "job" && !post.is_ban).length,
            volunteerPosts: posts.filter((post) => post.type === "volunteer" && !post.is_ban).length,
            pendingPostReports: groupedPostReports.length,
            pendingUserReports: groupedUserReports.length,
            bannedSeekers: bannedSeekers.length,
            bannedEmployers: bannedEmployers.length,
            bannedPosts: bannedPosts.length,
        },
        pendingReports: buildPendingReports(groupedPostReports, groupedUserReports),
        recentPosts,
    };
}
