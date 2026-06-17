import type {
    EducationEntry,
    ExperienceEntry,
    SeekerFormData,
    SocialLink,
} from "../../../GlobalComponents/SeekerProfileSection";
import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import type {
    SeekerNotifySettingApi,
    SeekerProfileApi,
    UpdateSeekerNotifyPayload,
    UpdateSeekerProfilePayload,
} from "../types/seekerProfile";

export interface SeekerNotifyFormState {
    notifications: {
        employerShortlistedMe: boolean;
        newOpportunity: boolean;
        appliedJobsExpire: boolean;
        employerRejectedMe: boolean;
        notifyOnHire: boolean;
    };
    jobAlerts: { role: string; location: string };
    volunteerAlerts: { role: string; location: string };
    alertCategory: "job" | "volunteer" | null;
}

export interface SeekerProfileMeta {
    phoneContactId?: number;
    websiteContactId?: number;
    cvResumePath: string | null;
    profileImagePath: string | null;
    educationIds: number[];
    experienceIds: number[];
    socialContactIds: Record<string, number>;
}

export interface SeekerSettingsBundle {
    profile: SeekerFormData;
    meta: SeekerProfileMeta;
    notify: SeekerNotifyFormState;
}

const EMPTY_PROFILE: SeekerFormData = {
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    website: "",
    gender: "",
    martialStatus: "",
    Phone: "",
    bio: "",
    profileImage: null,
    profileImageFile: undefined,
    socialLinks: [{ id: "1", platform: "website", url: "" }],
    resume: [],
    education: [],
    experience: [],
};

function splitFullName(fullName?: string | null): { firstName: string; lastName: string } {
    const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
        return { firstName: "", lastName: "" };
    }
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: "" };
    }
    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
    };
}

function formatBirthDateForDisplay(value: string | null | undefined): string {
    if (!value) {
        return "";
    }
    const [year, month, day] = value.split("-");
    if (year && month && day) {
        return `${day}/${month}/${year}`;
    }
    return value;
}

function parseBirthDateForApi(value: string): string | undefined {
    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }

    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
        const [, day, month, year] = slashMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return undefined;
}

function yearToStartDate(year: string): string {
    if (!year || year === "Present") {
        return `${new Date().getFullYear()}-01-01`;
    }
    return `${year}-01-01`;
}

function yearToEndDate(year: string): string | null {
    if (!year || year === "Present") {
        return null;
    }
    return `${year}-12-31`;
}

function dateToYear(value: string | null | undefined): string {
    if (!value) {
        return "";
    }
    return value.slice(0, 4);
}

export function parseYearsOfExperience(value: string | undefined): number {
    if (!value) {
        return 0;
    }
    if (value.includes("10+")) {
        return 10;
    }
    if (value.includes("6")) {
        return 6;
    }
    if (value.includes("3")) {
        return 3;
    }
    if (value.includes("1")) {
        return 1;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

export function mapProfileApiToSettings(profile: SeekerProfileApi): SeekerSettingsBundle {
    const { firstName, lastName } = splitFullName(profile.full_name);
    const contacts = profile.contacts ?? [];

    const phoneContact = contacts.find((contact) => contact.category === "phone");
    const websiteContact = contacts.find((contact) => contact.category === "web_url");
    const socialContacts = contacts.filter((contact) => contact.category === "social");

    const socialLinks: SocialLink[] = socialContacts.length > 0
        ? socialContacts.map((contact) => ({
            id: String(contact.contact_id),
            platform: contact.label.toLowerCase(),
            url: contact.value,
            contactId: contact.contact_id,
        }))
        : profile.social_link
          ? [{ id: "legacy-social", platform: "social", url: profile.social_link }]
          : [{ id: "1", platform: "website", url: "" }];

    const socialContactIds = Object.fromEntries(
        socialLinks
            .filter((link) => link.contactId != null)
            .map((link) => [link.id, link.contactId as number]),
    );

    const education: EducationEntry[] = (profile.educations ?? []).map((item) => ({
        educationId: item.education_id,
        school: item.institution_name,
        degree: item.degree,
        areaOfStudy: "",
        location: item.location,
        country: item.country,
        from: dateToYear(item.start_date),
        to: item.end_date ? dateToYear(item.end_date) : "Present",
    }));

    const experience: ExperienceEntry[] = (profile.work_experiences ?? []).map((item) => ({
        experienceId: item.experience_id,
        jobTitle: item.job_title,
        company: item.company_name,
        jobRole: item.job_role,
        yearsOfExperience: String(item.year_of_experience),
        industry: item.industry,
        from: dateToYear(item.start_date),
        to: item.end_date ? dateToYear(item.end_date) : "Present",
        jobDescription: item.description ?? "",
    }));

    const notifySetting = profile.notify_setting;
    const alertCategory = notifySetting?.category ?? "job";
    const alerts = {
        role: notifySetting?.role_name ?? "",
        location: notifySetting?.location ?? "",
    };

    return {
        profile: {
            ...EMPTY_PROFILE,
            firstName,
            lastName,
            email: profile.email ?? "",
            dob: formatBirthDateForDisplay(profile.birth_date),
            website: profile.personal_web_url ?? websiteContact?.value ?? "",
            gender: profile.gender ?? "",
            martialStatus: profile.marital_status ?? "",
            Phone: profile.seeker_phone_number ?? phoneContact?.value ?? "",
            bio: profile.biography ?? "",
            profileImage: profile.profile_img ? resolveAssetUrl(profile.profile_img) : null,
            profileImageFile: undefined,
            socialLinks,
            resume: profile.cv_resume
                ? [{
                    id: "cv",
                    name: profile.cv_resume.split("/").pop() ?? "Resume",
                    size: "",
                    url: resolveAssetUrl(profile.cv_resume),
                }]
                : [],
            education,
            experience,
        },
        meta: {
            phoneContactId: phoneContact?.contact_id,
            websiteContactId: websiteContact?.contact_id,
            cvResumePath: profile.cv_resume,
            profileImagePath: profile.profile_img,
            educationIds: education
                .map((entry) => entry.educationId)
                .filter((id): id is number => id != null),
            experienceIds: experience
                .map((entry) => entry.experienceId)
                .filter((id): id is number => id != null),
            socialContactIds,
        },
        notify: mapNotifyApiToForm(notifySetting, alertCategory, alerts),
    };
}

export function mapNotifyApiToForm(
    setting: SeekerNotifySettingApi | null | undefined,
    alertCategory: "job" | "volunteer" | null = "job",
    alerts: { role: string; location: string } = { role: "", location: "" },
): SeekerNotifyFormState {
    const jobAlerts = alertCategory === "job" ? alerts : { role: "", location: "" };
    const volunteerAlerts = alertCategory === "volunteer" ? alerts : { role: "", location: "" };

    return {
        notifications: {
            employerShortlistedMe: setting?.notify_on_shortlist ?? false,
            newOpportunity: setting?.notify_on_opportunities ?? false,
            appliedJobsExpire: false,
            employerRejectedMe: setting?.notify_on_reject ?? false,
            notifyOnHire: setting?.notify_on_hire ?? false,
        },
        jobAlerts,
        volunteerAlerts,
        alertCategory,
    };
}

export function mapProfileFormToUpdatePayload(
    profile: SeekerFormData,
    meta: SeekerProfileMeta,
    uploadedProfilePath?: string | null,
    uploadedResumePath?: string | null,
): UpdateSeekerProfilePayload {
    const payload: UpdateSeekerProfilePayload = {
        birth_date: parseBirthDateForApi(profile.dob) ?? null,
        gender: profile.gender || null,
        marital_status: profile.martialStatus || null,
        biography: profile.bio || null,
    };

    if (uploadedProfilePath) {
        payload.profile_img = uploadedProfilePath;
    } else if (meta.profileImagePath) {
        payload.profile_img = meta.profileImagePath;
    }

    if (uploadedResumePath) {
        payload.cv_resume = uploadedResumePath;
    } else if (profile.resume.length === 0) {
        payload.cv_resume = null;
    } else if (meta.cvResumePath) {
        payload.cv_resume = meta.cvResumePath;
    }

    return payload;
}

export function mapNotifyFormToUpdatePayload(
    notify: SeekerNotifyFormState,
    preferVolunteerAlerts = false,
): UpdateSeekerNotifyPayload {
    const activeAlerts = preferVolunteerAlerts && notify.volunteerAlerts.role
        ? notify.volunteerAlerts
        : notify.jobAlerts;
    const category = preferVolunteerAlerts && notify.volunteerAlerts.role ? "volunteer" : "job";

    return {
        notify_on_shortlist: notify.notifications.employerShortlistedMe,
        notify_on_reject: notify.notifications.employerRejectedMe,
        notify_on_hire: notify.notifications.notifyOnHire,
        notify_on_opportunities: notify.notifications.newOpportunity,
        category,
        role_name: activeAlerts.role || null,
        location: activeAlerts.location || null,
    };
}

export function mapEducationEntryToApi(entry: EducationEntry) {
    const degree = entry.areaOfStudy
        ? `${entry.degree} in ${entry.areaOfStudy}`
        : entry.degree;

    return {
        institution_name: entry.school?.trim() || "Institution",
        degree: degree?.trim() || "Degree",
        location: entry.location?.trim() || entry.country?.trim() || "N/A",
        country: entry.country?.trim() || "N/A",
        start_date: yearToStartDate(entry.from ?? ""),
        end_date: yearToEndDate(entry.to ?? ""),
    };
}

export function mapExperienceEntryToApi(entry: ExperienceEntry) {
    return {
        company_name: entry.company?.trim() || "Company",
        job_title: entry.jobTitle?.trim() || entry.jobRole?.trim() || "Role",
        job_role: entry.jobRole?.trim() || entry.jobTitle?.trim() || "Role",
        year_of_experience: parseYearsOfExperience(entry.yearsOfExperience ?? entry.from),
        industry: entry.industry?.trim() || "General",
        start_date: yearToStartDate(entry.from ?? ""),
        end_date: yearToEndDate(entry.to ?? ""),
        description: entry.jobDescription?.trim() || null,
    };
}
