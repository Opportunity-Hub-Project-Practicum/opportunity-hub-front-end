import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextAreaBox from '../../../GlobalComponents/textAreaBox';
import type { JobLevel, JobPostSubmitPayload } from '../types/postApplication';

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

export default function PostJobForm({ onSubmit, isSubmitting = false }: PostJobFormProps) {
    const [description, setDescription] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [jobRequirements, setJobRequirements] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);

        try {
            await onSubmit({
                title: getString(formData.get("title")),
                jobRole: getString(formData.get("jobRole")),
                minSalary: parseNumberOrNull(formData.get("minSalary")),
                maxSalary: parseNumberOrNull(formData.get("maxSalary")),
                education: getString(formData.get("education")),
                experience: getString(formData.get("experience")),
                jobType: getString(formData.get("jobType")),
                workPlaceType: getString(formData.get("workPlaceType")) as JobPostSubmitPayload["workPlaceType"],
                expirationDate: getString(formData.get("expirationDate")),
                jobLevel: getString(formData.get("jobLevel")) as JobLevel | "",
                location: getString(formData.get("location")),
                description,
                responsibilities,
                jobRequirements,
            });

            event.currentTarget.reset();
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
                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Role</label>
                        <div className="relative">
                            <select name="jobRole" required className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                <option value="">Select...</option>
                                <option value="Software Engineer">Software Engineer</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="UI Designer">UI Designer</option>
                                <option value="Project Manager">Project Manager</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="City, Country"
                            className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Type</label>
                        <div className="relative">
                            <select name="jobType" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                <option value="">Select...</option>
                                <option value="part_time">Part time</option>
                                <option value="full_time">Full time</option>
                                <option value="internship">Internship</option>
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
                                <select name="education" required className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                    <option value="High School">High School</option>
                                    <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                                    <option value="Master's Degree">Master&apos;s Degree</option>
                                    <option value="PhD">PhD</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Experience</label>
                            <div className="relative">
                                <select name="experience" required className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                    <option value="No experience required">No experience required</option>
                                    <option value="1-2 years">1-2 years</option>
                                    <option value="3-5 years">3-5 years</option>
                                    <option value="5+ years">5+ years</option>
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
                                    className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10"
                                >
                                    <option value="">Select...</option>
                                    <option value="remote">Remote</option>
                                    <option value="onsite">Onsite</option>
                                    <option value="hybrid">Hybrid</option>
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
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Level</label>
                            <div className="relative">
                                <select name="jobLevel" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                    <option value="entry_level">Entry Level</option>
                                    <option value="mid_level">Mid Level</option>
                                    <option value="expert_level">Expert Level</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
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
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center space-x-2 bg-[#0A65CC] text-white px-6 py-3.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors"
                    >
                        <span>{isSubmitting ? "Posting..." : "Post Job"}</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
