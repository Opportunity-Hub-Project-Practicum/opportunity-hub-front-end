import type { PublicPostApi } from "./post";

export type HomePopularCategory = {
    label: string;
    value: string;
    count: number;
};

export type HomeHeroBanner = {
    id: number;
    label: string;
    count: number;
};

export type HomeRoleSummary = {
    id: number;
    label: string;
    type: "job" | "volunteer";
    count: number;
};

export type HomeCompanyCard = {
    employerId: number;
    name: string;
    image: string;
    openPositions: number;
};

export type HomePostCard = {
    postId: number;
    employerId: number;
    organizationName: string;
    title: string;
    engagementType: string;
    location: string;
    salary: string;
    remainingDays: string;
    image: string;
};

export type HomeSeekerData = {
    popularCategories: HomePopularCategory[];
    heroBanners: HomeHeroBanner[];
    popularJobs: HomeRoleSummary[];
    popularVolunteers: HomeRoleSummary[];
    topCompanies: HomeCompanyCard[];
    featuredJobs: HomePostCard[];
    featuredVolunteers: HomePostCard[];
};

export type { PublicPostApi };
