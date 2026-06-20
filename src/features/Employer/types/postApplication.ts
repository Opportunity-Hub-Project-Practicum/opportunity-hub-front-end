export type WorkPlaceType = "remote" | "onsite" | "hybrid";
export type PostDuration = "one-time" | "short-term" | "long-term";
export type PostSchedule = "weekdays" | "weekend" | "flexible";

export type CreateEmployerPostPayload = {
    type: "job" | "volunteer";
    post_title: string;
    post_description?: string | null;
    responsibility?: string | null;
    work_place_type?: WorkPlaceType | null;
    location_id?: number | null;
    duration?: PostDuration | null;
    schedule?: PostSchedule | null;
    hours_per_week?: string | null;
    benefits?: string[] | null;
    language?: string | null;
    closed_date?: string | null;
    min_salary?: number | null;
    max_salary?: number | null;
    job_type?: string | null;
    job_education?: string | null;
    job_experience?: string | null;
    job_requirement?: string | null;
    job_level?: string | null;
    job_role_id?: number | null;
    is_urgent?: boolean;
};

export type CreatedEmployerPost = {
    post_id: number;
    uuid: string;
    type: "job" | "volunteer";
    post_title: string;
};

export type CreateEmployerPostResponse = {
    message: string;
    post: CreatedEmployerPost;
};

export interface JobPostSubmitPayload {
    title: string;
    jobType: string;
    minSalary: number | null;
    maxSalary: number | null;
    education: string;
    experience: string;
    workPlaceType: WorkPlaceType | "";
    expirationDate: string;
    jobLevel: string;
    locationId: number | null;
    jobRoleId: number | null;
    description: string;
    responsibilities: string;
    jobRequirements: string;
    isUrgent: boolean;
}

export interface VolunteerPostSubmitPayload {
    title: string;
    jobRoleId: number | null;
    locationId: number | null;
    duration: PostDuration | "";
    volunteerPlaceType: string;
    schedule: PostSchedule | "";
    hoursPerWeek: string;
    benefits: string[];
    language: string;
    description: string;
    responsibilities: string;
    volunteerRequirements: string;
    expirationDate: string;
    isUrgent: boolean;
}
