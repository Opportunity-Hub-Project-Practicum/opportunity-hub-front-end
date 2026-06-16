import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MapPin, DollarSign } from "lucide-react";
import { formatApiError } from "../../../services/apiClient";
import { fetchAppliedCardItems } from "../services/applicationService";
import type { ApplicationStatus, AppliedCardItem } from "../types/application";
import { ROUTES } from "../../../routes/path";

type StatusFilter = "applied" | "pending" | "hired" | "rejected";

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: "applied", label: "Applied" },
    { value: "pending", label: "Pending" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
];

function statusFilterToApiStatus(filter: Exclude<StatusFilter, "applied">): ApplicationStatus {
    switch (filter) {
        case "pending":
            return "pending";
        case "hired":
            return "hired";
        case "rejected":
            return "rejected";
        default: {
            const _exhaustive: never = filter;
            return _exhaustive;
        }
    }
}

function matchesStatusFilter(item: AppliedCardItem, filter: StatusFilter): boolean {
    if (filter === "applied") {
        return true;
    }

    return item.status === statusFilterToApiStatus(filter);
}

function formatStatusLabel(status: ApplicationStatus): string {
    switch (status) {
        case "pending":
            return "Pending";
        case "hired":
            return "Hired";
        case "rejected":
            return "Rejected";
        default: {
            const _exhaustive: never = status;
            return _exhaustive;
        }
    }
}

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
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("applied");
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

    const currentItems = items.filter(
        (item) => item.postType === isJob && matchesStatusFilter(item, statusFilter),
    );

    const selectedStatusLabel =
        STATUS_FILTER_OPTIONS.find((option) => option.value === statusFilter)?.label ?? "Applied";

    const emptyStateLabel =
        statusFilter === "applied" ? "" : `${selectedStatusLabel.toLowerCase()} `;

    return (
        <section className="flex flex-col">
            <div className="mb-4 mr-5 flex flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            className="appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                            {STATUS_FILTER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                    </div>
                </div>
            </div>

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
                    No {emptyStateLabel}{isJob === "job" ? "job" : "volunteer"} applications found.
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
                    <span className={`flex items-center ${statusClassName(item.status)}`}>
                        {formatStatusLabel(item.status)}
                    </span>
                    <Link
                        to={ROUTES.HOME.POST_DETAIL(item.postId)}
                        className=" bg-primary text-white flex justify-center items-center rounded-2xl m-2"
                    >
                        View Post
                    </Link>
                </div>
            ))}
        </section>
    );
}
