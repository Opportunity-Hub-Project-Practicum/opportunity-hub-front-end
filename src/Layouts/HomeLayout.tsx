import Footer from "../GlobalComponents/footer";
import PublicNavBar from "../GlobalComponents/NavBar";
import NavBarSeeker from "../features/Seeker/Components/NavBarSeeker";
import { Outlet, useLocation } from "react-router-dom";
import { userMode, setUserMode, opportunityTypeContext, setOpportunityTypeContext, type UserMode, type OpportunityType } from "../contexts/Context";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { ROUTES } from "../routes/path";

function resolveUserMode(pathname: string): UserMode {
    return pathname === ROUTES.HOME.HOME_EMPLOYER ? "employer" : "seeker";
}

export default function HomeLayout() {
    const location = useLocation();
    const { user } = useAuth();
    const [mode, setMode] = useState<UserMode>(() => resolveUserMode(location.pathname));
    const [oppType, setOppType] = useState<OpportunityType>('job');
    const shouldUseSeekerNav = user?.role === 'seeker';

    useEffect(() => {
        const nextMode = resolveUserMode(location.pathname);
        setMode(nextMode);
        localStorage.setItem("userMode", nextMode);
    }, [location.pathname]);

    return (
        <userMode.Provider value={mode}>
            <setUserMode.Provider value={setMode}>
                <opportunityTypeContext.Provider value={oppType}>
                    <setOpportunityTypeContext.Provider value={setOppType}>
                        <header>
                            {shouldUseSeekerNav ? <NavBarSeeker /> : <PublicNavBar />}
                        </header>
                        <main >
                            <Outlet />
                        </main>
                        <footer>
                            <Footer />
                        </footer>
                    </setOpportunityTypeContext.Provider>
                </opportunityTypeContext.Provider>
            </setUserMode.Provider>
        </userMode.Provider>
    );
};




