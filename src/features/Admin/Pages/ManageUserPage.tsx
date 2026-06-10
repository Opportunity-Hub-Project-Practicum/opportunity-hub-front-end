import { CheckCircle2, Users, XCircle } from "lucide-react"
import { useState } from "react"
import SeekerProfileSection from "../../../GlobalComponents/SeekerProfileSection"
import type { SeekerFormData } from "../../../GlobalComponents/SeekerProfileSection"
import { MOCK_USERS, type User } from "../../../services/mockJobPortalApi"
import SearchBox from "../../../GlobalComponents/SearchBox"

const toSeekerFormData = (user: User): SeekerFormData => {
    const [firstName, ...rest] = user.fullName.split(" ");

    return {
        firstName: firstName ?? user.fullName,
        lastName: rest.join(" "),
        email: user.email,
        dob: "",
        website: user.seekerProfile?.portfolioUrl ?? "",
        gender: "",
        martialStatus: "",
        Phone: user.phone ?? "",
        bio: user.bio,
        profileImage: user.avatarUrl,
        socialLinks: [],
        resume: user.seekerProfile?.resumeUrl
            ? [{ id: "resume-1", name: "resume.pdf", size: "—" }]
            : [],
        education: [],
        experience: user.seekerProfile
            ? [
                {
                    jobTitle: user.seekerProfile.currentTitle,
                    company: "",
                    jobRole: user.seekerProfile.experienceLevel,
                    from: "",
                    to: "",
                    jobDescription: user.skills.join(", "),
                },
            ]
            : [],
    };
};

export default function ManageUserPage() {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

    const listingsData = [
        {
            id: '1',
            userId: 101,
            userName: 'Pory Morokot',
            createdDate: '09/32/1932',
            timeRemaining: '8 days remaining',
            status: 'Active',
            applyJobCount: 185,
            applyvolunteerCount: 85
        }, {
            id: '2',
            userId: 102,
            userName: 'noc raksa',
            createdDate: '09/32/1932',
            timeRemaining: '8 days remaining',
            status: 'Active',
            applyJobCount: 185,
            applyvolunteerCount: 85
        },]

    const selectedUser = selectedUserId != null
        ? MOCK_USERS.find((user) => user.id === selectedUserId)
        : undefined;

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
                                type="button"
                                onClick={() => setSelectedUserId(item.userId)}
                                className="bg-slate-200 text-blue-600 text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-slate-200 transition-colors"
                            >
                                View profile
                            </button>


                        </div>

                    </div>
                ))}
            </div>

            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
                        <button
                            onClick={() => setSelectedUserId(null)}
                            type="button"
                            className="absolute right-4 top-4 z-10 rounded-full bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        >
                            ✕
                        </button>

                        <SeekerProfileSection
                            seekerData={toSeekerFormData(selectedUser)}
                            viewOnly
                        />
                    </div>
                </div>
            )}

        </div>
    )
}