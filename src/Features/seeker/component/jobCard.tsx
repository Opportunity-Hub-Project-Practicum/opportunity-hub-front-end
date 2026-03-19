import { MapPin, Phone, Mail, Bookmark, ArrowRight, Calendar } from "lucide-react";
import { useState } from "react";

interface DetailHeaderProps {
    jobTitle: string;
    companyLogo?: string;
    isFeatured?: boolean;
    jobType: string;
    location: string;
    phone: string;
    email: string;
    daysRemaining: number;
    expiryDate: string;
    onBookmark?: () => void;
    onApply?: () => void;
}

export default function DetailHeader({
    jobTitle,
    companyLogo,
    isFeatured = false,
    jobType,
    location,
    phone,
    email,
    //daysRemaining,
    expiryDate,
    onBookmark,
    onApply,
}: DetailHeaderProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        onBookmark?.();
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12 lg:p-16">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left Side - Company Logo */}
                    <div className="flex-shrink-0 flex items-start justify-start w-full lg:w-1/3">
                        {companyLogo ? (
                            <img
                                src={companyLogo}
                                alt="company"
                                className="w-80 h-64 rounded-2xl object-cover shadow-lg"
                            />
                        ) : (
                            <div className="w-80 h-64 bg-slate-300 rounded-2xl shadow-lg"></div>
                        )}
                    </div>

                    {/* Right Side - Job Details */}
                    <div className="flex flex-col gap-8 flex-1">
                        {/* Job Title and Badges */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-[#181d1c]">
                                    {jobTitle}
                                </h1>

                                {isFeatured && (
                                    <span className="px-3 py-1 bg-[#ffedee] text-[#ff4f4f] text-sm font-medium rounded">
                                        Featured
                                    </span>
                                )}

                                <span className="px-3 py-1 bg-[#e8f1ff] text-[#0066ff] text-sm font-medium rounded">
                                    {jobType}
                                </span>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="flex flex-col gap-4">
                            {/* Location */}
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-slate-600 flex-shrink-0" />
                                <span className="text-lg text-[#475c70]">{location}</span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-slate-600 flex-shrink-0" />
                                <span className="text-lg text-[#475c70]">{phone}</span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-slate-600 flex-shrink-0" />
                                <span className="text-lg text-[#475c70]">{email}</span>
                            </div>
                        </div>

                        {/* Action Buttons and Days Remaining */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-4">
                            <div className="flex gap-4 flex-1 w-full">
                                {/* Bookmark Button */}
                                <button
                                    onClick={handleBookmark}
                                    className="flex items-center justify-center w-14 h-14 bg-blue-50 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                                >
                                    <Bookmark
                                        size={24}
                                        className={`transition-colors ${isBookmarked
                                            ? "fill-yellow-400 stroke-yellow-500 text-yellow-500"
                                            : "stroke-slate-400 text-slate-400"
                                            }`}
                                    />
                                </button>

                                {/* Apply Now Button */}
                                <button
                                    onClick={onApply}
                                    className="flex items-center justify-center gap-3 flex-1 md:flex-initial px-8 py-4 bg-[#0a65cc] text-white font-bold text-lg rounded hover:bg-blue-700 transition-colors"
                                >
                                    Apply now
                                    <ArrowRight size={20} />
                                </button>
                            </div>

                            {/* Days Remaining */}
                            <div className="flex items-center gap-2">
                                <Calendar size={20} className="text-slate-400" />
                                <span className="text-slate-600">Job expire in:</span>
                                <span className="text-[#e05151] font-medium">{expiryDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
