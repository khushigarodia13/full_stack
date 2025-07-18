import React, { useEffect, useState, useRef } from "react";
import { FaRocket, FaBrain, FaCode, FaDatabase, FaMobile, FaShieldAlt, FaCloud, FaPalette, FaGraduationCap, FaCheckCircle, FaPlay, FaArrowRight } from "react-icons/fa";
import API_BASE_URL from "../utils/api";

// ✅ Separate ResourceItem component
function ResourceItem({ resId }) {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/resource/${resId}`)
      .then(res => res.json())
      .then(data => setResource(data.resource));
  }, [resId]);

  if (!resource) return <li>Loading...</li>;

  return (
    <li>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline text-lg"
      >
        {resource.title}
      </a>{" "}
      <span className="text-gray-400">({resource.type})</span>
    </li>
  );
}

// ✅ Main Roadmap component
export default function Roadmap() {
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [user, setUser] = useState(null);
  const detailRefs = useRef([]); // For scrolling to detail sections

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch user data for year-based customization
    fetch(`${API_BASE_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data.user));

    fetch(`${API_BASE_URL}/api/learning-path`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setLearningPath(data.learningPath));

    fetch(`${API_BASE_URL}/api/user/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setProgress(data.progress));
  }, []);

  if (!learningPath || !user) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );

  // Helper: Check if a technology is completed
  const isCompleted = (nodeTitle) =>
    progress.some((p) => p.nodeId === nodeTitle && p.status === "completed");

  // Helper: Check if a subtopic is completed
  const isStepCompleted = (nodeTitle, stepTitle) =>
    progress.some((p) => p.nodeId === nodeTitle && p.stepTitle === stepTitle && p.status === "completed");

  // Handler: Mark/unmark technology as complete
  const handleTechCheckbox = async (roadmap, checked) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE_URL}/api/user/progress/technology`, {
      method: checked ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nodeId: roadmap.title }),
    });
    // Refresh progress
    fetch(`${API_BASE_URL}/api/user/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProgress(data.progress));
  };

  // Handler: Mark/unmark subtopic as complete
  const handleStepCheckbox = async (roadmap, step, checked) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE_URL}/api/user/progress/step`, {
      method: checked ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nodeId: roadmap.title, stepTitle: step.title }),
    });
    // Refresh progress
    fetch(`${API_BASE_URL}/api/user/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProgress(data.progress));
  };

  // Detailed technology roadmaps
  const getDetailedRoadmap = () => {
    const year = parseInt(user.year) || 1;
    
    const detailedRoadmaps = [
      {
        title: "Web Development",
        description: "Master modern web development from basics to advanced frameworks",
        icon: <FaCode className="text-2xl" />,
        color: "from-green-500 to-green-600",
        year: 1,
        steps: [
          { step: 1, title: "HTML Fundamentals", description: "Learn HTML structure, semantic tags, forms", duration: "2 weeks", status: "pending" },
          { step: 2, title: "CSS Styling", description: "Master CSS, Flexbox, Grid, responsive design", duration: "3 weeks", status: "pending" },
          { step: 3, title: "JavaScript Basics", description: "Variables, functions, DOM manipulation", duration: "4 weeks", status: "pending" },
          { step: 4, title: "Advanced JavaScript", description: "ES6+, async/await, modules", duration: "3 weeks", status: "pending" },
          { step: 5, title: "React Framework", description: "Components, hooks, state management", duration: "6 weeks", status: "pending" },
          { step: 6, title: "Backend Integration", description: "Node.js, Express, APIs", duration: "4 weeks", status: "pending" },
          { step: 7, title: "Database & Deployment", description: "MongoDB, deployment, CI/CD", duration: "3 weeks", status: "pending" }
        ]
      },
      {
        title: "Data Science & Analytics",
        description: "Learn data analysis, visualization, and machine learning fundamentals",
        icon: <FaDatabase className="text-2xl" />,
        color: "from-orange-500 to-orange-600",
        year: 2,
        steps: [
          { step: 1, title: "Python Basics", description: "Python syntax, data structures, OOP", duration: "3 weeks", status: "pending" },
          { step: 2, title: "Data Manipulation", description: "Pandas, NumPy, data cleaning", duration: "4 weeks", status: "pending" },
          { step: 3, title: "Data Visualization", description: "Matplotlib, Seaborn, Plotly", duration: "3 weeks", status: "pending" },
          { step: 4, title: "Statistical Analysis", description: "Descriptive stats, hypothesis testing", duration: "4 weeks", status: "pending" },
          { step: 5, title: "SQL & Databases", description: "SQL queries, database design", duration: "3 weeks", status: "pending" },
          { step: 6, title: "Machine Learning Intro", description: "Scikit-learn, basic algorithms", duration: "5 weeks", status: "pending" },
          { step: 7, title: "Advanced Analytics", description: "Deep learning, NLP, big data", duration: "6 weeks", status: "pending" }
        ]
      },
      {
        title: "Artificial Intelligence & ML",
        description: "Deep dive into AI, neural networks, and advanced ML algorithms",
        icon: <FaBrain className="text-2xl" />,
        color: "from-red-500 to-red-600",
        year: 3,
        steps: [
          { step: 1, title: "ML Fundamentals", description: "Supervised/unsupervised learning", duration: "4 weeks", status: "pending" },
          { step: 2, title: "Neural Networks", description: "TensorFlow, PyTorch basics", duration: "5 weeks", status: "pending" },
          { step: 3, title: "Deep Learning", description: "CNNs, RNNs, transformers", duration: "6 weeks", status: "pending" },
          { step: 4, title: "Computer Vision", description: "Image processing, object detection", duration: "4 weeks", status: "pending" },
          { step: 5, title: "Natural Language Processing", description: "Text processing, sentiment analysis", duration: "5 weeks", status: "pending" },
          { step: 6, title: "Reinforcement Learning", description: "Q-learning, policy gradients", duration: "6 weeks", status: "pending" },
          { step: 7, title: "AI Ethics & Deployment", description: "Model deployment, ethical AI", duration: "3 weeks", status: "pending" }
        ]
      },
      {
        title: "Mobile Development",
        description: "Create iOS and Android apps with React Native and Flutter",
        icon: <FaMobile className="text-2xl" />,
        color: "from-purple-500 to-purple-600",
        year: 2,
        steps: [
          { step: 1, title: "Mobile Fundamentals", description: "Mobile UI/UX principles", duration: "2 weeks", status: "pending" },
          { step: 2, title: "React Native Basics", description: "Components, navigation, state", duration: "4 weeks", status: "pending" },
          { step: 3, title: "Advanced React Native", description: "APIs, native modules, performance", duration: "5 weeks", status: "pending" },
          { step: 4, title: "Flutter Introduction", description: "Dart language, Flutter widgets", duration: "4 weeks", status: "pending" },
          { step: 5, title: "Advanced Flutter", description: "State management, animations", duration: "5 weeks", status: "pending" },
          { step: 6, title: "App Store Deployment", description: "Publishing, testing, updates", duration: "3 weeks", status: "pending" },
          { step: 7, title: "Cross-platform Development", description: "Code sharing, platform-specific code", duration: "4 weeks", status: "pending" }
        ]
      },
      {
        title: "Cybersecurity",
        description: "Learn ethical hacking, network security, and threat analysis",
        icon: <FaShieldAlt className="text-2xl" />,
        color: "from-yellow-500 to-yellow-600",
        year: 3,
        steps: [
          { step: 1, title: "Security Fundamentals", description: "CIA triad, security principles", duration: "3 weeks", status: "pending" },
          { step: 2, title: "Network Security", description: "Protocols, firewalls, VPNs", duration: "4 weeks", status: "pending" },
          { step: 3, title: "Web Security", description: "OWASP Top 10, SQL injection", duration: "4 weeks", status: "pending" },
          { step: 4, title: "Penetration Testing", description: "Kali Linux, vulnerability assessment", duration: "5 weeks", status: "pending" },
          { step: 5, title: "Cryptography", description: "Encryption, hashing, digital signatures", duration: "4 weeks", status: "pending" },
          { step: 6, title: "Incident Response", description: "Threat detection, forensics", duration: "4 weeks", status: "pending" },
          { step: 7, title: "Security Operations", description: "SIEM, SOC, compliance", duration: "3 weeks", status: "pending" }
        ]
      },
      {
        title: "Cloud Computing & DevOps",
        description: "Master AWS, Docker, Kubernetes, and CI/CD pipelines",
        icon: <FaCloud className="text-2xl" />,
        color: "from-teal-500 to-teal-600",
        year: 4,
        steps: [
          { step: 1, title: "Cloud Fundamentals", description: "AWS basics, IAM, EC2", duration: "3 weeks", status: "pending" },
          { step: 2, title: "Containerization", description: "Docker, container orchestration", duration: "4 weeks", status: "pending" },
          { step: 3, title: "Kubernetes", description: "Pods, services, deployments", duration: "5 weeks", status: "pending" },
          { step: 4, title: "CI/CD Pipelines", description: "Jenkins, GitHub Actions", duration: "4 weeks", status: "pending" },
          { step: 5, title: "Infrastructure as Code", description: "Terraform, CloudFormation", duration: "4 weeks", status: "pending" },
          { step: 6, title: "Monitoring & Logging", description: "Prometheus, ELK stack", duration: "3 weeks", status: "pending" },
          { step: 7, title: "Advanced DevOps", description: "Microservices, serverless", duration: "4 weeks", status: "pending" }
        ]
      }
    ];

    // Filter roadmaps based on user's year
    return detailedRoadmaps.filter(roadmap => roadmap.year <= year);
  };

  const roadmaps = getDetailedRoadmap();
  // Progress calculation: count only technologies checked as complete
  const completedCount = roadmaps.filter(rm => isCompleted(rm.title)).length;
  const totalCount = roadmaps.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  // Helper: For selected technology, count completed subtopics
  const getSelectedProgress = () => {
    if (selectedNode === null) return { completed: 0, total: 0 };
    const roadmap = roadmaps[selectedNode];
    const total = roadmap.steps.length;
    const completed = roadmap.steps.filter(step => isStepCompleted(roadmap.title, step.title)).length;
    return { completed, total };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {selectedNode === null
                  ? "Your Learning Roadmap"
                  : `${roadmaps[selectedNode].title} Roadmap`}
              </h1>
              <p className="text-gray-300 text-lg">
                {selectedNode === null
                  ? `Select a technology to view and track your progress.`
                  : roadmaps[selectedNode].description}
              </p>
            </div>
            <div className="text-right">
              {selectedNode === null ? (
                <>
                  <div className="text-3xl font-bold text-indigo-400">{progressPercentage}%</div>
                  <div className="text-gray-400 text-sm">Overall Progress</div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-400">
                    {getSelectedProgress().total > 0
                      ? Math.round((getSelectedProgress().completed / getSelectedProgress().total) * 100)
                      : 0}%
                  </div>
                  <div className="text-gray-400 text-sm">
                    {getSelectedProgress().completed} of {getSelectedProgress().total} topics completed
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${selectedNode === null ? "bg-gradient-to-r from-indigo-500 to-indigo-600" : "bg-gradient-to-r from-green-400 to-green-600"}`}
              style={{ width: `${selectedNode === null
                ? progressPercentage
                : getSelectedProgress().total > 0
                  ? (getSelectedProgress().completed / getSelectedProgress().total) * 100
                  : 0}%` }}
            ></div>
          </div>
          {/* Progress Text */}
          {selectedNode === null && (
            <div className="text-gray-300 text-lg">
              {completedCount} of {totalCount} technologies completed
            </div>
          )}
        </div>
        {/* Back Button */}
        {selectedNode !== null && (
          <button
            className="mb-6 px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            onClick={() => setSelectedNode(null)}
          >
            ← Back to All Technologies
          </button>
        )}
        {/* Roadmap Grid */}
        {selectedNode === null ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {roadmaps.map((roadmap, idx) => (
              <div
                key={roadmap.title}
                className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg border border-gray-700 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => {
                  setSelectedNode(idx);
                  setTimeout(() => {
                    if (detailRefs.current[idx]) {
                      detailRefs.current[idx].scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }, 100);
                }}
              >
                {/* Technology Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${roadmap.color} text-white`}>
                    {roadmap.icon}
                  </div>
                  {/* Custom box for technology completion as a styled checkbox */}
                  <label className="w-7 h-7 flex items-center justify-center rounded-md border-2 cursor-pointer transition relative" title="Mark as complete">
                    <input
                      type="checkbox"
                      checked={isCompleted(roadmap.title)}
                      onChange={e => {
                        e.stopPropagation();
                        handleTechCheckbox(roadmap, e.target.checked);
                      }}
                      className="absolute opacity-0 w-7 h-7 cursor-pointer"
                    />
                    <span className={`${isCompleted(roadmap.title) ? "bg-green-500 border-green-600" : "bg-gray-800 border-gray-600"} w-7 h-7 flex items-center justify-center rounded-md border-2 transition`}>{isCompleted(roadmap.title) && <FaCheckCircle className="text-white text-lg" />}</span>
                  </label>
                </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{roadmap.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">{roadmap.description}</p>
              
              {/* Progress Steps */}
              <div className="space-y-3">
                {roadmap.steps.slice(0, 3).map((step) => (
                  <div key={step.step} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{step.title}</div>
                      <div className="text-gray-400 text-sm">{step.duration}</div>
                    </div>
                  </div>
                ))}
                {roadmap.steps.length > 3 && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaArrowRight />
                    <span>+{roadmap.steps.length - 3} more steps</span>
                  </div>
                )}
              </div>
              
              {/* Year Badge */}
              <div className="mt-4 inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                Year {roadmap.year}
              </div>
            </div>
          ))}
        </div>
        ) : (
          // Detailed Roadmap Panel
          <div
            className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg border border-gray-700"
            ref={el => (detailRefs.current[selectedNode] = el)}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                {roadmaps[selectedNode].title} - Complete Roadmap
              </h2>
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${roadmaps[selectedNode].color} text-white`}>
                {roadmaps[selectedNode].icon}
              </div>
            </div>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {roadmaps[selectedNode].description}
            </p>

            {/* Step-by-step roadmap with custom boxes */}
            <div className="space-y-4">
              {roadmaps[selectedNode].steps.map((step, stepIdx) => (
                <div key={step.step} className="bg-gray-800 rounded-lg p-6 border border-gray-600 flex items-center">
                  {/* Styled checkbox for subtopic completion */}
                  <label className="w-7 h-7 flex items-center justify-center rounded-md border-2 cursor-pointer transition mr-4 relative">
                    <input
                      type="checkbox"
                      checked={isStepCompleted(roadmaps[selectedNode].title, step.title)}
                      onChange={e => {
                        e.stopPropagation();
                        handleStepCheckbox(roadmaps[selectedNode], step, !isStepCompleted(roadmaps[selectedNode].title, step.title));
                      }}
                      className="absolute w-7 h-7 cursor-pointer z-10"
                      style={{ opacity: 0 }}
                    />
                    <span
                      className={`${isStepCompleted(roadmaps[selectedNode].title, step.title) ? "bg-green-500 border-green-600" : "bg-gray-700 border-gray-500"} w-7 h-7 flex items-center justify-center rounded-md border-2 transition`}
                      style={{ pointerEvents: 'none' }}
                    >
                      {isStepCompleted(roadmaps[selectedNode].title, step.title) && <FaCheckCircle className="text-white text-lg" />}
                    </span>
                  </label>
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 mb-3">{step.description}</p>
                    <span className="text-indigo-400 font-medium">{step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Mark as complete box for technology in detail view */}
            <div className="mt-8 flex items-center">
              <label className="w-7 h-7 flex items-center justify-center rounded-md border-2 cursor-pointer transition mr-2 relative">
                <input
                  type="checkbox"
                  checked={isCompleted(roadmaps[selectedNode].title)}
                  onChange={e => {
                    e.stopPropagation();
                    handleTechCheckbox(roadmaps[selectedNode], !isCompleted(roadmaps[selectedNode].title));
                  }}
                  className="absolute opacity-0 w-7 h-7 cursor-pointer"
                  id="mark-complete-tech"
                />
                <span className={`${isCompleted(roadmaps[selectedNode].title) ? "bg-green-500 border-green-600" : "bg-gray-800 border-gray-600"} w-7 h-7 flex items-center justify-center rounded-md border-2 transition`}>{isCompleted(roadmaps[selectedNode].title) && <FaCheckCircle className="text-white text-lg" />}</span>
              </label>
              <label htmlFor="mark-complete-tech" className="text-white text-lg font-semibold">Mark as complete</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


