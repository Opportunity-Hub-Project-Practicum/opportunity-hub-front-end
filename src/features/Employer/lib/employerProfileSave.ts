import type { EmployerData } from "../../../GlobalComponents/OrganizationForm";
import { ApiError } from "../../../services/apiClient";
import { fetchCurrentUser, updateAccount } from "../../../services/authService";
import { uploadFile } from "../../../services/uploadService";
import type { AuthUser } from "../../../types/auth";
import {
    mapEmployerFormToUpdatePayload,
    mapProfileApiToSettings,
    type EmployerProfileMeta,
} from "./employerProfileMappers";
import {
    createEmployerContact,
    deleteEmployerContact,
    fetchEmployerProfile,
    updateEmployerContact,
    updateEmployerProfile,
} from "../services/employerProfileService";

async function uploadLogoIfNeeded(formData: EmployerData): Promise<string | null> {
    if (!formData.logo?.raw) {
        return null;
    }

    const response = await uploadFile(formData.logo.raw, "logos");
    return response.path;
}

async function saveEmployerAccountSettings(
    formData: EmployerData,
    user: AuthUser,
): Promise<void> {
    const payload: Parameters<typeof updateAccount>[0] = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();
    const currentPassword = formData.currentPassword.trim();

    if (fullName && fullName !== user.full_name) {
        payload.full_name = fullName;
    }

    if (email && email !== user.email) {
        payload.email = email;
    }

    if (password) {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters.");
        }

        if (!currentPassword) {
            throw new Error("Enter your current password to set a new password.");
        }

        payload.current_password = currentPassword;
        payload.password = password;
        payload.password_confirmation = confirmPassword;
    }

    if (Object.keys(payload).length > 0) {
        await updateAccount(payload);
    }
}

async function syncSocialContacts(
    socialLinks: EmployerData["socialLinks"],
    meta: EmployerProfileMeta,
): Promise<Record<string, number>> {
    const socialContactIds = { ...meta.socialContactIds };
    const activeLinkIds = new Set(socialLinks.map((link) => link.id));

    for (const [linkId, contactId] of Object.entries(meta.socialContactIds)) {
        const link = socialLinks.find((item) => item.id === linkId);
        const shouldDelete = !activeLinkIds.has(linkId) || !link?.url.trim();

        if (shouldDelete) {
            await deleteEmployerContact(contactId);
            delete socialContactIds[linkId];
        }
    }

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
    const user = await fetchCurrentUser();
    const uploadedLogoPath = await uploadLogoIfNeeded(formData);

    try {
        await saveEmployerAccountSettings(formData, user);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error(error instanceof Error ? error.message : "Failed to update account settings.");
    }

    const profilePayload = mapEmployerFormToUpdatePayload(formData, meta, uploadedLogoPath);
    await updateEmployerProfile(profilePayload);
    const socialContactIds = await syncSocialContacts(formData.socialLinks, meta);

    return {
        ...meta,
        socialContactIds,
        logoPath: uploadedLogoPath ?? profilePayload.logo_img ?? meta.logoPath,
    };
}

export async function reloadEmployerSettings() {
    const [profileResponse, user] = await Promise.all([
        fetchEmployerProfile(),
        fetchCurrentUser(),
    ]);

    return mapProfileApiToSettings(profileResponse.profile, user);
}
