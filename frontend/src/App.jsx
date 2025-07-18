import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import { Toaster } from "react-hot-toast";
import JobPrep from "./pages/JobPrep";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Timetable from "./pages/Timetable";
import TeamFinder from "./pages/TeamFinder";

  import { ToastContainer } from "react-toastify";
  // ...
  <ToastContainer />
// ...other imports

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Toaster />
     <ToastContainer />
      <Routes>
         <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/job-prep" element={<JobPrep />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/team-finder" element={<TeamFinder />} />
        {/* ...other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
