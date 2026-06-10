export type ManagementColumnApi = {
    column_id: number;
    column_name: string;
    is_default_system: boolean;
    sort_order: number;
    created_at: string | null;
    updated_at: string | null;
};

export type ManagementColumnsResponse = {
    columns: ManagementColumnApi[];
};

export type CreateManagementColumnResponse = {
    message: string;
    column: ManagementColumnApi;
};

export type UpdateManagementColumnResponse = {
    message: string;
    column: ManagementColumnApi;
};
