import { Bookmark, BellRing, BriefcaseBusiness, ArrowRight, MapPin, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/path";

const overviewData = {
    userName: "User Name",
    counts: {
        appliedJobs: 283,
        favoriteJobs: 45,
        jobAlerts: 12,
        appliedVolunteers: 28,
        favoriteVolunteers: 9,
        volunteerAlerts: 4,
    },
    recentItems: {
        job: [
            {
                id: 1,
                organizationName: "TechNova Co.",
                title: "Frontend Developer",
                workPlaceType: "hybrid",
                location: "San Francisco, CA",
                salary: "$800 - $1200",
                appliedDate: "2026-05-10",
                status: "applied",

                image: "",
            },
        ],
        volunteer: [
            {
                id: 11,
                organizationName: "Green Earth NGO",
                title: "Tree Planting Volunteer",
                workPlaceType: "onsite",
                location: "Phnom Penh, Cambodia",
                salary: null,
                appliedDate: "2026-05-08",
                status: "applied",

                image: "",
            },
        ],
    },
};

const metricCards = [
    { key: "appliedJobs", label: "Applied Jobs", bg: "bg-subPrimary", icon: BriefcaseBusiness },
    { key: "favoriteJobs", label: "Favorite Jobs", bg: "bg-subPrimary", icon: Bookmark },
    { key: "jobAlerts", label: "Job Alerts", bg: "bg-subPrimary", icon: BellRing },
    { key: "appliedVolunteers", label: "Applied Volunteers", bg: "bg-green-200", icon: BriefcaseBusiness },
    { key: "favoriteVolunteers", label: "Favorite Volunteers", bg: "bg-green-200", icon: Bookmark },
    { key: "volunteerAlerts", label: "Volunteer Alerts", bg: "bg-green-200", icon: BellRing },
] as const;

export default function OverviewActivity() {
    const [isJob, setIsJob] = useState<'job' | 'volunteer'>('job');
    const currentItems = overviewData.recentItems[isJob];

    return (
        <div className="page-container flex flex-col gap-5 ">
            <span>Hello, {overviewData?.userName ?? "User"}</span>
            <small className="text-gray-600">Here is your Daily Activity</small>

            <div className="grid grid-cols-3 w-full gap-4">
                {metricCards.map((metric) => {

                    return (
                        <div key={metric.key} className={`${metric.bg} p-5 border rounded-lg grid grid-cols-3 gap-3`}>
                            <div className="flex flex-col col-span-2 justify-center">
                                <span className="font-semibold text-lg">{overviewData.counts[metric.key]}</span>
                                <span className="flex whitespace-nowrap text-sm text-gray-700">{metric.label}</span>
                            </div>
                            <div className="border border-primaryDark bg-white flex justify-center items-center py-4 rounded-lg">
                                <metric.icon className="text-primary" size={25} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <section className="flex flex-col">
                <div className="flex justify-between  p-2 rounded-lg  text-gray-600">
                    <span>Recently Applied</span>
                    <Link to={`${ROUTES.SEEKER.ROOT}/${ROUTES.SEEKER.APPLIED}`}
                        className="whitespace-nowrap flex gap-2 hover:text-primary">View all <ArrowRight /></Link>
                </div>
                {/*card section*/}
                <div className="grid grid-cols-6 p-3  text-gray-600 mb-5 bg-gray-100 rounded-lg ">
                    <div className="col-span-3 flex gap-3">
                        <button className={isJob === 'job' ? `bg-gray-100 text-primary underline` : ``}
                            onClick={() => setIsJob('job')}
                        >Jobs</button>
                        <button className={isJob === 'volunteer' ? `bg-gray-100 text-primary underline` : ``}
                            onClick={() => setIsJob('volunteer')}
                        >Volunteers</button>
                    </div>
                    <span>Date appllied</span>
                    <span>Status</span>
                    <span>Action</span>

                </div>
                {currentItems.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                        No {isJob === "job" ? "job" : "volunteer"} activity found.
                    </div>
                )}

                {currentItems.map((item) => (
                    <div key={`${item.id}`} className="grid grid-cols-6 border p-2 lg:p-4 rounded-lg hover:border-primary hover:shadow-lg hover:scale-101 transition-all duration-300">
                        <div className="col-span-3 flex justify-between">
                            <div className="flex gap-2 lg:gap-5">
                                <img src={item.image} alt={item.organizationName} className="rounded-lg border w-15 h-15 object-cover bg-white" />
                                <div className="flex flex-col justify-around w-full">
                                    <div className="flex gap-1 items-start flex-wrap">
                                        <p className="font-semibold">{item.organizationName} - {item.title}</p>
                                        <span className="rounded-2xl bg-subPrimary px-2 text-primaryDark w-fit h-fit text-sm">{item.workPlaceType}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {item.location && <span className="flex text-small justify-center items-center text-gray-500"><MapPin className="text-primary" size={15} />{item.location}</span>}
                                        {item.salary && <span className="flex text-small justify-center items-center text-gray-500"><DollarSign className="text-primary" size={15} />{item.salary}</span>}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <span className="text-gray-600 flex items-center">{item.appliedDate}</span>
                        <span className="text-green-600 flex items-center">{item.status}</span>
                        <Link to={ROUTES.HOME.POST_DETAIL(item.id)} className="bg-primary text-white flex justify-center items-center rounded-2xl">View Post</Link>
                    </div>
                ))}
            </section>
        </div>

    );
}