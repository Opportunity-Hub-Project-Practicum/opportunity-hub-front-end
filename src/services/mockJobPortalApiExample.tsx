import { useEffect, useState } from "react";
import type { ApiError, FavouriteCandidate, Post } from "./mockJobPortalApi";
import { fetchFavouriteCandidates, fetchPosts } from "./mockJobPortalApi";

type AsyncState<T> = {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
};

export function MockPostsLoadingExample() {
    const [state, setState] = useState<AsyncState<Post[]>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            setState({ data: null, loading: true, error: null });

            const response = await fetchPosts({ pageSize: 4, delayMs: 700 });

            if (!isMounted) {
                return;
            }

            if (!response.ok) {
                setState({ data: null, loading: false, error: response.error });
                return;
            }

            setState({ data: response.data.items, loading: false, error: null });
        };

        void run();

        return () => {
            isMounted = false;
        };
    }, []);

    if (state.loading) {
        return <div>Loading posts...</div>;
    }

    if (state.error) {
        return <div>Something went wrong: {state.error.message}</div>;
    }

    return (
        <ul>
            {state.data?.map((post) => (
                <li key={post.id}>
                    {post.title} - {post.location}
                </li>
            ))}
        </ul>
    );
}

export function MockFavouriteCandidateLoadingExample() {
    const [state, setState] = useState<AsyncState<FavouriteCandidate[]>>({
        data: null,
        loading: false,
        error: null,
    });

    const loadCandidates = async () => {
        setState({ data: null, loading: true, error: null });

        try {
            const response = await fetchFavouriteCandidates({ employerId: 1, delayMs: 600 });

            if (!response.ok) {
                throw response.error;
            }

            setState({ data: response.data.items, loading: false, error: null });
        } catch (error) {
            const apiError = error as ApiError;
            setState({ data: null, loading: false, error: apiError });
        }
    };

    return (
        <div>
            <button onClick={() => void loadCandidates()} disabled={state.loading}>
                {state.loading ? "Loading..." : "Load favourite candidates"}
            </button>

            {state.error && <p>{state.error.message}</p>}

            <ol>
                {state.data?.map((candidate) => (
                    <li key={candidate.id}>
                        Candidate #{candidate.candidateId} - {candidate.status}
                    </li>
                ))}
            </ol>
        </div>
    );
}
