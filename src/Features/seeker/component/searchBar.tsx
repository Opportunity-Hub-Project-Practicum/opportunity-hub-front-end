import { useState } from "react";
import { Search, MapPin, Layers, ChevronDown } from "lucide-react";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [advancedFilter, setAdvancedFilter] = useState(false);
    const [opportunityType, setOpportunityType] = useState("job");

    // Filter states
    const [experience, setExperience] = useState("");
    const [salary, setSalary] = useState("");
    const [jobLevel, setJobLevel] = useState("");
    const [jobTypes, setJobTypes] = useState<string[]>([]);
    const [education, setEducation] = useState<string[]>([]);

    const handleJobTypeChange = (type: string) => {
        setJobTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const handleEducationChange = (edu: string) => {
        setEducation((prev) =>
            prev.includes(edu) ? prev.filter((e) => e !== edu) : [...prev, edu]
        );
    };

    const handleSearch = () => {
        console.log({
            searchTerm,
            location,
            category,
            experience,
            salary,
            jobLevel,
            jobTypes,
            education,
            opportunityType,
        });
    };

    return (
        <div className="w-full overflow-x-hidden px-5 py-6 md:px-4 lg:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Main Search Container */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2 rounded-lg bg-white p-3 shadow-lg border border-slate-200">
                    {/* Search Bar */}
                    <div className="flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-2">
                        <input
                            type="text"
                            placeholder="Job tittle, Keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none font-inter"
                        />
                        <Search size={18} className="text-slate-600" />
                    </div>

                    {/* Divider */}
                    <div className="hidden h-6 w-px bg-slate-200 lg:block"></div>

                    {/* Location Select */}
                    <div className="flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-2">
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-slate-600 outline-none font-inter cursor-pointer appearance-none"
                        >
                            <option value="">Location</option>
                            <option value="new-york">New York</option>
                            <option value="los-angeles">Los Angeles</option>
                            <option value="chicago">Chicago</option>
                            <option value="remote">Remote</option>
                        </select>
                        <MapPin size={18} className="text-slate-600" />
                    </div>

                    {/* Divider */}
                    <div className="hidden h-6 w-px bg-slate-200 lg:block"></div>

                    {/* Category Select */}
                    <div className="flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-slate-600 outline-none font-inter cursor-pointer appearance-none"
                        >
                            <option value="">Select Category</option>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="marketing">Marketing</option>
                            <option value="education">Education</option>
                        </select>
                        <Layers size={18} className="text-slate-600" />
                        <ChevronDown size={18} className="text-slate-600" />
                    </div>

                    {/* Divider */}
                    <div className="hidden h-6 w-px bg-slate-200 lg:block"></div>

                    {/* Advanced Filter */}
                    <button
                        onClick={() => setAdvancedFilter(!advancedFilter)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition font-inter text-sm font-medium whitespace-nowrap"
                    >
                        Filter
                        <ChevronDown
                            size={18}
                            className={`transition-transform ${advancedFilter ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Divider */}
                    <div className="hidden h-6 w-px bg-slate-200 lg:block"></div>

                    {/* Find Job Button */}
                    <button
                        onClick={handleSearch}
                        className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 whitespace-nowrap"
                    >
                        Find Job
                    </button>

                    {/* Volunteer Button */}
                    <button
                        onClick={() => setOpportunityType("volunteer")}
                        className="flex items-center justify-center rounded-md px-4 py-2 text-xs font-bold text-white transition whitespace-nowrap"
                        style={{
                            backgroundColor: "rgba(11, 207, 31, 0.35)",
                        }}
                    >
                        Volunteer
                    </button>
                </div>

                {/* Advanced Filter Panel */}
                {advancedFilter && (
                    <div className="mt-4 rounded-lg bg-white p-6 shadow-lg border border-slate-200">
                        <h3 className="font-inter text-lg font-bold text-slate-900 mb-6">
                            Advanced Filters
                        </h3>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                            {/* 1. Experience */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                    Experience
                                </h4>
                                <div className="space-y-2">
                                    {["Freshers", "1 - 2 Years", "2 - 4 Years", "6 - 8 Years", "8 - 10 Years", "10 - 15 Years", "15+ Years"].map((exp) => (
                                        <label key={exp} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="experience"
                                                value={exp}
                                                checked={experience === exp}
                                                onChange={(e) => setExperience(e.target.value)}
                                                className="w-4 h-4 text-blue-600 cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700">{exp}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Salary */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                    Salary
                                </h4>
                                <div className="space-y-2">
                                    {["$50 - $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $15,000", "$15,000+"].map((sal) => (
                                        <label key={sal} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="salary"
                                                value={sal}
                                                checked={salary === sal}
                                                onChange={(e) => setSalary(e.target.value)}
                                                className="w-4 h-4 text-blue-600 cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700">{sal}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Job Type */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                    Job Type
                                </h4>
                                <div className="space-y-2">
                                    {["All", "Part Time", "Internship", "Remote", "Temporary", "Contract Base"].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={jobTypes.includes(type)}
                                                onChange={() => handleJobTypeChange(type)}
                                                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Education */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                    Education
                                </h4>
                                <div className="space-y-2">
                                    {["All", "High School", "Intermediate", "Bachelor Degree", "Master Degree"].map((edu) => (
                                        <label key={edu} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={education.includes(edu)}
                                                onChange={() => handleEducationChange(edu)}
                                                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700">{edu}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 5. Job Level */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                    Job Level
                                </h4>
                                <div className="space-y-2">
                                    {["Entry Level", "Expert Level"].map((level) => (
                                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="jobLevel"
                                                value={level}
                                                checked={jobLevel === level}
                                                onChange={(e) => setJobLevel(e.target.value)}
                                                className="w-4 h-4 text-blue-600 cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Apply Filters Button */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleSearch}
                                className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => {
                                    setExperience("");
                                    setSalary("");
                                    setJobLevel("");
                                    setJobTypes([]);
                                    setEducation([]);
                                }}
                                className="px-6 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-300 transition"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
