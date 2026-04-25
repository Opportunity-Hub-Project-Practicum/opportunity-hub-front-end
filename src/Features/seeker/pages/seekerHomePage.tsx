import TopBar from "../components/topBar";
import SearchBar from "../components/searchBar";
import Card from "../components/cardGrid";
import CardList from "../components/cardList";
import aba from "../../../assets/aba.png";
import Footer from "@/components/shared/footer";
import FilterBar from "../components/filterBar";
import Pagination from "../components/pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SeekerHomePage() {
    const [viewType, setViewType] = useState("grid");
    const navigate = useNavigate();
    const jobsData = [
        {
            id: 1,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "marketing Core Team",
            salary: "$50k-80k/month",
            jobType: "contract",
            daysRemaining: 4,
        },
        {
            id: 2,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Phnom Penh",
            jobTitle: "Software Developer",
            salary: "$50k-80k/month",
            jobType: "Contract",
            daysRemaining: 7,
        },
        {
            id: 3,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Battambang",
            jobTitle: "UI/UX Designer",
            salary: "$50k-80k/month",
            jobType: "Internship",
            daysRemaining: 12,
        },
        {
            id: 4,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "marketing Core Team",
            salary: "$50k-80k/month",
            jobType: "contract",
            daysRemaining: 4,
        },
        {
            id: 5,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Phnom Penh",
            jobTitle: "Software Developer",
            salary: "$50k-80k/month",
            jobType: "Contract",
            daysRemaining: 7,
        },
        {
            id: 6,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Battambang",
            jobTitle: "UI/UX Designer",
            salary: "$50k-80k/month",
            jobType: "Internship",
            daysRemaining: 12,
        },
        {
            id: 7,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "marketing Core Team",
            salary: "$50k-80k/month",
            jobType: "contract",
            daysRemaining: 4,
        },
        {
            id: 8,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Phnom Penh",
            jobTitle: "Software Developer",
            salary: "$50k-80k/month",
            jobType: "Contract",
            daysRemaining: 7,
        },
        {
            id: 9,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Battambang",
            jobTitle: "UI/UX Designer",
            salary: "$50k-80k/month",
            jobType: "Internship",
            daysRemaining: 12,
        },
    ];

    const handleCardClick = (jobId: number) => {
        navigate(`/post-detail/${jobId}`);
    };

    return (
        <>
            <TopBar />
            <SearchBar />
            <FilterBar viewType={viewType} setViewType={setViewType} />
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobsData.map((job) => (
                            <div key={job.id} onClick={() => handleCardClick(job.id)} className="cursor-pointer">
                                <Card
                                    companyLogo={job.companyLogo}
                                    companyName={job.companyName}
                                    location={job.location}
                                    jobTitle={job.jobTitle}
                                    jobType={job.jobType}
                                    salary={job.salary}

                                    daysRemaining={job.daysRemaining}
                                    onBookmark={() => console.log(`Bookmarked: ${job.jobTitle}`)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {jobsData.map((job) => (
                            <div key={job.id} onClick={() => handleCardClick(job.id)} className="cursor-pointer">
                                <CardList
                                    companyLogo={job.companyLogo}
                                    jobTitle={job.jobTitle}
                                    jobType={job.jobType}
                                    location={job.location}
                                    salary="$50k-80k/month"
                                    daysRemaining={job.daysRemaining}
                                    onBookmark={() => console.log(`Bookmarked: ${job.jobTitle}`)}
                                    onApply={() => console.log(`Applied: ${job.jobTitle}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mx-auto flex item-center justify-center p-5"><Pagination
                totalPages={5}
                currentPage={1}
                onPageChange={(page) => console.log('Page:', page)}
            /></div>

            <Footer />

        </>

    );
}
