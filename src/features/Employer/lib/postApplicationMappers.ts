import type {
    CreateEmployerPostPayload,
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

function mapNullableCode(value: string): string | null {
    const trimmed = value.trim();
    return trimmed || null;
}

export function mapJobPostToApi(payload: JobPostSubmitPayload): CreateEmployerPostPayload {
    return {
        type: "job",
        post_title: payload.title.trim(),
        post_description: normalizeRichTextForStorage(payload.description) || null,
        responsibility: normalizeRichTextForStorage(payload.responsibilities) || null,
        work_place_type: mapWorkPlaceType(payload.workPlaceType),
        duration: "long-term",
        schedule: "flexible",
        min_salary: payload.minSalary,
        max_salary: payload.maxSalary,
        job_type: mapNullableCode(payload.jobType),
        job_education: mapNullableCode(payload.education),
        job_experience: mapNullableCode(payload.experience),
        job_requirement: normalizeRichTextForStorage(payload.jobRequirements) || null,
        job_level: mapNullableCode(payload.jobLevel),
        location_id: payload.locationId,
        closed_date: parseClosedDate(payload.expirationDate),
        language: "english",
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
        hours_per_week: mapNullableCode(payload.hoursPerWeek),
        benefits: payload.benefits.length > 0 ? payload.benefits : null,
        language: mapNullableCode(payload.language),
        job_requirement: normalizeRichTextForStorage(payload.volunteerRequirements) || null,
    };
}
