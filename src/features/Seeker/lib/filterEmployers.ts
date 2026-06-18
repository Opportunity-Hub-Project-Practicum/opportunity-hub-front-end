import { resolveLookupNameToValue } from "../../../lib/lookupValueUtils";
import type { LookupValueItem, LookupValuesByType } from "../../../types/lookupValue";
import { LOOKUP_TYPES } from "../../../types/lookupValue";
import type { PublicEmployerApi } from "../types/employer";

export type EmployerSearchFilters = {
    companyName: string;
    organizationType: string;
    industry: string;
    location: string;
};

export const EMPTY_EMPLOYER_SEARCH_FILTERS: EmployerSearchFilters = {
    companyName: "",
    organizationType: "",
    industry: "",
    location: "",
};

function matchesCompanyName(employer: PublicEmployerApi, companyName: string): boolean {
    const term = companyName.trim().toLowerCase();
    if (!term) {
        return true;
    }

    return employer.company_name.toLowerCase().includes(term);
}

function matchesOrganizationType(
    employer: PublicEmployerApi,
    organizationType: string,
    options: LookupValueItem[],
): boolean {
    if (!organizationType.trim()) {
        return true;
    }

    const employerType = resolveLookupNameToValue(employer.organization_type, options);
    return employerType === organizationType;
}

function matchesIndustry(
    employer: PublicEmployerApi,
    industry: string,
    options: LookupValueItem[],
): boolean {
    if (!industry.trim()) {
        return true;
    }

    const employerIndustry = resolveLookupNameToValue(employer.industry_type, options);
    return employerIndustry === industry;
}

function matchesLocation(
    employer: PublicEmployerApi,
    location: string,
    options: LookupValueItem[],
): boolean {
    if (!location.trim()) {
        return true;
    }

    const mapLocation = employer.map_location?.trim();
    if (!mapLocation) {
        return false;
    }

    const selected = options.find((option) => option.value === location);
    if (!selected) {
        return true;
    }

    const haystack = mapLocation.toLowerCase();
    return (
        haystack.includes(selected.name.toLowerCase())
        || haystack.includes(selected.value.replace(/-/g, " ").toLowerCase())
    );
}

export function filterPublicEmployers(
    employers: PublicEmployerApi[],
    filters: EmployerSearchFilters,
    lookupValues: LookupValuesByType | null,
): PublicEmployerApi[] {
    const organizationOptions = lookupValues?.[LOOKUP_TYPES.organizationType] ?? [];
    const industryOptions = lookupValues?.[LOOKUP_TYPES.industry] ?? [];
    const locationOptions = lookupValues?.[LOOKUP_TYPES.location] ?? [];

    return employers.filter((employer) =>
        matchesCompanyName(employer, filters.companyName)
        && matchesOrganizationType(employer, filters.organizationType, organizationOptions)
        && matchesIndustry(employer, filters.industry, industryOptions)
        && matchesLocation(employer, filters.location, locationOptions),
    );
}

export function hasActiveEmployerSearch(filters: EmployerSearchFilters): boolean {
    return Boolean(
        filters.companyName.trim()
        || filters.organizationType.trim()
        || filters.industry.trim()
        || filters.location.trim(),
    );
}
