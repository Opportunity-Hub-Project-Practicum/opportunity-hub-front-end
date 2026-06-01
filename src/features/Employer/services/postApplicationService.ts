const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
        },
        ...init,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export interface JobPostSubmitPayload {
    title: string;
    tags: string[];
    jobRole: string;
    minSalary: number | null;
    maxSalary: number | null;
    salaryType: string;
    education: string;
    experience: string;
    jobType: string;
    vacancies: number | null;
    expirationDate: string;
    jobLevel: string;
    description: string;
    responsibilities: string;
}

export interface ValunteerFormQuestionPayload {
    question: string;
    order: number;
}

export interface VolunteerPostSubmitPayload {
    title: string;
    durationYears: number | null;
    durationMonths: number | null;
    durationDays: number | null;
    volunteerPlaceType: string;
    schedule: string[];
    hoursPerWeek: number | null;
    benefits: string[];
    languages: string[];
    description: string;
    responsibilities: string;
    fileInstruction: string;
    questions: ValunteerFormQuestionPayload[];
}

export interface CreatedPostResponse {
    id: number;
}

export const submitJobPost = async (payload: JobPostSubmitPayload) => {
    return requestJson<CreatedPostResponse>("/api/posts", {
        method: "POST",
        body: JSON.stringify({
            postType: "job",
            ...payload,
        }),
    });
};

export const submitVolunteerPost = async (payload: VolunteerPostSubmitPayload) => {
    const postResponse = await requestJson<CreatedPostResponse>("/api/posts", {
        method: "POST",
        body: JSON.stringify({
            postType: "volunteer",
            title: payload.title,
            durationYears: payload.durationYears,
            durationMonths: payload.durationMonths,
            durationDays: payload.durationDays,
            volunteerPlaceType: payload.volunteerPlaceType,
            schedule: payload.schedule,
            hoursPerWeek: payload.hoursPerWeek,
            benefits: payload.benefits,
            languages: payload.languages,
            description: payload.description,
            responsibilities: payload.responsibilities,
            fileInstruction: payload.fileInstruction,
        }),
    });

    if (payload.questions.length > 0) {
        await requestJson<void>(`/api/posts/${postResponse.id}/volunteer-form-questions`, {
            method: "POST",
            body: JSON.stringify({
                questions: payload.questions,
            }),
        });
    }

    return postResponse;
};