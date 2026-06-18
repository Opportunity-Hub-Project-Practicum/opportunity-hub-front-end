import type {
    AuthResponse,
    AuthUser,
    MeResponse,
    MessageResponse,
    RoleChangeRequestResponse,
    UpdateAccountPayload,
    UpdateAccountResponse,
} from "../types/auth";
import type { EmployerRegisterPayload } from "../features/Employer/types/employerRegister";
import { toEmployerRegisterApiBody } from "../features/Employer/lib/buildEmployerRegisterPayload";
import { apiRequest, setAccessToken } from "./apiClient";

export interface RegisterPayload {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: "seeker";
    [key: string]: unknown;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RoleChangeRequestPayload {
    company_name: string;
    company_email: string;
    company_phone_number: string;
    reason?: string;
    logo_img?: string;
    about_us?: string;
    organization_type?: string;
    industry_type?: string;
    team_size?: number;
    year_establishment?: number;
    company_web_link?: string;
    company_vision?: string;
    social_link?: string[];
    map_location?: string;
}

const AUTH_USER_KEY = "auth_user";
const USER_ROLE_KEY = "userRole";

export function persistAuthSession(accessToken: string, user: AuthUser): void {
    setAccessToken(accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(USER_ROLE_KEY, user.role);
}

export function clearAuthSession(): void {
    setAccessToken(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
}

export function getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    }, { auth: false });

    if (data.access_token) {
        persistAuthSession(data.access_token, data.user);
    }

    return data;
}

export async function registerEmployer(
    payload: EmployerRegisterPayload,
): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(toEmployerRegisterApiBody(payload)),
    }, { auth: false });

    if (data.access_token) {
        persistAuthSession(data.access_token, data.user);
    }

    return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    }, { auth: false });

    if (data.access_token) {
        persistAuthSession(data.access_token, data.user);
    }

    return data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
    const data = await apiRequest<MeResponse>("/auth/me");
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(USER_ROLE_KEY, data.user.role);
    return data.user;
}

export async function updateAccount(payload: UpdateAccountPayload): Promise<AuthUser> {
    const data = await apiRequest<UpdateAccountResponse>("/auth/me", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(USER_ROLE_KEY, data.user.role);
    return data.user;
}

export async function logout(): Promise<void> {
    try {
        await apiRequest<MessageResponse>("/auth/logout", { method: "POST" });
    } finally {
        clearAuthSession();
    }
}

export async function deleteAccount(): Promise<MessageResponse> {
    const data = await apiRequest<MessageResponse>("/auth/me", {
        method: "DELETE",
    });
    clearAuthSession();
    return data;
}

export async function submitRoleChangeRequest(
    payload: RoleChangeRequestPayload,
): Promise<RoleChangeRequestResponse> {
    return apiRequest<RoleChangeRequestResponse>("/role-change-requests", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    }, { auth: false });
}
