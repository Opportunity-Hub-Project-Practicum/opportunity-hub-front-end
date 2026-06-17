export type AdminLocationApi = {
    location_id: number;
    uuid: string;
    name: string;
    created_at: string;
};

export type AdminJobRoleApi = {
    job_role_id: number;
    uuid: string;
    name: string;
    created_at: string;
};

export type AdminLocationsResponse = {
    locations: AdminLocationApi[];
};

export type AdminLocationResponse = {
    message?: string;
    location: AdminLocationApi;
};

export type AdminJobRolesResponse = {
    job_roles: AdminJobRoleApi[];
};

export type AdminJobRoleResponse = {
    message?: string;
    job_role: AdminJobRoleApi;
};

export type ManageValueFilter = "location" | "category";
