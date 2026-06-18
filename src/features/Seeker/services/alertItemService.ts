import { apiRequest } from "../../../services/apiClient";
import type { SeekerNotifySettingApi } from "../types/seekerProfile";
import type {
    AlertCriterion,
    AlertItemApi,
    AlertItemsResponse,
    AlertPostCardItem,
    AlertItemCategory,
} from "../types/alertItem";
import { getPostLookupName } from "../lib/postLookup";
import { fetchSearchPosts } from "../lib/searchPosts";
import type { PublicPostApi } from "../types/post";
import { fetchSeekerProfile } from "./seekerProfileService";
import {
    formatClosedDate,
    formatPostSalary,
    formatWorkPlaceType,
} from "./postApiService";

export async function fetchAlertItems(): Promise<AlertItemApi[]> {
    const response = await apiRequest<AlertItemsResponse>("/seeker/alert-items");
    return response.alert_items;
}

function toCriterion(
    roleName: string | null | undefined,
    location: string | null | undefined,
): AlertCriterion | null {
    const role = roleName?.trim() || null;
    const loc = location?.trim() || null;

    if (!role && !loc) {
        return null;
    }

    return { roleName: role, location: loc };
}

function buildAlertCriteria(
    alertItems: AlertItemApi[],
    notifySetting: SeekerNotifySettingApi | null | undefined,
    category: AlertItemCategory,
): AlertCriterion[] {
    const criteria: AlertCriterion[] = [];

    for (const item of alertItems) {
        if (item.category != null && item.category !== category) {
            continue;
        }

        const criterion = toCriterion(item.role_name, item.location);
        if (criterion) {
            criteria.push(criterion);
        }
    }

    if (notifySetting?.category === category) {
        const notifyCriterion = toCriterion(notifySetting.role_name, notifySetting.location);
        if (notifyCriterion) {
            criteria.push(notifyCriterion);
        }
    }

    return criteria;
}

function buildJobAlertCriteria(
    alertItems: AlertItemApi[],
    notifySetting: SeekerNotifySettingApi | null | undefined,
): AlertCriterion[] {
    return buildAlertCriteria(alertItems, notifySetting, "job");
}

function buildVolunteerAlertCriteria(
    alertItems: AlertItemApi[],
    notifySetting: SeekerNotifySettingApi | null | undefined,
): AlertCriterion[] {
    return buildAlertCriteria(alertItems, notifySetting, "volunteer");
}

function postMatchesCriterion(post: PublicPostApi, criterion: AlertCriterion): boolean {
    const roleQuery = criterion.roleName?.toLowerCase();
    const locationQuery = criterion.location?.toLowerCase();

    const roleHaystack = `${post.post_title} ${getPostLookupName(post.job_role)}`.toLowerCase();
    const locationHaystack = getPostLookupName(post.location).toLowerCase();

    const roleMatch = !roleQuery || roleHaystack.includes(roleQuery);
    const locationMatch = !locationQuery || locationHaystack.includes(locationQuery);

    return roleMatch && locationMatch;
}

function toAlertPostCardItem(post: PublicPostApi): AlertPostCardItem {
    return {
        postId: post.post_id,
        postType: post.type,
        organizationName: post.employer?.company_name ?? "Unknown",
        title: post.post_title,
        engagementType: formatWorkPlaceType(post.work_place_type ?? post.type),
        location: getPostLookupName(post.location),
        salary: formatPostSalary(post),
        remainingDays: formatClosedDate(post.closed_date),
        image: post.employer?.logo_img ?? "",
    };
}

export async function fetchJobAlertPostCards(): Promise<AlertPostCardItem[]> {
    return fetchAlertPostCards("job");
}

export async function fetchVolunteerAlertPostCards(): Promise<AlertPostCardItem[]> {
    return fetchAlertPostCards("volunteer");
}

async function fetchAlertPostCards(category: AlertItemCategory): Promise<AlertPostCardItem[]> {
    const [alertItems, profileResponse] = await Promise.all([
        fetchAlertItems(),
        fetchSeekerProfile(),
    ]);

    const criteria = category === "job"
        ? buildJobAlertCriteria(alertItems, profileResponse.profile.notify_setting)
        : buildVolunteerAlertCriteria(alertItems, profileResponse.profile.notify_setting);

    if (criteria.length === 0) {
        return [];
    }

    const searchResults = await Promise.all(
        criteria.map((criterion) => fetchSearchPosts({
            type: category,
            search: [criterion.roleName, criterion.location].filter(Boolean).join(" ") || undefined,
        })),
    );

    const uniquePosts = new Map<number, PublicPostApi>();
    for (const posts of searchResults) {
        for (const post of posts) {
            uniquePosts.set(post.post_id, post);
        }
    }

    const matchedPosts = Array.from(uniquePosts.values()).filter((post) =>
        criteria.some((criterion) => postMatchesCriterion(post, criterion)),
    );

    return matchedPosts.map(toAlertPostCardItem);
}
