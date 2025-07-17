import React, { useState } from "react";
import { FaPlus, FaTrash, FaFilePdf, FaBuilding, FaCheckCircle, FaStickyNote, FaClipboardList } from "react-icons/fa";

const defaultCompanies = [
  "Amazon", "Google", "Meta", "Microsoft", "Apple", "Netflix", "Startup"
];

const defaultSteps = {
  "Amazon": [
    "Resume uploaded on Amazon careers",
    "Applied for SDE intern",
    "Practiced Amazon past interview questions",
    "Watched Amazon interview experience videos",
    "Contacted HR on LinkedIn"
  ],
  "Startup": [
    "Built startup-relevant project",
    "Made Notion resume",
    "Applied on YCombinator + AngelList",
    "Cold-emailed 10+ founders"
  ]
};

export default function CompanyTracker() {
  const [companies, setCompanies] = useState(["Amazon"]);
  const [newCompany, setNewCompany] = useState("");
  const [trackers, setTrackers] = useState({
    "Amazon": {
      steps: defaultSteps["Amazon"].map((step) => ({ text: step, done: false })),
      notes: "",
      rounds: "",
      status: "Not Started"
    }
  });

  const addCompany = () => {
    if (!newCompany.trim() || companies.includes(newCompany)) return;
    setCompanies([...companies, newCompany]);
    setTrackers({
      ...trackers,
      [newCompany]: {
        steps: defaultSteps[newCompany]?.map((step) => ({ text: step, done: false })) || [
          { text: "Resume uploaded", done: false },
          { text: "Applied for role", done: false }
        ],
        notes: "",
        rounds: "",
        status: "Not Started"
      }
    });
    setNewCompany("");
  };

  const removeCompany = (company) => {
    setCompanies(companies.filter((c) => c !== company));
    const t = { ...trackers };
    delete t[company];
    setTrackers(t);
  };

  const handleStepToggle = (company, idx) => {
    setTrackers((prev) => ({
      ...prev,
      [company]: {
        ...prev[company],
        steps: prev[company].steps.map((s, i) => i === idx ? { ...s, done: !s.done } : s)
      }
    }));
  };

  const handleFieldChange = (company, field, value) => {
    setTrackers((prev) => ({
      ...prev,
      [company]: {
        ...prev[company],
        [field]: value
      }
    }));
  };

  // PDF export placeholder (implement with jsPDF or react-to-print in future)
  const exportPDF = (company) => {
    alert(`Exporting tracker for ${company} as PDF (feature coming soon!)`);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-700 shadow-lg">
      <div className="flex items-center mb-4">
        <FaClipboardList className="text-pink-400 text-2xl mr-2" />
        <h2 className="text-2xl font-bold text-white">Company-Specific Tracker</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {defaultCompanies.map((company) => (
          <button
            key={company}
            onClick={() => {
              if (!companies.includes(company)) {
                setCompanies([...companies, company]);
                setTrackers({
                  ...trackers,
                  [company]: {
                    steps: defaultSteps[company]?.map((step) => ({ text: step, done: false })) || [
                      { text: "Resume uploaded", done: false },
                      { text: "Applied for role", done: false }
                    ],
                    notes: "",
                    rounds: "",
                    status: "Not Started"
                  }
                });
              }
            }}
            className={`px-4 py-2 rounded-lg font-semibold text-md transition-all duration-300 border ${companies.includes(company) ? "bg-pink-700 text-white border-pink-400" : "bg-gray-800 text-pink-300 border-pink-700"}`}
          >
            <FaBuilding className="inline mr-2" />{company}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={newCompany}
          onChange={e => setNewCompany(e.target.value)}
          placeholder="Add company manually"
          className="bg-gray-800 text-white px-4 py-2 rounded border border-pink-400 flex-1"
        />
        <button
          onClick={addCompany}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {companies.map((company) => (
          <div key={company} className="bg-gray-800 rounded-lg p-5 border border-pink-700 shadow-md relative">
            <button
              onClick={() => removeCompany(company)}
              className="absolute top-3 right-3 text-pink-400 hover:text-red-400"
              title="Remove company"
            >
              <FaTrash />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <FaBuilding className="text-pink-300" />
              <span className="text-lg font-bold text-pink-200">{company}</span>
              <button
                onClick={() => exportPDF(company)}
                className="ml-auto text-pink-400 hover:text-pink-200"
                title="Export as PDF"
              >
                <FaFilePdf />
              </button>
            </div>
            <div className="mb-3">
              <span className="text-pink-400 font-semibold">Status: </span>
              <select
                value={trackers[company]?.status || "Not Started"}
                onChange={e => handleFieldChange(company, "status", e.target.value)}
                className="bg-gray-900 text-white px-2 py-1 rounded border border-pink-400"
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            <div className="mb-3">
              <span className="text-pink-400 font-semibold">Interview Rounds: </span>
              <input
                type="text"
                value={trackers[company]?.rounds || ""}
                onChange={e => handleFieldChange(company, "rounds", e.target.value)}
                placeholder="e.g. OA, Tech, HR"
                className="bg-gray-900 text-white px-2 py-1 rounded border border-pink-400 w-40"
              />
            </div>
            <div className="mb-3">
              <span className="text-pink-400 font-semibold">Notes: </span>
              <textarea
                value={trackers[company]?.notes || ""}
                onChange={e => handleFieldChange(company, "notes", e.target.value)}
                placeholder="Add notes, links, dates, etc."
                className="bg-gray-900 text-white px-2 py-1 rounded border border-pink-400 w-full min-h-[48px]"
              />
            </div>
            <div className="mb-2">
              <span className="text-pink-400 font-semibold">Checklist:</span>
              <ul className="mt-2 space-y-2">
                {trackers[company]?.steps.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={step.done}
                      onChange={() => handleStepToggle(company, idx)}
                      className="accent-pink-500 w-5 h-5"
                    />
                    <span className={step.done ? "line-through text-green-400" : "text-white"}>{step.text}</span>
                    {step.done && <FaCheckCircle className="text-green-400 ml-1" />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 