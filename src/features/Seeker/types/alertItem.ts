export type AlertItemType = "job" | "volunteer";

export type AlertItemApi = {
    alert_item_id: number;
    uuid: string;
    setting_id: number;
    type: AlertItemType | null;
    role_name: string | null;
    location: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type AlertItemsResponse = {
    alert_items: AlertItemApi[];
};

export type AlertItemResponse = {
    message: string;
    alert_item: AlertItemApi;
};

export type DeleteAlertItemResponse = {
    message: string;
};

export type SyncAlertItemsResponse = {
    message: string;
    alert_items: AlertItemApi[];
};

export type AlertCriterion = {
    /** Lookup value slug used for API filters and post matching; null = wildcard */
    roleFilter: string | null;
    /** Lookup value slug used for API filters and post matching; null = wildcard */
    locationFilter: string | null;
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

export type AlertItemPayload = {
    type: AlertItemType;
    role_name?: string | null;
    location?: string | null;
};

export type SyncAlertItemPayload = AlertItemPayload;

export type CreateAlertItemPayload = AlertItemPayload;

export type UpdateAlertItemPayload = {
    type?: AlertItemType;
    role_name?: string | null;
    location?: string | null;
};

export type AlertSelectionState = {
    categories: string[];
    locations: string[];
};

export type AlertItemsFormState = {
    job: AlertSelectionState;
    volunteer: AlertSelectionState;
};
