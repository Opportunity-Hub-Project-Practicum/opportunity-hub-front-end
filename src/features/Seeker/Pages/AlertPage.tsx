import { useEffect, useState } from "react";
import CardList from "../Components/card/CardList";
import { formatApiError } from "../../../services/apiClient";
import {
    fetchJobAlertPostCards,
    fetchVolunteerAlertPostCards,
} from "../services/alertItemService";
import type { AlertPostCardItem } from "../types/alertItem";

export default function Alert() {
    const [isJob, setIsJob] = useState<"job" | "volunteer">("job");
    const [jobItems, setJobItems] = useState<AlertPostCardItem[]>([]);
    const [volunteerItems, setVolunteerItems] = useState<AlertPostCardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadAlerts = async () => {
            setLoading(true);
            setError(null);

            try {
                const [jobs, volunteers] = await Promise.all([
                    fetchJobAlertPostCards(),
                    fetchVolunteerAlertPostCards(),
                ]);

                if (!isMounted) {
                    return;
                }

                setJobItems(jobs);
                setVolunteerItems(volunteers);
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadAlerts();

        return () => {
            isMounted = false;
        };
    }, []);

    const activeItems = isJob === "job" ? jobItems : volunteerItems;
    const emptyMessage = isJob === "job"
        ? "No matching job posts found. Add job alerts in Account settings to see opportunities here."
        : "No matching volunteer posts found. Add volunteer alerts in Account settings to see opportunities here.";

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

            {loading && <p className="text-gray-500">Loading alerts...</p>}
            {!loading && error && <p className="text-red-600">{error}</p>}

            {!loading && !error && activeItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                    {emptyMessage}
                </div>
            )}

            {!loading && !error && activeItems.length > 0 && (
                <div className="flex flex-col gap-2">
                    {activeItems.map((item) => (
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
        </div>
    );
}
