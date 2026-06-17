/**
 * Body for POST /api/v1/auth/register with role "employer".
 * Field names match RegisterRequest on the backend.
 */
export interface EmployerRegisterPayload {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: "employer";
    company_name: string;
    company_email: string;
    company_phone_number: string;
    logo_img?: string;
    about_us?: string;
    organization_type?: string;
    industry_type?: string;
    team_size?: number;
    year_establishment?: number;
    company_web_link?: string;
    company_vision?: string;
    map_location?: string;
    social_link?: string;
}
