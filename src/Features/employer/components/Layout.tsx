import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AtSign,
  BarChart3,
  Briefcase,
  Heart,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { icon: BarChart3, label: "Overview", path: "/employer" },
    { icon: Plus, label: "Post a Job", path: "/employer/post-job" },
    { icon: Briefcase, label: "My Jobs", path: "/employer/my-jobs" },
    { icon: Heart, label: "Saved Candidate", path: "/employer/saved-candidates" },
    { icon: Settings, label: "Settings", path: "/employer/settings" },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      <div className="hidden w-64 flex-col border-r border-slate-200 bg-white xl:flex">
        <div className="border-b border-gray-200 p-6">
          <Link to="/employer" className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
              <Briefcase size={16} />
            </div>
            <span>OpportunityHub</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Employers Dashboard
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100">
            <LogOut size={18} />
            <span>Log-out</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Employer Settings</p>
            <p className="text-xs text-slate-500">Manage your company profile and account details</p>
          </div>
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-orange-400 to-red-500 text-white">
            <AtSign size={16} />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 xl:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
