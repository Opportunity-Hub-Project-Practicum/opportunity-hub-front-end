export type UserRole = "seeker" | "employer" | "admin";

export interface AuthUserProfile {
    [key: string]: unknown;
}

export interface AuthUser {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    role: UserRole;
    auth_provider: string;
    email_verified: boolean;
    email_verified_at: string | null;
    created_at: string | null;
    profile: AuthUserProfile | null;
}

export interface AuthResponse {
    message: string;
    token_type?: string;
    access_token?: string;
    user: AuthUser;
}

export interface MeResponse {
    user: AuthUser;
}

export interface MessageResponse {
    message: string;
}

export interface RoleChangeRequestResponse {
    message: string;
    request: {
        id: number;
        status: string;
        requested_role: string;
        company_name: string;
        [key: string]: unknown;
    };
}
