import { useEffect, useMemo, useRef, useState } from "react";
import { hasActiveSearch, runPostSearch, type SearchPayload } from "../lib/searchPosts";
import {
    type PostListCardItem,
} from "../services/postApiService";

function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timeoutId);
    }, [value, delay]);

    return debounced;
}

function serializeSearchPayload(payload: SearchPayload): string {
    return JSON.stringify({
        query: payload.query ?? "",
        location: payload.location ?? "",
        category: payload.category ?? "",
        opportunityType: payload.opportunityType ?? "",
        filters: payload.filters ?? {},
    });
}

async function searchPosts(payload: SearchPayload): Promise<PostListCardItem[]> {
    return runPostSearch(payload);
}

export function useSearch(payload: SearchPayload) {
    const [results, setResults] = useState<PostListCardItem[]>([]);
    const [resultsPayload, setResultsPayload] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const requestIdRef = useRef(0);
    const serializedPayload = serializeSearchPayload(payload);
    const debouncedSerialized = useDebounce(serializedPayload, 400);
    const debouncedPayload = useMemo(
        () => JSON.parse(debouncedSerialized) as SearchPayload,
        [debouncedSerialized],
    );

    useEffect(() => {
        if (!hasActiveSearch(debouncedPayload)) {
            setResults([]);
            setResultsPayload(null);
            setLoading(false);
            return;
        }

        const requestId = ++requestIdRef.current;
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);

            try {
                const data = await searchPosts(debouncedPayload);
                if (isMounted && requestId === requestIdRef.current) {
                    setResults(data);
                    setResultsPayload(debouncedSerialized);
                }
            } catch (error) {
                console.error(error);
                if (isMounted && requestId === requestIdRef.current) {
                    setResults([]);
                    setResultsPayload(null);
                }
            } finally {
                if (isMounted && requestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isMounted = false;
        };
    }, [debouncedPayload, debouncedSerialized]);

    return {
        results,
        loading,
        debouncedPayload,
        debouncedSerialized,
        resultsPayload,
        invalidatePendingSearch: () => { requestIdRef.current += 1; },
    };
}
