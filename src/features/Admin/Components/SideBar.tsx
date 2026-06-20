import {
    Briefcase,
    ChevronLeft,
    ChevronRight,
    CircleUserRound,
    Layers,
    PlusCircle,
    Settings,
    Tags,
    X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/path";

type SidebarProps = {
    mobileOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
    const menuItems = [
        { name: "Overview", icon: Layers, path: ROUTES.ADMIN.OVERVIEW },
        { name: "Manage User", icon: PlusCircle, path: ROUTES.ADMIN.MANAGE_USER },
        { name: "All Posts", icon: Briefcase, path: ROUTES.ADMIN.ALL_POST },
        { name: "Reported Post", icon: Settings, path: ROUTES.ADMIN.REPORTED },
        { name: "Manage Values", icon: Tags, path: ROUTES.ADMIN.MANAGE_VALUES },
        { name: "Profile", icon: CircleUserRound, path: ROUTES.ADMIN.PROFILE },
    ];
    const [section, setSection] = useState("Overview");
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleClick = (itemName: string, path: string) => {
        setSection(itemName);
        navigate(path);
        if (onClose) {
            onClose();
        }
    };

    const renderNavItems = (isCollapsed: boolean) => (
        menuItems.map((item) => {
            const isActive = section === item.name;

            return (
                <button
                    key={item.name}
                    type="button"
                    title={isCollapsed ? item.name : undefined}
                    onClick={() => handleClick(item.name, item.path)}
                    className={`flex items-center transition-all duration-200 border-l-[3px] ${isCollapsed ? "justify-center px-0 py-4" : "px-6 py-4"} ${isActive
                        ? "bg-subPrimary/50 border-primary text-primary"
                        : "bg-transparent border-transparent text-slate-500 hover:bg-gray-50"
                        }`}
                >
                    <item.icon
                        className={`h-5 w-5 shrink-0 ${isCollapsed ? "" : "mr-4"} ${isActive ? "text-primary" : "text-slate-400"
                            }`}
                    />
                    {!isCollapsed && (
                        <span className="text-[15px] font-medium">{item.name}</span>
                    )}
                </button>
            );
        })
    );

    return (
        <>
            <div
                className={`hidden md:flex min-h-screen flex-col border-r border-gray-100 bg-white py-6 font-sans transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                    }`}
            >
                <div className={`mb-6 flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
                    {!collapsed && (
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Admin Dashboard
                        </h2>
                    )}
                    <button
                        type="button"
                        onClick={() => setCollapsed((current) => !current)}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-gray-50 hover:text-slate-700"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                </div>

                <nav className="flex flex-1 flex-col">
                    {renderNavItems(collapsed)}
                </nav>
            </div>

            <div
                className={`fixed inset-0 z-40 transition-transform md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                aria-hidden={!mobileOpen}
            >
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => onClose && onClose()}
                />
                <aside className="relative h-full w-64 border-r border-gray-100 bg-white py-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Admin Dashboard
                        </h2>
                        <button
                            type="button"
                            onClick={() => onClose && onClose()}
                            aria-label="Close menu"
                            className="p-2"
                        >
                            <X className="h-5 w-5 text-slate-600" />
                        </button>
                    </div>

                    <nav className="mt-4 flex flex-col">
                        {renderNavItems(false)}
                    </nav>
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
