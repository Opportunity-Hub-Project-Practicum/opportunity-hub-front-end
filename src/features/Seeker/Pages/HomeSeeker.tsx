import { ArrowRight, FactoryIcon } from "lucide-react";
import SearchBar from "../Components/searchBar";
import { Organizations, Posts, summaryHeroBanners, summaryPostion, getOrganizationById, formatSalary } from "../../../services/postService";
import CardGrid from "../Components/CardGrid";
import { Link } from "react-router-dom";

export default function HomeSeeker() {


    return (
        <>
            <section className="flex flex-col page-container gap-5 bg-gray-100">
                <SearchBar />

                <div className=" flex justify-between">
                    <div>
                        <strong className="text-big"> Find a job or volunteer that suits your interest & skills.</strong>
                        <div>
                            idk some description here, encorage word or something
                        </div>

                        <div >
                            Popular job
                            {/*this will call from backend later */}
                            <ul className="flex gap-2">
                                <li>designer</li>
                                <li>designer</li>
                                <li>designer</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-2 w-2xl">
                        {/*for image */}
                    </div>
                </div>

                <div className="flex gap-5 ">

                    {summaryHeroBanners.map(item => (
                        <div key={item.id} className="custom-card w-full flex justify-start">
                            <p className="flex justify-center items-center border">icon box </p>
                            <div className="flex flex-col"> <p>{item.label}</p>
                                <p>{item.count}</p></div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="flex flex-col page-container ">
                <h2 className="text-big">Most Popular Job Vacanies</h2>

                <ul className="custom-list-layout ">
                    {summaryPostion.filter(post => post.type === 'job' && post.count > 0).slice(0, 8).map(item => (
                        <li key={item.id} className="flex flex-col  custom-card">
                            <span>{item.label}</span>
                            <small>{item.count} Open positions</small>
                        </li>
                    ))}
                </ul>

                <h2 className="text-big mt-5">Most Popular Volunteer</h2>
                <ul className="custom-list-layout">
                    {summaryPostion.filter(post => post.type === 'volunteer' && post.count > 0).slice(0, 8).map(item =>
                        <li key={item.id} className="flex flex-col  custom-card">
                            <span>{item.label}</span>
                            <small>{item.count} Open positions</small>
                        </li>
                    )}
                </ul>
            </section>
            <section className="page-container">
                <span className=" flex justify-center text-2xl">How our web work</span>
            </section>
            <section className="page-container ">

                <span className="text-big mb-5">Top Companies</span>
                <ul className="custom-list-layout my-5">

                    {Organizations.map(item => (
                        <li key={item.id} className="custom-card bg-subPrimary p-3.5 gap-5 flex flex-col ">
                            <div className="flex justify-start gap-2  w-full ">
                                <div className="border">
                                    logo
                                    <img src="" alt="" />
                                </div>
                                <div className="flex flex-col">
                                    <span>{item.name}</span>

                                    <div className=" flex flex-row">
                                        <FactoryIcon />
                                        <span>{item.organization_type}</span>
                                    </div>
                                </div>

                            </div>
                            <button className="btn-primary-blue justify-center items-center w-full">Open Position</button>
                        </li>
                    )

                    )}

                </ul>
            </section>
            <section className="page-container ">
                <span className="text-big ">Feature job</span>

                <div className="grid grid-cols-2 lg:grid-cols-3 justify-between gap-5 lg:gap-10 my-5">
                    {Posts.filter(post => post.type === 'job').map(item => {
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
                    {Posts.filter(post => post.type === 'volunteer').map(item => {
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
                    <span className="text-big">Become an Employer</span>
                    <small className="text-small">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, cumque sed, culpa soluta eveniet possimus deleniti id expedita nulla ducimus .</small>
                    <button className="flex justify-center items-center gap-3 btn-primary-white">
                        <span>Register Now</span>
                        <ArrowRight size={5} />
                    </button>
                </div>
                <div className="flex flex-col p-5 rounded gap-2 bg-gray-100">
                    <span className="text-big">Become a Candidate</span>
                    <small className="text-small">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, cumque sed, culpa soluta eveniet possimus deleniti id expedita nulla ducimus.</small>
                    <button className="flex justify-center items-center gap-3 btn-primary-white ">
                        <span>Register Now</span>
                        <ArrowRight size={5} />
                    </button>
                </div>
            </section>
        </>
    );
}