import { useState } from "react";
import CardList from "../Components/card/CardList";
const favoriteItems = {
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
            viewPath: "/postDetail/1",
        },
        {
            id: 2,
            organizationName: "TechNova Co.",
            title: "Backend Developer",
            workPlaceType: "remote",
            location: "New York, NY",
            salary: "$900 - $1500",
            appliedDate: "2026-05-11",
            status: "applied",
            image: "",
            viewPath: "/postDetail/2",
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
            viewPath: "/postDetail/11",
        },
        {
            id: 12,
            organizationName: "EduSmart",
            title: "Teaching Assistant",
            workPlaceType: "onsite",
            location: "Bangkok, Thailand",
            salary: null,
            appliedDate: "2026-05-09",
            status: "applied",
            image: "",
            viewPath: "/postDetail/12",
        },
    ],
};
export default function Favorite() {
    const [isJob, setIsJob] = useState<'job' | 'volunteer'>('job');
    const selectedItems = favoriteItems[isJob];

    return (<div>
        <div className="text-gray-600 mb-5 bg-gray-100 rounded-lg flex gap-3 p-3">
            <button className={isJob === 'job' ? ` text-primary underline` : ``}
                onClick={() => setIsJob('job')}
            >Jobs</button>
            <button className={isJob === 'volunteer' ? ` text-primary underline` : ``}
                onClick={() => setIsJob('volunteer')}
            >Volunteers</button>
        </div>
        <div className="flex flex-col gap-2">
            {selectedItems.map((item) => (
                <CardList
                    key={item.id}
                    id={item.id}
                    organizationName={item.organizationName}
                    title={item.title}
                    engagementType={item.workPlaceType}
                    location={item.location}
                    salary={item.salary ?? ""}
                    remainingDays={`Applied on ${item.appliedDate}`}
                    image={item.image}
                />
            ))}
        </div>
    </div>);
}