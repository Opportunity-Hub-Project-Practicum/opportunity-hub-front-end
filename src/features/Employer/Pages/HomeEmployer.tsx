import React, { useState } from "react";
import { Briefcase, Users, BarChart2, Clipboard, FileText, Star, Zap, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/path";

type Opportunity = {
    id: number;
    title: string;
    location: string;
    type: string;
    category: string;
    postedAt: string;
};

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
    return (
        <div className="min-w-[280px] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-3">
                <span className="rounded-full bg-subPrimary px-3 py-1 text-xs font-medium text-primary">
                    {opportunity.category}
                </span>
            </div>

            <h3 className="mb-2 text-lg font-semibold">
                {opportunity.title}
            </h3>

            <p className="mb-3 text-sm text-gray-600">
                {opportunity.location} • {opportunity.type}
            </p>

            <p className="text-xs text-gray-400">
                Posted {opportunity.postedAt}
            </p>
        </div>
    );
}

function FeatureCard({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-subPrimary text-primary">
                {icon}
            </div>

            <h3 className="mb-2 text-lg font-semibold">{title}</h3>

            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

export default function HomeEmployerPage() {
    const [featuredOpportunities] = useState<Opportunity[]>([]);
    const loadingOpportunities = false;
    const opportunitiesError: string | null = null;

    const navigate = useNavigate();

    return (
        <>
            {/* Hero Section */}
            <section className="page-container">
                <div className="rounded-3xl bg-linear-to-r from-subPrimary/50 to-subPrimary p-8 md:p-12">
                    <div className="max-w-3xl">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
                            For Employers & Organizations
                        </span>

                        <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                            Connect with Talent and Volunteers
                        </h1>

                        <p className="mt-4 text-lg text-gray-600">
                            Post jobs, recruit volunteers, manage applications,
                            and streamline your hiring process through one
                            platform.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => { navigate(ROUTES.AUTH.SIGNUP_EMPLOYER) }}
                                className="btn-primary-white">
                                Register as Employer
                            </button>


                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="page-container">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold">
                        Why Choose Opportunity Hub?
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Everything you need to manage recruitment and volunteer
                        opportunities.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FeatureCard
                        icon={<Briefcase size={20} />}
                        title="Post Opportunities"
                        description="Create job listings and volunteer opportunities to reach qualified candidates and passionate volunteers."
                    />

                    <FeatureCard
                        icon={<Users size={20} />}
                        title="Manage Applicants"
                        description="Review applications, evaluate candidates, and keep your recruitment process organized."
                    />

                    <FeatureCard
                        icon={<BarChart2 size={20} />}
                        title="Track Progress"
                        description="Monitor application activity and gain insights into your hiring performance."
                    />
                </div>
            </section>

            {/* Features */}
            <section className="page-container">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold">
                        Employer Features
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Powerful tools designed to simplify recruitment.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={<Megaphone size={20} />}
                        title="Post Listings"
                        description="Publish job vacancies and volunteer opportunities with ease."
                    />

                    <FeatureCard
                        icon={<Clipboard size={20} />}
                        title="Custom Volunteer Questions"
                        description="Create application questions for volunteer opportunities to gather relevant information."
                    />

                    <FeatureCard
                        icon={<FileText size={20} />}
                        title="Applicant Review"
                        description="View applications and assess candidates directly from your dashboard."
                    />

                    <FeatureCard
                        icon={<Star size={20} />}
                        title="Shortlist Candidates"
                        description="Save promising applicants and organize them for later review."
                    />

                    <FeatureCard
                        icon={<BarChart2 size={20} />}
                        title="Hiring Metrics"
                        description="Track applications and gain basic insights into recruitment performance."
                    />

                    <FeatureCard
                        icon={<Zap size={20} />}
                        title="Efficient Workflow"
                        description="Keep hiring organized from posting opportunities to selecting candidates."
                    />
                </div>
            </section>

            {/* How It Works */}
            <section className="page-container">
                <div className="rounded-3xl bg-gray-50 p-8">
                    <h2 className="mb-10 text-center text-3xl font-bold">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                        {[
                            "Create Employer Account",
                            "Post Opportunities",
                            "Receive Applications",
                            "Review & Shortlist",
                            "Hire or Recruit",
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="text-center"
                            >
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                                    {index + 1}
                                </div>

                                <p className="text-sm font-medium">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Opportunities */}
            <section className="page-container">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Featured Opportunities
                        </h2>

                        <p className="mt-1 text-gray-600">
                            Explore the types of opportunities employers and
                            organizations can post.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4">
                    {loadingOpportunities && (
                        <p className="text-sm text-gray-500">Loading opportunities...</p>
                    )}
                    {!loadingOpportunities && opportunitiesError && (
                        <p className="text-sm text-red-600">{opportunitiesError}</p>
                    )}
                    {!loadingOpportunities && !opportunitiesError && featuredOpportunities.length === 0 && (
                        <p className="text-sm text-gray-500">No public opportunities available yet.</p>
                    )}
                    {featuredOpportunities.map((opportunity) => (
                        <OpportunityCard
                            key={opportunity.id}
                            opportunity={opportunity}
                        />
                    ))}
                </div>
            </section>

            {/* Audience Section */}
            <section className="page-container">
                <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-3xl font-bold">
                        Built for Companies and Organizations
                    </h2>

                    <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                        Whether you're hiring skilled professionals for your
                        company or recruiting volunteers for a community
                        initiative, Opportunity Hub helps you connect with the
                        right people and manage applications efficiently.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="page-container">
                <div className="rounded-3xl bg-primary p-10 text-center text-white">
                    <h2 className="text-3xl font-bold">
                        Ready to Start Recruiting?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-white/80">
                        Join employers and organizations using Opportunity Hub
                        to find talent, recruit volunteers, and streamline their
                        hiring process.
                    </p>

                    <div className="mt-8">
                        <button
                            onClick={() => { navigate(ROUTES.AUTH.SIGNUP_EMPLOYER) }} className="rounded-xl bg-white px-6 py-3 font-medium text-primary transition hover:shadow-lg">
                            Create Employer Account
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}