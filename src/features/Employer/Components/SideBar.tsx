import { PlusCircle, Briefcase, Bookmark, Settings, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/path';

type SidebarProps = {
    mobileOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: ROUTES.EMPLOYER.OVERVIEW },
        { name: 'Post a Job', icon: PlusCircle, path: ROUTES.EMPLOYER.POST_APPLICATION },
        { name: 'My Jobs', icon: Briefcase, path: ROUTES.EMPLOYER.MY_JOBS },
        { name: 'Saved Candidate', icon: Bookmark, path: ROUTES.EMPLOYER.SAVE_CANDIDATE },
        { name: 'Settings', icon: Settings, path: ROUTES.EMPLOYER.SETTING },
    ];

    const [section, setSection] = useState("Overview");

    const handleClick = (itemName: string, path: string) => {
        setSection(itemName);
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <>
            {/* Desktop / large screens - Fixed sidebar */}
            <div className="hidden md:block w-full h-full bg-white border-r border-gray-100 flex flex-col">
                <div className="px-6 py-6 border-b border-gray-100">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Employer Dashboard
                    </h2>
                </div>

                <nav className="flex-1 flex flex-col py-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = section === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => handleClick(item.name, item.path)}
                                className={`flex items-center px-6 py-3 transition-all duration-200 border-l-4 mx-4 rounded-r-lg ${isActive
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-transparent border-transparent text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 mr-4 flex-shrink-0 ${isActive
                                        ? 'text-primary'
                                        : 'text-slate-400'
                                        }`}
                                />
                                <span className="text-sm font-medium truncate">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <p className="text-xs text-slate-400 text-center">Opportunity Hub</p>
                </div>
            </div>

            {/* Mobile drawer */}
            <div className={`md:hidden fixed inset-0 z-40 transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-hidden={!mobileOpen}>
                <div className="absolute inset-0 bg-black/40" onClick={() => onClose && onClose()} />
                <aside className="relative w-64 h-full bg-white border-r border-gray-100 flex flex-col">
                    <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employer Dashboard</h2>
                        <button onClick={() => onClose && onClose()} aria-label="Close menu" className="p-2 rounded-lg hover:bg-gray-100">
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    <nav className="flex-1 flex flex-col py-4 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = section === item.name;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleClick(item.name, item.path)}
                                    className={`flex items-center px-6 py-3 transition-all duration-200 border-l-4 mx-4 rounded-r-lg ${isActive
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-transparent border-transparent text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon
                                        className={`w-5 h-5 mr-4 flex-shrink-0 ${isActive
                                            ? 'text-primary'
                                            : 'text-slate-400'
                                            }`}
                                    />
                                    <span className="text-sm font-medium truncate">{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <p className="text-xs text-slate-400 text-center">Opportunity Hub</p>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default Sidebar;