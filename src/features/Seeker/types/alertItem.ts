export type AlertItemCategory = "job" | "volunteer";

export type AlertItemApi = {
    alert_item_id: number;
    uuid: string;
    setting_id: number;
    category: AlertItemCategory | null;
    role_name: string | null;
    location: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type AlertItemsResponse = {
    alert_items: AlertItemApi[];
};

export type AlertCriterion = {
    roleName: string | null;
    location: string | null;
};

export type AlertPostCardItem = {
    postId: number;
    postType: "job" | "volunteer";
    organizationName: string;
    title: string;
    engagementType: string;
    location: string;
    salary: string;
    remainingDays: string;
    image: string;
};
