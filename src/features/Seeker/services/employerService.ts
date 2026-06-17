import { apiRequest } from "../../../services/apiClient";
import type { Organization } from "../Components/card/CardCompany";
import type {
    EmployerContactApi,
    PublicEmployerApi,
    PublicEmployerContactsResponse,
    PublicEmployerDetailApi,
    PublicEmployerResponse,
    PublicEmployersResponse,
} from "../types/employer";

export async function fetchPublicEmployers(): Promise<PublicEmployerApi[]> {
    const response = await apiRequest<PublicEmployersResponse>(
        "/employers",
        {},
        { auth: false },
    );
    return response.employers;
}

export async function fetchPublicEmployer(employerId: number): Promise<PublicEmployerDetailApi | null> {
    try {
        const response = await apiRequest<PublicEmployerResponse>(
            `/employers/${employerId}`,
            {},
            { auth: false },
        );
        return response.profile;
    } catch {
        return null;
    }
}

export async function fetchPublicEmployerContacts(employerId: number): Promise<EmployerContactApi[]> {
    try {
        const response = await apiRequest<PublicEmployerContactsResponse>(
            `/employers/${employerId}/contacts`,
            {},
            { auth: false },
        );
        return response.contacts;
    } catch {
        return [];
    }
}

export function mapEmployerToCardCompany(
    profile: PublicEmployerDetailApi,
    contacts: EmployerContactApi[] = [],
): Organization {
    const phoneContact = contacts.find((contact) => contact.category === "phone");
    const websiteContact = contacts.find((contact) => contact.category === "website");

    let category: Organization["Category"];
    let value: string | undefined;

    if (phoneContact) {
        category = "phone";
        value = phoneContact.value;
    } else if (profile.company_phone_number) {
        category = "phone";
        value = profile.company_phone_number;
    } else if (websiteContact) {
        category = "web_url";
        value = websiteContact.value;
    } else if (profile.company_web_link) {
        category = "web_url";
        value = profile.company_web_link;
    }

    return {
        image: profile.logo_img ?? "",
        name: profile.company_name,
        industry_type: profile.industry_type ?? "",
        year_establishment: profile.year_establishment ?? undefined,
        organization_type: profile.organization_type ?? undefined,
        team_size: profile.team_size != null ? String(profile.team_size) : undefined,
        company_email: profile.company_email ?? undefined,
        Category: category,
        value,
    };
}
