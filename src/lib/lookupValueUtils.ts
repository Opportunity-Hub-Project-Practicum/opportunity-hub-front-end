import type { LookupValueItem } from "../types/lookupValue";

export function resolveLookupStoredValue(
    stored: string,
    options: LookupValueItem[],
): string {
    const trimmed = stored.trim();
    if (!trimmed) {
        return "";
    }

    const exact = options.find((option) => option.name === trimmed || option.value === trimmed);
    if (exact) {
        return exact.name;
    }

    const lower = trimmed.toLowerCase();
    const caseInsensitive = options.find(
        (option) => option.name.toLowerCase() === lower || option.value.toLowerCase() === lower,
    );
    return caseInsensitive?.name ?? trimmed;
}

export function resolveLookupNameToValue(
    stored: string | null | undefined,
    options: LookupValueItem[],
): string | null {
    const trimmed = stored?.trim();
    if (!trimmed) {
        return null;
    }

    const exact = options.find((option) => option.name === trimmed || option.value === trimmed);
    if (exact) {
        return exact.value;
    }

    const lower = trimmed.toLowerCase();
    const caseInsensitive = options.find(
        (option) => option.name.toLowerCase() === lower || option.value.toLowerCase() === lower,
    );

    return caseInsensitive?.value ?? trimmed;
}
