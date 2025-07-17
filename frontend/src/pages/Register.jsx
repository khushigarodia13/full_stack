import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        throw new Error('Registration failed with status: ' + res.status);
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/onboarding");
        toast.success("Registered successfully!");
      } else {
        toast.error("Registration failed!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join EduWise</h1>
          <p className="text-gray-300 text-lg">Start your learning journey today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                type="text" 
                placeholder="Full name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button 
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            type="submit"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a 
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300"
              href="https://eduwise-backend-itjy.onrender.com"
            >
              <FaGoogle className="text-xl" />
            </a>
            <a 
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300"
              href="https://eduwise-backend-itjy.onrender.com"
            >
              <FaGithub className="text-xl" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
