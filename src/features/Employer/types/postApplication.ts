export type WorkPlaceType = "remote" | "onsite" | "hybrid";
export type PostDuration = "one-time" | "short-term" | "long-term";
export type PostSchedule = "weekdays" | "weekend" | "flexible";
export type JobLevel = "entry_level" | "mid_level" | "expert_level";

export type CreateEmployerPostPayload = {
    type: "job" | "volunteer";
    post_title: string;
    post_description?: string | null;
    responsibility?: string | null;
    work_place_type?: WorkPlaceType | null;
    location?: string | null;
    duration?: PostDuration | null;
    schedule?: PostSchedule | null;
    hours_per_week?: number | null;
    benefits?: string[] | null;
    language?: string | null;
    closed_date?: string | null;
    min_salary?: number | null;
    max_salary?: number | null;
    job_role?: string | null;
    job_education?: string | null;
    job_experience?: string | null;
    job_level?: JobLevel | null;
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
    jobRole: string;
    minSalary: number | null;
    maxSalary: number | null;
    education: string;
    experience: string;
    jobType: string;
    expirationDate: string;
    jobLevel: JobLevel | "";
    location: string;
    description: string;
    responsibilities: string;
}

export interface VolunteerPostSubmitPayload {
    title: string;
    duration: PostDuration | "";
    volunteerPlaceType: string;
    schedule: PostSchedule | "";
    hoursPerWeek: number | null;
    benefits: string[];
    languages: string[];
    description: string;
    responsibilities: string;
}
