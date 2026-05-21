import { useEffect, useState } from "react";
import { Posts } from "../../../services/postService";

function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value]);

    return debounced;
}

// Mock search function - filters local data until backend is ready
function mockSearch(payload: any) {
    let filtered = [...Posts];

    // Filter by opportunity type
    if (payload.opportunityType) {
        filtered = filtered.filter(post => post.type === payload.opportunityType);
    }

    // Filter by search query (title)
    if (payload.query) {
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(payload.query.toLowerCase())
        );
    }

    // Filter by location
    if (payload.location) {
        filtered = filtered.filter(post =>
            post.location?.toLowerCase().includes(payload.location.toLowerCase())
        );
    }

    // Filter by category
    if (payload.category) {
        filtered = filtered.filter(post =>
            post.category?.toLowerCase().includes(payload.category.toLowerCase())
        );
    }

    // Filter by advanced filters (only if provided)
    if (payload.filters) {
        const filters = payload.filters;

        // Job filters
        if (filters.experience) {
            // Add experience filtering logic here when backend is ready
        }
        if (filters.salary) {
            // Add salary filtering logic here when backend is ready
        }
        if (filters.jobLevel) {
            // Add job level filtering logic here when backend is ready
        }
        if (filters.jobTypes && filters.jobTypes.length > 0) {
            // Add job types filtering logic here when backend is ready
        }
        if (filters.education && filters.education.length > 0) {
            // Add education filtering logic here when backend is ready
        }

        // Volunteer filters
        if (filters.duration) {
            // Add duration filtering logic here when backend is ready
        }
        if (filters.schedule && filters.schedule.length > 0) {
            // Add schedule filtering logic here when backend is ready
        }
        if (filters.hoursPerWeek) {
            // Add hours per week filtering logic here when backend is ready
        }
        if (filters.benefits && filters.benefits.length > 0) {
            // Add benefits filtering logic here when backend is ready
        }
        if (filters.languageRequirement) {
            // Add language requirement filtering logic here when backend is ready
        }
    }

    return filtered;
}

export function useSearch(payload: any) {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const debouncedPayload = useDebounce(payload, 400);

    useEffect(() => {
        // Trigger search for basic fields (query, location, category) OR if advanced filters were applied
        const hasBasicSearch = debouncedPayload?.query || debouncedPayload?.location || debouncedPayload?.category;
        const hasAdvancedFilters = debouncedPayload?.filters && Object.values(debouncedPayload.filters).some(v => v);

        if (!hasBasicSearch && !hasAdvancedFilters) {
            setResults([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // TODO: Replace with actual backend API call when ready
                // const data = await fetch('/api/search', { body: debouncedPayload })
                const data = mockSearch(debouncedPayload);
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedPayload]);

    return { results, loading };
}