export type ApplicationStatus = "pending" | "rejected" | "hired";

export type EmployerApplicationApi = {
    application_id: number;
    uuid: string;
    seeker_id: number;
    seeker_uuid: string | null;
    seeker_name: string | null;
    seeker_email: string | null;
    post_id: number;
    post_uuid: string | null;
    status: ApplicationStatus;
    submission_date: string | null;
    cv_resume_file: string | null;
    current_column_id: number | null;
    current_column: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type EmployerApplicationsResponse = {
    applications: EmployerApplicationApi[];
};

export type UpdateEmployerApplicationStatusPayload = {
    status: ApplicationStatus;
    current_column_id?: number | null;
};

export type UpdateEmployerApplicationStatusResponse = {
    message: string;
    application: EmployerApplicationApi;
};

export type KanbanApplication = {
    id: string;
    applicationId: number;
    userName: string;
    role: string;
    appliedDate: string;
    url_Cv: string;
    image?: string;
    status: ApplicationStatus;
    seekerId: number;
    seekerUuid: string | null;
    seekerEmail: string | null;
    raw: EmployerApplicationApi;
};

export type KanbanColumn = {
    id: string;
    name: string;
    fixed: boolean;
    columnId?: number;
};
