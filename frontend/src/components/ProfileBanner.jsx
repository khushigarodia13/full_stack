import React, { useState } from "react";
import { FaGraduationCap, FaCalendarAlt, FaCode, FaBullseye, FaBuilding } from "react-icons/fa";

const companyTypes = [
  "Startup",
  "Mid-size Product",
  "FAANG",
  "Govt/PSUs",
  "Open Source / Research Labs"
];

export default function ProfileBanner({ user, targetCompanyType, setTargetCompanyType }) {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg mb-8 border border-blue-700">
      <div className="flex flex-col gap-2 text-white text-lg">
        <div className="flex items-center gap-2">
          <FaGraduationCap className="text-yellow-300" />
          <span className="font-semibold">Year:</span> {user?.year || "-"}
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-green-300" />
          <span className="font-semibold">Current:</span> {month} {year}
        </div>
        <div className="flex items-center gap-2">
          <FaCode className="text-pink-300" />
          <span className="font-semibold">Tech Stack:</span> {user?.techStack?.join(", ") || "-"}
        </div>
        <div className="flex items-center gap-2">
          <FaBullseye className="text-red-300" />
          <span className="font-semibold">Career Goal:</span> {user?.careerGoal || "-"}
        </div>
      </div>
      <div className="flex flex-col items-center mt-4 md:mt-0">
        <label className="text-white font-semibold mb-2 flex items-center">
          <FaBuilding className="mr-2 text-blue-300" /> Target Company Type
        </label>
        <select
          value={targetCompanyType}
          onChange={e => setTargetCompanyType(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-blue-400 text-lg"
        >
          {companyTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );
} 