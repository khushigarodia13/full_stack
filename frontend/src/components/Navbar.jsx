import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-gray-800 shadow flex items-center justify-between px-8 py-4">
      <Link to="/" className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">
        EduWise
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/resume" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
          View Resume
        </Link>
        <Link to="/dashboard" className="text-gray-200 hover:text-indigo-400 transition">Dashboard</Link>
        <Link to="/roadmap" className="text-gray-200 hover:text-indigo-400 transition">Roadmap</Link>
        <Link to="/job-prep" className="text-gray-200 hover:text-indigo-400 transition">Job Prep</Link>
        <Link to="/profile" className="text-gray-200 hover:text-indigo-400 transition">Profile</Link>
        {user && user.githubId && (
          <a
            href={`https://github.com/${user.githubId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
            title="View GitHub Profile"
          >
            <FaGithub className="text-2xl text-gray-300 hover:text-white transition" />
          </a>
        )}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="text-red-400 hover:text-red-600 font-semibold ml-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}