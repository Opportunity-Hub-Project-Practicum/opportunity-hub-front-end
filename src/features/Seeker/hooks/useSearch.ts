import { useEffect, useState } from "react";
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

async function searchPosts(payload: SearchPayload): Promise<PostListCardItem[]> {
    return runPostSearch(payload);
}

export function useSearch(payload: SearchPayload) {
    const [results, setResults] = useState<PostListCardItem[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedPayload = useDebounce(payload, 400);

    useEffect(() => {
        if (!hasActiveSearch(debouncedPayload)) {
            setResults([]);
            return;
        }

        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);

            try {
                const data = await searchPosts(debouncedPayload);
                if (isMounted) {
                    setResults(data);
                }
            } catch (error) {
                console.error(error);
                if (isMounted) {
                    setResults([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isMounted = false;
        };
    }, [debouncedPayload]);

    return { results, loading };
}
