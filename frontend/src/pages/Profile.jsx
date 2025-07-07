import React, { useState, useEffect } from "react";
import { FaTrophy, FaGithub, FaUsers, FaUserFriends, FaStar, FaChartLine, FaSearch } from "react-icons/fa";

const SECTIONS = [
  { key: "interests", label: "Interests", icon: <FaStar /> },
  { key: "progress", label: "Progress", icon: <FaChartLine /> },
  { key: "badges", label: "Badges", icon: <FaTrophy /> },
  { key: "mentors", label: "Mentors", icon: <FaUserFriends /> },
  { key: "team", label: "Find Team", icon: <FaUsers /> },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("interests");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  if (!user) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 border-r border-slate-800">
        <h2 className="text-2xl font-bold mb-8">Profile</h2>
        {SECTIONS.map(section => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`flex items-center gap-3 px-4 py-2 mb-2 rounded transition ${
              activeSection === section.key
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800 text-gray-300"
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 text-white">
        {activeSection === "interests" && <InterestsSection user={user} />}
        {activeSection === "progress" && <ProgressSection user={user} />}
        {activeSection === "badges" && <BadgesSection user={user} />}
        {activeSection === "mentors" && <MentorsSection />}
        {activeSection === "team" && <TeamSection />}
      </main>
    </div>
  );
}
function InterestsSection({ user }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Your Interests</h3>
      <div className="bg-slate-800 rounded p-4">
        {user.interests && user.interests.length > 0
          ? user.interests.map((interest, idx) => (
              <span key={idx} className="inline-block bg-indigo-700 text-white px-3 py-1 rounded mr-2 mb-2">
                {interest}
              </span>
            ))
          : <span className="text-gray-400">No interests set yet.</span>
        }
      </div>
    </div>
  );
}
function ProgressSection({ user }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Your Progress</h3>
      <div className="bg-emerald-900 rounded p-4">
        <div>Modules completed: <span className="font-bold">{user.progress?.length || 0}</span></div>
        {/* Add more progress details as needed */}
      </div>
    </div>
  );
}
function BadgesSection({ user }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Badges Earned</h3>
      <div className="flex gap-4 flex-wrap">
        {user.badges && user.badges.includes("5_modules") && (
          <div className="bg-emerald-800 text-emerald-200 px-4 py-2 rounded flex items-center gap-2">
            <FaTrophy /> 5 Modules Completed
          </div>
        )}
        {user.badges && user.badges.includes("github_synced") && (
          <div className="bg-indigo-800 text-indigo-200 px-4 py-2 rounded flex items-center gap-2">
            <FaGithub /> GitHub Synced
          </div>
        )}
        {/* Add more badges as needed */}
        {(!user.badges || user.badges.length === 0) && (
          <span className="text-gray-400">No badges earned yet.</span>
        )}
      </div>
    </div>
  );
}
function MentorsSection() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/mentors", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMentors(data.mentors));
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Find a Mentor</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {mentors.length === 0 && <div className="text-gray-400">No mentors found.</div>}
        {mentors.map((mentor, idx) => (
          <div key={mentor._id} className="bg-violet-900 rounded p-4">
            <div className="font-bold">{mentor.name}</div>
            <div className="text-gray-300">{mentor.expertise || "No expertise listed"}</div>
            <button className="mt-2 bg-indigo-600 px-3 py-1 rounded text-white">Message</button>
          </div>
        ))}
      </div>
    </div>
  );
}
function TeamSection() {
  // You can fetch users from your backend or use a static list for now
  const people = [
    { name: "Charlie", lookingFor: "Web Dev Team" },
    { name: "Dana", lookingFor: "AI Project" },
  ];
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Find People to Team Up With</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {people.map((person, idx) => (
          <div key={idx} className="bg-amber-900 rounded p-4">
            <div className="font-bold">{person.name}</div>
            <div className="text-gray-300">{person.lookingFor}</div>
            <button className="mt-2 bg-emerald-600 px-3 py-1 rounded text-white">Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}