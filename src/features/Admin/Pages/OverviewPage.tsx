import { BellRing, BriefcaseBusiness, UserRoundCheck } from "lucide-react";
import { useState } from "react";

export default function OverviewPage() {
    const data = {
        counts: {
            saveCandidate: 0,
            jobPosts: 0,
            volunteerPosts: 0,
        },
    }
    const [overview, setOverview] = useState([])

    const metricCards = [
        { key: "saveCandidate", label: "Save Candidate", bg: "bg-subPrimary", icon: UserRoundCheck },
        { key: "jobPosts", label: "Job Posts", bg: "bg-subPrimary", icon: BriefcaseBusiness },
        { key: "volunteerPosts", label: "Volunteer Posts", bg: "bg-subPrimary", icon: BellRing },

    ] as const;
    return (
        <div className="page-container">
            <div className="grid grid-cols-3 w-full gap-4">
                {metricCards.map((metric) => {

                    return (
                        <div key={metric.key} className={`${metric.bg} p-5 border rounded-lg grid grid-cols-3 gap-3`}>
                            <div className="flex flex-col col-span-2 justify-center">
                                <span className="font-semibold text-lg">{data.counts[metric.key]}</span>
                                <span className="flex whitespace-nowrap text-sm text-gray-700">{metric.label}</span>
                            </div>
                            <div className="border border-primaryDark bg-white flex justify-center items-center py-4 rounded-lg">
                                <metric.icon className="text-primary" size={25} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}