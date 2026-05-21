import { Bookmark, BellRing, BriefcaseBusiness, ArrowRight, MapPin, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function OverviewActivity() {
    const activities = [
        { id: 1, count: "283", label: "Applied Jobs", icon: BriefcaseBusiness, bg: "bg-subPrimary" },
        { id: 2, count: "45", label: "Favorite Jobs", icon: Bookmark, bg: "bg-subPrimary" },
        { id: 3, count: "12", label: "Job Alerts", icon: BellRing, bg: "bg-subPrimary" },
        { id: 1, count: "283", label: "Applied volunteers", icon: BriefcaseBusiness, bg: "bg-green-200" },
        { id: 2, count: "45", label: "Favorite volunteers", icon: Bookmark, bg: "bg-green-200" },
        { id: 3, count: "12", label: "Job volunteers", icon: BellRing, bg: "bg-green-200" },
    ];
    const location = 'pp';
    const salary = '0239$';
    const work_place_type = '2jashdc';
    const [isJob, setIsJob] = useState('job');
    return (
        <div className="page-container flex flex-col gap-5 ">
            <span>Hello, UserNmae</span>
            <small className="text-gray-600">Here is your Daily Activity</small>
            <div className="grid grid-cols-3 w-full gap-4">
                {activities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                        <div key={activity.id} className={`${activity.bg} p-5 border rounded-lg grid grid-cols-3  gap-3`}>
                            <div className="flex flex-col col-span-2 justify-center">
                                <span className="font-semibold text-lg">{activity.count}</span>
                                <span className="flex whitespace-nowrap text-sm text-gray-700">{activity.label}</span>
                            </div>
                            <div className="border border-primaryDark bg-white flex justify-center items-center   py-4 rounded-lg">
                                <Icon className="text-primary" size={25} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <section className="flex flex-col">
                <div className="flex justify-between  p-2 rounded-lg  text-gray-600">
                    <span>Recently Applied</span>
                    <Link to=''
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
                <div className="grid grid-cols-6 border  p-2 lg:p-4 rounded-lg hover:border-primary hover:shadow-lg hover:scale-101 transition-all duration-300">
                    <div className=" col-span-3 flex justify-between ">
                        <div className="flex gap-2 lg:gap-5">
                            <img src="" alt='' className="rounded-lg border w-15 h-15" />
                            <div className="flex flex-col justify-around w-full">
                                <div className="flex gap-1">
                                    <p className="font-semibold">organizationName - title</p>
                                    <span className="rounded-2xl bg-subPrimary px-2 text-primaryDark w-fit h-fit text-sm">{work_place_type}</span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {location && <span className="flex text-small justify-center items-center text-gray-500" ><MapPin className="text-primary" size={15} />{location}</span>}
                                    {salary && <span className="flex text-small justify-center items-center text-gray-500"><DollarSign className="text-primary" size={15} />{salary}</span>}

                                </div>
                            </div>
                        </div>

                    </div>
                    <span className="text-gray-600 flex items-center">the date user apply</span>
                    <span className="text-green-600 flex items-center">statur of the post</span>
                    <Link to='' className="bg-primary text-white flex justify-center items-center rounded-2xl">View Post</Link>
                </div>
            </section>
        </div>

    );
}