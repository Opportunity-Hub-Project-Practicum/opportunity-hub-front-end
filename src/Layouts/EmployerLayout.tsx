import Footer from "../GlobalComponents/footer";
import NavBar from "../features/Employer/Components/NavBar";
import { Outlet } from "react-router-dom";
import Sidebar from "../features/Employer/Components/SideBar";
import { useState } from "react";

export default function EmployerLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <header>
                <NavBar onMenuClick={() => setMobileSidebarOpen(true)} />
            </header>
            <div className="flex flex-1">
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
                </aside>
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
            <footer><Footer /></footer>
        </div>
    );
}
