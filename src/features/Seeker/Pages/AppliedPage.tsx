import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, DollarSign } from "lucide-react";
import { formatApiError } from "../../../services/apiClient";
import { fetchAppliedCardItems } from "../services/applicationService";
import type { ApplicationStatus, AppliedCardItem } from "../types/application";
import { ROUTES } from "../../../routes/path";

function statusClassName(status: ApplicationStatus): string {
    switch (status) {
        case "hired":
            return "text-green-600";
        case "rejected":
            return "text-red-600";
        case "pending":
            return "text-amber-600";
        default: {
            const _exhaustive: never = status;
            return _exhaustive;
        }
    }
}

export default function Applied() {
    const [isJob, setIsJob] = useState<"job" | "volunteer">("job");
    const [items, setItems] = useState<AppliedCardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadApplications = async () => {
            setLoading(true);
            setError(null);

            try {
                const applications = await fetchAppliedCardItems();
                if (!isMounted) return;
                setItems(applications);
            } catch (err) {
                if (!isMounted) return;
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadApplications();

        return () => {
            isMounted = false;
        };
    }, []);

    const currentItems = items.filter((item) => item.postType === isJob);

    return (
        <section className="flex flex-col">
            <div className="grid grid-cols-6 p-3  text-gray-600 mb-5 bg-gray-100 rounded-lg ">
                <div className="col-span-3 flex gap-3">
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
                <span>Date appllied</span>
                <span>Status</span>
                <span>Action</span>
            </div>

            {loading && <p className="text-gray-500">Loading applications...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && currentItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                    No {isJob === "job" ? "job" : "volunteer"} applications found.
                </div>
            )}

            {currentItems.map((item) => (
                <div
                    key={item.applicationId}
                    className="grid grid-cols-6 border  m-2 lg:p-4 rounded-lg hover:border-primary hover:shadow-lg hover:scale-101 transition-all duration-300"
                >
                    <div className=" col-span-3 flex justify-between ">
                        <div className="flex gap-2 lg:gap-5">
                            <img
                                src={item.image}
                                alt={item.organizationName}
                                className="rounded-lg border w-15 h-15 object-cover bg-white"
                            />
                            <div className="flex flex-col justify-around w-full">
                                <div className="flex gap-1 flex-wrap">
                                    <p className="font-semibold">
                                        {item.organizationName} - {item.title}
                                    </p>
                                    <span className="rounded-2xl bg-subPrimary px-2 text-primaryDark w-fit h-fit text-sm">
                                        {item.workPlaceType}
                                    </span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {item.location && (
                                        <span className="flex text-small justify-center items-center text-gray-500">
                                            <MapPin className="text-primary" size={15} />
                                            {item.location}
                                        </span>
                                    )}
                                    {item.salary && (
                                        <span className="flex text-small justify-center items-center text-gray-500">
                                            <DollarSign className="text-primary" size={15} />
                                            {item.salary}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="text-gray-600 flex items-center">{item.appliedDate}</span>
                    <span className={`flex items-center capitalize ${statusClassName(item.status)}`}>
                        {item.status}
                    </span>
                    <Link
                        to={ROUTES.HOME.POST_DETAIL(item.postId)}
                        className=" bg-primary text-white flex justify-center items-center rounded-2xl"
                    >
                        View Post
                    </Link>
                </div>
            ))}
        </section>
    );
}
