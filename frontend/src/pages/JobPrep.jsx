import React, { useState } from "react";

export default function JobPrep() {
  const [learningPath, setLearningPath] = useState(null);
  const [jobPrep, setJobPrep] = useState(false);

  // TODO: Replace with actual user's selected company if available
  const [selectedCompany, setSelectedCompany] = useState("Google");
 // Or get from user context/state

  const handleToggle = async () => {
    setJobPrep(!jobPrep);
    const token = localStorage.getItem("token");
    let url = "http://localhost:5000/api/learning-path";
    if (!jobPrep && selectedCompany) {
      url = `http://localhost:5000/api/learning-path/company/${selectedCompany}`;
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setLearningPath(data.learningPath);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Job Prep Mode</h2>
      <div className="flex gap-4 mb-6">
  {["Google", "Meta", "Amazon", "Microsoft"].map(company => (
    <button
      key={company}
      onClick={() => setSelectedCompany(company)}
      className={`px-4 py-2 rounded ${selectedCompany === company ? "bg-amber-600 text-white" : "bg-gray-700 text-gray-200"}`}
    >
      {company}
    </button>
  ))}
</div>
      <div className="flex items-center gap-2 my-4">
        <label className="font-semibold">Job Prep Mode</label>
        <input type="checkbox" checked={jobPrep} onChange={handleToggle} />
        {jobPrep && <span className="text-green-600">FAANG Mode On</span>}
      </div>
      {learningPath && (
        <div>
          <h3 className="text-xl font-bold mb-2">{learningPath.name}</h3>
          <ul>
            {learningPath.nodes.map(node => (
              <li
                key={node.title}
                className={`p-2 my-2 rounded ${
                  node.description.includes("Special module")
                    ? "bg-yellow-100 border-l-4 border-yellow-500"
                    : "bg-white"
                }`}
              >
                <span className="font-semibold">{node.title}</span>
                {node.description.includes("Special module") && (
                  <span className="ml-2 text-xs text-yellow-700 font-semibold">Job Prep</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}