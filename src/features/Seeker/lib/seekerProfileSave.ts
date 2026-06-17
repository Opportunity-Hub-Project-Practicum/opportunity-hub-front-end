import type { SeekerFormData } from "../../../GlobalComponents/SeekerProfileSection";
import { uploadFile } from "../../../services/uploadService";
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
    deleteContact,
    deleteEducation,
    deleteWorkExperience,
    fetchSeekerProfile,
    updateContact,
    updateEducation,
    updateNotifySettings,
    updateSeekerProfile,
    updateWorkExperience,
} from "../services/seekerProfileService";

async function uploadProfileImageIfNeeded(profile: SeekerFormData): Promise<string | null> {
    if (!profile.profileImageFile) {
        return null;
    }

    const response = await uploadFile(profile.profileImageFile, "profiles");
    return response.path;
}

async function uploadResumeIfNeeded(profile: SeekerFormData): Promise<string | null> {
    const resume = profile.resume[0];
    if (!resume?.raw) {
        return null;
    }

    const response = await uploadFile(resume.raw, "resumes");
    return response.path;
}

async function syncPhoneContact(
    phone: string,
    phoneContactId: number | undefined,
): Promise<number | undefined> {
    const value = phone.trim();

    if (!value) {
        if (phoneContactId) {
            await deleteContact(phoneContactId);
        }
        return undefined;
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
        if (websiteContactId) {
            await deleteContact(websiteContactId);
        }
        return undefined;
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

async function syncSocialContacts(
    profile: SeekerFormData,
    meta: SeekerProfileMeta,
): Promise<Record<string, number>> {
    const socialContactIds = { ...meta.socialContactIds };
    const activeLinks = profile.socialLinks.filter((link) => link.url.trim().length > 0);
    const activeLinkIds = new Set(activeLinks.map((link) => link.id));

    for (const [linkId, contactId] of Object.entries(meta.socialContactIds)) {
        if (!activeLinkIds.has(linkId)) {
            await deleteContact(contactId);
            delete socialContactIds[linkId];
        }
    }

    for (const link of activeLinks) {
        const value = link.url.trim();
        const contactId = link.contactId ?? socialContactIds[link.id];

        if (contactId) {
            await updateContact(contactId, {
                label: link.platform || "Social",
                value,
            });
            socialContactIds[link.id] = contactId;
            continue;
        }

        const response = await createContact({
            category: "social",
            label: link.platform || "Social",
            value,
        });
        socialContactIds[link.id] = response.contact.contact_id;
    }

    return socialContactIds;
}

async function syncEducations(profile: SeekerFormData, meta: SeekerProfileMeta): Promise<number[]> {
    const currentIds = new Set(
        profile.education
            .map((entry) => entry.educationId)
            .filter((id): id is number => id != null),
    );

    for (const educationId of meta.educationIds) {
        if (!currentIds.has(educationId)) {
            await deleteEducation(educationId);
        }
    }

    const savedIds: number[] = [];

    for (const entry of profile.education) {
        const payload = mapEducationEntryToApi(entry);

        if (entry.educationId) {
            await updateEducation(entry.educationId, payload);
            savedIds.push(entry.educationId);
            continue;
        }

        const response = await createEducation(payload);
        savedIds.push(response.education.education_id);
    }

    return savedIds;
}

async function syncExperiences(profile: SeekerFormData, meta: SeekerProfileMeta): Promise<number[]> {
    const currentIds = new Set(
        profile.experience
            .map((entry) => entry.experienceId)
            .filter((id): id is number => id != null),
    );

    for (const experienceId of meta.experienceIds) {
        if (!currentIds.has(experienceId)) {
            await deleteWorkExperience(experienceId);
        }
    }

    const savedIds: number[] = [];

    for (const entry of profile.experience) {
        const payload = mapExperienceEntryToApi(entry);

        if (entry.experienceId) {
            await updateWorkExperience(entry.experienceId, payload);
            savedIds.push(entry.experienceId);
            continue;
        }

        const response = await createWorkExperience(payload);
        savedIds.push(response.work_experience.experience_id);
    }

    return savedIds;
}

export async function saveSeekerProfileSettings(
    profile: SeekerFormData,
    meta: SeekerProfileMeta,
): Promise<SeekerProfileMeta> {
    const [uploadedProfilePath, uploadedResumePath] = await Promise.all([
        uploadProfileImageIfNeeded(profile),
        uploadResumeIfNeeded(profile),
    ]);

    await updateSeekerProfile(
        mapProfileFormToUpdatePayload(profile, meta, uploadedProfilePath, uploadedResumePath),
    );

    const [phoneContactId, websiteContactId, socialContactIds, educationIds, experienceIds] =
        await Promise.all([
            syncPhoneContact(profile.Phone, meta.phoneContactId),
            syncWebsiteContact(profile.website, meta.websiteContactId),
            syncSocialContacts(profile, meta),
            syncEducations(profile, meta),
            syncExperiences(profile, meta),
        ]);

    return {
        phoneContactId,
        websiteContactId,
        socialContactIds,
        educationIds,
        experienceIds,
        profileImagePath: uploadedProfilePath ?? meta.profileImagePath,
        cvResumePath: uploadedResumePath ?? (profile.resume.length > 0 ? meta.cvResumePath : null),
    };
}

export async function saveSeekerAccountSettings(
    notify: SeekerNotifyFormState,
): Promise<void> {
    await updateNotifySettings(mapNotifyFormToUpdatePayload(notify));
}

export async function reloadSeekerSettings() {
    const response = await fetchSeekerProfile();
    return mapProfileApiToSettings(response.profile);
}
