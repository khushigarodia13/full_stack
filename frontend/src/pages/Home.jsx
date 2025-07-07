import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaRocket, FaUserGraduate, FaChartLine } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center px-4">
      <header className="w-full max-w-4xl flex flex-col items-center text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
          EduWise
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
          <span className="text-indigo-400 font-semibold">Personalized learning paths</span>, live progress tracking, job prep, and resume generation—all in one place.
        </p>
        <div className="flex gap-4 mb-8">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-indigo-600 px-8 py-3 rounded-lg font-semibold shadow-lg transition"
          >
            Register
          </Link>
        </div>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <FeatureCard
          icon={<FaRocket className="text-3xl text-indigo-400" />}
          title="Dynamic Roadmaps"
          description="Get a personalized, interactive learning path tailored to your goals and background."
        />
        <FeatureCard
          icon={<FaChartLine className="text-3xl text-green-400" />}
          title="Progress Tracker"
          description="Track your learning, mark modules as complete, and visualize your journey."
        />
        <FeatureCard
          icon={<FaGithub className="text-3xl text-gray-300" />}
          title="GitHub Sync"
          description="Connect your GitHub to auto-track projects, commits, and build a live resume."
        />
        <FeatureCard
          icon={<FaUserGraduate className="text-3xl text-yellow-300" />}
          title="Resume Generator"
          description="Instantly generate a professional resume from your learning and project history."
        />
      </section>

      <footer className="text-gray-500 text-sm mt-auto mb-4">
        &copy; {new Date().getFullYear()} EduWise. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-center">{description}</p>
    </div>
  );
}