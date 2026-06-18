import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextAreaBox from '../../../GlobalComponents/textAreaBox';
import { getLookupOptions, useLookupValues } from '../../../hooks/useLookupValues';
import { LOOKUP_TYPES } from '../../../types/lookupValue';
import type { PostDuration, PostSchedule, VolunteerPostSubmitPayload } from '../types/postApplication';

interface PostVolunteerFormProps {
    onSubmit: (payload: VolunteerPostSubmitPayload) => Promise<void> | void;
    isSubmitting?: boolean;
}

const selectClassName =
    "w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10";

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

export default function PostVolunteerForm({ onSubmit, isSubmitting = false }: PostVolunteerFormProps) {
    const { lookupValues, loading, error: lookupError } = useLookupValues();
    const [description, setDescription] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [volunteerRequirements, setVolunteerRequirements] = useState("");
    const [error, setError] = useState<string | null>(null);

    const durationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.duration);
    const jobRoleOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobRole);
    const workPlaceOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.workPlaceType);
    const scheduleOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.schedule);
    const hoursOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.hoursPerWeek);
    const benefitOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.benefits, ["all"]);
    const languageOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.languageRequirement, ["none"]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const benefits = formData.getAll("benefits").map((value) => value.toString());

        try {
            await onSubmit({
                title: formData.get("title")?.toString().trim() ?? "",
                jobRoleId: parseNumberOrNull(formData.get("jobRoleId")),
                duration: (formData.get("duration")?.toString().trim() ?? "") as PostDuration | "",
                volunteerPlaceType: formData.get("volunteerPlaceType")?.toString().trim() ?? "",
                schedule: (formData.get("schedule")?.toString().trim() ?? "") as PostSchedule | "",
                hoursPerWeek: formData.get("hoursPerWeek")?.toString().trim() ?? "",
                benefits,
                language: formData.get("language")?.toString().trim() ?? "",
                description,
                responsibilities,
                volunteerRequirements,
                isUrgent: formData.get("isUrgent") === "on",
            });

            form.reset();
            setDescription("");
            setResponsibilities("");
            setVolunteerRequirements("");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to post volunteer form.");
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
                    <label className="block text-sm font-medium mb-2 text-[#18191C]">Volunteer Tittle</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="title of the post"
                        className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                <div className="w-full max-w-md">
                    <label className="block text-sm font-medium mb-2 text-[#18191C]">Category</label>
                    <div className="relative">
                        <select name="jobRoleId" disabled={loading} className={selectClassName}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Duration</label>
                        <div className="relative">
                            <select name="duration" disabled={loading} className={selectClassName}>
                                <option value="">Select...</option>
                                {durationOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Volunteer place type</label>
                        <div className="relative">
                            <select name="volunteerPlaceType" disabled={loading} className={selectClassName}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Schedule</label>
                        <div className="relative">
                            <select name="schedule" disabled={loading} className={selectClassName}>
                                <option value="">Select...</option>
                                {scheduleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Hours per week</label>
                        <div className="relative">
                            <select name="hoursPerWeek" disabled={loading} className={selectClassName}>
                                <option value="">Select...</option>
                                {hoursOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium mb-3 text-[#18191C]">Benefit</label>
                    <div className="flex flex-wrap gap-6">
                        {benefitOptions.map((option) => (
                            <label key={option.value} className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                                <input
                                    name="benefits"
                                    value={option.value}
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]"
                                />
                                <span>{option.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium mb-2 text-[#18191C]">Language</label>
                    <div className="relative max-w-md">
                        <select name="language" disabled={loading} className={selectClassName}>
                            <option value="">Select...</option>
                            {languageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                    </div>
                </div>

                <div className="w-full space-y-6">
                    <h3 className="text-base font-semibold text-[#18191C] pt-2">Description & Responsibility</h3>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Description</label>
                        <TextAreaBox value={description} onChange={setDescription} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Responsibilities</label>
                        <TextAreaBox value={responsibilities} onChange={setResponsibilities} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Volunteer Requirements</label>
                        <TextAreaBox value={volunteerRequirements} onChange={setVolunteerRequirements} />
                    </div>
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-[#18191C]">
                        <input
                            type="checkbox"
                            name="isUrgent"
                            className="h-4 w-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-blue-500"
                        />
                        Urgent hiring needed
                    </label>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="inline-flex items-center justify-center space-x-2 bg-[#0A65CC] text-white px-6 py-3.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                        <span>{isSubmitting ? "Posting..." : "Post Volunteer"}</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
