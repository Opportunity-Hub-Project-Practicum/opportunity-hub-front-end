import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"
import SearchBox from "../../../GlobalComponents/SearchBox"
import OrganizationForm from "../../../GlobalComponents/OrganizationForm"
export default function AllEmployerPage() {
    const [showEmployerProfile, setshowEmployerProfile] = useState(false)
    return (
        <div>

            {!showEmployerProfile && (
                <div>
                    <SearchBox search="" setSearch={() => { }} />
                    <div className="grid grid-cols-5 bg-[#F1F2F4] px-6 py-3 text-sm  font-medium  text-gray-600 uppercase items-center">
                        <div className="">Company</div>
                        <div className=" ">Status</div>
                        <div className=" ">Applications</div>
                        <div className=" ">Actions</div>
                        <div className="  ">Actions</div>
                    </div>
                    <div className="w-full divide-y divide-[#E4E5E8]">

                        <div className="grid grid-cols-5 px-6 py-5 items-center hover:bg-gray-50/40 transition-colors">

                            {/* Job Title Metadata Column */}
                            <span>employer Name</span>

                            {/* Status Indicator Column */}
                            <div className=" flex items-center pl-2">
                                {status === 'Active' ? (
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
                            <span>120 </span>

                            <span>total Post </span>
                            <div className="flex items-center justify-between pl-4">
                                <button
                                    onClick={() => setshowEmployerProfile(true)}
                                    type="button"
                                    className="bg-slate-200 text-blue-600 text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-slate-200 transition-colors"
                                >
                                    View profile
                                </button>


                            </div>


                        </div>

                    </div></div>
            )}

            {showEmployerProfile && (
                <div>
                    <ArrowLeft className="text-gray-600"
                        onClick={() => setshowEmployerProfile(false)} />
                    <OrganizationForm />
                </div>
            )}

        </div>

    )
}