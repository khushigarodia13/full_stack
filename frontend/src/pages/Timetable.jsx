import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCheck, FaClock, FaCalendar, FaBullseye, FaChartLine } from 'react-icons/fa';
import API_BASE_URL from "../utils/api";

export default function Timetable() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [mode, setMode] = useState('routine'); // 'routine' or 'goal'
  const [completedTasks, setCompletedTasks] = useState([]);
  const navigate = useNavigate();

  // Sample routine tasks
  const routineTasks = [
    { id: 1, name: 'Wake up & Morning routine', time: '07:00', duration: 60, completed: true },
    { id: 2, name: 'Classes', time: '09:00', duration: 240, completed: true },
    { id: 3, name: 'Lunch Break', time: '13:00', duration: 60, completed: true },
    { id: 4, name: 'DSA Practice', time: '14:00', duration: 120, completed: false },
    { id: 5, name: 'Project Work', time: '16:00', duration: 180, completed: false },
    { id: 6, name: 'Gym/Exercise', time: '19:00', duration: 60, completed: false },
  ];

  // Sample goal-based tasks
  const goalTasks = [
    { id: 1, name: 'Leetcode Problems (2 hours)', time: '14:00', duration: 120, completed: false },
    { id: 2, name: 'System Design Study (1 hour)', time: '16:00', duration: 60, completed: false },
    { id: 3, name: 'Resume Update (30 mins)', time: '18:00', duration: 30, completed: false },
    { id: 4, name: 'Project Development (2 hours)', time: '19:00', duration: 120, completed: false },
  ];

  // Fetch today's tasks and completed state from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/productivity/today`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.dailyLog) {
          setTasks(data.dailyLog.tasks || []);
          setCompletedTasks((data.dailyLog.tasks || []).filter(t => t.completed).map(t => t.id || t.name));
        }
      });
  }, [mode]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      _id: Date.now().toString(), // temporary id for UI
      name: newTask,
      time: selectedTime,
      duration: 60,
      completed: false
    };
    setTasks(prev => [...prev, task]); // update UI immediately
    setNewTask('');
    // Sync with backend
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/productivity/add-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: task.name, time: task.time, duration: task.duration })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.dailyLog) {
          setTasks(data.dailyLog.tasks || []);
        }
      });
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => (t._id || (t.name + t.time)) !== taskId)); // update UI immediately
    // Sync with backend
    const task = tasks.find(t => (t._id || (t.name + t.time)) === taskId);
    if (!task) return;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/productivity/delete-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: task.name, time: task.time })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.dailyLog) {
          setTasks(data.dailyLog.tasks || []);
        }
      });
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t =>
      (t._id || (t.name + t.time)) === taskId ? { ...t, completed: !t.completed } : t
    )); // update UI immediately
    // Sync with backend
    const task = tasks.find(t => (t._id || (t.name + t.time)) === taskId);
    if (!task) return;
    const isCompleted = !task.completed;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/productivity/complete-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ taskName: task.name, completed: isCompleted })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.dailyLog) {
          setTasks(data.dailyLog.tasks || []);
        }
      });
  };

  const completionRate = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
  const completedCount = tasks.filter(t => t.completed).length;
  const remainingCount = Math.max(tasks.length - completedCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Daily Schedule</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMode('routine')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  mode === 'routine' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaCalendar className="inline mr-2" />
                Routine Mode
              </button>
              <button
                onClick={() => setMode('goal')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  mode === 'goal' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaBullseye className="inline mr-2" />
                Goal Mode
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Today's Progress</span>
              <span className="text-white font-semibold">{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Mode Description */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {mode === 'routine' ? '📅 Routine Mode' : '🎯 Goal Mode'}
            </h3>
            <p className="text-gray-300">
              {mode === 'routine' 
                ? 'Plan your daily routine with fixed time slots for regular activities.'
                : 'Set specific goals and break them into manageable time blocks.'
              }
            </p>
          </div>
        </div>

        {/* Add New Task */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Task</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task name..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Add
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Today's Schedule</h2>
          
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id || (task.name + task.time)}
                className={`bg-gray-800 rounded-lg p-4 border-l-4 transition-all duration-300 ${
                  task.completed 
                    ? 'border-green-500 bg-gray-700' 
                    : 'border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleTask(task._id || (task.name + task.time))}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-400 hover:border-green-500'
                      }`}
                    >
                      {task.completed && <FaCheck className="text-xs" />}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        task.completed ? 'text-gray-400 line-through' : 'text-white'
                      }`}>
                        {task.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-gray-400 text-sm flex items-center">
                          <FaClock className="mr-1" />
                          {task.time}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {task.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task._id || (task.name + task.time))}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8">
              <FaCalendar className="text-gray-500 text-4xl mx-auto mb-4" />
              <p className="text-gray-400">No tasks scheduled for today.</p>
              <p className="text-gray-500 text-sm">Add some tasks to get started!</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg text-center">
            <FaCheck className="text-green-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white font-semibold">Completed</h3>
            <p className="text-2xl font-bold text-green-400">{completedCount}</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg text-center">
            <FaClock className="text-blue-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white font-semibold">Remaining</h3>
            <p className="text-2xl font-bold text-blue-400">{remainingCount}</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-90 rounded-xl p-6 shadow-lg text-center">
            <FaChartLine className="text-purple-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white font-semibold">Progress</h3>
            <p className="text-2xl font-bold text-purple-400">{Math.round(completionRate)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
} 