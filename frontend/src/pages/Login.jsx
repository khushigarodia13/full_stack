// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  if (localStorage.getItem("token")) {
    navigate("/dashboard");
  }
}, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
        toast.success("Login successful!");
      navigate("/onboarding");
    } else {
        toast.error("Login failed: " );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Login</h2>
        <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn w-full mt-4" type="submit">Login</button>
        <div className="flex flex-col gap-2 mt-4">
          <a className="btn bg-blue-500 text-white" href="http://localhost:5000/api/auth/google">Login with Google</a>
          <a className="btn bg-gray-800 text-white" href="http://localhost:5000/api/auth/github">Login with GitHub</a>
          </div>
        <div className="mt-4 text-center">
          <span>New user? </span>
          <Link to="/register" className="text-blue-600 underline">Register here</Link>
        </div>
      </form>
    </div>
  );
}