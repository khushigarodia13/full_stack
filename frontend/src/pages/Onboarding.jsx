import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [background, setBackground] = useState("");
  const [goals, setGoals] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState(2);
  const [skills, setSkills] = useState([{ name: "JavaScript", level: "Beginner" }]);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [location, setLocation] = useState("India");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/user/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        background, 
        goals, 
        selectedCompany,
        college,
        year,
        skills,
        github,
        linkedin,
        location
      }),
    });
    if (res.ok) {
      navigate("/dashboard");
    } else {
      alert("Failed to save onboarding info");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Complete Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Background</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  value={background} 
                  onChange={e => setBackground(e.target.value)} 
                  required
                >
                  <option value="">Select...</option>
                  <option value="student">Student</option>
                  <option value="career-switcher">Career Switcher</option>
                  <option value="fresher">Fresher</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">College/University</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  type="text" 
                  placeholder="e.g. NIT College" 
                  value={college} 
                  onChange={e => setCollege(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Year of Study</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  value={year} 
                  onChange={e => setYear(parseInt(e.target.value))} 
                  required
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>Final Year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Location</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  type="text" 
                  placeholder="e.g. Mumbai, India" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Your Goal</label>
              <input 
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                type="text" 
                placeholder="e.g. Web Developer, ML Engineer" 
                value={goals} 
                onChange={e => setGoals(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Dream Company (optional)</label>
              <input 
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                type="text" 
                placeholder="e.g. Google, Meta, Amazon" 
                value={selectedCompany} 
                onChange={e => setSelectedCompany(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">GitHub Profile (optional)</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  type="url" 
                  placeholder="https://github.com/username" 
                  value={github} 
                  onChange={e => setGithub(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">LinkedIn Profile (optional)</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  type="url" 
                  placeholder="https://linkedin.com/in/username" 
                  value={linkedin} 
                  onChange={e => setLinkedin(e.target.value)} 
                />
              </div>
            </div>

            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105" 
              type="submit"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}