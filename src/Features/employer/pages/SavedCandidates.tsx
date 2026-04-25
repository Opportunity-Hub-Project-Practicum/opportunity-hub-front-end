import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Heart,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";

import { Layout } from "../components/Layout";

type CandidateType = "all" | "job" | "volunteer";

type SavedCandidate = {
  id: number;
  name: string;
  role: string;
  type: Exclude<CandidateType, "all">;
  location: string;
  experience: string;
  skills: string[];
  savedDate: string;
  matchScore: string;
  availability: string;
};

const savedCandidates: SavedCandidate[] = [
  {
    id: 1,
    name: "Sophia Turner",
    role: "Community Event Coordinator",
    type: "volunteer",
    location: "Phnom Penh, Cambodia",
    experience: "3 years organizing community programs",
    skills: ["Community outreach", "Volunteer support", "Event planning"],
    savedDate: "Saved 2 hours ago",
    matchScore: "96%",
    availability: "Weekend",
  },
  {
    id: 2,
    name: "Daniel Kim",
    role: "Product Designer",
    type: "job",
    location: "Remote",
    experience: "5 years in UX and product design",
    skills: ["Figma", "Research", "Design systems"],
    savedDate: "Saved today",
    matchScore: "92%",
    availability: "Full-time",
  },
  {
    id: 3,
    name: "Nina Patel",
    role: "Content Creator Volunteer",
    type: "volunteer",
    location: "Bangkok, Thailand",
    experience: "2 years in nonprofit storytelling",
    skills: ["Copywriting", "Canva", "Social media"],
    savedDate: "Saved yesterday",
    matchScore: "89%",
    availability: "Remote",
  },
  {
    id: 4,
    name: "Marcus Lee",
    role: "Frontend Developer",
    type: "job",
    location: "Ho Chi Minh City, Vietnam",
    experience: "4 years with React and TypeScript",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    savedDate: "Saved yesterday",
    matchScore: "94%",
    availability: "Immediate",
  },
  {
    id: 5,
    name: "Jasmine Chen",
    role: "Mentorship Program Volunteer",
    type: "volunteer",
    location: "Singapore",
    experience: "Mentored 30+ early-career students",
    skills: ["Mentoring", "Career coaching", "Workshop facilitation"],
    savedDate: "Saved 3 days ago",
    matchScore: "91%",
    availability: "4 hrs / week",
  },
  {
    id: 6,
    name: "Ronald Richards",
    role: "UI/UX Designer",
    type: "job",
    location: "Jakarta, Indonesia",
    experience: "7 years in visual product design",
    skills: ["UI design", "Wireframing", "Prototyping"],
    savedDate: "Saved 4 days ago",
    matchScore: "90%",
    availability: "Full-time",
  },
];

function getTypeClasses(type: SavedCandidate["type"]) {
  return type === "volunteer"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-blue-50 text-blue-700";
}

export default function SavedCandidates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [candidateType, setCandidateType] = useState<CandidateType>("all");

  const filteredCandidates = useMemo(() => {
    return savedCandidates.filter((candidate) => {
      const matchesType = candidateType === "all" || candidate.type === candidateType;
      const query = searchQuery.trim().toLowerCase();

      const matchesQuery =
        query.length === 0 ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(query));

      return matchesType && matchesQuery;
    });
  }, [candidateType, searchQuery]);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-800 p-6 text-white shadow-lg shadow-slate-900/10 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100">
                Candidate Pipeline
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Saved Candidates
              </h1>
              <p className="text-sm leading-6 text-slate-200 md:text-base">
                Keep strong profiles close, compare job and volunteer fits, and
                jump back into outreach faster.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Total Saved</p>
                <p className="mt-2 text-3xl font-semibold">{savedCandidates.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Volunteer Fits</p>
                <p className="mt-2 text-3xl font-semibold">
                  {savedCandidates.filter((candidate) => candidate.type === "volunteer").length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">Job Fits</p>
                <p className="mt-2 text-3xl font-semibold">
                  {savedCandidates.filter((candidate) => candidate.type === "job").length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Candidate List ({filteredCandidates.length})
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review saved profiles for hiring or volunteer opportunities.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-[260px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved candidate"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={candidateType}
                onChange={(e) => setCandidateType(e.target.value as CandidateType)}
                className="h-11 min-w-[170px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Candidates</option>
                <option value="job">Job Candidates</option>
                <option value="volunteer">Volunteer Candidates</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-base font-semibold text-slate-700">
                      {candidate.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {candidate.name}
                            </h3>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getTypeClasses(candidate.type)}`}
                            >
                              {candidate.type === "volunteer" ? "Volunteer" : "Job"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{candidate.role}</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-amber-700">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-semibold">{candidate.matchScore} match</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {candidate.location}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <BriefcaseBusiness className="h-4 w-4" />
                          {candidate.experience}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          {candidate.availability}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 xl:items-end">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Users className="h-4 w-4" />
                      {candidate.savedDate}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        View Profile
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              Showing {filteredCandidates.length} of {savedCandidates.length} saved candidates
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
              >
                3
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
              >
                4
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
