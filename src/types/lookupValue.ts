export type LookupValueItem = {
    value: string;
    name: string;
};

export type LookupValuesByType = Record<string, LookupValueItem[]>;

export type LookupValuesResponse = {
    success: boolean;
    message: string;
    data: LookupValuesByType;
};

export const LOOKUP_TYPES = {
    experience: "experience",
    jobLevel: "job_level",
    education: "education",
    jobType: "job_type",
    workPlaceType: "work_place_type",
    duration: "duration",
    schedule: "schedule",
    hoursPerWeek: "hours_per_week",
    benefits: "benefits",
    languageRequirement: "language_requirement",
    location: "location",
    jobRole: "job_role",
} as const;
