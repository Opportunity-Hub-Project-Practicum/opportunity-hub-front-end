import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, DollarSign, XCircle } from "lucide-react";
import { ROUTES } from "../../../routes/path";
import SearchBox from "../../../GlobalComponents/SearchBox";

type Post = {
    id: string;
    title: string;
    organizationName: string;
    image: string;
    workPlaceType: string;
    salary?: string;
    closeDate: string;
    status: "Active" | "Ban";
    applications: number;
    type: "job" | "volunteer";
};

const mockPosts: Post[] = [
    {
        id: "1",
        title: "Frontend Developer",
        organizationName: "Google",
        image: "https://placehold.co/60x60",
        workPlaceType: "Remote",
        salary: "$1,500 - $2,500",
        closeDate: "2026-06-30",
        status: "Active",
        applications: 23,
        type: "job",
    },
    {
        id: "2",
        title: "Backend Developer",
        organizationName: "Microsoft",
        image: "https://placehold.co/60x60",
        workPlaceType: "Hybrid",
        salary: "$2,000 - $3,000",
        closeDate: "2026-07-15",
        status: "Ban",
        applications: 14,
        type: "job",
    },
    {
        id: "3",
        title: "Community Event Volunteer",
        organizationName: "Red Cross",
        image: "https://placehold.co/60x60",
        workPlaceType: "On-site",
        closeDate: "2026-08-10",
        status: "Active",
        applications: 45,
        type: "volunteer",
    },
    {
        id: "4",
        title: "Teaching Assistant Volunteer",
        organizationName: "Education For All",
        image: "https://placehold.co/60x60",
        workPlaceType: "Remote",
        closeDate: "2026-09-01",
        status: "Active",
        applications: 18,
        type: "volunteer",
    },
];

export default function AllPostPage() {
    const [activeTab, setActiveTab] = useState<"job" | "volunteer">("job");
    const posts: Post[] = mockPosts;

    const currentItems = posts.filter(
        (post) => post.type === activeTab
    );

    return (
        <div className="space-y-4">
            <SearchBox search="" setSearch={() => { }} />
            <div className="grid grid-cols-6 bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium tracking-wider text-[#474C54] uppercase items-center">
                <div className="col-span-3 flex items-center space-x-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('job')}
                        className={`pb-1 font-semibold transition-colors ${activeTab === 'job' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-[#767F8C] hover:text-gray-900'}`}
                    >
                        JOBS
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('volunteer')}
                        className={`pb-1 font-semibold transition-colors ${activeTab === 'volunteer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-[#767F8C] hover:text-gray-900'}`}
                    >
                        Volunteer
                    </button>
                </div>
                <div className=" text-left pl-2">Status</div>
                <div className=" text-left">Applications</div>
                <div className=" text-left pl-4">Actions</div>
            </div>

            {currentItems.map((item) => (
                <div
                    key={item.id}
                    className="grid grid-cols-6 items-center rounded-lg border p-4 transition-all duration-300 hover:scale-[1.01] hover:border-primary hover:shadow-lg"
                >
                    <div className="col-span-3">
                        <div className="flex gap-4">
                            <img
                                src={item.image}
                                alt={item.organizationName}
                                className="h-15 w-15 rounded-lg border bg-white object-cover"
                            />

                            <div className="flex flex-col justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold">
                                        {item.title}
                                    </p>

                                    <span className="h-fit w-fit rounded-2xl bg-subPrimary px-2 py-1 text-sm text-primaryDark">
                                        {item.workPlaceType}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {item.salary && (
                                        <span className="flex items-center text-sm text-gray-500">
                                            <DollarSign
                                                size={15}
                                                className="text-primary"
                                            />
                                            {item.salary}
                                        </span>
                                    )}

                                    <span className="text-sm text-gray-500">
                                        <span className="mr-1 text-red-700">
                                            Close on
                                        </span>
                                        {item.closeDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center pl-2">
                        {item.status === "Active" ? (
                            <span className="inline-flex items-center space-x-1.5 text-sm text-[#28A745] font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Active</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center space-x-1.5 text-sm text-[#DC3545] font-medium">
                                <XCircle className="h-4 w-4" />
                                <span>Ban</span>
                            </span>
                        )}
                    </div>

                    <div className="flex justify-start  text-gray-600">
                        {item.applications}
                    </div>

                    <Link
                        to={ROUTES.HOME.POST_DETAIL(item.id)}
                        className="flex items-center justify-between pl-4"
                    >
                        <span
                            className="bg-slate-200 text-blue-600 text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-slate-200 transition-colors"
                        >
                            View Post
                        </span>
                    </Link>
                </div>
            ))}
        </div>
    );
}