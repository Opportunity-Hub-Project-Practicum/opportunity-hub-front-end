import { BellRing, UserRoundCheck, BriefcaseBusiness, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { ROUTES } from "../../../routes/path";
import { Link } from "react-router-dom";
import { fetchFavouriteCandidates, fetchPosts, type FavouriteCandidate, type Post } from "../../../services/mockJobPortalApi";

type OverviewCounts = {
    saveCandidate: number;
    jobPosts: number;
    volunteerPosts: number;
};

type OverviewItem = {
    id: number;
    organizationName: string;
    title: string;
    workPlaceType: string;
    closeDate: string;
    salary: string | null;
    status: string;
    applications: number;
    image: string;
};

type OverviewState = {
    userName: string;
    counts: OverviewCounts;
    recentItems: {
        job: OverviewItem[];
        volunteer: OverviewItem[];
    };
};

const emptyOverview: OverviewState = {
    userName: "User",
    counts: {
        saveCandidate: 0,
        jobPosts: 0,
        volunteerPosts: 0,
    },
    recentItems: {
        job: [],
        volunteer: [],
    },
};

const toSalaryLabel = (post: Post) => {
    if (!post.salary.isPaid || post.salary.minimum === null || post.salary.maximum === null) {
        return null;
    }

    return `$${post.salary.minimum} - $${post.salary.maximum}`;
};

const toOverviewItem = (post: Post, favouriteCandidates: FavouriteCandidate[]): OverviewItem => {
    const matchedCandidate = favouriteCandidates.find((candidate) => candidate.postId === post.id);

    return {
        id: post.id,
        organizationName: `Employer #${post.employerId}`,
        title: post.title,
        workPlaceType: post.workplaceType,
        closeDate: post.closingDate,
        salary: toSalaryLabel(post),
        status: post.status,
        applications: post.applicationsCount,
        image: post.imageUrl || matchedCandidate?.note || "",
    };
};


export default function OverviewPage() {
    const [isJob, setIsJob] = useState(true)
    const [overview, setOverview] = useState<OverviewState>(emptyOverview)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const loadOverview = async () => {
            setLoading(true)
            setError(null)

            try {
                const [postsResponse, favouriteCandidatesResponse] = await Promise.all([
                    fetchPosts({ pageSize: 50, delayMs: 650 }),
                    fetchFavouriteCandidates({ employerId: 1, pageSize: 50, delayMs: 650 }),
                ])

                if (!postsResponse.ok) {
                    throw new Error(postsResponse.error.message)
                }

                if (!favouriteCandidatesResponse.ok) {
                    throw new Error(favouriteCandidatesResponse.error.message)
                }

                const jobPosts = postsResponse.data.items.filter((post) => post.postType === "job")
                const volunteerPosts = postsResponse.data.items.filter((post) => post.postType === "volunteer")

                if (!isMounted) return

                setOverview({
                    userName: "mokot",
                    counts: {
                        saveCandidate: favouriteCandidatesResponse.data.items.length,
                        jobPosts: jobPosts.length,
                        volunteerPosts: volunteerPosts.length,
                    },
                    recentItems: {
                        job: jobPosts.slice(0, 5).map((post) => toOverviewItem(post, favouriteCandidatesResponse.data.items)),
                        volunteer: volunteerPosts.slice(0, 5).map((post) => toOverviewItem(post, favouriteCandidatesResponse.data.items)),
                    },
                })
            } catch (loadError) {
                if (!isMounted) return
                setError(loadError instanceof Error ? loadError.message : "Failed to load overview data.")
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        void loadOverview()

        return () => {
            isMounted = false
        }
    }, [])

    const currentItems = overview.recentItems[isJob ? 'job' : 'volunteer']
    const handleClosePost = (id: number) => {

        const confirmed = window.confirm('Are you sure you want to close this post?')
        if (!confirmed) return
        const key = isJob ? 'job' : 'volunteer'
        setOverview(prev => ({
            ...prev,
            recentItems: {
                ...prev.recentItems,
                [key]: prev.recentItems[key].map((it: any) => it.id === id ? { ...it, status: 'Closed' } : it)
            }
        }))
    }
    const metricCards = [
        { key: "saveCandidate", label: "Save Candidate", bg: "bg-subPrimary", icon: UserRoundCheck },
        { key: "jobPosts", label: "Job Posts", bg: "bg-subPrimary", icon: BriefcaseBusiness },
        { key: "volunteerPosts", label: "Volunteer Posts", bg: "bg-subPrimary", icon: BellRing },

    ] as const;
    return (<>
        <div className="page-container flex flex-col gap-4 ">
            <span>Hello, {overview?.userName ?? "User"}</span>
            <small className="text-gray-600">Here is your Daily Activity</small>

            {loading && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                    Loading overview data...
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                {metricCards.map((metric) => {

                    return (
                        <div
                            key={metric.key}
                            className="rounded-xl border border-[#E4E5E8] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-col justify-center">
                                    <span className="text-2xl font-bold text-[#18191C]">{overview.counts[metric.key]}</span>
                                    <span className="whitespace-nowrap text-sm text-[#767F8C]">{metric.label}</span>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-subPrimary">
                                    <metric.icon className="text-primary" size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="flex flex-col gap-3">
                <span className="text-sm text-[#767F8C]">Here is your Recent Posts</span>
                <div className="grid grid-cols-6 items-center rounded-xl bg-[#F1F2F4] px-4 py-3 text-[12px] font-medium uppercase tracking-wide text-[#474C54] lg:px-6">
                    <div className="col-span-3 flex gap-4">
                        <button
                            type="button"
                            className={isJob ? "border-b-2 border-primary pb-1 font-semibold text-primary" : "pb-1 text-[#767F8C] hover:text-gray-900"}
                            onClick={() => setIsJob(true)}
                        >
                            Jobs
                        </button>
                        <button
                            type="button"
                            className={!isJob ? "border-b-2 border-primary pb-1 font-semibold text-primary" : "pb-1 text-[#767F8C] hover:text-gray-900"}
                            onClick={() => setIsJob(false)}
                        >
                            Volunteers
                        </button>
                    </div>
                    <span>Status</span>
                    <span>Apllications</span>
                    <span>Action</span>
                </div>
                {!loading && currentItems.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                        No {isJob ? "job" : "volunteer"} activity found.
                    </div>
                )}

                {currentItems.map((item) => (
                    <div
                        key={`${item.id}`}
                        className="grid grid-cols-6 items-center gap-3 rounded-xl border border-[#E4E5E8] bg-white px-4 py-4 transition-colors hover:border-primary/30 hover:shadow-sm lg:px-5"
                    >
                        <div className="col-span-3 flex justify-between">
                            <div className="flex min-w-0 gap-3 lg:gap-4">
                                <img
                                    src={item.image}
                                    alt={item.organizationName}
                                    className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 object-cover bg-white ring-1 ring-gray-100 lg:h-16 lg:w-16"
                                />
                                <div className="flex min-w-0 flex-col justify-center gap-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-[#18191C]">{item.title}</p>
                                        <span className="h-fit w-fit rounded-full bg-subPrimary px-2.5 py-0.5 text-xs font-medium text-primaryDark">
                                            {item.workPlaceType}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {item.salary && (
                                            <span className="flex items-center text-sm text-[#767F8C]">
                                                <DollarSign className="mr-1 text-primary" size={15} />
                                                {item.salary}
                                            </span>
                                        )}
                                        {item.closeDate && (
                                            <span className="flex items-center text-sm text-[#767F8C]">
                                                <span className="mr-1 text-red-700">Close on</span>
                                                {item.closeDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleClosePost(item.id)}
                            className={`flex items-center hover:cursor-pointer ${item.status === 'open' ? 'text-blue-600' : 'text-red-600'}`}
                        >
                            {item.status}
                        </button>
                        <span className="flex items-center font-medium text-green-600">{item.applications}</span>
                        <Link
                            to={ROUTES.HOME.POST_DETAIL(item.id)}
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primaryDark"
                        >
                            View Post
                        </Link>
                    </div>
                ))}
            </section>
        </div>
    </>)
}