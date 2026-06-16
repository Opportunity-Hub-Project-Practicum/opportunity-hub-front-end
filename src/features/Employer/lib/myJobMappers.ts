import type { EmployerPostApi } from "../types/employerPost";
import type { UpdateEmployerPostPayload } from "../services/employerPostService";

export type ListingStatus = "Active" | "Expire";

export type ListingItem = {
    id: string;
    postId: number;
    postType: "job" | "volunteer";
    title: string;
    type: string;
    timeRemaining: string;
    status: ListingStatus;
    applicationsCount: number;
    closedDate: string | null;
};

const DURATION_LABELS: Record<string, string> = {
    "one-time": "One-time event",
    "short-term": "Short-term",
    "long-term": "Long-term",
};

function formatClosedDateLabel(closedDate: string): string {
    return new Date(closedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function isPostExpired(post: EmployerPostApi): boolean {
    if (post.post_status === "closed") {
        return true;
    }

    if (!post.closed_date) {
        return false;
    }

    const closing = new Date(post.closed_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    closing.setHours(0, 0, 0, 0);

    return closing < today;
}

export function resolveListingStatus(post: EmployerPostApi): ListingStatus {
    return isPostExpired(post) ? "Expire" : "Active";
}

export function formatTimeRemaining(post: EmployerPostApi, status: ListingStatus): string {
    if (!post.closed_date) {
        return "No closing date";
    }

    if (status === "Expire") {
        return formatClosedDateLabel(post.closed_date);
    }

    const closing = new Date(post.closed_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    closing.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return formatClosedDateLabel(post.closed_date);
    }

    if (diffDays === 1) {
        return "1 day remaining";
    }

    return `${diffDays} days remaining`;
}

function formatDurationLabel(post: EmployerPostApi): string {
    if (post.duration && DURATION_LABELS[post.duration]) {
        return DURATION_LABELS[post.duration];
    }

    if (post.hours_per_week) {
        return `${post.hours_per_week} hrs/week`;
    }

    if (post.work_place_type) {
        return post.work_place_type.charAt(0).toUpperCase() + post.work_place_type.slice(1);
    }

    return post.type === "job" ? "Job" : "Volunteer";
}

export function mapEmployerPostToListingItem(post: EmployerPostApi): ListingItem {
    const status = resolveListingStatus(post);

    return {
        id: String(post.post_id),
        postId: post.post_id,
        postType: post.type,
        title: post.post_title,
        type: formatDurationLabel(post),
        timeRemaining: formatTimeRemaining(post, status),
        status,
        applicationsCount: post.applications_count ?? 0,
        closedDate: post.closed_date,
    };
}

export function closedDateFromDaysOpen(days: number): string {
    const closingDate = new Date();
    closingDate.setDate(closingDate.getDate() + days);
    closingDate.setHours(23, 59, 59, 999);
    return closingDate.toISOString();
}

export function toApiClosedDate(dateValue: string): string {
    return new Date(`${dateValue}T23:59:59`).toISOString();
}

export function defaultDaysOpen(listing: ListingItem): number {
    if (!listing.closedDate) {
        return 30;
    }

    const closing = new Date(listing.closedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    closing.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 30;
}

export function defaultClosingDateInput(listing: ListingItem): string {
    if (listing.closedDate) {
        const closing = new Date(listing.closedDate);
        if (closing > new Date()) {
            return closing.toISOString().slice(0, 10);
        }
    }

    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 30);
    return fallback.toISOString().slice(0, 10);
}

export function buildPostOpenUntilPayload(closedDate: string): UpdateEmployerPostPayload {
    return {
        post_status: "open",
        closed_date: closedDate,
    };
}

export function buildPostClosePayload(): UpdateEmployerPostPayload {
    return { post_status: "closed" };
}

export function applyUpdatedPostToListings(
    listings: ListingItem[],
    updatedPost: EmployerPostApi,
): ListingItem[] {
    const updatedItem = mapEmployerPostToListingItem(updatedPost);

    return listings.map((item) =>
        item.postId === updatedPost.post_id ? updatedItem : item,
    );
}
