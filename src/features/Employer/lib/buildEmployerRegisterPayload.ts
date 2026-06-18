import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
import type { EmployerRegisterPayload } from "../types/employerRegister";
import type { LookupValuesByType } from "../../../types/lookupValue";
import { LOOKUP_TYPES } from "../../../types/lookupValue";
import { getLookupOptions } from "../../../hooks/useLookupValues";
import {
    resolveEmployerLookupForApi,
    teamSizeLookupValueToNumber,
} from "./employerLookupUtils";

function parseOptionalInt(value: string): number | undefined {
    if (!value.trim()) {
        return undefined;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseYear(value: string): number | undefined {
    if (!value.trim()) {
        return undefined;
    }

    if (/^\d{4}$/.test(value.trim())) {
        return Number.parseInt(value.trim(), 10);
    }

    const fromDate = new Date(value);
    if (!Number.isNaN(fromDate.getTime())) {
        return fromDate.getFullYear();
    }

    return parseOptionalInt(value);
}

function firstSocialLink(data: EmployerData): string | undefined {
    const url = data.socialLinks.map((link) => link.url.trim()).find((value) => value.length > 0);
    return url || undefined;
}

export function toEmployerRegisterApiBody(
    payload: EmployerRegisterPayload,
): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== ""),
    );
}

export function buildEmployerRegisterPayload(
    company: EmployerData,
    lookupValues?: LookupValuesByType | null,
): EmployerRegisterPayload {
    const email = company.email.trim();
    const organizationOptions = getLookupOptions(lookupValues ?? null, LOOKUP_TYPES.organizationType);
    const industryOptions = getLookupOptions(lookupValues ?? null, LOOKUP_TYPES.industry);
    const locationOptions = getLookupOptions(lookupValues ?? null, LOOKUP_TYPES.location);

    return {
        full_name: company.fullName.trim(),
        email,
        password: company.password,
        password_confirmation: company.confirmPassword,
        role: "employer",
        company_name: company.companyName.trim(),
        company_email: email,
        company_phone_number: company.phoneNumber.trim(),
        about_us: company.aboutCompany.trim() || undefined,
        organization_type: resolveEmployerLookupForApi(company.organizationType, organizationOptions),
        industry_type: resolveEmployerLookupForApi(company.industryType, industryOptions),
        team_size: teamSizeLookupValueToNumber(company.teamSize),
        year_establishment: parseYear(company.yearOfEstablishment),
        company_web_link: company.companyWebsite.trim() || undefined,
        company_vision: company.companyVision.trim() || undefined,
        map_location: resolveEmployerLookupForApi(company.location, locationOptions),
        social_link: firstSocialLink(company),
    };
}
