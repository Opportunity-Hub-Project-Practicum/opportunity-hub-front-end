import type { EmployerData, SocialLink } from "../../../GlobalComponents/OrganizationForm";
import type { AuthUser } from "../../../types/auth";
import { getLookupOptions } from "../../../hooks/useLookupValues";
import { LOOKUP_TYPES } from "../../../types/lookupValue";
import type { LookupValuesByType } from "../../../types/lookupValue";
import { resolveAssetUrl } from "./resolveAssetUrl";
import {
    normalizeEmployerLookupFields,
    resolveEmployerLookupForApi,
    teamSizeLookupValueToNumber,
    teamSizeNumberToLookupValue,
} from "./employerLookupUtils";
import type {
    EmployerContactApi,
    EmployerProfileApi,
    UpdateEmployerProfilePayload,
} from "../types/employerProfile";

export type EmployerProfileMeta = {
    logoPath: string | null;
    socialContactIds: Record<string, number>;
};

export type EmployerSettingsBundle = {
    formData: EmployerData;
    meta: EmployerProfileMeta;
};

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

function formatYearForDateInput(year: number | null | undefined): string {
    if (!year) {
        return "";
    }
    return `${year}-01-01`;
}

function firstSocialLink(data: EmployerData): string | undefined {
    const url = data.socialLinks.map((link) => link.url.trim()).find((value) => value.length > 0);
    return url || undefined;
}

function mapSocialContactsToLinks(
    contacts: EmployerContactApi[],
    socialLink: string | null,
): { links: SocialLink[]; socialContactIds: Record<string, number> } {
    const socialContacts = contacts.filter((contact) => contact.category === "social_media");
    const links: SocialLink[] = socialContacts.map((contact) => ({
        id: String(contact.contact_id),
        platform: contact.label.toLowerCase() || "website",
        url: contact.value,
    }));

    const socialContactIds = Object.fromEntries(
        socialContacts.map((contact) => [String(contact.contact_id), contact.contact_id]),
    );

    if (socialLink && !links.some((link) => link.url === socialLink)) {
        const legacyId = "legacy-social";
        links.unshift({
            id: legacyId,
            platform: "website",
            url: socialLink,
        });
    }

    if (links.length === 0) {
        return {
            links: [{ id: "1", platform: "website", url: socialLink ?? "" }],
            socialContactIds,
        };
    }

    return { links, socialContactIds };
}

function getEmployerMapLocation(user: AuthUser | null): string {
    const profile = user?.profile as { map_location?: string | null } | null;
    return profile?.map_location ?? "";
}

export function mapProfileApiToSettings(
    profile: EmployerProfileApi,
    user: AuthUser | null,
    lookupValues?: LookupValuesByType | null,
): EmployerSettingsBundle {
    const contacts = profile.contacts ?? [];
    const { links, socialContactIds } = mapSocialContactsToLinks(contacts, profile.social_link);

    const formData: EmployerData = {
        fullName: user?.full_name ?? "",
        password: "",
        confirmPassword: "",
        currentPassword: "",
        companyName: profile.company_name ?? "",
        location: profile.map_location ?? getEmployerMapLocation(user),
        phoneNumber: profile.company_phone_number ?? "",
        email: profile.company_email ?? user?.email ?? "",
        aboutCompany: profile.about_us ?? "",
        organizationType: profile.organization_type ?? "",
        industryType: profile.industry_type ?? "",
        teamSize: profile.team_size != null ? String(profile.team_size) : "",
        yearOfEstablishment: formatYearForDateInput(profile.year_establishment),
        companyWebsite: profile.company_web_link ?? "",
        companyVision: profile.company_vision ?? "",
        logo: profile.logo_img
            ? {
                id: "logo",
                name: profile.logo_img.split("/").pop() ?? "Logo",
                size: "",
                url: resolveAssetUrl(profile.logo_img),
            }
            : undefined,
        socialLinks: links,
    };

    const normalizedLookupFields = lookupValues
        ? normalizeEmployerLookupFields(formData, lookupValues)
        : {
            location: formData.location,
            organizationType: formData.organizationType,
            industryType: formData.industryType,
            teamSize: profile.team_size != null
                ? teamSizeNumberToLookupValue(profile.team_size)
                : formData.teamSize,
        };

    return {
        formData: {
            ...formData,
            ...normalizedLookupFields,
        },
        meta: {
            logoPath: profile.logo_img,
            socialContactIds,
        },
    };
}

export function mapEmployerFormToUpdatePayload(
    data: EmployerData,
    meta: EmployerProfileMeta,
    uploadedLogoPath?: string | null,
    lookupValues?: LookupValuesByType | null,
): UpdateEmployerProfilePayload {
    const organizationOptions = getLookupOptions(lookupValues ?? null, LOOKUP_TYPES.organizationType);
    const industryOptions = getLookupOptions(lookupValues ?? null, LOOKUP_TYPES.industry);
    const locationOptions = getLookupOptions(lookupValues ?? null, LOOKUP_TYPES.location);

    const payload: UpdateEmployerProfilePayload = {
        company_name: data.companyName.trim(),
        company_email: data.email.trim() || null,
        company_phone_number: data.phoneNumber.trim() || null,
        about_us: data.aboutCompany || null,
        organization_type: resolveEmployerLookupForApi(data.organizationType, organizationOptions) ?? null,
        industry_type: resolveEmployerLookupForApi(data.industryType, industryOptions) ?? null,
        team_size: teamSizeLookupValueToNumber(data.teamSize) ?? null,
        year_establishment: parseYear(data.yearOfEstablishment) ?? null,
        company_web_link: data.companyWebsite.trim() || null,
        company_vision: data.companyVision || null,
        map_location: resolveEmployerLookupForApi(data.location, locationOptions) ?? null,
        social_link: firstSocialLink(data) ?? null,
    };

    if (uploadedLogoPath) {
        payload.logo_img = uploadedLogoPath;
    } else if (meta.logoPath) {
        payload.logo_img = meta.logoPath;
    }

    return payload;
}
