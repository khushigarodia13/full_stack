import React, { useState } from 'react';
import { FaUser, FaCode, FaLinkedin, FaEnvelope, FaHandshake, FaCheck } from 'react-icons/fa';

export default function StudentCard({ student, currentUser, onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const getSkillLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'expert': return 'text-purple-400';
      case 'advanced': return 'text-green-400';
      case 'intermediate': return 'text-blue-400';
      case 'beginner': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(student.id);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const skillMatchPercentage = calculateSkillMatch(student.skills, currentUser?.skills || []);

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{student.name}</h3>
            <p className="text-gray-400 text-sm">{student.year} Year • {student.college}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(student.productivityScore)}`}>
            {student.productivityScore}
          </div>
          <div className="text-gray-400 text-xs">Productivity Score</div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-4">
        <h4 className="text-white font-semibold mb-2 flex items-center">
          <FaCode className="mr-2 text-blue-400" />
          Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                getSkillLevelColor(skill.level)
              } bg-gray-800`}
            >
              {skill.name} ({skill.level})
            </span>
          ))}
        </div>
      </div>

      {/* Skill Match */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">Skill Match</span>
          <span className="text-blue-400 font-semibold">{skillMatchPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${skillMatchPercentage}%` }}
          />
        </div>
      </div>

      {/* Goals & Interests */}
      <div className="mb-4">
        <h4 className="text-white font-semibold mb-2">Goals</h4>
        <p className="text-gray-300 text-sm">{student.goals}</p>
      </div>

      {/* Social Links */}
      <div className="flex space-x-3 mb-4">
        {student.github && (
          <a
            href={student.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaCode className="text-xl" />
          </a>
        )}
        {student.linkedin && (
          <a
            href={student.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition"
          >
            <FaLinkedin className="text-xl" />
          </a>
        )}
        <button className="text-gray-400 hover:text-green-400 transition">
          <FaEnvelope className="text-xl" />
        </button>
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        disabled={isConnecting || isConnected}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center ${
          isConnected
            ? 'bg-green-600 text-white cursor-not-allowed'
            : isConnecting
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isConnected ? (
          <>
            <FaCheck className="mr-2" />
            Connected
          </>
        ) : isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <FaHandshake className="mr-2" />
            Connect for Hackathon
          </>
        )}
      </button>
    </div>
  );
}

// Helper function to calculate skill match percentage
function calculateSkillMatch(studentSkills, userSkills) {
  if (!userSkills.length) return 0;
  
  const studentSkillNames = studentSkills.map(s => s.name.toLowerCase());
  const userSkillNames = userSkills.map(s => s.name.toLowerCase());
  
  const commonSkills = studentSkillNames.filter(skill => 
    userSkillNames.includes(skill)
  );
  
  return Math.round((commonSkills.length / userSkillNames.length) * 100);
} 