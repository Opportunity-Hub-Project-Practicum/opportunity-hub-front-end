import { MapPin, Bookmark, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/path";
import { BANNED_POST_STATUS_LABEL } from "../../lib/seekerPostBan";

import UrgentBadge from "../UrgentBadge";

interface CardGridProps {
    id: number;
    employerId?: number;
    organizationName: string;
    title: string;
    engagementType: string;
    location: string;
    salary: string;
    remainingDays: string;
    image?: string;
    isBanned?: boolean;
    isUrgent?: boolean;
    onBookmark?: () => void;
}

export default function CardGrid({
    id, employerId, organizationName, title, engagementType, location, salary, remainingDays, image, isBanned = false, isUrgent = false, onBookmark
}: CardGridProps) {
    const organizationDetailPath = employerId
        ? ROUTES.HOME.ORGANIZATION_DETAIL(employerId)
        : null;
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmark = () => {
        if (isBanned) {
            return;
        }

        setIsBookmarked(!isBookmarked);
        onBookmark?.();
    };

    return (
        <div className={`w-full rounded-lg border border-slate-100 bg-white p-5 shadow-sm transition-shadow ${
            isBanned ? "cursor-default opacity-80" : "hover:shadow-md"
        }`}>
            {/* Company Header */}
            <div className="mb-2.5 flex gap-2.5">
                {/* Company Logo */}
                {organizationName && (
                    <img
                        src={image}
                        alt={organizationName}
                        className="h-15 w-15 rounded-lg object-cover shrink-0 border"
                    />
                )}

                {/* Company Info */}
                <div className="flex flex-col gap-0.5">
                    {organizationDetailPath ? (
                        <Link
                            to={organizationDetailPath}
                            className="font-medium text-slate-900 hover:text-primary hover:underline"
                        >
                            {organizationName}
                        </Link>
                    ) : (
                        <p className="font-medium text-slate-900">{organizationName}</p>
                    )}
                    <div className="flex items-center gap-0.5">
                        <MapPin size={14} className="text-slate-500" />
                        <p className="text-xs text-slate-500">{location}</p>
                    </div>
                </div>
            </div>

            {/* Job Info Section */}
            {isBanned ? (
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-semibold text-slate-950">{title}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <p className="text-slate-600">{engagementType}</p>
                        <span className="inline-block h-0.5 w-0.5 rounded-full bg-slate-400"></span>
                        <p className="text-slate-600">{salary}</p>
                        <span className="inline-block h-0.5 w-0.5 rounded-full bg-slate-400"></span>
                        <div className="flex items-center gap-0.5">
                            <Calendar size={12} className="text-slate-400" />
                            <p className="text-slate-500">Close On {remainingDays}</p>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-red-600">{BANNED_POST_STATUS_LABEL}</p>
                </div>
            ) : (
                <Link to={`/postDetail/${id}`} className=" flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
                        {isUrgent && <UrgentBadge />}
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <p className="text-slate-600">{engagementType}</p>
                        <span className="inline-block h-0.5 w-0.5 rounded-full bg-slate-400"></span>
                        <p className="text-slate-600">{salary}</p>
                        <span className="inline-block h-0.5 w-0.5 rounded-full bg-slate-400"></span>
                        <div className="flex items-center gap-0.5">
                            <Calendar size={12} className="text-slate-400" />
                            <p className="text-slate-500">Close On {remainingDays}</p>
                        </div>
                    </div>
                </Link>
            )}

            {/* Bookmark Button */}
            <div className="flex items-center justify-end ">
                <button
                    onClick={handleBookmark}
                    disabled={isBanned}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Bookmark
                        size={16}
                        className={`transition-colors ${isBookmarked
                            ? "fill-yellow-400 stroke-yellow-500 text-yellow-500"
                            : "stroke-slate-400 text-slate-400"
                            }`}
                    />
                </button>
            </div>
        </div>
    );
}
