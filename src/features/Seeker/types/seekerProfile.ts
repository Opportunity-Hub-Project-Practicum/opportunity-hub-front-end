export interface SeekerContactApi {
    contact_id: number;
    category: "phone" | "social" | "web_url";
    label: string;
    value: string;
}

export interface SeekerEducationApi {
    education_id: number;
    institution_name: string;
    degree: string;
    area_of_study: string | null;
    location: string;
    country: string;
    start_date: string;
    end_date: string | null;
}

export interface SeekerWorkExperienceApi {
    experience_id: number;
    company_name: string;
    job_title: string;
    job_role: string;
    year_of_experience: number;
    industry: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
    description: string | null;
}

export interface SeekerNotifySettingApi {
    setting_id: number;
    seeker_id: number;
    notify_on_shortlist: boolean;
    notify_on_reject: boolean;
    notify_on_hire: boolean;
    notify_on_opportunities: boolean;
}

export interface SeekerProfileApi {
    user_id: number;
    full_name?: string | null;
    email?: string | null;
    profile_img: string | null;
    seeker_phone_number: string | null;
    birth_date: string | null;
    personal_web_url: string | null;
    gender: string | null;
    marital_status: string | null;
    biography: string | null;
    cv_resume: string | null;
    social_link: string | null;
    contacts?: SeekerContactApi[];
    educations?: SeekerEducationApi[];
    work_experiences?: SeekerWorkExperienceApi[];
    notify_setting?: SeekerNotifySettingApi | null;
}

export interface SeekerProfileResponse {
    profile: SeekerProfileApi;
}

export interface SeekerNotifySettingResponse {
    notify_setting: SeekerNotifySettingApi;
}

export interface UpdateSeekerProfilePayload {
    profile_img?: string | null;
    birth_date?: string | null;
    gender?: string | null;
    marital_status?: string | null;
    biography?: string | null;
    cv_resume?: string | null;
}

export interface UpdateSeekerNotifyPayload {
    notify_on_shortlist?: boolean;
    notify_on_reject?: boolean;
    notify_on_hire?: boolean;
    notify_on_opportunities?: boolean;
}
