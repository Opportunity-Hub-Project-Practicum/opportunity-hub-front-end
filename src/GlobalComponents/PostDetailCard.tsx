import { Link2Icon, ArrowRight, Bookmark, type LucideIcon } from "lucide-react";
import CardCompany from "../features/Seeker/Components/card/CardCompany";
import type { Organization } from "../features/Seeker/Components/card/CardCompany";
import RichTextContent from "./RichTextContent";
/**
 * PostDetailCard
 *
 * Props:
 * - post            {object}   Required. Post data (title, employment_type, post_description, responsibility, job_requirement)
 * - organization    {object}   Required. Organization data (image, Category, value)
 * - overviewItems   {array}    Required. Array of { icon, label, value }
 * - isVolunteer     {boolean}  Optional. Switches labels to volunteer mode. Default: false
 * - isBookmarked    {boolean}  Required. Controlled bookmark state
 * - onBookmark      {function} Required. Called when bookmark button is clicked
 * - onApply         {function} Optional. Called when Apply/Join button is clicked
 * - onReport        {function} Required. Called when Report Post button is clicked
 */
interface Post {
    title: string;
    employment_type: string;
    post_description: string;
    responsibility: string;
    job_requirement?: string | null;
}

type OrgCategory = "web_url" | "social" | "phone";



interface OverviewItem {
    icon: LucideIcon;
    label: string;
    value: string;
}

interface PostDetailCardProps {
    post: Post;
    organization: Organization;
    overviewItems?: OverviewItem[];
    isVolunteer?: boolean;
    isBookmarked: boolean;
    onBookmark: () => void;
    onApply?: () => void;
    onReport: () => void;
}
export default function PostDetailCard({
    post,
    organization,
    overviewItems = [],
    isVolunteer = false,
    isBookmarked,
    onBookmark,
    onApply,
    onReport,
}: PostDetailCardProps) {
    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-start rounded-lg bg-gray-100 p-5 mb-5">
                <div className="flex gap-4">
                    {organization?.image ? (
                        <img
                            src={organization.image}
                            alt="company logo"
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-slate-300 rounded-lg" />
                    )}

                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <h1 className="text-2xl font-bold">{post.title}</h1>
                            <p className="flex px-1 text-small bg-subPrimary rounded-lg justify-center items-center">
                                {post.employment_type}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {(organization?.Category === "web_url" ||
                                organization?.Category === "social" ||
                                organization?.Category === "phone") && (
                                    <div className="flex gap-2 justify-center items-center">
                                        <Link2Icon size={16} />
                                        {organization.value}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onBookmark}
                        className="flex items-center justify-center w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                        <Bookmark
                            size={18}
                            className={`transition-colors ${isBookmarked
                                    ? "fill-yellow-400 stroke-yellow-500 text-yellow-500"
                                    : "stroke-slate-400 text-slate-400"
                                }`}
                        />
                    </button>
                    <button
                        onClick={onApply}
                        className="btn-primary-blue flex items-center gap-2"
                    >
                        {isVolunteer ? "Join Now" : "Apply Now"}
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-5">
                {/* Left: Description */}
                <div className="flex flex-col gap-5 col-span-2">
                    <span className="text-big">
                        {isVolunteer ? "Volunteer Description" : "Job Description"}
                    </span>
                    <RichTextContent
                        value={post.post_description}
                        className="text-small text-gray-600"
                    />
                    <span className="text-big">Responsibilities</span>
                    <RichTextContent
                        value={post.responsibility}
                        className="text-small text-gray-600"
                    />
                    {post.job_requirement && (
                        <>
                            <span className="text-big">
                                {isVolunteer ? "Volunteer Requirements" : "Job Requirements"}
                            </span>
                            <RichTextContent
                                value={post.job_requirement}
                                className="text-small text-gray-600"
                            />
                        </>
                    )}
                    <span>Share this job on: facebook, instagram...</span>
                </div>

                {/* Right: Overview + Company + Report */}
                <div className="flex flex-col gap-5">
                    <div className="border rounded-lg border-primary p-5">
                        <span className="text-big">
                            {isVolunteer ? "Volunteer Overview" : "Job Overview"}
                        </span>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {overviewItems.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={index} className="flex flex-col">
                                        <IconComponent className="text-primary mb-1" size={20} />
                                        <span className="text-small text-gray-500">{item.label}</span>
                                        <span className="text-small font-semibold">{item.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <CardCompany organization={organization} />

                    <button
                        onClick={onReport}
                        className="bg-red-600 text-white rounded-lg p-2"
                    >
                        Report Post
                    </button>
                </div>
            </div>
        </div>
    );
}
