import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  FileText,
  Heart,
  Users,
} from "lucide-react";

import { Layout } from "../components/Layout";

const postedJobs = [
  {
    id: 1,
    title: "Senior UX Designer",
    type: "Internship",
    timeframe: "5 days remaining",
    status: "Active",
    applications: 180,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    type: "Full Time",
    timeframe: "27 days remaining",
    status: "Active",
    applications: 798,
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    type: "Full Time",
    timeframe: "24 days remaining",
    status: "Active",
    applications: 363,
  },
  {
    id: 4,
    title: "Front End Developer",
    type: "Full Time",
    timeframe: "Closed on Dec 1, 2025",
    status: "Expired",
    applications: 74,
  },
];

const volunteerApplications = [
  {
    id: 1,
    candidate: "Sophia Turner",
    role: "Community Event Volunteer",
    commitment: "Weekend support",
    appliedDate: "Applied 2 hours ago",
    status: "New",
  },
  {
    id: 2,
    candidate: "Daniel Kim",
    role: "Mentorship Program Volunteer",
    commitment: "4 hrs / week",
    appliedDate: "Applied today",
    status: "Shortlisted",
  },
  {
    id: 3,
    candidate: "Nina Patel",
    role: "Content Creator Volunteer",
    commitment: "Remote",
    appliedDate: "Applied yesterday",
    status: "Reviewing",
  },
  {
    id: 4,
    candidate: "Marcus Lee",
    role: "Fundraising Support Volunteer",
    commitment: "Hybrid",
    appliedDate: "Applied yesterday",
    status: "New",
  },
];

const volunteerCampaigns = [
  {
    id: 1,
    title: "Youth Digital Literacy Bootcamp",
    openSpots: 6,
    applications: 24,
  },
  {
    id: 2,
    title: "Community Storytelling Workshop",
    openSpots: 4,
    applications: 11,
  },
];

function getStatusClasses(status: string) {
  switch (status) {
    case "Active":
    case "New":
      return "bg-emerald-50 text-emerald-700";
    case "Shortlisted":
      return "bg-blue-50 text-blue-700";
    case "Reviewing":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-rose-50 text-rose-700";
  }
}

export default function Index() {
  const totalVolunteerApplications = volunteerApplications.length;
  const openVolunteerCampaigns = volunteerCampaigns.length;

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 p-6 text-white shadow-lg shadow-slate-900/10 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100">
                Employer Overview
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Hello, Instagram
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-200 md:text-base">
                Track job and volunteer momentum in one place, and quickly spot
                who needs review.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Volunteer Applications</p>
                <p className="mt-2 text-3xl font-semibold">{totalVolunteerApplications}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Active Volunteer Posts</p>
                <p className="mt-2 text-3xl font-semibold">{openVolunteerCampaigns}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Open Jobs</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">589</p>
              </div>
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <FileText size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Saved Candidates</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">2,517</p>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Volunteer Openings</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">10</p>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Heart size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-violet-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Volunteer Applications</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {totalVolunteerApplications}
                </p>
              </div>
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <BriefcaseBusiness size={22} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 2xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recently Posted Jobs</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep an eye on role status and incoming applications.
                </p>
              </div>
              <Link
                to="/employer/applications"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-2 py-4">Job</th>
                    <th className="px-2 py-4">Timeframe</th>
                    <th className="px-2 py-4">Status</th>
                    <th className="px-2 py-4">Applications</th>
                    <th className="px-2 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {postedJobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-2 py-4">
                        <p className="font-medium text-slate-900">{job.title}</p>
                        <p className="text-sm text-slate-500">{job.type}</p>
                      </td>
                      <td className="px-2 py-4 text-sm text-slate-600">{job.timeframe}</td>
                      <td className="px-2 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(job.status)}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-slate-400" />
                          {job.applications} Applications
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <Link
                          to="/employer/applications"
                          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                        >
                          View Applications
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Volunteer Applications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Recent volunteer interest that needs attention.
                  </p>
                </div>
                <Link
                  to="/employer/applications"
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                  See all
                </Link>
              </div>

              <div className="space-y-4">
                {volunteerApplications.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{application.candidate}</p>
                        <p className="text-sm text-slate-600">{application.role}</p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 size={15} />
                        {application.appliedDate}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Heart size={15} />
                        {application.commitment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Volunteer Campaign Snapshot</h2>
              <p className="mt-1 text-sm text-slate-500">
                See which volunteer programs are attracting attention.
              </p>

              <div className="mt-5 space-y-4">
                {volunteerCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{campaign.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {campaign.openSpots} spots open
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-slate-900">
                          {campaign.applications}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          applications
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
