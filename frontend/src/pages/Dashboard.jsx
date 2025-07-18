import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTrophy, FaUser, FaCalendar, FaBullseye, FaChartLine } from "react-icons/fa";
import ProductivityScoreCard from "../components/ProductivityScoreCard";
import ResumeSectionTips from "../components/ResumeSectionTips";
import API_BASE_URL from "../utils/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState([]);
  const [productivityData, setProductivityData] = useState({
    dailyTaskCompletion: 0,
    resumeActions: 0,
    jobPrepProgress: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch(`${API_BASE_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(err => console.error('Error fetching user data:', err));
      fetch(`${API_BASE_URL}/api/learning-path`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setLearningPath(data.learningPath))
      .catch(err => console.error('Error fetching learning path:', err));

    fetch(`${API_BASE_URL}/api/user/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProgress(data.progress))
      .catch(err => console.error('Error fetching progress:', err));

    // Fetch productivity data
    fetch(`${API_BASE_URL}/api/productivity/today`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.dailyLog) {
          const log = data.dailyLog;
          setProductivityData({
            dailyTaskCompletion: log.totalTasks > 0 ? (log.completedTasks.length / log.totalTasks) * 100 : 0,
            resumeActions: Array.isArray(log.resumeActions) ? log.resumeActions.length : 0,
            jobPrepProgress: log.jobPrepProgress
          });
        }
      })
      .catch(err => {
        console.error('Error fetching productivity data:', err);
        // Set default values if API fails
        setProductivityData({
          dailyTaskCompletion: 0,
          resumeActions: 0,
          jobPrepProgress: 0
        });
      });
  }, [navigate]);

  if (!user || !learningPath) return <div className="text-white p-8">Loading...</div>;

  const completed = progress.filter(p => p.status === "completed").length;
  const total = learningPath.nodes.length;
  const percent = Math.round((completed / total) * 100);
  const nextNode = learningPath.nodes.find(
    node => !progress.some(p => p.nodeId === node.title && p.status === "completed")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}!</h1>
          <div className="mb-4">
            <div className="text-lg text-gray-300">Progress: {percent}%</div>
            <div className="w-full bg-gray-700 rounded h-4 overflow-hidden my-2">
              <div
                className="bg-indigo-500 h-4 rounded transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          {progress.length >= 5 && (
            <div className="bg-green-900 text-green-300 px-4 py-2 rounded my-2 inline-flex items-center">
              <FaTrophy className="mr-2" /> 🏅 Achievement: 5 Modules Completed!
            </div>
          )}
          <div className="mb-4">
            <div className="text-xl text-white">Next Module: {nextNode ? nextNode.title : "All done!"}</div>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow mt-2 transition"
              onClick={() => navigate("/roadmap")}
            >
              View Roadmap
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Productivity Score Card */}
          <ProductivityScoreCard userData={productivityData} userYear={user?.year} />
          
          {/* Resume Suggestions */}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button 
            onClick={() => navigate("/timetable")}
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-lg transition flex flex-col items-center"
          >
            <FaCalendar className="text-2xl mb-2" />
            <span className="font-semibold">Daily Schedule</span>
            <span className="text-sm opacity-80">Track your tasks</span>
          </button>
          
          <button 
            onClick={() => navigate("/resume")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-lg transition flex flex-col items-center"
          >
            <FaChartLine className="text-2xl mb-2" />
            <span className="font-semibold">Build Resume</span>
            <span className="text-sm opacity-80">AI-assisted tips</span>
          </button>
          
          <button 
            onClick={() => navigate("/job-prep")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white p-6 rounded-xl shadow-lg transition flex flex-col items-center"
          >
            <FaBullseye className="text-2xl mb-2" />
            <span className="font-semibold">Job Prep</span>
            <span className="text-sm opacity-80">Career roadmap</span>
          </button>
          
          <button 
            onClick={() => navigate("/team-finder")}
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-lg transition flex flex-col items-center"
          >
            <FaTrophy className="text-2xl mb-2" />
            <span className="font-semibold">Find Team</span>
            <span className="text-sm opacity-80">Hackathon ready</span>
          </button>
        </div>

        {/* Profile Summary */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Profile Summary</h2>
            <button 
              onClick={() => navigate("/profile")}
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
            >
              Edit Profile →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <FaUser className="text-blue-400" />
              <div>
                <span className="text-gray-400 text-sm">Year</span>
                <div className="text-white font-semibold">{user?.year || 'Not Set'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaBullseye className="text-green-400" />
              <div>
                <span className="text-gray-400 text-sm">Goals</span>
                <div className="text-white font-semibold">{user?.goals || 'Not Set'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaChartLine className="text-purple-400" />
              <div>
                <span className="text-gray-400 text-sm">Background</span>
                <div className="text-white font-semibold">{user?.background || 'Not Set'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}