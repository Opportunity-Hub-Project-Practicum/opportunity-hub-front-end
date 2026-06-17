import { Bookmark, BellRing, BriefcaseBusiness, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SeekerAppliedPostRow from "../Components/SeekerAppliedPostRow";
import { ROUTES } from "../../../routes/path";
import { formatApiError } from "../../../services/apiClient";
import { fetchOverviewActivityData } from "../services/overviewActivityService";
import type { OverviewActivityCounts, OverviewActivityData } from "../types/overviewActivity";

const metricCards = [
    { key: "appliedJobs", label: "Applied Jobs", bg: "bg-subPrimary", icon: BriefcaseBusiness },
    { key: "favoriteJobs", label: "Favorite Jobs", bg: "bg-subPrimary", icon: Bookmark },
    { key: "jobAlerts", label: "Job Alerts", bg: "bg-subPrimary", icon: BellRing },
    { key: "appliedVolunteers", label: "Applied Volunteers", bg: "bg-green-200", icon: BriefcaseBusiness },
    { key: "favoriteVolunteers", label: "Favorite Volunteers", bg: "bg-green-200", icon: Bookmark },
    { key: "volunteerAlerts", label: "Volunteer Alerts", bg: "bg-green-200", icon: BellRing },
] as const;

export default function OverviewActivity() {
    const [isJob, setIsJob] = useState<"job" | "volunteer">("job");
    const [overviewData, setOverviewData] = useState<OverviewActivityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadOverview = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchOverviewActivityData();
                if (!isMounted) return;
                setOverviewData(data);
            } catch (err) {
                if (!isMounted) return;
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadOverview();

        return () => {
            isMounted = false;
        };
    }, []);

    const currentItems = overviewData?.recentItems[isJob] ?? [];
    const counts: OverviewActivityCounts = overviewData?.counts ?? {
        appliedJobs: 0,
        favoriteJobs: 0,
        jobAlerts: 0,
        appliedVolunteers: 0,
        favoriteVolunteers: 0,
        volunteerAlerts: 0,
    };

    return (
        <div className="page-container flex flex-col gap-5 ">
            <span>Hello, {overviewData?.userName ?? "User"}</span>


            {loading && <p className="text-gray-500">Loading activity...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="grid grid-cols-3 w-full gap-4">
                {metricCards.map((metric) => (
                    <div key={metric.key} className={`${metric.bg} p-5 border rounded-lg grid grid-cols-3 gap-3`}>
                        <div className="flex flex-col col-span-2 justify-center">
                            <span className="font-semibold text-lg">{counts[metric.key]}</span>
                            <span className="flex whitespace-nowrap text-sm text-gray-700">{metric.label}</span>
                        </div>
                        <div className="border border-primaryDark bg-white flex justify-center items-center py-4 rounded-lg">
                            <metric.icon className="text-primary" size={25} />
                        </div>
                    </div>
                ))}
            </div>

            <section className="flex flex-col">
                <div className="flex justify-between  p-2 rounded-lg  text-gray-600">
                    <span>Recently Applied</span>
                    <Link
                        to={`${ROUTES.SEEKER.ROOT}/${ROUTES.SEEKER.APPLIED}`}
                        className="whitespace-nowrap flex gap-2 hover:text-primary"
                    >
                        View all <ArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-6 p-3  text-gray-600 mb-5 bg-gray-100 rounded-lg ">
                    <div className="col-span-3 flex gap-3">
                        <button
                            className={isJob === "job" ? "bg-gray-100 text-primary underline" : ""}
                            onClick={() => setIsJob("job")}
                        >
                            Jobs
                        </button>
                        <button
                            className={isJob === "volunteer" ? "bg-gray-100 text-primary underline" : ""}
                            onClick={() => setIsJob("volunteer")}
                        >
                            Volunteers
                        </button>
                    </div>
                    <span>Date appllied</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                {!loading && !error && currentItems.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                        No {isJob === "job" ? "job" : "volunteer"} activity found.
                    </div>
                )}

                {currentItems.map((item) => (
                    <SeekerAppliedPostRow key={item.applicationId} item={item} />
                ))}
            </section>
        </div>
    );
}
