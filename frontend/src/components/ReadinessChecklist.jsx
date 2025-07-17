import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaListAlt } from "react-icons/fa";

const checklistByCompanyType = {
  Startup: [
    {
      title: "Startup Readiness",
      items: [
        "Cold emailing founders",
        "Applying via AngelList/Internshala",
        "Building a portfolio website",
        "Participating in hackathons",
        "Networking on LinkedIn/Twitter",
        "Learning startup culture basics"
      ]
    }
  ],
  MNC: [
    {
      title: "MNC Readiness",
      items: [
        "Practicing DSA (300+ problems)",
        "Mastering core CS subjects (OS, DBMS, CN)",
        "Resume in standard MNC format",
        "Applying via company portals",
        "Attending campus placements",
        "Practicing aptitude tests"
      ]
    }
  ],
  Product: [
    {
      title: "Product Company Readiness",
      items: [
        "Building 2-3 strong projects",
        "Contributing to open source",
        "Practicing system design basics",
        "Resume with project highlights",
        "Applying via referrals/LinkedIn",
        "Practicing behavioral interviews"
      ]
    }
  ],
  Service: [
    {
      title: "Service Company Readiness",
      items: [
        "Practicing aptitude and reasoning",
        "Resume in standard format",
        "Applying via campus drives",
        "Learning basic coding rounds",
        "Preparing for HR interviews"
      ]
    }
  ],
  General: [
    {
      title: "Core CS Subjects",
      items: [
        "DSA till Trees",
        "DBMS basics",
        "CN protocols",
        "OS (Process Scheduling, Deadlocks)"
      ]
    },
    {
      title: "Programming & Projects",
      items: [
        "2-3 solid GitHub projects",
        "Contributed to Open Source (Optional)",
        "Used APIs / Auth in a project"
      ]
    },
    {
      title: "Internships & Hackathons",
      items: [
        "Done 1 internship",
        "Participated in 1+ hackathons",
        "Applied to 5+ internship portals"
      ]
    },
    {
      title: "Resume & Portfolio",
      items: [
        "Resume in PDF (professional)",
        "LinkedIn updated",
        "GitHub pinned projects"
      ]
    },
    {
      title: "Aptitude & Interview Prep",
      items: [
        "Solved 200+ DSA problems",
        "Practiced DBMS/CN/OS HRQs",
        "Given 2+ mock interviews"
      ]
    }
  ]
};

export default function ReadinessChecklist({ companyType = "General", checked, setChecked }) {
  const sections = checklistByCompanyType[companyType] || checklistByCompanyType["General"];
  const [open, setOpen] = useState(sections.map(() => true));

  // Calculate readiness score
  const total = sections.reduce((acc, sec) => acc + sec.items.length, 0);
  const completed = Object.values(checked || {}).filter(Boolean).length;
  const score = Math.round((completed / total) * 100);

  const handleCheck = (sectionIdx, itemIdx) => {
    setChecked(prev => ({ ...prev, [`${sectionIdx}-${itemIdx}`]: !prev?.[`${sectionIdx}-${itemIdx}`] }));
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-700 shadow-lg">
      <div className="flex items-center mb-4">
        <FaListAlt className="text-blue-400 text-2xl mr-2" />
        <h2 className="text-2xl font-bold text-white">Readiness Checklist</h2>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-green-400 font-semibold">{score}% Ready</span>
          <div className="w-40 h-3 bg-gray-800 rounded-full overflow-hidden border border-green-700">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-700"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
      {sections.map((section, i) => (
        <div key={section.title} className="mb-4">
          <button
            className="w-full flex items-center justify-between bg-gray-800 px-4 py-3 rounded-t-lg text-lg font-semibold text-blue-300 focus:outline-none"
            onClick={() => setOpen(prev => prev.map((v, idx) => idx === i ? !v : v))}
          >
            <span>{section.title}</span>
            {open[i] ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {open[i] && (
            <div className="bg-gray-800 border-t border-gray-700 rounded-b-lg px-4 py-2">
              {section.items.map((item, j) => (
                <label key={item} className="flex items-center gap-3 py-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!checked?.[`${i}-${j}`]}
                    onChange={() => handleCheck(i, j)}
                    className="accent-green-500 w-5 h-5"
                  />
                  <span className={checked?.[`${i}-${j}`] ? "line-through text-green-400" : ""}>{item}</span>
                  {checked?.[`${i}-${j}`] && <FaCheckCircle className="text-green-400 ml-1" />}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 