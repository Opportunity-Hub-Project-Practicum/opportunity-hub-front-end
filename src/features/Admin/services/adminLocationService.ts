import { apiRequest } from "../../../services/apiClient";
import type {
    AdminLocationApi,
    AdminLocationResponse,
    AdminLocationsResponse,
} from "../types/adminValue";

export async function fetchAdminLocations(): Promise<AdminLocationApi[]> {
    const response = await apiRequest<AdminLocationsResponse>("/admin/locations");
    return response.locations;
}

export async function createAdminLocation(name: string): Promise<AdminLocationApi> {
    const response = await apiRequest<AdminLocationResponse>("/admin/locations", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
    return response.location;
}

export async function updateAdminLocation(
    locationId: number,
    name: string,
): Promise<AdminLocationApi> {
    const response = await apiRequest<AdminLocationResponse>(`/admin/locations/${locationId}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
    });
    return response.location;
}

export async function deleteAdminLocation(locationId: number): Promise<void> {
    await apiRequest<{ message: string }>(`/admin/locations/${locationId}`, {
        method: "DELETE",
    });
}
