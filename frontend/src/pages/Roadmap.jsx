import React, { useEffect, useState } from "react";

// ✅ Separate ResourceItem component
function ResourceItem({ resId }) {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/resource/${resId}`)
      .then(res => res.json())
      .then(data => setResource(data.resource));
  }, [resId]);

  if (!resource) return <li>Loading...</li>;

  return (
    <li>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {resource.title}
      </a>{" "}
      ({resource.type})
    </li>
  );
}

// ✅ Main Roadmap component
export default function Roadmap() {
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/learning-path", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setLearningPath(data.learningPath));

    fetch("http://localhost:5000/api/user/progress", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setProgress(data.progress));
  }, []);

  if (!learningPath) return <div>Loading...</div>;

  const isCompleted = (nodeTitle) =>
    progress.some((p) => p.nodeId === nodeTitle && p.status === "completed");

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Your Learning Roadmap</h2>

      {/* Roadmap Grid */}
      <div className="grid md:grid-cols-2 gap-6">
  {learningPath.nodes.map((node, idx) => (
    <div
      key={node.title}
      className={`p-4 rounded shadow-md border-2 mb-4 ${
        node.description.includes("Special module")
          ? "bg-amber-900 border-amber-400"
          : "bg-slate-800 border-slate-700"
      }`}
    >
      <div className="font-bold text-white">{node.title}</div>
      <div className="text-sm text-gray-300">{node.description}</div>
      {node.description.includes("Special module") && (
        <span className="text-xs text-amber-300 font-semibold">Job Prep</span>
      )}
    </div>
  ))}
</div>

      {/* Node Detail Panel */}
      {selectedNode !== null && (
        <div className="mt-8 p-6 bg-gray-50 rounded shadow-md max-w-lg">
          <h3 className="text-xl font-bold mb-2">
            {learningPath.nodes[selectedNode].title}
          </h3>
          <p className="mb-2">{learningPath.nodes[selectedNode].description}</p>

          <div className="mb-2">
            <strong>Resources:</strong>
            <ul className="list-disc ml-6">
              {learningPath.nodes[selectedNode].resources.length === 0 && (
                <li>No resources</li>
              )}
              {learningPath.nodes[selectedNode].resources.map((resId) => (
                <ResourceItem key={resId} resId={resId} />
              ))}
            </ul>
          </div>

          {!isCompleted(learningPath.nodes[selectedNode].title) && (
            <button
              className="btn bg-blue-600 text-white mt-4"
              onClick={async () => {
                const token = localStorage.getItem("token");
                await fetch("http://localhost:5000/api/user/progress", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    nodeId: learningPath.nodes[selectedNode].title,
                  }),
                });

                // Refresh progress
                fetch("http://localhost:5000/api/user/progress", {
                  headers: { Authorization: `Bearer ${token}` },
                })
                  .then((res) => res.json())
                  .then((data) => setProgress(data.progress));
              }}
            >
              Mark as Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}


