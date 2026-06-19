import { useParams } from "react-router-dom";
import { getPostLookupName, getPostLookupValue } from "../lib/postLookup";
import { fetchSearchPosts } from "../lib/searchPosts";
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    GraduationCap,
    Link2Icon,
    MapPin,
    Star,
} from "lucide-react";
import UrgentBadge from "../Components/UrgentBadge";
import BackButton from "../Components/BackButton";
import { useEffect, useMemo, useState } from "react";
import CardCompany from "../Components/card/CardCompany";
import CardGrid from "../Components/card/CardGrid";
import ApplyModal from "../Components/modal/ApplyModal";
import ReportModal from "../Components/modal/ReportModal";
import RichTextContent from "../../../GlobalComponents/RichTextContent";
import { useAuth } from "../../../contexts/AuthContext";
import { formatApiError } from "../../../services/apiClient";
import { resolveAssetUrl } from "../../Employer/lib/resolveAssetUrl";
import {
    fetchPublicEmployer,
    fetchPublicEmployerContacts,
    mapEmployerToCardCompany,
} from "../services/employerService";
import { fetchSeekerApplications, submitApplication } from "../services/applicationService";
import {
    addFavoritePost,
    fetchFavoritePosts,
    findFavoriteForPost,
    removeFavoritePost,
} from "../services/favoritePostService";
import {
    fetchPostDetailWithEmployer,
    formatClosedDate,
    formatPostSalary,
    formatWorkPlaceType,
} from "../services/postApiService";
import { fetchAdminPost } from "../../Admin/services/adminPostService";
import { fetchAdminEmployer } from "../../Admin/services/adminUserService";
import type { EmployerProfileApi } from "../../Employer/types/employerProfile";
import { submitPostReport } from "../services/reportService";
import type { Organization } from "../Components/card/CardCompany";
import type { PostDetailApi, PublicPostApi } from "../types/post";
import { BANNED_POST_STATUS_LABEL, isPostBannedForSeeker } from "../lib/seekerPostBan";

type OverviewItem = {
    label: string;
    value: string;
    icon: typeof Calendar;
};

function formatPostedDate(isoDate: string | null): string {
    if (!isoDate) {
        return "";
    }

    return new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function buildRelatedPosts(post: PostDetailApi, posts: PublicPostApi[]): PublicPostApi[] {
    const sameRole = posts.filter(
        (item) =>
            item.post_id !== post.post_id &&
            post.job_role &&
            getPostLookupValue(item.job_role) === getPostLookupValue(post.job_role),
    );

    const source = sameRole.length > 0
        ? sameRole
        : posts.filter((item) => item.post_id !== post.post_id);

    return source.slice(0, 6);
}

function buildSameCompanyPosts(post: PostDetailApi, posts: PublicPostApi[]): PublicPostApi[] {
    const employerId = post.employer?.user_id;
    if (!employerId) {
        return [];
    }

    return posts
        .filter(
            (item) =>
                item.post_id !== post.post_id &&
                item.employer?.user_id === employerId,
        )
        .slice(0, 6);
}

function PostCardsSection({
    title,
    posts,
    emptyMessage,
    isPostBanned,
}: {
    title: string;
    posts: PublicPostApi[];
    emptyMessage: string;
    isPostBanned: boolean;
}) {
    return (
        <section className="flex flex-col page-container">
            <div className="flex justify-between py-5">
                <span className="text-big">{title}</span>

            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.length === 0 && (
                    <p className="text-gray-500 col-span-full">{emptyMessage}</p>
                )}
                {posts.map((relatedPost) => (
                    <CardGrid
                        key={relatedPost.post_id}
                        id={relatedPost.post_id}
                        organizationName={relatedPost.employer?.company_name ?? "Unknown"}
                        title={relatedPost.post_title}
                        engagementType={relatedPost.work_place_type ?? relatedPost.type}
                        location={getPostLookupName(relatedPost.location)}
                        salary={formatPostSalary(relatedPost)}
                        remainingDays={formatClosedDate(relatedPost.closed_date)}
                        image={resolveAssetUrl(relatedPost.employer?.logo_img)}
                        isUrgent={relatedPost.is_urgent === true}
                    />
                ))}
            </div>
        </section>
    );
}

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const postId = Number(id);
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const [post, setPost] = useState<PostDetailApi | null>(null);
    const [organization, setOrganization] = useState<Organization | undefined>();
    const [relatedPosts, setRelatedPosts] = useState<PublicPostApi[]>([]);
    const [sameCompanyPosts, setSameCompanyPosts] = useState<PublicPostApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [favoritePostId, setFavoritePostId] = useState<number | null>(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isSubmittingFavorite, setIsSubmittingFavorite] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!postId || Number.isNaN(postId)) {
            setLoading(false);
            setPost(null);
            return;
        }

        let isMounted = true;
        const isAdmin = user?.role === "admin";

        const loadPost = async () => {
            setLoading(true);
            setError(null);

            try {
                const postData = isAdmin
                    ? await fetchAdminPost(postId).catch(() => null)
                    : await fetchPostDetailWithEmployer(postId);
                if (!isMounted) {
                    return;
                }

                if (!postData) {
                    setPost(null);
                    return;
                }

                setPost(postData);

                const employerId = postData.employer?.user_id;
                const jobRoleSlug = getPostLookupValue(postData.job_role);
                const [employerProfile, contacts, relatedSearch, companyPosts] = await Promise.all([
                    employerId
                        ? (isAdmin
                            ? fetchAdminEmployer(employerId).catch(() => null)
                            : fetchPublicEmployer(employerId))
                        : Promise.resolve(null),
                    employerId && !isAdmin
                        ? fetchPublicEmployerContacts(employerId)
                        : Promise.resolve([]),
                    jobRoleSlug && !isAdmin
                        ? fetchSearchPosts({ type: postData.type, job_role: jobRoleSlug })
                        : Promise.resolve([]),
                    employerId && !isAdmin
                        ? fetchSearchPosts({ type: postData.type, employer_id: employerId })
                        : Promise.resolve([]),
                ]);

                if (!isMounted) {
                    return;
                }

                if (employerProfile) {
                    const employerContacts = isAdmin
                        ? (employerProfile as EmployerProfileApi).contacts ?? []
                        : contacts;
                    setOrganization(mapEmployerToCardCompany(employerProfile, employerContacts));
                } else if (postData.employer) {
                    setOrganization({
                        image: resolveAssetUrl(postData.employer.logo_img),
                        name: postData.employer.company_name,
                        industry_type: "",
                    });
                } else {
                    setOrganization(undefined);
                }

                setRelatedPosts(buildRelatedPosts(postData, relatedSearch));
                setSameCompanyPosts(buildSameCompanyPosts(postData, companyPosts));
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadPost();

        return () => {
            isMounted = false;
        };
    }, [postId, isAuthLoading, user?.role]);

    useEffect(() => {
        if (isAuthLoading || !post || !isAuthenticated || user?.role !== "seeker") {
            setIsBookmarked(false);
            setFavoritePostId(null);
            setHasApplied(false);
            return;
        }

        let isMounted = true;

        const loadSeekerPostState = async () => {
            try {
                const [favorites, applications] = await Promise.all([
                    fetchFavoritePosts(),
                    fetchSeekerApplications(),
                ]);

                if (!isMounted) {
                    return;
                }

                const favorite = findFavoriteForPost(favorites, post.post_id);
                setIsBookmarked(Boolean(favorite));
                setFavoritePostId(favorite?.favorite_post_id ?? null);
                setHasApplied(applications.some((application) => application.post_id === post.post_id));
            } catch {
                if (!isMounted) {
                    return;
                }
                setIsBookmarked(false);
                setFavoritePostId(null);
                setHasApplied(false);
            }
        };

        loadSeekerPostState();

        return () => {
            isMounted = false;
        };
    }, [post, isAuthenticated, isAuthLoading, user?.role]);

    const isAdminViewer = user?.role === "admin";
    const isVolunteer = post?.type === "volunteer";

    const overviewItems = useMemo<OverviewItem[]>(() => {
        if (!post) {
            return [];
        }

        const items: Array<OverviewItem & { show: boolean }> = [
            {
                label: "Posted",
                value: formatPostedDate(post.created_at),
                icon: Calendar,
                show: !!post.created_at,
            },
            {
                label: "Expire In",
                value: formatClosedDate(post.closed_date),
                icon: Clock,
                show: !!post.closed_date,
            },
            {
                label: isVolunteer ? "Benefit" : "Salary",
                value: formatPostSalary(post),
                icon: DollarSign,
                show: true,
            },
            {
                label: "Education",
                value: post.job_education ?? "",
                icon: GraduationCap,
                show: !isVolunteer && !!post.job_education,
            },
            {
                label: "Location",
                value: getPostLookupName(post.location),
                icon: MapPin,
                show: !!getPostLookupName(post.location),
            },
            {
                label: "Job Role",
                value: getPostLookupName(post.job_role),
                icon: Briefcase,
                show: !isVolunteer && !!getPostLookupName(post.job_role),
            },
            {
                label: "Experience",
                value: post.job_experience ?? "",
                icon: Star,
                show: !isVolunteer && !!post.job_experience,
            },
        ];

        return items.filter((item) => item.show);
    }, [post, isVolunteer]);

    const handleBookmark = async () => {
        if (!post || isSubmittingFavorite) {
            return;
        }

        if (!isAuthenticated || user?.role !== "seeker") {
            setActionError("Sign in as a seeker to save this post.");
            return;
        }

        setIsSubmittingFavorite(true);
        setActionError(null);
        setActionMessage(null);

        try {
            if (isBookmarked && favoritePostId != null) {
                await removeFavoritePost(favoritePostId);
                setIsBookmarked(false);
                setFavoritePostId(null);
                setActionMessage("Post removed from favorites.");
                return;
            }

            const favorite = await addFavoritePost(post.post_id);
            setIsBookmarked(true);
            setFavoritePostId(favorite.favorite_post_id);
            setActionMessage("Post saved to favorites.");
        } catch (err) {
            setActionError(formatApiError(err));
        } finally {
            setIsSubmittingFavorite(false);
        }
    };

    const handleApplyClick = () => {
        if (!post || hasApplied || isSubmittingApplication) {
            return;
        }

        if (!isAuthenticated || user?.role !== "seeker") {
            setActionError("Sign in as a seeker to apply for this post.");
            return;
        }

        setActionError(null);
        setActionMessage(null);

        if (isVolunteer) {
            void handleApplySubmit(null);
            return;
        }

        setIsApplyModalOpen(true);
    };

    const handleApplySubmit = async (cvResumePath: string | null) => {
        if (!post) {
            return;
        }

        setIsSubmittingApplication(true);
        setActionError(null);
        setActionMessage(null);

        try {
            await submitApplication({
                post_uuid: post.uuid,
                cv_resume_file: cvResumePath,
            });
            setHasApplied(true);
            setIsApplyModalOpen(false);
            setActionMessage(
                isVolunteer ? "Volunteer application submitted successfully." : "Application submitted successfully.",
            );
        } catch (err) {
            setActionError(formatApiError(err));
            throw err;
        } finally {
            setIsSubmittingApplication(false);
        }
    };

    const handleReportSubmit = async (report: string) => {
        if (!post || isSubmittingReport) {
            return;
        }

        if (!isAuthenticated || user?.role !== "seeker") {
            setActionError("Sign in as a seeker to report this post.");
            setIsReport(false);
            return;
        }

        setIsSubmittingReport(true);
        setActionError(null);
        setActionMessage(null);

        try {
            await submitPostReport(post.post_id, report);
            setActionMessage("Report submitted successfully.");
            setIsReport(false);
        } catch (err) {
            setActionError(formatApiError(err));
        } finally {
            setIsSubmittingReport(false);
        }
    };

    if (loading) {
        return <div className="page-container">Loading post...</div>;
    }

    if (!post) {
        return <div className="page-container">Post not found</div>;
    }

    const engagementLabel = formatWorkPlaceType(post.work_place_type) || post.type;
    const isPostBanned = isPostBannedForSeeker(post.is_ban);

    return (
        <>
            <section className="page-container">
                <BackButton />

                {isPostBanned && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {BANNED_POST_STATUS_LABEL}
                    </div>
                )}

                {error && <p className="text-red-600 mb-4">{error}</p>}
                {actionError && <p className="text-red-600 mb-4">{actionError}</p>}
                {actionMessage && <p className="text-green-600 mb-4">{actionMessage}</p>}

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
                            <div className="flex gap-2 flex-wrap items-center">
                                <h1 className="text-2xl font-bold">{post.post_title}</h1>
                                {post.is_urgent && <UrgentBadge />}
                                <p className="flex px-1 text-small bg-subPrimary rounded-lg justify-center items-center">
                                    {engagementLabel}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {organization?.Category === "web_url" && (
                                    <div className="flex gap-2 justify-center items-center">
                                        <Link2Icon size={16} /> {organization.value}
                                    </div>
                                )}
                                {organization?.Category === "social" && (
                                    <div className="flex gap-2 justify-center items-center">
                                        <Link2Icon size={16} /> {organization.value}
                                    </div>
                                )}
                                {organization?.Category === "phone" && (
                                    <div className="flex gap-2 justify-center items-center">
                                        <Link2Icon size={16} /> {organization.value}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {!isAdminViewer && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleBookmark}
                                disabled={isPostBanned || isSubmittingFavorite}
                                className="flex items-center justify-center w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded transition-colors disabled:cursor-not-allowed disabled:opacity-60"
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
                                onClick={handleApplyClick}
                                disabled={isPostBanned || hasApplied || isSubmittingApplication}
                                className="btn-primary-blue flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {hasApplied
                                    ? isVolunteer
                                        ? "Joined"
                                        : "Applied"
                                    : isVolunteer
                                        ? "Join Now"
                                        : "Apply Now"}
                                {!hasApplied && <ArrowRight size={16} />}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-5">
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
                        <span>Share this job on: facebook, instargram...</span>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="border rounded-lg border-primary p-5">
                            <span className="text-big">
                                {isVolunteer ? "Volunteer Overview" : "Job Overview"}
                            </span>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {overviewItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={item.label} className="flex flex-col">
                                            <IconComponent className="text-primary mb-1" size={20} />
                                            <span className="text-small text-gray-500">{item.label}</span>
                                            <span className="text-small font-semibold">{item.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <CardCompany organization={organization} />

                        {!isAdminViewer && (
                            <button
                                onClick={() => setIsReport(true)}
                                disabled={isPostBanned}
                                className="bg-red-600 text-white rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Report Post
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <PostCardsSection
                title={`Related ${isVolunteer ? "Volunteer" : "Jobs"}`}
                posts={relatedPosts}
                emptyMessage="No related posts found."
                isPostBanned={isPostBanned}
            />

            <PostCardsSection
                title={`${isVolunteer ? "Volunteer" : "Jobs"} from the same company`}
                posts={sameCompanyPosts}
                emptyMessage="No other posts from this company."
                isPostBanned={isPostBanned}
            />

            {!isAdminViewer && isApplyModalOpen && !isVolunteer && (
                <ApplyModal
                    isSubmitting={isSubmittingApplication}
                    onClose={() => !isSubmittingApplication && setIsApplyModalOpen(false)}
                    onSubmit={handleApplySubmit}
                />
            )}

            {!isAdminViewer && isReport && (
                <ReportModal
                    onClose={() => setIsReport(false)}
                    onSubmit={handleReportSubmit}
                />
            )}
        </>
    );
}
