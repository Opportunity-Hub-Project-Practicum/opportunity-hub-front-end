import { Outlet } from "react-router-dom";
import Footer from "../GlobalComponents/footer";
import NavBarSeeker from "../features/Seeker/Components/NavBarSeeker";
import SideBarSeeker from "../features/Seeker/Components/SideBarSeeker";
export default function SeekerLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex-shrink-0"><NavBarSeeker /></header>
            <main className="flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-5">
                <nav className="col-span-1"><SideBarSeeker /></nav>
                <div className="col-span-3 lg:col-span-4">
                    <Outlet />
                </div>
            </main>
            <footer className="flex-shrink-0"><Footer /></footer>
        </div>
    );
}
