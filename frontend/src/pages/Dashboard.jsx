import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import GitHubSync from "../components/GitHubSync"; // or wherever your component is

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data.user));

    fetch("http://localhost:5000/api/learning-path", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setLearningPath(data.learningPath));

    fetch("http://localhost:5000/api/user/progress", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProgress(data.progress));
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
      <div className="max-w-3xl mx-auto">
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
          // ...inside your Dashboard's JSX:
<div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg mt-8">
  <h2 className="text-xl font-bold text-white mb-2 flex items-center">
    <FaGithub className="mr-2" /> GitHub Sync
  </h2>
{user && !user.githubId && (
  <a
    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2 my-4 transition"
    href="http://localhost:5000/api/auth/github"
  >
    <FaGithub className="text-xl" />
    Connect GitHub
  </a>
)}
  <GitHubSync />
</div>
<div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg mt-8">
  <h2 className="text-xl font-bold text-white mb-2">Job Tracker / FAANG Prep</h2>
  <p className="text-gray-300 mb-2">
    See your readiness for top tech companies. Complete all modules marked <span className="text-yellow-400 font-bold">Job Prep</span> for FAANG interviews!
  </p>
  <button
    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold shadow transition"
    onClick={() => navigate("/job-prep")}
  >
    View Job Prep Roadmap
  </button>
</div>
          <div>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold shadow transition"
              onClick={() => navigate("/job-prep")}
            >
              Job Prep Mode
            </button>
          </div>
        </div>
        {/* Add more dashboard cards or sections here */}
      </div>
    </div>
  );
}