import NavProfileButton from "../../../GlobalComponents/NavProfileButton";
import { ROUTES } from "../../../routes/path";

type NavBarProps = {
    onMenuClick?: () => void;
};

export default function NavBar({ onMenuClick }: NavBarProps) {

    return (
        <nav className=" flex justify-between page-container ">
            <div className="flex gap-2 sm:gap-2 md:gap-10 justify-center items-center">
                <div className="md:hidden mr-2">
                    <button aria-label="Open menu" onClick={() => onMenuClick && onMenuClick()} className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>

                <h1 className="whitespace-nowrap text-big text-primary">Opportunity Hub</h1>

            </div>


            <NavProfileButton settingsPath={ROUTES.EMPLOYER.SETTING} />
        </nav>
    );
}
