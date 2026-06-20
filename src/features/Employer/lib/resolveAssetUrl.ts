import { API_BASE_URL } from "../../../services/apiClient";

export function resolveAssetUrl(path: string | null | undefined): string {
    if (!path) {
        return "";
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `${API_BASE_URL}/storage/${path.replace(/^\//, "")}`;
}
