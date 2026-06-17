export type ApplicationStatus = "pending" | "rejected" | "hired";

export type ApplicationApi = {
    application_id: number;
    uuid: string;
    post_id: number;
    post_uuid: string | null;
    post_title: string | null;
    employer_name: string | null;
    post_is_ban?: boolean;
    status: ApplicationStatus;
    submission_date: string | null;
    cv_resume_file: string | null;
    current_column: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type ApplicationsResponse = {
    applications: ApplicationApi[];
};

export type AppliedCardItem = {
    applicationId: number;
    postId: number;
    postType: "job" | "volunteer";
    organizationName: string;
    title: string;
    workPlaceType: string;
    location: string;
    salary: string;
    appliedDate: string;
    status: ApplicationStatus;
    postIsBanned: boolean;
    image: string;
};
