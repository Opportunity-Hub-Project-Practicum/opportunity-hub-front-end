import { CheckCircle2, Clock, Users, XCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SearchBox from "../../../GlobalComponents/SearchBox"
export default function ManageUserPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("job")

    const listingsData = [
        {
            id: '1',
            userName: 'Pory Morokot',
            createdDate: '09/32/1932',
            timeRemaining: '8 days remaining',
            status: 'Active',
            applyJobCount: 185,
            applyvolunteerCount: 85
        }, {
            id: '2',
            userName: 'noc raksa',
            createdDate: '09/32/1932',
            timeRemaining: '8 days remaining',
            status: 'Active',
            applyJobCount: 185,
            applyvolunteerCount: 85
        },]
    return (
        <div>
            <SearchBox search="" setSearch={() => { }} />
            <div className="grid grid-cols-6 bg-[#F1F2F4] px-6 py-3 text-[12px] font-medium tracking-wider text-[#474C54] uppercase items-center">
                <div className="col-span-3 flex items-center space-x-8">
                    <span>User</span>
                </div>
                <div className=" text-left pl-2">Status</div>
                <div className=" text-left">Applications</div>
                <div className=" text-left pl-4">Actions</div>
            </div>
            <div className="w-full divide-y divide-[#E4E5E8]">
                {listingsData.map((item) => (
                    <div key={item.id} className="grid grid-cols-6 px-6 py-5 items-center hover:bg-gray-50/40 transition-colors">

                        {/* Job Title Metadata Column */}
                        <div className="col-span-3 space-y-1">
                            <h2 className="text-base font-medium text-[#18191C] hover:text-[#0A65CC] cursor-pointer transition-colors">
                                {item.userName}
                            </h2>
                            <div className="flex items-center space-x-1.5 text-sm text-[#767F8C]">
                                <span>Joined: {item.createdDate}</span>

                            </div>
                        </div>

                        {/* Status Indicator Column */}
                        <div className=" flex items-center pl-2">
                            {item.status === 'Active' ? (
                                <span className="inline-flex items-center space-x-1.5 text-sm text-[#28A745] font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Active</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center space-x-1.5 text-sm text-[#DC3545] font-medium">
                                    <XCircle className="h-4 w-4" />
                                    <span>Ban</span>
                                </span>
                            )}
                        </div>

                        {/* Applications Tracker Column */}
                        <div className=" flex items-center space-x-2 text-sm text-[#5E6670]">
                            <Users className="h-4 w-4 text-[#9199A3]" />
                            <span>{item.applyJobCount} Applied</span>
                        </div>

                        {/* Interactive Actions Control Column */}
                        <div className="flex items-center justify-between pl-4">
                            <button
                                onClick={() => { navigate('') }}
                                type="button"
                                className="bg-slate-200 text-blue-600 text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-slate-200 transition-colors"
                            >
                                View profile
                            </button>


                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}