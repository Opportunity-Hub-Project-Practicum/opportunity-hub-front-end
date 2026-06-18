import { useEffect, useState } from "react";
import { fetchLookupValues } from "../services/lookupValueService";
import type { LookupValuesByType } from "../types/lookupValue";

let cachedLookupValues: LookupValuesByType | null = null;
let lookupValuesPromise: Promise<LookupValuesByType> | null = null;

function loadLookupValues(): Promise<LookupValuesByType> {
    if (cachedLookupValues) {
        return Promise.resolve(cachedLookupValues);
    }

    if (!lookupValuesPromise) {
        lookupValuesPromise = fetchLookupValues()
            .then((data) => {
                cachedLookupValues = data;
                return data;
            })
            .finally(() => {
                lookupValuesPromise = null;
            });
    }

    return lookupValuesPromise;
}

export function useLookupValues() {
    const [lookupValues, setLookupValues] = useState<LookupValuesByType | null>(cachedLookupValues);
    const [loading, setLoading] = useState(!cachedLookupValues);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        void loadLookupValues()
            .then((data) => {
                if (!cancelled) {
                    setLookupValues(data);
                }
            })
            .catch((loadError) => {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Failed to load lookup values.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { lookupValues, loading, error };
}

export function getLookupOptions(
    lookupValues: LookupValuesByType | null,
    type: string,
    excludeValues: string[] = [],
) {
    return (lookupValues?.[type] ?? []).filter((item) => !excludeValues.includes(item.value));
}
