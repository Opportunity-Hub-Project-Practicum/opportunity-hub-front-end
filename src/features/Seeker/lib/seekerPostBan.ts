import type { ApplicationStatus } from "../types/application";

export const BANNED_POST_STATUS_LABEL = "Post got banned";

export function isPostBannedForSeeker(isBanned?: boolean): boolean {
    return Boolean(isBanned);
}

export function formatSeekerApplicationStatus(
    status: ApplicationStatus,
    postIsBanned: boolean,
): string {
    if (postIsBanned) {
        return BANNED_POST_STATUS_LABEL;
    }

    switch (status) {
        case "pending":
            return "Pending";
        case "hired":
            return "Hired";
        case "rejected":
            return "Rejected";
        default: {
            const _exhaustive: never = status;
            return _exhaustive;
        }
    }
}

export function seekerApplicationStatusClassName(
    status: ApplicationStatus,
    postIsBanned: boolean,
): string {
    if (postIsBanned) {
        return "text-red-600";
    }

    switch (status) {
        case "hired":
            return "text-green-600";
        case "rejected":
            return "text-red-600";
        case "pending":
            return "text-amber-600";
        default: {
            const _exhaustive: never = status;
            return _exhaustive;
        }
    }
}
