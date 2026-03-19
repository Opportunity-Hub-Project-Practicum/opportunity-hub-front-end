import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SeekerHomePage from "./Features/seeker/pages/seekerHomePage";
import PostDetail from "./Features/seeker/pages/postDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SeekerHomePage />} />
        <Route path="/post-detail/:jobId" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
