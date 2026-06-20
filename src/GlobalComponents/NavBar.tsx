import { setUserMode, userMode } from "../contexts/Context";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../routes/path";
import { useNavigate } from "react-router-dom";
export default function PublicNavBar() {
    const navigate = useNavigate();
    const mode = useContext(userMode);
    const setMode = useContext(setUserMode);

    const handleToggleMode = () => {
        const nextMode = mode === 'seeker' ? 'employer' : 'seeker';
        localStorage.setItem('userMode', nextMode);
        setMode(nextMode);
        navigate(nextMode === 'employer' ? ROUTES.HOME.HOME_EMPLOYER : ROUTES.HOME.ROOT)

    };
    return (
        <nav className=" flex justify-between page-container border-b border-gray-100 bg-white sticky top-0 z-40">
            <div className="flex gap-2 sm:gap-2 md:gap-10 justify-center items-center">
                <h1 className="whitespace-nowrap text-big text-primary">
                    <NavLink to='/' className="hover:opacity-80 transition-opacity">
                        Opportunity Hub
                    </NavLink>
                </h1>
                <nav className={mode === 'employer' ? "hidden" : ""}>
                    <ul className="flex gap-2 md:gap-6">
                        <li className="whitespace-nowrap">
                            <NavLink
                                to={ROUTES.HOME.ROOT}
                                end
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-primary/10 text-primary border-b-2 border-primary"
                                            : "text-gray-600 hover:text-primary hover:bg-gray-50"
                                    }`
                                }
                            >
                                Opportunities
                            </NavLink>
                        </li>
                        <li className="whitespace-nowrap">
                            <NavLink
                                to='/organizationList'
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-primary/10 text-primary border-b-2 border-primary"
                                            : "text-gray-600 hover:text-primary hover:bg-gray-50"
                                    }`
                                }
                            >
                                Find Employer
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex gap-2">
                <button className="btn-primary-blue "
                    onClick={handleToggleMode}

                >{mode}</button>
                <button className="btn-primary-white "><NavLink to={ROUTES.AUTH.LOGIN} className="inline-block">Sign In</NavLink></button></div>
        </nav>
    );
}
