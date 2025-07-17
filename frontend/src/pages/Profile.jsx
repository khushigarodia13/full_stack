import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaSave, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBullseye } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setUser(data.user);
      setFormData({
        name: data.user?.name || '',
        email: data.user?.email || '',
        year: data.user?.year || '',
        college: data.user?.college || '',
        background: data.user?.background || '',
        goals: data.user?.goals || '',
        phone: data.user?.phone || '',
        location: data.user?.location || ''
      });
    })
    .catch(err => console.error("User fetch error:", err));
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return <div className="text-white p-8 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Profile Information</h1>
              <p className="text-gray-300 text-lg">Manage your personal and academic details</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center text-lg"
            >
              {isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaUser className="mr-3 text-blue-400" />
                Basic Information
              </h3>
              
              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaGraduationCap className="mr-3 text-green-400" />
                Academic Information
              </h3>
              
              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">Year of Study</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">Final Year</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">College/University</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">Background</label>
                <select
                  value={formData.background}
                  onChange={(e) => setFormData({...formData, background: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                >
                  <option value="">Select Background</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="DevOps">DevOps</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-200 text-lg font-medium mb-3">Career Goals</label>
                <select
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 text-lg"
                >
                  <option value="">Select Goals</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Status Display */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaBullseye className="mr-3 text-purple-400" />
              Current Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <div className="text-gray-400 text-sm font-medium">Year</div>
                <div className="text-white text-xl font-bold">{user?.year || 'Not Set'}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <div className="text-gray-400 text-sm font-medium">Background</div>
                <div className="text-white text-xl font-bold">{user?.background || 'Not Set'}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <div className="text-gray-400 text-sm font-medium">Goals</div>
                <div className="text-white text-xl font-bold">{user?.goals || 'Not Set'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}