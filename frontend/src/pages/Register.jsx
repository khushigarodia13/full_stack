import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


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
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/onboarding");
      toast.success("Registered successfully!")
    } else {
        toast.error("Registration failed!")
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Register</h2>
        <input className="input" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn w-full mt-4" type="submit">Register</button>
        <div className="flex flex-col gap-2 mt-4">
          <a className="btn bg-blue-500 text-white" href="http://localhost:5000/api/auth/google">Register with Google</a>
          <a className="btn bg-gray-800 text-white" href="http://localhost:5000/api/auth/github">Register with GitHub</a>
        </div>
      </form>
    </div>
  );
}