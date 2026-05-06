import { setUserMode, userMode } from "../contexts/Context";
import { useContext } from "react";
import { Link } from "react-router-dom";
export default function PublicNavBar() {
    const mode = useContext(userMode);
    const setMode = useContext(setUserMode);
    const handleToggleMode = () => {
        setMode(mode === 'seeker' ? 'employer' : 'seeker');
    };
    return (
        <div className=" flex justify-between page-container ">
            <div className="flex gap-2 sm:gap-2 md:gap-10 justify-center items-center">
                <h1 className="whitespace-nowrap"><Link to='/'>Opportunity Hub</Link></h1>
                <nav className={mode === 'employer' ? "hidden" : ""}>
                    <ul className="flex gap-5">
                        <li className="whitespace-nowrap"><Link to='/postList'>Opportunities</Link></li>
                        <li className="whitespace-nowrap"><Link to='/organizationList'>Find Employer</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="flex gap-2">
                <button className="btn-primary-blue "
                    onClick={handleToggleMode}

                >{mode}</button>
                <button className="btn-primary-white "><Link to='/signUpSeeker'>Sign In</Link></button></div>
        </div>
    );
}