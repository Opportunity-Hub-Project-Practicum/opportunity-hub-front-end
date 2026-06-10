export type EmployerContactApi = {
    contact_id: number;
    uuid: string;
    category: "phone" | "social_media" | "website";
    label: string;
    value: string;
    created_at: string | null;
    updated_at: string | null;
};

export type EmployerProfileApi = {
    user_id: number;
    uuid: string;
    company_name: string;
    logo_img: string | null;
    about_us: string | null;
    organization_type: string | null;
    industry_type: string | null;
    team_size: number | null;
    year_establishment: number | null;
    company_web_link: string | null;
    company_vision: string | null;
    map_location: string | null;
    company_phone_number: string | null;
    company_email: string | null;
    social_link: string | null;
    is_ban: boolean;
    created_at: string | null;
    updated_at: string | null;
    contacts?: EmployerContactApi[];
};

export type EmployerProfileResponse = {
    profile: EmployerProfileApi;
};

export type EmployerContactsResponse = {
    contacts: EmployerContactApi[];
};

export type UpdateEmployerProfilePayload = {
    company_name?: string;
    logo_img?: string | null;
    about_us?: string | null;
    organization_type?: string | null;
    industry_type?: string | null;
    team_size?: number | null;
    year_establishment?: number | null;
    company_web_link?: string | null;
    company_vision?: string | null;
    map_location?: string | null;
    company_email?: string | null;
    company_phone_number?: string | null;
    social_link?: string | null;
};

export type CreateEmployerContactPayload = {
    category: "phone" | "social_media" | "website";
    label: string;
    value: string;
};

export type UpdateEmployerContactPayload = Partial<CreateEmployerContactPayload>;
