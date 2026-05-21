import { ArrowRight, FactoryIcon, House, Users, Star, Origami } from "lucide-react";
import SearchBar from "../Components/searchBar";
import { Organizations, Posts, summaryHeroBanners, summaryPostion, getOrganizationById, formatSalary } from "../../../services/postService";
import CardGrid from "../Components/card/CardGrid";
import { Link } from "react-router-dom";
import heroimg from "../../../assets/heroimg.png"
import howOurWebWork from '../../../assets/howOurWebWork.png';
export default function HomeSeeker() {


    return (
        <>
            <section className="flex flex-col page-container gap-5 bg-gray-100">
                <SearchBar />

                <div className="  grid grid-cols-3">
                    <div className="col-span-2 lg:px-20 flex flex-col gap-5">


                        <strong className="text-4xl"> Find a job or volunteer that suits your interest & skills.</strong>

                        <span>
                            idk some description here, encorage word or something
                        </span>



                        <div className="flex gap-3">  <span className="flex"> Popular job:</span>
                            {/*this will call from backend later */}
                            <ul className="flex gap-2">

                                <li className="rounded px-2 bg-subPrimary ">designer</li>
                                <li>designer</li>
                                <li>designer</li>
                            </ul></div>


                    </div>
                    <div className=" col-span-1">
                        <img
                            className='w-auto h-auto'
                            src={heroimg} alt="" />
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4  gap-10 lg:gap-15">

                    {summaryHeroBanners.map((item) => {
                        let IconComponent;
                        if (item.label === 'Live Job') IconComponent = Star;
                        else if (item.label === 'Candidates') IconComponent = Users;
                        else if (item.label === 'Companies') IconComponent = House;
                        else IconComponent = Origami;

                        return (
                            <div key={item.id} className="p-3 rounded-lg w-full flex justify-start   gap-5 bg-white">
                                <p className="flex justify-center items-center bg-subPrimary text-primary w-12 h-12 rounded border-2">
                                    <IconComponent size={24} />
                                </p>
                                <div className="flex flex-col  ">

                                    <p className="text-xl ">{item.count}</p>
                                    <p className=" text-gray-600 text-small">{item.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            <section className="flex flex-col page-container ">
                <h2 className="text-big my-5">Most Popular Job Vacanies</h2>

                <ul className="custom-list-layout ">
                    {summaryPostion.filter(post => post.type === 'job' && post.count > 0).slice(0, 8).map(item => (
                        <li key={item.id} className="flex flex-col rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm hover:shadow-md hover:border-subPrimary transition-shadow">
                            <span>{item.label}</span>
                            <small className="text-primary">{item.count} Open positions</small>
                        </li>
                    ))}
                </ul>

                <h2 className="text-big my-5">Most Popular Volunteer</h2>
                <ul className="custom-list-layout">
                    {summaryPostion.filter(post => post.type === 'volunteer' && post.count > 0).slice(0, 8).map(item =>
                        <li key={item.id} className="flex flex-col rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm hover:shadow-md hover:border-subPrimary transition-shadow">
                            <span>{item.label}</span>
                            <small className="text-primary">{item.count} Open positions</small>
                        </li>
                    )}
                </ul>
            </section>
            <section >
                <img className="rounded-lg h-auto w-full"
                    src={howOurWebWork} alt="image showing how the web work" />
            </section>
            <section className="page-container ">

                <span className="text-big mb-5">Top Companies</span>
                <ul className="custom-list-layout my-5">

                    {Organizations.slice(0, 8).map(item => (
                        <li key={item.id} className="w-full rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm hover:shadow-md transition-shadow ">
                            <div className="flex justify-start gap-2  w-full ">
                                <div className="border rounded-lg w-16 h-16 mb-3">
                                    logo
                                    <img
                                        className='h-auto w-auto'
                                        src={item.image} alt="" />
                                </div>
                                <div className="flex flex-col">
                                    <span>{item.name}</span>

                                    <div className=" flex flex-row  items-center gap-1">
                                        <House className="text-primary " size={16} />
                                        <span className="text-gray-600 text-small">{item.organization_type}</span>
                                    </div>
                                </div>

                            </div>
                            <button className="btn-primary-white justify-center items-center w-full">Open Position</button>
                        </li>
                    )

                    )}

                </ul>
            </section>
            <section className="page-container ">
                <span className="text-big ">Feature job</span>

                <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                    {Posts.filter(post => post.type === 'job').slice(0, 6).map(item => {
                        const organization = getOrganizationById(item.employer_id);
                        return (
                            <div key={item.id}>
                                <CardGrid
                                    id={item.id}
                                    organizationName={organization?.name || 'Unknown'}
                                    title={item.title}
                                    engagementType={item.work_place_type}
                                    location={item.location}
                                    salary={formatSalary(item)}
                                    remainingDays={item.closed_date}
                                    image={organization?.image}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>
            <section className="page-container ">
                <div className="flex justify-between"> <span className="text-big ">Feature Volunteer</span>
                    <span className="text-primary underline"><Link to='/postList'>Views more</Link></span></div>

                <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                    {Posts.filter(post => post.type === 'volunteer').slice(0.6).map(item => {
                        const organization = getOrganizationById(item.employer_id);
                        return (
                            <div key={item.id}>
                                <CardGrid
                                    id={item.id}
                                    organizationName={organization?.name || 'Unknown'}
                                    title={item.title}
                                    engagementType={item.work_place_type}
                                    location={item.location}
                                    salary={formatSalary(item)}
                                    remainingDays={item.closed_date}
                                    image={organization?.image}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>
            <section className="page-container flex gap-10  px-3 sm:px-10 md:px-35">
                <div className="flex flex-col p-5 rounded gap-2 bg-primary">
                    <span className="text-white text-big">Become an Employer</span>
                    <small className="text-white text-small">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, cumque sed, culpa soluta eveniet possimus deleniti id expedita nulla ducimus .</small>
                    <button className="flex justify-center items-center gap-1 btn-primary-white">
                        <span>Register Now</span>
                        <ArrowRight size={15} />
                    </button>
                </div>
                <div className="flex flex-col p-5 rounded gap-2 bg-gray-100">
                    <span className="text-big">Become a Candidate</span>
                    <small className="text-small">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, cumque sed, culpa soluta eveniet possimus deleniti id expedita nulla ducimus.</small>
                    <button className="flex justify-center items-center gap-1 btn-primary-white ">
                        <span>Register Now</span>
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>
        </>
    );
}