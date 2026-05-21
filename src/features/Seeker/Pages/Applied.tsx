import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, DollarSign } from "lucide-react";
export default function Applied() {
    const location = 'pp';
    const salary = '0239$';
    const work_place_type = '2jashdc';
    const [isJob, setIsJob] = useState('job');
    return (
        <section className="flex flex-col">
            <div className="flex justify-between  p-2 rounded-lg  text-gray-600">
                <span>Recently Applied</span>
                <Link to=''
                    className="whitespace-nowrap flex gap-2 hover:text-primary">View all <ArrowRight /></Link>
            </div>
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
                <Link to='' className=" bg-primary text-white flex justify-center items-center rounded-2xl">View Post</Link>
            </div>
        </section>
    );
}