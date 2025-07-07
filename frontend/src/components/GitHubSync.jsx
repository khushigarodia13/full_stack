import React, { useState } from "react";
import toast from "react-hot-toast";

export default function GitHubSync() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Place the code here, inside your sync handler:
  const handleSync = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/user/github/activity", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errorData = await res.json();
      if (errorData.message === "GitHub not connected") {
        toast.error("Please connect your GitHub account first.");
      } else {
        toast.error("Failed to fetch GitHub activity.");
      }
      setLoading(false);
      return;
    }
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  };

  return (
    <div className="my-4">
      <button className="btn bg-gray-800 text-white" onClick={handleSync} disabled={loading}>
        {loading ? "Syncing..." : "Sync with GitHub"}
      </button>
      <ul className="mt-4">
        {events.map(event => (
          <li key={event.id}>
            <span className="font-semibold">{event.type}</span> in <span className="text-blue-600">{event.repo.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}