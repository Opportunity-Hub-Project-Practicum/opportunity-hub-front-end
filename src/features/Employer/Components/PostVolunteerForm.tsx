import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown, Paperclip, PlusCircle } from 'lucide-react';
import TextAreaBox from '../../../GlobalComponents/textAreaBox';
import type { VolunteerPostSubmitPayload } from '../services/postApplicationService';

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

const createQuestion = (order: number) => ({
    id: `${Date.now()}-${order}-${Math.random().toString(36).slice(2, 8)}`,
    value: "",
});

export default function PostVolunteerForm({ onSubmit, isSubmitting = false }: PostVolunteerFormProps) {
    const [description, setDescription] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [fileInstruction, setFileInstruction] = useState("");
    const [questions, setQuestions] = useState(Array.from({ length: 2 }, (_, index) => createQuestion(index + 1)));
    const [error, setError] = useState<string | null>(null);

    const handleQuestionChange = (id: string, value: string) => {
        setQuestions((currentQuestions) =>
            currentQuestions.map((question) => (question.id === id ? { ...question, value } : question))
        );
    };

    const handleAddQuestion = () => {
        setQuestions((currentQuestions) => [...currentQuestions, createQuestion(currentQuestions.length + 1)]);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const questionsPayload = questions
            .map((question, index) => ({
                question: question.value.trim(),
                order: index + 1,
            }))
            .filter((question) => question.question.length > 0);

        const schedule = formData.getAll("schedule").map((value) => value.toString());
        const benefits = formData.getAll("benefits").map((value) => value.toString());
        const languages = formData.getAll("languages").map((value) => value.toString());

        try {
            await onSubmit({
                title: formData.get("title")?.toString().trim() ?? "",
                durationYears: parseNumberOrNull(formData.get("durationYears")?.toString() ?? ""),
                durationMonths: parseNumberOrNull(formData.get("durationMonths")?.toString() ?? ""),
                durationDays: parseNumberOrNull(formData.get("durationDays")?.toString() ?? ""),
                volunteerPlaceType: formData.get("volunteerPlaceType")?.toString().trim() ?? "",
                schedule,
                hoursPerWeek: parseNumberOrNull(formData.get("hoursPerWeek")?.toString() ?? ""),
                benefits,
                languages,
                description,
                responsibilities,
                fileInstruction,
                questions: questionsPayload,
            });

            event.currentTarget.reset();
            setDescription("");
            setResponsibilities("");
            setFileInstruction("");
            setQuestions(Array.from({ length: 2 }, (_, index) => createQuestion(index + 1)));
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

                {/* Volunteer Title */}
                <div className="w-full">
                    <label className="block text-sm font-medium mb-2 text-[#18191C]">Volunteer Tittle</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="title of the post"
                        className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md placeholder-[#767F8C] focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Duration & Volunteer Place Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Duration</label>
                        <div className="flex items-center space-x-3 text-sm text-[#474C54]">
                            <div className="flex items-center space-x-2 border border-[#E4E5E8] rounded-md px-3 py-2 bg-white">
                                <span>Year:</span>
                                <input name="durationYears" type="text" className="w-12 outline-none text-center text-[#18191C]" />
                            </div>
                            <div className="flex items-center space-x-2 border border-[#E4E5E8] rounded-md px-3 py-2 bg-white">
                                <span>Month:</span>
                                <input name="durationMonths" type="text" className="w-12 outline-none text-center text-[#18191C]" />
                            </div>
                            <div className="flex items-center space-x-2 border border-[#E4E5E8] rounded-md px-3 py-2 bg-white">
                                <span>Day:</span>
                                <input name="durationDays" type="text" className="w-12 outline-none text-center text-[#18191C]" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#18191C]">Volunteer place type</label>
                        <div className="relative">
                            <select name="volunteerPlaceType" className="w-full px-4 py-3 border border-[#E4E5E8] rounded-md appearance-none bg-white text-[#767F8C] focus:outline-none focus:border-blue-500 text-sm pr-10">
                                <option value="">Select...</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Schedule & Hours Per Week */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                        <label className="block text-sm font-medium mb-3 text-[#18191C]">Schedule</label>
                        <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                                <input name="schedule" value="weekend" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                                <span>Weekend</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                                <input name="schedule" value="weekday" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                                <span>Weekday</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-[#474C54] cursor-pointer">
                                <input name="schedule" value="flexible" type="checkbox" className="w-4 h-4 rounded border-[#E4E5E8] text-[#0A65CC] focus:ring-[#0A65CC]" />
                                <span>Flexible</span>
                            </label>
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

                {/* Benefit Checkboxes */}
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

                {/* Language Checkboxes */}
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

                {/* Description & Responsibility Section */}
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

                {/* Improved Create Form Section */}
                <div className="w-full space-y-4 pt-2">
                    <h3 className="text-base font-semibold text-[#18191C]">Create Form</h3>

                    <div className="w-full space-y-3">
                        {questions.map((question, index) => (
                            <div key={question.id} className="flex items-center space-x-4 w-full">
                                <span className="text-sm font-medium text-[#767F8C] min-w-5">{index + 1}.</span>
                                <input
                                    type="text"
                                    value={question.value}
                                    onChange={(event) => handleQuestionChange(question.id, event.target.value)}
                                    placeholder="Enter your question"
                                    className="w-full max-w-xl px-4 py-2.5 border border-[#E4E5E8] rounded-md placeholder-[#9199A3] focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        ))}

                        {/* Redesigned File Submit / Instruction Field */}
                        <div className="flex items-center space-x-4 w-full">
                            <span className="text-sm font-medium text-[#767F8C] min-w-5">{questions.length + 1}.</span>
                            <div className="w-full max-w-xl relative flex items-center">
                                <input
                                    type="text"
                                    value={fileInstruction}
                                    onChange={(event) => setFileInstruction(event.target.value)}
                                    placeholder="Enter instruction for volunteer to submit file details"
                                    className="w-full px-4 py-2.5 border border-red-200 rounded-md placeholder-[#9199A3] focus:outline-none focus:border-red-400 bg-red-50/20 text-sm pr-10"
                                />
                                <Paperclip className="absolute right-3 h-4 w-4 text-red-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Action Action Row Buttons */}
                    <div className="flex items-center justify-end max-w-xl space-x-3 pt-2">
                        <button
                            type="button"
                            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-orange-500 text-orange-500 rounded-md text-xs font-medium hover:bg-orange-50/50 transition-colors"
                        >
                            <Paperclip className="h-3.5 w-3.5" />
                            <span>Add file submit place</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-orange-500 text-orange-500 rounded-md text-xs font-medium hover:bg-orange-50/50 transition-colors"
                        >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Add question</span>
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
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