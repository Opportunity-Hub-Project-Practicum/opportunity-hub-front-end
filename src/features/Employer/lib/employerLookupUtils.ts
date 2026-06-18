import { resolveLookupNameToValue, resolveLookupStoredValue } from "../../../lib/lookupValueUtils";
import type { LookupValueItem, LookupValuesByType } from "../../../types/lookupValue";
import { LOOKUP_TYPES } from "../../../types/lookupValue";

const TEAM_SIZE_VALUE_TO_NUMBER: Record<string, number> = {
    "1-10-employees": 10,
    "11-50-employees": 50,
    "51-200-employees": 200,
    "201-500-employees": 500,
    "501-1000-employees": 1000,
    "1001-5000-employees": 5000,
    "5001-10000-employees": 10000,
    "10000-plus-employees": 10000,
};

const TEAM_SIZE_NUMBERS = Object.entries(TEAM_SIZE_VALUE_TO_NUMBER)
    .map(([value, max]) => ({ value, max }))
    .sort((left, right) => left.max - right.max);

function parseOptionalInt(value: string): number | undefined {
    if (!value.trim()) {
        return undefined;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}

export function teamSizeLookupValueToNumber(value: string): number | undefined {
    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    if (TEAM_SIZE_VALUE_TO_NUMBER[trimmed] !== undefined) {
        return TEAM_SIZE_VALUE_TO_NUMBER[trimmed];
    }

    return parseOptionalInt(trimmed);
}

export function teamSizeNumberToLookupValue(number: number | null | undefined): string {
    if (number == null) {
        return "";
    }

    const match = TEAM_SIZE_NUMBERS.find((entry) => number <= entry.max);
    return match?.value ?? TEAM_SIZE_NUMBERS[TEAM_SIZE_NUMBERS.length - 1]?.value ?? "";
}

export function resolveEmployerLookupForApi(
    stored: string,
    options: LookupValueItem[],
): string | undefined {
    const trimmed = stored.trim();
    if (!trimmed) {
        return undefined;
    }

    return resolveLookupStoredValue(trimmed, options) || undefined;
}

export function resolveEmployerLookupForForm(
    stored: string | null | undefined,
    options: LookupValueItem[],
): string {
    return resolveLookupNameToValue(stored, options) ?? "";
}

export function normalizeEmployerLookupFields(
    data: {
        location: string;
        organizationType: string;
        industryType: string;
        teamSize: string;
    },
    lookupValues: LookupValuesByType | null,
): {
    location: string;
    organizationType: string;
    industryType: string;
    teamSize: string;
} {
    const locationOptions = lookupValues?.[LOOKUP_TYPES.location] ?? [];
    const organizationOptions = lookupValues?.[LOOKUP_TYPES.organizationType] ?? [];
    const industryOptions = lookupValues?.[LOOKUP_TYPES.industry] ?? [];
    const teamSizeOptions = lookupValues?.[LOOKUP_TYPES.teamSize] ?? [];

    const teamSizeFromNumber = parseOptionalInt(data.teamSize);
    const normalizedTeamSize = teamSizeFromNumber !== undefined
        ? teamSizeNumberToLookupValue(teamSizeFromNumber)
        : resolveEmployerLookupForForm(data.teamSize, teamSizeOptions);

    return {
        location: resolveEmployerLookupForForm(data.location, locationOptions),
        organizationType: resolveEmployerLookupForForm(data.organizationType, organizationOptions),
        industryType: resolveEmployerLookupForForm(data.industryType, industryOptions),
        teamSize: normalizedTeamSize || resolveEmployerLookupForForm(data.teamSize, teamSizeOptions),
    };
}
