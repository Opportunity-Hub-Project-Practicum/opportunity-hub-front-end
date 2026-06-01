import { Bookmark, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/path";

interface FavCandidateCardProps {
    id: number;
    name: string;
    image?: string;
    postTitle?: string;
    isBookmarked?: boolean;
    onBookmark?: () => void;
}

export default function FavCandidateCard({
    id,
    name,
    image,
    postTitle,
    isBookmarked = true,
    onBookmark,
}: FavCandidateCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[#E4E5E8] bg-white p-4 transition-colors hover:border-primary/30 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-5">
            <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 object-cover ring-1 ring-gray-100 lg:h-16 lg:w-16"
                    />
                ) : (
                    <div className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 bg-slate-100 lg:h-16 lg:w-16" />
                )}
                <div className="min-w-0">
                    <p className="truncate font-semibold text-[#18191C]">{name}</p>
                    {postTitle && (
                        <p className="truncate text-sm text-[#767F8C]">Post: {postTitle}</p>
                    )}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:gap-3">
                <button
                    onClick={onBookmark}
                    type="button"
                    aria-label="Remove saved candidate"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-[#F8F9FA] transition-colors hover:bg-blue-50"
                >
                    <Bookmark
                        size={18}
                        className={
                            isBookmarked
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                        }
                    />
                </button>
                <Link
                    to={`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.SAVE_CANDIDATE_DETAIL(id)}`}
                    className="btn-primary-white inline-flex items-center gap-1.5 whitespace-nowrap text-primaryDark"
                >
                    View Post
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
