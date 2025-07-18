import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaDownload, FaEdit, FaEye, FaPlus, FaTrash, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from "react-icons/fa";
import API_BASE_URL from "../utils/api";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const componentRef = useRef();
  const [template, setTemplate] = useState("modern");
  const [showEditSummary, setShowEditSummary] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (resume && resume.summary) {
      setSummary(resume.summary);
    }
  }, [resume]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No auth token found. User not logged in.");
      return;
    }

    fetch(`${API_BASE_URL}/api/user/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch resume: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched resume data:', data);
        setResume(data.resume);
        setSummary(data.resume.summary || "");
      })
      .catch(err => {
        console.error("Error fetching resume:", err.message);
      });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Resume",
  });

  if (!resume) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    </div>
  );

  // Modern Resume Template
  const ModernResume = () => (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">{resume.name || "Your Name"}</h1>
        <p className="text-xl text-gray-600 mb-4">{resume.title || "Software Engineer"}</p>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-blue-600" />
            <span>{resume.email || "email@example.com"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-blue-600" />
            <span>{resume.phone || "+91 98765 43210"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" />
            <span>{resume.location || "Mumbai, India"}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Work Experience</h2>
          {resume.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
                <span className="text-gray-600 text-sm">{exp.duration}</span>
              </div>
              <p className="text-blue-600 font-medium mb-2">{exp.company}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <span className="text-gray-600 text-sm">{edu.year}</span>
              </div>
              <p className="text-blue-600 font-medium">{edu.institution}</p>
              <p className="text-gray-700">CGPA: {edu.gpa}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.githubProjects && resume.githubProjects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Projects</h2>
          {resume.githubProjects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FaGithub className="text-gray-600" />
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {project.name}
                </a>
              </div>
              {project.description && (
                <p className="text-gray-700 ml-6">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Certifications</h2>
          <div className="space-y-2">
            {resume.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{cert.name}</span>
                <span className="text-gray-600 text-sm">{cert.issuer}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Classic Resume Template
  const ClassicResume = () => (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{resume.name || "Your Name"}</h1>
        <p className="text-xl text-gray-600 mb-4">{resume.title || "Software Engineer"}</p>
        
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <span>{resume.email || "email@example.com"}</span>
          <span>•</span>
          <span>{resume.phone || "+91 98765 43210"}</span>
          <span>•</span>
          <span>{resume.location || "Mumbai, India"}</span>
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">SUMMARY</h2>
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">SKILLS</h2>
          <div className="grid grid-cols-2 gap-2">
            {resume.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">EXPERIENCE</h2>
          {resume.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
                <span className="text-gray-600 text-sm">{exp.duration}</span>
              </div>
              <p className="text-gray-600 font-medium mb-2">{exp.company}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">EDUCATION</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <span className="text-gray-600 text-sm">{edu.year}</span>
              </div>
              <p className="text-gray-600 font-medium">{edu.institution}</p>
              <p className="text-gray-700">CGPA: {edu.gpa}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.githubProjects && resume.githubProjects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">PROJECTS</h2>
          {resume.githubProjects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FaGithub className="text-gray-600" />
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-600 font-semibold"
                >
                  {project.name}
                </a>
              </div>
              {project.description && (
                <p className="text-gray-700 ml-6">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
            <div className="flex space-x-3">
              <button onClick={handlePrint} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2">
                <FaDownload />
                Download PDF
              </button>
            </div>
          </div>
          
          {/* Template Selection */}
          <div className="flex space-x-4">
            <button 
              onClick={() => setTemplate("modern")} 
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                template === "modern" 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Modern
            </button>
            <button 
              onClick={() => setTemplate("classic")} 
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                template === "classic" 
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Classic
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Resume Preview</h2>
            <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2">
              <FaEdit />
              Edit Resume
            </button>
          </div>

          <div ref={componentRef} className="bg-white rounded-lg shadow-xl overflow-hidden">
            {template === "modern" ? <ModernResume /> : <ClassicResume />}
          </div>
        </div>

        {/* Resume Tips Section */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Resume Tips & Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                💡 Quick Tips
              </h3>
              <ul className="text-gray-300 text-sm space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>Use action verbs: "Developed", "Implemented", "Optimized"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>Quantify achievements: "Improved performance by 40%"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>Keep descriptions concise but impactful</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>Tailor resume to each job application</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                🚀 Project Ideas
              </h3>
              <ul className="text-gray-300 text-sm space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <a href="https://github.com/facebook/react" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Contribute to React</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <a href="https://github.com/ossu/computer-science" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Open Source CS Curriculum</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <a href="https://github.com/firstcontributions/first-contributions" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">First Contributions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
