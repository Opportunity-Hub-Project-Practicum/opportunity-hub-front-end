import TopBar from "../components/topBar";
//import { useParams } from "react-router-dom";
import aba from "../../../assets/aba.png";
import Footer from "@/components/shared/footer";
import CardGrid from "../components/cardGrid";
import {
    Calendar,
    Timer,
    Briefcase,
    Wallet,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    // Share2,
    Flag,
    Bookmark,
    ArrowRight,
    ArrowLeft,
    Phone,
    Mail,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostDetail() {
    // const { jobId } = useParams<{ jobId: string }>();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const navigate = useNavigate();

    // Sample job data - in a real app, you'd fetch this from an API based on jobId
    const jobData = {
        jobTitle: "Senior UX Designer",
        companyLogo: aba,
        isFeatured: true,
        jobType: "Full Time",
        location: "https://instagram.com",
        phone: "(406) 555-0120",
        email: "career@instagram.com",
        daysRemaining: 5,
        expiryDate: "June 30, 2021",
    };

    const overviewData = [
        {
            label: "Job Posted:",
            value: "14 June, 2021",
            icon: Calendar,
        },
        {
            label: "Job expire in:",
            value: "14 July, 2021",
            icon: Timer,
        },
        {
            label: "Education",
            value: "Graduation",
            icon: Briefcase,
        },
        {
            label: "Salery:",
            value: "$50k-80k/month",
            icon: Wallet,
        },
        {
            label: "LOCATIOn:",
            value: "New York, USA",
            icon: MapPin,
        },
        {
            label: "job type:",
            value: "Full Time",
            icon: Briefcase,
        },
        {
            label: "Experience",
            value: "10-15 Years",
            icon: Timer,
        },
    ];

    const companyData = {
        name: "Instagram",
        type: "Social networking service",
        founded: "March 21, 2006",
        orgType: "Private Company",
        size: "120-300 Employers",
        phone: "(406) 555-0120",
        email: "twitter@gmail.com",
        website: "https://twitter.com",
    };

    const responsibilities = [
        "Quisque semper gravida est et consectetur.",
        "Curabitur blandit lorem velit, vitae pretium leo placerat eget.",
        "Morbi mattis in ipsum ac tempus.",
        "Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.",
        "vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.",
        "lobortis vel lectus. Nulla at risus ut diam.",
        "commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.",
        "odio metus posuere lorem, id condimentum erat velit nec neque.",
        "dui sodales ut. Curabitur tempus augue.",
    ];

    const relatedJobs = [
        {
            id: 1,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "UI/UX Designer",
            salary: "$45k-70k/month",
            jobType: "Full Time",
            daysRemaining: 8,
        },
        {
            id: 2,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Phnom Penh",
            jobTitle: "Product Designer",
            salary: "$55k-85k/month",
            jobType: "Full Time",
            daysRemaining: 10,
        },
        {
            id: 3,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Battambang",
            jobTitle: "Graphic Designer",
            salary: "$35k-55k/month",
            jobType: "Contract",
            daysRemaining: 6,
        },
        {
            id: 4,
            companyLogo: aba,
            companyName: "ABA Bank",
            location: "Siem Reap",
            jobTitle: "Web Designer",
            salary: "$40k-65k/month",
            jobType: "Full Time",
            daysRemaining: 9,
        },
    ];

    return (
        <>
            <TopBar />

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            {/* Job Card Header Section */}
            <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                        {/* Left Side - Company Logo */}
                        <div className="flex items-start justify-start w-12 md:w-16 lg:w-20">
                            {jobData.companyLogo ? (
                                <img
                                    src={jobData.companyLogo}
                                    alt="company"
                                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-slate-300 rounded-2xl shadow-lg"></div>
                            )}
                        </div>

                        {/* Right Side - Job Details */}
                        <div className="flex  gap-auto flex-1">
                            {/* Job Title and Badges */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#181d1c]">
                                        {jobData.jobTitle}
                                    </h1>

                                    {jobData.isFeatured && (
                                        <span className="px-3 py-1 bg-[#ffedee] text-[#ff4f4f] text-sm font-medium rounded">
                                            Featured
                                        </span>
                                    )}

                                    <span className="px-3 py-1 bg-[#e8f1ff] text-[#0066ff] text-sm font-medium rounded">
                                        {jobData.jobType}
                                    </span>
                                </div>
                                {/* Contact Information */}
                                <div className="flex  gap-4">
                                    {/* Location */}
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-600 flex-shrink-0" />
                                        <span className="text-base text-[#475c70]">{jobData.location}</span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-slate-600 flex-shrink-0" />
                                        <span className="text-base text-[#475c70]">{jobData.phone}</span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-slate-600 flex-shrink-0" />
                                        <span className="text-base text-[#475c70]">{jobData.email}</span>
                                    </div>
                                </div>
                            </div>



                            {/* Action Buttons and Days Remaining */}
                            <div className="flex flex-col ml-auto  items-start md:items-center  gap-3 mt-2 ">
                                <div className="flex gap-2 flex-1 w-full mx-auto ">
                                    {/* Bookmark Button */}
                                    <button
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className="flex items-center justify-center w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                                    >
                                        <Bookmark
                                            size={18}
                                            className={`transition-colors ${isBookmarked
                                                ? "fill-yellow-400 stroke-yellow-500 text-yellow-500"
                                                : "stroke-slate-400 text-slate-400"
                                                }`}
                                        />
                                    </button>

                                    {/* Apply Now Button */}
                                    <button
                                        onClick={() => console.log("Applied")}
                                        className="flex items-center justify-center gap-2 flex-1 md:flex-initial px-6 py-2 bg-[#0a65cc] text-white font-bold text-sm rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Apply now
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                                {/* Days Remaining */}
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">Job expire in:</span>
                                    <span className="text-sm text-[#e05151] font-medium">{jobData.expiryDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 flex gap-5 md:gap-10 lg:gap-15 ">


                    {/* Job Description & Responsibilities */}
                    <div className="space-y-4 mb-6 w-2/3">
                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-medium text-black mb-4">
                                Job Description
                            </h3>
                            <p className="text-sm text-[#5e6670] leading-relaxed mb-2">
                                Integer aliquet pretium consequat. Donec et sapien id leo
                                accumsan pellentesque eget maximus tellus. Duis et est ac leo
                                rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam.
                                Pellentesque quis justo sit amet arcu commodo sollicitudin.
                            </p>
                            <p className="text-base text-[#5e6670] leading-relaxed">
                                Nam dapibus consectetur erat in euismod. Cras urna augue, mollis
                                venenatis augue sed, porttitor aliquet nibh. Sed tristique
                                dictum elementum.
                            </p>
                        </div>

                        {/* Responsibilities */}
                        <div>
                            <h3 className="text-xl font-medium text-black mb-4">
                                Responsibilities
                            </h3>
                            <ul className="space-y-2">
                                {responsibilities.map((item, index) => (
                                    <li key={index} className="flex gap-2 text-sm text-[#5e6670]">
                                        <span className="text-[#0a65cc] font-bold mt-1">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Share Section */}
                        <div className="flex items-center gap-4 pt-2 border-t-2 border-[#e7f0fa]">
                            <span className="text-sm font-medium text-[#191f33]">
                                Share this job:
                            </span>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 px-3 py-1 bg-white border border-[#cee0f5] rounded hover:bg-gray-50">
                                    <Facebook size={14} className="text-[#0a65cc]" />
                                    <span className="text-xs text-[#0a65cc]">Facebook</span>
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1 bg-white border border-[#edefdf5] rounded hover:bg-gray-50">
                                    <Twitter size={14} className="text-[#1da1f2]" />
                                    <span className="text-xs text-[#1da1f2]">Twitter</span>
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1 bg-white border border-[#edefdf5] rounded hover:bg-gray-50">
                                    <Flag size={14} className="text-[#ca2127]" />
                                    <span className="text-xs text-[#ca2127]">Pinterest</span>
                                </button>
                            </div>
                        </div>


                    </div>
                    <div>
                        {/* Job Overview Section */}
                        <div className="bg-white border-2 border-[#e7f0fa] rounded-lg p-4 mb-6 ">
                            <h2 className="text-lg font-medium text-[#191f33] mb-4">
                                Job Overview
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {overviewData.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={index} className="flex flex-col items-start gap-2">
                                            <div className="flex-shrink-0 ">
                                                <IconComponent
                                                    size={18}
                                                    className="text-[#0a65cc]"
                                                />
                                            </div>
                                            <div className="flex  flex-col items-start gap-1">
                                                <p className="text-xs uppercase text-[#767f8c] font-medium text-[11px]">
                                                    {item.label}
                                                </p>
                                                <p className="text-sm font-medium text-[#181d1c]">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Company Profile Section */}
                        <div className="bg-white border-2 border-[#e7f0fa] rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-[#e7f0fa]">
                                <img
                                    src={aba}
                                    alt={companyData.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-medium text-[#181d1c]">
                                        {companyData.name}
                                    </h3>
                                    <p className="text-sm text-[#767f8c]">{companyData.type}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#5e6670]">Founded in:</span>
                                    <span className="text-sm font-medium text-[#181d1c]">
                                        {companyData.founded}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#5e6670]">Organization type:</span>
                                    <span className="text-sm font-medium text-[#181d1c]">
                                        {companyData.orgType}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#5e6670]">Company size:</span>
                                    <span className="text-sm font-medium text-[#181d1c]">
                                        {companyData.size}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#5e6670]">Phone:</span>
                                    <span className="text-sm font-medium text-[#181d1c]">
                                        {companyData.phone}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#5e6670]">Email:</span>
                                    <span className="text-sm font-medium text-[#181d1c]">
                                        {companyData.email}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#5e6670]">Website:</span>
                                    <span className="text-sm font-medium text-[#181d1c]">
                                        {companyData.website}
                                    </span>
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="flex gap-2">
                                <button className="p-2 bg-[#e7f0fa] rounded hover:bg-blue-100 transition">
                                    <Facebook size={16} className="text-[#0a65cc]" />
                                </button>
                                <button className="p-2 bg-[#0a65cc] rounded hover:bg-blue-700 transition">
                                    <Twitter size={16} className="text-white" />
                                </button>
                                <button className="p-2 bg-[#e7f0fa] rounded hover:bg-blue-100 transition">
                                    <Instagram size={16} className="text-[#0a65cc]" />
                                </button>
                                <button className="p-2 bg-[#e7f0fa] rounded hover:bg-blue-100 transition">
                                    <Youtube size={16} className="text-[#0a65cc]" />
                                </button>
                            </div>
                            {/* Report Post Button */}
                            <div className="mt-4">
                                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition text-sm">
                                    Report the post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between m-5">
                <div className="text-black font-bold text-3xl">Related Jobs</div>
                <div className="rounded-lg bg-blue-100 flex items-center p-3"><ArrowRight size={18} /> </div>
            </div>

            {/* Related Jobs Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedJobs.map((job) => (
                        <div key={job.id} onClick={() => navigate(`/post-detail/${job.id}`)} className="cursor-pointer">
                            <CardGrid
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
            </div>
            <Footer />
        </>
    );
}
