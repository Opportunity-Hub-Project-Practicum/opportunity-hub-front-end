import type { LookupValuesByType, LookupValuesResponse } from "../types/lookupValue";
import { apiRequest } from "./apiClient";

export async function fetchLookupValues(): Promise<LookupValuesByType> {
    const response = await apiRequest<LookupValuesResponse>(
        "/lookup-values",
        {},
        { auth: false },
    );

    return response.data;
}
