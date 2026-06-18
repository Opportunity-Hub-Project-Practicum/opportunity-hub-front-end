export type PublicStats = {
    total_seekers: number;
    total_employers: number;
    open_jobs?: number;
    open_volunteers?: number;
};

export type PublicStatsResponse = {
    stats: PublicStats;
};
