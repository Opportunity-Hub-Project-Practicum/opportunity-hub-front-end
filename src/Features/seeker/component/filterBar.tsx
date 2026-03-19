import { ChevronDown, Grid3x3, List } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  viewType: string;
  setViewType: (view: string) => void;
}

export default function FilterBar({ viewType, setViewType }: FilterBarProps) {
  const [sortBy, setSortBy] = useState("latest");
  // const [itemsPerPage, setItemsPerPage] = useState("12");

  return (
    <div className="w-full bg-white px-4 md:px-6 lg:px-8 py-4 border-b border-slate-200">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
          {/* Left Section - Sort */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Sort by:</span>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer pr-8 hover:border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Most Relevant</option>
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            </div>
          </div>

          {/* Right Section - View Options */}
          <div className="flex items-center gap-3">
            {/* View Type Toggle */}
            <div className="flex items-center border border-slate-200 rounded-md">
              {/* Grid View */}
              <button
                onClick={() => setViewType("grid")}
                className={`flex items-center justify-center p-2 transition-colors ${viewType === "grid"
                    ? "bg-white"
                    : "bg-white hover:bg-slate-50"
                  }`}
              >
                <Grid3x3
                  size={18}
                  className={`${viewType === "grid"
                      ? "text-slate-900"
                      : "text-slate-500"
                    }`}
                />
              </button>

              {/* List View */}
              <button
                onClick={() => setViewType("list")}
                className={`flex items-center justify-center p-2 transition-colors border-l border-slate-200 ${viewType === "list"
                    ? "bg-slate-100"
                    : "bg-white hover:bg-slate-50"
                  }`}
              >
                <List
                  size={18}
                  className={`${viewType === "list"
                      ? "text-slate-900"
                      : "text-slate-500"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
