import type { SeekerFormData } from "../../../GlobalComponents/SeekerProfileSection";
import {
    mapEducationEntryToApi,
    mapExperienceEntryToApi,
    mapNotifyFormToUpdatePayload,
    mapProfileApiToSettings,
    mapProfileFormToUpdatePayload,
    type SeekerNotifyFormState,
    type SeekerProfileMeta,
} from "./seekerProfileMappers";
import {
    createContact,
    createEducation,
    createWorkExperience,
    fetchSeekerProfile,
    updateContact,
    updateNotifySettings,
    updateSeekerProfile,
} from "../services/seekerProfileService";

async function syncPhoneContact(
    phone: string,
    phoneContactId: number | undefined,
): Promise<number | undefined> {
    const value = phone.trim();
    if (!value) {
        return phoneContactId;
    }

    if (phoneContactId) {
        await updateContact(phoneContactId, { label: "Phone", value });
        return phoneContactId;
    }

    const response = await createContact({
        category: "phone",
        label: "Phone",
        value,
    });
    return response.contact.contact_id;
}

async function syncWebsiteContact(
    website: string,
    websiteContactId: number | undefined,
): Promise<number | undefined> {
    const value = website.trim();
    if (!value) {
        return websiteContactId;
    }

    if (websiteContactId) {
        await updateContact(websiteContactId, { label: "Website", value });
        return websiteContactId;
    }

    const response = await createContact({
        category: "web_url",
        label: "Website",
        value,
    });
    return response.contact.contact_id;
}

async function syncSocialContacts(profile: SeekerFormData): Promise<void> {
    const links = profile.socialLinks.filter((link) => link.url.trim().length > 0);

    for (const link of links) {
        const value = link.url.trim();
        if (link.contactId) {
            await updateContact(link.contactId, {
                label: link.platform || "Social",
                value,
            });
            continue;
        }

        await createContact({
            category: "social",
            label: link.platform || "Social",
            value,
        });
    }
}

async function syncNewEducations(profile: SeekerFormData): Promise<void> {
    const pending = profile.education.filter((entry) => !entry.educationId);
    for (const entry of pending) {
        await createEducation(mapEducationEntryToApi(entry));
    }
}

async function syncNewExperiences(profile: SeekerFormData): Promise<void> {
    const pending = profile.experience.filter((entry) => !entry.experienceId);
    for (const entry of pending) {
        await createWorkExperience(mapExperienceEntryToApi(entry));
    }
}

export async function saveSeekerProfileSettings(
    profile: SeekerFormData,
    meta: SeekerProfileMeta,
    profilePrivacy: boolean,
): Promise<SeekerProfileMeta> {
    await updateSeekerProfile(mapProfileFormToUpdatePayload(profile, meta, profilePrivacy));

    const phoneContactId = await syncPhoneContact(profile.Phone, meta.phoneContactId);
    const websiteContactId = await syncWebsiteContact(profile.website, meta.websiteContactId);
    await syncSocialContacts(profile);
    await syncNewEducations(profile);
    await syncNewExperiences(profile);

    return {
        ...meta,
        phoneContactId,
        websiteContactId,
    };
}

export async function saveSeekerAccountSettings(
    notify: SeekerNotifyFormState,
    profile: SeekerFormData,
    meta: SeekerProfileMeta,
): Promise<void> {
    await updateNotifySettings(mapNotifyFormToUpdatePayload(notify));
    await updateSeekerProfile({
        is_profile_public: notify.profilePrivacy,
    });
}

export async function reloadSeekerSettings() {
    const response = await fetchSeekerProfile();
    return mapProfileApiToSettings(response.profile);
}
