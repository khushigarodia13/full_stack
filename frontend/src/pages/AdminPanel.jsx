// src/pages/AdminPanel.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaMap, FaCubes, FaBook } from "react-icons/fa";

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex bg-slate-900">
      <aside className="w-64 bg-violet-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <Link to="/admin/paths" className="flex items-center gap-2 mb-4 hover:text-amber-400">
          <FaMap /> Learning Paths
        </Link>
        <Link to="/admin/modules" className="flex items-center gap-2 mb-4 hover:text-emerald-400">
          <FaCubes /> Modules
        </Link>
        <Link to="/admin/resources" className="flex items-center gap-2 hover:text-indigo-400">
          <FaBook /> Resources
        </Link>
      </aside>
      <main className="flex-1 p-8 bg-slate-800 text-white">
        {/* Render selected admin section here */}
        <h3 className="text-xl font-semibold mb-4">Select a section from the sidebar</h3>
      </main>
    </div>
  );
}