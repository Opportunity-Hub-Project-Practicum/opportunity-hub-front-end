import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Clock3,
  Eye,
  HeartHandshake,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Layout } from "../components/Layout";

type JobTypeFilter = "all" | "job" | "volunteer";
type JobStatusFilter = "all" | "active" | "expired";
type ItemKind = "job" | "volunteer";
type ItemStatus = "Active" | "Expired";

type PostedItem = {
  id: number;
  title: string;
  kind: ItemKind;
  category: string;
  timeframe: string;
  status: ItemStatus;
  applications: number;
  location: string;
  priority: "High" | "Medium" | "Low";
};

const postedItems: PostedItem[] = [
  {
    id: 1,
    title: "Senior UX Designer",
    kind: "job",
    category: "Internship",
    timeframe: "8 days remaining",
    status: "Active",
    applications: 185,
    location: "Remote",
    priority: "High",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    kind: "job",
    category: "Full Time",
    timeframe: "27 days remaining",
    status: "Active",
    applications: 798,
    location: "Phnom Penh",
    priority: "High",
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    kind: "job",
    category: "Full Time",
    timeframe: "24 days remaining",
    status: "Active",
    applications: 583,
    location: "Hybrid",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Front End Developer",
    kind: "job",
    category: "Full Time",
    timeframe: "Closed on Dec 7, 2019",
    status: "Expired",
    applications: 740,
    location: "On-site",
    priority: "Low",
  },
  {
    id: 5,
    title: "Community Event Volunteer",
    kind: "volunteer",
    category: "Volunteer",
    timeframe: "4 days remaining",
    status: "Active",
    applications: 556,
    location: "Weekend",
    priority: "High",
  },
  {
    id: 6,
    title: "Mentorship Program Volunteer",
    kind: "volunteer",
    category: "Volunteer",
    timeframe: "2 days remaining",
    status: "Active",
    applications: 126,
    location: "Remote",
    priority: "Medium",
  },
];

function getStatusTextClasses(status: ItemStatus) {
  return status === "Active" ? "text-emerald-600" : "text-rose-500";
}

function getStatusDotClasses(status: ItemStatus) {
  return status === "Active" ? "bg-emerald-500" : "bg-rose-500";
}

function getPriorityClasses(priority: PostedItem["priority"]) {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-600";
    case "Medium":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function MyJobs() {
  const [typeFilter, setTypeFilter] = useState<JobTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("all");

  const filteredItems = useMemo(() => {
    return postedItems.filter((item) => {
      const matchesType = typeFilter === "all" || item.kind === typeFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status === "Active") ||
        (statusFilter === "expired" && item.status === "Expired");

      return matchesType && matchesStatus;
    });
  }, [statusFilter, typeFilter]);

  const summary = useMemo(() => {
    const activeCount = postedItems.filter((item) => item.status === "Active").length;
    const volunteerCount = postedItems.filter((item) => item.kind === "volunteer").length;
    const totalApplications = postedItems.reduce(
      (sum, item) => sum + item.applications,
      0,
    );

    return { activeCount, volunteerCount, totalApplications };
  }, []);

  return (
    <Layout>
      <div className="w-full space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 p-6 text-white shadow-lg shadow-slate-900/10 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100">
                Hiring Workspace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                My Jobs
              </h1>
              <p className="text-sm leading-6 text-slate-200 md:text-base">
                Manage live roles, volunteer posts, and candidate flow from one
                clearer pipeline.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Active Posts</p>
                <p className="mt-2 text-3xl font-semibold">{summary.activeCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Volunteer Posts</p>
                <p className="mt-2 text-3xl font-semibold">{summary.volunteerCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Total Applications</p>
                <p className="mt-2 text-3xl font-semibold">{summary.totalApplications}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">All Listings</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{postedItems.length}</p>
              </div>
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Needs Attention</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {postedItems.filter((item) => item.priority === "High").length}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Filtered Results</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {filteredItems.length}
                </p>
              </div>
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <HeartHandshake className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Posted Roles ({filteredItems.length})
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Filter roles by type and status, then open the candidate pipeline with one click.
                </p>
              </div>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="inline-flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setTypeFilter("all")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      typeFilter === "all"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter("job")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      typeFilter === "job"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Jobs
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter("volunteer")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      typeFilter === "volunteer"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Volunteer
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-500">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as JobStatusFilter)}
                    className="h-11 min-w-[150px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All Jobs</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-[minmax(0,2.8fr)_1fr_1.3fr_1.45fr] gap-6 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
            <span>Role</span>
            <span>Status</span>
            <span>Applications</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-5 px-6 py-5 transition hover:bg-slate-50 xl:grid-cols-[minmax(0,2.8fr)_1fr_1.3fr_1.45fr] xl:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-medium text-slate-900">{item.title}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.kind === "volunteer"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {item.kind === "volunteer" ? "Volunteer" : "Job"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClasses(item.priority)}`}
                      >
                        {item.priority} priority
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{item.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {item.timeframe}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-medium ${getStatusTextClasses(item.status)}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${getStatusDotClasses(item.status)}`}
                      />
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{item.applications} Applications</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.applications > 500
                        ? "High candidate volume"
                        : item.applications > 150
                          ? "Healthy response rate"
                          : "Needs more promotion"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/employer/applications"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      View Applications
                    </Link>
                    <button
                      type="button"
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                        item.status === "Active"
                          ? "text-rose-500 hover:bg-rose-50"
                          : "text-lime-500 hover:bg-lime-50"
                      }`}
                      aria-label={item.status === "Active" ? "Close post" : "Reopen post"}
                    >
                      {item.status === "Active" ? (
                        <CircleOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-14 text-center">
                <p className="text-base font-medium text-slate-900">No roles match this filter</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try switching the type or status filter to see more postings.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white"
          >
            01
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-slate-500 transition hover:bg-slate-100"
          >
            02
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-slate-500 transition hover:bg-slate-100"
          >
            03
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500"
          >
            04
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-slate-500 transition hover:bg-slate-100"
          >
            05
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
