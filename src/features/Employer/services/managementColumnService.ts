import { apiRequest } from "../../../services/apiClient";
import type {
    CreateManagementColumnResponse,
    ManagementColumnApi,
    ManagementColumnsResponse,
    UpdateManagementColumnResponse,
} from "../types/managementColumn";

export async function fetchManagementColumns(): Promise<ManagementColumnApi[]> {
    const response = await apiRequest<ManagementColumnsResponse>("/employer/management-columns");
    return response.columns;
}

export async function createManagementColumn(columnName: string): Promise<ManagementColumnApi> {
    const response = await apiRequest<CreateManagementColumnResponse>("/employer/management-columns", {
        method: "POST",
        body: JSON.stringify({ column_name: columnName }),
    });
    return response.column;
}

export async function updateManagementColumn(
    columnId: number,
    columnName: string,
): Promise<ManagementColumnApi> {
    const response = await apiRequest<UpdateManagementColumnResponse>(
        `/employer/management-columns/${columnId}`,
        {
            method: "PUT",
            body: JSON.stringify({ column_name: columnName }),
        },
    );
    return response.column;
}

export async function deleteManagementColumn(columnId: number): Promise<void> {
    await apiRequest<{ message: string }>(`/employer/management-columns/${columnId}`, {
        method: "DELETE",
    });
}
