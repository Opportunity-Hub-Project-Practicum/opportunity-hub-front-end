import BackButton from "../Components/BackButton";
import { useParams } from "react-router-dom";
import RichTextContent from "../../../GlobalComponents/RichTextContent";
import CardCompany from "../Components/card/CardCompany";
import CardGrid from "../Components/card/CardGrid";
import { useEffect, useMemo, useState } from "react";
import { formatApiError } from "../../../services/apiClient";
import {
    fetchPublicEmployer,
    fetchPublicEmployerContacts,
    mapEmployerToCardCompany,
} from "../services/employerService";
import {
    fetchPublicPosts,
    formatClosedDate,
    formatPostSalary,
} from "../services/postApiService";
import type { EmployerContactApi, PublicEmployerDetailApi } from "../types/employer";
import type { PublicPostApi } from "../types/post";

export default function OrganizationDetail() {
    const [opportunityType, setOpportunityType] = useState<"job" | "volunteer">("job");
    const [employer, setEmployer] = useState<PublicEmployerDetailApi | null>(null);
    const [contacts, setContacts] = useState<EmployerContactApi[]>([]);
    const [posts, setPosts] = useState<PublicPostApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const employerId = Number(id);

    useEffect(() => {
        if (!employerId || Number.isNaN(employerId)) {
            setLoading(false);
            setEmployer(null);
            return;
        }

        let isMounted = true;

        const loadEmployer = async () => {
            setLoading(true);
            setError(null);

            try {
                const [profile, contacts] = await Promise.all([
                    fetchPublicEmployer(employerId),
                    fetchPublicEmployerContacts(employerId),
                ]);

                if (!isMounted) {
                    return;
                }

                if (!profile) {
                    setEmployer(null);
                    return;
                }

                setEmployer(profile);
                setContacts(contacts);
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

        loadEmployer();

        return () => {
            isMounted = false;
        };
    }, [employerId]);

    useEffect(() => {
        if (!employerId || Number.isNaN(employerId)) {
            return;
        }

        let isMounted = true;

        const loadPosts = async () => {
            setPostsLoading(true);

            try {
                const data = await fetchPublicPosts({
                    type: opportunityType,
                    employerId,
                });
                if (!isMounted) {
                    return;
                }

                setPosts(data);
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                setError(formatApiError(err));
            } finally {
                if (isMounted) {
                    setPostsLoading(false);
                }
            }
        };

        loadPosts();

        return () => {
            isMounted = false;
        };
    }, [employerId, opportunityType]);

    const cardCompany = useMemo(
        () => (employer ? mapEmployerToCardCompany(employer, contacts) : undefined),
        [employer, contacts],
    );

    const openPositions = useMemo(
        () => employer?.open_posts_count ?? posts.length,
        [employer?.open_posts_count, posts.length],
    );

    if (loading) {
        return <div className="page-container">Loading organization...</div>;
    }

    if (!employer) {
        return <div className="page-container">Organization not found</div>;
    }

    return (
        <div className="page-container flex flex-col mb-5">
            <BackButton />

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="p-5 rounded-lg flex gap-5 border shadow-gray-200 border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                {employer.logo_img ? (
                    <img
                        className="rounded-lg w-15 h-15 object-cover"
                        src={employer.logo_img}
                        alt={employer.company_name}
                    />
                ) : (
                    <div className="rounded-lg w-15 h-15 bg-gray-300" />
                )}
                <div className="flex flex-col">
                    <span>{employer.company_name}</span>
                    <span>{employer.industry_type}</span>
                    <span className="text-sm text-gray-600">
                        {openPositions} open position{openPositions === 1 ? "" : "s"}
                    </span>
                </div>
            </div>
            <section className="grid grid-cols-2 lg:grid-cols-3">
                <div className="col-span-2 flex flex-col p-5">
                    <p className="flex flex-col gap-5">
                        <span className="text-big">Description</span>
                        <RichTextContent
                            value={employer.about_us}
                            className="text-small text-gray-600"
                        />
                    </p>
                    <p className="flex flex-col gap-5">
                        <span className="text-big">Organization Vision</span>
                        <RichTextContent
                            value={employer.company_vision}
                            className="text-small text-gray-600"
                        />
                    </p>
                    <span className="text-small text-gray-600">Share this on: facebook , instagram...</span>
                </div>
                <div className="flex flex-col gap-5 rounded-lg p-5">
                    <CardCompany organization={cardCompany} />
                </div>
            </section>
            <hr className="border-t border-gray-600 my-5" />
            <section className="flex flex-col">
                <div className="flex justify-between mb-5">
                    <span className="text-big">Open Positions</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setOpportunityType("volunteer")}
                            className={opportunityType === "volunteer" ? "btn-primary-blue" : "btn-primary-white"}
                        >
                            Volunteer
                        </button>
                        <button
                            onClick={() => setOpportunityType("job")}
                            className={opportunityType === "job" ? "btn-primary-blue" : "btn-primary-white"}
                        >
                            Job
                        </button>
                    </div>
                </div>
                {postsLoading && <p className="text-gray-500 mb-4">Loading positions...</p>}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                    {!postsLoading && posts.length === 0 && (
                        <p className="text-gray-500 col-span-full">No open positions found.</p>
                    )}
                    {posts.map((post) => (
                        <CardGrid
                            key={post.post_id}
                            id={post.post_id}
                            organizationName={employer.company_name}
                            title={post.post_title}
                            engagementType={post.work_place_type ?? post.type}
                            location={post.location ?? ""}
                            salary={formatPostSalary(post)}
                            remainingDays={formatClosedDate(post.closed_date)}
                            image={employer.logo_img ?? ""}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
