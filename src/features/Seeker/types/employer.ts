export type PublicEmployerApi = {
    user_id: number;
    uuid: string;
    company_name: string;
    logo_img: string | null;
    organization_type: string | null;
    industry_type: string | null;
    open_posts_count?: number;
};

export type PublicEmployerDetailApi = PublicEmployerApi & {
    about_us: string | null;
    team_size: number | null;
    year_establishment: number | null;
    company_web_link: string | null;
    company_vision: string | null;
    company_phone_number: string | null;
    company_email: string | null;
    social_link: string | null;
};

export type EmployerContactApi = {
    contact_id: number;
    uuid: string;
    category: "phone" | "social_media" | "website";
    label: string;
    value: string;
};

export type PublicEmployersResponse = {
    employers: PublicEmployerApi[];
};

export type PublicEmployerResponse = {
    profile: PublicEmployerDetailApi;
};

export type PublicEmployerContactsResponse = {
    contacts: EmployerContactApi[];
};
