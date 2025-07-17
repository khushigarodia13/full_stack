import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("https://eduwise-backend-itjy.onrender.com", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg flex items-center justify-between px-8 py-4">
      <Link to="/" className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
        EduWise
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/resume" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all duration-300">
          View Resume
        </Link>
        <Link to="/dashboard" className="text-white hover:text-indigo-300 transition-colors duration-300 font-medium">Dashboard</Link>
        <Link to="/roadmap" className="text-white hover:text-indigo-300 transition-colors duration-300 font-medium">Roadmap</Link>
        <Link to="/job-prep" className="text-white hover:text-indigo-300 transition-colors duration-300 font-medium">Job Prep</Link>
        <Link to="/profile" className="text-white hover:text-indigo-300 transition-colors duration-300 font-medium">Profile</Link>
        
        {/* User greeting and logout */}
        <div className="flex items-center gap-4 ml-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-white font-semibold">Hi {user.name || 'Student'}!</span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}