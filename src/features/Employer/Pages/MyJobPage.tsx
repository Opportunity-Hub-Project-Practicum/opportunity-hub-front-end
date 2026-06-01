import { useState } from 'react';
import { ChevronDown, CheckCircle2, XCircle, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/path';
import SearchBox from '../../../GlobalComponents/SearchBox';

interface ListingItem {
    id: string;
    title: string;
    type: string; // e.g., "3 weeks", "1 times-event"
    timeRemaining: string; // e.g., "8 days remaining", "Dec 7, 2019"
    status: 'Active' | 'Expire';
    applicationsCount: number;
}

export default function MyJobPage() {
    const navigate = useNavigate();
    // Tab control state
    const [activeTab, setActiveTab] = useState<'JOBS' | 'Volunteer'>('Volunteer');
    const [jobStatusFilter, setJobStatusFilter] = useState('All Jobs');

    // Well-structured static listing data
    const listingsData: ListingItem[] = [
        {
            id: '1',
            title: 'Senior UX Designer',
            type: '3 weeks',
            timeRemaining: '8 days remaining',
            status: 'Active',
            applicationsCount: 185
        },
        {
            id: '2',
            title: 'UI/UX Designer',
            type: '1 times-event',
            timeRemaining: '27 days remaining',
            status: 'Active',
            applicationsCount: 798
        },
        {
            id: '3',
            title: 'Junior Graphic Designer',
            type: '1 times-event',
            timeRemaining: '24 days remaining',
            status: 'Active',
            applicationsCount: 583
        },
        {
            id: '4',
            title: 'Front End Developer',
            type: '1 times-event',
            timeRemaining: 'Dec 7, 2019',
            status: 'Expire',
            applicationsCount: 740
        },
        {
            id: '5',
            title: 'Front End Developer',
            type: '1 times-event',
            timeRemaining: 'Dec 7, 2019',
            status: 'Expire',
            applicationsCount: 740
        }
    ];
    const [search, setSearch] = useState("")
    return (
        <div className="page-container">
            <SearchBox search={search} setSearch={setSearch} />
            {/* Top Header Filter Section */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-xl font-medium tracking-tight">
                    My Jobs <span className="text-[#767F8C] font-normal text-big">(589)</span>
                </h1>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <span className="text-sm text-[#5E6670]">Job status</span>
                    <div className="relative">
                        <select
                            value={jobStatusFilter}
                            onChange={(e) => setJobStatusFilter(e.target.value)}
                            className="bg-white border border-[#E4E5E8] rounded-md pl-4 pr-10 py-2 text-sm text-[#18191C] font-normal appearance-none focus:outline-none focus:border-blue-500 min-w-35"
                        >
                            <option>All Jobs</option>
                            <option>Active</option>
                            <option>Expired</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-[#767F8C] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Main Table Wrapper */}
            <div className="w-full bg-white border border-[#E4E5E8] rounded-md overflow-hidden">

                {/* Table Header Row */}
                <div className="grid grid-cols-12 bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium tracking-wider text-[#474C54] uppercase items-center">
                    <div className="col-span-5 flex items-center space-x-8">
                        <button
                            type="button"
                            onClick={() => setActiveTab('JOBS')}
                            className={`pb-1 font-semibold transition-colors ${activeTab === 'JOBS' ? 'text-[#0A65CC] border-b-2 border-[#0A65CC]' : 'text-[#767F8C] hover:text-gray-900'}`}
                        >
                            JOBS
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('Volunteer')}
                            className={`pb-1 font-semibold transition-colors ${activeTab === 'Volunteer' ? 'text-[#0A65CC] border-b-2 border-[#0A65CC]' : 'text-[#767F8C] hover:text-gray-900'}`}
                        >
                            Volunteer
                        </button>
                    </div>
                    <div className="col-span-2 text-left pl-2">Status</div>
                    <div className="col-span-2 text-left">Applications</div>
                    <div className="col-span-3 text-left pl-4">Actions</div>
                </div>

                {/* Dynamic List Items Grid */}
                <div className="w-full divide-y divide-[#E4E5E8]">
                    {listingsData.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50/40 transition-colors">

                            {/* Job Title Metadata Column */}
                            <div className="col-span-5 space-y-1">
                                <h2 className="text-base font-medium text-[#18191C] hover:text-[#0A65CC] cursor-pointer transition-colors">
                                    {item.title}
                                </h2>
                                <div className="flex items-center space-x-1.5 text-sm text-[#767F8C]">
                                    <span>{item.type}</span>
                                    <span>•</span>
                                    <span>{item.timeRemaining}</span>
                                </div>
                            </div>

                            {/* Status Indicator Column */}
                            <div className="col-span-2 flex items-center pl-2">
                                {item.status === 'Active' ? (
                                    <span className="inline-flex items-center space-x-1.5 text-sm text-[#28A745] font-medium">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Active</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center space-x-1.5 text-sm text-[#DC3545] font-medium">
                                        <XCircle className="h-4 w-4" />
                                        <span>Expire</span>
                                    </span>
                                )}
                            </div>

                            {/* Applications Tracker Column */}
                            <div className="col-span-2 flex items-center space-x-2 text-sm text-[#5E6670]">
                                <Users className="h-4 w-4 text-[#9199A3]" />
                                <span>{item.applicationsCount} Applications</span>
                            </div>

                            {/* Interactive Actions Control Column */}
                            <div className="col-span-3 flex items-center justify-between pl-4">
                                <button
                                    onClick={() => { navigate(`${ROUTES.EMPLOYER.ROOT}/${ROUTES.EMPLOYER.MY_JOB_VIEW_APPLICATION}`) }}
                                    type="button"
                                    className="bg-[#F1F2F4] text-[#0A65CC] text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-[#E4E5E8] transition-colors"
                                >
                                    View Applications
                                </button>

                                {/* Status-dependent contextual dynamic indicators */}
                                {item.status === 'Active' ? (
                                    <button type="button" title="Ending Soon" className="text-[#E0513E] hover:opacity-80 p-1">
                                        <Clock className="h-5 w-5 transform stroke-2" />
                                    </button>
                                ) : (
                                    <button type="button" title="Renew Listing" className="text-[#7ED321] hover:opacity-80 p-1">
                                        <Clock className="h-5 w-5 transform stroke-2" />
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>

            </div>



        </div>
    );
}