import { ArrowRight, House, Star, Origami, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Components/searchBar";
import CardGrid from "../Components/card/CardGrid";
import heroimg from "../../../assets/heroimg.png";
import howOurWebWork from "../../../assets/howOurWebWork.png";
import { ROUTES } from "../../../routes/path";
import { useAuth } from "../../../contexts/AuthContext";
import { formatApiError } from "../../../services/apiClient";
import { fetchHomeSeekerData } from "../services/homeSeekerService";
import { fetchRecommendedPosts } from "../services/recommendationService";
import type { HomePostCard, HomeSeekerData } from "../types/homeSeeker";

const EMPTY_HOME_DATA: HomeSeekerData = {
    popularCategories: [],
    heroBanners: [],
    topCompanies: [],
    latestJobs: [],
    latestVolunteers: [],
    featuredJobs: [],
    featuredVolunteers: [],
};

function getHeroIcon(label: string) {
    if (label === "Live Job") {
        return Star;
    }
    if (label === "Companies") {
        return House;
    }
    if (label === "Candidates") {
        return Users;
    }
    return Origami;
}

export default function HomeSeeker() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [homeData, setHomeData] = useState<HomeSeekerData>(EMPTY_HOME_DATA);
    const [recommendedJobs, setRecommendedJobs] = useState<HomePostCard[]>([]);
    const [recommendedVolunteers, setRecommendedVolunteers] = useState<HomePostCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const showRecommendations = isAuthenticated && user?.role === "seeker";

    useEffect(() => {
        let isMounted = true;

        const loadHomeData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchHomeSeekerData();
                if (!isMounted) {
                    return;
                }
                setHomeData(data);
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

        loadHomeData();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!showRecommendations) {
            setRecommendedJobs([]);
            setRecommendedVolunteers([]);
            return;
        }

        let isMounted = true;

        const loadRecommendations = async () => {
            setRecommendationsLoading(true);

            try {
                const [jobs, volunteers] = await Promise.all([
                    fetchRecommendedPosts("job", 6),
                    fetchRecommendedPosts("volunteer", 6),
                ]);
                if (!isMounted) {
                    return;
                }
                setRecommendedJobs(jobs);
                setRecommendedVolunteers(volunteers);
            } catch {
                if (!isMounted) {
                    return;
                }
                setRecommendedJobs([]);
                setRecommendedVolunteers([]);
            } finally {
                if (isMounted) {
                    setRecommendationsLoading(false);
                }
            }
        };

        loadRecommendations();

        return () => {
            isMounted = false;
        };
    }, [showRecommendations]);

    const showRegistrationPromo = !(isAuthenticated && user?.role === "seeker");

    const handlePopularCategoryClick = (categoryValue: string) => {
        navigate(ROUTES.HOME.POST_LIST, {
            state: {
                category: categoryValue,
                opportunityType: "job",
            },
        });
    };

    return (
        <>
            <section className="flex flex-col page-container gap-5 bg-gray-100">
                <SearchBar />

                {loading && <p className="text-gray-500">Loading home page...</p>}
                {error && <p className="text-red-600">{error}</p>}

                <div className="grid grid-cols-3">
                    <div className="col-span-2 lg:px-20 flex flex-col gap-5">
                        <strong className="text-4xl">
                            Find a job or volunteer that suits your interest & skills.
                        </strong>

                        <span>
                            idk some description here, encorage word or something
                        </span>

                        <div className="flex gap-3">
                            <span className="flex">Popular categories:</span>
                            <ul className="flex gap-2">
                                {homeData.popularCategories.length === 0 && (
                                    <li className="text-gray-500 text-sm">No categories yet</li>
                                )}
                                {homeData.popularCategories.map((category, index) => (
                                    <li key={category.value}>
                                        <button
                                            type="button"
                                            onClick={() => handlePopularCategoryClick(category.value)}
                                            className={`rounded px-2 transition-colors hover:bg-subPrimary ${index === 0 ? "bg-subPrimary" : ""
                                                }`}
                                        >
                                            {category.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <img className="w-auto h-auto" src={heroimg} alt="" />
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-15">
                    {homeData.heroBanners.map((item) => {
                        const IconComponent = getHeroIcon(item.label);

                        return (
                            <div key={item.id} className="p-3 rounded-lg w-full flex justify-start gap-5 bg-white">
                                <p className="flex justify-center items-center bg-subPrimary text-primary w-12 h-12 rounded border-2">
                                    <IconComponent size={24} />
                                </p>
                                <div className="flex flex-col">
                                    <p className="text-xl">{item.count}</p>
                                    <p className="text-gray-600 text-small">{item.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {showRecommendations && !recommendationsLoading && recommendedJobs.length > 0 && (
                <section className="page-container">
                    <span className="text-big">Recommend Job for you</span>

                    <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                        {recommendedJobs.map((item) => (
                            <div key={item.postId}>
                                <CardGrid
                                    id={item.postId}
                                    organizationName={item.organizationName}
                                    title={item.title}
                                    engagementType={item.engagementType}
                                    location={item.location}
                                    salary={item.salary}
                                    remainingDays={item.remainingDays}
                                    image={item.image}
                                    isUrgent={item.isUrgent}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {showRecommendations && !recommendationsLoading && recommendedVolunteers.length > 0 && (
                <section className="page-container">
                    <span className="text-big">Recommend Volunteer for you</span>

                    <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                        {recommendedVolunteers.map((item) => (
                            <div key={item.postId}>
                                <CardGrid
                                    id={item.postId}
                                    organizationName={item.organizationName}
                                    title={item.title}
                                    engagementType={item.engagementType}
                                    location={item.location}
                                    salary={item.salary}
                                    remainingDays={item.remainingDays}
                                    image={item.image}
                                    isUrgent={item.isUrgent}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="page-container">
                <div className="flex justify-between">
                    <span className="text-big">Latest Job</span>
                    <Link
                        to={ROUTES.HOME.POST_LIST}
                        state={{ opportunityType: "job" }}
                        className="text-primary underline"
                    >
                        View more
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                    {homeData.latestJobs.length === 0 && (
                        <p className="col-span-full text-sm text-gray-500">No latest jobs yet.</p>
                    )}
                    {homeData.latestJobs.map((item) => (
                        <div key={item.postId}>
                            <CardGrid
                                id={item.postId}
                                organizationName={item.organizationName}
                                title={item.title}
                                engagementType={item.engagementType}
                                location={item.location}
                                salary={item.salary}
                                remainingDays={item.remainingDays}
                                image={item.image}
                                isUrgent={item.isUrgent}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="page-container">
                <div className="flex justify-between">
                    <span className="text-big">Latest Volunteer</span>
                    <Link
                        to={ROUTES.HOME.POST_LIST}
                        state={{ opportunityType: "volunteer" }}
                        className="text-primary underline"
                    >
                        View more
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                    {homeData.latestVolunteers.length === 0 && (
                        <p className="col-span-full text-sm text-gray-500">No latest volunteers yet.</p>
                    )}
                    {homeData.latestVolunteers.map((item) => (
                        <div key={item.postId}>
                            <CardGrid
                                id={item.postId}
                                organizationName={item.organizationName}
                                title={item.title}
                                engagementType={item.engagementType}
                                location={item.location}
                                salary={item.salary}
                                remainingDays={item.remainingDays}
                                image={item.image}
                                isUrgent={item.isUrgent}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <img
                    className="rounded-lg h-auto w-full"
                    src={howOurWebWork}
                    alt="image showing how the web work"
                />
            </section>

            <section className="page-container">
                <span className="text-big mb-5">Top Companies</span>
                <ul className="custom-list-layout my-5">
                    {homeData.topCompanies.length === 0 && (
                        <li className="text-gray-500 text-sm">No companies found.</li>
                    )}
                    {homeData.topCompanies.map((item) => (
                        <li
                            key={item.employerId}
                            className="w-full rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-start gap-2 w-full">
                                <div className="border rounded-lg w-16 h-16 mb-3 overflow-hidden">
                                    {item.image ? (
                                        <img className="h-full w-full object-cover" src={item.image} alt={item.name} />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                                            logo
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span>{item.name}</span>
                                    <div className="flex flex-row items-center gap-1">
                                        <House className="text-primary" size={16} />
                                        <span className="text-gray-600 text-small">
                                            {item.openPositions} open position{item.openPositions === 1 ? "" : "s"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(ROUTES.HOME.ORGANIZATION_DETAIL(item.employerId))}
                                className="btn-primary-white justify-center items-center w-full"
                            >
                                Open Position
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="page-container">
                <span className="text-big">Feature job</span>

                <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                    {homeData.featuredJobs.length === 0 && (
                        <p className="col-span-full text-sm text-gray-500">No featured jobs yet.</p>
                    )}
                    {homeData.featuredJobs.map((item) => (
                        <div key={item.postId}>
                            <CardGrid
                                id={item.postId}
                                organizationName={item.organizationName}
                                title={item.title}
                                engagementType={item.engagementType}
                                location={item.location}
                                salary={item.salary}
                                remainingDays={item.remainingDays}
                                image={item.image}
                                isUrgent={item.isUrgent}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="page-container">
                <div className="flex justify-between">
                    <span className="text-big">Feature Volunteer</span>
                    <span className="text-primary underline">
                        <Link to={ROUTES.HOME.POST_LIST}>Views more</Link>
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                    {homeData.featuredVolunteers.length === 0 && (
                        <p className="col-span-full text-sm text-gray-500">No featured volunteers yet.</p>
                    )}
                    {homeData.featuredVolunteers.map((item) => (
                        <div key={item.postId}>
                            <CardGrid
                                id={item.postId}
                                organizationName={item.organizationName}
                                title={item.title}
                                engagementType={item.engagementType}
                                location={item.location}
                                salary={item.salary}
                                remainingDays={item.remainingDays}
                                image={item.image}
                                isUrgent={item.isUrgent}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {showRegistrationPromo && (
                <section className="page-container flex gap-10 px-3 sm:px-10 md:px-35">
                    <div className="flex flex-col p-5 rounded gap-2 bg-primary">
                        <span className="text-white text-big">Become an Employer</span>
                        <small className="text-white text-small">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, cumque sed, culpa soluta eveniet possimus deleniti id expedita nulla ducimus .
                        </small>
                        <button
                            onClick={() => navigate(ROUTES.AUTH.SIGNUP_EMPLOYER)}
                            className="flex justify-center items-center gap-1 btn-primary-white"
                        >
                            <span>Register Now</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                    <div className="flex flex-col p-5 rounded gap-2 bg-gray-100">
                        <span className="text-big">Become a Candidate</span>
                        <small className="text-small">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, cumque sed, culpa soluta eveniet possimus deleniti id expedita nulla ducimus.
                        </small>
                        <button
                            onClick={() => navigate(ROUTES.AUTH.SIGNUP_SEEKER)}
                            className="flex justify-center items-center gap-1 btn-primary-white"
                        >
                            <span>Register Now</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </section>
            )}
        </>
    );
}
