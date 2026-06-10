export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(status: number, message: string, errors?: Record<string, string[]>) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}

function normalizeBaseUrl(): string {
    const raw = import.meta.env.VITE_API_BASE_URL ?? "";
    return raw.replace(/[;\s]+$/g, "").replace(/\/+$/g, "");
}

export const API_BASE_URL = normalizeBaseUrl();

export function getAccessToken(): string | null {
    return localStorage.getItem("access_token");
}

export function setAccessToken(token: string | null): void {
    if (token) {
        localStorage.setItem("access_token", token);
    } else {
        localStorage.removeItem("access_token");
    }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    let data: unknown = null;

    if (text) {
        try {
            data = JSON.parse(text) as unknown;
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const payload = data as { message?: string; errors?: Record<string, string[]> } | null;
        const message =
            payload?.message ??
            (text || `Request failed with status ${response.status}`);
        throw new ApiError(response.status, message, payload?.errors);
    }

    return data as T;
}

export async function apiRequest<T>(
    path: string,
    init: RequestInit = {},
    options: { auth?: boolean } = {},
): Promise<T> {
    if (!API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is not configured.");
    }

    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");

    if (!headers.has("Content-Type") && init.body) {
        headers.set("Content-Type", "application/json");
    }

    const useAuth = options.auth !== false;
    const token = getAccessToken();
    if (useAuth && token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
        ...init,
        headers,
    });

    return parseJsonResponse<T>(response);
}

export function formatApiError(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.errors) {
            const firstField = Object.values(error.errors)[0];
            if (firstField?.[0]) {
                return firstField[0];
            }
        }
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong. Please try again.";
}
