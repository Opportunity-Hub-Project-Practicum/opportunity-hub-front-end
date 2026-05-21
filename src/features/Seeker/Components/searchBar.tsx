import { useState, useEffect } from "react";
import { Search, MapPin, Layers, ChevronDown } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { opportunityTypeContext, setOpportunityTypeContext, type OpportunityType } from "../../../contexts/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Posts, getOrganizationById, formatSalary } from "../../../services/postService";

interface SearchBarProps {
    onResultsChange?: (results: any[]) => void;
    onLoadingChange?: (loading: boolean) => void;
}

export default function SearchBar({ onResultsChange }: SearchBarProps) {
    const navigate = useNavigate();
    const opportunityType = useContext(opportunityTypeContext);
    const setOpportunityType = useContext(setOpportunityTypeContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [advancedFilter, setAdvancedFilter] = useState(false);

    // Job Filter states
    const [experience, setExperience] = useState("");
    const [salary, setSalary] = useState("");
    const [jobLevel, setJobLevel] = useState("");
    const [jobTypes, setJobTypes] = useState<string[]>([]);
    const [education, setEducation] = useState<string[]>([]);

    // Volunteer Filter states
    const [duration, setDuration] = useState("");
    const [schedule, setSchedule] = useState<string[]>([]);
    const [hoursPerWeek, setHoursPerWeek] = useState("");
    const [benefits, setBenefits] = useState<string[]>([]);
    const [languageRequirement, setLanguageRequirement] = useState("");

    // Track applied filters - only updated on Apply button click
    const [appliedFilters, setAppliedFilters] = useState<any>({});

    // Toggle helpers
    const toggleArray = (value: string, setter: Function, state: string[]) => {
        setter(
            state.includes(value)
                ? state.filter((v) => v !== value)
                : [...state, value]
        );
    };

    // Handle Apply button click
    const handleApplyFilters = () => {
        setAppliedFilters(
            opportunityType === "job"
                ? { experience, salary, jobLevel, jobTypes, education }
                : { duration, schedule, hoursPerWeek, benefits, languageRequirement }
        );

        // Navigate to PostList with results
        navigate('/postList', {
            state: {
                results,
                filters: opportunityType === "job"
                    ? { experience, salary, jobLevel, jobTypes, education }
                    : { duration, schedule, hoursPerWeek, benefits, languageRequirement },
                searchTerm,
                location,
                category,
                opportunityType
            }
        });
    };

    //  Payload (core of modern search)
    const payload = {
        query: searchTerm,
        location,
        category,
        opportunityType,
        filters: appliedFilters,
    };

    //  Hook handles debounce + API
    const { results, loading } = useSearch(payload);

    useEffect(() => {
        onResultsChange?.(results);
    }, [results, onResultsChange, searchTerm]);

    // Handle Enter key press
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Filter Posts based on search input
            const filteredResults = Posts.filter(post => {
                const matchesType = post.type === opportunityType;
                const matchesSearchTerm = !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesLocation = !location || post.location === location;
                const matchesCategory = !category || post.category === category;

                return matchesType && matchesSearchTerm && matchesLocation && matchesCategory;
            });

            navigate('/postList', {
                state: {
                    results: filteredResults,
                    filters: appliedFilters,
                    searchTerm,
                    location,
                    category,
                    opportunityType
                }
            });
        }
    };

    return (
        <div className="w-full overflow-x-hidden px-5 py-6 md:px-4 lg:px-6">
            <div className="mx-auto max-w-7xl">

                {/* MAIN SEARCH */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2 rounded-lg bg-white p-3 shadow-lg border border-slate-200">

                    {/* SEARCH INPUT */}
                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <input
                            type="text"
                            placeholder="Job title, keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyPress}
                            className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <Search size={18} className="text-slate-500" />
                    </div>

                    <div className="hidden lg:block h-6 w-px bg-slate-200"></div>

                    {/* LOCATION */}
                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none cursor-pointer"
                        >
                            <option value="">Location</option>
                            <option value="remote">Remote</option>
                        </select>
                        <MapPin size={18} className="text-slate-500" />
                    </div>

                    <div className="hidden lg:block h-6 w-px bg-slate-200"></div>

                    {/* CATEGORY */}
                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none cursor-pointer"
                        >
                            <option value="">Category</option>
                            <option value="tech">Technology</option>
                            <option value="health">Healthcare</option>
                        </select>
                        <Layers size={18} className="text-slate-500" />

                    </div>

                    <div className="hidden lg:block h-6 w-px bg-slate-200"></div>

                    {/* FILTER TOGGLE */}
                    <button
                        onClick={() => setAdvancedFilter(!advancedFilter)}
                        className="flex items-center gap-2 text-sm"
                    >
                        Filter
                        <ChevronDown className={advancedFilter ? "rotate-180" : ""} />
                    </button>

                    <div className="hidden lg:block h-6 w-px bg-slate-200"></div>

                    {/* TYPE SWITCH */}
                    <button
                        onClick={() => setOpportunityType("job")}
                        className={`px-4 py-2 rounded ${opportunityType === "job"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200"
                            }`}
                    >
                        Job
                    </button>

                    <button
                        onClick={() => setOpportunityType("volunteer")}
                        className={`px-4 py-2 rounded ${opportunityType === "volunteer"
                            ? "bg-green-500 text-white"
                            : "bg-slate-200"
                            }`}
                    >
                        Volunteer
                    </button>
                </div>

                {/* ADVANCED FILTER */}
                {advancedFilter && (
                    <div className="mt-4 bg-white p-6 border rounded-lg shadow">

                        {opportunityType === "job" ? (
                            // Job Filters
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
                                                    value={exp}
                                                    checked={experience === exp}
                                                    onChange={() => setExperience(exp)}
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
                                                    value={sal}
                                                    checked={salary === sal}
                                                    onChange={() => setSalary(sal)}
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
                                                    onChange={() => toggleArray(type, setJobTypes, jobTypes)}
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
                                                    onChange={() => toggleArray(edu, setEducation, education)}
                                                    checked={education.includes(edu)}
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
                                                    value={level}
                                                    onChange={() => setJobLevel(level)}
                                                    checked={jobLevel === level}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Volunteer Filters
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                                {/* 1. Duration */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                        Duration
                                    </h4>
                                    <div className="space-y-2">
                                        {["One-Time", "Short-Term (1-4 weeks)", "Long-Term (1+ months)"].map((dur) => (
                                            <label key={dur} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={dur}
                                                    onChange={() => setDuration(dur)}
                                                    checked={duration === dur}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{dur}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Schedule */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                        Schedule
                                    </h4>
                                    <div className="space-y-2">
                                        {["Weekdays", "Weekend", "Flexible"].map((sched) => (
                                            <label key={sched} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    onChange={() => toggleArray(sched, setSchedule, schedule)}
                                                    type="checkbox"
                                                    checked={schedule.includes(sched)}
                                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{sched}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Hours per week */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                        Hours per week
                                    </h4>
                                    <div className="space-y-2">
                                        {["<5", "5 - 10", "10+"].map((hours) => (
                                            <label key={hours} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    onChange={() => setHoursPerWeek(hours)}
                                                    value={hours}
                                                    checked={hoursPerWeek === hours}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{hours}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 4. Benefits */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                        Benefits
                                    </h4>
                                    <div className="space-y-2">
                                        {["All", "Training", "Certificate", "Transportation / meals", "Stipend"].map((ben) => (
                                            <label key={ben} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    onChange={() => toggleArray(ben, setBenefits, benefits)}
                                                    type="checkbox"
                                                    checked={benefits.includes(ben)}
                                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{ben}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 5. Language Requirement */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                        Language Requirement
                                    </h4>
                                    <div className="space-y-2">
                                        {["None", "English", "Chinese"].map((lang) => (
                                            <label key={lang} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    onChange={() => setLanguageRequirement(lang)}
                                                    value={lang}
                                                    checked={languageRequirement === lang}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{lang}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/*for apply button*/}

                        <button onClick={handleApplyFilters} className="btn-primary-blue">
                            apply
                        </button>
                    </div>
                )}


                {/* RESULTS
                <div className="mt-6">
                    {loading && <p className="text-sm text-slate-500">Loading...</p>}



                    {results.slice(0, 5).map((item: any) => (
                        <div
                            key={item.id}
                            className="p-2 border rounded-lg mb-1 hover:shadow bg-white"
                        >
                            <h4 className="font-semibold">{item.title}</h4>
                        </div>
                    ))}
                </div> */}

            </div>
        </div>
    );
}