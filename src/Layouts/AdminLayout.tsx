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
            <main className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-5">
                <nav className="col-span-1 ">
                    <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
                </nav>
                <div className="col-span-3 lg:col-span-4">
                    <Outlet />
                </div>
            </main>

        </>
    )
}
