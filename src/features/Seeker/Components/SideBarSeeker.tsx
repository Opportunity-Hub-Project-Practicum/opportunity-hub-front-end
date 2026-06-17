import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    Heart,
    Bell,
    Settings,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../routes/path";

const menuItems = [
    { key: ROUTES.SEEKER.OVERVIEW, label: 'Overview', Icon: LayoutDashboard },
    { key: ROUTES.SEEKER.APPLIED, label: 'Applied Jobs', Icon: BriefcaseBusiness },
    { key: ROUTES.SEEKER.FAVORITE, label: 'Favorites', Icon: Heart },
    { key: ROUTES.SEEKER.ALERT, label: 'Job Alerts', Icon: Bell },
    { key: ROUTES.SEEKER.SETTING, label: 'Settings', Icon: Settings },
];

export default function SideBarSeeker() {
    const [column, setcolumn] = useState('overviewActivity');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleClick = (item: string) => {
        setcolumn(item);
        navigate(item);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            await logout();
            navigate(ROUTES.AUTH.LOGIN, { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex flex-col w-full py-4 px-2 h-full">
            {/* Section label */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
                Candidate Dashboard
            </p>

            <nav className="flex flex-col gap-0.5">
                {menuItems.map(({ key, label, Icon }) => {
                    const isActive = column === key;
                    return (
                        <button
                            key={key}
                            onClick={() => handleClick(key)}
                            className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 border-l-2 border-transparent'
                                }`}
                        >
                            <Icon
                                size={17}
                                className={`shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                            />
                            <span className="flex-1 text-left">{label}</span>
                            {isActive && (
                                <ChevronRight size={14} className="text-blue-400 shrink-0" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-red-500 hover:bg-red-50 hover:text-red-600 border-l-2 border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <LogOut size={17} className="shrink-0 transition-colors text-red-400 group-hover:text-red-600" />
                    <span className="flex-1 text-left">{isLoggingOut ? "Signing out..." : "Logout"}</span>
                </button>
            </div>
        </div>
    );
}
