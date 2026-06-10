import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
import { fetchCurrentUser } from "../../../services/authService";
import {
    mapEmployerFormToUpdatePayload,
    mapProfileApiToSettings,
    type EmployerProfileMeta,
} from "./employerProfileMappers";
import {
    createEmployerContact,
    fetchEmployerProfile,
    updateEmployerContact,
    updateEmployerProfile,
} from "../services/employerProfileService";

async function syncSocialContacts(
    socialLinks: EmployerData["socialLinks"],
    meta: EmployerProfileMeta,
): Promise<Record<string, number>> {
    const socialContactIds = { ...meta.socialContactIds };

    for (const link of socialLinks) {
        const value = link.url.trim();
        if (!value) {
            continue;
        }

        const contactId = socialContactIds[link.id];
        if (contactId) {
            await updateEmployerContact(contactId, {
                category: "social_media",
                label: link.platform || "Social",
                value,
            });
            continue;
        }

        const response = await createEmployerContact({
            category: "social_media",
            label: link.platform || "Social",
            value,
        });
        socialContactIds[link.id] = response.contact.contact_id;
    }

    return socialContactIds;
}

export async function saveEmployerProfileSettings(
    formData: EmployerData,
    meta: EmployerProfileMeta,
): Promise<EmployerProfileMeta> {
    await updateEmployerProfile(mapEmployerFormToUpdatePayload(formData, meta));
    const socialContactIds = await syncSocialContacts(formData.socialLinks, meta);

    return {
        ...meta,
        socialContactIds,
        logoPath: mapEmployerFormToUpdatePayload(formData, meta).logo_img ?? meta.logoPath,
    };
}

export async function reloadEmployerSettings() {
    const [profileResponse, user] = await Promise.all([
        fetchEmployerProfile(),
        fetchCurrentUser(),
    ]);

    return mapProfileApiToSettings(profileResponse.profile, user);
}
