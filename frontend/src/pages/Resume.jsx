import React, { useEffect, useState } from "react";
import  { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaGithub } from "react-icons/fa";
export default function Resume() {
  const [resume, setResume] = useState(null);
  const componentRef = useRef();
  const [template, setTemplate] = useState("modern");
  const [showEditSummary, setShowEditSummary] = useState(false);
const [summary, setSummary] = useState("");
useEffect(() => {
  if (resume && resume.summary) setSummary(resume.summary);
}, [resume]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/resume", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setResume(data.resume);
     setSummary(data.resume.summary || "");
      });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Resume",
  });

  if (!resume) return <div>Loading...</div>;

  
  return (
    <div className="max-w-2xl mx-auto p-8">
        <div className="flex gap-4 mb-6">
  <button onClick={() => setTemplate("modern")} className={`px-4 py-2 rounded ${template === "modern" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-200"}`}>Modern</button>
  <button onClick={() => setTemplate("classic")} className={`px-4 py-2 rounded ${template === "classic" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-200"}`}>Classic</button>
  <button onClick={() => setTemplate("creative")} className={`px-4 py-2 rounded ${template === "creative" ? "bg-amber-600 text-white" : "bg-gray-700 text-gray-200"}`}>Creative</button>
</div>
      {/* Step 2: Print Button */}
      <button onClick={handlePrint} className="btn bg-green-600 text-white mb-4">
        Download as PDF
      </button>

      {/* Step 3: Wrap printable content with ref */}
      <div ref={componentRef} className="bg-white p-6 rounded shadow">
        <h2 className="text-3xl font-bold mb-4">{resume.name}</h2>
        <div className="mb-2 text-gray-600">{resume.email}</div>

        {resume.summary && (
          <div className="mb-4 italic text-gray-700">{resume.summary}</div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-2">Skills</h3>
        <ul className="list-disc ml-6">
          {resume.skills.map(skill => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        {resume.githubProjects && resume.githubProjects.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-2">GitHub Projects</h3>
            <ul className="list-disc ml-6">
              {resume.githubProjects.map(proj => (
                <li key={proj.url}>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {proj.name}
                  </a>
                  {proj.description && (
                    <span className="ml-2 text-gray-600">- {proj.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      <div className="bg-slate-900 rounded-xl p-6 mb-6">
  <h3 className="text-lg font-bold text-indigo-300 mb-2">Project Ideas</h3>
  <ul>
    <li>
      <a
        href="https://github.com/facebook/react"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        Contribute to React
      </a>
    </li>
    <li>
      <a
        href="https://github.com/ossu/computer-science"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        Open Source CS Curriculum
      </a>
    </li>
    <li>
      <a
        href="https://github.com/firstcontributions/first-contributions"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        First Contributions (Beginner Friendly)
      </a>
    </li>
  </ul>
</div>
        </div>
        </div>
    );
    }