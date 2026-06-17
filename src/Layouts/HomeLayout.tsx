import Footer from "../GlobalComponents/footer";
import PublicNavBar from "../GlobalComponents/NavBar";
import NavBarSeeker from "../features/Seeker/Components/NavBarSeeker";
import { Outlet } from "react-router-dom";
import { userMode, setUserMode, opportunityTypeContext, setOpportunityTypeContext, type UserMode, type OpportunityType } from "../contexts/Context";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function HomeLayout() {
    const { user } = useAuth();
    const [mode, setMode] = useState<UserMode>(() => (localStorage.getItem('userMode') as UserMode | null) ?? 'seeker');
    const [oppType, setOppType] = useState<OpportunityType>('job');
    const shouldUseSeekerNav = user?.role === 'seeker';

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




