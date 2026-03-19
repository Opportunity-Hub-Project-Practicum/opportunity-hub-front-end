import TopBar from "../component/topBar";
import SearchBar from "../component/searchBar";
import Card from "../component/cardGrid";
import CardList from "../component/cardList";
import aba from "../../../assets/aba.png";
import Footer from "../../../globalComponents/footer";
import FilterBar from "../component/filterBar";
import Pagination from "../component/pagination";
import { useState } from "react";
export default function SeekerHomePage() {
    const [viewType, setViewType] = useState("grid");
    const jobsData = [
        {
            id: 1,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "marketing Core Team",
            duration: "3 months",
            jobType: "contract",
            daysRemaining: 4,
        },
        {
            id: 2,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Phnom Penh",
            jobTitle: "Software Developer",
            duration: "6 months",
            jobType: "Contract",
            daysRemaining: 7,
        },
        {
            id: 3,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Battambang",
            jobTitle: "UI/UX Designer",
            duration: "3 months",
            jobType: "Internship",
            daysRemaining: 12,
        },
        {
            id: 4,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "marketing Core Team",
            duration: "3 months",
            jobType: "contract",
            daysRemaining: 4,
        },
        {
            id: 5,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Phnom Penh",
            jobTitle: "Software Developer",
            duration: "6 months",
            jobType: "Contract",
            daysRemaining: 7,
        },
        {
            id: 6,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Battambang",
            jobTitle: "UI/UX Designer",
            duration: "3 months",
            jobType: "Internship",
            daysRemaining: 12,
        },
        {
            id: 7,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "marketing Core Team",
            duration: "3 months",
            jobType: "contract",
            daysRemaining: 4,
        },
        {
            id: 8,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Phnom Penh",
            jobTitle: "Software Developer",
            duration: "6 months",
            jobType: "Contract",
            daysRemaining: 7,
        },
        {
            id: 9,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Battambang",
            jobTitle: "UI/UX Designer",
            duration: "3 months",
            jobType: "Internship",
            daysRemaining: 12,
        },
    ];

    return (
        <>
            <TopBar />
            <SearchBar />
            <FilterBar viewType={viewType} setViewType={setViewType} />
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobsData.map((job) => (
                            <Card
                                key={job.id}
                                companyLogo={job.companyLogo}
                                companyName={job.companyName}
                                location={job.location}
                                jobTitle={job.jobTitle}
                                duration={job.duration}
                                jobType={job.jobType}
                                daysRemaining={job.daysRemaining}
                                onBookmark={() => console.log(`Bookmarked: ${job.jobTitle}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {jobsData.map((job) => (
                            <CardList
                                key={job.id}
                                companyLogo={job.companyLogo}
                                jobTitle={job.jobTitle}
                                jobType={job.jobType}
                                location={job.location}
                                salary="$50k-80k/month"
                                daysRemaining={job.daysRemaining}
                                onBookmark={() => console.log(`Bookmarked: ${job.jobTitle}`)}
                                onApply={() => console.log(`Applied: ${job.jobTitle}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="mx-auto flex item-center justify-center p-5"><Pagination 
  totalPages={5}
  currentPage={1}
  onPageChange={(page) => console.log('Page:', page)}
/></div>
            
            <Footer/>
         
        </>
    );
}