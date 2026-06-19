import { setUserMode, userMode } from "../contexts/Context";
import { useContext } from "react";
import { Link } from "react-router-dom";
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
        <div className=" flex justify-between page-container ">
            <div className="flex gap-2 sm:gap-2 md:gap-10 justify-center items-center">
                <h1 className="whitespace-nowrap text-big text-primary"><Link to='/'>Opportunity Hub</Link></h1>
                <nav className={mode === 'employer' ? "hidden" : ""}>
                    <ul className="flex gap-5">
                        <li className="whitespace-nowrap"><Link to={ROUTES.HOME.ROOT}>Opportunities</Link></li>
                        <li className="whitespace-nowrap"><Link to='/organizationList'>Find Employer</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="flex gap-2">
                <button className="btn-primary-blue "
                    onClick={handleToggleMode}

                >{mode}</button>
                <button className="btn-primary-white "><Link to={ROUTES.AUTH.LOGIN}>Sign In</Link></button></div>
        </div>
    );
}
