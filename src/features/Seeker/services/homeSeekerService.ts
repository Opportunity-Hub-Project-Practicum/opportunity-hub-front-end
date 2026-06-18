import type {
    HomeCompanyCard,
    HomeHeroBanner,
    HomePostCard,
    HomeRoleSummary,
    HomeSeekerData,
} from "../types/homeSeeker";
import type { PublicEmployerApi } from "../types/employer";
import { fetchPublicEmployers } from "./employerService";
import { fetchPublicStats } from "./publicStatsService";
import { fetchPostFilters } from "./postApiService";

const POPULAR_CATEGORY_LIMIT = 3;
const COMPANY_LIMIT = 8;

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

export async function fetchHomeSeekerData(): Promise<HomeSeekerData> {
    const [filters, stats, employers] = await Promise.all([
        fetchPostFilters(),
        fetchPublicStats(),
        fetchPublicEmployers(),
    ]);

    const popularJobs: HomeRoleSummary[] = [];
    const popularVolunteers: HomeRoleSummary[] = [];
    const featuredJobs: HomePostCard[] = [];
    const featuredVolunteers: HomePostCard[] = [];

    return {
        popularCategories: filters.categories
            .slice(0, POPULAR_CATEGORY_LIMIT)
            .map((category) => category.label),
        heroBanners: buildHeroBanners(
            stats.open_jobs ?? 0,
            stats.open_volunteers ?? 0,
            stats.total_employers,
            stats.total_seekers,
        ),
        popularJobs,
        popularVolunteers,
        topCompanies: buildTopCompanies(employers),
        featuredJobs,
        featuredVolunteers,
    };
}
