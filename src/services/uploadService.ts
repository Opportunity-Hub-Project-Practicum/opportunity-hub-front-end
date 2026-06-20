import { API_BASE_URL, ApiError, getAccessToken } from "./apiClient";

export type UploadDirectory = "logos" | "profiles" | "resumes" | "cv";

export type UploadedPicture = {
    uuid: string;
    filename: string;
    gcs_url: string;
    created_at: string | null;
};

export type UploadResponse = {
    message: string;
    path: string;
    url: string;
    // Present only when the uploaded file is an image (jpg/jpeg/png/gif/webp);
    // null for non-image uploads such as resumes/cv documents.
    picture: UploadedPicture | null;
};

async function parseUploadResponse(response: Response): Promise<UploadResponse> {
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
            (text || `Upload failed with status ${response.status}`);
        throw new ApiError(response.status, message, payload?.errors);
    }

    return data as UploadResponse;
}

export async function uploadFile(
    file: globalThis.File,
    directory: UploadDirectory,
): Promise<UploadResponse> {
    if (!API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is not configured.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("directory", directory);

    const headers = new Headers();
    headers.set("Accept", "application/json");

    const token = getAccessToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
        method: "POST",
        headers,
        body: formData,
    });

    return parseUploadResponse(response);
}
