import { resolveLookupNameToValue } from "../../../lib/lookupValueUtils";
import { LOOKUP_TYPES } from "../../../types/lookupValue";
import type { LookupValueItem, LookupValuesByType } from "../../../types/lookupValue";
import { postMatchesLookupValue } from "../lib/postLookup";
import type { SearchPostsParams } from "../lib/searchPosts";
import type { AlertCriterion, AlertItemApi, AlertItemType } from "../types/alertItem";
import type { PublicPostApi } from "../types/post";

function toCriterion(
    roleName: string | null | undefined,
    location: string | null | undefined,
    jobRoleOptions: LookupValueItem[],
    locationOptions: LookupValueItem[],
): AlertCriterion | null {
    const roleFilter = resolveLookupNameToValue(roleName, jobRoleOptions);
    const locationFilter = resolveLookupNameToValue(location, locationOptions);

    if (!roleFilter && !locationFilter) {
        return null;
    }

    return { roleFilter, locationFilter };
}

/**
 * Alert matching uses alert_items rows only.
 * Each row is AND(role, location) where an empty field is a wildcard.
 * A post is included when ANY row for the requested type matches.
 * Example: 2 categories x 2 locations => 4 rows; a post matching any row is shown once.
 */
export function buildAlertCriteria(
    alertItems: AlertItemApi[],
    alertType: AlertItemType,
    lookupValues: LookupValuesByType,
): AlertCriterion[] {
    const jobRoleOptions = lookupValues[LOOKUP_TYPES.jobRole] ?? [];
    const locationOptions = lookupValues[LOOKUP_TYPES.location] ?? [];
    const criteria: AlertCriterion[] = [];

    for (const item of alertItems) {
        if (item.type != null && item.type !== alertType) {
            continue;
        }

        const criterion = toCriterion(item.role_name, item.location, jobRoleOptions, locationOptions);
        if (criterion) {
            criteria.push(criterion);
        }
    }

    return criteria;
}

export function criterionToSearchParams(
    criterion: AlertCriterion,
    alertType: AlertItemType,
): SearchPostsParams {
    const params: SearchPostsParams = { type: alertType };

    if (criterion.roleFilter) {
        params.job_role = criterion.roleFilter;
    }

    if (criterion.locationFilter) {
        params.location = criterion.locationFilter;
    }

    return params;
}

export function postMatchesCriterion(post: PublicPostApi, criterion: AlertCriterion): boolean {
    const roleMatch = postMatchesLookupValue(post.job_role, criterion.roleFilter ?? "");
    const locationMatch = postMatchesLookupValue(post.location, criterion.locationFilter ?? "");

    return roleMatch && locationMatch;
}

export function dedupePostsById(posts: PublicPostApi[]): PublicPostApi[] {
    const uniquePosts = new Map<number, PublicPostApi>();

    for (const post of posts) {
        uniquePosts.set(post.post_id, post);
    }

    return Array.from(uniquePosts.values());
}

export function filterPostsMatchingAnyCriterion(
    posts: PublicPostApi[],
    criteria: AlertCriterion[],
): PublicPostApi[] {
    return posts.filter((post) => criteria.some((criterion) => postMatchesCriterion(post, criterion)));
}
