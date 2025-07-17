import React, { useState } from 'react';
import { FaGraduationCap, FaBriefcase, FaCode, FaRocket, FaCheck, FaClock, FaBullseye } from 'react-icons/fa';

export default function JobRoadmapCard({ userYear, userGoals }) {
  const [selectedYear, setSelectedYear] = useState(userYear || 2);
  const [selectedPath, setSelectedPath] = useState(userGoals || 'web-dev');

  const careerPaths = {
    'web-dev': {
      name: 'Web Development',
      icon: FaCode,
      color: 'text-blue-400'
    },
    'sde': {
      name: 'Software Development',
      icon: FaBriefcase,
      color: 'text-green-400'
    },
    'ml': {
      name: 'Machine Learning',
      icon: FaRocket,
      color: 'text-purple-400'
    },
    'research': {
      name: 'Research & Academia',
      icon: FaGraduationCap,
      color: 'text-yellow-400'
    }
  };

  const getRoadmap = (year, path) => {
    const roadmaps = {
      'web-dev': {
        1: [
          { month: 'Aug', task: 'Learn HTML, CSS, JavaScript basics', status: 'completed' },
          { month: 'Sep', task: 'Build 2-3 small projects', status: 'completed' },
          { month: 'Oct', task: 'Learn React fundamentals', status: 'in-progress' },
          { month: 'Nov', task: 'Build portfolio website', status: 'pending' },
          { month: 'Dec', task: 'Learn backend basics (Node.js)', status: 'pending' }
        ],
        2: [
          { month: 'Jan', task: 'Master React ecosystem', status: 'pending' },
          { month: 'Feb', task: 'Learn database concepts', status: 'pending' },
          { month: 'Mar', task: 'Build full-stack project', status: 'pending' },
          { month: 'Apr', task: 'Learn deployment & DevOps', status: 'pending' },
          { month: 'May', task: 'Start applying for internships', status: 'pending' }
        ],
        3: [
          { month: 'Jun', task: 'System Design concepts', status: 'pending' },
          { month: 'Jul', task: 'Advanced JavaScript patterns', status: 'pending' },
          { month: 'Aug', task: 'Microservices architecture', status: 'pending' },
          { month: 'Sep', task: 'Performance optimization', status: 'pending' },
          { month: 'Oct', task: 'Interview preparation', status: 'pending' }
        ],
        4: [
          { month: 'Nov', task: 'Final year project', status: 'pending' },
          { month: 'Dec', task: 'Resume optimization', status: 'pending' },
          { month: 'Jan', task: 'Mock interviews', status: 'pending' },
          { month: 'Feb', task: 'Job applications', status: 'pending' },
          { month: 'Mar', task: 'Interview rounds', status: 'pending' }
        ]
      },
      'sde': {
        1: [
          { month: 'Aug', task: 'Programming fundamentals', status: 'completed' },
          { month: 'Sep', task: 'Data Structures & Algorithms', status: 'completed' },
          { month: 'Oct', task: 'Object-Oriented Programming', status: 'in-progress' },
          { month: 'Nov', task: 'Basic projects in Java/Python', status: 'pending' },
          { month: 'Dec', task: 'Version control with Git', status: 'pending' }
        ],
        2: [
          { month: 'Jan', task: 'Advanced DSA', status: 'pending' },
          { month: 'Feb', task: 'System Design basics', status: 'pending' },
          { month: 'Mar', task: 'Database design', status: 'pending' },
          { month: 'Apr', task: 'API development', status: 'pending' },
          { month: 'May', task: 'Contribute to open source', status: 'pending' }
        ],
        3: [
          { month: 'Jun', task: 'Leetcode practice', status: 'pending' },
          { month: 'Jul', task: 'System Design interviews', status: 'pending' },
          { month: 'Aug', task: 'Behavioral interview prep', status: 'pending' },
          { month: 'Sep', task: 'Mock interviews', status: 'pending' },
          { month: 'Oct', task: 'Resume building', status: 'pending' }
        ],
        4: [
          { month: 'Nov', task: 'Final year project', status: 'pending' },
          { month: 'Dec', task: 'Job applications', status: 'pending' },
          { month: 'Jan', task: 'Interview preparation', status: 'pending' },
          { month: 'Feb', task: 'Technical interviews', status: 'pending' },
          { month: 'Mar', task: 'Offer negotiations', status: 'pending' }
        ]
      }
    };

    return roadmaps[path]?.[year] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheck className="text-green-400" />;
      case 'in-progress': return <FaClock className="text-yellow-400" />;
      case 'pending': return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const roadmap = getRoadmap(selectedYear, selectedPath);
  const PathIcon = careerPaths[selectedPath]?.icon || FaCode;

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <PathIcon className={`text-2xl mr-3 ${careerPaths[selectedPath]?.color}`} />
          <h2 className="text-xl font-bold text-white">Job Prep Roadmap</h2>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value={1}>1st Year</option>
            <option value={2}>2nd Year</option>
            <option value={3}>3rd Year</option>
            <option value={4}>Final Year</option>
          </select>
          <select
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="web-dev">Web Development</option>
            <option value="sde">Software Development</option>
            <option value="ml">Machine Learning</option>
            <option value="research">Research</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {roadmap.map((item, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(item.status)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-semibold">{item.month}</span>
                    <span className={`font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-white mt-1">{item.task}</p>
                </div>
              </div>
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  item.status === 'completed'
                    ? 'bg-green-600 text-white'
                    : item.status === 'in-progress'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {item.status === 'completed' ? 'Done' : 
                 item.status === 'in-progress' ? 'In Progress' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Progress Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {roadmap.filter(item => item.status === 'completed').length}
            </div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {roadmap.filter(item => item.status === 'in-progress').length}
            </div>
            <div className="text-gray-400 text-sm">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400">
              {roadmap.filter(item => item.status === 'pending').length}
            </div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
} 