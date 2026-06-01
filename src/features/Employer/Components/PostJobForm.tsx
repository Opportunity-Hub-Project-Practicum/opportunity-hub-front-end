import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextAreaBox from '../../../GlobalComponents/textAreaBox';
import type { JobPostSubmitPayload } from '../services/postApplicationService';

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
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const tags = getString(formData.get("tags"))
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        try {
            await onSubmit({
                title: getString(formData.get("title")),
                tags,
                jobRole: getString(formData.get("jobRole")),
                minSalary: parseNumberOrNull(formData.get("minSalary")),
                maxSalary: parseNumberOrNull(formData.get("maxSalary")),
                salaryType: getString(formData.get("salaryType")),
                education: getString(formData.get("education")),
                experience: getString(formData.get("experience")),
                jobType: getString(formData.get("jobType")),
                vacancies: parseNumberOrNull(formData.get("vacancies")),
                expirationDate: getString(formData.get("expirationDate")),
                jobLevel: getString(formData.get("jobLevel")),
                description,
                responsibilities,
            });

            event.currentTarget.reset();
            setDescription("");
            setResponsibilities("");
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

                {/* Job Title */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Tittle</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Add job tittle, role, vacancies etc"
                        className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Tags & Job Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            placeholder="Job keyword, tags etc..."
                            className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Role</label>
                        <div className="relative">
                            <select name="jobRole" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                <option value="">Select...</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Salary Section */}
                <div className="w-full space-y-4">
                    <h3 className="text-base font-semibold text-[#18191C] pt-2">Salery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Min Salery</label>
                            <div className="flex rounded-md border border-[#E4E5E8] overflow-hidden focus-within:border-blue-500">
                                <input
                                    type="text"
                                    name="minSalary"
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
                                    placeholder="Maximum salary..."
                                    className="w-full px-4 py-3 placeholder-[#767F8C] focus:outline-none text-sm"
                                />
                                <span className="bg-[#F1F2F4] text-[#474C54] px-4 py-3 text-sm border-l border-[#E4E5E8] flex items-center justify-center min-w-15">USD</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Salery Type</label>
                            <div className="relative">
                                <select name="salaryType" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advance Information Section */}
                <div className="w-full space-y-4">
                    <h3 className="text-base font-semibold text-[#18191C] pt-2">Advance Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Education</label>
                            <div className="relative">
                                <select name="education" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Experience</label>
                            <div className="relative">
                                <select name="experience" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Type</label>
                            <div className="relative">
                                <select name="jobType" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-2">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Vacancies</label>
                            <div className="relative">
                                <select name="vacancies" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Expiration Date</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="expirationDate"
                                    placeholder="DD/MM/YYYY"
                                    className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#18191C]">Job Level</label>
                            <div className="relative">
                                <select name="jobLevel" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                    <option value="">Select...</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description & Responsibility Section */}
                <div className="w-full space-y-6">
                    <h3 className="text-base font-semibold text-[#18191C] pt-2">Description & Responsibility</h3>

                    {/* Description Editor Wrapper */}
                    <TextAreaBox value={description} onChange={setDescription} />

                    {/* Responsibilities Editor Wrapper */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Responsibilities</label>
                        <TextAreaBox value={responsibilities} onChange={setResponsibilities} />
                    </div>
                </div>

                {/* Submit Button */}
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