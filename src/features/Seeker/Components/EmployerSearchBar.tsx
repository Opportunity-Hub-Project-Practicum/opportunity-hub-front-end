import { Building2, Factory, MapPin, Search } from "lucide-react";
import { getLookupOptions, useLookupValues } from "../../../hooks/useLookupValues";
import { LOOKUP_TYPES } from "../../../types/lookupValue";
import type { EmployerSearchFilters } from "../lib/filterEmployers";

type EmployerSearchBarProps = {
    filters: EmployerSearchFilters;
    onFiltersChange: (filters: EmployerSearchFilters) => void;
};

export default function EmployerSearchBar({ filters, onFiltersChange }: EmployerSearchBarProps) {
    const { lookupValues, loading: lookupLoading, error: lookupError } = useLookupValues();
    const organizationTypeOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.organizationType);
    const industryOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.industry);
    const locationOptions = getLookupOptions(lookupValues, LOOKUP_TYPES.location);

    const updateFilter = <K extends keyof EmployerSearchFilters>(key: K, value: EmployerSearchFilters[K]) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="w-full overflow-x-hidden px-5 py-6 md:px-4 lg:px-6">
            <div className="mx-auto max-w-7xl">
                {lookupError && (
                    <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {lookupError}
                    </p>
                )}

                <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-lg lg:flex-row lg:items-center lg:gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <input
                            type="text"
                            placeholder="Company name"
                            value={filters.companyName}
                            onChange={(event) => updateFilter("companyName", event.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <Search size={18} className="shrink-0 text-slate-500" />
                    </div>

                    <div className="hidden h-6 w-px bg-slate-200 lg:block" />

                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <select
                            value={filters.organizationType}
                            onChange={(event) => updateFilter("organizationType", event.target.value)}
                            disabled={lookupLoading}
                            className="flex-1 cursor-pointer bg-transparent text-sm outline-none disabled:cursor-wait"
                        >
                            <option value="">Organization type</option>
                            {organizationTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <Building2 size={18} className="shrink-0 text-slate-500" />
                    </div>

                    <div className="hidden h-6 w-px bg-slate-200 lg:block" />

                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <select
                            value={filters.industry}
                            onChange={(event) => updateFilter("industry", event.target.value)}
                            disabled={lookupLoading}
                            className="flex-1 cursor-pointer bg-transparent text-sm outline-none disabled:cursor-wait"
                        >
                            <option value="">Industry</option>
                            {industryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <Factory size={18} className="shrink-0 text-slate-500" />
                    </div>

                    <div className="hidden h-6 w-px bg-slate-200 lg:block" />

                    <div className="flex flex-1 items-center gap-2 px-3 py-2">
                        <select
                            value={filters.location}
                            onChange={(event) => updateFilter("location", event.target.value)}
                            disabled={lookupLoading}
                            className="flex-1 cursor-pointer bg-transparent text-sm outline-none disabled:cursor-wait"
                        >
                            <option value="">Location</option>
                            {locationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <MapPin size={18} className="shrink-0 text-slate-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
