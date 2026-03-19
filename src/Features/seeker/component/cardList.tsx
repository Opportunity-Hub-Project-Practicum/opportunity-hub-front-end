import { MapPin, Calendar, Bookmark, ArrowRight, DollarSign } from "lucide-react";
import { useState } from "react";

interface CardListProps {
  jobTitle: string;
  companyLogo?: string;
  isFeatured?: boolean;
  jobType: string;
  location: string;
  salary: string;
  daysRemaining: number;
  onBookmark?: () => void;
  onApply?: () => void;
}

export default function CardList({
  jobTitle,
  companyLogo,
  isFeatured = false,
  jobType,
  location,
  salary,
  daysRemaining,
  onBookmark,
  onApply,
}: CardListProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 md:p-5">
      {/* Main Container */}
      <div className="flex flex-col gap-4">
        {/* Top Row - Company, Title, and Badges */}
        <div className="flex items-start gap-4">
          {/* Company Logo Box */}
          <div className="bg-slate-900 rounded-md p-5 flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="company"
                className="w-8 h-8"
              />
            ) : (
              <div className="w-8 h-8 bg-slate-700 rounded"></div>
            )}
          </div>

          {/* Job Title and Badges */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{jobTitle}</h3>
              
              {isFeatured && (
                <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded">
                  Featured
                </span>
              )}
              
              <span className="px-3 py-1 text-blue-600 text-sm font-medium">
                {jobType}
              </span>
            </div>

            {/* Job Details - Location, Salary, Days */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-600" />
                <span className="text-slate-600">{location}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-slate-600" />
                <span className="text-slate-600">{salary}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-600" />
                <span className="text-slate-600">{daysRemaining} Days Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Actions */}
        <div className="flex items-center justify-between">
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <Bookmark
              size={20}
              className={`transition-colors ${
                isBookmarked
                  ? "fill-yellow-400 stroke-yellow-500 text-yellow-500"
                  : "stroke-slate-400 text-slate-400"
              }`}
            />
          </button>

          {/* Apply Now Button */}
          <button
            onClick={onApply}
            className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 font-bold text-sm rounded hover:bg-blue-100 transition-colors"
          >
            Apply Now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
