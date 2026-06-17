import { useEffect, useState } from "react";
import CardList from "../Components/card/CardList";
import { formatApiError } from "../../../services/apiClient";
import { fetchJobAlertPostCards } from "../services/alertItemService";
import type { AlertPostCardItem } from "../types/alertItem";

const VOLUNTEER_MOCK_ITEMS = [
    {
        id: 11,
        organizationName: "Green Earth NGO",
        title: "Tree Planting Volunteer",
        workPlaceType: "onsite",
        location: "Phnom Penh, Cambodia",
        salary: "",
        appliedDate: "2026-05-08",
        image: "",
    },
    {
        id: 12,
        organizationName: "EduSmart",
        title: "Teaching Assistant",
        workPlaceType: "onsite",
        location: "Bangkok, Thailand",
        salary: "",
        appliedDate: "2026-05-09",
        image: "",
    },
];

export default function Alert() {
    const [isJob, setIsJob] = useState<"job" | "volunteer">("job");
    const [jobItems, setJobItems] = useState<AlertPostCardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadJobAlerts = async () => {
            setLoading(true);
            setError(null);

            try {
                const items = await fetchJobAlertPostCards();
                if (!isMounted) return;
                setJobItems(items);
            } catch (err) {
                if (!isMounted) return;
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadJobAlerts();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <div className="text-gray-600 mb-5 bg-gray-100 rounded-lg flex gap-3 p-3">
                <button
                    className={isJob === "job" ? " text-primary underline" : ""}
                    onClick={() => setIsJob("job")}
                >
                    Jobs
                </button>
                <button
                    className={isJob === "volunteer" ? " text-primary underline" : ""}
                    onClick={() => setIsJob("volunteer")}
                >
                    Volunteers
                </button>
            </div>

            {isJob && loading && <p className="text-gray-500">Loading job alerts...</p>}
            {isJob && error && <p className="text-red-600">{error}</p>}

            {isJob && !loading && !error && jobItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                    No matching job posts found. Add job alerts in Account settings to see opportunities here.
                </div>
            )}

            {isJob && !loading && !error && (
                <div className="flex flex-col gap-2">
                    {jobItems.map((item) => (
                        <CardList
                            key={item.postId}
                            id={item.postId}
                            organizationName={item.organizationName}
                            title={item.title}
                            engagementType={item.engagementType}
                            location={item.location}
                            salary={item.salary}
                            remainingDays={item.remainingDays}
                            image={item.image}
                        />
                    ))}
                </div>
            )}

            {isJob === "volunteer" && (
                <div className="flex flex-col gap-2">
                    {VOLUNTEER_MOCK_ITEMS.map((item) => (
                        <CardList
                            key={item.id}
                            id={item.id}
                            organizationName={item.organizationName}
                            title={item.title}
                            engagementType={item.workPlaceType}
                            location={item.location}
                            salary={item.salary}
                            remainingDays={`Applied on ${item.appliedDate}`}
                            image={item.image}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
