import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextAreaBox from '../../../GlobalComponents/textAreaBox';
import { getLookupOptions, useLookupValues } from '../../../hooks/useLookupValues';
import { LOOKUP_TYPES } from '../../../types/lookupValue';
import type { JobPostSubmitPayload } from '../types/postApplication';

interface PostJobFormProps {
    onSubmit: (payload: JobPostSubmitPayload) => Promise<void> | void;
    isSubmitting?: boolean;
}

const parseNumberOrNull = (value: FormDataEntryValue | null) => {
    if (value === null) {
        return null;
    }

    const trimmedValue = value.toString().trim();
    if (!trimmedValue) {
        return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isNaN(parsedValue) ? null : parsedValue;
};

const getString = (value: FormDataEntryValue | null) => (value ? value.toString().trim() : "");

const selectClassName =
    "w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10";

export default function PostJobForm({ onSubmit, isSubmitting = false }: PostJobFormProps) {
    const { lookupValues, loading, error: lookupError } = useLookupValues();
    const [description, setDescription] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [jobRequirements, setJobRequirements] = useState("");
    const [error, setError] = useState<string | null>(null);

    const jobTypeOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobType);
    const locationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.location);
    const jobRoleOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobRole);
    const workPlaceOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.workPlaceType);
    const educationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.education);
    const experienceOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.experience);
    const jobLevelOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobLevel);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            await onSubmit({
                title: getString(formData.get("title")),
                jobType: getString(formData.get("jobType")),
                minSalary: parseNumberOrNull(formData.get("minSalary")),
                maxSalary: parseNumberOrNull(formData.get("maxSalary")),
                education: getString(formData.get("education")),
                experience: getString(formData.get("experience")),
                workPlaceType: getString(formData.get("workPlaceType")) as JobPostSubmitPayload["workPlaceType"],
                expirationDate: getString(formData.get("expirationDate")),
                jobLevel: getString(formData.get("jobLevel")),
                locationId: parseNumberOrNull(formData.get("locationId")),
                jobRoleId: parseNumberOrNull(formData.get("jobRoleId")),
                description,
                responsibilities,
                jobRequirements,
                isUrgent: formData.get("isUrgent") === "on",
            });

            form.reset();
            setDescription("");
            setResponsibilities("");
            setJobRequirements("");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to post job.");
        }
    };

    return (
        <div className="w-full bg-white min-h-screen p-8 text-[#18191C]">
            <form onSubmit={handleSubmit} className="w-full space-y-6">
                {(error || lookupError) && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error ?? lookupError}
                    </div>
                )}

                <div className="w-full">
                    <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Tittle</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Add job title and role"
                        className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Type</label>
                        <div className="relative">
                            <select
                                name="jobType"
                                required
                                disabled={loading}
                                className={selectClassName}
                            >
                                <option value="">Select...</option>
                                {jobTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Category</label>
                        <div className="relative">
                            <select
                                name="jobRoleId"
                                disabled={loading}
                                className={selectClassName}
                            >
                                <option value="">Select...</option>
                                {jobRoleOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Location</label>
                        <div className="relative">
                            <select
                                name="locationId"
                                disabled={loading}
                                className={selectClassName}
                            >
                                <option value="">Select...</option>
                                {locationOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Work Place Type</label>
                        <div className="relative">
                            <select
                                name="workPlaceType"
                                required
                                disabled={loading}
                                className={selectClassName}
                            >
                                <option value="">Select...</option>
                                {workPlaceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <h3 className="text-base font-semibold text-[#18191C] pt-2">Salery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Min Salery</label>
                            <div className="flex rounded-md border border-[#E4E5E8] overflow-hidden focus-within:border-blue-500">
                                <input
                                    type="text"
                                    name="minSalary"
                                    required
                                    placeholder="Minimum salary..."
                                    className="w-full px-4 py-3 placeholder-[#767F8C] focus:outline-none text-sm"
                                />
                                <span className="bg-[#F1F2F4] text-[#474C54] px-4 py-3 text-sm border-l border-[#E4E5E8] flex items-center justify-center min-w-15">USD</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Max Salery</label>
                            <div className="flex rounded-md border border-[#E4E5E8] overflow-hidden focus-within:border-blue-500">
                                <input
                                    type="text"
                                    name="maxSalary"
                                    required
                                    placeholder="Maximum salary..."
                                    className="w-full px-4 py-3 placeholder-[#767F8C] focus:outline-none text-sm"
                                />
                                <span className="bg-[#F1F2F4] text-[#474C54] px-4 py-3 text-sm border-l border-[#E4E5E8] flex items-center justify-center min-w-15">USD</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <h3 className="text-base font-semibold text-[#18191C] pt-2">Advance Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Education</label>
                            <div className="relative">
                                <select name="education" required disabled={loading} className={selectClassName}>
                                    <option value="">Select...</option>
                                    {educationOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Experience</label>
                            <div className="relative">
                                <select name="experience" required disabled={loading} className={selectClassName}>
                                    <option value="">Select...</option>
                                    {experienceOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Level</label>
                            <div className="relative">
                                <select name="jobLevel" disabled={loading} className={selectClassName}>
                                    <option value="">Select...</option>
                                    {jobLevelOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-2">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Expiration Date</label>
                            <input
                                type="text"
                                name="expirationDate"
                                placeholder="DD/MM/YYYY"
                                className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#18191C]">
                                <input
                                    type="checkbox"
                                    name="isUrgent"
                                    className="h-4 w-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-blue-500"
                                />
                                Urgent hiring needed
                            </label>
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-6">
                    <h3 className="text-base font-semibold text-[#18191C] pt-2">Description</h3>
                    <TextAreaBox value={description} onChange={setDescription} />
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Responsibilities</label>
                        <TextAreaBox value={responsibilities} onChange={setResponsibilities} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Requirements</label>
                        <TextAreaBox value={jobRequirements} onChange={setJobRequirements} />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="inline-flex items-center justify-center space-x-2 bg-[#0A65CC] text-white px-6 py-3.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                        <span>{isSubmitting ? "Posting..." : "Post Job"}</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
