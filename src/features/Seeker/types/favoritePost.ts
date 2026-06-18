export type FavoritePostApi = {
    favorite_post_id: number;
    post_id: number;
    post_title: string | null;
    post_type: "job" | "volunteer" | null;
    employer_name: string | null;
    post_is_ban?: boolean;
    created_at: string | null;
};

export type FavoritePostsResponse = {
    favorites: FavoritePostApi[];
};

export type FavoriteCardItem = {
    favoritePostId: number;
    postId: number;
    postType: "job" | "volunteer";
    organizationName: string;
    title: string;
    engagementType: string;
    location: string;
    salary: string;
    remainingDays: string;
    image: string;
    postIsBanned: boolean;
    isUrgent: boolean;
};
