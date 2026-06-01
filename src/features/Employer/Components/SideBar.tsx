import { Layers, PlusCircle, Briefcase, Bookmark, Settings, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/path';

type SidebarProps = {
    mobileOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
    const menuItems = [
        { name: 'Overview', icon: Layers, path: ROUTES.EMPLOYER.OVERVIEW },
        { name: 'Post a Job', icon: PlusCircle, path: ROUTES.EMPLOYER.POST_APPLICATION },
        { name: 'My Jobs', icon: Briefcase, path: ROUTES.EMPLOYER.MY_JOBS },
        { name: 'Saved Candidate', icon: Bookmark, path: ROUTES.EMPLOYER.SAVE_CANDIDATE },
        { name: 'Settings', icon: Settings, path: ROUTES.EMPLOYER.SETTING },
    ];
    const [section, SetSection] = useState("Overview")
    const navigate = useNavigate();

    const handleClick = (itemName: string, path: string) => {
        SetSection(itemName);
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <>
            {/* Desktop / large screens */}
            <div className="hidden md:block w-full max-w-75 min-h-screen  bg-white border-r border-gray-100 py-6 font-sans">
                <div className="px-6 mb-6">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Employers Dashboard
                    </h2>
                </div>

                <nav className="flex flex-col">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleClick(item.name, item.path)}
                            className={`flex items-center px-6 py-4 transition-all duration-200 border-l-[3px] ${section
                                === `${item.name}` ? 'bg-blue-50 border-blue-600 text-blue-600'
                                : 'bg-transparent border-transparent text-slate-500 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 mr-4 ${section
                                    === `${item.name}` ? 'text-blue-600' : 'text-slate-400'
                                    }`}
                            />
                            <span className="text-[15px] font-medium flex shrink-0">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Mobile drawer */}
            <div className={`md:hidden fixed inset-0 z-40 transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-hidden={!mobileOpen}>
                <div className="absolute inset-0 bg-black/40" onClick={() => onClose && onClose()} />
                <aside className="relative w-64 h-full bg-white border-r border-gray-100 py-6">
                    <div className="px-4 flex items-center justify-between">
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employers Dashboard</h2>
                        <button onClick={() => onClose && onClose()} aria-label="Close menu" className="p-2">
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    <nav className="flex flex-col mt-4">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleClick(item.name, item.path)}
                                className={`flex items-center px-6 py-4 transition-all duration-200 border-l-[3px] ${section
                                    === `${item.name}` ? 'bg-blue-50 border-blue-600 text-blue-600'
                                    : 'bg-transparent border-transparent text-slate-500 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 mr-4 ${section
                                        === `${item.name}` ? 'text-blue-600' : 'text-slate-400'
                                        }`}
                                />
                                <span className="text-[15px] font-medium flex shrink-0">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
            </div>
        </>
    );
};

export default Sidebar;