export type PostLookupRef = {
    location_id?: number;
    job_role_id?: number;
    uuid?: string;
    value?: string;
    name: string;
};

export function normalizePostLookup(
    field: string | PostLookupRef | null | undefined,
): PostLookupRef | null {
    if (!field) {
        return null;
    }

    if (typeof field === "string") {
        return { name: field };
    }

    if (typeof field === "object" && typeof field.name === "string") {
        return field;
    }

    return null;
}

export function getPostLookupName(
    field: string | PostLookupRef | null | undefined,
): string {
    return normalizePostLookup(field)?.name ?? "";
}

export function getPostLookupValue(
    field: string | PostLookupRef | null | undefined,
): string {
    const ref = normalizePostLookup(field);

    if (!ref) {
        return "";
    }

    return ref.value ?? ref.name;
}

export function postMatchesLookupValue(
    field: string | PostLookupRef | null | undefined,
    selectedValue: string,
): boolean {
    if (!selectedValue.trim()) {
        return true;
    }

    const ref = normalizePostLookup(field);

    if (!ref) {
        return false;
    }

    const normalizedSelected = selectedValue.trim().toLowerCase();

    return (
        (ref.value?.toLowerCase() === normalizedSelected)
        || (ref.name.toLowerCase() === normalizedSelected)
    );
}
