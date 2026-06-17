import { Bookmark, MapPin, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BANNED_POST_STATUS_LABEL } from "../../lib/seekerPostBan";

interface CardListProps {
    id: number;
    organizationName: string;
    title: string;
    engagementType: string;
    location: string;
    salary: string;
    remainingDays: string;
    image?: string;
    isBanned?: boolean;
    isBookmarked?: boolean;
    onBookmark?: () => void;
}


export default function CardList({
    id,
    organizationName,
    title,
    engagementType,
    location,
    salary,
    remainingDays,
    image,
    isBanned = false,
    isBookmarked = false,
    onBookmark,
}: CardListProps) {
    const [bookmark, setBookmark] = useState(isBookmarked);
    const handleBookmark = () => {
        if (isBanned) {
            return;
        }

        setBookmark(!bookmark);
        onBookmark?.();
    };
    return (<>
        <div className={`border flex justify-between p-2 lg:p-4 rounded-lg transition-all duration-300 ${
            isBanned ? "cursor-default opacity-80" : "hover:border-primary hover:shadow-lg hover:scale-101"
        }`}>
            <div className="flex gap-2 lg:gap-5">
                <img src={image || ""} alt={title} className="rounded-lg border w-15 h-15" />
                <div className="flex flex-col justify-around w-full">
                    <div className="flex gap-1">
                        <p className="font-semibold">{organizationName} - {title}</p>
                        <span className="rounded-2xl bg-subPrimary px-2 text-primaryDark w-fit text-sm">{engagementType}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {location && <span className="flex text-small justify-center items-center text-gray-500" ><MapPin className="text-primary" size={15} />{location}</span>}
                        {salary && <span className="flex text-small justify-center items-center text-gray-500"><DollarSign className="text-primary" size={15} />{salary}</span>}
                        {remainingDays && <span className="flex text-small justify-center items-center text-gray-500 "><Calendar className="text-primary" size={15} />{remainingDays}</span>}
                    </div>
                    {isBanned && (
                        <p className="text-sm font-medium text-red-600">{BANNED_POST_STATUS_LABEL}</p>
                    )}
                </div>
            </div>
            <div className="flex gap-2 lg:gap-5 justify-center items-center">
                <button
                    onClick={handleBookmark}
                    disabled={isBanned}
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Bookmark className={bookmark ? "fill-yellow-400 text-yellow-400" : "text-gray-500"} />
                </button>
                {isBanned ? (
                    <span className="btn-primary-white text-gray-500 flex flex-nowrap items-center gap-1 justify-center cursor-not-allowed opacity-60">
                        Apply Now<ArrowRight />
                    </span>
                ) : (
                    <Link to={`/postDetail/${id}`}
                        className="btn-primary-white text-primaryDark hover:text-white flex flex-nowrap items-center gap-1 justify-center">Apply Now<ArrowRight /></Link>
                )}
            </div>
        </div>
    </>);
}

// Example usage:
{/* <CardList
  organization="Google"
  title="Senior Frontend Developer"
  engagementType="Full Time"
  location="San Francisco, CA"
  salary="$120k - $180k"
  remainingDays="3 days left"
  image="/images/company-logo.jpg"
/> */}
