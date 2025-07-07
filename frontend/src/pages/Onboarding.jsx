import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [background, setBackground] = useState("");
  const [goals, setGoals] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
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
      body: JSON.stringify({ background, goals, selectedCompany }),
    });
    if (res.ok) {
      navigate("/dashboard");
    } else {
      alert("Failed to save onboarding info");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Tell us about yourself</h2>
        <label className="block mb-2">Background</label>
        <select className="input w-full mb-4" value={background} onChange={e => setBackground(e.target.value)} required>
          <option value="">Select...</option>
          <option value="student">Student</option>
          <option value="career-switcher">Career Switcher</option>
          <option value="fresher">Fresher</option>
        </select>
        <label className="block mb-2">Your Goal</label>
        <input className="input w-full mb-4" type="text" placeholder="e.g. Web Developer, ML Engineer" value={goals} onChange={e => setGoals(e.target.value)} required />
        <label className="block mb-2">Dream Company (optional)</label>
        <input className="input w-full mb-4" type="text" placeholder="e.g. Google, Meta, Amazon" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} />
        <button className="btn w-full mt-4" type="submit">Continue</button>
      </form>
    </div>
  );
}