import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import CardList from "../Components/card/CardList";
import EmptyState from "../../../GlobalComponents/EmptyState";
import { Skeleton } from "../../../GlobalComponents/Skeleton";
import { formatApiError } from "../../../services/apiClient";
import { countAlertItemsByType } from "../lib/alertItemMappers";
import { getAlertPageEmptyMessage } from "../lib/alertPageCopy";
import { fetchAlertPageData } from "../services/alertItemService";
import type { AlertItemApi, AlertPostCardItem } from "../types/alertItem";

export default function Alert() {
    const [isJob, setIsJob] = useState<"job" | "volunteer">("job");
    const [jobItems, setJobItems] = useState<AlertPostCardItem[]>([]);
    const [volunteerItems, setVolunteerItems] = useState<AlertPostCardItem[]>([]);
    const [alertItems, setAlertItems] = useState<AlertItemApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadAlerts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchAlertPageData();

                if (!isMounted) {
                    return;
                }

                setJobItems(data.jobItems);
                setVolunteerItems(data.volunteerItems);
                setAlertItems(data.alertItems);
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
    const alertItemCount = countAlertItemsByType(alertItems, isJob);
    const emptyMessage = getAlertPageEmptyMessage(isJob, alertItemCount);

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

            {loading && (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                            <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && error && <div className="alert-error">{error}</div>}

            {!loading && !error && activeItems.length === 0 && (
                <EmptyState icon={Bell} title="No alerts yet" description={emptyMessage} />
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
                            isUrgent={item.isUrgent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
