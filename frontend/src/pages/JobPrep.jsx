import React, { useState, useEffect } from "react";
import ProfileBanner from "../components/ProfileBanner";
import ReadinessChecklist from "../components/ReadinessChecklist";
import RoadmapTimeline from "../components/RoadmapTimeline";
import CompanyTracker from "../components/CompanyTracker";

export default function JobPrep() {
  const [user, setUser] = useState(null);
  const [targetCompanyType, setTargetCompanyType] = useState("Startup");
  const [readinessChecked, setReadinessChecked] = useState(() => {
    const saved = localStorage.getItem('readinessChecked');
    return saved ? JSON.parse(saved) : {};
  });
  const [timeline, setTimeline] = useState([]);

  // NEW: Dynamic checklist sections based on year
  const getChecklistSectionsForYear = (year) => {
    switch (year) {
      case 1:
        return [
          {
            title: "Explore Computer Science",
            items: [
              "Attend CS club meetings",
              "Complete introductory programming course",
              "Explore different CS fields (AI, Web, etc.)"
            ]
          },
          {
            title: "Skill Building",
            items: [
              "Learn Git & GitHub basics",
              "Start a small personal project",
              "Participate in a hackathon (optional)"
            ]
          }
        ];
      case 2:
        return [
          {
            title: "Projects & DSA",
            items: [
              "Build 1-2 personal projects",
              "Start DSA practice (arrays, strings, linked lists)",
              "Contribute to open source (optional)"
            ]
          },
          {
            title: "Internships & Networking",
            items: [
              "Apply for summer internships",
              "Connect with seniors on LinkedIn",
              "Update LinkedIn profile"
            ]
          }
        ];
      case 3:
        return [
          {
            title: "Advanced Projects & Internships",
            items: [
              "Complete 2+ advanced projects",
              "Do an internship",
              "Participate in coding contests"
            ]
          },
          {
            title: "Interview Prep",
            items: [
              "Practice DSA (trees, graphs, DP)",
              "Mock interviews",
              "Resume review"
            ]
          }
        ];
      case 4:
        return [
          {
            title: "Job Applications",
            items: [
              "Apply to target companies",
              "Refine resume and cover letter",
              "Prepare for HR and technical interviews"
            ]
          },
          {
            title: "Final Prep",
            items: [
              "Give mock interviews",
              "Negotiate offers (if any)",
              "Plan post-graduation steps"
            ]
          }
        ];
      default:
        return [
          {
            title: "General Readiness",
            items: [
              "Update resume",
              "Build a project",
              "Network with peers"
            ]
          }
        ];
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        if (data.user?.targetCompanyType) setTargetCompanyType(data.user.targetCompanyType);
      });
    generateTimeline();
  }, []);

  useEffect(() => {
    localStorage.setItem('readinessChecked', JSON.stringify(readinessChecked));
  }, [readinessChecked]);

  // Generate a 12-month timeline with example tasks (can be customized per user/year/goal)
  const generateTimeline = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const roadmap = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      const monthName = date.toLocaleString('default', { month: 'long' });
      roadmap.push({
        month: monthName,
        year: date.getFullYear(),
        tasks: getTasksForMonth(i, monthName)
      });
    }
    setTimeline(roadmap);
  };

  // Example tasks per month (customize as needed)
  const getTasksForMonth = (monthIndex, monthName) => {
    const tasks = {
      0: [
        { title: "Resume Review & Update" },
        { title: "LinkedIn Profile Optimization" },
        { title: "Research Target Companies" }
      ],
      1: [
        { title: "Start LeetCode Practice" },
        { title: "System Design Preparation" },
        { title: "Network with Alumni" }
      ],
      2: [
        { title: "Apply for Summer Internships" },
        { title: "Mock Interviews" },
        { title: "Build Portfolio Projects" }
      ],
      3: [
        { title: "Interview Preparation" },
        { title: "Technical Skills Enhancement" },
        { title: "Behavioral Interview Practice" }
      ],
      4: [
        { title: "Final Round Interviews" },
        { title: "Negotiation Skills" },
        { title: "Offer Evaluation" }
      ],
      5: [
        { title: "Accept Offer" },
        { title: "Onboarding Preparation" },
        { title: "Relocation Planning" }
      ]
    };
    return tasks[monthIndex] || [
      { title: "Continuous Learning" },
      { title: "Skill Enhancement" }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Job Preparation Hub</h1>
        <ProfileBanner
          user={user}
          targetCompanyType={targetCompanyType}
          setTargetCompanyType={setTargetCompanyType}
        />
        {/* Pass dynamic sections to ReadinessChecklist */}
        <ReadinessChecklist
          sections={getChecklistSectionsForYear(user?.year)}
          checked={readinessChecked}
          setChecked={setReadinessChecked}
        />
        <RoadmapTimeline timeline={timeline} />
        <CompanyTracker user={user} />
      </div>
    </div>
  );
}