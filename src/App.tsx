import { BrowserRouter, Route, Routes } from "react-router-dom";
import Applications from "./features/employer/pages/Applications";
import Index from "./features/employer/pages/Index";
import MyJobs from "./features/employer/pages/MyJobs";
import NotFound from "./features/employer/pages/NotFound";
import Placeholder from "./features/employer/pages/Placeholder";
import PostJob from "./features/employer/pages/PostJob";
import SavedCandidates from "./features/employer/pages/SavedCandidates";
import Settings from "./features/employer/pages/Settings";
import PostDetail from "./features/seeker/pages/postDetail";
import SeekerHomePage from "./features/seeker/pages/seekerHomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="employer" element={<Index />} />
        <Route path="/employer/post-job" element={<PostJob />} />
        <Route path="/employer/applications" element={<Applications />} />
        <Route path="/employer/profile" element={<Placeholder title="Employer Profile" />} />
        <Route path="/employer/my-jobs" element={<MyJobs />} />
        <Route path="/employer/saved-candidates" element={<SavedCandidates />} />
        <Route path="/employer/companies" element={<Placeholder title="All Companies" />} />
        <Route path="/employer/settings" element={<Settings />} />

        <Route path="/" element={<SeekerHomePage />} />
        <Route path="/post-detail/:jobId" element={<PostDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
