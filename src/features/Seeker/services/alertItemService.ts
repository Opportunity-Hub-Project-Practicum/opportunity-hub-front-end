import { apiRequest } from "../../../services/apiClient";
import { fetchLookupValues } from "../../../services/lookupValueService";
import type {
    AlertItemApi,
    AlertItemResponse,
    AlertItemsResponse,
    AlertPostCardItem,
    AlertItemType,
    CreateAlertItemPayload,
    DeleteAlertItemResponse,
    SyncAlertItemPayload,
    SyncAlertItemsResponse,
    UpdateAlertItemPayload,
} from "../types/alertItem";
import {
    buildAlertCriteria,
    criterionToSearchParams,
    dedupePostsById,
    filterPostsMatchingAnyCriterion,
} from "../lib/alertItemMatching";
import { fetchSearchPosts } from "../lib/searchPosts";
import type { LookupValuesByType } from "../../../types/lookupValue";
import type { PublicPostApi } from "../types/post";
import {
    formatClosedDate,
    formatPostSalary,
    formatWorkPlaceType,
} from "./postApiService";
import { getPostLookupName } from "../lib/postLookup";

export async function fetchAlertItems(): Promise<AlertItemApi[]> {
    const response = await apiRequest<AlertItemsResponse>("/seeker/alert-items");
    return response.alert_items;
}

export async function createAlertItem(payload: CreateAlertItemPayload): Promise<AlertItemApi> {
    const response = await apiRequest<AlertItemResponse>("/seeker/alert-items", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return response.alert_item;
}

export async function updateAlertItem(
    alertItemUuid: string,
    payload: UpdateAlertItemPayload,
): Promise<AlertItemApi> {
    const response = await apiRequest<AlertItemResponse>(`/seeker/alert-items/${alertItemUuid}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return response.alert_item;
}

export async function deleteAlertItem(alertItemUuid: string): Promise<void> {
    await apiRequest<DeleteAlertItemResponse>(`/seeker/alert-items/${alertItemUuid}`, {
        method: "DELETE",
    });
}

export async function syncAlertItems(items: SyncAlertItemPayload[]): Promise<AlertItemApi[]> {
    const response = await apiRequest<SyncAlertItemsResponse>("/seeker/alert-items/sync", {
        method: "PUT",
        body: JSON.stringify({ items }),
    });
    return response.alert_items;
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
    const { jobItems } = await fetchAlertPageData();
    return jobItems;
}

export async function fetchVolunteerAlertPostCards(): Promise<AlertPostCardItem[]> {
    const { volunteerItems } = await fetchAlertPageData();
    return volunteerItems;
}

export type AlertPageData = {
    jobItems: AlertPostCardItem[];
    volunteerItems: AlertPostCardItem[];
    alertItems: AlertItemApi[];
};

export async function fetchAlertPageData(): Promise<AlertPageData> {
    const [alertItems, lookupValues] = await Promise.all([
        fetchAlertItems(),
        fetchLookupValues(),
    ]);

    const [jobItems, volunteerItems] = await Promise.all([
        buildAlertPostCards("job", alertItems, lookupValues),
        buildAlertPostCards("volunteer", alertItems, lookupValues),
    ]);

    return { jobItems, volunteerItems, alertItems };
}

async function buildAlertPostCards(
    alertType: AlertItemType,
    alertItems: AlertItemApi[],
    lookupValues: LookupValuesByType,
): Promise<AlertPostCardItem[]> {
    const criteria = buildAlertCriteria(alertItems, alertType, lookupValues);

    if (criteria.length === 0) {
        return [];
    }

    const searchResults = await Promise.all(
        criteria.map((criterion) => fetchSearchPosts(criterionToSearchParams(criterion, alertType))),
    );

    const candidatePosts = dedupePostsById(searchResults.flat());
    const matchedPosts = filterPostsMatchingAnyCriterion(candidatePosts, criteria);

    return matchedPosts.map(toAlertPostCardItem);
}
