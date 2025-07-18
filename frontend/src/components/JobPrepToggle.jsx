import React, { useState } from "react";
import API_BASE_URL from "../utils/api";

export default function JobPrepToggle({ selectedCompany, setLearningPath }) {
  const [jobPrep, setJobPrep] = useState(false);

  const handleToggle = async () => {
    const token = localStorage.getItem("token");
    if (!jobPrep && selectedCompany) {
      // Fetch company-specific path
      const res = await fetch(`${API_BASE_URL}/api/learning-path/company/${selectedCompany}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLearningPath(data.learningPath);
    } else {
      // Fetch default path
      const res = await fetch(`${API_BASE_URL}/api/learning-path`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLearningPath(data.learningPath);
    }
    setJobPrep(!jobPrep);
  };

  return (
    <div className="flex items-center gap-2 my-4">
      <label className="font-semibold">Job Prep Mode</label>
      <input type="checkbox" checked={jobPrep} onChange={handleToggle} />
      {jobPrep && <span className="text-green-600">FAANG Mode On</span>}
    </div>
  );
}