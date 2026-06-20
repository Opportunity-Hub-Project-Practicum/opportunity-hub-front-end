export type FavoriteCandidateApi = {
    favorite_candidate_id: number;
    seeker_id: number;
    seeker_name: string | null;
    seeker_email: string | null;
    profile_img: string | null;
    education: string | null;
    experience: string | null;
    created_at: string | null;
};

export type FavoriteCandidatesResponse = {
    favorites: FavoriteCandidateApi[];
};

export type FavoriteCandidateResponse = {
    favorite: FavoriteCandidateApi;
};

export type CreateFavoriteCandidateResponse = {
    message: string;
    favorite: FavoriteCandidateApi;
};

export type SavedCandidateCardItem = {
    favoriteCandidateId: number;
    seekerId: number;
    name: string;
    image: string;
    subtitle: string | undefined;
};
