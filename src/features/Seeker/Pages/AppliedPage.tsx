import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, DollarSign } from "lucide-react";

const appliedItems = {
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

export default function Applied() {
    const [isJob, setIsJob] = useState('job');
    const currentItems = appliedItems[isJob as keyof typeof appliedItems];

    return (
        <section className="flex flex-col">

            {/*card section*/}
            <div className="grid grid-cols-6 p-3  text-gray-600 mb-5 bg-gray-100 rounded-lg ">
                <div className="col-span-3 flex gap-3">
                    <button className={isJob === 'job' ? ` text-primary underline` : ``}
                        onClick={() => setIsJob('job')}
                    >Jobs</button>
                    <button className={isJob === 'volunteer' ? ` text-primary underline` : ``}
                        onClick={() => setIsJob('volunteer')}
                    >Volunteers</button>
                </div>
                <span>Date appllied</span>
                <span>Status</span>
                <span>Action</span>

            </div>
            {currentItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                    No {isJob === 'job' ? 'job' : 'volunteer'} applications found.
                </div>
            )}

            {currentItems.map((item) => (
                <div key={item.id} className="grid grid-cols-6 border  m-2 lg:p-4 rounded-lg hover:border-primary hover:shadow-lg hover:scale-101 transition-all duration-300">
                    <div className=" col-span-3 flex justify-between ">
                        <div className="flex gap-2 lg:gap-5">
                            <img src={item.image} alt={item.organizationName} className="rounded-lg border w-15 h-15 object-cover bg-white" />
                            <div className="flex flex-col justify-around w-full">
                                <div className="flex gap-1 flex-wrap">
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
                    <Link to={item.viewPath} className=" bg-primary text-white flex justify-center items-center rounded-2xl">View Post</Link>
                </div>
            ))}
        </section>
    );
}