import { Outlet } from "react-router-dom";
import NavBar from "../features/Admin/Components/NavBar";
import Sidebar from "../features/Admin/Components/SideBar";
import Footer from "../GlobalComponents/footer";
import { useState } from "react";
export default function AdminLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex-shrink-0">
                <NavBar onMenuClick={() => setMobileSidebarOpen(true)} />
            </header>
            <main className="flex-1 flex min-h-0">
                <nav className="shrink-0">
                    <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
                </nav>
                <div className="min-w-0 flex-1 p-4 md:p-5">
                    <Outlet />
                </div>
            </main>
            <footer className="flex-shrink-0">
                <Footer />
            </footer>
        </div>
    )
}
