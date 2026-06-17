import type {
    HomeCompanyCard,
    HomeHeroBanner,
    HomePostCard,
    HomeRoleSummary,
    HomeSeekerData,
} from "../types/homeSeeker";
import type { PublicEmployerApi } from "../types/employer";
import type { PublicPostApi } from "../types/post";
import type { PublicStats } from "../types/publicStats";
import { fetchPublicEmployers } from "./employerService";
import { fetchPublicStats } from "./publicStatsService";
import {
    fetchPostFilters,
    fetchPublicPosts,
    formatClosedDate,
    formatPostSalary,
} from "./postApiService";

const FEATURED_LIMIT = 6;
const ROLE_SUMMARY_LIMIT = 8;
const COMPANY_LIMIT = 8;
const POPULAR_CATEGORY_LIMIT = 3;

function toHomePostCard(post: PublicPostApi): HomePostCard {
    return {
        postId: post.post_id,
        employerId: post.employer?.user_id ?? 0,
        organizationName: post.employer?.company_name ?? "Unknown",
        title: post.post_title,
        engagementType: post.work_place_type ?? post.type,
        location: post.location ?? "",
        salary: formatPostSalary(post),
        remainingDays: formatClosedDate(post.closed_date),
        image: post.employer?.logo_img ?? "",
    };
}

function buildRoleSummaries(posts: PublicPostApi[], type: "job" | "volunteer"): HomeRoleSummary[] {
    const counts = new Map<string, number>();

    for (const post of posts) {
        if (post.type !== type || !post.job_role?.trim()) {
            continue;
        }
        const role = post.job_role.trim();
        counts.set(role, (counts.get(role) ?? 0) + 1);
    }

    return Array.from(counts.entries())
        .map(([label, count], index) => ({
            id: index + 1,
            label,
            type,
            count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, ROLE_SUMMARY_LIMIT);
}

function buildTopCompanies(employers: PublicEmployerApi[]): HomeCompanyCard[] {
    return employers
        .map((employer) => ({
            employerId: employer.user_id,
            name: employer.company_name,
            image: employer.logo_img ?? "",
            openPositions: employer.open_posts_count ?? 0,
        }))
        .sort((a, b) => b.openPositions - a.openPositions)
        .slice(0, COMPANY_LIMIT);
}

function buildHeroBanners(
    jobsCount: number,
    volunteersCount: number,
    stats: PublicStats,
): HomeHeroBanner[] {
    return [
        { id: 1, label: "Live Job", count: jobsCount },
        { id: 2, label: "Live Volunteer", count: volunteersCount },
        { id: 3, label: "Companies", count: stats.total_employers },
        { id: 4, label: "Candidates", count: stats.total_seekers },
    ];
}

export async function fetchHomeSeekerData(): Promise<HomeSeekerData> {
    const [posts, filters, stats, employers] = await Promise.all([
        fetchPublicPosts(),
        fetchPostFilters(),
        fetchPublicStats(),
        fetchPublicEmployers(),
    ]);

    const jobs = posts.filter((post) => post.type === "job");
    const volunteers = posts.filter((post) => post.type === "volunteer");

    return {
        popularCategories: filters.categories
            .slice(0, POPULAR_CATEGORY_LIMIT)
            .map((category) => category.label),
        heroBanners: buildHeroBanners(jobs.length, volunteers.length, stats),
        popularJobs: buildRoleSummaries(posts, "job"),
        popularVolunteers: buildRoleSummaries(posts, "volunteer"),
        topCompanies: buildTopCompanies(employers),
        featuredJobs: jobs.slice(0, FEATURED_LIMIT).map(toHomePostCard),
        featuredVolunteers: volunteers.slice(0, FEATURED_LIMIT).map(toHomePostCard),
    };
}
