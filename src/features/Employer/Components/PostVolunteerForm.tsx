import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextAreaBox from '../../../GlobalComponents/textAreaBox';
import type { PostDuration, PostSchedule, VolunteerPostSubmitPayload } from '../types/postApplication';

interface PostVolunteerFormProps {
    onSubmit: (payload: VolunteerPostSubmitPayload) => Promise<void> | void;
    isSubmitting?: boolean;
}

const parseNumberOrNull = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isNaN(parsedValue) ? null : parsedValue;
};

export default function PostVolunteerForm({ onSubmit, isSubmitting = false }: PostVolunteerFormProps) {
    const [description, setDescription] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const benefits = formData.getAll("benefits").map((value) => value.toString());
        const languages = formData.getAll("languages").map((value) => value.toString());

        try {
            await onSubmit({
                title: formData.get("title")?.toString().trim() ?? "",
                duration: (formData.get("duration")?.toString().trim() ?? "") as PostDuration | "",
                volunteerPlaceType: formData.get("volunteerPlaceType")?.toString().trim() ?? "",
                schedule: (formData.get("schedule")?.toString().trim() ?? "") as PostSchedule | "",
                hoursPerWeek: parseNumberOrNull(formData.get("hoursPerWeek")?.toString() ?? ""),
                benefits,
                languages,
                description,
                responsibilities,
            });

            event.currentTarget.reset();
            setDescription("");
            setResponsibilities("");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to post volunteer form.");
        }
    };

    return (
        <div className="w-full bg-white min-h-screen p-8 text-[#18191C]">
            <form onSubmit={handleSubmit} className="w-full space-y-6">
                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Duration</label>
                        <div className="relative">
                            <select name="duration" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                <option value="">Select...</option>
                                <option value="one-time">One-time</option>
                                <option value="short-term">Short-term</option>
                                <option value="long-term">Long-term</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Volunteer place type</label>
                        <div className="relative">
                            <select name="volunteerPlaceType" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                <option value="">Select...</option>
                                <option value="remote">Remote</option>
                                <option value="onsite">Onsite</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Schedule</label>
                        <div className="relative">
                            <select name="schedule" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                <option value="">Select...</option>
                                <option value="weekdays">Weekdays</option>
                                <option value="weekend">Weekend</option>
                                <option value="flexible">Flexible</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Hours per week</label>
                        <input
                            type="text"
                            name="hoursPerWeek"
                            placeholder="text..."
                            className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium mb-3 text-[#18191C]">Benefit</label>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                            <input name="benefits" value="training" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                            <span>Training</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                            <input name="benefits" value="certificate" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                            <span>Certificate</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                            <input name="benefits" value="stipend" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                            <span>Stipend</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                            <input name="benefits" value="transportation_meals" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                            <span>Transportation/ meals</span>
                        </label>
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium mb-3 text-[#18191C]">Language</label>
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                            <input name="languages" value="khmer" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                            <span>Khmer</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                            <input name="languages" value="english" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                            <span>English</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                            <input name="languages" value="other" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                            <span>Other</span>
                        </label>
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
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center space-x-2 bg-[#0A65CC] text-white px-6 py-3.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors"
                    >
                        <span>{isSubmitting ? "Posting..." : "Post Volunteer"}</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
