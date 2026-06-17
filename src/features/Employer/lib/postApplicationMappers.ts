import type {
    CreateEmployerPostPayload,
    JobLevel,
    JobPostSubmitPayload,
    PostDuration,
    PostSchedule,
    VolunteerPostSubmitPayload,
    WorkPlaceType,
} from "../types/postApplication";
import { normalizeRichTextForStorage } from "../../../utils/richText";

function parseClosedDate(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
        const [, day, month, year] = slashMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
    }

    return null;
}

function mapJobLevel(value: string): JobLevel | null {
    const normalized = value.trim() as JobLevel;
    if (normalized === "entry_level" || normalized === "mid_level" || normalized === "expert_level") {
        return normalized;
    }
    return null;
}

function mapWorkPlaceType(value: string): WorkPlaceType | null {
    const normalized = value.trim().toLowerCase();
    if (normalized === "remote" || normalized === "onsite" || normalized === "hybrid") {
        return normalized;
    }
    return null;
}

function mapDuration(value: string): PostDuration | null {
    const normalized = value.trim() as PostDuration;
    if (normalized === "one-time" || normalized === "short-term" || normalized === "long-term") {
        return normalized;
    }
    return null;
}

function mapSchedule(value: string): PostSchedule | null {
    const normalized = value.trim() as PostSchedule;
    if (normalized === "weekdays" || normalized === "weekend" || normalized === "flexible") {
        return normalized;
    }
    return null;
}

function mapVolunteerLanguage(languages: string[]): string | null {
    if (languages.length === 0) {
        return null;
    }

    const labels: Record<string, string> = {
        khmer: "Khmer",
        english: "English",
        other: "Other",
    };

    return languages
        .map((language) => labels[language.toLowerCase()] ?? language)
        .join(", ");
}

export function mapJobPostToApi(payload: JobPostSubmitPayload): CreateEmployerPostPayload {
    return {
        type: "job",
        post_title: payload.title.trim(),
        post_description: normalizeRichTextForStorage(payload.description) || null,
        responsibility: normalizeRichTextForStorage(payload.responsibilities) || null,
        work_place_type: mapWorkPlaceType(payload.workPlaceType),
        location: payload.location.trim() || null,
        duration: "long-term",
        schedule: "flexible",
        min_salary: payload.minSalary,
        max_salary: payload.maxSalary,
        job_role: payload.jobRole.trim() || null,
        job_education: payload.education.trim() || null,
        job_experience: payload.experience.trim() || null,
        job_requirement: normalizeRichTextForStorage(payload.jobRequirements) || null,
        job_level: mapJobLevel(payload.jobLevel),
        closed_date: parseClosedDate(payload.expirationDate),
        language: "English",
    };
}

export function mapVolunteerPostToApi(payload: VolunteerPostSubmitPayload): CreateEmployerPostPayload {
    return {
        type: "volunteer",
        post_title: payload.title.trim(),
        post_description: normalizeRichTextForStorage(payload.description) || null,
        responsibility: normalizeRichTextForStorage(payload.responsibilities) || null,
        work_place_type: mapWorkPlaceType(payload.volunteerPlaceType),
        duration: mapDuration(payload.duration),
        schedule: mapSchedule(payload.schedule),
        hours_per_week: payload.hoursPerWeek,
        benefits: payload.benefits.length > 0 ? payload.benefits : null,
        language: mapVolunteerLanguage(payload.languages),
        job_requirement: normalizeRichTextForStorage(payload.volunteerRequirements) || null,
    };
}
