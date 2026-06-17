/*
 * mockJobPortalApi.ts
 * -------------------
 * In-memory mock API used for local development and testing.
 * - Declares TypeScript types/interfaces for users, posts, and favourites.
 * - Provides a small dataset (MOCK_*) used as the API data source.
 * - Simulates network latency and failure via `withRequest`.
 * Each exported `fetch*` function returns an `ApiResponse<T>` shaped like a real API.
 */

export type UserRole = "admin" | "employer" | "seeker";
export type PostType = "job" | "volunteer";
export type PostStatus =  "open" | "closed" ;
export type FavouriteCandidateStatus = "saved" | "shortlisted" | "interviewing" | "hired";

export interface UserProfileBase {
    city: string;
    country: string;
    phone?: string;
    avatarUrl: string;
    bio: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

export interface EmployerProfile {
    companyName: string;
    industry: string;
    companySize: string;
    website: string;
    openPostsCount: number;
}

export interface SeekerProfile {
    currentTitle: string;
    experienceLevel: "intern" | "junior" | "mid" | "senior";
    availability: "full-time" | "part-time" | "contract" | "volunteer";
    resumeUrl?: string;
    portfolioUrl?: string;
}

export interface User extends UserProfileBase {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    employerProfile?: EmployerProfile;
    seekerProfile?: SeekerProfile;
}

export interface PostSalaryRange {
    currency: "USD" | "KHR";
    minimum: number | null;
    maximum: number | null;
    interval: "hour" | "day" | "month" | "project";
    isPaid: boolean;
}

export interface Post {
    id: number;
    employerId: number;
    postType: PostType;
    title: string;
    category: string;
    location: string;
    workplaceType: "onsite" | "hybrid" | "remote";
    employmentType: "full-time" | "part-time" | "contract" | "internship" | "volunteer";
    status: PostStatus;
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    salary: PostSalaryRange;
    applicationsCount: number;
    favouriteCount: number;
    closingDate: string;
    postedAt: string;
    tags: string[];
    contactEmail: string;
    imageUrl: string;
}

export interface FavouriteCandidate {
    id: number;
    employerId: number;
    candidateId: number;
    postId: number | null;
    status: FavouriteCandidateStatus;
    score: number;
    matchedSkills: string[];
    note: string;
    savedAt: string;
    lastContactedAt: string | null;
}

export interface ApiError {
    code: string;
    message: string;
    details?: string;
}

export interface ApiMeta {
    requestId: string;
    generatedAt: string;
    delayMs: number;
}

export interface ApiSuccessResponse<T> {
    ok: true;
    data: T;
    meta: ApiMeta;
}

export interface ApiFailureResponse {
    ok: false;
    error: ApiError;
    meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export interface PagedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface MockRequestOptions {
    delayMs?: number;
    shouldFail?: boolean;
    errorMessage?: string;
}

export interface PostQueryOptions {
    postType?: PostType;
    status?: PostStatus;
    employerId?: number;
    category?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    shouldFail?: boolean;
    delayMs?: number;
}

export interface FavouriteCandidateQueryOptions {
    employerId?: number;
    status?: FavouriteCandidateStatus;
    candidateId?: number;
    search?: string;
    page?: number;
    pageSize?: number;
    shouldFail?: boolean;
    delayMs?: number;
}

export type ReportTargetType = "post" | "user";
export type ReportStatus = "pending" | "resolved";

export interface ReportRecord {
    id: number;
    targetType: ReportTargetType;
    postId: number | null;
    userId: number | null;
    reportCount: number;
    latestReportedAt: string;
    status: ReportStatus;
    isBanned: boolean;
    summary: string;
}

export interface ReportQueryOptions {
    targetType?: ReportTargetType;
    status?: ReportStatus;
    search?: string;
    page?: number;
    pageSize?: number;
    shouldFail?: boolean;
    delayMs?: number;
}

// Small helper that returns a promise that resolves after `delayMs`.
// Used to simulate network latency for the mock API.
const mockDelay = (delayMs: number) => new Promise((resolve) => setTimeout(resolve, delayMs));

const createRequestId = () => `mock-${Math.random().toString(36).slice(2, 10)}`;

// Build the `meta` object returned with every response. Includes a request id
// and the observed (simulated) latency in milliseconds.
const createMeta = (delayMs: number): ApiMeta => ({
    requestId: createRequestId(),
    generatedAt: new Date().toISOString(),
    delayMs,
});

// Helper to produce a standardized failure response for the mock API.
const toFailure = (delayMs: number, message: string): ApiFailureResponse => ({
    ok: false,
    error: {
        code: "MOCK_API_ERROR",
        message,
    },
    meta: createMeta(delayMs),
});

// Normalize text for consistent case-insensitive searching.
const normalize = (value: string) => value.trim().toLowerCase();

export const MOCK_USERS: User[] = [
    {
        id: 1,
        fullName: "Mona Serey",
        email: "mona@technova.com",
        role: "employer",
        isVerified: true,
        city: "Phnom Penh",
        country: "Cambodia",
        phone: "+855 12 345 678",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop",
        bio: "Hiring product-minded engineers for fast-growing digital products.",
        skills: ["Talent acquisition", "Employer branding", "Interviewing"],
        createdAt: "2025-11-18T09:20:00.000Z",
        updatedAt: "2026-05-18T09:20:00.000Z",
        employerProfile: {
            companyName: "TechNova Co.",
            industry: "Technology",
            companySize: "51-100",
            website: "https://technova.example",
            openPostsCount: 5,
        },
    },
    {
        id: 2,
        fullName: "Chenda Vann",
        email: "chenda@greenearth.org",
        role: "employer",
        isVerified: true,
        city: "Phnom Penh",
        country: "Cambodia",
        phone: "+855 98 112 233",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop",
        bio: "Community organizer focused on volunteer engagement and sustainable projects.",
        skills: ["Community building", "Project coordination", "Volunteer management"],
        createdAt: "2025-10-10T09:20:00.000Z",
        updatedAt: "2026-05-14T09:20:00.000Z",
        employerProfile: {
            companyName: "Green Earth NGO",
            industry: "Non-profit",
            companySize: "11-25",
            website: "https://greenearth.example",
            openPostsCount: 3,
        },
    },
    {
        id: 101,
        fullName: "Rina Chan",
        email: "rina.chan@example.com",
        role: "seeker",
        isVerified: true,
        city: "Phnom Penh",
        country: "Cambodia",
        phone: "+855 17 203 544",
        avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=256&h=256&fit=crop",
        bio: "Frontend developer focused on accessible interfaces and design systems.",
        skills: ["React", "TypeScript", "Accessibility", "Design systems"],
        createdAt: "2025-08-02T09:20:00.000Z",
        updatedAt: "2026-05-17T09:20:00.000Z",
        seekerProfile: {
            currentTitle: "Frontend Developer",
            experienceLevel: "mid",
            availability: "full-time",
            resumeUrl: "https://files.example/resumes/rina-chan.pdf",
            portfolioUrl: "https://rina-chan.dev",
        },
    },
    {
        id: 102,
        fullName: "Sokha Lim",
        email: "sokha.lim@example.com",
        role: "seeker",
        isVerified: false,
        city: "Siem Reap",
        country: "Cambodia",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop",
        bio: "Backend engineer who enjoys building APIs and reliable systems.",
        skills: ["Node.js", "PostgreSQL", "REST APIs", "Testing"],
        createdAt: "2025-09-12T09:20:00.000Z",
        updatedAt: "2026-05-19T09:20:00.000Z",
        seekerProfile: {
            currentTitle: "Backend Developer",
            experienceLevel: "senior",
            availability: "full-time",
            resumeUrl: "https://files.example/resumes/sokha-lim.pdf",
        },
    },
    {
        id: 103,
        fullName: "Sophea Meas",
        email: "sophea.meas@example.com",
        role: "seeker",
        isVerified: true,
        city: "Battambang",
        country: "Cambodia",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop",
        bio: "Community volunteer passionate about environmental cleanup and youth support.",
        skills: ["Event support", "Community outreach", "Coordination"],
        createdAt: "2025-12-02T09:20:00.000Z",
        updatedAt: "2026-05-15T09:20:00.000Z",
        seekerProfile: {
            currentTitle: "Volunteer Coordinator",
            experienceLevel: "junior",
            availability: "volunteer",
        },
    },
    {
        id: 99,
        fullName: "Pory Morokot",
        email: "admin@opportunityhub.com",
        role: "admin",
        isVerified: true,
        city: "Phnom Penh",
        country: "Cambodia",
        phone: "+855 12 999 888",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop",
        bio: "Platform administrator overseeing users, posts, and moderation.",
        skills: ["User management", "Content moderation", "Analytics"],
        createdAt: "2025-06-01T09:00:00.000Z",
        updatedAt: "2026-05-20T09:00:00.000Z",
    },
];

export const MOCK_POSTS: Post[] = [
    {
        id: 1,
        employerId: 1,
        postType: "job",
        title: "Frontend Developer",
        category: "Technology",
        location: "Phnom Penh, Cambodia",
        workplaceType: "hybrid",
        employmentType: "full-time",
        status: "open",
        description: "Build polished product experiences for a growing SaaS platform.",
        responsibilities: [
            "Develop new UI features in React and TypeScript",
            "Collaborate with design and backend teams",
            "Improve accessibility and performance",
        ],
        requirements: [
            "2+ years building React applications",
            "Strong TypeScript fundamentals",
            "Comfortable working with component libraries",
        ],
        benefits: ["Monthly learning budget", "Hybrid schedule", "Health support"],
        salary: {
            currency: "USD",
            minimum: 800,
            maximum: 1500,
            interval: "month",
            isPaid: true,
        },
        applicationsCount: 23,
        favouriteCount: 48,
        closingDate: "2026-06-15",
        postedAt: "2026-05-10",
        tags: ["React", "TypeScript", "UI"],
        contactEmail: "careers@technova.com",
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=600&fit=crop",
    },
    {
        id: 2,
        employerId: 1,
        postType: "job",
        title: "Backend Developer",
        category: "Technology",
        location: "Remote",
        workplaceType: "remote",
        employmentType: "full-time",
        status: "open",
        description: "Design and scale reliable APIs that support the core hiring workflow.",
        responsibilities: ["Build REST APIs", "Write tests", "Review code"],
        requirements: ["Node.js", "PostgreSQL", "API design"],
        benefits: ["Remote-first team", "Flexible hours"],
        salary: {
            currency: "USD",
            minimum: 1000,
            maximum: 1800,
            interval: "month",
            isPaid: true,
        },
        applicationsCount: 18,
        favouriteCount: 37,
        closingDate: "2026-06-22",
        postedAt: "2026-05-11",
        tags: ["Node.js", "REST", "PostgreSQL"],
        contactEmail: "backend@technova.com",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=600&fit=crop",
    },
    {
        id: 3,
        employerId: 2,
        postType: "volunteer",
        title: "Tree Planting Volunteer",
        category: "Environment",
        location: "Phnom Penh, Cambodia",
        workplaceType: "onsite",
        employmentType: "volunteer",
        status: "open",
        description: "Support a weekend tree planting drive with community members.",
        responsibilities: ["Plant seedlings", "Guide participants", "Document attendance"],
        requirements: ["Positive attitude", "Able to work outdoors", "Weekend availability"],
        benefits: ["Certificate", "Meals provided", "Community impact"],
        salary: {
            currency: "KHR",
            minimum: null,
            maximum: null,
            interval: "day",
            isPaid: false,
        },
        applicationsCount: 9,
        favouriteCount: 16,
        closingDate: "2026-05-26",
        postedAt: "2026-05-12",
        tags: ["Volunteer", "Environment", "Community"],
        contactEmail: "volunteer@greenearth.org",
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&h=600&fit=crop",
    },
    {
        id: 4,
        employerId: 2,
        postType: "volunteer",
        title: "Education Support Volunteer",
        category: "Education",
        location: "Kampong Cham, Cambodia",
        workplaceType: "onsite",
        employmentType: "volunteer",
        status: "open",
        description: "Assist teachers with reading sessions and classroom activities.",
        responsibilities: ["Prepare learning materials", "Support students", "Coordinate activities"],
        requirements: ["Friendly communication", "Basic classroom support"],
        benefits: ["Certificate", "Transport stipend"],
        salary: {
            currency: "KHR",
            minimum: null,
            maximum: null,
            interval: "day",
            isPaid: false,
        },
        applicationsCount: 14,
        favouriteCount: 22,
        closingDate: "2026-06-01",
        postedAt: "2026-05-13",
        tags: ["Education", "Volunteer", "Youth"],
        contactEmail: "education@greenearth.org",
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&h=600&fit=crop",
    },
    {
        id: 5,
        employerId: 1,
        postType: "job",
        title: "Product Designer",
        category: "Design",
        location: "Bangkok, Thailand",
        workplaceType: "hybrid",
        employmentType: "contract",
        status: "open",
        description: "Shape intuitive workflows for both candidates and employers.",
        responsibilities: ["Create wireframes", "Validate UX decisions", "Collaborate with engineering"],
        requirements: ["Figma", "User research", "Design systems"],
        benefits: ["Flexible contract", "Creative ownership"],
        salary: {
            currency: "USD",
            minimum: 1200,
            maximum: 2000,
            interval: "month",
            isPaid: true,
        },
        applicationsCount: 11,
        favouriteCount: 29,
        closingDate: "2026-06-30",
        postedAt: "2026-05-14",
        tags: ["Figma", "UX", "Design"],
        contactEmail: "design@technova.com",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=600&fit=crop",
    },
    {
        id: 6,
        employerId: 2,
        postType: "volunteer",
        title: "Event Volunteer",
        category: "Events",
        location: "Ho Chi Minh City, Vietnam",
        workplaceType: "onsite",
        employmentType: "volunteer",
        status: "open",
        description: "Support a regional sustainability summit and coordinate attendees.",
        responsibilities: ["Welcome guests", "Help at registration", "Manage logistics"],
        requirements: ["Good communication", "Able to stand for long periods"],
        benefits: ["Meal voucher", "Certificate", "Networking"],
        salary: {
            currency: "KHR",
            minimum: null,
            maximum: null,
            interval: "day",
            isPaid: false,
        },
        applicationsCount: 20,
        favouriteCount: 31,
        closingDate: "2026-05-31",
        postedAt: "2026-05-15",
        tags: ["Events", "Volunteer", "Operations"],
        contactEmail: "events@greenearth.org",
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=600&fit=crop",
    },
];

export const MOCK_FAVOURITE_CANDIDATES: FavouriteCandidate[] = [
    {
        id: 1,
        employerId: 1,
        candidateId: 101,
        postId: 1,
        status: "shortlisted",
        score: 92,
        matchedSkills: ["React", "TypeScript", "Accessibility"],
        note: "Strong fit for product UI work.",
        savedAt: "2026-05-18T11:30:00.000Z",
        lastContactedAt: "2026-05-19T09:00:00.000Z",
    },
    {
        id: 2,
        employerId: 1,
        candidateId: 102,
        postId: 2,
        status: "interviewing",
        score: 95,
        matchedSkills: ["Node.js", "PostgreSQL", "Testing"],
        note: "Needs a final system design interview.",
        savedAt: "2026-05-17T08:15:00.000Z",
        lastContactedAt: "2026-05-19T14:20:00.000Z",
    },
    {
        id: 3,
        employerId: 2,
        candidateId: 103,
        postId: 3,
        status: "saved",
        score: 84,
        matchedSkills: ["Event support", "Community outreach"],
        note: "Reliable volunteer for outdoor work.",
        savedAt: "2026-05-16T10:00:00.000Z",
        lastContactedAt: null,
    },
    {
        id: 4,
        employerId: 2,
        candidateId: 101,
        postId: 6,
        status: "shortlisted",
        score: 79,
        matchedSkills: ["Coordination", "Communication"],
        note: "Could support event-day operations.",
        savedAt: "2026-05-18T16:10:00.000Z",
        lastContactedAt: null,
    },
];

export const MOCK_REPORTS: ReportRecord[] = [
    {
        id: 1,
        targetType: "post",
        postId: 1,
        userId: null,
        reportCount: 5,
        latestReportedAt: "2026-05-10",
        status: "pending",
        isBanned: false,
        summary: "Misleading salary range listed in the post.",
    },
    {
        id: 2,
        targetType: "post",
        postId: 2,
        userId: null,
        reportCount: 8,
        latestReportedAt: "2026-05-11",
        status: "pending",
        isBanned: false,
        summary: "Duplicate job posting from the same employer.",
    },
    {
        id: 3,
        targetType: "post",
        postId: 10,
        userId: null,
        reportCount: 12,
        latestReportedAt: "2026-05-05",
        status: "resolved",
        isBanned: true,
        summary: "Post remained active after the closing date.",
    },
    {
        id: 4,
        targetType: "post",
        postId: 11,
        userId: null,
        reportCount: 4,
        latestReportedAt: "2026-05-01",
        status: "resolved",
        isBanned: true,
        summary: "Volunteer event details were inaccurate.",
    },
    {
        id: 5,
        targetType: "user",
        postId: null,
        userId: 101,
        reportCount: 3,
        latestReportedAt: "2026-05-12",
        status: "pending",
        isBanned: false,
        summary: "Profile contains suspicious contact links.",
    },
    {
        id: 6,
        targetType: "user",
        postId: null,
        userId: 102,
        reportCount: 6,
        latestReportedAt: "2026-05-13",
        status: "pending",
        isBanned: false,
        summary: "User reported for spamming multiple employers.",
    },
    {
        id: 7,
        targetType: "user",
        postId: null,
        userId: 103,
        reportCount: 15,
        latestReportedAt: "2026-05-02",
        status: "resolved",
        isBanned: true,
        summary: "Fake volunteer credentials submitted.",
    },
];

export const MOCK_USERS_RESPONSE: ApiSuccessResponse<PagedResult<User>> = {
    ok: true,
    data: {
        items: MOCK_USERS,
        total: MOCK_USERS.length,
        page: 1,
        pageSize: MOCK_USERS.length,
        hasMore: false,
    },
    meta: createMeta(0),
};

export const MOCK_POSTS_RESPONSE: ApiSuccessResponse<PagedResult<Post>> = {
    ok: true,
    data: {
        items: MOCK_POSTS,
        total: MOCK_POSTS.length,
        page: 1,
        pageSize: MOCK_POSTS.length,
        hasMore: false,
    },
    meta: createMeta(0),
};

export const MOCK_FAVOURITE_CANDIDATES_RESPONSE: ApiSuccessResponse<PagedResult<FavouriteCandidate>> = {
    ok: true,
    data: {
        items: MOCK_FAVOURITE_CANDIDATES,
        total: MOCK_FAVOURITE_CANDIDATES.length,
        page: 1,
        pageSize: MOCK_FAVOURITE_CANDIDATES.length,
        hasMore: false,
    },
    meta: createMeta(0),
};

// Simple pagination helper that slices the in-memory array according to page and pageSize.
const paginate = <T,>(items: T[], page = 1, pageSize = items.length): PagedResult<T> => {
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const start = (safePage - 1) * safePageSize;
    const pageItems = items.slice(start, start + safePageSize);

    return {
        items: pageItems,
        total: items.length,
        page: safePage,
        pageSize: safePageSize,
        hasMore: start + pageItems.length < items.length,
    };
};

// Wrap a payload in a simulated network request. Honors `delayMs` and `shouldFail`
// from `MockRequestOptions` so callers can exercise error and latency handling.
const withRequest = async <T>(payload: T, options?: MockRequestOptions): Promise<ApiResponse<T>> => {
    const delayMs = options?.delayMs ?? 450;
    await mockDelay(delayMs);

    if (options?.shouldFail) {
        return toFailure(delayMs, options.errorMessage ?? "The mock API request failed.");
    }

    return {
        ok: true,
        data: payload,
        meta: createMeta(delayMs),
    };
};

// API: Fetch a paged list of users. Returns `ApiResponse<PagedResult<User>>`.
export const fetchUsers = async (options?: MockRequestOptions) => {
    return withRequest(paginate(MOCK_USERS), options);
};

// API: Fetch a single user by id. Fails with a standardized error if not found.
export const fetchUserById = async (userId: number, options?: MockRequestOptions) => {
    const user = MOCK_USERS.find((item) => item.id === userId);

    if (!user) {
        return withRequest(undefined as never, {
            ...options,
            shouldFail: true,
            errorMessage: `User ${userId} was not found.`,
        });
    }

    return withRequest(user, options);
};

// API: Fetch posts with optional filtering, searching and pagination support.
export const fetchPosts = async (options: PostQueryOptions = {}) => {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 6;
    const search = options.search ? normalize(options.search) : "";

    const filtered = MOCK_POSTS.filter((post) => {
        if (options.postType && post.postType !== options.postType) {
            return false;
        }

        if (options.status && post.status !== options.status) {
            return false;
        }

        if (options.employerId && post.employerId !== options.employerId) {
            return false;
        }

        if (options.category && post.category !== options.category) {
            return false;
        }

        if (!search) {
            return true;
        }

        const haystack = normalize([
            post.title,
            post.category,
            post.location,
            post.description,
            post.tags.join(" "),
        ].join(" "));

        return haystack.includes(search);
    });

    return withRequest(paginate(filtered, page, pageSize), options);
};

// API: Fetch a single post by id. Returns failure if not found.
export const fetchPostById = async (postId: number, options?: MockRequestOptions) => {
    const post = MOCK_POSTS.find((item) => item.id === postId);

    if (!post) {
        return withRequest(undefined as never, {
            ...options,
            shouldFail: true,
            errorMessage: `Post ${postId} was not found.`,
        });
    }

    return withRequest(post, options);
};

// API: Fetch favourite candidates for an employer with filtering and search.
export const fetchFavouriteCandidates = async (options: FavouriteCandidateQueryOptions = {}) => {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 6;
    const search = options.search ? normalize(options.search) : "";

    const filtered = MOCK_FAVOURITE_CANDIDATES.filter((item) => {
        if (options.employerId && item.employerId !== options.employerId) {
            return false;
        }

        if (options.status && item.status !== options.status) {
            return false;
        }

        if (options.candidateId && item.candidateId !== options.candidateId) {
            return false;
        }

        if (!search) {
            return true;
        }

        const user = MOCK_USERS.find((candidate) => candidate.id === item.candidateId);
        const haystack = normalize([
            user?.fullName ?? "",
            user?.skills.join(" ") ?? "",
            item.note,
            item.matchedSkills.join(" "),
        ].join(" "));

        return haystack.includes(search);
    });

    return withRequest(paginate(filtered, page, pageSize), options);
};

// API: Save a new favourite candidate. Returns the created record (with id and savedAt).
export const saveFavouriteCandidate = async (candidate: Omit<FavouriteCandidate, "id" | "savedAt">, options?: MockRequestOptions) => {
    const nextCandidate: FavouriteCandidate = {
        ...candidate,
        id: MOCK_FAVOURITE_CANDIDATES.length + 1,
        savedAt: new Date().toISOString(),
    };

    return withRequest(nextCandidate, options);
};

// API: Update a post's status. Returns the updated post or a failure if not found.
export const updatePostStatus = async (postId: number, status: PostStatus, options?: MockRequestOptions) => {
    const updatedPost = MOCK_POSTS.find((item) => item.id === postId);

    if (!updatedPost) {
        return withRequest(undefined as never, {
            ...options,
            shouldFail: true,
            errorMessage: `Unable to update post ${postId}.`,
        });
    }

    return withRequest({ ...updatedPost, status }, options);
};

// API: Delete a favourite candidate by id. Returns `{ deleted: true, id }` on success.
export const deleteFavouriteCandidate = async (id: number, options?: MockRequestOptions) => {
    const existing = MOCK_FAVOURITE_CANDIDATES.find((item) => item.id === id);

    if (!existing) {
        return withRequest(undefined as never, {
            ...options,
            shouldFail: true,
            errorMessage: `Favourite candidate ${id} was not found.`,
        });
    }

    return withRequest({ deleted: true, id }, options);
};

const getReportDisplayName = (report: ReportRecord) => {
    if (report.targetType === "post" && report.postId) {
        const post = MOCK_POSTS.find((item) => item.id === report.postId);
        return post?.title ?? `Post #${report.postId}`;
    }

    if (report.targetType === "user" && report.userId) {
        const user = MOCK_USERS.find((item) => item.id === report.userId);
        return user?.fullName ?? `User #${report.userId}`;
    }

    return "Unknown target";
};

// API: Fetch reported posts or users with filtering and search.
export const fetchReports = async (options: ReportQueryOptions = {}) => {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 20;
    const search = options.search ? normalize(options.search) : "";

    const filtered = MOCK_REPORTS.filter((item) => {
        if (options.targetType && item.targetType !== options.targetType) {
            return false;
        }

        if (options.status && item.status !== options.status) {
            return false;
        }

        if (!search) {
            return true;
        }

        const haystack = normalize([
            getReportDisplayName(item),
            item.summary,
        ].join(" "));

        return haystack.includes(search);
    });

    return withRequest(paginate(filtered, page, pageSize), options);
};

// API: Update a report's moderation status or ban flag.
export const updateReport = async (
    id: number,
    updates: Partial<Pick<ReportRecord, "status" | "isBanned">>,
    options?: MockRequestOptions
) => {
    const index = MOCK_REPORTS.findIndex((item) => item.id === id);

    if (index === -1) {
        return withRequest(undefined as never, {
            ...options,
            shouldFail: true,
            errorMessage: `Report ${id} was not found.`,
        });
    }

    MOCK_REPORTS[index] = { ...MOCK_REPORTS[index], ...updates };

    return withRequest(MOCK_REPORTS[index], options);
};

export const mockApiExamples = {
    users: MOCK_USERS_RESPONSE,
    posts: MOCK_POSTS_RESPONSE,
    favouriteCandidates: MOCK_FAVOURITE_CANDIDATES_RESPONSE,
};
