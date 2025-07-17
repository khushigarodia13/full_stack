import React from "react";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export default function RoadmapTimeline({ timeline }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-700 shadow-lg">
      <div className="flex items-center mb-4">
        <FaCalendarAlt className="text-purple-400 text-2xl mr-2" />
        <h2 className="text-2xl font-bold text-white">Custom Yearly Roadmap</h2>
      </div>
      <div className="relative border-l-4 border-purple-700 pl-8">
        {timeline.map((period, idx) => {
          const isCurrent = period.year === currentYear && new Date(`${period.month} 1, ${period.year}`).getMonth() === currentMonth;
          return (
            <div key={idx} className="mb-10 last:mb-0 relative">
              <div className={`absolute -left-5 top-2 w-6 h-6 rounded-full border-4 ${isCurrent ? 'border-yellow-400 bg-yellow-300' : 'border-purple-700 bg-gray-900'} flex items-center justify-center z-10`}></div>
              <div className={`bg-gray-800 rounded-lg p-5 shadow-md border ${isCurrent ? 'border-yellow-400' : 'border-purple-700'} transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-purple-300">{period.month} {period.year}</span>
                  {isCurrent && <span className="text-yellow-400 font-semibold">Current</span>}
                </div>
                <ul className="list-disc ml-6 text-white space-y-2">
                  {period.tasks.map((task, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-400" />
                      <span>{task.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 