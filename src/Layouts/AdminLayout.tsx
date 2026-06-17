import { Outlet } from "react-router-dom";
import NavBar from "../features/Admin/Components/NavBar";
import Sidebar from "../features/Admin/Components/SideBar";
import { useState } from "react";
export default function AdminLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <>
            <header>
                <NavBar onMenuClick={() => setMobileSidebarOpen(true)} />
            </header>
            <main className="flex min-h-[calc(100vh-4rem)]">
                <nav className="shrink-0">
                    <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
                </nav>
                <div className="min-w-0 flex-1 p-4 md:p-5">
                    <Outlet />
                </div>
            </main>

        </>
    )
}
