import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { formatApiError } from "../../../services/apiClient";
import {
    applyUpdatedPostToListings,
    buildPostClosePayload,
    buildPostOpenUntilPayload,
    type ListingItem,
} from "../lib/myJobMappers";
import { updateEmployerPost } from "../services/employerPostService";

export function useEmployerPostListingActions(
    setListings: Dispatch<SetStateAction<ListingItem[]>>,
    setPageError?: Dispatch<SetStateAction<string | null>>,
) {
    const [updatingPostId, setUpdatingPostId] = useState<number | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);
    const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);

    const updateListingDuration = useCallback(async (
        listing: ListingItem,
        payload: ReturnType<typeof buildPostOpenUntilPayload> | ReturnType<typeof buildPostClosePayload>,
    ) => {
        setUpdatingPostId(listing.postId);
        setModalError(null);
        setPageError?.(null);

        try {
            const updatedPost = await updateEmployerPost(listing.postId, payload);
            setListings((current) => applyUpdatedPostToListings(current, updatedPost));
            setSelectedListing(null);
        } catch (updateError) {
            const message = formatApiError(updateError);
            if (selectedListing) {
                setModalError(message);
            } else {
                setPageError?.(message);
            }
        } finally {
            setUpdatingPostId(null);
        }
    }, [selectedListing, setListings, setPageError]);

    const handleSaveDuration = useCallback(async (closedDate: string) => {
        if (!selectedListing) {
            return;
        }

        await updateListingDuration(selectedListing, buildPostOpenUntilPayload(closedDate));
    }, [selectedListing, updateListingDuration]);

    const handleCloseListingNow = useCallback(async (listing: ListingItem) => {
        const confirmed = window.confirm(
            "Close this listing now? It will no longer accept applications.",
        );
        if (!confirmed) {
            return;
        }

        await updateListingDuration(listing, buildPostClosePayload());
    }, [updateListingDuration]);

    const openDurationModal = useCallback((listing: ListingItem) => {
        setModalError(null);
        setSelectedListing(listing);
    }, []);

    const closeDurationModal = useCallback(() => {
        if (updatingPostId != null) {
            return;
        }

        setSelectedListing(null);
        setModalError(null);
    }, [updatingPostId]);

    return {
        updatingPostId,
        modalError,
        selectedListing,
        handleSaveDuration,
        handleCloseListingNow,
        openDurationModal,
        closeDurationModal,
    };
}
