import { NavLink } from "react-router-dom";
import NavProfileButton from "../../../GlobalComponents/NavProfileButton";
import { ROUTES } from "../../../routes/path";
export default function NavBarSeeker() {


    return (
        <nav className=" flex justify-between page-container border-b border-gray-100 bg-white sticky top-0 z-40">
            <div className="flex gap-2 sm:gap-2 md:gap-10 justify-center items-center">
                <h1 className="whitespace-nowrap text-big text-primary">
                    <NavLink to={ROUTES.HOME.ROOT} className="hover:opacity-80 transition-opacity">
                        Opportunity Hub
                    </NavLink>
                </h1>

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
                            to={ROUTES.HOME.ORGANIZATION_LIST}
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
                    <li className="whitespace-nowrap">
                        <NavLink
                            to={`${ROUTES.SEEKER.ROOT}/${ROUTES.SEEKER.OVERVIEW}`}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                                }`
                            }
                        >
                            My Activity
                        </NavLink>
                    </li>
                </ul>

            </div>


            <NavProfileButton settingsPath={ROUTES.SEEKER.SETTING} />
        </nav>
    );
}
