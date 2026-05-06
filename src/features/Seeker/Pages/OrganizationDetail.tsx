import BackButton from "../Components/BackButton";
import { useParams } from "react-router-dom";
import { Organizations, Posts, formatSalary } from "../../../services/postService";
import CardCompany from "../Components/CardCompany";
import CardGrid from "../Components/CardGrid";
import { useState } from "react";

export default function OrganizationDetail() {
    const [oppositionType, setOpportunityType] = useState('job');
    const { id } = useParams<{ id: string }>();

    const organization = Organizations.find(org => org.id === parseInt(id || '0'));

    if (!organization) {
        return <div className="page-container">Organization not found</div>;
    }

    const openPositions = Posts.filter(post => post.employer_id === organization.id).length;

    return (
        <div className="page-container flex flex-col mb-5">
            <BackButton />
            <div className="p-5 rounded-lg flex gap-5 border border-gray-200 shadow-gray-200">
                <img
                    className='rounded-lg w-15 h-15'
                    src={organization.image} alt="" />
                <div className="flex flex-col">
                    <span>{organization.name}</span>
                    <span>{organization.industry_type}</span>
                </div>
            </div>
            <section className="grid grid-cols-2 lg:grid-cols-3">
                <div className="col-span-2 flex flex-col p-5">
                    <p className="flex flex-col gap-5">
                        <span className="text-big">Description</span>
                        <span className="text-small text-gray-600">{organization.about_us}</span>
                    </p>
                    <p className="flex flex-col gap-5">
                        <span className="text-big">Organization Benefits</span>
                        <span className="text-small text-gray-600">{organization.about_us}</span>
                    </p>
                    <p className="flex flex-col gap-5">
                        <span className="text-big">Organization Vision</span>
                        <span className="text-small text-gray-600">{organization.company_vision}</span>
                    </p>
                    <span className="text-small text-gray-600">Share this on: facebook , instagram...</span>
                </div>
                <div className="flex flex-col gap-5  rounded-lg p-5">
                    <CardCompany organization={organization} />
                </div>
            </section>
            <section className="flex flex-col">
                <div className="flex justify-between mb-5">
                    <span className="text-big">Open Positions</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setOpportunityType('volunteer')}
                            className={oppositionType === 'volunteer' ? `btn-primary-blue` : `btn-primary-white`}
                        >
                            Volunteer
                        </button>
                        <button
                            onClick={() => setOpportunityType('job')}
                            className={oppositionType === 'job' ? `btn-primary-blue` : `btn-primary-white`}
                        >
                            Job
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                    {Posts.filter(post =>
                        post.employer_id === organization.id &&
                        post.type === oppositionType
                    ).map(post => (
                        <CardGrid
                            key={post.id}
                            id={post.id}
                            organizationName={organization?.name || 'Unknown'}
                            title={post.title}
                            engagementType={post.work_place_type}
                            location={post.location}
                            salary={formatSalary(post)}
                            remainingDays={post.closed_date}
                            image={organization?.image}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}