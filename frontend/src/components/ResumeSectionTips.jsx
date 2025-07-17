import React, { useState } from 'react';
import { FaLightbulb, FaCopy, FaCheck } from 'react-icons/fa';

export default function ResumeSectionTips({ userProfile, userGoals }) {
  const [copiedTip, setCopiedTip] = useState(null);

  const getResumeSuggestions = () => {
    const suggestions = {
      projects: [],
      skills: [],
      experience: [],
      education: []
    };

    // Project suggestions based on user's background
    if (userProfile?.background?.toLowerCase().includes('web')) {
      suggestions.projects.push({
        title: "Full-Stack Web Application",
        description: "Developed a responsive web app using React/Node.js with user authentication and database integration",
        impact: "Improved user engagement by 40% and reduced load times by 60%"
      });
    }

    if (userProfile?.background?.toLowerCase().includes('ml') || userProfile?.background?.toLowerCase().includes('ai')) {
      suggestions.projects.push({
        title: "Machine Learning Model",
        description: "Built and deployed a predictive model using Python, achieving 85% accuracy",
        impact: "Reduced processing time by 70% and improved prediction accuracy by 15%"
      });
    }

    // Skills suggestions based on year and goals
    const year = userProfile?.year || 2;
    if (year <= 2) {
      suggestions.skills.push("Programming Fundamentals", "Data Structures", "Basic Web Technologies");
    } else {
      suggestions.skills.push("Advanced Algorithms", "System Design", "Cloud Technologies");
    }

    // Experience suggestions
    if (userProfile?.goals?.toLowerCase().includes('internship')) {
      suggestions.experience.push({
        title: "Open Source Contributions",
        description: "Contributed to 3+ open source projects, fixing bugs and adding features",
        impact: "Gained real-world development experience and built a strong GitHub profile"
      });
    }

    return suggestions;
  };

  const copyToClipboard = (text, tipId) => {
    navigator.clipboard.writeText(text);
    setCopiedTip(tipId);
    setTimeout(() => setCopiedTip(null), 2000);
  };

  const suggestions = getResumeSuggestions();

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center mb-4">
        <FaLightbulb className="text-yellow-400 mr-2" />
        <h2 className="text-xl font-bold text-white">Resume Suggestions</h2>
      </div>

      <div className="space-y-4">
        {/* Projects Section */}
        {suggestions.projects.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">💼 Project Ideas</h3>
            {suggestions.projects.map((project, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-700 rounded border-l-4 border-indigo-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{project.title}</h4>
                    <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                    <p className="text-indigo-400 text-sm mt-1 italic">"{project.impact}"</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${project.title}: ${project.description}`, `project-${index}`)}
                    className="ml-2 p-2 text-gray-400 hover:text-white transition"
                  >
                    {copiedTip === `project-${index}` ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {suggestions.skills.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">🛠️ Skills to Highlight</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {suggestions.experience.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">📈 Experience Boosters</h3>
            {suggestions.experience.map((exp, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-700 rounded border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{exp.title}</h4>
                    <p className="text-gray-300 text-sm mt-1">{exp.description}</p>
                    <p className="text-green-400 text-sm mt-1 italic">"{exp.impact}"</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${exp.title}: ${exp.description}`, `exp-${index}`)}
                    className="ml-2 p-2 text-gray-400 hover:text-white transition"
                  >
                    {copiedTip === `exp-${index}` ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Tips */}
        <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 border border-blue-700">
          <h3 className="text-lg font-semibold text-white mb-2">💡 Quick Tips</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Use action verbs: "Developed", "Implemented", "Optimized"</li>
            <li>• Quantify achievements: "Improved performance by 40%"</li>
            <li>• Keep descriptions concise but impactful</li>
            <li>• Tailor resume to each job application</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 