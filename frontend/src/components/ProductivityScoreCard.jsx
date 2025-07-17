import React from 'react';
import { FaTrophy, FaChartLine, FaBullseye } from 'react-icons/fa';
import { calculateProductivityScore, getScoreLevel, getScoreGroup } from '../utils/scoreCalculator';

export default function ProductivityScoreCard({ userData, userYear }) {
  const score = calculateProductivityScore(userData, userYear);
  const scoreLevel = getScoreLevel(score);
  const scoreGroup = getScoreGroup(score);

  // Determine which sections to show
  const year = parseInt(userYear, 10);
  const showJobPrep = year >= 3;
  const showResume = year >= 2;

  const getScoreColor = (score) => {
    if (score >= 90) return 'from-purple-500 to-purple-600';
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 70) return 'from-blue-500 to-blue-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FaChartLine className="mr-2 text-indigo-400" />
          Productivity Score
        </h2>
        {score >= 80 && (
          <div className="flex items-center text-yellow-400">
            <FaTrophy className="mr-1" />
            <span className="text-sm font-semibold">Elite</span>
          </div>
        )}
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-2`}>
          {score}
        </div>
        <div className={`text-lg font-semibold ${scoreLevel.color}`}>
          {scoreLevel.level}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Score Group: {scoreGroup}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Daily Tasks</span>
          <span className="text-white font-semibold">{userData.dailyTaskCompletion || 0}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(userData.dailyTaskCompletion || 0, 100)}%` }}
          />
        </div>

        {showResume && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Resume Actions</span>
              <span className="text-white font-semibold">{userData.resumeActions || 0}/10</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((userData.resumeActions || 0) * 10, 100)}%` }}
              />
            </div>
          </>
        )}
        {!showResume && (
          <div className="text-gray-500 text-xs italic">Resume actions not required for 1st year students</div>
        )}

        {showJobPrep && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Job Prep Progress</span>
              <span className="text-white font-semibold">{userData.jobPrepProgress || 0}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(userData.jobPrepProgress || 0, 100)}%` }}
              />
            </div>
          </>
        )}
        {!showJobPrep && (
          <div className="text-gray-500 text-xs italic">Job prep not required for 1st/2nd year students</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition">
          <FaBullseye className="mr-1" />
          Set Goals
        </button>
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition">
          View Details
        </button>
      </div>
    </div>
  );
} 