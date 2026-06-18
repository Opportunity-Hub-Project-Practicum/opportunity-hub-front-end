import type { PostListCardItem } from "../services/postApiService";

export type PostListSortOption = "latest" | "urgent-first";

export function sortPostListItems(
    items: PostListCardItem[],
    sortBy: PostListSortOption,
): PostListCardItem[] {
    if (sortBy !== "urgent-first") {
        return items;
    }

    return [...items].sort((left, right) => {
        if (left.isUrgent === right.isUrgent) {
            return 0;
        }

        return left.isUrgent ? -1 : 1;
    });
}
