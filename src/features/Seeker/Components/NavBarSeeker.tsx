import { Link, NavLink } from "react-router-dom";
import NavProfileButton from "../../../GlobalComponents/NavProfileButton";
import { ROUTES } from "../../../routes/path";
export default function NavBarSeeker() {


    return (
        <nav className=" flex justify-between page-container ">
            <div className="flex gap-2 sm:gap-2 md:gap-10 justify-center items-center">
                <h1 className="whitespace-nowrap text-big text-primary"><Link to={ROUTES.HOME.ROOT}>Opportunity Hub</Link></h1>

                <ul className="flex gap-5">
                    <li className="whitespace-nowrap">
                        <NavLink
                            to={ROUTES.HOME.ROOT}
                            end
                            state={null}
                            className={({ isActive }) => (isActive ? "font-semibold text-primary" : "")}
                        >
                            Opportunities
                        </NavLink>
                    </li>
                    <li className="whitespace-nowrap"><Link to={ROUTES.HOME.ORGANIZATION_LIST}>Find Employer</Link></li>
                    <li className="whitespace-nowrap"><Link to={`${ROUTES.SEEKER.ROOT}/${ROUTES.SEEKER.OVERVIEW}`}>My Activity</Link></li>
                </ul>

            </div>


            <NavProfileButton settingsPath={ROUTES.SEEKER.SETTING} />
        </nav>
    );
}
