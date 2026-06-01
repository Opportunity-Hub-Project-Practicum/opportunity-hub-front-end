import Footer from "../GlobalComponents/footer";
import PublicNavBar from "../GlobalComponents/NavBar";
import { Outlet } from "react-router-dom";
import { userMode, setUserMode, opportunityTypeContext, setOpportunityTypeContext, type UserMode, type OpportunityType } from "../contexts/Context";
import { useState } from "react";

export default function HomeLayout() {
    const [mode, setMode] = useState<UserMode>(() => (localStorage.getItem('userMode') as UserMode | null) ?? 'seeker');
    const [oppType, setOppType] = useState<OpportunityType>('job');
    return (
        <userMode.Provider value={mode}>
            <setUserMode.Provider value={setMode}>
                <opportunityTypeContext.Provider value={oppType}>
                    <setOpportunityTypeContext.Provider value={setOppType}>
                        <header>
                            <PublicNavBar />
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




