import { MapPin, Bookmark, Calendar } from "lucide-react";
import { useState } from "react";

interface CardGridProps {
  companyLogo?: string;
  companyName: string;
  location: string;
  jobTitle: string;
  salary: string;
  jobType: string;
  daysRemaining: number;
  onBookmark?: () => void;
}

export default function CardGrid({
  companyLogo,
  companyName,
  location,
  jobTitle,
  salary,
  jobType,
  daysRemaining,
  onBookmark,
}: CardGridProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <div className="w-full rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm hover:shadow-md transition-shadow">
      {/* Company Header */}
      <div className="mb-2.5 flex gap-2.5">
        {/* Company Logo */}
        {companyLogo && (
          <img
            src={companyLogo}
            alt={companyName}
            className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
          />
        )}

        {/* Company Info */}
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-slate-900">{companyName}</p>
          <div className="flex items-center gap-0.5">
            <MapPin size={14} className="text-slate-500" />
            <p className="text-xs text-slate-500">{location}</p>
          </div>
        </div>
      </div>

      {/* Job Info Section */}
      <div className="mb-2.5 flex flex-col gap-1.5">
        {/* Job Title */}
        <h3 className="text-base font-semibold text-slate-950">{jobTitle}</h3>

        {/* Job Details */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <p className="text-slate-600">{jobType}</p>
          <span className="inline-block h-0.5 w-0.5 rounded-full bg-slate-400"></span>
          <p className="text-slate-600">{salary}</p>
          <span className="inline-block h-0.5 w-0.5 rounded-full bg-slate-400"></span>
          <div className="flex items-center gap-0.5">
            <Calendar size={12} className="text-slate-400" />
            <p className="text-slate-500">{daysRemaining} Days Remaining</p>
          </div>
        </div>
      </div>

      {/* Bookmark Button */}
      <div className="flex items-center justify-end ">
        <button
          onClick={handleBookmark}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <Bookmark
            size={16}
            className={`transition-colors ${
              isBookmarked
                ? "fill-yellow-400 stroke-yellow-500 text-yellow-500"
                : "stroke-slate-400 text-slate-400"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
