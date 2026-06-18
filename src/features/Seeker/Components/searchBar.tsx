import { useState, useEffect, useContext, type Dispatch, type SetStateAction } from "react";
import { Search, MapPin, Layers, ChevronDown } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { opportunityTypeContext, setOpportunityTypeContext } from "../../../contexts/Context";
import { useNavigate } from "react-router-dom";
import type { PostListCardItem } from "../services/postApiService";
import type { SearchFilters } from "../lib/searchPosts";
import { hasActiveSearch, runPostSearch } from "../lib/searchPosts";
import { getLookupOptions, useLookupValues } from "../../../hooks/useLookupValues";
import { LOOKUP_TYPES } from "../../../types/lookupValue";

const SALARY_FILTER_OPTIONS = ["All", "$100+", "$300+", "$500+", "$800+", "$1000+", "$1500+", "$2000+"];

export type SearchBarInitialState = {
    searchTerm?: string;
    location?: string;
    category?: string;
    filters?: SearchFilters;
};

interface SearchBarProps {
    onResultsChange?: (results: PostListCardItem[]) => void;
    onLoadingChange?: (loading: boolean) => void;
    initialState?: SearchBarInitialState;
}

function restoreFilterFields(filters: SearchFilters): {
    experience: string;
    salary: string;
    jobLevel: string;
    jobTypes: string[];
    education: string[];
    duration: string;
    schedule: string[];
    hoursPerWeek: string;
    benefits: string[];
    languageRequirement: string;
    urgentOnly: boolean;
} {
    return {
        experience: filters.experience ?? "",
        salary: filters.salary ?? "",
        jobLevel: filters.jobLevel ?? "",
        jobTypes: filters.jobTypes ?? [],
        education: filters.education ?? [],
        duration: filters.duration ?? "",
        schedule: filters.schedule ?? [],
        hoursPerWeek: filters.hoursPerWeek ?? "",
        benefits: filters.benefits ?? [],
        languageRequirement: filters.languageRequirement ?? "",
        urgentOnly: filters.urgentOnly ?? false,
    };
}

export default function SearchBar({ onResultsChange, onLoadingChange, initialState }: SearchBarProps) {
    const navigate = useNavigate();
    const opportunityType = useContext(opportunityTypeContext);
    const setOpportunityType = useContext(setOpportunityTypeContext);
    const { lookupValues, loading: lookupLoading } = useLookupValues();
    const experienceOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.experience);
    const jobTypeOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobType);
    const educationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.education);
    const jobLevelOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobLevel);
    const durationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.duration);
    const scheduleOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.schedule);
    const hoursOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.hoursPerWeek);
    const benefitOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.benefits);
    const locationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.location);
    const categoryOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.jobRole);
    const languageOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.languageRequirement);
    const restoredFilters = restoreFilterFields(initialState?.filters ?? {});
    const [searchTerm, setSearchTerm] = useState(initialState?.searchTerm ?? "");
    const [location, setLocation] = useState(initialState?.location ?? "");
    const [category, setCategory] = useState(initialState?.category ?? "");
    const [advancedFilter, setAdvancedFilter] = useState(false);

    // Job Filter states
    const [experience, setExperience] = useState(restoredFilters.experience);
    const [salary, setSalary] = useState(restoredFilters.salary);
    const [jobLevel, setJobLevel] = useState(restoredFilters.jobLevel);
    const [jobTypes, setJobTypes] = useState<string[]>(restoredFilters.jobTypes);
    const [education, setEducation] = useState<string[]>(restoredFilters.education);

    // Volunteer Filter states
    const [duration, setDuration] = useState(restoredFilters.duration);
    const [schedule, setSchedule] = useState<string[]>(restoredFilters.schedule);
    const [hoursPerWeek, setHoursPerWeek] = useState(restoredFilters.hoursPerWeek);
    const [benefits, setBenefits] = useState<string[]>(restoredFilters.benefits);
    const [languageRequirement, setLanguageRequirement] = useState(restoredFilters.languageRequirement);
    const [urgentOnly, setUrgentOnly] = useState(restoredFilters.urgentOnly);

    // Track applied filters - only updated on Apply button click
    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialState?.filters ?? {});

    // Toggle helpers
    const toggleArray = (
        value: string,
        setter: Dispatch<SetStateAction<string[]>>,
        state: string[],
    ) => {
        setter(
            state.includes(value)
                ? state.filter((v) => v !== value)
                : [...state, value]
        );
    };

    const { results, loading, debouncedPayload, debouncedSerialized, resultsPayload, invalidatePendingSearch } = useSearch({
        query: searchTerm,
        location,
        category,
        opportunityType,
        filters: appliedFilters,
    });

    useEffect(() => {
        if (!onResultsChange || !resultsPayload || !hasActiveSearch(debouncedPayload)) {
            return;
        }

        if (resultsPayload !== debouncedSerialized) {
            return;
        }

        onResultsChange(results);
    }, [results, resultsPayload, debouncedSerialized, debouncedPayload, onResultsChange]);

    useEffect(() => {
        onLoadingChange?.(loading);
    }, [loading, onLoadingChange]);

    const navigateToResults = (
        nextResults: PostListCardItem[],
        nextFilters: SearchFilters,
    ) => {
        navigate("/postList", {
            state: {
                results: nextResults,
                filters: nextFilters,
                searchTerm,
                location,
                category,
                opportunityType,
            },
        });
    };

    const buildNextFilters = (): SearchFilters => {
        const sharedFilters = { urgentOnly };

        if (opportunityType === "job") {
            return {
                experience,
                salary,
                jobLevel,
                jobTypes,
                education,
                ...sharedFilters,
            };
        }

        return {
            duration,
            schedule,
            hoursPerWeek,
            benefits,
            languageRequirement,
            ...sharedFilters,
        };
    };

    const handleApplyFilters = () => {
        const nextFilters = buildNextFilters();
        setAppliedFilters(nextFilters);
        invalidatePendingSearch();

        void (async () => {
            const nextResults = await runPostSearch({
                query: searchTerm,
                location,
                category,
                opportunityType,
                filters: nextFilters,
            });

            onResultsChange?.(nextResults);
            navigateToResults(nextResults, nextFilters);
        })();
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const nextFilters = buildNextFilters();
            setAppliedFilters(nextFilters);
            invalidatePendingSearch();

            void (async () => {
                const nextResults = await runPostSearch({
                    query: searchTerm,
                    location,
                    category,
                    opportunityType,
                    filters: nextFilters,
                });

                onResultsChange?.(nextResults);
                navigateToResults(nextResults, nextFilters);
            })();
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
                            disabled={lookupLoading}
                            className="flex-1 bg-transparent text-sm outline-none cursor-pointer disabled:cursor-wait"
                        >
                            <option value="">Location</option>
                            <option value="remote">Remote</option>
                            {locationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <MapPin size={18} className="text-slate-500" />
                    </div>

                    <div className="hidden lg:block h-6 w-px bg-slate-200"></div>

                    {/* CATEGORY */}
                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={lookupLoading}
                            className="flex-1 bg-transparent text-sm outline-none cursor-pointer disabled:cursor-wait"
                        >
                            <option value="">Category</option>
                            {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
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
                        {lookupLoading && (
                            <p className="mb-4 text-sm text-slate-500">Loading filter options...</p>
                        )}

                        {opportunityType === "job" ? (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Experience</h4>
                                    <div className="space-y-2">
                                        {experienceOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={experience === option.value}
                                                    onChange={() => setExperience(option.value)}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Salary</h4>
                                    <div className="space-y-2">
                                        {SALARY_FILTER_OPTIONS.map((sal) => (
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

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Job Type</h4>
                                    <div className="space-y-2">
                                        {jobTypeOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={jobTypes.includes(option.value)}
                                                    onChange={() => toggleArray(option.value, setJobTypes, jobTypes)}
                                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Education</h4>
                                    <div className="space-y-2">
                                        {educationOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => toggleArray(option.value, setEducation, education)}
                                                    checked={education.includes(option.value)}
                                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Job Level</h4>
                                    <div className="space-y-2">
                                        {jobLevelOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    onChange={() => setJobLevel(option.value)}
                                                    checked={jobLevel === option.value}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Duration</h4>
                                    <div className="space-y-2">
                                        {durationOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    onChange={() => setDuration(option.value)}
                                                    checked={duration === option.value}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Schedule</h4>
                                    <div className="space-y-2">
                                        {scheduleOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    onChange={() => toggleArray(option.value, setSchedule, schedule)}
                                                    type="checkbox"
                                                    checked={schedule.includes(option.value)}
                                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Hours per week</h4>
                                    <div className="space-y-2">
                                        {hoursOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    onChange={() => setHoursPerWeek(option.value)}
                                                    value={option.value}
                                                    checked={hoursPerWeek === option.value}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Benefits</h4>
                                    <div className="space-y-2">
                                        {benefitOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    onChange={() => toggleArray(option.value, setBenefits, benefits)}
                                                    type="checkbox"
                                                    checked={benefits.includes(option.value)}
                                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Language Requirement</h4>
                                    <div className="space-y-2">
                                        {languageOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    onChange={() => setLanguageRequirement(option.value)}
                                                    value={option.value}
                                                    checked={languageRequirement === option.value}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700">{option.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={urgentOnly}
                                    onChange={(event) => setUrgentOnly(event.target.checked)}
                                    className="h-4 w-4 rounded text-blue-600 cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-slate-900">Urgent hiring only</span>
                            </label>
                        </div>
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