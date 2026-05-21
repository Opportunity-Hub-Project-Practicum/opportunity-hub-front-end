import { Layout } from "../component/Layout";
import { useState } from "react";
import { Search, Download } from "lucide-react";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample candidate data
  const candidates = {
    all: [
      {
        id: 1,
        name: "Ronald Richards",
        title: "UI/UX Designer",
        experience: "7 Years Experience",
        education: "Education: Bachelor's degree",
        skills: "Figma, Sketch, Adobe XD",
        appliedDate: "Applied on Jan 23, 2022",
        status: "new",
        avatar: "RR",
      },
      {
        id: 2,
        name: "Theresa Webb",
        title: "Product Designer",
        experience: "5 Years Experience",
        education: "Education: Master's degree",
        skills: "Prototyping, User Research",
        appliedDate: "Applied on Jan 25, 2022",
        status: "new",
        avatar: "TW",
      },
      {
        id: 3,
        name: "Devon Lane",
        title: "Lead UI Designer",
        experience: "10 Years Experience",
        education: "Education: Master's degree",
        skills: "Design Systems, Interaction Design",
        appliedDate: "Applied on Jan 23, 2022",
        status: "rejected",
        avatar: "DL",
      },
      {
        id: 4,
        name: "Ronald Richards",
        title: "Senior Designer",
        experience: "8 Years Experience",
        education: "Education: Bachelor's degree",
        skills: "Figma, Adobe Creative Suite",
        appliedDate: "Applied on Jan 26, 2022",
        status: "rejected",
        avatar: "RR",
      },
      {
        id: 5,
        name: "Ronald Richards",
        title: "UI/UX Designer",
        experience: "7 Years Experience",
        education: "Education: Bachelor's degree",
        skills: "Figma, Sketch, Adobe XD",
        appliedDate: "Applied on Jan 23, 2022",
        status: "shortlisted",
        avatar: "RR",
      },
      {
        id: 6,
        name: "Janie Wilson",
        title: "Product Designer",
        experience: "7 Years Experience",
        education: "Education: Bachelor's degree",
        skills: "User Research, Prototyping",
        appliedDate: "Applied on Jan 24, 2022",
        status: "shortlisted",
        avatar: "JW",
      },
    ],
  };

  const getColorForStatus = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 border-l-4 border-blue-500";
      case "rejected":
        return "bg-red-50 border-l-4 border-red-500";
      case "shortlisted":
        return "bg-gray-50 border-l-4 border-gray-400";
      default:
        return "bg-white border-l-4 border-gray-200";
    }
  };

  const getColumnData = (status: string) => {
    return candidates.all.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && (status === "all" || c.status === status);
    });
  };

  const allCount = candidates.all.filter((c) =>
    searchQuery ? getColumnData("all").includes(c) : true
  ).length;
  const newCount = getColumnData("new").length;
  const rejectedCount = getColumnData("rejected").length;
  const shortlistedCount = getColumnData("shortlisted").length;

  const renderCandidateCard = (candidate: (typeof candidates.all)[0]) => (
    <div
      key={candidate.id}
      className={`rounded-lg p-4 border border-gray-200 ${getColorForStatus(candidate.status)}`}
    >
      <div className="flex gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            candidate.status === "new"
              ? "bg-blue-500"
              : candidate.status === "rejected"
                ? "bg-red-500"
                : "bg-gray-500"
          }`}
        >
          {candidate.avatar}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{candidate.name}</p>
          <p className="text-xs text-gray-600">{candidate.title}</p>
        </div>
      </div>

      <div className="space-y-1 mb-3 text-xs">
        <p className="text-gray-600 flex items-center gap-1">
          <span>📊</span> {candidate.experience}
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <span>🎓</span> {candidate.education}
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <span>🛠️</span> {candidate.skills}
        </p>
      </div>

      <p className="text-xs text-gray-500 mb-3">{candidate.appliedDate}</p>

      <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
        <Download size={16} />
        Download CV
      </button>
    </div>
  );

  const KanbanColumn = ({
    title,
    count,
    status,
    headerColor,
  }: {
    title: string;
    count: number;
    status: string;
    headerColor: string;
  }) => {
    const columnCandidates =
      status === "all"
        ? candidates.all.filter((c) =>
            searchQuery
              ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.title.toLowerCase().includes(searchQuery.toLowerCase())
              : true
          )
        : getColumnData(status);

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-400px)]">
        <div className={`${headerColor} px-4 py-3 flex items-center justify-between`}>
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-600">({count})</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {columnCandidates.length > 0 ? (
            columnCandidates.map(renderCandidateCard)
          ) : (
            <p className="text-center text-gray-500 text-sm py-8">
              No candidates
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Job</span>
          <span className="mx-2">/</span>
          <span>Senior UX Designer</span>
          <span className="mx-2">/</span>
          <span className="text-blue-600 font-medium">Applications</span>
        </div>

        {/* Header and Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 text-blue-600 font-medium hover:underline text-sm">
            <span>➕</span> Create New Column
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-4 gap-6">
          <KanbanColumn
            title="All Application"
            count={allCount}
            status="all"
            headerColor="bg-blue-100"
          />
          <KanbanColumn
            title="New"
            count={newCount}
            status="new"
            headerColor="bg-white border-b border-gray-200"
          />
          <KanbanColumn
            title="Rejected"
            count={rejectedCount}
            status="rejected"
            headerColor="bg-red-100"
          />
          <KanbanColumn
            title="Shortlisted"
            count={shortlistedCount}
            status="shortlisted"
            headerColor="bg-gray-100"
          />
        </div>
      </div>
    </Layout>
  );
}
