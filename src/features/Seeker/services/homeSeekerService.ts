import type {
    HomeCompanyCard,
    HomeHeroBanner,
    HomePopularCategory,
    HomePostCard,
    HomeSeekerData,
} from "../types/homeSeeker";
import type { PublicEmployerApi } from "../types/employer";
import type { PublicPostApi } from "../types/post";
import { fetchPublicEmployers } from "./employerService";
import { fetchPublicStats } from "./publicStatsService";
import {
    fetchPopularCategories,
    fetchPublicPosts,
    toPostListCardItem,
} from "./postApiService";

const POPULAR_CATEGORY_LIMIT = 6;
const COMPANY_LIMIT = 8;
const LATEST_POST_LIMIT = 6;
const FEATURED_POST_LIMIT = 6;

function buildTopCompanies(employers: PublicEmployerApi[]): HomeCompanyCard[] {
    return employers
        .map((employer) => ({
            employerId: employer.user_id,
            name: employer.company_name,
            image: employer.logo_img ?? "",
            openPositions: employer.open_posts_count ?? 0,
        }))
        .sort((a, b) => {
            if (b.openPositions !== a.openPositions) {
                return b.openPositions - a.openPositions;
            }

            return a.name.localeCompare(b.name);
        })
        .slice(0, COMPANY_LIMIT);
}

function buildHeroBanners(
    jobsCount: number,
    volunteersCount: number,
    totalEmployers: number,
    totalSeekers: number,
): HomeHeroBanner[] {
    return [
        { id: 1, label: "Live Job", count: jobsCount },
        { id: 2, label: "Live Volunteer", count: volunteersCount },
        { id: 3, label: "Companies", count: totalEmployers },
        { id: 4, label: "Candidates", count: totalSeekers },
    ];
}

export function toHomePostCard(post: PublicPostApi): HomePostCard {
    const card = toPostListCardItem(post);

    return {
        postId: card.postId,
        employerId: post.employer?.user_id ?? 0,
        organizationName: card.organizationName,
        title: card.title,
        engagementType: card.engagementType,
        location: card.location,
        salary: card.salary,
        remainingDays: card.remainingDays,
        image: card.image,
        isUrgent: card.isUrgent,
    };
}

export async function fetchHomeSeekerData(): Promise<HomeSeekerData> {
    const [
        popularCategories,
        stats,
        employers,
        latestJobPosts,
        latestVolunteerPosts,
        featuredJobPosts,
        featuredVolunteerPosts,
    ] = await Promise.all([
        fetchPopularCategories(POPULAR_CATEGORY_LIMIT),
        fetchPublicStats(),
        fetchPublicEmployers(),
        fetchPublicPosts({
            type: "job",
            sort: "latest",
            limit: LATEST_POST_LIMIT,
        }),
        fetchPublicPosts({
            type: "volunteer",
            sort: "latest",
            limit: LATEST_POST_LIMIT,
        }),
        fetchPublicPosts({
            type: "job",
            sort: "most_applications",
            limit: FEATURED_POST_LIMIT,
        }),
        fetchPublicPosts({
            type: "volunteer",
            sort: "most_applications",
            limit: FEATURED_POST_LIMIT,
        }),
    ]);

    const latestJobs = latestJobPosts.map(toHomePostCard);
    const latestVolunteers = latestVolunteerPosts.map(toHomePostCard);
    const featuredJobs = featuredJobPosts.map(toHomePostCard);
    const featuredVolunteers = featuredVolunteerPosts.map(toHomePostCard);

    return {
        popularCategories: popularCategories.map((category): HomePopularCategory => ({
            label: category.label,
            value: category.value,
            count: category.count,
        })),
        heroBanners: buildHeroBanners(
            stats.open_jobs ?? 0,
            stats.open_volunteers ?? 0,
            stats.total_employers,
            stats.total_seekers,
        ),
        topCompanies: buildTopCompanies(employers),
        latestJobs,
        latestVolunteers,
        featuredJobs,
        featuredVolunteers,
    };
}
